import raw from '../data/github.json';
import { githubStats } from '../data/portfolio';

export type Repo = {
  name: string;
  description: string | null;
  htmlUrl: string;
  homepage: string | null;
  language: string | null;
  languages: Record<string, number>;
  stars: number;
  forks: number;
  topics: string[];
  fork: boolean;
  archived: boolean;
  size: number;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  commitsLastYear: number;
};

type GitHubData = {
  generatedAt: string;
  user: {
    login: string;
    name: string;
    avatarUrl: string;
    htmlUrl: string;
    publicRepos: number;
    followers: number;
    createdAt: string;
  };
  stats: {
    totalRepos: number;
    originalRepos: number;
    forkedRepos: number;
    totalStars: number;
    weeklyCommits: { week: string; count: number }[];
    commitsLastYear: number;
    activeWeeks: number;
    longestWeekStreak: number;
  };
  repos: Repo[];
};

// JSON imports infer overly narrow per-repo shapes, so widen through unknown.
export const github = raw as unknown as GitHubData;

const byName = new Map(github.repos.map((r) => [r.name, r]));
export const findRepo = (name: string) => byName.get(name);

export type LanguageShare = { name: string; bytes: number; share: number };

/** Top languages by bytes across original work, with the rest folded into "Other". */
export function topLanguages(): LanguageShare[] {
  const ignoreRepos = new Set(githubStats.languageIgnoreRepos);
  const ignoreLangs = new Set(githubStats.languageIgnore);
  const totals = new Map<string, number>();
  for (const repo of github.repos) {
    if (ignoreRepos.has(repo.name)) continue;
    for (const [lang, bytes] of Object.entries(repo.languages)) {
      if (ignoreLangs.has(lang)) continue;
      totals.set(lang, (totals.get(lang) ?? 0) + bytes);
    }
  }
  const sorted = [...totals.entries()].sort((a, b) => b[1] - a[1]);
  const sum = sorted.reduce((a, [, b]) => a + b, 0) || 1;
  const top = sorted.slice(0, githubStats.topN).map(([name, bytes]) => ({ name, bytes, share: bytes / sum }));
  const rest = sorted.slice(githubStats.topN).reduce((a, [, b]) => a + b, 0);
  if (rest > 0) top.push({ name: 'Other', bytes: rest, share: rest / sum });
  return top;
}

export const formatBytes = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)} MB` : n >= 1000 ? `${Math.round(n / 1000)} KB` : `${n} B`;

export const formatMonth = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
