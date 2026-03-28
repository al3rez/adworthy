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
    // Use service role key for database operations to bypass RLS
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Read the request body once and store it
    const body = await req.json();
    const { images, prompt, userId } = body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      throw new Error('No valid images provided');
    }

    // Create FormData for OpenAI API
    const formData = new FormData();
    formData.append('model', 'gpt-image-1');
    formData.append('prompt', prompt);
    formData.append('n', '1');
    formData.append('size', '1024x1024');

    // Add each image to the form data
    for (let i = 0; i < images.length; i++) {
      const imageResponse = await fetch(images[i]);
      const imageBlob = await imageResponse.blob();
      formData.append('image[]', imageBlob, `image${i}.png`);
    }

    // Call OpenAI API directly
    const response = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const result = await response.json();
    console.log('OpenAI API result:', JSON.stringify(result, null, 2));
    
    // Convert base64 to blob
    const base64Data = result.data[0].b64_json;
    const binaryData = atob(base64Data);
    const arrayBuffer = new ArrayBuffer(binaryData.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < binaryData.length; i++) {
      uint8Array[i] = binaryData.charCodeAt(i);
    }
    const imageBlob = new Blob([arrayBuffer], { type: 'image/png' });

    // Store the generated ad in Supabase storage
    const { data: storageData, error: storageError } = await supabaseClient
      .storage
      .from('generated-ads')
      .upload(`${userId}/${Date.now()}.png`, imageBlob, {
        contentType: 'image/png',
        upsert: true
      })

    if (storageError) throw storageError

    // Create a record in the generated_ads table
    const { data: dbData, error: dbError } = await supabaseClient
      .from('generated_ads')
      .update({
        image_url: storageData.path,
        status: 'completed'
      })
      .eq('id', body.generatedAdId)
      .select()
      .single()

    if (dbError) throw dbError

    return new Response(
      JSON.stringify({ success: true, data: dbData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in generate-ad function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})