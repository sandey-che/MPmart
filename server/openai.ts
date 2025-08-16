import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export async function getChatbotResponse(
  message: string,
  context?: string
): Promise<string> {
  try {
    const systemPrompt = `You are a helpful customer support assistant for Modern Pride Super Mart, a grocery store. 
    You help customers with:
    - Product information and availability
    - Order status and tracking
    - Delivery information
    - Store policies and return information
    - General grocery shopping questions
    
    Be friendly, helpful, and concise. If you don't know specific information about products or orders, 
    suggest the customer contact a human representative or check their account.
    
    ${context ? `Context: ${context}` : ''}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: message,
        },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't process your message. Please try again.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    return "I'm experiencing technical difficulties. Please contact our support team for assistance.";
  }
}

export async function generateProductRecommendations(
  customerData: {
    previousPurchases?: string[];
    currentCartItems?: string[];
    preferences?: string[];
  }
): Promise<{ recommendations: string[]; reasoning: string }> {
  try {
    const prompt = `Based on the following customer data, recommend 3-5 grocery products that would be relevant for this customer:
    
    Previous purchases: ${customerData.previousPurchases?.join(', ') || 'None'}
    Current cart items: ${customerData.currentCartItems?.join(', ') || 'None'}
    Preferences: ${customerData.preferences?.join(', ') || 'None'}
    
    Respond with JSON in this format: { "recommendations": ["product1", "product2", "product3"], "reasoning": "explanation" }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      recommendations: result.recommendations || [],
      reasoning: result.reasoning || "Based on general preferences",
    };
  } catch (error) {
    console.error("OpenAI recommendation error:", error);
    return {
      recommendations: [],
      reasoning: "Unable to generate recommendations at this time",
    };
  }
}
