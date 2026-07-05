import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { createCheckoutSession } from '../services/stripeApi';

function Checkout() {
  const { plan } = useParams();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function startCheckout() {
      if (plan !== 'monthly' && plan !== 'yearly') {
        setError('Invalid plan selected.');
        setLoading(false);
        return;
      }

      try {
        const { url } = await createCheckoutSession(plan);
        if (!cancelled && url) {
          window.location.href = url;
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Could not start checkout. Is the payment server running?');
          setLoading(false);
        }
      }
    }

    startCheckout();
    return () => {
      cancelled = true;
    };
  }, [plan]);

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />
      <main className="section-container flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
        {loading && !error ? (
          <>
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
            <p className="mt-4 text-sm font-semibold text-stone-600">Redirecting to secure checkout…</p>
          </>
        ) : (
          <>
            <p className="text-sm font-semibold text-red-600">{error}</p>
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

export default Checkout;
