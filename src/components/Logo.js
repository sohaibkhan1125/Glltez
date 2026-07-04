function Logo({ size = 'md', showWordmark = false, className = '' }) {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const imageClass = sizes[size] || sizes.md;

  if (showWordmark) {
    return (
      <span className={`inline-flex items-center gap-2.5 ${className}`}>
        <img
          src={`${process.env.PUBLIC_URL}/logo.svg`}
          alt="ToolNexa"
          className={`${imageClass} shrink-0 object-contain`}
        />
        <span className="text-xl font-extrabold text-stone-900">ToolNexa</span>
      </span>
    );
  }

  return (
    <img
      src={`${process.env.PUBLIC_URL}/logo.svg`}
      alt="ToolNexa"
      className={`${imageClass} shrink-0 object-contain ${className}`}
    />
  );
}

export default Logo;
