import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { generateContent }  from '@/components/ui/Modal'
import { Send, User, Bot } from 'lucide-react'
import api from '@/api'
import { get } from 'http'
import { preview } from 'vite'

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

interface Request {
  id: number;
  type: "fixed" | "dynamic";
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
  const [fixedContent, setFixedContent] = useState([])


  const suggestions = [
    "Major requirements?",
    "Housing",
    "Food and Dining",
  ];

  useEffect(() => {
    const fetchFixedContent = async () => {
      try {
        const response = await api.get("fixed-content/", {
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        });
        setFixedContent(response.data);
      } catch (error) {
        console.error("Error fetching fixed content:", error);
      }
    };

    fetchFixedContent();

  }, []);

  const getResponse = async (inputValue: object) => {
    try {
      setIsLoading(true);
      const response = await api.get("fixed-content/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`,
        },
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now(), type: "dynamic", text: response.data, sender: "bot" },
      ]);
    } catch (error) {
      console.error("Error fetching response:", error);
    }
    setIsLoading(false)
  }

  //write ai stuff here
  const handleSend = async () => {
    if (inputValue.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now(), text: inputValue, sender: "user" },
      ]);

      setInputValue("");

      try {
        setIsLoading(true);
        const response = await generateContent(inputValue);
        setMessages((prevMessages) => [
          ...prevMessages,
          { id: Date.now(), text: response, sender: "bot" },
        ]);
      } catch (error) {
        console.error("Error generating content:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { id: Date.now(), text: "Sorry, an error occurred.", sender: "bot" },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
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
      </CardContent>

      <div className="p-2 border-t border-gray-200 bg-white">
        <div className="flex flex-wrap gap-2 mb-2 m-5">
          {suggestions.map((suggestion, index) => (
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
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon" className="bg-black-500 hover:bg-blue-600">
            <Send size={18} className="text-black" />
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default ChatbotUI;
