import { mkdir, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { neon, type NeonQueryFunction } from '@neondatabase/serverless';
import type {
  InsightEvent,
  InsightSession,
  InsightStore,
  InsightVisitor,
} from '@/lib/insights/types';

type Sql = NeonQueryFunction<false, false>;

export function insightsDatabaseUrl() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.NEON_DATABASE_URL ||
    ''
  ).trim();
}

export function insightsDatabaseConfigured() {
  return Boolean(insightsDatabaseUrl());
}

function sql(): Sql {
  const url = insightsDatabaseUrl();
  if (!url) {
    throw new Error('DATABASE_URL is not set. Add your Neon connection string.');
  }
  return neon(url);
}

let schemaReady: Promise<void> | null = null;

async function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      const db = sql();
      await db`
        CREATE TABLE IF NOT EXISTS insight_visitors (
          id TEXT PRIMARY KEY,
          first_seen BIGINT NOT NULL,
          last_seen BIGINT NOT NULL,
          landing_path TEXT NOT NULL DEFAULT '/',
          referrer TEXT NOT NULL DEFAULT '',
          utm TEXT NOT NULL DEFAULT '',
          sessions INT NOT NULL DEFAULT 0
        )
      `;
      await db`
        CREATE TABLE IF NOT EXISTS insight_sessions (
          id TEXT PRIMARY KEY,
          visitor_id TEXT NOT NULL,
          started_at BIGINT NOT NULL,
          ended_at BIGINT NOT NULL,
          entry_path TEXT NOT NULL,
          exit_path TEXT NOT NULL,
          referrer TEXT NOT NULL DEFAULT '',
          utm TEXT NOT NULL DEFAULT '',
          visible_ms BIGINT NOT NULL DEFAULT 0,
          page_count INT NOT NULL DEFAULT 0,
          paths JSONB NOT NULL DEFAULT '[]'::jsonb,
          clicks INT NOT NULL DEFAULT 0,
          max_scroll INT NOT NULL DEFAULT 0,
          outbound INT NOT NULL DEFAULT 0,
          device TEXT NOT NULL DEFAULT '',
          language TEXT NOT NULL DEFAULT ''
        )
      `;
      await db`
        CREATE TABLE IF NOT EXISTS insight_events (
          id TEXT PRIMARY KEY,
          ts BIGINT NOT NULL,
          type TEXT NOT NULL,
          visitor_id TEXT NOT NULL,
          session_id TEXT NOT NULL,
          path TEXT NOT NULL,
          title TEXT,
          referrer TEXT,
          utm TEXT,
          visible_ms INT,
          next_path TEXT,
          name TEXT,
          href TEXT,
          scroll INT,
          device TEXT,
          viewport TEXT,
          language TEXT,
          theme TEXT
        )
      `;
      await db`CREATE INDEX IF NOT EXISTS insight_events_ts ON insight_events (ts DESC)`;
      await db`CREATE INDEX IF NOT EXISTS insight_sessions_ended ON insight_sessions (ended_at DESC)`;
    })().catch((error) => {
      schemaReady = null;
      throw error;
    });
  }
  return schemaReady;
}

const emptyStore = (): InsightStore => ({
  visitors: {},
  sessions: {},
  events: [],
});

export async function readInsights(): Promise<InsightStore> {
  if (!insightsDatabaseConfigured()) return readFileStore();
  await ensureSchema();
  const db = sql();
  const since = Date.now() - 1000 * 60 * 60 * 24 * 14;

  const [visitorRows, sessionRows, eventRows] = await Promise.all([
    db`SELECT * FROM insight_visitors`,
    db`SELECT * FROM insight_sessions`,
    db`SELECT * FROM insight_events WHERE ts >= ${since} ORDER BY ts ASC`,
  ]);

  const visitors: Record<string, InsightVisitor> = {};
  for (const row of visitorRows as Array<Record<string, unknown>>) {
    const id = String(row.id);
    visitors[id] = {
      id,
      firstSeen: Number(row.first_seen),
      lastSeen: Number(row.last_seen),
      landingPath: String(row.landing_path ?? '/'),
      referrer: String(row.referrer ?? ''),
      utm: String(row.utm ?? ''),
      sessions: Number(row.sessions ?? 0),
    };
  }

  const sessions: Record<string, InsightSession> = {};
  for (const row of sessionRows as Array<Record<string, unknown>>) {
    const id = String(row.id);
    const paths = Array.isArray(row.paths) ? (row.paths as string[]) : [];
    sessions[id] = {
      id,
      visitorId: String(row.visitor_id),
      startedAt: Number(row.started_at),
      endedAt: Number(row.ended_at),
      entryPath: String(row.entry_path),
      exitPath: String(row.exit_path),
      referrer: String(row.referrer ?? ''),
      utm: String(row.utm ?? ''),
      visibleMs: Number(row.visible_ms ?? 0),
      pageCount: Number(row.page_count ?? 0),
      paths,
      clicks: Number(row.clicks ?? 0),
      maxScroll: Number(row.max_scroll ?? 0),
      outbound: Number(row.outbound ?? 0),
      device: String(row.device ?? ''),
      language: String(row.language ?? ''),
    };
  }

  const events: InsightEvent[] = (
    eventRows as Array<Record<string, unknown>>
  ).map((row) => ({
    id: String(row.id),
    ts: Number(row.ts),
    type: row.type as InsightEvent['type'],
    visitorId: String(row.visitor_id),
    sessionId: String(row.session_id),
    path: String(row.path),
    title: row.title ? String(row.title) : undefined,
    referrer: row.referrer ? String(row.referrer) : undefined,
    utm: row.utm ? String(row.utm) : undefined,
    visibleMs: row.visible_ms == null ? undefined : Number(row.visible_ms),
    nextPath: row.next_path ? String(row.next_path) : undefined,
    name: row.name ? String(row.name) : undefined,
    href: row.href ? String(row.href) : undefined,
    scroll: row.scroll == null ? undefined : Number(row.scroll),
    device: row.device ? String(row.device) : undefined,
    viewport: row.viewport ? String(row.viewport) : undefined,
    language: row.language ? String(row.language) : undefined,
    theme: row.theme ? String(row.theme) : undefined,
  }));

  return { visitors, sessions, events };
}

export async function recordEvent(event: InsightEvent) {
  if (!insightsDatabaseConfigured()) {
    return recordFileEvent(event);
  }
  await ensureSchema();
  const db = sql();

  await db`
    INSERT INTO insight_events (
      id, ts, type, visitor_id, session_id, path, title, referrer, utm,
      visible_ms, next_path, name, href, scroll, device, viewport, language, theme
    ) VALUES (
      ${event.id}, ${event.ts}, ${event.type}, ${event.visitorId}, ${event.sessionId},
      ${event.path}, ${event.title ?? null}, ${event.referrer ?? null}, ${event.utm ?? null},
      ${event.visibleMs ?? null}, ${event.nextPath ?? null}, ${event.name ?? null},
      ${event.href ?? null}, ${event.scroll ?? null}, ${event.device ?? null},
      ${event.viewport ?? null}, ${event.language ?? null}, ${event.theme ?? null}
    )
    ON CONFLICT (id) DO NOTHING
  `;

  await db`
    INSERT INTO insight_visitors (
      id, first_seen, last_seen, landing_path, referrer, utm, sessions
    ) VALUES (
      ${event.visitorId}, ${event.ts}, ${event.ts}, ${event.path},
      ${event.referrer ?? ''}, ${event.utm ?? ''}, 0
    )
    ON CONFLICT (id) DO UPDATE SET
      last_seen = EXCLUDED.last_seen,
      referrer = CASE
        WHEN insight_visitors.referrer = '' THEN EXCLUDED.referrer
        ELSE insight_visitors.referrer
      END,
      utm = CASE
        WHEN insight_visitors.utm = '' THEN EXCLUDED.utm
        ELSE insight_visitors.utm
      END
  `;

  const existing = await db`
    SELECT * FROM insight_sessions WHERE id = ${event.sessionId} LIMIT 1
  `;
  const row = (existing[0] ?? null) as Record<string, unknown> | null;

  if (!row) {
    const paths = event.type === 'pageview' ? [event.path] : [];
    await db`
      INSERT INTO insight_sessions (
        id, visitor_id, started_at, ended_at, entry_path, exit_path,
        referrer, utm, visible_ms, page_count, paths, clicks, max_scroll,
        outbound, device, language
      ) VALUES (
        ${event.sessionId}, ${event.visitorId}, ${event.ts}, ${event.ts},
        ${event.path}, ${event.nextPath ?? event.path},
        ${event.referrer ?? ''}, ${event.utm ?? ''},
        ${event.visibleMs ?? 0}, ${paths.length}, ${JSON.stringify(paths)}::jsonb,
        ${event.type === 'click' ? 1 : 0},
        ${typeof event.scroll === 'number' ? event.scroll : 0},
        ${event.type === 'click' && event.href && /^https?:/i.test(event.href) ? 1 : 0},
        ${event.device ?? ''}, ${event.language ?? ''}
      )
    `;
    await db`
      UPDATE insight_visitors
      SET sessions = sessions + 1
      WHERE id = ${event.visitorId}
    `;
    return;
  }

  const paths = Array.isArray(row.paths) ? [...(row.paths as string[])] : [];
  if (event.type === 'pageview' && paths[paths.length - 1] !== event.path) {
    paths.push(event.path);
  }

  const visibleMs =
    Number(row.visible_ms ?? 0) +
    (event.visibleMs && event.visibleMs > 0 ? event.visibleMs : 0);
  const clicks = Number(row.clicks ?? 0) + (event.type === 'click' ? 1 : 0);
  const outbound =
    Number(row.outbound ?? 0) +
    (event.type === 'click' && event.href && /^https?:/i.test(event.href)
      ? 1
      : 0);
  const maxScroll = Math.max(
    Number(row.max_scroll ?? 0),
    typeof event.scroll === 'number' ? event.scroll : 0,
  );
  const exitPath = event.nextPath ?? event.path;
  const device = String(row.device || event.device || '');
  const language = String(row.language || event.language || '');

  await db`
    UPDATE insight_sessions SET
      ended_at = ${event.ts},
      exit_path = ${exitPath},
      visible_ms = ${visibleMs},
      page_count = ${paths.length},
      paths = ${JSON.stringify(paths)}::jsonb,
      clicks = ${clicks},
      max_scroll = ${maxScroll},
      outbound = ${outbound},
      device = ${device},
      language = ${language}
    WHERE id = ${event.sessionId}
  `;
}

const MAX_EVENTS = 20000;
const MAX_SESSIONS = 2500;
const MAX_VISITORS = 2500;

function storePath() {
  return path.join(process.cwd(), 'data', 'insights', 'store.json');
}

let fileQueue: Promise<unknown> = Promise.resolve();

async function readFileStore(): Promise<InsightStore> {
  try {
    const raw = await readFile(storePath(), 'utf8');
    const parsed = JSON.parse(raw) as InsightStore;
    return {
      visitors: parsed.visitors ?? {},
      sessions: parsed.sessions ?? {},
      events: parsed.events ?? [],
    };
  } catch {
    return emptyStore();
  }
}

async function writeFileStore(data: InsightStore) {
  const file = storePath();
  await mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  await writeFile(tmp, JSON.stringify(data), 'utf8');
  try {
    await rename(tmp, file);
  } catch {
    await writeFile(file, JSON.stringify(data), 'utf8');
    await unlink(tmp).catch(() => undefined);
  }
}

function prune(data: InsightStore) {
  if (data.events.length > MAX_EVENTS) data.events = data.events.slice(-MAX_EVENTS);
  const sessionIds = Object.keys(data.sessions).sort(
    (a, b) => (data.sessions[a]?.endedAt ?? 0) - (data.sessions[b]?.endedAt ?? 0),
  );
  while (sessionIds.length > MAX_SESSIONS) {
    const id = sessionIds.shift();
    if (id) delete data.sessions[id];
  }
  const visitorIds = Object.keys(data.visitors).sort(
    (a, b) =>
      (data.visitors[a]?.lastSeen ?? 0) - (data.visitors[b]?.lastSeen ?? 0),
  );
  while (visitorIds.length > MAX_VISITORS) {
    const id = visitorIds.shift();
    if (id) delete data.visitors[id];
  }
}

function recordFileEvent(event: InsightEvent) {
  const next = fileQueue.then(async () => {
    const data = await readFileStore();
    data.events.push(event);

    const visitor = data.visitors[event.visitorId] ?? {
      id: event.visitorId,
      firstSeen: event.ts,
      lastSeen: event.ts,
      landingPath: event.path,
      referrer: event.referrer ?? '',
      utm: event.utm ?? '',
      sessions: 0,
    };
    visitor.lastSeen = event.ts;
    if (!visitor.referrer && event.referrer) visitor.referrer = event.referrer;
    if (!visitor.utm && event.utm) visitor.utm = event.utm;
    data.visitors[event.visitorId] = visitor;

    let session = data.sessions[event.sessionId];
    if (!session) {
      session = {
        id: event.sessionId,
        visitorId: event.visitorId,
        startedAt: event.ts,
        endedAt: event.ts,
        entryPath: event.path,
        exitPath: event.path,
        referrer: event.referrer ?? visitor.referrer,
        utm: event.utm ?? visitor.utm,
        visibleMs: 0,
        pageCount: 0,
        paths: [],
        clicks: 0,
        maxScroll: 0,
        outbound: 0,
        device: event.device ?? '',
        language: event.language ?? '',
      };
      visitor.sessions += 1;
    }

    session.endedAt = event.ts;
    session.exitPath = event.path;
    session.clicks = session.clicks ?? 0;
    session.maxScroll = session.maxScroll ?? 0;
    session.outbound = session.outbound ?? 0;
    session.device = session.device ?? '';
    session.language = session.language ?? '';
    if (event.device && !session.device) session.device = event.device;
    if (event.language && !session.language) session.language = event.language;
    if (event.visibleMs && event.visibleMs > 0) session.visibleMs += event.visibleMs;
    if (
      event.type === 'pageview' &&
      session.paths[session.paths.length - 1] !== event.path
    ) {
      session.paths.push(event.path);
      session.pageCount = session.paths.length;
    }
    if (event.type === 'click') {
      session.clicks += 1;
      if (event.href && /^https?:/i.test(event.href)) session.outbound += 1;
    }
    if (typeof event.scroll === 'number') {
      session.maxScroll = Math.max(session.maxScroll, event.scroll);
    }
    if (event.nextPath) session.exitPath = event.nextPath;
    data.sessions[event.sessionId] = session;
    prune(data);
    await writeFileStore(data);
  });
  fileQueue = next.then(
    () => undefined,
    () => undefined,
  );
  return next;
}
