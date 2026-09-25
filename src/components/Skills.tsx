import { Brain, Cloud, CodeXml, Cpu, Database, Server, type LucideIcon } from 'lucide-react';
import { skills, type SkillIcon } from '../data/portfolio';
import { Reveal } from './Reveal';
import { Section } from './Section';

const ICONS: Record<SkillIcon, LucideIcon> = {
  code: CodeXml,
  server: Server,
  brain: Brain,
  database: Database,
  cloud: Cloud,
  cpu: Cpu,
};

export function Skills() {
  return (
    <Section id="skills" index="02" title="Skills">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((group, i) => {
          const Icon = ICONS[group.icon];
          return (
            <Reveal
              as="li"
              key={group.category}
              delay={(i % 3) * 0.06}
              className="card group h-full p-6 transition-[border-color] duration-300 hover:border-ink/40"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-lg bg-accent-soft text-accent-ink transition-colors group-hover:bg-accent group-hover:text-on-accent">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="text-lg font-semibold tracking-tight">{group.category}</h3>
              </div>
              <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${group.category} skills`}>
                {group.items.map((s) => (
                  <li key={s} className="tag text-[0.78rem]">
                    {s}
                  </li>
                ))}
              </ul>
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
}
