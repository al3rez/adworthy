import { supabase } from '../supabase/client';

interface CreatePaymentLinkParams {
  priceId: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
}

export const getActiveSubscription = async (email: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('search-stripe-customer', {
      body: { email }
    });

    if (error) throw error;

    // Get the pricing tier information
    const { data: pricingTier, error: pricingError } = await supabase
      .from('pricing_tiers')
      .select('*')
      .eq('stripe_price_id', data.activeSubscription.items.data[0].price.id)
      .single();

    if (pricingError) throw pricingError;

    // Map the pricing tier to the subscription
    return {
      ...data.activeSubscription,
      pricing_tier: {
        name: pricingTier.name,
        credits: pricingTier.credits,
        features: getPlanFeatures(pricingTier.name)
      }
    };
  } catch (error) {
    console.error('Error fetching subscription:', error);
    throw error;
  }
};

const getPlanFeatures = (planName: string): string[] => {
  switch (planName) {
    case 'Starter':
      return [
        '1 credit = 1 ad generation',
        'Style matching from Pinterest',
        'Basic templates',
        '$1.50 per additional credit'
      ];
    case 'Pro':
      return [
        'Everything in Starter',
        'All templates',
        'A/B testing',
        '$1.25 per additional credit'
      ];
    case 'Enterprise':
      return [
        'Everything in Pro',
        'Priority support',
        'Facebook Ads API',
        '$1.00 per additional credit'
      ];
    default:
      return [];
  }
}; 