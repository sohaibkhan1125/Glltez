import Logo from './Logo';

function SiteBrand({ subtitle = 'Online Tools' }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <Logo size="md" className="shadow-soft" />
      <span className="inline-flex items-center gap-2 whitespace-nowrap leading-none">
        <span className="text-lg font-extrabold text-stone-900">ToolNexa</span>
        {subtitle ? (
          <>
            <span className="hidden h-3.5 w-px bg-stone-300 sm:block" aria-hidden="true" />
            <span className="hidden text-[10px] font-semibold uppercase tracking-widest text-brand-600 sm:inline">
              {subtitle}
            </span>
          </>
        ) : null}
      </span>
    </span>
  );
}

export default SiteBrand;
