import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { INSIGHTS_COOKIE, verifyInsightsToken } from '@/lib/insights/token';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (
    pathname === '/insights/login' ||
    pathname === '/api/insights/login' ||
    pathname === '/api/insights/collect'
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(INSIGHTS_COOKIE)?.value;
  if (await verifyInsightsToken(token)) return NextResponse.next();

  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const login = request.nextUrl.clone();
  login.pathname = '/insights/login';
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ['/insights', '/insights/:path*', '/api/insights/:path*'],
};
