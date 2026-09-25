import { Briefcase, Sparkles } from 'lucide-react';
import { experience, profile } from '../data/portfolio';
import { Reveal } from './Reveal';
import { Section } from './Section';

export function Experience() {
  return (
    <Section id="experience" index="03" title="Experience">
      <ol className="relative ml-3 border-l border-line sm:ml-4">
        <Reveal as="li" className="relative pb-12 pl-8 sm:pl-12">
          <span className="absolute top-0.5 -left-[13px] grid size-6 place-items-center rounded-full bg-accent text-on-accent ring-4 ring-paper">
            <Sparkles className="size-3.5" aria-hidden />
          </span>
          <p className="font-mono text-xs tracking-wider text-accent-ink uppercase">Now</p>
          <p className="mt-1 font-display text-xl font-semibold tracking-tight">{profile.status}</p>
        </Reveal>

        {experience.map((job) => (
          <Reveal as="li" key={job.company} className="relative pb-4 pl-8 sm:pl-12">
            <span className="absolute top-0.5 -left-[13px] grid size-6 place-items-center rounded-full border border-line bg-surface text-ink ring-4 ring-paper">
              <Briefcase className="size-3.5" aria-hidden />
            </span>
            <p className="font-mono text-xs tracking-wider text-muted uppercase">
              <time>{job.start}</time> – <time>{job.end}</time> · {job.kind}
            </p>
            <article className="card mt-3 p-6 sm:p-8">
              <header>
                <h3 className="text-2xl font-bold tracking-tight">{job.role}</h3>
                <p className="mt-1 text-ink-2">{job.company}</p>
              </header>
              <ul className="mt-6 space-y-3.5">
                {job.points.map((pt, i) => (
                  <li key={i} className="grid grid-cols-[auto_1fr] gap-3 leading-relaxed text-ink-2">
                    <span aria-hidden="true" className="mt-[0.7em] h-px w-3 bg-accent" />
                    {pt}
                  </li>
                ))}
              </ul>
              <ul className="mt-6 flex flex-wrap gap-2 border-t border-line pt-6" aria-label="Tech stack">
                {job.stack.map((t) => (
                  <li key={t} className="tag">
                    {t}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
