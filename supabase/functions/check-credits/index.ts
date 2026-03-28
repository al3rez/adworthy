import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { user_email, user_id } = await req.json()

    if (!user_email) {
      throw new Error('User email is required')
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Search for customer in Stripe using direct API call
    const stripeResponse = await fetch(
      `https://api.stripe.com/v1/customers/search?query=email:'${user_email}'&expand[]=data.subscriptions`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('STRIPE_SECRET_KEY')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )

    if (!stripeResponse.ok) {
      const error = await stripeResponse.text()
      throw new Error(`Stripe API error: ${error}`)
    }

    const customers = await stripeResponse.json()

    if (!customers.data.length) {
      throw new Error('No Stripe customer found')
    }

    const customer = customers.data[0]
    const activeSubscription = customer.subscriptions?.data.find(
      (sub: any) => sub.status === 'active'
    )

    if (!activeSubscription) {
      throw new Error('No active subscription found')
    }

    // Get the pricing tier for the subscription
    const { data: pricingTier, error: pricingError } = await supabaseClient
      .from('pricing_tiers')
      .select('*')
      .eq('stripe_price_id', activeSubscription.items.data[0].price.id)
      .single()

    if (pricingError || !pricingTier) {
      throw new Error('Invalid pricing tier configuration')
    }

    // Get user's credits
    const { data: userCredits, error: creditsError } = await supabaseClient
      .from('user_credits')
      .select('credits_total, credits_used')
      .eq('user_id', user_id)
      .single()

    if (creditsError) {
      // Initialize credits if no record exists
      const { data: newCredits, error: insertError } = await supabaseClient
        .from('user_credits')
        .insert({
          user_id,
          credits_total: pricingTier.credits,
          credits_used: 0,
        })
        .select()
        .single()

      if (insertError) {
        throw new Error('Failed to initialize credits')
      }

      return new Response(
        JSON.stringify({
          success: true,
          available_credits: pricingTier.credits,
          credits_total: pricingTier.credits,
          credits_used: 0,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const available_credits = userCredits.credits_total - userCredits.credits_used

    return new Response(
      JSON.stringify({
        success: true,
        available_credits,
        credits_total: userCredits.credits_total,
        credits_used: userCredits.credits_used,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in check-credits function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
}) 