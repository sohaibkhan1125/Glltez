const API_BASE = process.env.REACT_APP_API_URL || '';

export async function createCheckoutSession(plan) {
  const response = await fetch(`${API_BASE}/api/create-checkout-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to start checkout.');
  }

  return data;
}

export async function verifyCheckoutSession(sessionId) {
  const response = await fetch(`${API_BASE}/api/checkout-session/${sessionId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to verify payment.');
  }

  return data;
}
