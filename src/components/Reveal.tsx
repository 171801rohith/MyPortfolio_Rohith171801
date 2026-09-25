import { m } from 'framer-motion';
import type { ReactNode } from 'react';

export const EASE = [0.22, 1, 0.36, 1] as const;

type Props = { children: ReactNode; delay?: number; className?: string; as?: 'div' | 'li' };

/** Fades content up once as it scrolls into view. Honors reduced motion via MotionConfig. */
export function Reveal({ children, delay = 0, className, as = 'div' }: Props) {
  const Tag = as === 'li' ? m.li : m.div;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -80px 0px' }}
      transition={{ duration: 0.55, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}
