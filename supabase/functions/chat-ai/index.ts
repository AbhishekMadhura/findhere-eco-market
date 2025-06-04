
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

const HUGGING_FACE_TOKEN = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, conversationHistory = [] } = await req.json()

    if (!HUGGING_FACE_TOKEN) {
      return new Response(
        JSON.stringify({ error: 'HUGGING_FACE_ACCESS_TOKEN not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Use a working model - microsoft/DialoGPT-medium
    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUGGING_FACE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {
          past_user_inputs: conversationHistory.filter(msg => msg.role === 'user').map(msg => msg.content).slice(-5),
          generated_responses: conversationHistory.filter(msg => msg.role === 'assistant').map(msg => msg.content).slice(-5),
          text: message
        },
        parameters: {
          max_length: 500,
          temperature: 0.7,
          do_sample: true,
        },
      }),
    })

    if (!response.ok) {
      console.error(`Hugging Face API error: ${response.status}`)
      throw new Error(`Hugging Face API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('Hugging Face response:', data)
    
    let aiResponse = "I'm sorry, I couldn't generate a response."
    
    if (data.generated_text) {
      aiResponse = data.generated_text
    } else if (Array.isArray(data) && data[0]?.generated_text) {
      aiResponse = data[0].generated_text
    }

    // Add context-aware response for marketplace
    const contextualResponse = `As your eco-friendly shopping assistant, ${aiResponse}. Feel free to ask me about sustainable products, pricing advice, or help with listing items!`

    return new Response(
      JSON.stringify({ response: contextualResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
