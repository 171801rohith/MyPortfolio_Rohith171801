#!/usr/bin/env node
/**
 * Refreshes the generated data files the site reads at build time:
 *   src/data/github.json    from the GitHub REST API
 *   src/data/leetcode.json  from LeetCode's public GraphQL API (the one its profile page uses)
 *
 *   npm run fetch:github                          # both sources
 *   npm run fetch:github -- --github-only
 *   npm run fetch:github -- --leetcode-only
 *   GITHUB_TOKEN=ghp_xxx npm run fetch:github     # optional, lifts the 60 req/hour GitHub limit
 *
 * Each source is independent: if one fails, its existing JSON is left untouched
 * and the other still refreshes.
 *
 * Unauthenticated GitHub runs use roughly 2 + 2 × (number of repos) requests, which
 * fits inside the anonymous limit for ~25 repos.
 *
 * Language totals are aggregated in the site (src/lib/github.ts) so the ignore
 * list in src/data/portfolio.ts can change without re-fetching.
 */
import { writeFile, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const USERNAME = process.env.GITHUB_USERNAME || '171801rohith';
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
const LEETCODE_USERNAME = process.env.LEETCODE_USERNAME || 'hydumGoRFC';
const DATA_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/data');
const GITHUB_OUT = path.join(DATA_DIR, 'github.json');
const LEETCODE_OUT = path.join(DATA_DIR, 'leetcode.json');

// Forks that are genuine team projects (and so belong in stats and project cards).
const INCLUDE_FORKS = new Set(['Pravaah']);

const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': `${USERNAME}-portfolio-fetch`,
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
};

async function gh(url, { allow202 = false } = {}) {
  const res = await fetch(url.startsWith('http') ? url : `https://api.github.com${url}`, { headers });
  if (res.status === 403 || res.status === 429) {
    const reset = Number(res.headers.get('x-ratelimit-reset') || 0) * 1000;
    throw new Error(
      `rate limit hit${reset ? ` (resets ${new Date(reset).toLocaleTimeString()})` : ''}. ` +
        'Set GITHUB_TOKEN to raise the limit.',
    );
  }
  if (res.status === 202 && allow202) return { pending: true };
  if (res.status === 204) return null;
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** /stats/participation is computed lazily; GitHub answers 202 until it's ready. */
async function participation(repo) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const data = await gh(`/repos/${USERNAME}/${repo}/stats/participation`, { allow202: true });
    if (data && !data.pending) return data.owner ?? [];
    await sleep(1500 * (attempt + 1));
  }
  return [];
}

function mondayOf(date) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay();
  d.setUTCDate(d.getUTCDate() - ((day + 6) % 7));
  return d;
}

async function fetchGitHub() {
  console.log(`Fetching GitHub data for ${USERNAME}${TOKEN ? ' (authenticated)' : ''}…`);
  const user = await gh(`/users/${USERNAME}`);
  const rawRepos = await gh(`/users/${USERNAME}/repos?per_page=100&sort=pushed`);

  const repos = [];
  const weekly = new Array(52).fill(0);

  for (const r of rawRepos) {
    const relevant = (!r.fork || INCLUDE_FORKS.has(r.name)) && r.size > 0;
    let languages = {};
    let commits = [];
    if (relevant) {
      languages = (await gh(`/repos/${USERNAME}/${r.name}/languages`)) ?? {};
      commits = await participation(r.name);
      commits.forEach((c, i) => (weekly[i] += c));
    }
    repos.push({
      name: r.name,
      description: r.description,
      htmlUrl: r.html_url,
      homepage: r.homepage || null,
      language: r.language,
      languages,
      stars: r.stargazers_count,
      forks: r.forks_count,
      topics: r.topics ?? [],
      fork: r.fork,
      archived: r.archived,
      size: r.size,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      pushedAt: r.pushed_at,
      commitsLastYear: commits.reduce((a, b) => a + b, 0),
    });
    process.stdout.write('.');
  }
  process.stdout.write('\n');

  // participation.owner is oldest → newest, one entry per week ending this week.
  const thisMonday = mondayOf(new Date());
  const weeklyCommits = weekly.map((count, i) => {
    const d = new Date(thisMonday);
    d.setUTCDate(d.getUTCDate() - (51 - i) * 7);
    return { week: d.toISOString().slice(0, 10), count };
  });

  let longest = 0;
  let run = 0;
  for (const w of weeklyCommits) {
    run = w.count > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
  }

  const original = repos.filter((r) => !r.fork);
  const data = {
    generatedAt: new Date().toISOString(),
    user: {
      login: user.login,
      name: user.name,
      avatarUrl: user.avatar_url,
      htmlUrl: user.html_url,
      publicRepos: user.public_repos,
      followers: user.followers,
      createdAt: user.created_at,
    },
    stats: {
      totalRepos: repos.length,
      originalRepos: original.length,
      forkedRepos: repos.length - original.length,
      totalStars: original.reduce((a, r) => a + r.stars, 0),
      weeklyCommits,
      commitsLastYear: weekly.reduce((a, b) => a + b, 0),
      activeWeeks: weekly.filter((c) => c > 0).length,
      longestWeekStreak: longest,
    },
    repos,
  };

  await writeFile(GITHUB_OUT, JSON.stringify(data, null, 2) + '\n');
  console.log(
    `Wrote ${path.relative(process.cwd(), GITHUB_OUT)}: ${repos.length} repos, ` +
      `${data.stats.commitsLastYear} commits in the last 52 weeks.`,
  );
}

async function fetchLeetCode() {
  console.log(`Fetching LeetCode data for ${LEETCODE_USERNAME}…`);
  const query = `query ($u: String!) {
    allQuestionsCount { difficulty count }
    matchedUser(username: $u) {
      username
      profile { ranking }
      submitStatsGlobal { acSubmissionNum { difficulty count } }
      badges { displayName }
      userCalendar { streak totalActiveDays }
    }
  }`;
  const res = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Referer: `https://leetcode.com/u/${LEETCODE_USERNAME}/`,
      'User-Agent': 'portfolio-fetch',
    },
    body: JSON.stringify({ query, variables: { u: LEETCODE_USERNAME } }),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const { data, errors } = await res.json();
  if (errors?.length || !data?.matchedUser) throw new Error(errors?.[0]?.message ?? 'user not found');

  const u = data.matchedUser;
  const totals = Object.fromEntries(data.allQuestionsCount.map((q) => [q.difficulty, q.count]));
  const solved = Object.fromEntries(u.submitStatsGlobal.acSubmissionNum.map((q) => [q.difficulty, q.count]));
  const out = {
    generatedAt: new Date().toISOString(),
    username: u.username,
    profileUrl: `https://leetcode.com/u/${u.username}/`,
    solved: solved.All ?? 0,
    totalQuestions: totals.All ?? 0,
    difficulties: ['Easy', 'Medium', 'Hard'].map((d) => ({ name: d, solved: solved[d] ?? 0, total: totals[d] ?? 0 })),
    ranking: u.profile?.ranking ?? null,
    badges: (u.badges ?? []).map((b) => b.displayName),
    // userCalendar without a year argument covers the current year.
    calendarYear: new Date().getFullYear(),
    activeDays: u.userCalendar?.totalActiveDays ?? 0,
    maxStreak: u.userCalendar?.streak ?? 0,
  };
  await writeFile(LEETCODE_OUT, JSON.stringify(out, null, 2) + '\n');
  console.log(`Wrote ${path.relative(process.cwd(), LEETCODE_OUT)}: ${out.solved} problems solved.`);
}

async function run(name, file, fn) {
  try {
    await fn();
    return true;
  } catch (err) {
    console.error(`\n✖ ${name}: ${err.message}`);
    try {
      await readFile(file);
      console.error(`  Existing ${path.basename(file)} left unchanged.`);
    } catch {
      /* no existing file */
    }
    return false;
  }
}

const args = new Set(process.argv.slice(2));
const results = [];
if (!args.has('--leetcode-only')) results.push(await run('GitHub', GITHUB_OUT, fetchGitHub));
if (!args.has('--github-only')) results.push(await run('LeetCode', LEETCODE_OUT, fetchLeetCode));
if (results.includes(false)) process.exit(1);
