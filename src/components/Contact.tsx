import { useState } from 'react';
import { ArrowUpRight, Check, Copy, Mail } from 'lucide-react';
import { profile } from '../data/portfolio';
import { GitHubIcon, LeetCodeIcon, LinkedInIcon } from './icons';
import { Reveal } from './Reveal';
import { Section } from './Section';

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const links = [
    { href: profile.linkedin, label: 'LinkedIn', detail: 'Rohith M', Icon: LinkedInIcon },
    { href: profile.github, label: 'GitHub', detail: profile.githubUser, Icon: GitHubIcon },
    { href: profile.leetcode, label: 'LeetCode', detail: profile.leetcodeUser, Icon: LeetCodeIcon },
  ];

  return (
    <Section id="contact" index="07" title="Contact">
      <Reveal>
        <div className="card relative isolate overflow-hidden p-6 sm:p-12">
          <div aria-hidden="true" className="blueprint absolute inset-0 -z-10 opacity-70" />
          <h3 className="max-w-3xl text-4xl leading-[1.02] font-extrabold tracking-[-0.03em] sm:text-6xl">
            Have a backend or AI role in mind? <span className="text-accent">Let's talk.</span>
          </h3>
          <p className="mt-5 max-w-xl text-lg text-ink-2">
            Email is the quickest way to reach me. I'm happy to talk about roles, projects, or anything on this page.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href={`mailto:${profile.email}`} className="btn-accent px-5 py-3 text-base">
              <Mail className="size-5" aria-hidden />
              {profile.email}
            </a>
            <button type="button" onClick={copy} className="btn-ghost py-3">
              {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
              {copied ? 'Copied' : 'Copy email'}
            </button>
            <span role="status" className="sr-only">
              {copied ? 'Email address copied to clipboard' : ''}
            </span>
          </div>

          <ul className="mt-10 grid gap-3 sm:grid-cols-3">
            {links.map(({ href, label, detail, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-4 rounded-xl border border-line bg-surface p-4 transition-colors hover:border-ink"
                >
                  <Icon className="size-6" />
                  <span className="flex-1">
                    <span className="block font-medium">{label}</span>
                    <span className="block font-mono text-xs text-muted">{detail}</span>
                  </span>
                  <ArrowUpRight
                    className="size-5 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                    aria-hidden
                  />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}
