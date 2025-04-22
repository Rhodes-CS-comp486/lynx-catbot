import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import api from '@/api';
// import { generateContent } from '@/components/Modal';
import { getGeminiResponse } from '@/lib/utils';
import { serialize } from 'v8';

interface Message {
  id: number | string;
  text: string;
  sender: "user" | "bot";
}

interface Request {
  id: number | string;
  category: string;
  subcategory: string;
  question: string;
}

export const useChat = (categories: string[], subcategories: string[], popularSuggestions: { suggestion_text: string }[], groupedSubcategories: Record<string, string[]>) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: uuidv4(), text: "Let’s chat!", sender: "bot" },
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isFixedQuery = (query: string): boolean =>
    categories.includes(query) || subcategories.includes(query) ||
    popularSuggestions.some((s) => s.suggestion_text === query);

  const getCoreResponse = async (request: Request) => {
    try {
      setIsLoading(true);
      const response = await api.get("fixed-content/", {
        headers: { Authorization: `Token ${localStorage.getItem("authToken")}` },
        params: request,
      });
      console.log("Response: ", response.data);
      const answer = response.data?.[0]?.answer ?? "I'm sorry, I don't have an answer for that question.";
      setMessages((prev) => [...prev, { id: uuidv4(), text: answer, sender: "bot" }]);
    } catch (error) {
      setMessages((prev) => [...prev, { id: uuidv4(), text: "Sorry, there was an error processing your request.", sender: "bot" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (query: string) => {
    if (!query.trim()) return;

    setMessages((prev) => [...prev, { id: uuidv4(), text: query, sender: "user" }]);

    if (selectedCategory && groupedSubcategories[selectedCategory]?.includes(query)) {
      const newRequest: Request = { id: uuidv4(), category: selectedCategory, subcategory: query, question: "" };
      await getCoreResponse(newRequest);
      setSelectedCategory(null);
      setSelectedSubcategory(null);
      return
    }

    if (categories.includes(query)) {
      setSelectedCategory(query);
      setMessages((prev) => [...prev, { id: uuidv4(), text: `Okay great here are some relevant results for ${query}`, sender: "bot" }]);
      return;
    }

    if (isFixedQuery(query)) {
      const newRequest: Request = { id: uuidv4(), category: query, subcategory: "", question: "" };
      await getCoreResponse(newRequest);
    } else {
      try {
        setIsLoading(true);
        const response = await getGeminiResponse(query);
        setMessages((prev) => [...prev, { id: uuidv4(), text: response, sender: "bot" }]);
      } catch (error) {
        setMessages((prev) => [...prev, { id: uuidv4(), text: "Error generating content.", sender: "bot" }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return { messages, isLoading, handleSend, selectedCategory };
};