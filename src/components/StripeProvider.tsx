"use client";

import { ReactNode } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';

// Make sure to call loadStripe outside of a component's render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripeProviderProps {
  children: ReactNode;
  options?: StripeElementsOptions;
}

export default function StripeProvider({ children, options }: StripeProviderProps) {
  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}
