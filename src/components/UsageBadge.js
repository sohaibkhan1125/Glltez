import { Link } from 'react-router-dom';
import { getUsageStats } from '../utils/toolUsage';

function UsageBadge({ expanded = false }) {
  const stats = getUsageStats();

  if (stats.isPro) {
    return (
      <Link
        to="/pricing"
        className={`inline-flex items-center gap-2.5 rounded-lg bg-gradient-to-r from-brand-600 to-brand-700 px-4 py-2.5 text-white shadow-soft transition hover:from-brand-700 hover:to-brand-800 ${
          expanded ? 'w-full justify-center' : ''
        }`}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white/20">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </span>
        <span className="text-left leading-tight">
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-white/80">
            Plan
          </span>
          <span className="block text-sm font-bold">Pro Member</span>
        </span>
      </Link>
    );
  }

  const percentLeft = Math.round((stats.remaining / stats.limit) * 100);
  const isLow = stats.remaining <= 5;

  return (
    <Link
      to="/pricing"
      className={`group inline-flex items-center gap-3 rounded-lg border border-stone-200 bg-white px-3 py-2 shadow-sm transition hover:border-brand-300 hover:shadow-md ${
        expanded ? 'w-full' : ''
      } ${isLow ? 'border-amber-200 bg-amber-50/50' : ''}`}
    >
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${
        isLow ? 'bg-amber-100 text-amber-700' : 'bg-brand-50 text-brand-700'
      }`}>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>

      <div className="min-w-0 flex-1 text-left leading-tight">
        <span className="block text-[10px] font-semibold uppercase tracking-wider text-stone-400">
          Daily usage
        </span>
        <span className={`block text-sm font-bold ${isLow ? 'text-amber-800' : 'text-stone-800'}`}>
          {stats.remaining} of {stats.limit} left
        </span>
        {expanded && (
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-stone-200">
            <div
              className={`h-full rounded-full transition-all ${isLow ? 'bg-amber-500' : 'bg-brand-500'}`}
              style={{ width: `${percentLeft}%` }}
            />
          </div>
        )}
      </div>

      {!expanded && (
        <div className="hidden sm:flex sm:flex-col sm:items-end sm:gap-1">
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-stone-200">
            <div
              className={`h-full rounded-full ${isLow ? 'bg-amber-500' : 'bg-brand-500'}`}
              style={{ width: `${percentLeft}%` }}
            />
          </div>
          <span className="text-[10px] font-semibold text-brand-600 group-hover:text-brand-700">
            Upgrade
          </span>
        </div>
      )}

      {expanded && (
        <span className="shrink-0 rounded-md bg-brand-600 px-3 py-1.5 text-xs font-bold text-white">
          Upgrade
        </span>
      )}
    </Link>
  );
}

export default UsageBadge;
