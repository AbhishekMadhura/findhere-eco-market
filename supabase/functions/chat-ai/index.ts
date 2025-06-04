
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

    console.log('Processing chat request with message:', message)

    // Use a more reliable conversational model
    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUGGING_FACE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {
          past_user_inputs: conversationHistory
            .filter(msg => msg.role === 'user')
            .map(msg => msg.content)
            .slice(-3), // Keep last 3 exchanges for context
          generated_responses: conversationHistory
            .filter(msg => msg.role === 'assistant')
            .map(msg => msg.content)
            .slice(-3),
          text: message
        },
        parameters: {
          max_length: 200,
          min_length: 10,
          temperature: 0.8,
          do_sample: true,
          top_p: 0.9,
          repetition_penalty: 1.2,
        },
        options: {
          wait_for_model: true,
          use_cache: false
        }
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Hugging Face API error: ${response.status} - ${errorText}`)
      
      // Fallback response for common marketplace questions
      const fallbackResponse = getFallbackResponse(message)
      return new Response(
        JSON.stringify({ response: fallbackResponse }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const data = await response.json()
    console.log('Hugging Face response:', data)
    
    let aiResponse = "I'm here to help with your marketplace needs!"
    
    if (data.generated_text) {
      aiResponse = data.generated_text
    } else if (Array.isArray(data) && data[0]?.generated_text) {
      aiResponse = data[0].generated_text
    }

    // Clean up the response
    aiResponse = cleanResponse(aiResponse, message)

    // Add marketplace context
    const contextualResponse = addMarketplaceContext(aiResponse, message)

    return new Response(
      JSON.stringify({ response: contextualResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in chat-ai function:', error)
    
    // Return a helpful fallback response
    const fallbackMessage = "I'm here to help you with RentHere! You can ask me about finding products, posting listings, sustainable shopping tips, or anything else related to our eco-friendly marketplace. What would you like to know?"
    
    return new Response(
      JSON.stringify({ response: fallbackMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function getFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('rent') || lowerMessage.includes('rental')) {
    return "I can help you find rental items! Use our search filters to find products available for rent in your area. What type of item are you looking to rent?"
  }
  
  if (lowerMessage.includes('sell') || lowerMessage.includes('selling')) {
    return "Great! To sell items on RentHere, click 'Sell/Rent' in the navigation. Make sure to add clear photos and detailed descriptions to attract buyers!"
  }
  
  if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
    return "For pricing tips: research similar items, consider condition and demand, and don't forget that competitive pricing attracts more buyers!"
  }
  
  if (lowerMessage.includes('eco') || lowerMessage.includes('environment')) {
    return "Every purchase on RentHere helps the environment! By buying pre-owned items, you're reducing waste and carbon emissions. Check out the CO₂ saved indicator on products!"
  }
  
  return "Hello! I'm your RentHere assistant. I can help you with finding products, listing items, eco-friendly shopping tips, and navigating our marketplace. What can I help you with today?"
}

function cleanResponse(response: string, originalMessage: string): string {
  // Remove common artifacts from generated text
  let cleaned = response.replace(/^\s*[\[\](){}]+\s*/, '') // Remove leading brackets
  cleaned = cleaned.replace(/\s*[\[\](){}]+\s*$/, '') // Remove trailing brackets
  cleaned = cleaned.replace(/^(user:|assistant:|human:|ai:)/i, '') // Remove role prefixes
  cleaned = cleaned.trim()
  
  // If response is too short or just repeats the input, provide a default
  if (cleaned.length < 10 || cleaned.toLowerCase() === originalMessage.toLowerCase()) {
    return "I understand you're asking about that. Let me help you with your RentHere marketplace needs!"
  }
  
  return cleaned
}

function addMarketplaceContext(response: string, originalMessage: string): string {
  const lowerMessage = originalMessage.toLowerCase()
  
  // Add relevant marketplace context based on the question
  if (lowerMessage.includes('how') && (lowerMessage.includes('buy') || lowerMessage.includes('purchase'))) {
    return `${response} To get started, browse our products or use the search feature to find what you need!`
  }
  
  if (lowerMessage.includes('where') || lowerMessage.includes('location')) {
    return `${response} You can check the 'Nearby' section to see products in your area with their exact distances!`
  }
  
  return `${response} Feel free to explore our eco-friendly marketplace and let me know if you need help with anything else!`
}
