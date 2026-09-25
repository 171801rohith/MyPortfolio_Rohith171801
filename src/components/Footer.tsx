import { ArrowUp } from 'lucide-react';
import { profile } from '../data/portfolio';
import { github } from '../lib/github';
import { leetcode } from '../lib/leetcode';

export function Footer() {
  // Data files are only rewritten when a number changes, so this is "last changed".
  const latest = Math.max(Date.parse(github.generatedAt), Date.parse(leetcode.generatedAt));
  const refreshed = new Date(latest).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          © {new Date().getFullYear()} {profile.name}. Built with React, Tailwind CSS and Framer Motion.
        </p>
        <div className="flex items-center gap-5">
          <span className="font-mono text-xs">Stats updated {refreshed}</span>
          <a href="#top" className="inline-flex items-center gap-1.5 transition-colors hover:text-ink">
            Back to top
            <ArrowUp className="size-4" aria-hidden />
          </a>
        </div>
      </div>
    </footer>
  );
}
