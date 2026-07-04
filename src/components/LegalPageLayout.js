import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

function LegalSection({ title, children }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-stone-900">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-stone-600">{children}</div>
    </section>
  );
}

function LegalPageLayout({ title, description, children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-[60vh] bg-cream-50">
        <div className="section-container py-12 sm:py-16">
          <div className="mx-auto max-w-3xl">
            <Link
              to="/"
              className="inline-flex items-center text-sm font-semibold text-brand-600 transition hover:text-brand-700"
            >
              ← Back to Home
            </Link>
            <h1 className="mt-6 text-3xl font-extrabold text-stone-900 sm:text-4xl">{title}</h1>
            {description && (
              <p className="mt-3 text-base leading-relaxed text-stone-500">{description}</p>
            )}
            <p className="mt-2 text-xs font-medium text-stone-400">Last updated: July 4, 2026</p>
            <div className="mt-10 space-y-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-card sm:p-8">
              {children}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export { LegalSection };
export default LegalPageLayout;
