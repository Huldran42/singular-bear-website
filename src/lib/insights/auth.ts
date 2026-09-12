import { timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import {
  INSIGHTS_COOKIE,
  INSIGHTS_COOKIE_MAX_AGE,
  signInsightsToken,
  verifyInsightsToken,
} from '@/lib/insights/token';

export { INSIGHTS_COOKIE, signInsightsToken, verifyInsightsToken };

export function insightsConfigured() {
  return Boolean(process.env.INSIGHTS_PASSWORD?.trim());
}

export function passwordMatches(input: string) {
  const expected = process.env.INSIGHTS_PASSWORD?.trim();
  if (!expected) return false;
  const a = Buffer.from(input.trim(), 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function insightsCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: INSIGHTS_COOKIE_MAX_AGE,
  };
}

export async function mintInsightsCookie() {
  return signInsightsToken();
}

export async function hasInsightsSession() {
  const jar = await cookies();
  return verifyInsightsToken(jar.get(INSIGHTS_COOKIE)?.value);
}
