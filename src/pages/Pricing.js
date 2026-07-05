import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { createCheckoutSession } from '../services/stripeApi';
import { createPayPalSubscription } from '../services/paypalApi';

const PRICING_FAQ = [
  {
    question: 'What is included in the free plan?',
    answer:
      'Free users can use all 23+ ToolNexa tools with up to 23 runs every 24 hours. Your daily limit resets automatically 24 hours after your first use in each period. No account or credit card is required.',
  },
  {
    question: 'What do I get with Monthly Pro ($4.99/month)?',
    answer:
      'Monthly Pro gives you unlimited tool uses per day, access to all 23+ tools, priority processing speed, no ads or usage caps, and export in any format. You are billed $4.99 each month and can cancel anytime.',
  },
  {
    question: 'What do I get with Yearly Pro ($39.99/year)?',
    answer:
      'Yearly Pro includes everything in Monthly Pro plus early access to new tools, priority email support, advanced file history, and upcoming API access. It works out to about $3.33/month — saving you $19.89 per year compared to paying monthly.',
  },
  {
    question: 'Which plan should I choose — Monthly or Yearly?',
    answer:
      'Choose Monthly Pro if you want flexibility with a low monthly commitment. Choose Yearly Pro if you use ToolNexa regularly and want the best value, extra perks, and priority support. Both plans unlock unlimited tool access.',
  },
  {
    question: 'How does the 23 uses per day limit work?',
    answer:
      'Each time you run a tool (generate, convert, compress, etc.) it counts as one use. Free users share one pool of 23 uses across all tools per 24-hour window. Pro subscribers have no daily limit.',
  },
  {
    question: 'Can I pay with Stripe or PayPal?',
    answer:
      'Yes. On the pricing page you can subscribe with a credit or debit card through Stripe, or pay with PayPal. Both options are secure and activate your Pro plan immediately after successful payment.',
  },
  {
    question: 'When does my Pro plan activate?',
    answer:
      'Your Pro plan activates right after your payment is confirmed. You will be redirected to a success page and unlimited tool access begins immediately on that browser.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer:
      'Yes. Both Monthly and Yearly Pro can be cancelled anytime. If you paid with Stripe, cancel from your Stripe receipt or customer portal. If you paid with PayPal, cancel from your PayPal account under Subscriptions.',
  },
  {
    question: 'Will I be charged automatically when my plan renews?',
    answer:
      'Yes. Monthly Pro renews every month and Yearly Pro renews every year until you cancel. You will receive a receipt from Stripe or PayPal each time a payment is processed.',
  },
  {
    question: 'Do you offer refunds?',
    answer:
      'If you experience an issue with your subscription or were charged by mistake, contact us at support@toolnexa.com within 7 days of payment and we will review your request.',
  },
  {
    question: 'Does Pro work on all my devices?',
    answer:
      'Pro status is linked to the browser where you completed checkout. If you switch devices or clear browser data, you may need to contact support or sign in with the same payment account when account login is available.',
  },
  {
    question: 'Can I switch from Monthly to Yearly (or vice versa)?',
    answer:
      'To change plans, cancel your current subscription first, then subscribe to the plan you want from the pricing page. Contact support@toolnexa.com if you need help switching without interruption.',
  },
  {
    question: 'Is my payment information secure?',
    answer:
      'Absolutely. All payments are processed by Stripe or PayPal — industry-leading payment providers. ToolNexa never stores your card or PayPal login details on our servers.',
  },
];

const PLANS = [
  {
    id: 'monthly',
    name: 'Monthly Pro',
    price: '$4.99',
    period: '/month',
    billing: 'Billed $4.99/month',
    badge: null,
    features: [
      'Unlimited tool uses per day',
      'All 23+ tools unlocked',
      'Priority processing speed',
      'No ads or limits',
      'Export in any format',
      'Cancel anytime',
    ],
    highlighted: false,
  },
  {
    id: 'yearly',
    name: 'Yearly Pro',
    price: '$39.99',
    period: '/year',
    billing: 'Only $3.33/month · Save $19.89',
    badge: 'Best Value',
    features: [
      'Everything in Monthly',
      'Early access to new tools',
      'Priority email support',
      'Advanced file history',
      'API access (coming soon)',
      'Cancel anytime',
    ],
    highlighted: true,
  },
];

function Pricing() {
  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />

      <main className="section-container py-12 sm:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full bg-brand-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-700">
            Upgrade to Pro
          </span>
          <h1 className="mt-4 text-3xl font-extrabold text-stone-900 sm:text-4xl">
            Choose your plan
          </h1>
          <p className="mt-3 text-base text-stone-600 sm:text-lg">
            Free users get 23 tool uses every 24 hours. Upgrade for unlimited access to all tools.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:mt-12 lg:grid-cols-2">
          {PLANS.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-card">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-semibold text-stone-700">
            <span className="inline-flex items-center gap-2">
              <svg className="h-5 w-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Stripe
            </span>
            <span className="text-stone-300">|</span>
            <span className="inline-flex items-center gap-2">
              <svg className="h-5 w-5 text-[#003087]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.067 8.478c.492 0 .924.09 1.296.27.372.18.696.432.972.756.276.324.492.708.648 1.152.156.444.264.936.324 1.476.06.54.084 1.116.072 1.728-.012.612-.06 1.224-.144 1.836-.084.612-.216 1.188-.396 1.728-.18.54-.408 1.02-.684 1.44-.276.42-.6.756-.972 1.008-.372.252-.804.378-1.296.378h-1.62l-.756 4.788h-2.52l1.44-9.108h4.476zm-6.48 0c.492 0 .924.09 1.296.27.372.18.696.432.972.756.276.324.492.708.648 1.152.156.444.264.936.324 1.476.06.54.084 1.116.072 1.728-.012.612-.06 1.224-.144 1.836-.084.612-.216 1.188-.396 1.728-.18.54-.408 1.02-.684 1.44-.276.42-.6.756-.972 1.008-.372.252-.804.378-1.296.378H9.47l-.756 4.788H6.194l1.44-9.108h5.953zM7.694 2.4h7.2c.576 0 1.08.096 1.512.288.432.192.804.456 1.116.792.312.336.552.732.72 1.188.168.456.276.948.324 1.476.048.528.048 1.068 0 1.62-.048.552-.156 1.068-.324 1.548-.168.48-.408.912-.72 1.296-.312.384-.684.684-1.116.9-.432.216-.936.324-1.512.324H9.47L7.694 2.4z" />
              </svg>
              PayPal
            </span>
          </div>
          <p className="mt-2 text-xs text-stone-500">
            Secure payments. Cancel anytime from your Stripe or PayPal account.
          </p>
        </div>

        <PricingFaq />
      </main>

      <Footer />
    </div>
  );
}

function PricingFaqItem({ question, answer, isOpen, onToggle }) {
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

function PricingFaq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="mx-auto mt-16 max-w-3xl sm:mt-20">
      <div className="text-center">
        <span className="text-sm font-bold uppercase tracking-wider text-brand-600">
          Pricing FAQ
        </span>
        <h2 className="mt-2 text-2xl font-extrabold text-stone-900 sm:text-3xl">
          Questions about our plans
        </h2>
        <p className="mt-3 text-sm text-stone-600 sm:text-base">
          Everything you need to know before upgrading to Pro.
        </p>
      </div>

      <div className="mt-8 space-y-3">
        {PRICING_FAQ.map((item, index) => (
          <PricingFaqItem
            key={item.question}
            question={item.question}
            answer={item.answer}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
          />
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-stone-500">
        Still have questions?{' '}
        <Link to="/contact-us" className="font-semibold text-brand-600 hover:text-brand-700">
          Contact our support team
        </Link>
      </p>
    </section>
  );
}

function PricingCard({ plan }) {
  const [loadingMethod, setLoadingMethod] = useState(null);
  const [error, setError] = useState('');

  const handleStripe = async () => {
    setLoadingMethod('stripe');
    setError('');

    try {
      const { url } = await createCheckoutSession(plan.id);
      if (url) window.location.href = url;
    } catch (err) {
      setError(err.message || 'Could not connect to payment server. Run npm run dev.');
      setLoadingMethod(null);
    }
  };

  const handlePayPal = async () => {
    setLoadingMethod('paypal');
    setError('');

    try {
      const { url } = await createPayPalSubscription(plan.id);
      if (url) window.location.href = url;
    } catch (err) {
      setError(err.message || 'Could not connect to PayPal. Run npm run dev.');
      setLoadingMethod(null);
    }
  };

  return (
    <div
      className={`relative flex flex-col rounded-3xl border bg-white p-8 shadow-card ${
        plan.highlighted
          ? 'border-brand-300 ring-2 ring-brand-400/30'
          : 'border-stone-200'
      }`}
    >
      {plan.badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-4 py-1 text-xs font-bold uppercase tracking-wide text-white">
          {plan.badge}
        </span>
      )}

      <h2 className="whitespace-nowrap text-xl font-extrabold text-stone-900">{plan.name}</h2>
      <div className="mt-4 flex flex-wrap items-baseline gap-x-1 gap-y-0.5">
        <span className="text-4xl font-extrabold leading-none text-stone-900">{plan.price}</span>
        <span className="text-sm font-semibold text-stone-500">{plan.period}</span>
      </div>
      <p className="mt-2 whitespace-nowrap text-sm font-medium text-brand-700">{plan.billing}</p>

      <ul className="mt-8 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm text-stone-700">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-8 space-y-3">
        <button
          type="button"
          onClick={handleStripe}
          disabled={Boolean(loadingMethod)}
          className={`w-full rounded-2xl py-3.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
            plan.highlighted
              ? 'bg-brand-600 text-white hover:bg-brand-700'
              : 'border-2 border-brand-600 text-brand-700 hover:bg-brand-50'
          }`}
        >
          {loadingMethod === 'stripe' ? 'Redirecting to Stripe…' : 'Pay with Card — Stripe'}
        </button>

        <button
          type="button"
          onClick={handlePayPal}
          disabled={Boolean(loadingMethod)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#003087]/20 bg-[#003087]/5 py-3.5 text-sm font-bold text-[#003087] transition hover:bg-[#003087]/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loadingMethod === 'paypal' ? (
            'Redirecting to PayPal…'
          ) : (
            <>
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.694 2.4h7.2c.576 0 1.08.096 1.512.288.432.192.804.456 1.116.792.312.336.552.732.72 1.188.168.456.276.948.324 1.476.048.528.048 1.068 0 1.62-.048.552-.156 1.068-.324 1.548-.168.48-.408.912-.72 1.296-.312.384-.684.684-1.116.9-.432.216-.936.324-1.512.324H9.47L7.694 2.4zm12.373 6.078c.492 0 .924.09 1.296.27.372.18.696.432.972.756.276.324.492.708.648 1.152.156.444.264.936.324 1.476.06.54.084 1.116.072 1.728-.012.612-.06 1.224-.144 1.836-.084.612-.216 1.188-.396 1.728-.18.54-.408 1.02-.684 1.44-.276.42-.6.756-.972 1.008-.372.252-.804.378-1.296.378h-1.62l-.756 4.788h-2.52l1.44-9.108h4.476z" />
              </svg>
              Pay with PayPal
            </>
          )}
        </button>
      </div>

      {error && (
        <p className="mt-3 text-center text-xs font-medium text-red-600">{error}</p>
      )}
    </div>
  );
}

export default Pricing;
