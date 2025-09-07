import OpenAI from "openai";
import axios from "axios";
import axiosRetry from "axios-retry"; // Added for retry logic

// Configure Axios retries for handling Render cold starts
axiosRetry(axios, {
  retries: 3, // Retry up to 3 times
  retryDelay: (retryCount) => retryCount * 1000, // 1s, 2s, 3s delay
  retryCondition: (error) => {
    // Retry on network errors or 5xx status codes
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || (error.response && error.response.status >= 500);
  },
});

// ⚠️ For testing only — replace with your actual key
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "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", // 🔒 Use environment variable in production
  dangerouslyAllowBrowser: true, // Frontend calls
});

// ===================== Conversational Bot =====================
export const conversationalBot = async (
  input: string,
  onProgress?: (msg: string) => void // Callback for loading states
) => {
  const lowerInput = input.toLowerCase();

  // Check for doctor-related queries (expanded keywords)
  const doctorKeywords = [
    "doctor",
    "doctors",
    "available doctors",
    "list of doctors",
    "show doctors",
    "who are the doctors",
    "doctor list",
    "docs",
  ];
  if (doctorKeywords.some((keyword) => lowerInput.includes(keyword))) {
    if (onProgress) onProgress("Fetching available doctors... ⏳");

    const doctors = await fetchDoctors();
    if (doctors.length > 0) {
      const doctorList = doctors.map((doc) => `${doc.name} - ${doc.specialty}`).join(", ");
      return `Here are the available doctors: ${doctorList}. You can view more details [here](https://emp-health-frontend.vercel.app/health/doctors).`;
    } else {
      return "No doctors are available at the moment. Please try again later or visit [here](https://emp-health-frontend.vercel.app/health/doctors) for more information.";
    }
  }

  // Check for appointment-related queries
  const appointmentKeywords = [
    "available appointments",
    "show appointments",
    "list appointments",
    "appointment times",
  ];
  if (appointmentKeywords.some((keyword) => lowerInput.includes(keyword))) {
    if (onProgress) onProgress("Fetching available appointments... ⏳");

    const appointments = await fetchAppointments();
    if (appointments.length > 0) {
      const appointmentList = appointments
        .map((apt) => `${apt.doctorName} - ${apt.time}`)
        .join(", ");
      return `Here are the available appointments: ${appointmentList}. You can book an appointment [here](https://emp-health-frontend.vercel.app/health/appointments).`;
    } else {
      return "No appointments are available at the moment. Please try again later or visit [here](https://emp-health-frontend.vercel.app/health/appointments) for more information.";
    }
  }

  // Check navigation data for matching categories
  for (const nav of data.navigation) {
    if (nav.category.some((cat) => lowerInput.includes(cat.toLowerCase()))) {
      return nav.response;
    }
  }

  // Fallback to OpenAI for general queries
  if (onProgress) onProgress("Thinking... 🤔");

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
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
  } catch (error: any) {
    console.error("OpenAI API error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    return "Sorry, I couldn’t process your request at the moment. Please try again later.";
  }
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
  ],
};

// ===================== Fetch Doctors =====================
export const fetchDoctors = async () => {
  try {
    const res = await axios.get("https://employee-backend.onrender.com/api/all-doctors", {
      withCredentials: true, // Enable if cookies are required
      headers: {
        "Content-Type": "application/json",
        // Uncomment and add token if authentication is required
        // Authorization: `Bearer ${localStorage.getItem('authToken') || ''}`,
      },
    });
    console.log("Doctors API response:", JSON.stringify(res.data, null, 2));

    // Handle different response structures
    const doctors = Array.isArray(res.data) ? res.data : res.data.doctors || [];
    if (!Array.isArray(doctors)) {
      console.error("Unexpected response format: doctors is not an array", doctors);
      return [];
    }
    return doctors;
  } catch (error: any) {
    console.error("Error fetching doctors:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config,
      request: error.request,
    });
    return [];
  }
};

// ===================== Fetch Appointments =====================
export const fetchAppointments = async () => {
  try {
    const res = await axios.get("https://employee-backend.onrender.com/api/appointments", {
      withCredentials: true, // Enable if cookies are required
      headers: {
        "Content-Type": "application/json",
        // Uncomment and add token if authentication is required
        // Authorization: `Bearer ${localStorage.getItem('authToken') || ''}`,
      },
    });
    console.log("Appointments API response:", JSON.stringify(res.data, null, 2));

    // Handle different response structures
    const appointments = Array.isArray(res.data) ? res.data : res.data.appointments || [];
    if (!Array.isArray(appointments)) {
      console.error("Unexpected response format: appointments is not an array", appointments);
      return [];
    }
    return appointments;
  } catch (error: any) {
    console.error("Error fetching appointments:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config,
      request: error.request,
    });
    return [];
  }
};