import React, { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { generateContent } from './Modal'
import { Send, User, Bot } from 'lucide-react'
import { ClipLoader } from 'react-spinners'
import { v4 as uuidv4 } from 'uuid'
import api from '@/api'

interface Message {
  id: number | string;
  text: string;
  sender: "user" | "bot";
}

interface PopularSuggestion {
  suggestion_text: string;
  times_selected: number;
}

interface Request {
  id: number | string;
  category: string;
  subcategory: string;
  question: string;
}

const ChatbotUI = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Let’s chat!", sender: "bot" },
  ]);
  const [request, setRequest] = useState<Request[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const [fixedContent, setFixedContent] = useState([])
  const [categories, setCategories] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);
  const [popularSuggestions, setPopularSuggestions] = useState<PopularSuggestion[]>([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await api.get("suggestions/", {
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        });
        setCategories(response.data.categories || []);
        setSubcategories(response.data.subcategories || []);
        setQuestions(response.data.questions || []);
        setPopularSuggestions(response.data.popular_suggestions.map((s: any) => ({
          suggestion_text: s.suggestion_text,
          times_selected: s.times_selected,
        })) || [])
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };

    fetchSuggestions();

  }, []);

  const getCoreResponse = async (request: Request) => {
    try {
      setIsLoading(true);

      const response = await api.get("fixed-content/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`,
        },
        params: {
          category: request.category,
          subcategory: request.subcategory,
          question: request.question,
        },
      });

      if (response.data && response.data.length > 0) {
        console.log(response.data)
        const answer = response.data[0].answer;

        setMessages((prevMessages) => [
          ...prevMessages,
          { id: uuidv4(), text: answer, sender: "bot" },
        ]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { id: uuidv4(), text: "I'm sorry, I don't have an answer for that question.", sender: "bot" },
        ]);
      }
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: uuidv4(), text: "Sorry, there was an error processing your request.", sender: "bot" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getGeminiResponse = async (query: string) => {
    try {
      setIsLoading(true);
      const response = await generateContent(query);
      return response;
    } catch (error) {
      console.error("Error generating content:", error);
      return "Sorry, an error ocurred"
    } finally {
      setIsLoading(false);
    }
  }

  const handleSend = async (text?: string) => {

    const query = text ?? inputValue.trim();
    console.log(query)
    if (!query) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { id: uuidv4(), text: query, sender: "user" },
    ]);

    setInputValue("");

    // const isFixedQuery = suggestions.includes(query);
    const isFixedQuery = categories.includes(query) || subcategories.includes(query) || questions.includes(query) || popularSuggestions.includes(query)

    if (isFixedQuery) {
      const newCoreRequest: Request = {
        id: uuidv4(),
        category: query,
        subcategory: "",
        question: ""
      };

      setRequest((prevRequests) => [...prevRequests, newCoreRequest]);
      console.log(newCoreRequest)
      await getCoreResponse(newCoreRequest)
    } else {
      const aiResponse = await getGeminiResponse(query);
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: uuidv4(), text: aiResponse, sender: "bot" },
      ])
    }
  };

  const updatePopularSuggestions = async (text?: string) => {
    try {
      await api.post("suggestion-usage/",
        { suggestion: text },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        }
      );
    } catch (error) {
      console.error("Error tracking suggestion usage:", error);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
    updatePopularSuggestions(suggestion);
  };

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="flex flex-col h-screen max-w-md mx-auto bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex items-start space-x-2 max-w-xs ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
              <Card className={`p-1 rounded-full ${message.sender === "user" ? "bg-blue-500" : "bg-gray-300"}`}>
                {message.sender === "user" ? <User size={16} className="text-white" /> : <Bot size={16} className="text-gray-700" />}
              </Card>
              <Card className={`p-3 rounded-lg ${message.sender === "user" ? "bg-blue-500 text-white" : "bg-white border border-gray-200"}`}>
                {message.text}
              </Card>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className='flex justify-center'>
            <ClipLoader color='#000' size={50} />
          </div>
        )}
      </CardContent>

      <div className="p-2 border-t border-gray-200 bg-white">
        <div className="flex flex-wrap gap-2 mb-2 m-5">
          {[...new Set([
            ...((popularSuggestions || []).map((s) => s.suggestion_text)),
            ...categories,
            ...subcategories
          ])]
            .slice(0, 6) // Limit number of displayed suggestions
            .map((suggestion, index) => (
              <Card
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full border border-gray-200 transition-colors"
              >
                {suggestion}
              </Card>
            ))}

        </div>

        <CardFooter className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e: any) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="button" onClick={handleSend} size="icon" className="bg-black-500 hover:bg-blue-600">
            <Send size={18} className="text-white" />
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default ChatbotUI;