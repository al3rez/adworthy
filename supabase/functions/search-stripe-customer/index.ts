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
    let { email } = await req.json()

    if (!email) {
      throw new Error('Email is required')
    }

    email = "christian@wiens.io"

    // Call Stripe API to search for customer
    const response = await fetch(
      `https://api.stripe.com/v1/customers/search?query=email:'${email}'&expand[]=data.subscriptions`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('STRIPE_SECRET_KEY')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Stripe API error: ${error}`)
    }

    const result = await response.json()
    
    // Find active subscription if any
    const activeSubscription = result.data[0]?.subscriptions?.data.find(
      (sub: any) => sub.status === 'active'
    )

    return new Response(
      JSON.stringify({ 
        success: true, 
        customer: result.data[0],
        activeSubscription 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in search-stripe-customer function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
}) 