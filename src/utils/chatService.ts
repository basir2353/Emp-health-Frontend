// src/utils/chatService.ts
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, // Use server-side or env variable
});

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Send message to OpenAI and get response
 * @param messages - array of previous messages for context
 */
export const sendMessageToOpenAI = async (messages: ChatMessage[]) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or "gpt-4", "gpt-3.5-turbo"
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      temperature: 0.7,
    });

    return response.choices[0].message?.content || "Sorry, I couldn't understand that.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    return "Something went wrong. Please try again.";
  }
};
