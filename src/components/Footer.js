import { Link } from 'react-router-dom';
import SiteBrand from './SiteBrand';

function Footer() {
  const currentYear = new Date().getFullYear();

  const columns = [
    {
      title: 'Tools',
      links: [
        { label: 'AI Tools', to: '/ai-tools' },
        { label: 'PDF Tools', to: '/pdf-tools' },
        { label: 'Image Tools', to: '/image-tools' },
        { label: 'Other Tools', to: '/other-tools' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'How to Use', to: '/how-to-use' },
        { label: 'FAQ', to: '/faq' },
        { label: 'Contact Us', to: '/contact-us' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', to: '/privacy-policy' },
        { label: 'Terms and Conditions', to: '/terms-and-conditions' },
        { label: 'Disclaimer', to: '/disclaimer' },
      ],
    },
  ];

  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="section-container py-12 sm:py-14">
        <div className="rounded-3xl bg-gradient-to-r from-brand-600 to-brand-500 px-8 py-10 text-white sm:px-12">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-2xl font-extrabold">Ready to get started?</h3>
              <p className="mt-2 max-w-md text-sm text-white/85">
                Pick a tool category and start working — completely free, no account needed.
              </p>
            </div>
            <Link
              to="/ai-tools"
              className="inline-flex shrink-0 items-center rounded-full bg-white px-7 py-3.5 text-sm font-bold text-brand-700 shadow-lg transition hover:bg-cream-50"
            >
              Explore Tools
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex">
              <SiteBrand subtitle="" />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-stone-500">
              Your all-in-one platform for AI, PDF, image, and utility tools. Fast, free, and secure —
              built for everyone on every device.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-stone-500 transition-colors hover:text-brand-600"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-stone-100 pt-8 sm:flex-row">
          <p className="text-sm text-stone-400">
            &copy; {currentYear} ToolNexa. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
            <Link to="/privacy-policy" className="text-stone-500 transition hover:text-brand-600">
              Privacy
            </Link>
            <Link to="/terms-and-conditions" className="text-stone-500 transition hover:text-brand-600">
              Terms
            </Link>
            <Link to="/disclaimer" className="text-stone-500 transition hover:text-brand-600">
              Disclaimer
            </Link>
            <Link to="/contact-us" className="text-stone-500 transition hover:text-brand-600">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
