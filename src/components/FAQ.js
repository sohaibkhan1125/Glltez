import { useState } from 'react';
import { Link } from 'react-router-dom';
import { faqItems } from '../data/siteData';

function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
        isOpen
          ? 'border-brand-200 bg-brand-50/50 shadow-soft'
          : 'border-stone-200 bg-white shadow-card'
      }`}
    >
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="text-base font-bold text-stone-900">{question}</span>
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
            isOpen ? 'rotate-45 bg-brand-600 text-white' : 'bg-stone-100 text-stone-600'
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-5 text-sm leading-relaxed text-stone-600">{answer}</p>
        </div>
      </div>
    </div>
  );
}

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="scroll-mt-20 bg-cream-50 py-16 sm:py-20">
      <div className="section-container">
        <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-2 lg:pt-4">
            <span className="text-sm font-bold uppercase tracking-wider text-coral-500">
              FAQ
            </span>
            <h2 className="section-heading mt-2">Got Questions? We&apos;ve Got Answers</h2>
            <p className="section-subheading">
              Everything you need to know about using ToolNexa. Still stuck? Reach out anytime.
            </p>

            <div className="mt-8 hidden rounded-2xl border border-brand-200 bg-brand-50 p-6 lg:block">
              <p className="text-sm font-bold text-brand-800">Need help?</p>
              <p className="mt-1 text-sm text-brand-700/80">
                Our support team is here to assist you with any tool-related questions.
              </p>
              <Link
                to="/contact-us"
                className="mt-4 inline-flex text-sm font-bold text-brand-700 hover:text-brand-800"
              >
                Contact Support →
              </Link>
            </div>
          </div>

          <div className="space-y-3 lg:col-span-3">
            {faqItems.map((item, index) => (
              <FAQItem
                key={item.question}
                question={item.question}
                answer={item.answer}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQ;
