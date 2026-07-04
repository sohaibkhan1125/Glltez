import Logo from './Logo';

function SiteBrand({ subtitle = 'Online Tools' }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <Logo size="md" className="shadow-soft" />
      <span className="leading-tight">
        <span className="block text-lg font-extrabold text-stone-900">ToolNexa</span>
        {subtitle ? (
          <span className="block text-[10px] font-semibold uppercase tracking-widest text-brand-600">
            {subtitle}
          </span>
        ) : null}
      </span>
    </span>
  );
}

export default SiteBrand;
