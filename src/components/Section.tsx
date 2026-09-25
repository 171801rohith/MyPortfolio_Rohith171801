import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

type Props = {
  id: string;
  index: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Section({ id, index, title, intro, children, className = '' }: Props) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`py-20 sm:py-28 ${className}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mb-10 flex items-center gap-4 sm:mb-14">
            <span className="font-mono text-sm text-accent-ink">{index}</span>
            <span aria-hidden="true" className="h-px w-8 bg-line" />
            <h2 id={`${id}-title`} className="text-3xl font-bold tracking-tight sm:text-4xl">
              {title}
            </h2>
            <span aria-hidden="true" className="h-px flex-1 bg-line" />
          </div>
          {intro && <p className="-mt-4 mb-10 max-w-2xl text-ink-2 sm:-mt-6 sm:mb-14">{intro}</p>}
        </Reveal>
        {children}
      </div>
    </section>
  );
}
