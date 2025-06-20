import axios from "axios";

export const conversationalBotCall = async (input: string) => {
  const response = await axios.post(
    "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
    {
      inputs: `<s>[INST] You are a highly experienced and empathetic medical doctor. Your primary goal is to help users navigate the services provided on a website using the provided data, and to provide accurate medical advice, diagnose symptoms, and suggest treatments while maintaining a compassionate tone. 

Use the provided data for navigation questions and your medical knowledge for general queries. 

Add this note at the end of your answer if the user asks about connecting with a doctor via call: "##SHOW_CALL_BUTTON##"

User: ${input}[/INST] Model answer</s>`
      ,
      parameters: {
        temperature: 0.7,
        max_new_tokens: 4000,
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer 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",
      },
    }
  );

  const fullResponse = response.data[0].generated_text;
  const answerStart = fullResponse.indexOf("</s>") + 4;
  const botMessage = fullResponse.substring(answerStart).trim();

  const cleanMessage = botMessage
    .replace(/<[^>]*>/g, "")
    .replace(/\[.*?\]/g, "")
    .replace(/[\w-]+="[^"]*"/g, "")
    .replace(/\{[^}]*\}/g, "")
    .replace(/\bowerlevel\b/g, "")
    .replace(/\bef\b/g, "")
    .replace(/\bRIVERY Of cours\b/g, "")
    .trim();

  return cleanMessage;
};
