import { m } from 'framer-motion';
import { ArrowDown, Download, Mail } from 'lucide-react';
import { profile } from '../data/portfolio';
import { GitHubIcon, LeetCodeIcon, LinkedInIcon } from './icons';
import { EASE } from './Reveal';

const resumeHref = `${import.meta.env.BASE_URL}${profile.resume}`;

/** Career milestones, rendered as records on a Kafka-style topic. */
const events = [
  { offset: 0, ts: '2023', key: 'education.enrolled', payload: '{ "degree": "B.E. CSE", "at": "Sahyadri" }' },
  { offset: 1, ts: '2025-09', key: 'internship.started', payload: '{ "company": "Datavex.ai", "role": "SWE Intern" }' },
  { offset: 2, ts: '2026-09', key: 'internship.completed', payload: '{ "duration_months": 12 }' },
  { offset: 3, ts: 'now', key: 'status.updated', payload: '{ "open_to": ["backend", "ai"] }' },
];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: EASE },
});

function EventLog() {
  return (
    <m.figure
      {...fadeUp(0.35)}
      className="card relative overflow-hidden font-mono text-[0.78rem] shadow-[0_1px_0_var(--line),0_24px_48px_-24px_rgb(0_0_0/0.25)]"
    >
      <div className="flex items-center justify-between border-b border-line px-4 py-3 text-muted">
        <span>
          topic: <span className="text-ink">rohith.timeline</span>
        </span>
        <span>partition 0</span>
      </div>
      <ol aria-label="Career timeline" className="divide-y divide-line">
        {events.map((e, i) => {
          const last = i === events.length - 1;
          return (
            <m.li
              key={e.offset}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.6 + i * 0.18, ease: EASE }}
              className={`grid grid-cols-[1.5rem_1fr] gap-x-3 px-4 py-3 ${last ? 'bg-accent-soft/60' : ''}`}
            >
              <span className="text-muted" aria-label={`offset ${e.offset}`}>
                {e.offset}
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <span className="font-medium text-accent-ink">{e.key}</span>
                  <span className="text-muted">{e.ts}</span>
                </div>
                <p className="mt-1 break-words text-ink-2">
                  {e.payload}
                  {last && (
                    <span
                      aria-hidden="true"
                      className="caret ml-1 inline-block h-3.5 w-1.5 translate-y-0.5 bg-accent"
                    />
                  )}
                </p>
              </div>
            </m.li>
          );
        })}
      </ol>
      <figcaption className="flex items-center justify-between border-t border-line px-4 py-2.5 text-[0.7rem] text-muted">
        <span>consumer lag: 0</span>
        <span>auto.offset.reset = earliest</span>
      </figcaption>
    </m.figure>
  );
}

export function Hero() {
  return (
    <section
      id="top"
      aria-label="Introduction"
      className="relative isolate overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28"
    >
      <div aria-hidden="true" className="blueprint blueprint-fade absolute inset-0 -z-10" />
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        <div>
          <m.p
            {...fadeUp(0)}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-sm text-ink-2"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            {profile.status}
          </m.p>

          {/* The LCP element: slides in but never starts transparent, so it paints immediately. */}
          <m.h1
            initial={{ y: 12 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mt-6 text-6xl leading-[0.92] font-extrabold tracking-[-0.035em] sm:text-7xl lg:text-8xl"
          >
            {profile.name}
          </m.h1>
          <m.p
            {...fadeUp(0.16)}
            className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink-2 sm:text-3xl"
          >
            {profile.role.split('&')[0]}
            <span className="text-accent">&amp;</span>
            {profile.role.split('&')[1]}
          </m.p>
          <m.p {...fadeUp(0.24)} className="mt-6 max-w-xl text-lg leading-relaxed text-ink-2">
            {profile.tagline}
          </m.p>

          <m.div {...fadeUp(0.32)} className="mt-9 flex flex-wrap gap-3">
            <a href="#projects" className="btn-primary">
              View projects
              <ArrowDown className="size-4" aria-hidden />
            </a>
            <a href={resumeHref} download className="btn-ghost">
              <Download className="size-4" aria-hidden />
              Download resume
            </a>
            <a href="#contact" className="btn-ghost">
              <Mail className="size-4" aria-hidden />
              Contact
            </a>
          </m.div>

          <m.ul
            {...fadeUp(0.4)}
            className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted"
            aria-label="Profiles"
          >
            <li>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-ink"
              >
                <GitHubIcon className="size-4" />
                {profile.githubUser}
              </a>
            </li>
            <li>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-ink"
              >
                <LinkedInIcon className="size-4" />
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href={profile.leetcode}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-ink"
              >
                <LeetCodeIcon className="size-4" />
                LeetCode
              </a>
            </li>
          </m.ul>
        </div>

        <EventLog />
      </div>
    </section>
  );
}
