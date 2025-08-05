import axios from "axios";
import { data } from "./constants";

const GROQ_API_KEY: string | undefined =
  process.env.GROQ_API_KEY || "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"; // Replace with your real key

const MODEL = "llama3-8b-8192"; // Free and strong, other option: "mixtral-8x7b-32768"

// Utility function to clean unwanted characters and markdown from response
function cleanResponse(text: string): string {
  return text
    .replace(/[@#_*~`>\\-]+/g, "")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/\n{2,}/g, "\n")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export const conversationalBot = async (input: string): Promise<string> => {
  try {
    if (!input || !input.trim()) {
      return "Please provide a valid input query.";
    }

    if (!GROQ_API_KEY) {
      throw new Error("GROQ API key missing.");
    }

    const systemMessage = `You are a highly experienced and empathetic medical doctor.
Your goal is to help users navigate website services using this data and provide accurate medical advice.
Use the following data for navigation questions:
${JSON.stringify(data)}`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
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
          Authorization: `Bearer ${GROQ_API_KEY}`,
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
      return "Authentication failed. Please check your GROQ API key.";
    }
    if (error?.response?.status === 429) {
      return "Rate limit exceeded. Please try again later.";
    }
    return "Sorry, an error occurred. Please try again.";
  }
};
