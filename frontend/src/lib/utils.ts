import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import api from "@/api"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getGeminiResponse = async (queryOrRequest: { query?: string, request?: Request }) => {
  try {
    const response = await api.post("gemini-response/", { queryOrRequest });
    return response.data.answer || "No response found";
  } catch (error) {
    console.error("Error generating content:", error);
    return "Sorry, an error occurred";
  }
}