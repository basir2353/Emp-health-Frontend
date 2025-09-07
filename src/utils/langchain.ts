import OpenAI from "openai";
import axios from "axios";

// ⚠️ For testing only — replace with your actual key
const client = new OpenAI({
  apiKey: "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", // 🔒 replace with env var in production
  dangerouslyAllowBrowser: true, // frontend se call karne ke liye
});

// ===================== Conversational Bot =====================
export const conversationalBot = async (input: string) => {
  const lowerInput = input.toLowerCase();

  // Check for doctor-related queries
  const doctorKeywords = ["available doctors", "list of doctors", "show doctors", "who are the doctors"];
  if (doctorKeywords.some(keyword => lowerInput.includes(keyword))) {
    const doctors = await fetchDoctors();
    if (doctors.length > 0) {
      const doctorList = doctors.map(doc => `${doc.name} - ${doc.specialty}`).join(", ");
      return `Here are the available doctors: ${doctorList}. You can view more details [here](https://emp-health-frontend.vercel.app/health/doctors).`;
    } else {
      return "No doctors are available at the moment. Please try again later or visit [here](https://emp-health-frontend.vercel.app/health/doctors) for more information.";
    }
  }

  // Check for appointment-related queries
  const appointmentKeywords = ["available appointments", "show appointments", "list appointments", "appointment times"];
  if (appointmentKeywords.some(keyword => lowerInput.includes(keyword))) {
    const appointments = await fetchAppointments();
    if (appointments.length > 0) {
      const appointmentList = appointments.map(apt => `${apt.doctorName} - ${apt.time}`).join(", ");
      return `Here are the available appointments: ${appointmentList}. You can book an appointment [here](https://emp-health-frontend.vercel.app/health/appointments).`;
    } else {
      return "No appointments are available at the moment. Please try again later or visit [here](https://emp-health-frontend.vercel.app/health/appointments) for more information.";
    }
  }

  // Check navigation data for matching categories
  for (const nav of data.navigation) {
    if (nav.category.some(cat => lowerInput.includes(cat.toLowerCase()))) {
      return nav.response;
    }
  }

  // Fallback to OpenAI for general medical queries
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini", // or "gpt-4o", "gpt-3.5-turbo"
    messages: [
      {
        role: "system",
        content: `You are a highly experienced and empathetic medical doctor.
Your primary goal is to help users navigate the services provided on a website using the provided data,
and to provide accurate medical advice, diagnose symptoms, and suggest treatments while maintaining a compassionate tone.
Use the provided data for navigation questions and your medical knowledge for general queries.`,
      },
      {
        role: "user",
        content: input,
      },
    ],
    temperature: 0.7,
    max_tokens: 400,
  });

  const botMessage =
    completion.choices[0].message?.content ||
    "Sorry, I couldn’t generate a response.";
  return botMessage.trim();
};

// ===================== Static Navigation Data =====================
export const data = {
  navigation: [
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
      response:
        "You can open your inbox [here](https://emp-health-frontend.vercel.app/inbox).",
      link: "https://emp-health-frontend.vercel.app/inbox",
    },
    {
      category: ["Show me wellness courses", "I want to see wellness content", "Go to wellness"],
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
      category: ["Show insurance details", "Go to insurance section", "I want to see insurance information"],
      response:
        "You can view insurance information [here](https://emp-health-frontend.vercel.app/health/insurance).",
      link: "https://emp-health-frontend.vercel.app/health/insurance",
    },
  ],
};

// ===================== Fetch Doctors =====================
export const fetchDoctors = async () => {
  try {
    const res = await axios.get("https://employee-backend.onrender.com/api/all-doctors");
    if (!Array.isArray(res.data)) {
      console.error("Unexpected response format: res.data is not an array", res.data);
      return [];
    }
    return res.data; // doctors array
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching doctors:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    } else {
      console.error("Unexpected error fetching doctors:", error);
    }
    return [];
  }
};

// ===================== Fetch Appointments =====================
export const fetchAppointments = async () => {
  try {
    const res = await axios.get("https://employee-backend.onrender.com/api/appointments");
    if (!Array.isArray(res.data)) {
      console.error("Unexpected response format: res.data is not an array", res.data);
      return [];
    }
    return res.data; // appointments array
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching appointments:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    } else {
      console.error("Unexpected error fetching appointments:", error);
    }
    return [];
  }
};
