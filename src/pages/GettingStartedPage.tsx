import { Link } from 'react-router-dom'
import { CheckCircle2, Terminal, BookOpen, Settings2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const commands = [
  {
    cmd: 'npm ci',
    note: 'Clean install from the lockfile (preferred after clone).',
  },
  {
    cmd: 'npm run dev',
    note: 'Start the app (this page) at http://localhost:5173',
  },
  {
    cmd: 'npm run storybook',
    note: 'Component library at http://localhost:6006',
  },
  {
    cmd: 'npm run build',
    note: 'Production build into dist/',
  },
  {
    cmd: 'npm run lint',
    note: 'Run Oxlint on the project.',
  },
  {
    cmd: 'git checkout -b feat/… && git push -u origin HEAD',
    note: 'Share work on a branch — not main. Cloudflare builds a preview URL.',
  },
] as const

const urls = [
  { href: '/', label: 'Welcome / casino shell' },
  { href: '/docs', label: 'Design-system docs' },
  { href: '/cms', label: 'Mission Control CMS' },
] as const

export function GettingStartedPage() {
  return (
    <div className="flex flex-col gap-10">
      <section className="relative overflow-hidden rounded-xl bg-card px-6 py-10 xl:px-10 xl:py-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-35"
          style={{
            background:
              'radial-gradient(ellipse at 15% 0%, var(--success) 0%, transparent 50%), radial-gradient(ellipse at 95% 70%, var(--primary) 0%, transparent 45%)',
          }}
        />
        <div className="relative flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="success" className="gap-1.5">
              <CheckCircle2 className="size-3.5" aria-hidden />
              You&apos;re up
            </Badge>
            <Badge variant="outline">Developer onboarding</Badge>
          </div>
          <h1 className="max-w-2xl text-3xl font-semibold tracking-tight xl:text-4xl">
            Setup succeeded
          </h1>
          <p className="max-w-xl text-base text-foreground/75">
            Dependencies are installed and the Vite dev server is running. Use
            this page as a short cheat sheet — or ask your AI editor{' '}
            <span className="font-medium text-foreground">“start me up”</span>{' '}
            anytime after a fresh clone.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Button asChild size="lg">
              <Link to="/">Open the demo</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link to="/docs">Browse docs</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Terminal className="size-5 text-primary" aria-hidden />
          <h2 className="text-lg font-semibold tracking-tight">
            Commands you&apos;ll use
          </h2>
        </div>
        <ul className="divide-y divide-border-muted overflow-hidden rounded-xl border border-border-muted bg-card">
          {commands.map((row) => (
            <li
              key={row.cmd}
              className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:gap-6"
            >
              <code className="shrink-0 font-mono text-sm text-secondary">
                {row.cmd}
              </code>
              <span className="text-sm text-foreground/70">{row.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <BookOpen className="size-5 text-primary" aria-hidden />
          <h2 className="text-lg font-semibold tracking-tight">Key places</h2>
        </div>
        <ul className="flex flex-col gap-2 text-sm">
          {urls.map((u) => (
            <li key={u.href}>
              <Link
                to={u.href}
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                {u.href === '/' ? '/' : u.href}
              </Link>
              <span className="text-foreground/60"> — {u.label}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-foreground/65">
          Mission Control passcode:{' '}
          <code className="rounded bg-background-subtle px-1.5 py-0.5 font-mono text-xs">
            blixx
          </code>
        </p>
      </section>

      <section className="flex flex-col gap-3 border-t border-border-muted pt-8">
        <div className="flex items-center gap-2">
          <Settings2 className="size-5 text-primary" aria-hidden />
          <h2 className="text-lg font-semibold tracking-tight">
            AI-assisted setup
          </h2>
        </div>
        <p className="max-w-2xl text-sm leading-relaxed text-foreground/75">
          This repo ships agent instructions in{' '}
          <code className="rounded bg-background-subtle px-1.5 py-0.5 font-mono text-xs">
            AGENTS.md
          </code>{' '}
          /{' '}
          <code className="rounded bg-background-subtle px-1.5 py-0.5 font-mono text-xs">
            CLAUDE.md
          </code>{' '}
          and a{' '}
          <code className="rounded bg-background-subtle px-1.5 py-0.5 font-mono text-xs">
            start-me-up
          </code>{' '}
          skill for Cursor and Claude Code. After cloning, open the project in
          your editor and ask the agent to start you up — it will install
          packages, run the dev server, and send you here.
        </p>
        <p className="max-w-2xl text-sm leading-relaxed text-foreground/75">
          For GitHub basics and how to share a{' '}
          <strong className="font-medium text-foreground">
            testing URL without pushing to main
          </strong>
          , see the README sections{' '}
          <em>Using GitHub</em> and <em>Publish a testing URL</em> in the repo
          root.
        </p>
      </section>
    </div>
  )
}
