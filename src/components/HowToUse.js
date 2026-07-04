import { howToSteps } from '../data/siteData';

const stepIcons = {
  search: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  ),
  upload: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  ),
  process: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  ),
  download: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  ),
};

function HowToUse() {
  return (
    <section id="how-to-use" className="scroll-mt-20 bg-white py-16 sm:py-20">
      <div className="section-container">
        <div className="rounded-3xl border border-stone-200 bg-gradient-to-br from-cream-100 to-brand-50 p-8 sm:p-12">
          <div className="max-w-xl">
            <span className="text-sm font-bold uppercase tracking-wider text-brand-600">
              Simple & Fast
            </span>
            <h2 className="section-heading mt-2">How to Use ToolNexa</h2>
            <p className="section-subheading">
              Four quick steps from start to finish. No downloads, no accounts — just results.
            </p>
          </div>

          <div className="relative mt-12">
            <div className="absolute left-0 right-0 top-8 hidden h-0.5 bg-brand-200 lg:block" style={{ marginLeft: '12%', marginRight: '12%' }} />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {howToSteps.map((item) => (
                <div key={item.step} className="relative text-center">
                  <div className="relative z-10 mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white bg-brand-600 text-white shadow-soft">
                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      {stepIcons[item.icon]}
                    </svg>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                    Step {item.step}
                  </span>
                  <h3 className="mt-2 text-base font-bold text-stone-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-500">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowToUse;
