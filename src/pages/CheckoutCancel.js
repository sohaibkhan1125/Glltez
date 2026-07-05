import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function CheckoutCancel() {
  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />

      <main className="section-container flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 text-stone-500">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="mt-6 text-2xl font-extrabold text-stone-900">Checkout cancelled</h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-stone-600">
          Your payment was not completed and no charges were made. You can return to pricing
          anytime to upgrade with Stripe or PayPal.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to="/pricing" className="btn-primary">
            View Pricing Plans
          </Link>
          <Link to="/" className="btn-outline">
            Back to Home
          </Link>
        </div>

        <p className="mt-8 text-xs text-stone-400">
          Need help?{' '}
          <Link to="/contact-us" className="font-semibold text-brand-600 hover:text-brand-700">
            Contact support
          </Link>
        </p>
      </main>

      <Footer />
    </div>
  );
}

export default CheckoutCancel;
