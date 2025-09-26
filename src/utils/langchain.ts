import { Groq } from "groq-sdk";
import axios from "axios";

// ===================== Groq SDK =====================
const groq = new Groq({ 
  apiKey: "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",
  dangerouslyAllowBrowser: true
});

// ===================== Static Navigation Data =====================
const data = {
  navigation: [
    {
      category: ["book appointment", "schedule appointment", "appointment slot", "reserve doctor"],
      response: "You can book a medical appointment at https://emp-health-frontend.vercel.app/health/appointments"
    },
    {
      category: ["list doctors", "show doctors", "available doctors", "specialists", "physicians"],
      response: "You can view our list of doctors at https://emp-health-frontend.vercel.app/health/doctors"
    },
    {
      category: ["hospital info", "clinic info", "contact hospital", "clinic contact"],
      response: "Find hospital or clinic information at https://emp-health-frontend.vercel.app/health/contact"
    },
    {
      category: ["services", "medical services", "available services"],
      response: "Check the medical services we provide at https://emp-health-frontend.vercel.app/health/services"
    },
    {
      category: ["health tips", "medical advice", "wellness tips"],
      response: "Read health tips and advice at https://emp-health-frontend.vercel.app/health/tips"
    }
  ]
};

// ===================== Fetch Doctors Function =====================
const fetchDoctors = async (): Promise<{ name: string; specialty: string }[]> => {
  try {
    const res = await axios.get("http://empolyee-backedn.onrender.com/api/all-doctors", {
      timeout: 5000, // 5-second timeout to avoid hanging
      headers: { Accept: "application/json" } // Ensure JSON response
    });
    // Validate response and map to expected format
    if (Array.isArray(res.data.doctors)) {
      return res.data.doctors.map((doc: any) => ({
        name: doc.name || "Unknown Doctor",
        specialty: doc.department || "General Physician"
      }));
    }
    console.warn("Unexpected response format from /api/all-doctors:", res.data);
    return [];
  } catch (err: any) {
    console.error("Error fetching doctors:", err.message);
    if (err.response?.status === 404) {
      console.error("Endpoint not found: /api/all-doctors. Check backend configuration.");
    } else if (err.code === "ECONNABORTED") {
      console.error("Request to /api/all-doctors timed out.");
    }
    // Fallback mock data for testing
    return [
      { name: "Dr. John Doe", specialty: "Cardiology" },
      { name: "Dr. Jane Smith", specialty: "Pediatrics" }
    ];
  }
};

// ===================== Conversational Bot =====================
export const conversationalBot = async (input: string): Promise<string> => {
  const lowerInput = input.toLowerCase();

  // Doctor queries
  const doctorKeywords = ["available doctor", "available doctors", "list doctor", "list doctors", "show doctor", "show doctors", "specialist", "specialists", "physician", "physicians", "doc", "docs"];
  if (doctorKeywords.some(k => lowerInput.includes(k))) {
    const doctors = await fetchDoctors();
    if (doctors.length > 0) {
      const doctorList = doctors.map(d => `${d.name} (${d.specialty})`).join(", ");
      return `Available doctors: ${doctorList}. View more at https://emp-health-frontend.vercel.app/health/doctors`;
    }
    return "No doctors available right now. Please try again later or visit https://emp-health-frontend.vercel.app/health/doctors";
  }

  // Navigation shortcuts
  for (const nav of data.navigation) {
    if (nav.category.some(cat => lowerInput.includes(cat.toLowerCase()))) {
      return nav.response;
    }
  }

  // ===================== Groq Chat Fallback =====================
  try {
    let finalResponse = "";
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: input }],
      model: "openai/gpt-oss-20b",
      temperature: 0.7,
      max_completion_tokens: 2048,
      top_p: 0.95,
      stream: true
    });

    for await (const chunk of chatCompletion) {
      finalResponse += chunk.choices[0]?.delta?.content || "";
      if (finalResponse.length > 400) break; // Limit response length
    }

    // Truncate final response to max 400 characters
    finalResponse = finalResponse.slice(0, 400).replace(/\*|\[|\]|\(|\)/g, "");
    return finalResponse || "Sorry, I could not generate a response.";
  } catch (err) {
    console.error("Groq SDK error:", err);
    return "Sorry, I could not generate a response.";
  }
};