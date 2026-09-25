import { useState } from 'react';
import { ArrowUpRight, Award, CalendarDays, Flame } from 'lucide-react';
import { profile } from '../data/portfolio';
import { formatBytes, github, topLanguages } from '../lib/github';
import { leetcode } from '../lib/leetcode';
import { GitHubIcon, LeetCodeIcon } from './icons';
import { Reveal } from './Reveal';
import { Section } from './Section';

const { stats } = github;
const languages = topLanguages();
const weeks = stats.weeklyCommits;
const maxWeek = Math.max(1, ...weeks.map((w) => w.count));
const busiest = weeks.reduce((a, b) => (b.count > a.count ? b : a), weeks[0]);

const fmtWeek = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
const fmtMonth = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' });
const pct = (x: number) => (x >= 0.1 ? `${Math.round(x * 100)}%` : `${(x * 100).toFixed(1)}%`);

// One-hue sequential ramp: mixing the accent toward the card surface means
// low values sit near the surface in both themes (light→dark in light mode,
// dark→bright in dark mode).
const LEVELS = [
  'var(--surface-2)',
  'color-mix(in oklab, var(--accent) 28%, var(--surface))',
  'color-mix(in oklab, var(--accent) 52%, var(--surface))',
  'color-mix(in oklab, var(--accent) 76%, var(--surface))',
  'var(--accent)',
];
const level = (c: number) => (c === 0 ? 0 : Math.min(4, Math.ceil((c / maxWeek) * 4)));

function Tiles() {
  const tiles = [
    {
      label: 'Public repositories',
      value: github.user.publicRepos,
      note: `${stats.originalRepos} original · ${stats.forkedRepos} team forks`,
    },
    { label: 'Commits, last 52 weeks', value: stats.commitsLastYear, note: 'to default branches of public repos' },
    { label: 'Active weeks', value: `${stats.activeWeeks}/52`, note: 'weeks with at least one commit' },
    { label: 'Longest streak', value: `${stats.longestWeekStreak} wks`, note: 'consecutive active weeks' },
  ];
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4">
      {tiles.map((t) => (
        <div key={t.label} className="bg-surface p-5 sm:p-6">
          <dt className="text-sm text-muted">{t.label}</dt>
          <dd className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {t.value.toLocaleString()}
          </dd>
          <dd className="mt-1 text-xs text-muted">{t.note}</dd>
        </div>
      ))}
    </dl>
  );
}

function TableToggle({ caption, head, rows }: { caption: string; head: [string, string]; rows: [string, string][] }) {
  // Rows are only rendered once opened, keeping the initial DOM small.
  const [open, setOpen] = useState(false);
  return (
    <details className="mt-5 text-sm" onToggle={(e) => setOpen(e.currentTarget.open)}>
      <summary className="cursor-pointer text-muted transition-colors select-none hover:text-ink">
        View as table
      </summary>
      {open && (
        <div className="mt-3 max-h-64 overflow-auto rounded-lg border border-line">
          <table className="w-full text-left">
            <caption className="sr-only">{caption}</caption>
            <thead className="sticky top-0 bg-surface-2 font-mono text-xs text-muted">
              <tr>
                <th scope="col" className="px-3 py-2 font-medium">
                  {head[0]}
                </th>
                <th scope="col" className="px-3 py-2 text-right font-medium">
                  {head[1]}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map(([a, b]) => (
                <tr key={a}>
                  <td className="px-3 py-1.5">{a}</td>
                  <td className="px-3 py-1.5 text-right font-mono tabular-nums">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </details>
  );
}

function LanguageChart() {
  const max = Math.max(...languages.map((l) => l.share));
  return (
    <div className="card h-full p-6 sm:p-7">
      <h3 className="text-lg font-semibold tracking-tight">Top languages</h3>
      <p className="mt-1 text-sm text-muted">Share of code across my original repositories</p>
      <ul className="mt-6 space-y-3.5" aria-hidden="true">
        {languages.map((l) => (
          <li key={l.name} className="group grid grid-cols-[5.5rem_1fr_2.75rem] items-center gap-3 text-sm">
            <span className="truncate text-ink-2">{l.name}</span>
            {/* Bar length is strictly proportional to share (longest bar = full track). */}
            <div className="relative">
              <div
                className="h-3 rounded-r-[4px] transition-opacity group-hover:opacity-80"
                style={{
                  width: `${(l.share / max) * 100}%`,
                  minWidth: 3,
                  background: l.name === 'Other' ? 'var(--muted)' : 'var(--accent)',
                }}
              />
              <span className="pointer-events-none absolute bottom-full left-0 z-10 mb-2 hidden rounded-md bg-ink px-2 py-1 font-mono text-xs whitespace-nowrap text-paper shadow-lg group-hover:block">
                {l.name} · {formatBytes(l.bytes)} · {pct(l.share)}
              </span>
            </div>
            <span className="text-right font-mono text-xs text-muted tabular-nums">{pct(l.share)}</span>
          </li>
        ))}
      </ul>
      <TableToggle
        caption="Top languages by bytes of code"
        head={['Language', 'Share']}
        rows={languages.map((l) => [l.name, `${pct(l.share)} (${formatBytes(l.bytes)})`])}
      />
    </div>
  );
}

/** Column index of each month's first week, dropping any label that would collide with the next one. */
function monthLabels(slice: { week: string }[]) {
  const starts = slice
    .map((w, i) => ({ i, label: fmtMonth(w.week) }))
    .filter(({ i, label }) => i === 0 || fmtMonth(slice[i - 1].week) !== label);
  return starts.filter((s, k) => {
    const next = starts[k + 1];
    return next ? next.i - s.i >= 3 : slice.length - s.i >= 3;
  });
}

function Strip({ from, to }: { from: number; to: number }) {
  const slice = weeks.slice(from, to);
  const n = slice.length;
  return (
    <div>
      <div className="grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
        {slice.map((w, i) => {
          const align = i < 4 ? 'left-0' : i > n - 5 ? 'right-0' : 'left-1/2 -translate-x-1/2';
          return (
            <div key={w.week} className="group relative">
              <div
                className="aspect-[1/1.6] rounded-[3px] transition-transform group-hover:scale-y-110"
                style={{ background: LEVELS[level(w.count)] }}
              />
              <span
                className={`pointer-events-none absolute bottom-full z-10 mb-2 rounded-md bg-ink px-2 py-1 font-mono text-xs whitespace-nowrap text-paper hidden shadow-lg group-hover:block ${align}`}
              >
                {w.count} commit{w.count === 1 ? '' : 's'} · week of {fmtWeek(w.week)}
              </span>
            </div>
          );
        })}
      </div>
      <div
        className="mt-2 grid gap-[3px] font-mono text-[0.65rem] text-muted"
        style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
      >
        {monthLabels(slice).map(({ i, label }) => (
          <span key={i} style={{ gridRow: 1, gridColumn: `${i + 1} / span 3` }}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function ActivityChart() {
  return (
    <div className="card h-full p-6 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">Weekly commits</h3>
          <p className="mt-1 text-sm text-muted">Last 52 weeks across my public repositories</p>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[0.65rem] text-muted" aria-hidden="true">
          Less
          {LEVELS.map((c) => (
            <span key={c} className="size-3 rounded-[3px]" style={{ background: c }} />
          ))}
          More
        </div>
      </div>

      <div className="mt-8" aria-hidden="true">
        <div className="hidden sm:block">
          <Strip from={0} to={52} />
        </div>
        <div className="space-y-4 sm:hidden">
          <Strip from={0} to={26} />
          <Strip from={26} to={52} />
        </div>
      </div>

      <p className="mt-6 text-sm text-ink-2">
        <span className="font-semibold text-ink">{stats.commitsLastYear.toLocaleString()} commits</span> in the last
        year, active in {stats.activeWeeks} of 52 weeks. Busiest week: {fmtWeek(busiest.week)} with {busiest.count}{' '}
        commits.
      </p>

      <TableToggle
        caption="Commits per week over the last 52 weeks"
        head={['Week of', 'Commits']}
        rows={[...weeks].reverse().map((w) => [fmtWeek(w.week), String(w.count)])}
      />
    </div>
  );
}

function LeetCodeCard() {
  const facts = [
    { Icon: CalendarDays, label: `${leetcode.activeDays} active days in ${leetcode.calendarYear}` },
    { Icon: Flame, label: `${leetcode.maxStreak}-day max streak` },
    ...(leetcode.badges[0] ? [{ Icon: Award, label: leetcode.badges[0] }] : []),
  ];
  return (
    <div className="card grid gap-8 p-6 sm:p-7 md:grid-cols-[auto_1fr] lg:grid-cols-[14rem_1fr_auto] lg:items-center lg:gap-10">
      <div>
        <div className="flex items-center gap-2.5">
          <LeetCodeIcon className="size-5" />
          <h3 className="text-lg font-semibold tracking-tight">LeetCode</h3>
        </div>
        <p className="mt-4 font-display text-5xl font-bold tracking-tight">{leetcode.solved.toLocaleString()}</p>
        <p className="mt-1 text-sm text-muted">problems solved</p>
      </div>

      {/* Meters: solved out of available, per difficulty. Track is a lighter step of the fill's hue. */}
      <ul className="space-y-4">
        {leetcode.difficulties.map((d) => (
          <li key={d.name} className="text-sm">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-ink-2">{d.name}</span>
              <span className="font-mono text-xs text-muted tabular-nums">
                <span className="text-ink">{d.solved}</span> / {d.total.toLocaleString()}
              </span>
            </div>
            <div
              className="mt-1.5 h-2 overflow-hidden rounded-full"
              style={{ background: 'color-mix(in oklab, var(--accent) 16%, var(--surface))' }}
              role="meter"
              aria-label={`${d.name} problems solved`}
              aria-valuemin={0}
              aria-valuemax={d.total}
              aria-valuenow={d.solved}
            >
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: `${Math.max(1, (d.solved / d.total) * 100)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-3 md:col-span-2 lg:col-span-1">
        <ul className="space-y-2.5 text-sm text-ink-2">
          {facts.map(({ Icon, label }) => (
            <li key={label} className="flex items-center gap-2.5">
              <Icon className="size-4 text-accent-ink" aria-hidden />
              {label}
            </li>
          ))}
        </ul>
        <a
          href={leetcode.profileUrl}
          target="_blank"
          rel="noreferrer"
          className="group mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-ink underline-offset-4 hover:underline"
        >
          View profile
          <ArrowUpRight
            className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden
          />
          <span className="sr-only">on LeetCode (opens in a new tab)</span>
        </a>
      </div>
    </div>
  );
}

export function GitHubStats() {
  return (
    <Section
      id="github"
      index="05"
      title="GitHub & LeetCode"
      intro={
        <>
          Pulled from the GitHub and LeetCode APIs by{' '}
          <code className="font-mono text-[0.9em] text-ink">scripts/fetch-github.js</code>, so these numbers stay
          honest.
        </>
      }
    >
      <div className="space-y-4">
        <Reveal>
          <Tiles />
        </Reveal>
        <div className="grid gap-4 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <LanguageChart />
          </Reveal>
          <Reveal className="lg:col-span-3" delay={0.08}>
            <ActivityChart />
          </Reveal>
        </div>
        <Reveal>
          <LeetCodeCard />
        </Reveal>
        <Reveal>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 text-sm text-ink-2 transition-colors hover:text-ink"
          >
            <GitHubIcon className="size-4" />
            See everything on github.com/{profile.githubUser}
            <ArrowUpRight
              className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden
            />
          </a>
        </Reveal>
      </div>
    </Section>
  );
}
