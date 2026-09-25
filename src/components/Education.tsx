import { Award, GraduationCap } from 'lucide-react';
import { certifications, education } from '../data/portfolio';
import { Reveal } from './Reveal';
import { Section } from './Section';

export function Education() {
  const hasCerts = certifications.length > 0;
  return (
    <Section id="education" index="06" title={hasCerts ? 'Education & Certifications' : 'Education'}>
      <div className={`grid gap-4 ${hasCerts ? 'lg:grid-cols-2' : ''}`}>
        {education.map((e) => (
          <Reveal key={e.degree}>
            <article className="card flex flex-col gap-5 p-6 sm:flex-row sm:items-start sm:p-8">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-ink">
                <GraduationCap className="size-6" aria-hidden />
              </span>
              <div className="flex-1">
                <p className="font-mono text-xs tracking-wider text-muted uppercase">
                  {e.start} – {e.end}
                </p>
                <h3 className="mt-1.5 text-xl font-bold tracking-tight sm:text-2xl">{e.degree}</h3>
                <p className="mt-1 text-ink-2">{e.school}</p>
              </div>
              <p className="self-start rounded-lg border border-line px-3 py-1.5 font-mono text-sm text-ink">
                {e.detail}
              </p>
            </article>
          </Reveal>
        ))}

        {hasCerts && (
          <Reveal delay={0.1}>
            <ul className="card divide-y divide-line">
              {certifications.map((c) => (
                <li key={c.name} className="flex items-start gap-4 p-5">
                  <Award className="mt-0.5 size-5 shrink-0 text-accent-ink" aria-hidden />
                  <div>
                    <p className="font-medium">
                      {c.url ? (
                        <a href={c.url} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">
                          {c.name}
                        </a>
                      ) : (
                        c.name
                      )}
                    </p>
                    <p className="text-sm text-muted">
                      {c.issuer} · {c.year}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </Section>
  );
}
