const PAYPAL_API_BASE =
  process.env.PAYPAL_MODE === 'sandbox'
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com';

let accessToken = null;
let tokenExpiresAt = 0;
const planCache = new Map();

async function getAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials are not configured.');
  }

  if (accessToken && Date.now() < tokenExpiresAt - 60_000) {
    return accessToken;
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error_description || data.message || 'Failed to authenticate with PayPal.');
  }

  accessToken = data.access_token;
  tokenExpiresAt = Date.now() + data.expires_in * 1000;
  return accessToken;
}

async function paypalRequest(path, options = {}) {
  const token = await getAccessToken();
  const response = await fetch(`${PAYPAL_API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = data.details?.[0]?.description || data.message || data.name;
    throw new Error(detail || 'PayPal request failed.');
  }

  return data;
}

async function getOrCreateProduct() {
  const existing = process.env.PAYPAL_PRODUCT_ID;
  if (existing) return existing;

  const product = await paypalRequest('/v1/catalogs/products', {
    method: 'POST',
    body: JSON.stringify({
      name: 'ToolNexa Pro',
      description: 'Unlimited access to all ToolNexa online tools',
      type: 'SERVICE',
      category: 'SOFTWARE',
    }),
  });

  return product.id;
}

async function createBillingPlan({ planKey, name, price, intervalUnit }) {
  const productId = await getOrCreateProduct();

  const plan = await paypalRequest('/v1/billing/plans', {
    method: 'POST',
    body: JSON.stringify({
      product_id: productId,
      name,
      description: name,
      billing_cycles: [
        {
          frequency: {
            interval_unit: intervalUnit,
            interval_count: 1,
          },
          tenure_type: 'REGULAR',
          sequence: 1,
          total_cycles: 0,
          pricing_scheme: {
            fixed_price: {
              value: price,
              currency_code: 'USD',
            },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee_failure_action: 'CONTINUE',
        payment_failure_threshold: 3,
      },
    }),
  });

  await paypalRequest(`/v1/billing/plans/${plan.id}/activate`, { method: 'POST' });
  planCache.set(planKey, plan.id);
  return plan.id;
}

async function getPlanId(planKey) {
  if (planCache.has(planKey)) {
    return planCache.get(planKey);
  }

  const envMap = {
    monthly: process.env.PAYPAL_MONTHLY_PLAN_ID,
    yearly: process.env.PAYPAL_YEARLY_PLAN_ID,
  };

  if (envMap[planKey]) {
    planCache.set(planKey, envMap[planKey]);
    return envMap[planKey];
  }

  const planConfig = {
    monthly: {
      name: 'ToolNexa Monthly Pro',
      price: '4.99',
      intervalUnit: 'MONTH',
    },
    yearly: {
      name: 'ToolNexa Yearly Pro',
      price: '39.99',
      intervalUnit: 'YEAR',
    },
  };

  const config = planConfig[planKey];
  if (!config) {
    throw new Error('Invalid plan.');
  }

  return createBillingPlan({ planKey, ...config });
}

async function createPayPalSubscription(plan, clientUrl) {
  const planId = await getPlanId(plan);

  const subscription = await paypalRequest('/v1/billing/subscriptions', {
    method: 'POST',
    body: JSON.stringify({
      plan_id: planId,
      custom_id: plan,
      application_context: {
        brand_name: 'ToolNexa',
        locale: 'en-US',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'SUBSCRIBE_NOW',
        payment_method: {
          payer_selected: 'PAYPAL',
          payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED',
        },
        return_url: `${clientUrl}/checkout/success?provider=paypal`,
        cancel_url: `${clientUrl}/checkout/cancel`,
      },
    }),
  });

  const approveLink = subscription.links?.find((link) => link.rel === 'approve');
  if (!approveLink?.href) {
    throw new Error('PayPal approval link not returned.');
  }

  return {
    subscriptionId: subscription.id,
    url: approveLink.href,
  };
}

async function verifyPayPalSubscription(subscriptionId) {
  const subscription = await paypalRequest(`/v1/billing/subscriptions/${subscriptionId}`);

  if (!['ACTIVE', 'APPROVED'].includes(subscription.status)) {
    throw new Error(`PayPal subscription is not active (status: ${subscription.status}).`);
  }

  let plan = subscription.custom_id;
  if (plan !== 'monthly' && plan !== 'yearly') {
    const planId = subscription.plan_id || '';
    if (planId === planCache.get('yearly') || planId === process.env.PAYPAL_YEARLY_PLAN_ID) {
      plan = 'yearly';
    } else {
      plan = 'monthly';
    }
  }

  const nextBilling = subscription.billing_info?.next_billing_time;
  const periodEnd = nextBilling ? Math.floor(new Date(nextBilling).getTime() / 1000) : null;

  return {
    success: true,
    plan,
    subscriptionId: subscription.id,
    customerId: subscription.subscriber?.payer_id || null,
    periodEnd,
    provider: 'paypal',
    status: subscription.status,
  };
}

module.exports = {
  createPayPalSubscription,
  verifyPayPalSubscription,
};
