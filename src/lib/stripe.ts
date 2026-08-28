import Stripe from "stripe";

export class StripeConfigurationError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.name = "StripeConfigurationError";
    this.statusCode = statusCode;
  }
}

let stripeInstance: Stripe | null = null;

/**
 * Returns a configured Stripe instance.
 * Throws a clear runtime error if STRIPE_SECRET_KEY is missing.
 */
export function getStripe(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new StripeConfigurationError(
      "Stripe secret key is not configured. Please set STRIPE_SECRET_KEY in environment variables.",
      500
    );
  }

  if (!stripeInstance) {
    stripeInstance = new Stripe(secretKey, {
      apiVersion: "2025-02-24.acacia" as any, // Pin to modern API version
      typescript: true,
    });
  }

  return stripeInstance;
}
