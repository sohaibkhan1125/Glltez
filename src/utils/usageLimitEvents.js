let listener = null;

export function onUsageLimitExceeded(callback) {
  listener = callback;
  return () => {
    if (listener === callback) listener = null;
  };
}

export function emitUsageLimitExceeded(resetAt) {
  listener?.(resetAt);
}
