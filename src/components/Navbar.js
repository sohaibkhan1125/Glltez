import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { navLinks } from '../data/siteData';
import SiteBrand from './SiteBrand';
import UsageBadge from './UsageBadge';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <div className="h-1 w-full bg-gradient-to-r from-brand-500 via-brand-400 to-coral-400" />

      <header
        className={`sticky top-0 z-50 border-b border-stone-200/80 transition-all duration-300 ${
          scrolled ? 'bg-white/95 shadow-sm backdrop-blur-md' : 'bg-white'
        }`}
      >
        <nav className="section-container flex h-16 items-center justify-between gap-4 lg:h-[72px]">
          <Link to="/" className="flex shrink-0 items-center">
            <SiteBrand />
          </Link>

          <div className="hidden items-center gap-0.5 lg:flex">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className="nav-link">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <UsageBadge />
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-stone-600 transition-colors hover:bg-stone-100 lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {isOpen && (
          <div className="border-t border-stone-100 bg-white px-4 py-4 lg:hidden">
            <div className="mb-4">
              <UsageBadge expanded />
            </div>
            <div className="flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className="border-b border-stone-100 px-1 py-3.5 text-sm font-medium text-stone-700 last:border-0 hover:text-brand-700"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}

export default Navbar;
