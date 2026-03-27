import { storage } from './storage';
import { getUncachableStripeClient, getStripePublishableKey } from './stripeClient';

export class StripeService {
  async getPublishableKey() {
    return getStripePublishableKey();
  }

  async createCustomer(userId: string, email?: string) {
    const stripe = await getUncachableStripeClient();
    return stripe.customers.create({
      email,
      metadata: { userId },
    });
  }

  async createCheckoutSession(customerId: string, priceId: string, userId: string, baseUrl: string) {
    const stripe = await getUncachableStripeClient();
    return stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      allow_promotion_codes: true,
      subscription_data: {
        trial_period_days: 7,
        metadata: { userId },
      },
      success_url: `${baseUrl}/checkout/success?userId=${userId}`,
      cancel_url: `${baseUrl}/checkout/cancel`,
    });
  }

  async createPortalSession(customerId: string, returnUrl: string) {
    const stripe = await getUncachableStripeClient();
    return stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
  }
}

export const stripeService = new StripeService();
