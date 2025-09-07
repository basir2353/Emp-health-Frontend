import axios from "axios";

// ================== NAVIGATION ==================
const navigationText = `
Booking options:
- "I want to book an appointment" → You can book here: https://emp-health-frontend.vercel.app/health/appointments
- "Show me the list of doctors" → You can view doctors here: https://emp-health-frontend.vercel.app/health/doctors
`;

// ================== UTILITY ==================
function cleanResponse(text: string): string {
  return text
    .replace(/[@#_*~`>\\-]+/g, "")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/\n{2,}/g, "\n")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// ================== BOT FUNCTION ==================
export const conversationalBot = async (input: string): Promise<string> => {
  if (!input || !input.trim()) return "Please provide a valid input query.";

  const HF_API_KEY = process.env.NEXT_PUBLIC_HF_API_KEY || "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";
  const HF_MODEL = "tiiuae/falcon-7b-instruct";

  const prompt = `
You are a helpful and empathetic medical assistant.
Use the following navigation options for guidance:
${navigationText}

If the query doesn’t match, provide a short, helpful response.

Question: ${input}
Answer:
`;

  try {
    console.log("=== Hugging Face Request ===");
    console.log("Prompt (truncated):", prompt.slice(0, 300) + "...");
    console.log("============================");

    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${HF_MODEL}`,
      { inputs: prompt, parameters: { max_new_tokens: 150, temperature: 0.7 } },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 60000, // 60s
      }
    );

    console.log("=== Hugging Face Response ===");
    console.log(response.data);
    console.log("============================");

    return cleanResponse(response.data?.[0]?.generated_text?.replace(prompt, "").trim() || "");
  } catch (error: any) {
    console.error("HF Proxy Error:", error?.response?.data || error.message);
    return "Sorry, an error occurred. Please try again.";
  }
};
