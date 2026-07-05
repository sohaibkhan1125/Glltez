import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { verifyCheckoutSession } from '../services/stripeApi';
import { verifyPayPalSubscription } from '../services/paypalApi';
import { activatePro } from '../utils/toolUsage';

function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [plan, setPlan] = useState('');

  useEffect(() => {
    const provider = searchParams.get('provider');
    const sessionId = searchParams.get('session_id');
    const subscriptionId = searchParams.get('subscription_id');

    async function confirmPayment() {
      try {
        if (provider === 'paypal' || subscriptionId) {
          const id = subscriptionId || searchParams.get('ba_token');
          if (!id) {
            setStatus('error');
            return;
          }

          const data = await verifyPayPalSubscription(id);
          activatePro({
            plan: data.plan,
            periodEnd: data.periodEnd,
            subscriptionId: data.subscriptionId,
            customerId: data.customerId,
            provider: 'paypal',
          });
          setPlan(data.plan === 'yearly' ? 'Yearly Pro' : 'Monthly Pro');
          setStatus('success');
          return;
        }

        if (sessionId) {
          const data = await verifyCheckoutSession(sessionId);
          activatePro({
            plan: data.plan,
            periodEnd: data.periodEnd,
            subscriptionId: data.subscriptionId,
            customerId: data.customerId,
            sessionId,
            provider: 'stripe',
          });
          setPlan(data.plan === 'yearly' ? 'Yearly Pro' : 'Monthly Pro');
          setStatus('success');
          return;
        }

        setStatus('error');
      } catch {
        setStatus('error');
      }
    }

    confirmPayment();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />
      <main className="section-container flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
        {status === 'loading' && (
          <>
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
            <p className="mt-4 text-sm font-semibold text-stone-600">Confirming your subscription…</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-700">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="mt-6 text-2xl font-extrabold text-stone-900">Welcome to {plan}!</h1>
            <p className="mt-2 max-w-md text-sm text-stone-600">
              Your subscription is active. You now have unlimited access to all ToolNexa tools on this browser.
            </p>
            <Link to="/ai-tools" className="btn-primary mt-8">
              Start Using Tools
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <h1 className="text-xl font-extrabold text-stone-900">Verification failed</h1>
            <p className="mt-2 text-sm text-stone-600">We could not confirm your payment. Please contact support.</p>
            <Link to="/pricing" className="btn-primary mt-6">
              Back to Pricing
            </Link>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default CheckoutSuccess;
