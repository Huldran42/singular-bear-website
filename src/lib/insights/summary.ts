import { getProduct, products } from '@/lib/products';
import type { InsightStore } from '@/lib/insights/types';
import { packDemos } from '@/webplayer/config';

const DAY = 1000 * 60 * 60 * 24;
const WEEK = DAY * 7;

function hostFromReferrer(referrer: string) {
  if (!referrer) return 'Direct / unknown';
  try {
    const url = new URL(referrer);
    if (url.hostname.endsWith('localhost')) return 'Direct / unknown';
    return url.hostname.replace(/^www\./, '');
  } catch {
    return referrer;
  }
}

function formatPath(path: string) {
  if (!path) return '/';
  return path.split('?')[0] || '/';
}

function productFromPath(path: string) {
  const clean = formatPath(path);
  const match = clean.match(
    /^\/(products|documentation|webplayer)\/([^/]+)/,
  );
  if (!match) return undefined;
  const slug = match[2];
  const pack = packDemos.find((item) => item.slug === slug);
  if (pack) return getProduct(pack.productSlug);
  return products.find((product) => product.slug === slug);
}

function inFunnel(path: string) {
  const clean = formatPath(path);
  if (clean === '/') return 'home';
  if (clean === '/products') return 'catalog';
  if (clean.startsWith('/products/')) return 'product';
  if (clean === '/demo') return 'demo';
  if (clean.startsWith('/webplayer/')) return 'webplayer';
  if (clean === '/documentation' || clean.startsWith('/documentation/')) {
    return 'docs';
  }
  if (clean === '/support') return 'support';
  return 'other';
}

export function summarizeInsights(store: InsightStore, now = Date.now()) {
  const since = now - WEEK;
  const todaySince = now - DAY;
  const sessions = Object.values(store.sessions);
  const weekSessions = sessions.filter((session) => session.endedAt >= since);
  const todaySessions = sessions.filter((session) => session.endedAt >= todaySince);
  const recentList = [...sessions]
    .sort((a, b) => b.endedAt - a.endedAt)
    .slice(0, 50);

  const visitorsToday = new Set(todaySessions.map((session) => session.visitorId));
  const visitorsWeek = new Set(weekSessions.map((session) => session.visitorId));
  const returning = weekSessions.filter((session) => {
    const visitor = store.visitors[session.visitorId];
    return (visitor?.sessions ?? 0) > 1;
  }).length;

  const durations = todaySessions.map((session) => session.visibleMs ?? 0);
  const avgMs =
    durations.length > 0
      ? Math.round(durations.reduce((sum, value) => sum + value, 0) / durations.length)
      : 0;
  const bounced = todaySessions.filter((session) => (session.pageCount ?? 0) <= 1)
    .length;

  const acquisition = new Map<string, number>();
  for (const session of weekSessions) {
    const key = session.utm || hostFromReferrer(session.referrer);
    acquisition.set(key, (acquisition.get(key) ?? 0) + 1);
  }

  const pages = new Map<
    string,
    { views: number; time: number; exits: number; scrolls: number[] }
  >();
  const clicks = new Map<string, number>();
  const devices = new Map<string, number>();
  const hours = Array.from({ length: 24 }, () => 0);
  const productStats = new Map<
    string,
    { title: string; views: number; time: number; store: number; demo: number }
  >();

  for (const session of weekSessions) {
    const device = session.device || 'unknown';
    devices.set(device, (devices.get(device) ?? 0) + 1);
  }

  for (const event of store.events) {
    if (event.ts < since) continue;
    const path = formatPath(event.path);
    const page = pages.get(path) ?? {
      views: 0,
      time: 0,
      exits: 0,
      scrolls: [],
    };
    if (event.type === 'pageview') {
      page.views += 1;
      hours[new Date(event.ts).getHours()] += 1;
    }
    if (event.visibleMs) page.time += event.visibleMs;
    if (event.type === 'leave') page.exits += 1;
    if (event.type === 'scroll' && typeof event.scroll === 'number') {
      page.scrolls.push(event.scroll);
    }
    pages.set(path, page);

    if (event.type === 'click') {
      const key = event.name || event.href || 'click';
      clicks.set(key, (clicks.get(key) ?? 0) + 1);
    }

    const product = productFromPath(path);
    if (product) {
      const row = productStats.get(product.slug) ?? {
        title: product.title,
        views: 0,
        time: 0,
        store: 0,
        demo: 0,
      };
      if (event.type === 'pageview' && path.startsWith('/products/')) {
        row.views += 1;
      }
      if (event.visibleMs) row.time += event.visibleMs;
      if (event.type === 'click' && event.href?.includes('assetstore.unity.com')) {
        row.store += 1;
      }
      if (
        event.type === 'click' &&
        (event.href?.includes('/webplayer/') || event.href?.includes('/demo'))
      ) {
        row.demo += 1;
      }
      if (event.type === 'pageview' && path.startsWith('/webplayer/')) {
        row.demo += 1;
      }
      productStats.set(product.slug, row);
    }
  }

  const funnelSteps = [
    { key: 'home', label: 'Home' },
    { key: 'catalog', label: 'Catalog' },
    { key: 'product', label: 'Product page' },
    { key: 'demo', label: 'Demo' },
    { key: 'webplayer', label: 'WebGL' },
  ] as const;
  const funnelCounts = new Map<string, number>();
  for (const session of weekSessions) {
    const seen = new Set(session.paths.map(inFunnel));
    for (const step of funnelSteps) {
      if (seen.has(step.key)) {
        funnelCounts.set(step.key, (funnelCounts.get(step.key) ?? 0) + 1);
      }
    }
    const storeClick = store.events.some(
      (event) =>
        event.sessionId === session.id &&
        event.type === 'click' &&
        (event.href ?? '').includes('assetstore.unity.com'),
    );
    if (storeClick) {
      funnelCounts.set('store', (funnelCounts.get('store') ?? 0) + 1);
    }
  }

  const productsRanked = [...productStats.entries()]
    .map(([slug, row]) => ({ slug, ...row }))
    .sort((a, b) => b.time + b.views * 4000 - (a.time + a.views * 4000));

  const recommendations = buildRecommendations({
    todaySessions: todaySessions.length,
    bounce:
      todaySessions.length > 0
        ? Math.round((bounced / todaySessions.length) * 100)
        : 0,
    funnel: funnelSteps.map((step) => ({
      ...step,
      count: funnelCounts.get(step.key) ?? 0,
    })),
    store: funnelCounts.get('store') ?? 0,
    products: productsRanked,
    pages: [...pages.entries()].map(([path, stats]) => ({ path, ...stats })),
  });

  return {
    today: {
      sessions: todaySessions.length,
      visitors: visitorsToday.size,
      avgMs,
      bounce:
        todaySessions.length > 0
          ? Math.round((bounced / todaySessions.length) * 100)
          : 0,
    },
    week: {
      sessions: weekSessions.length,
      visitors: visitorsWeek.size,
      returning,
    },
    acquisition: [...acquisition.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([source, count]) => ({ source, count })),
    pages: [...pages.entries()]
      .sort((a, b) => b[1].views - a[1].views)
      .slice(0, 12)
      .map(([path, stats]) => ({
        path,
        views: stats.views,
        time: stats.time,
        exits: stats.exits,
        scroll:
          stats.scrolls.length > 0
            ? Math.round(
                stats.scrolls.reduce((sum, value) => sum + value, 0) /
                  stats.scrolls.length,
              )
            : 0,
      })),
    clicks: [...clicks.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([name, count]) => ({ name, count })),
    devices: [...devices.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count })),
    hours,
    funnel: [
      ...funnelSteps.map((step) => ({
        label: step.label,
        count: funnelCounts.get(step.key) ?? 0,
      })),
      { label: 'Asset Store', count: funnelCounts.get('store') ?? 0 },
    ],
    products: productsRanked,
    recommendations,
    sessions: recentList,
  };
}

function buildRecommendations(input: {
  todaySessions: number;
  bounce: number;
  funnel: { key: string; label: string; count: number }[];
  store: number;
  products: {
    slug: string;
    title: string;
    views: number;
    time: number;
    store: number;
    demo: number;
  }[];
  pages: { path: string; views: number; time: number }[];
}) {
  const recs: { tone: 'hot' | 'cold' | 'fix'; text: string }[] = [];
  if (input.todaySessions === 0 && input.products.length === 0) {
    recs.push({
      tone: 'fix',
      text: 'No traffic yet. Open the public site once, click around, then refresh Insights.',
    });
    return recs;
  }

  if (input.bounce >= 60) {
    recs.push({
      tone: 'cold',
      text: `Bounce is ${input.bounce}%. The home hero is not holding people — test a clearer first CTA.`,
    });
  }

  const home = input.funnel.find((step) => step.key === 'home')?.count ?? 0;
  const catalog = input.funnel.find((step) => step.key === 'catalog')?.count ?? 0;
  const demo = input.funnel.find((step) => step.key === 'demo')?.count ?? 0;
  if (home > 8 && catalog < home * 0.25) {
    recs.push({
      tone: 'fix',
      text: 'Few visitors reach the catalog from home. “Explore the possibilities” may be too quiet.',
    });
  }
  if (catalog > 8 && demo < catalog * 0.2) {
    recs.push({
      tone: 'fix',
      text: 'People browse products but skip the live demo. Surface WebGL earlier on product pages.',
    });
  }
  if (input.store > 0) {
    recs.push({
      tone: 'hot',
      text: `${input.store} session${input.store === 1 ? '' : 's'} reached the Asset Store. That is the real intent signal — double down on those entry pages.`,
    });
  }

  const hot = input.products[0];
  if (hot && (hot.views > 0 || hot.time > 0)) {
    recs.push({
      tone: 'hot',
      text: `${hot.title} is the strongest pack (views + time). Lead with it on the home carousel and ads.`,
    });
  }
  const cold = [...input.products]
    .filter((row) => row.views > 0)
    .sort((a, b) => a.time / Math.max(a.views, 1) - b.time / Math.max(b.views, 1))[0];
  if (cold && hot && cold.slug !== hot.slug) {
    recs.push({
      tone: 'cold',
      text: `${cold.title} gets views but little time. The cover may oversell — tighten the page intro or swap the thumbnail.`,
    });
  }

  return recs.slice(0, 6);
}

export function formatDuration(ms: number) {
  if (ms < 1000) return '0s';
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  if (minutes < 60) return rest ? `${minutes}m ${rest}s` : `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
}
