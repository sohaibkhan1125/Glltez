import { emitUsageLimitExceeded } from './usageLimitEvents';

const DAILY_LIMIT = 23;
const RESET_MS = 24 * 60 * 60 * 1000;

const USAGE_KEY = 'toolnexa_usage';
const LOG_KEY = 'toolnexa_usage_log';
const PRO_KEY = 'toolnexa_pro';

export class UsageLimitError extends Error {
  constructor(message, { remaining = 0, resetAt } = {}) {
    super(message);
    this.name = 'UsageLimitError';
    this.remaining = remaining;
    this.resetAt = resetAt;
  }
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getProStatus() {
  const pro = readJson(PRO_KEY, null);
  if (!pro?.active) return null;

  if (pro.periodEnd && Date.now() / 1000 > pro.periodEnd) {
    localStorage.removeItem(PRO_KEY);
    return null;
  }

  return pro;
}

export function isProUser() {
  return Boolean(getProStatus());
}

export function activatePro({ plan, periodEnd, subscriptionId, customerId, sessionId, provider }) {
  writeJson(PRO_KEY, {
    active: true,
    plan,
    provider: provider || 'stripe',
    periodEnd: periodEnd || null,
    subscriptionId: subscriptionId || null,
    customerId: customerId || null,
    sessionId: sessionId || null,
    activatedAt: Date.now(),
  });
}

export function clearProStatus() {
  localStorage.removeItem(PRO_KEY);
}

function getUsageWindow() {
  const now = Date.now();
  let usage = readJson(USAGE_KEY, null);

  if (!usage?.windowStart || now - usage.windowStart >= RESET_MS) {
    usage = { windowStart: now, count: 0 };
    writeJson(USAGE_KEY, usage);
  }

  return usage;
}

export function getUsageStats() {
  if (isProUser()) {
    return {
      isPro: true,
      used: 0,
      remaining: Infinity,
      limit: DAILY_LIMIT,
      resetAt: null,
    };
  }

  const usage = getUsageWindow();
  const remaining = Math.max(0, DAILY_LIMIT - usage.count);
  const resetAt = usage.windowStart + RESET_MS;

  return {
    isPro: false,
    used: usage.count,
    remaining,
    limit: DAILY_LIMIT,
    resetAt,
  };
}

function appendUsageLog(toolId, toolName) {
  const log = readJson(LOG_KEY, []);
  log.unshift({
    toolId,
    toolName,
    timestamp: new Date().toISOString(),
  });
  writeJson(LOG_KEY, log.slice(0, 500));
}

export function getUsageLog() {
  return readJson(LOG_KEY, []);
}

export function ensureToolUsage(toolId, toolName) {
  if (isProUser()) {
    appendUsageLog(toolId, toolName);
    return getUsageStats();
  }

  const usage = getUsageWindow();

  if (usage.count >= DAILY_LIMIT) {
    const resetAt = usage.windowStart + RESET_MS;
    emitUsageLimitExceeded(resetAt);
    throw new UsageLimitError('', { remaining: 0, resetAt });
  }

  usage.count += 1;
  writeJson(USAGE_KEY, usage);
  appendUsageLog(toolId, toolName);

  return getUsageStats();
}

export function formatResetTime(resetAt) {
  if (!resetAt) return '';
  const diff = resetAt - Date.now();
  if (diff <= 0) return 'soon';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
