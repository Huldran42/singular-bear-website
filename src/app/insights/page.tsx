import type { ReactNode } from 'react';
import { InsightsLogoutButton } from '@/features/insights/logout-button';
import {
  insightsDatabaseConfigured,
  readInsights,
} from '@/lib/insights/store';
import { formatDuration, summarizeInsights } from '@/lib/insights/summary';

export const metadata = {
  title: 'Insights',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function InsightsPage() {
  const neon = insightsDatabaseConfigured();
  const summary = summarizeInsights(await readInsights());
  const maxHour = Math.max(1, ...summary.hours);

  return (
    <main className="min-h-[100dvh] bg-studio-bg px-5 py-10 text-studio-text sm:px-8">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-sm text-studio-accent">Private</p>
            <h1 className="font-heading mt-2 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Insights
            </h1>
            <p className="mt-2 text-sm text-studio-muted">
              Today + last 7 days. Anonymous visitors, first-party only.
              {neon
                ? ' Stored on Neon.'
                : ' Local file for now — connect Neon via Vercel when you can.'}
            </p>
          </div>
          <InsightsLogoutButton />
        </div>

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Sessions today" value={String(summary.today.sessions)} />
          <Stat label="Visitors today" value={String(summary.today.visitors)} />
          <Stat label="Avg. time" value={formatDuration(summary.today.avgMs)} />
          <Stat label="Bounce" value={`${summary.today.bounce}%`} />
        </section>
        <p className="mt-3 text-xs text-studio-subtle">
          7 days: {summary.week.sessions} sessions · {summary.week.visitors}{' '}
          visitors · {summary.week.returning} returning
        </p>

        <Panel title="What to do next" className="mt-10">
          {summary.recommendations.length === 0 ? (
            <Empty />
          ) : (
            <ul className="grid gap-3">
              {summary.recommendations.map((row) => (
                <li
                  key={row.text}
                  className="rounded-[16px] border border-studio-line bg-studio-surface px-4 py-3 text-sm leading-relaxed"
                >
                  <span
                    className={
                      row.tone === 'hot'
                        ? 'font-semibold text-studio-accent'
                        : row.tone === 'cold'
                          ? 'font-semibold text-studio-muted'
                          : 'font-semibold text-studio-text'
                    }
                  >
                    {row.tone === 'hot'
                      ? 'Keep'
                      : row.tone === 'cold'
                        ? 'Watch'
                        : 'Fix'}
                    {' · '}
                  </span>
                  {row.text}
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Funnel (7 days)" className="mt-10">
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {summary.funnel.map((step) => (
              <li
                key={step.label}
                className="rounded-[16px] border border-studio-line bg-studio-surface px-4 py-3"
              >
                <p className="text-xs tracking-[0.12em] text-studio-subtle uppercase">
                  {step.label}
                </p>
                <p className="font-heading mt-1 text-2xl font-semibold">
                  {step.count}
                </p>
              </li>
            ))}
          </ul>
        </Panel>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <Panel title="Products people actually stay on">
            {summary.products.length === 0 ? (
              <Empty />
            ) : (
              <ul className="grid gap-3 text-sm">
                {summary.products.map((row) => (
                  <li key={row.slug}>
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium">{row.title}</span>
                      <span className="font-mono text-studio-muted">
                        {row.views} views
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-studio-subtle">
                      {formatDuration(row.time)} on page · {row.demo} demo ·{' '}
                      {row.store} Asset Store
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Clicks">
            {summary.clicks.length === 0 ? (
              <Empty />
            ) : (
              <ul className="grid gap-2 text-sm">
                {summary.clicks.map((row) => (
                  <li
                    key={row.name}
                    className="flex items-center justify-between gap-4"
                  >
                    <span className="truncate">{row.name}</span>
                    <span className="font-mono text-studio-muted">{row.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <Panel title="Acquisition">
            {summary.acquisition.length === 0 ? (
              <Empty />
            ) : (
              <ul className="grid gap-2 text-sm">
                {summary.acquisition.map((row) => (
                  <li
                    key={row.source}
                    className="flex items-center justify-between gap-4"
                  >
                    <span className="truncate">{row.source}</span>
                    <span className="font-mono text-studio-muted">{row.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Pages">
            {summary.pages.length === 0 ? (
              <Empty />
            ) : (
              <ul className="grid gap-2 text-sm">
                {summary.pages.map((row) => (
                  <li key={row.path}>
                    <div className="flex items-center justify-between gap-4">
                      <span className="truncate">{row.path}</span>
                      <span className="font-mono text-studio-muted">
                        {row.views}
                      </span>
                    </div>
                    <p className="text-xs text-studio-subtle">
                      {formatDuration(row.time)} · scroll {row.scroll}% ·{' '}
                      {row.exits} exits
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <Panel title="Devices">
            {summary.devices.length === 0 ? (
              <Empty />
            ) : (
              <ul className="grid gap-2 text-sm">
                {summary.devices.map((row) => (
                  <li
                    key={row.name}
                    className="flex items-center justify-between gap-4"
                  >
                    <span className="capitalize">{row.name}</span>
                    <span className="font-mono text-studio-muted">{row.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Activity by hour (7 days)">
            <div className="flex h-24 items-end gap-1">
              {summary.hours.map((count, hour) => (
                <div
                  key={hour}
                  className="flex-1 rounded-sm bg-studio-accent/80"
                  style={{ height: `${Math.max(6, (count / maxHour) * 100)}%` }}
                  title={`${hour}h · ${count}`}
                />
              ))}
            </div>
          </Panel>
        </div>

        <Panel title="Recent sessions" className="mt-10">
          {summary.sessions.length === 0 ? (
            <Empty />
          ) : (
            <ul className="grid gap-4">
              {summary.sessions.map((session) => (
                <li
                  key={session.id}
                  className="rounded-[16px] border border-studio-line bg-studio-surface p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <p className="font-medium">
                      {session.entryPath}
                      {session.exitPath !== session.entryPath
                        ? ` → ${session.exitPath}`
                        : ''}
                    </p>
                    <p className="font-mono text-studio-muted">
                      {formatDuration(session.visibleMs ?? 0)} ·{' '}
                      {session.pageCount} page
                      {session.pageCount === 1 ? '' : 's'} · scroll{' '}
                      {session.maxScroll ?? 0}%
                    </p>
                  </div>
                  <p className="mt-2 text-xs text-studio-subtle">
                    {session.device || 'device ?'} ·{' '}
                    {session.utm ||
                      (session.referrer ? session.referrer : 'Direct / unknown')}
                    {session.clicks
                      ? ` · ${session.clicks} click${session.clicks === 1 ? '' : 's'}`
                      : ''}
                    {session.outbound ? ` · ${session.outbound} outbound` : ''}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-studio-muted">
                    {session.paths.join(' → ') || session.entryPath}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-studio-line bg-studio-surface p-5">
      <p className="text-xs font-semibold tracking-[0.14em] text-studio-subtle uppercase">
        {label}
      </p>
      <p className="font-heading mt-2 text-3xl font-semibold tracking-[-0.03em]">
        {value}
      </p>
    </div>
  );
}

function Panel({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={className}>
      <h2 className="text-sm font-semibold tracking-[0.14em] text-studio-subtle uppercase">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Empty() {
  return (
    <p className="text-sm text-studio-muted">
      Nothing recorded yet. Browse the public site, then refresh.
    </p>
  );
}
