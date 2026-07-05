require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');
const { createPayPalSubscription, verifyPayPalSubscription } = require('./paypalHandler');

const PORT = process.env.PORT || 4242;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecret ? new Stripe(stripeSecret) : null;
const priceCache = new Map();

const app = express();

app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

async function getPriceIdForProduct(productId) {
  if (!stripe) {
    throw new Error('Stripe is not configured.');
  }

  if (priceCache.has(productId)) {
    return priceCache.get(productId);
  }

  const prices = await stripe.prices.list({
    product: productId,
    active: true,
    limit: 1,
  });

  const price = prices.data[0];
  if (!price) {
    throw new Error(`No active price found for product ${productId}`);
  }

  priceCache.set(productId, price.id);
  return price.id;
}

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    stripe: Boolean(stripe),
    paypal: Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET),
  });
});

app.post('/api/create-checkout-session', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({ error: 'Stripe is not configured.' });
    }

    const { plan } = req.body;

    const productMap = {
      monthly: process.env.STRIPE_MONTHLY_PRODUCT_ID,
      yearly: process.env.STRIPE_YEARLY_PRODUCT_ID,
    };

    const productId = productMap[plan];
    if (!productId) {
      return res.status(400).json({ error: 'Invalid plan. Use monthly or yearly.' });
    }

    const priceId = await getPriceIdForProduct(productId);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${CLIENT_URL}/checkout/success?provider=stripe&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL}/checkout/cancel`,
      metadata: { plan },
      allow_promotion_codes: true,
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Checkout session error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to create checkout session.' });
  }
});

app.get('/api/checkout-session/:sessionId', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({ error: 'Stripe is not configured.' });
    }

    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId, {
      expand: ['subscription'],
    });

    const subscription = session.subscription;
    const isPaid =
      session.payment_status === 'paid' ||
      session.status === 'complete' ||
      subscription?.status === 'active' ||
      subscription?.status === 'trialing';

    if (!isPaid) {
      return res.status(400).json({ error: 'Payment not completed.' });
    }

    res.json({
      success: true,
      plan: session.metadata?.plan || 'monthly',
      customerId: session.customer,
      subscriptionId: typeof subscription === 'string' ? subscription : subscription?.id,
      periodEnd: typeof subscription === 'object' ? subscription?.current_period_end : null,
      provider: 'stripe',
    });
  } catch (error) {
    console.error('Session verify error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to verify checkout session.' });
  }
});

app.post('/api/paypal/create-subscription', async (req, res) => {
  try {
    const { plan } = req.body;

    if (plan !== 'monthly' && plan !== 'yearly') {
      return res.status(400).json({ error: 'Invalid plan. Use monthly or yearly.' });
    }

    const result = await createPayPalSubscription(plan, CLIENT_URL);
    res.json(result);
  } catch (error) {
    console.error('PayPal subscription error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to create PayPal subscription.' });
  }
});

app.get('/api/paypal/subscription/:subscriptionId', async (req, res) => {
  try {
    const result = await verifyPayPalSubscription(req.params.subscriptionId);
    res.json(result);
  } catch (error) {
    console.error('PayPal verify error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to verify PayPal subscription.' });
  }
});

app.listen(PORT, () => {
  console.log(`Payment server running on http://localhost:${PORT}`);
});
