import axios from "axios";

// Your GROQ API key (replace or set via env)
const GROQ_API_KEY: string | undefined =
  process.env.GROQ_API_KEY || "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";

const MODEL = "llama3-8b-8192"; // You can also try "mixtral-8x7b-32768"

// Utility function to clean unwanted characters and markdown from response
function cleanResponse(text: string): string {
  return text
    .replace(/[@#_*~`>\\-]+/g, "")           // Remove special markdown/symbol chars like @ # * _ ~ ` > \ -
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")    // Convert markdown links [text](url) => text
    .replace(/<\/?[^>]+(>|$)/g, "")          // Remove HTML tags if any
    .replace(/\n{2,}/g, "\n")                // Replace multiple line breaks with single line break
    .replace(/\s{2,}/g, " ")                 // Replace multiple spaces with single space
    .trim();
}

export const conversationalBotCall = async (input: string): Promise<string> => {
  try {
    if (!input || !input.trim()) {
      return "Please provide a valid input query.";
    }

    if (!GROQ_API_KEY) {
      throw new Error("GROQ API key missing.");
    }

    // Define system prompt for the chatbot
    const systemMessage = `You are a highly experienced and empathetic medical doctor.
Your primary goal is to help users navigate the services provided on a website using the provided data, and to provide accurate medical advice, diagnose symptoms, and suggest treatments while maintaining a compassionate tone.

Add this note at the end of your answer if the user asks about connecting with a doctor via call.`;

    // Call the Groq Chat Completions API
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

    // Clean the bot message of unwanted chars
    botMessage = cleanResponse(botMessage);

    if (!botMessage) {
      return "Sorry, no response generated.";
    }

    return botMessage;
  } catch (error: any) {
    console.error("Error in conversationalBotCall:", error.response?.data || error.message);

    if (error?.response?.status === 401) {
      return "Authentication failed. Please check your GROQ API key.";
    }

    if (error?.response?.status === 429) {
      return "Rate limit exceeded. Please try again later.";
    }

    return "Sorry, an error occurred. Please try again.";
  }
};
