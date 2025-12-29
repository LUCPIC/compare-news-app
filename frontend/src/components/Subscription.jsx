import React from 'react';
import { loadStripe } from '@stripe/stripe-js';

// In a real app, use an environment variable for the Stripe public key
const stripePromise = loadStripe('your-stripe-public-key');

const Subscription = () => {
  const handleSubscribe = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Handle case where user is not logged in
      return;
    }

    const stripe = await stripePromise;
    const response = await fetch('/api/payments/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });
    const session = await response.json();
    await stripe.redirectToCheckout({ sessionId: session.id });
  };

  return (
    <div className="container mt-4">
      <h2>Premium Subscription</h2>
      <p>Unlock premium features like article summarization and bias detection.</p>
      <button className="btn btn-primary" onClick={handleSubscribe}>
        Subscribe for $9.99
      </button>
    </div>
  );
};

export default Subscription;
