import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { navLinks } from '../data/siteData';
import SiteBrand from './SiteBrand';

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
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/95 shadow-sm backdrop-blur-md' : 'bg-white'
        }`}
      >
        <nav className="section-container flex h-16 items-center justify-between lg:h-[72px]">
          <Link to="/" className="flex items-center gap-2">
            <SiteBrand />
          </Link>

          <div className="hidden items-center rounded-full border border-stone-200 bg-stone-50/80 p-1 lg:flex">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className="pill-nav">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:block">
            <Link to="/ai-writer" className="btn-primary !py-2.5 !px-6 !text-sm">
              Try AI Writer
            </Link>
          </div>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 text-stone-700 lg:hidden"
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
        </nav>

        {isOpen && (
          <div className="border-t border-stone-100 bg-white px-4 py-4 lg:hidden">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-semibold text-stone-700 hover:bg-brand-50 hover:text-brand-700"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/ai-writer"
                onClick={() => setIsOpen(false)}
                className="btn-primary mt-3 w-full text-center"
              >
                Try AI Writer
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

export default Navbar;
