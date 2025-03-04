import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "./api";
import "./App.css";

interface Message {
  text: string;
  sender: "user" | "bot";
}

interface ChatResponse {
  response: string;
}

interface FixedContent {
  id: number;
  category: string;
  subcategory: string;
  question: string;
  answer: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Let’s chat!", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fixedContent, setFixedContent] = useState<FixedContent[]>([]);

  useEffect(() => {
    const fetchFixedContent = async () => {
      try {
        const response = await api.get("/fixed-content/", {
          headers: {
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        });
        setFixedContent(response.data);
        console.log(response.data

        )
      } catch (error) {
        console.error("Error fetching fixed content:", error);
      }
    };

    fetchFixedContent();
  }, []);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: "user" };
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      const foundContent = fixedContent.find(
        (item) => item.question.toLowerCase() === input.toLowerCase()
      );

      if (foundContent) {
        setMessages((prev) => [...prev, { text: foundContent.answer, sender: "bot" }]);
        setIsLoading(false);
        setInput("");
        return;
      }

      try {
        const response = await api.post<ChatResponse>("/chat/", { message: input });
        setMessages((prev) => [...prev, { text: response.data.response, sender: "bot" }]);
      } catch (error) {
        console.error("Chat API Error:", error);
        setMessages((prev) => [...prev, { text: "Sorry, an error occurred.", sender: "bot" }]);
      } finally {
        setIsLoading(false);
        setInput("");
      }
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-4 space-y-2">
          <h1 className="text-xl font-bold">Welcome to LynxUP - Catbot!</h1>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg ${message.sender === "user"
                  ? "bg-blue-500 text-white self-end"
                  : "bg-gray-200 text-black self-start"
                  }`}
              >
                {message.text}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="flex w-full max-w-md space-x-2">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
        />
        <Button onClick={handleSend} disabled={isLoading}>
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </div>
    </div>
  );
}
