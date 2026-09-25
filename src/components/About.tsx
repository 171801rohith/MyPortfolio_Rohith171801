import { about } from '../data/portfolio';
import { Reveal } from './Reveal';
import { Section } from './Section';

export function About() {
  return (
    <Section id="about" index="01" title="About">
      <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
        <Reveal className="space-y-5 text-lg leading-relaxed text-ink-2">
          {about.paragraphs.map((p, i) => (
            <p key={i} className={i === 0 ? 'text-xl text-ink sm:text-2xl sm:leading-snug' : ''}>
              {p}
            </p>
          ))}
        </Reveal>
        <Reveal delay={0.1}>
          <dl className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3 lg:grid-cols-1">
            {about.facts.map((f) => (
              <div key={f.label} className="bg-surface p-5">
                <dt className="eyebrow">{f.label}</dt>
                <dd className="mt-2 font-display text-3xl font-bold tracking-tight">{f.value}</dd>
                <dd className="mt-1 text-sm text-muted">{f.note}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  );
}
