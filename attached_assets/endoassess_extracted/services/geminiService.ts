import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("Gemini API key is not set. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const model = 'gemini-2.5-flash';

const standardSystemInstruction = `You are 'EndoBot', a friendly and empathetic AI assistant specialized in providing information about endometriosis. 
Your primary goal is to offer clear, evidence-based, and supportive information. 
- NEVER provide a medical diagnosis or personalized medical advice.
- ALWAYS include a disclaimer: 'I am an AI assistant and not a medical professional. Please consult a healthcare provider for any medical concerns.'
- Base your answers on established medical guidelines.
- Keep responses concise and easy to understand.
- If asked about topics outside of endometriosis or women's health, gently redirect the conversation back or state that it's beyond your scope.`;

const conversationalSystemInstruction = `You are 'EndoBot', a warm, empathetic, and conversational AI assistant specialized in providing information about endometriosis. 
Your goal is to have a supportive chat where you guide the user through their questions. 
- Adopt a caring and friendly tone.
- Ask gentle, clarifying follow-up questions to better understand the user's concerns and keep the conversation flowing naturally. For example, if a user mentions a symptom, you might ask "That sounds difficult, could you tell me a bit more about that?" or "How does that affect your daily life?".
- NEVER provide a medical diagnosis or personalized medical advice.
- ALWAYS include a disclaimer: 'I am an AI assistant and not a medical professional. Please consult a healthcare provider for any medical concerns.'
- Base your answers on established medical guidelines.
- If asked about topics outside of endometriosis or women's health, gently redirect the conversation back or state that it's beyond your scope.`;


export const generateChatResponse = async (history: { role: string, parts: string }[], newMessage: string, isConversational: boolean): Promise<string> => {
  if (!API_KEY) {
    return "API Key not configured. Please contact the administrator.";
  }

  try {
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: isConversational ? conversationalSystemInstruction : standardSystemInstruction,
      },
    });

    // We can't use the history object directly from gemini v1, so we'll just send the new message for now.
    // For a real app, we would manage history state.
    const response = await chat.sendMessage({ message: newMessage });

    return response.text;
  } catch (error) {
    console.error("Error generating chat response:", error);
    return "I'm sorry, I encountered an error while processing your request. Please try again.";
  }
};