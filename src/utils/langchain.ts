import axios from "axios";
import { data } from "./constants";

const OPENROUTER_API_KEY: string | undefined =
  process.env.OPENROUTER_API_KEY || "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";
const MODEL = "deepseek/deepseek-chat-v3-0324:free";

// Utility function to clean unwanted characters and markdown from response
function cleanResponse(text: string): string {
  return text
    .replace(/[@#_*~`>\\-]+/g, "")           // Remove special markdown/symbol chars like @ # * _ ~ ` > \ -
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")    // Convert markdown links [text](url) => text
    .replace(/<\/?[^>]+(>|$)/g, "")          // Remove HTML tags if any
    .replace(/\n{2,}/g, "\n")                 // Replace multiple line breaks with single line break
    .replace(/\s{2,}/g, " ")                   // Replace multiple spaces with single space
    .trim();
}

export const conversationalBot = async (input: string): Promise<string> => {
  try {
    if (!input || !input.trim()) {
      return "Please provide a valid input query.";
    }

    if (!OPENROUTER_API_KEY) {
      throw new Error("OpenRouter API key missing.");
    }

    const systemMessage = `You are a highly experienced and empathetic medical doctor.
Your goal is to help users navigate website services using this data and provide accurate medical advice.
Use the following data for navigation questions:
${JSON.stringify(data)}`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: MODEL,
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: input },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    let botMessage = response.data?.choices?.[0]?.message?.content ?? "";

    // Clean the bot message
    botMessage = cleanResponse(botMessage);

    if (!botMessage) {
      return "Sorry, no response generated.";
    }

    return botMessage;
  } catch (error: any) {
    console.error("Error in conversationalBot:", error.response?.data || error.message);
    if (error?.response?.status === 401) {
      return "Authentication failed. Please check your OpenRouter API key.";
    }
    if (error?.response?.status === 429) {
      return "Rate limit exceeded. Please try again later.";
    }
    return "Sorry, an error occurred. Please try again.";
  }
};
