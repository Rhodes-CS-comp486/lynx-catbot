import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import api from '@/api';
import { getGeminiResponse } from '@/lib/utils';
import { FolderOpen } from 'lucide-react';
import React from 'react';


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
  const [lastResponse, setLastResponse] = useState<Response | null>(null);
  const [awaitingFollowup, setAwaitingFollowUp] = useState(false);
  const [contextRequest, setContextRequest] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(false);


  React.useEffect(() => {
    console.log("Previous Response:", lastResponse);
    console.log("Category:", selectedCategory, "Subcategory:", selectedSubcategory)
  }, [lastResponse, selectedCategory, selectedSubcategory]);


  const isFixedQuery = (query: string): boolean =>
    categories.includes(query) || subcategories.includes(query) ||
    popularSuggestions.some((s) => s.suggestion_text === query);

  const extractLastAnswer = (lastResponse: any): string | null => {
    if (!lastResponse) return null;

    if (lastResponse.data?.answer) return lastResponse.data.answer;

    if (Array.isArray(lastResponse) && lastResponse.length > 0 && lastResponse[0].answer) {
      return lastResponse[0].answer;
    }

    if (lastResponse.answer) return lastResponse.answer

    return null;
  }

  const getCoreResponse = async (request: Request) => {
    try {
      setIsLoading(true);
      const response = await api.get("fixed-content/", {
        headers: { Authorization: `Token ${localStorage.getItem("authToken")}` },
        params: request,
      });
      console.log("Response: ", response.data[0].answer);
      const answer = response.data?.[0]?.answer ?? "I'm sorry, I don't have an answer for that question.";
      setLastResponse(response.data);
      setMessages((prev) => [...prev, { id: uuidv4(), text: answer, sender: "bot" },
      { id: uuidv4(), text: "Would you like more detail on this topic?.", sender: "bot" },
      ]);
      setAwaitingFollowUp(true);
    } catch (error) {
      setMessages((prev) => [...prev, { id: uuidv4(), text: "Sorry, there was an error processing your request.", sender: "bot" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (query: string) => {

    if (!query.trim()) return;

    setMessages((prev) => [...prev, { id: uuidv4(), text: query, sender: "user" }]);

    try {
      setIsLoading(true);
      console.log("Category:", selectedCategory, "Subcategory:", selectedSubcategory)

      const answerText = extractLastAnswer(lastResponse)
      if (awaitingFollowup && lastResponse && selectedCategory && selectedSubcategory) {

        const followup = `Previously the chatbot displayed "${answerText}
        Now the user asks "${query}. Please continue appropriately.`.trim();
        const followupRequest = {
          id: uuidv4(),
          category: selectedCategory,
          subcategory: selectedSubcategory,
          question: followup
        }
        console.log("Followup request: ", followupRequest)
        const followupResponse = await api.post("gemini-response/", { request: followupRequest });
        setMessages((prev) => [...prev, { id: uuidv4(), text: followupResponse.data.answer, sender: "bot" }]);
        setAwaitingFollowUp(true);
        // setSelectedCategory(null);
        // setSelectedSubcategory(null);
        setLastResponse(followupResponse);
        return;
      }

      if (selectedCategory && groupedSubcategories[selectedCategory]?.includes(query)) {
        const newRequest: Request = {
          id: uuidv4(),
          category: selectedCategory,
          subcategory: query,
          question: ""
        };
        setSelectedSubcategory(query);
        setContextRequest((prev) => [...prev, newRequest]);
        await getCoreResponse(newRequest);
        return;
      }

      if (categories.includes(query)) {
        setSelectedCategory(query);
        setMessages((prev) => [
          ...prev,
          {
            id: uuidv4(),
            text: `Great! Here are some topics related to ${query}.`,
            sender: "bot"
          }
        ]);
        return;
      }

      if (!awaitingFollowup) {
        setSelectedCategory(null);
        setSelectedSubcategory(null);

        console.log("Query: ", query)
        const response = await api.post("gemini-response/", { query });
        setMessages((prev) => [...prev, { id: uuidv4(), text: response.data.answer, sender: "bot" }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { id: uuidv4(), text: "There was an error generating a response.", sender: "bot" }]);
    } finally {
      setIsLoading(false);
    }

  };

  return { messages, isLoading, handleSend, selectedCategory };
};

