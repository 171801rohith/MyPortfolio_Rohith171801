import { useMemo, useState } from 'react';
import { m } from 'framer-motion';
import { ArrowUpRight, Star } from 'lucide-react';
import { projectFilters, projects, profile, type Project } from '../data/portfolio';
import { findRepo, formatMonth } from '../lib/github';
import { GitHubIcon } from './icons';
import { EASE } from './Reveal';
import { Section } from './Section';

function ProjectCard({ project, index, order }: { project: Project; index: number; order: number }) {
  const repo = findRepo(project.repo);
  const repoUrl = project.repoUrl ?? repo?.htmlUrl ?? `${profile.github}/${project.repo}`;
  const demo = project.demo ?? repo?.homepage ?? undefined;
  const featured = project.featured;
  const titleId = `project-${project.repo}`;

  return (
    <m.article
      aria-labelledby={titleId}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.45, delay: (order % 2) * 0.06, ease: EASE }}
      className={`card group relative flex flex-col p-6 transition-[border-color,box-shadow] duration-300 hover:border-ink/40 hover:shadow-[0_18px_40px_-24px_rgb(0_0_0/0.35)] sm:p-7 ${
        featured ? 'md:col-span-2 lg:grid lg:grid-cols-[1.25fr_1fr] lg:gap-10 lg:p-9' : ''
      }`}
    >
      <div className="flex flex-col">
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted">
          <span className="text-accent-ink">{String(index + 1).padStart(2, '0')}</span>
          <span aria-hidden="true">/</span>
          <span>{repo?.language ?? project.tags[0]}</span>
          {repo && (
            <>
              <span aria-hidden="true">·</span>
              <span>updated {formatMonth(repo.pushedAt)}</span>
            </>
          )}
          {repo && repo.stars > 0 && (
            <span className="inline-flex items-center gap-1" aria-label={`${repo.stars} stars`}>
              <span aria-hidden="true">·</span>
              <Star className="size-3.5" aria-hidden />
              {repo.stars}
            </span>
          )}
          {project.badge && (
            <span className="ml-auto rounded-full bg-accent-soft px-2.5 py-0.5 text-accent-ink">{project.badge}</span>
          )}
        </div>

        <h3 id={titleId} className={`mt-4 font-bold tracking-tight ${featured ? 'text-3xl sm:text-4xl' : 'text-2xl'}`}>
          {project.title}
        </h3>
        <p className="mt-1 text-ink-2">{project.subtitle}</p>
        <p className={`mt-4 leading-relaxed text-ink-2 ${featured ? 'text-[1.05rem]' : 'text-[0.95rem]'}`}>
          {project.summary}
        </p>

        <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Tech stack">
          {project.tags.map((t) => (
            <li key={t} className="tag">
              {t}
            </li>
          ))}
        </ul>

        <div className={`flex flex-wrap gap-2 pt-6 mt-auto`}>
          <a href={repoUrl} target="_blank" rel="noreferrer" className="btn-ghost !py-2">
            <GitHubIcon className="size-4" />
            Source
            <span className="sr-only">code for {project.title} (opens in a new tab)</span>
          </a>
          {demo && (
            <a href={demo} target="_blank" rel="noreferrer" className="btn-primary !py-2">
              Live demo
              <ArrowUpRight className="size-4" aria-hidden />
              <span className="sr-only">of {project.title} (opens in a new tab)</span>
            </a>
          )}
        </div>
      </div>

      {featured && project.highlights && (
        <div className="mt-8 border-t border-line pt-6 lg:mt-0 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
          <p className="eyebrow">Highlights</p>
          <ul className="mt-4 space-y-3.5">
            {project.highlights.map((h) => (
              <li key={h} className="grid grid-cols-[auto_1fr] gap-3 text-[0.95rem] leading-relaxed text-ink-2">
                <span aria-hidden="true" className="mt-[0.55em] size-1.5 rotate-45 bg-accent" />
                {h}
              </li>
            ))}
          </ul>
        </div>
      )}
    </m.article>
  );
}

export function Projects() {
  const [filter, setFilter] = useState('All');
  const visible = useMemo(
    () => (filter === 'All' ? projects : projects.filter((p) => p.filters.includes(filter))),
    [filter],
  );
  const counts = useMemo(
    () =>
      Object.fromEntries(
        projectFilters.map((f) => [
          f,
          f === 'All' ? projects.length : projects.filter((p) => p.filters.includes(f)).length,
        ]),
      ),
    [],
  );

  return (
    <Section
      id="projects"
      index="04"
      title="Projects"
      intro="A selection of what I've built. The first three are the ones I'd walk you through in an interview."
    >
      <div
        role="group"
        aria-label="Filter projects by technology"
        className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {projectFilters.map((f) => {
          const active = f === filter;
          return (
            <button
              key={f}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(f)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
                active
                  ? 'border-ink bg-ink text-paper'
                  : 'border-line bg-surface text-ink-2 hover:border-ink hover:text-ink'
              }`}
            >
              {f}
              <span className={`font-mono text-xs ${active ? 'text-paper/70' : 'text-muted'}`}>{counts[f]}</span>
            </button>
          );
        })}
      </div>
      <p className="sr-only" role="status">
        Showing {visible.length} of {projects.length} projects
      </p>

      {/* Re-keyed per filter so the matching cards animate in fresh. */}
      <div key={filter} className="grid gap-4 md:grid-cols-2">
        {visible.map((p, i) => (
          <ProjectCard key={p.repo} project={p} index={projects.indexOf(p)} order={i} />
        ))}
      </div>
    </Section>
  );
}
