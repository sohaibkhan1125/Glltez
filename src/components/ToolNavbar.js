import { Link } from 'react-router-dom';
import SiteBrand from './SiteBrand';
import UsageBadge from './UsageBadge';

function ToolNavbar({ toolName }) {
  return (
    <>
      <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-brand-500 to-coral-400" />
      <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/95 backdrop-blur-md">
        <nav className="section-container flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex shrink-0 items-center">
            <SiteBrand />
          </Link>

          <div className="hidden min-w-0 items-center gap-2 truncate sm:flex">
            <Link
              to="/ai-tools"
              className="shrink-0 text-sm font-medium text-stone-500 transition-colors hover:text-brand-700"
            >
              AI Tools
            </Link>
            <span className="shrink-0 text-stone-300">/</span>
            <span className="truncate text-sm font-semibold text-stone-800">{toolName}</span>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <Link
              to="/pricing"
              className="hidden text-sm font-medium text-stone-600 transition-colors hover:text-brand-700 sm:inline"
            >
              Pricing
            </Link>
            <UsageBadge />
          </div>
        </nav>
      </header>
    </>
  );
}

export default ToolNavbar;
