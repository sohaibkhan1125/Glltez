import { ensureToolUsage, UsageLimitError } from './toolUsage';

export function guardClientTool(toolId, toolName, setError) {
  try {
    ensureToolUsage(toolId, toolName);
    return true;
  } catch (err) {
    if (err instanceof UsageLimitError) return false;
    setError?.(err.message || 'Usage check failed.');
    return false;
  }
}
