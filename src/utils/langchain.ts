import axios from "axios";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const OPENROUTER_API_KEY: string | undefined =
  process.env.OPENROUTER_API_KEY ||
  "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"; // Replace with your real key

// Example OpenRouter model
const MODEL = "meta-llama/llama-3-70b-instruct";

// Navigation data
const navigation = [
  {
    category: [
      "I want to book an appointment",
      "How can I schedule an appointment?",
      "Book a doctor's appointment",
    ],
    response:
      "You can book an appointment [here](https://emp-health-frontend.vercel.app/health/appointments).",
    link: "https://emp-health-frontend.vercel.app/health/appointments",
  },
  {
    category: ["Show me the list of doctors", "I want to see doctors", "Doctors available"],
    response:
      "You can view the list of doctors [here](https://emp-health-frontend.vercel.app/health/doctors).",
    link: "https://emp-health-frontend.vercel.app/health/doctors",
  },
  {
    category: ["Go to Dashboard", "Show me the dashboard", "Open dashboard"],
    response:
      "You can access the dashboard [here](https://emp-health-frontend.vercel.app/health).",
    link: "https://emp-health-frontend.vercel.app/health",
  },
  {
    category: ["Open chat", "Go to my inbox", "I want to send a message"],
    response: "You can open your inbox [here](https://emp-health-frontend.vercel.app/inbox).",
    link: "https://emp-health-frontend.vercel.app/inbox",
  },
  {
    category: ["Show wellness courses", "I want to see wellness content", "Go to wellness"],
    response:
      "You can access the wellness section [here](https://emp-health-frontend.vercel.app/wellness).",
    link: "https://emp-health-frontend.vercel.app/wellness",
  },
  {
    category: ["Show safety dashboard", "Open safety section", "Go to safety"],
    response:
      "You can view the safety dashboard [here](https://emp-health-frontend.vercel.app/safety).",
    link: "https://emp-health-frontend.vercel.app/safety",
  },
  {
    category: [
      "I want to schedule an appointment for an admin",
      "Admin schedule appointment",
      "Schedule appointment for doctor",
    ],
    response:
      "You can schedule an appointment [here](https://emp-health-frontend.vercel.app/health/admin-schedule-appointments).",
    link: "https://emp-health-frontend.vercel.app/health/admin-schedule-appointments",
  },
  {
    category: ["Schedule appointment for doctor"],
    response:
      "You can schedule an appointment [here](https://emp-health-frontend.vercel.app/health/doctor-schedule-appointments).",
    link: "https://emp-health-frontend.vercel.app/health/doctor-schedule-appointments",
  },
  {
    category: ["Show notifications", "Go to notifications", "Open notification section"],
    response:
      "You can view notifications [here](https://emp-health-frontend.vercel.app/health/notification).",
    link: "https://emp-health-frontend.vercel.app/health/notification",
  },
  {
    category: [
      "Show insurance details",
      "Go to insurance section",
      "I want to see insurance information",
    ],
    response:
      "You can view insurance information [here](https://emp-health-frontend.vercel.app/health/insurance).",
    link: "https://emp-health-frontend.vercel.app/health/insurance",
  },
];

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

// Fetch doctors from the API
async function fetchDoctors(): Promise<any[]> {
  try {
    const response = await axios.get(
      "https://empolyee-backedn.onrender.com/api/all-doctors"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return [];
  }
}

export const conversationalBot = async (input: string): Promise<string> => {
  try {
    if (!input || !input.trim()) {
      return "Please provide a valid input query.";
    }

    if (!OPENROUTER_API_KEY) {
      throw new Error("OpenRouter API key missing.");
    }

    // Fetch doctors dynamically
    const doctors = await fetchDoctors();

    // Initialize LangChain with OpenRouter model
    const llm = new ChatOpenAI({
      openAIApiKey: OPENROUTER_API_KEY,
      model: MODEL,
      temperature: 0.7,
      maxTokens: 512,
      configuration: {
        baseURL: "https://openrouter.ai/api/v1",
      },
    });

    // Create prompt template
    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are a highly experienced and empathetic medical doctor.
Your goal is to help users navigate website services and provide accurate medical advice.
Use the following navigation data for navigation questions:
${JSON.stringify(navigation, null, 2)}
For doctor-related queries, use the following doctor data:
${JSON.stringify(doctors, null, 2)}
Provide concise and accurate responses. For navigation queries, return the appropriate link from the navigation data. For doctor-related queries, use the fetched doctor data to provide details. If the query doesn't match any navigation or doctor data, provide a helpful general response.`,
      ],
      ["human", "{input}"],
    ]);

    // Create chain
    const chain = prompt.pipe(llm).pipe(new StringOutputParser());

    // Invoke chain with user input
    let botMessage = await chain.invoke({ input });

    // Clean response
    botMessage = cleanResponse(botMessage);

    if (!botMessage) {
      return "Sorry, no response generated.";
    }

    return botMessage;
  } catch (error: any) {
    console.error("Error in conversationalBot:", error.message);

    if (error?.response?.status === 400) {
      return `Bad Request: ${JSON.stringify(error.response.data, null, 2)}`;
    }
    if (error?.response?.status === 401) {
      return "Authentication failed. Please check your OpenRouter API key.";
    }
    if (error?.response?.status === 429) {
      return "Rate limit exceeded. Please try again later.";
    }
    return "Sorry, an error occurred. Please try again.";
  }
};
