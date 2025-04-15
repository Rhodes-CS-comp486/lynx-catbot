import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import api from '@/api';
import { generateContent } from '@/components/Modal';

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

export const useChat = (categories: string[], subcategories: string[], popularSuggestions: { suggestion_text: string }[]) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Let’s chat!", sender: "bot" },
  ]);
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
    if (isFixedQuery(query)) {
      const newRequest: Request = { id: uuidv4(), category: query, subcategory: "", question: "" };
      await getCoreResponse(newRequest);
    } else {
      try {
        setIsLoading(true);
        const response = await generateContent(query);
        setMessages((prev) => [...prev, { id: uuidv4(), text: response, sender: "bot" }]);
      } catch (error) {
        setMessages((prev) => [...prev, { id: uuidv4(), text: "Error generating content.", sender: "bot" }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return { messages, isLoading, handleSend };
};