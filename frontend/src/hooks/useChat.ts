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

export const useChat = (categories: string[], subcategories: string[], questions: string[], popularSuggestions: { suggestion_text: string }[], groupedSubcategories: Record<string, string[]>, groupedQuestions: Record<string, string[]>) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: uuidv4(), text: "Let’s chat!", sender: "bot" },
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [lastFixedResponse, setLastFixedRespose] = useState<Response | null>(null);
  const [awaitingFollowup, setAwaitingFollowUp] = useState(false);
  const [contextRequest, setContextRequest] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(false);


  React.useEffect(() => {
    console.log(lastFixedResponse);
  }, [lastFixedResponse]);
  const isFixedQuery = (query: string): boolean =>
    categories.includes(query) || subcategories.includes(query) || questions.includes(query) ||
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
      setLastFixedRespose(response.data);
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
      console.log(selectedCategory, selectedSubcategory, selectedQuestion)
      if (awaitingFollowup && lastFixedResponse && selectedCategory && selectedSubcategory) {

        const followupRequest = {
          id: uuidv4(),
          category: selectedCategory,
          subcategory: selectedSubcategory,
          question: query
        }
        console.log("Followup request: ", followupRequest)
        const followupResponse = await api.post("gemini-response/", { request: followupRequest });
        setMessages((prev) => [...prev, { id: uuidv4(), text: followupResponse.data.answer, sender: "bot" }]);
        setAwaitingFollowUp(false);
        setSelectedCategory(null);
        setSelectedSubcategory(null);
        setSelectedQuestion(null);
        return;
      }
      if (selectedCategory && groupedSubcategories[selectedCategory]?.includes(query)) {
        console.log("maybe this works")
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
      else if (selectedCategory && selectedSubcategory && groupedQuestions[selectedSubcategory]?.includes(query)) {
        const newRequest: Request = {
          id: uuidv4(),
          category: selectedCategory,
          subcategory: selectedSubcategory,
          question: query
        };
        setSelectedQuestion(query);
        setContextRequest((prev) => [...prev, newRequest]);
        await getCoreResponse(newRequest);
        return;
      }

      if (categories.includes(query)) {
        console.log("hi")
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
      else if(selectedCategory!=null && selectedCategory!="Major Requirements" && selectedCategory!="Minor Requirements"){
        console.log("test")
        if(subcategories.includes(query)){
          console.log("made it")
          setSelectedSubcategory(query);
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
      }

      console.log("Query: ", query)
      const response = await api.post("gemini-response/", { query });
      setMessages((prev) => [...prev, { id: uuidv4(), text: response.data.answer, sender: "bot" }]);
    } catch (error) {
      setMessages((prev) => [...prev, { id: uuidv4(), text: "There was an error generating a response.", sender: "bot" }]);
    } finally {
      setIsLoading(false);
    }

  };

  return { messages, isLoading, handleSend, selectedCategory };
};

