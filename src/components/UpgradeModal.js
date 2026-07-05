import { Link } from 'react-router-dom';
import { formatResetTime } from '../utils/toolUsage';

function UpgradeModal({ open, resetAt, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lifted">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <h2 className="mt-5 text-xl font-extrabold text-stone-900">Daily limit reached</h2>
        <p className="mt-2 text-sm text-stone-600">
          You&apos;ve used all 23 free tool runs for today. Upgrade to Pro for unlimited access, or wait for your limit to reset.
        </p>

        {resetAt && (
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-stone-500">
            Resets in {formatResetTime(resetAt)}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link to="/pricing" className="btn-primary flex-1 text-center">
            Upgrade to Pro
          </Link>
          <button type="button" onClick={onClose} className="btn-outline flex-1">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpgradeModal;
