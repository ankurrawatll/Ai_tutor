import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "AIzaSyCXQAB86IotxtjBpJUb00SpNae8Cf27k2I" 
});

const SCENARIO_PROMPTS = {
  'free-chat': `You are SpeakGenie, a friendly AI voice tutor for children aged 6-16. You help them practice conversations in a fun, encouraging way. Be supportive, use simple language, and add appropriate emojis. Keep responses concise and engaging. Always ask follow-up questions to keep the conversation flowing.`,
  
  'school': `You are SpeakGenie helping a student practice school conversations. You might be a teacher, classmate, or school staff member. Focus on classroom discussions, presentations, asking questions, and school-related topics. Be encouraging and educational. Use simple language appropriate for ages 6-16.`,
  
  'store': `You are SpeakGenie helping a student practice shopping conversations. You are a store clerk or cashier. Help them practice asking about products, prices, making purchases, and customer service interactions. Be friendly and patient. Use simple language appropriate for ages 6-16.`,
  
  'restaurant': `You are SpeakGenie helping a student practice restaurant conversations. You are a waiter/waitress or restaurant staff. Help them practice ordering food, asking about menu items, making special requests, and dining etiquette. Be welcoming and helpful. Use simple language appropriate for ages 6-16.`,
  
  'airport': `You are SpeakGenie helping a student practice airport and travel conversations. You might be airport staff, security, or airline personnel. Help them practice checking in, asking for directions, going through security, and travel-related questions. Be professional but friendly. Use simple language appropriate for ages 6-16.`,
  
  'home': `You are SpeakGenie helping a student practice home and family conversations. You might be a family member or friend visiting. Focus on daily routines, household topics, family activities, and casual conversations. Be warm and familiar. Use simple language appropriate for ages 6-16.`
};

const FALLBACK_RESPONSES = {
  'free-chat': [
    "That's interesting! Tell me more about that! 😊",
    "I'd love to hear your thoughts on that! What do you think? 🤔",
    "Great question! What would you like to talk about next? ✨"
  ],
  'school': [
    "That's a great question for class! What subject do you enjoy most? 📚",
    "School can be exciting! What's your favorite part of the school day? 🎒",
    "Learning is fun! What new thing would you like to discover today? 🌟"
  ],
  'store': [
    "Welcome to our store! How can I help you find what you're looking for today? 🛍️",
    "That's a popular item! Would you like to know more about it? 💫",
    "Is there anything else I can help you with today? 😊"
  ],
  'restaurant': [
    "Welcome! What would you like to order today? Our specials are delicious! 🍽️",
    "Great choice! Would you like anything to drink with that? 🥤",
    "How is everything tasting? Can I get you anything else? 😊"
  ],
  'airport': [
    "Welcome to the airport! Do you need help finding your gate? ✈️",
    "Have a safe flight! Is there anything else I can help you with? 🧳",
    "The departure board is over there. What destination are you traveling to? 🌍"
  ],
  'home': [
    "How was your day today? Tell me about the best part! 🏠",
    "That sounds fun! What would you like to do next? 😊",
    "Family time is special! What's your favorite activity to do together? ❤️"
  ]
};

export async function getChatResponse(message: string, scenario: string = 'free-chat'): Promise<string> {
  try {
    const systemPrompt = SCENARIO_PROMPTS[scenario as keyof typeof SCENARIO_PROMPTS] || SCENARIO_PROMPTS['free-chat'];
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        maxOutputTokens: 150, // Keep responses concise
        temperature: 0.9, // Make responses more creative and varied
      },
      contents: message,
    });

    const responseText = response.text;
    
    if (responseText && responseText.trim()) {
      return responseText.trim();
    } else {
      throw new Error("Empty response from Gemini");
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    
    // Return smart fallback response based on scenario
    const fallbacks = FALLBACK_RESPONSES[scenario as keyof typeof FALLBACK_RESPONSES] || FALLBACK_RESPONSES['free-chat'];
    const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    
    return randomFallback;
  }
}

export async function generateWelcomeMessage(scenario: string): Promise<string> {
  const welcomePrompts = {
    'free-chat': "Hi there! I'm SpeakGenie, your AI voice tutor! 🧞‍♂️ I'm here to help you practice speaking English. What would you like to talk about today?",
    'school': "Welcome to school practice! 🎓 I'm here to help you practice classroom conversations. Are you ready for today's lesson?",
    'store': "Welcome to our store! 🛍️ I'm here to help you practice shopping conversations. What are you looking for today?",
    'restaurant': "Welcome to our restaurant! 🍽️ I'm your server and I'm here to help you practice ordering. What looks good on our menu?",
    'airport': "Welcome to the airport! ✈️ I'm here to help you practice travel conversations. Where are you flying to today?",
    'home': "Welcome home! 🏠 I'm here to help you practice family conversations. How was your day today?"
  };

  return welcomePrompts[scenario as keyof typeof welcomePrompts] || welcomePrompts['free-chat'];
}
