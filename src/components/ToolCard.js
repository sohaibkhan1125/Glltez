import { Link } from 'react-router-dom';

function ToolCard({ name, description, status, path, iconClass, accentBorder }) {
  const isComingSoon = status === 'coming-soon';

  return (
    <article className={`tool-card group relative border-l-4 ${accentBorder}`}>
      {isComingSoon ? (
        <span className="absolute right-4 top-4 rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-500">
          Soon
        </span>
      ) : (
        <span className="absolute right-4 top-4 rounded-full bg-brand-100 px-3 py-1 text-xs font-bold text-brand-700">
          Live
        </span>
      )}

      <div
        className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>

      <h3 className="text-lg font-bold text-stone-900">{name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-stone-500">{description}</p>

      <div className="mt-5 border-t border-stone-100 pt-4">
        {isComingSoon ? (
          <span className="inline-flex items-center text-sm font-bold text-stone-400">
            Coming Soon
          </span>
        ) : (
          <Link
            to={path}
            className="inline-flex items-center text-sm font-bold text-brand-600 transition-colors hover:text-brand-700"
          >
            Open Tool →
          </Link>
        )}
      </div>
    </article>
  );
}

export default ToolCard;
