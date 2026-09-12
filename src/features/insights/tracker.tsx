'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

function id(key: string) {
  try {
    const existing = localStorage.getItem(key);
    if (existing) return existing;
    const created = crypto.randomUUID();
    localStorage.setItem(key, created);
    return created;
  } catch {
    return crypto.randomUUID();
  }
}

function sessionId() {
  try {
    const existing = sessionStorage.getItem('sb-sid');
    if (existing) return existing;
    const created = crypto.randomUUID();
    sessionStorage.setItem('sb-sid', created);
    return created;
  } catch {
    return crypto.randomUUID();
  }
}

function utmFrom(search: string) {
  const params = new URLSearchParams(search);
  const source = params.get('utm_source');
  const medium = params.get('utm_medium');
  const campaign = params.get('utm_campaign');
  return [source, medium, campaign].filter(Boolean).join(' / ');
}

function deviceFromWidth(width: number) {
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

function context() {
  return {
    device: deviceFromWidth(window.innerWidth),
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    language: navigator.language,
    theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
  };
}

function send(body: Record<string, unknown>, keepalive = false) {
  const payload = JSON.stringify(body);
  if (keepalive && navigator.sendBeacon) {
    navigator.sendBeacon('/api/insights/collect', payload);
    return;
  }
  void fetch('/api/insights/collect', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: payload,
    keepalive,
  }).catch(() => undefined);
}

function clickLabel(node: HTMLElement) {
  return (
    node.getAttribute('data-insight') ||
    node.getAttribute('aria-label') ||
    node.textContent?.replace(/\s+/g, ' ').trim().slice(0, 80) ||
    node.getAttribute('href') ||
    'click'
  );
}

function scrollPercent() {
  const root = document.documentElement;
  const max = root.scrollHeight - window.innerHeight;
  if (max <= 0) return 100;
  return Math.min(100, Math.round((window.scrollY / max) * 100));
}

export function InsightsTracker() {
  const pathname = usePathname();
  const visible = useRef(0);
  const lastTick = useRef(Date.now());
  const pathRef = useRef(pathname);
  const maxScroll = useRef(0);
  const sentScroll = useRef(0);

  useEffect(() => {
    if (pathname.startsWith('/insights')) return;

    const visitorId = id('sb-vid');
    const sid = sessionId();
    const referrer = document.referrer || '';
    const utm = utmFrom(window.location.search);
    const path = `${pathname}${window.location.search}`;
    const ctx = context();

    if (pathRef.current !== pathname) {
      send({
        visitorId,
        sessionId: sid,
        type: 'leave',
        path: pathRef.current,
        visibleMs: visible.current,
        nextPath: path,
        scroll: maxScroll.current,
        ...ctx,
      });
      visible.current = 0;
      maxScroll.current = 0;
      sentScroll.current = 0;
      lastTick.current = Date.now();
    }
    pathRef.current = path;

    send({
      visitorId,
      sessionId: sid,
      type: 'pageview',
      path,
      title: document.title,
      referrer,
      utm,
      ...ctx,
    });

    function flushVisible() {
      if (document.visibilityState !== 'visible') return;
      const now = Date.now();
      visible.current += now - lastTick.current;
      lastTick.current = now;
    }

    const beat = window.setInterval(() => {
      flushVisible();
      if (document.visibilityState !== 'visible') return;
      send({
        visitorId,
        sessionId: sid,
        type: 'heartbeat',
        path: pathRef.current,
        visibleMs: visible.current,
        scroll: maxScroll.current,
        ...ctx,
      });
      visible.current = 0;
    }, 15000);

    function onHide() {
      flushVisible();
      send(
        {
          visitorId,
          sessionId: sid,
          type: 'leave',
          path: pathRef.current,
          visibleMs: visible.current,
          scroll: maxScroll.current,
          ...ctx,
        },
        true,
      );
      visible.current = 0;
    }

    function onVis() {
      if (document.visibilityState === 'hidden') onHide();
      else lastTick.current = Date.now();
    }

    function onScroll() {
      const pct = scrollPercent();
      if (pct <= maxScroll.current) return;
      maxScroll.current = pct;
      const bucket = pct >= 90 ? 90 : pct >= 75 ? 75 : pct >= 50 ? 50 : pct >= 25 ? 25 : 0;
      if (bucket && bucket > sentScroll.current) {
        sentScroll.current = bucket;
        send({
          visitorId,
          sessionId: sid,
          type: 'scroll',
          path: pathRef.current,
          scroll: bucket,
          ...ctx,
        });
      }
    }

    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const node = target.closest('a,button') as HTMLElement | null;
      if (!node) return;
      const href = node.getAttribute('href') ?? undefined;
      send({
        visitorId,
        sessionId: sid,
        type: 'click',
        path: pathRef.current,
        name: clickLabel(node),
        href,
        ...ctx,
      });
    }

    window.addEventListener('pagehide', onHide);
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('click', onClick, true);
    onScroll();

    return () => {
      window.clearInterval(beat);
      window.removeEventListener('pagehide', onHide);
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('click', onClick, true);
    };
  }, [pathname]);

  return null;
}
