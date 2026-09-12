const DAY_MS = 1000 * 60 * 60 * 24 * 14;

function secret() {
  return (
    process.env.INSIGHTS_SECRET?.trim() ||
    process.env.INSIGHTS_PASSWORD?.trim() ||
    'change-me-in-env-local'
  );
}

async function hmacHex(payload: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const buf = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(payload),
  );
  return Array.from(new Uint8Array(buf))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i += 1) {
    out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return out === 0;
}

export async function signInsightsToken(expiresAt = Date.now() + DAY_MS) {
  const payload = String(expiresAt);
  const sig = await hmacHex(payload);
  return `${payload}.${sig}`;
}

export async function verifyInsightsToken(token: string | undefined) {
  if (!token) return false;
  const dot = token.indexOf('.');
  if (dot < 0) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = await hmacHex(payload);
  if (!safeEqual(sig, expected)) return false;
  const exp = Number(payload);
  return Number.isFinite(exp) && Date.now() < exp;
}

export const INSIGHTS_COOKIE = 'sb_insights';
export const INSIGHTS_COOKIE_MAX_AGE = 60 * 60 * 24 * 14;
