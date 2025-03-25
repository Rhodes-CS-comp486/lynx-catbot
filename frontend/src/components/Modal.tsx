import { GoogleGenerativeAI } from "@google/generative-ai";
import api from "../api";

let genAI: GoogleGenerativeAI | null = null;
let model: any = null;

const fetchAPIKey = async (): Promise<string | null> => {
  try {
    const response = await api.get("get-api-key/");
    return response.data.api_key || null;
  } catch (error) {
    console.error("Error fetching API key:", error);
    return null;
  }
}

const initGenAI = async () => {
  const apiKey = await fetchAPIKey();
  if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey)
    model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
  } else {
    console.error("API key is not available.");
    return null;
  }
}


initGenAI()

// const genAI = new GoogleGenerativeAI("AIzaSyBBqPn72UgJSMoO2XGV8vY7JPr80xGqxYc");
// const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const generateContent = async (prompt: string) => {
  const result = await model.generateContent(prompt);
  console.log(result.response.text());
  return result.response.text();
};