import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { recordEvent } from '@/lib/insights/store';
import type { CollectPayload } from '@/lib/insights/types';

const bot =
  /bot|crawl|spider|slurp|preview|facebookexternalhit|bingpreview|lighthouse/i;

function cleanPath(value: string) {
  try {
    const url = new URL(value, 'http://localhost');
    return `${url.pathname}${url.search}`.slice(0, 240) || '/';
  } catch {
    return '/';
  }
}

export async function POST(request: Request) {
  const ua = request.headers.get('user-agent') ?? '';
  if (bot.test(ua)) return NextResponse.json({ ok: true });

  let payload: CollectPayload;
  try {
    payload = JSON.parse(await request.text()) as CollectPayload;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const path = cleanPath(payload.path ?? '/');
  if (path.startsWith('/insights') || path.startsWith('/api/')) {
    return NextResponse.json({ ok: true });
  }

  const type = payload.type;
  if (
    type !== 'pageview' &&
    type !== 'heartbeat' &&
    type !== 'leave' &&
    type !== 'click' &&
    type !== 'scroll'
  ) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const visitorId = (payload.visitorId ?? '').slice(0, 64);
  const sessionId = (payload.sessionId ?? '').slice(0, 64);
  if (!visitorId || !sessionId) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    await recordEvent({
      id: randomUUID(),
      ts: Date.now(),
      type,
      visitorId,
      sessionId,
      path,
      title: payload.title?.slice(0, 160),
      referrer: payload.referrer?.slice(0, 300),
      utm: payload.utm?.slice(0, 160),
      visibleMs:
        typeof payload.visibleMs === 'number' && payload.visibleMs > 0
          ? Math.min(payload.visibleMs, 120000)
          : undefined,
      nextPath: payload.nextPath ? cleanPath(payload.nextPath) : undefined,
      name: payload.name?.slice(0, 120),
      href: payload.href?.slice(0, 400),
      scroll:
        typeof payload.scroll === 'number'
          ? Math.min(100, Math.max(0, Math.round(payload.scroll)))
          : undefined,
      device: payload.device?.slice(0, 24),
      viewport: payload.viewport?.slice(0, 24),
      language: payload.language?.slice(0, 16),
      theme: payload.theme?.slice(0, 8),
    });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  return NextResponse.json({ ok: true });
}
