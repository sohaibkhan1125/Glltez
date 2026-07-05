import { UsageLimitError } from './toolUsage';
import { emitUsageLimitExceeded } from './usageLimitEvents';

export function isUsageLimitError(error) {
  return error instanceof UsageLimitError;
}

export function handleUsageLimitError(error) {
  if (error instanceof UsageLimitError) {
    emitUsageLimitExceeded(error.resetAt);
    return true;
  }
  return false;
}
