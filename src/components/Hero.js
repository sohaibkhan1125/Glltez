import { Link } from 'react-router-dom';
import { heroCategories } from '../data/siteData';

function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-cream-50">
      <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-brand-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-coral-100/50 blur-3xl" />

      <div className="section-container relative py-14 sm:py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-brand-700">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              100% Free · No Sign Up
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.15] tracking-tight text-stone-900 sm:text-5xl lg:text-[3.25rem]">
              All Your Favorite{' '}
              <span className="relative inline-block text-brand-600">
                Online Tools
                <svg
                  className="absolute -bottom-1 left-0 w-full text-coral-400"
                  viewBox="0 0 200 8"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path d="M1 5.5C50 1 150 1 199 5.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>{' '}
              in One Place
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-stone-500">
              AI, PDF, and Image utilities built for speed and simplicity. Open any tool in your
              browser and get results in seconds — on phone, tablet, or desktop.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link to="/ai-tools" className="btn-primary">
                Browse All Tools
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link to="/how-to-use" className="btn-outline">
                See How It Works
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 border-t border-stone-200 pt-8">
              {[
                { num: '50+', text: 'Tools coming soon' },
                { num: 'Free', text: 'Always free to use' },
                { num: 'Fast', text: 'Instant processing' },
              ].map((item) => (
                <div key={item.text}>
                  <div className="text-2xl font-extrabold text-stone-900">{item.num}</div>
                  <div className="text-sm text-stone-500">{item.text}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative rounded-3xl border border-stone-200 bg-white p-6 shadow-lifted sm:p-8">
              <p className="text-sm font-bold uppercase tracking-wider text-stone-400">
                Tool Categories
              </p>
              <div className="mt-5 space-y-4">
                {heroCategories.map((cat, i) => (
                  <Link
                    key={cat.to}
                    to={cat.to}
                    className={`flex items-center justify-between rounded-2xl border p-4 transition-all hover:scale-[1.02] hover:shadow-card ${cat.color}`}
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <span className="font-bold">{cat.label}</span>
                    <svg className="h-5 w-5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>

              <div className="mt-6 rounded-2xl bg-brand-50 p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm text-white">
                    ✓
                  </span>
                  <div>
                    <p className="text-sm font-bold text-stone-800">Secure & Private</p>
                    <p className="mt-0.5 text-xs text-stone-500">
                      Files are processed safely and never stored permanently.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 -top-4 hidden h-20 w-20 rounded-2xl bg-coral-400/20 sm:block" />
            <div className="absolute -bottom-3 -left-3 hidden h-16 w-16 rounded-full bg-brand-400/20 sm:block" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
