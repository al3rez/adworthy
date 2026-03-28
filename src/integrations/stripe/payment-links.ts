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

    console.log('data', data);

    if (error) throw error;
    return data.activeSubscription;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    throw error;
  }
}; 