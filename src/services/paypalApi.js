const API_BASE = process.env.REACT_APP_API_URL || '';

export async function createPayPalSubscription(plan) {
  const response = await fetch(`${API_BASE}/api/paypal/create-subscription`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to start PayPal checkout.');
  }

  return data;
}

export async function verifyPayPalSubscription(subscriptionId) {
  const response = await fetch(`${API_BASE}/api/paypal/subscription/${subscriptionId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to verify PayPal payment.');
  }

  return data;
}
