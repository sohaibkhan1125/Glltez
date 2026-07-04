import ToolCard from './ToolCard';
import { Link } from 'react-router-dom';

function CategoryIcon({ categoryId }) {
  const icons = {
    'ai-tools': (
      <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
      </svg>
    ),
    'pdf-tools': (
      <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    'image-tools': (
      <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
    'other-tools': (
      <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.588m6.002-6.002l1.5 1.5m-1.5-1.5l-1.5-1.5m1.5 1.5l-1.5 1.5" />
      </svg>
    ),
  };

  return icons[categoryId] || null;
}

function ToolSection({
  id,
  title,
  tagline,
  description,
  bgClass,
  panelClass,
  badgeClass,
  iconClass,
  accentBorder,
  tools,
}) {
  return (
    <section id={id} className={`scroll-mt-20 py-16 sm:py-20 ${bgClass}`}>
      <div className="section-container">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4 lg:col-start-1 lg:row-start-1">
            <div className={`rounded-3xl p-8 text-white shadow-lifted ${panelClass}`}>
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                <CategoryIcon categoryId={id} />
              </div>
              <span className="inline-block rounded-full bg-white/25 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                {tagline}
              </span>
              <h2 className="mt-4 text-3xl font-extrabold">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/85">{description}</p>
              <Link
                to={`/${id}`}
                className="mt-6 inline-flex items-center rounded-full bg-white/20 px-5 py-2.5 text-sm font-bold backdrop-blur-sm transition hover:bg-white/30"
              >
                View all {title.toLowerCase()}
              </Link>
            </div>
          </div>

          <div className="lg:col-span-8 lg:col-start-5 lg:row-start-1">
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {tools.map((tool) => (
                <ToolCard
                  key={tool.name}
                  {...tool}
                  iconClass={iconClass}
                  accentBorder={accentBorder}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ToolSection;
