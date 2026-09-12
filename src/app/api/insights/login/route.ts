import { NextResponse } from 'next/server';
import {
  INSIGHTS_COOKIE,
  insightsCookieOptions,
  insightsConfigured,
  mintInsightsCookie,
  passwordMatches,
} from '@/lib/insights/auth';

export async function POST(request: Request) {
  if (!insightsConfigured()) {
    return NextResponse.json(
      { ok: false, error: 'Set INSIGHTS_PASSWORD in .env.local' },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => null)) as {
    password?: string;
  } | null;
  const password = body?.password ?? '';
  if (!passwordMatches(password)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(
    INSIGHTS_COOKIE,
    await mintInsightsCookie(),
    insightsCookieOptions(),
  );
  return response;
}
