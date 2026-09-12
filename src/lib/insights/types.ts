export type InsightEventType =
  | 'pageview'
  | 'heartbeat'
  | 'leave'
  | 'click'
  | 'scroll';

export type InsightEvent = {
  id: string;
  ts: number;
  type: InsightEventType;
  visitorId: string;
  sessionId: string;
  path: string;
  title?: string;
  referrer?: string;
  utm?: string;
  visibleMs?: number;
  nextPath?: string;
  name?: string;
  href?: string;
  scroll?: number;
  device?: string;
  viewport?: string;
  language?: string;
  theme?: string;
};

export type InsightSession = {
  id: string;
  visitorId: string;
  startedAt: number;
  endedAt: number;
  entryPath: string;
  exitPath: string;
  referrer: string;
  utm: string;
  visibleMs: number;
  pageCount: number;
  paths: string[];
  clicks: number;
  maxScroll: number;
  outbound: number;
  device: string;
  language: string;
};

export type InsightVisitor = {
  id: string;
  firstSeen: number;
  lastSeen: number;
  landingPath: string;
  referrer: string;
  utm: string;
  sessions: number;
};

export type InsightStore = {
  visitors: Record<string, InsightVisitor>;
  sessions: Record<string, InsightSession>;
  events: InsightEvent[];
};

export type CollectPayload = {
  visitorId?: string;
  sessionId?: string;
  type?: InsightEventType;
  path?: string;
  title?: string;
  referrer?: string;
  utm?: string;
  visibleMs?: number;
  nextPath?: string;
  name?: string;
  href?: string;
  scroll?: number;
  device?: string;
  viewport?: string;
  language?: string;
  theme?: string;
};
