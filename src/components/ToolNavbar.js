import { Link } from 'react-router-dom';
import SiteBrand from './SiteBrand';

function ToolNavbar({ toolName }) {
  return (
    <>
      <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-brand-500 to-coral-400" />
      <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur-md">
        <nav className="section-container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <SiteBrand />
          </Link>

          <div className="hidden items-center gap-2 sm:flex">
            <Link
              to="/ai-tools"
              className="rounded-full px-4 py-2 text-sm font-semibold text-stone-600 hover:bg-violet-50 hover:text-violet-700"
            >
              AI Tools
            </Link>
            <span className="text-stone-300">/</span>
            <span className="text-sm font-bold text-violet-700">{toolName}</span>
          </div>

          <Link to="/" className="btn-outline !py-2 !px-5 !text-sm">
            ← Back to Home
          </Link>
        </nav>
      </header>
    </>
  );
}

export default ToolNavbar;
