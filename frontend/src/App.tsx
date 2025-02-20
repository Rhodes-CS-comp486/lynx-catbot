import { useState, useEffect } from 'react';
import './App.css';
import api from './api';

interface Message {
  text: string;
  sender: 'user' | 'bot';
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

function App() {
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Let’s chat!', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fixedContent, setFixedContent] = useState<FixedContent[]>([]);

  // Fetch FixedContent from backend on mount
  useEffect(() => {
    const fetchFixedContent = async () => {
      try {
        const response = await api.get('/fixed-content/', {
          headers: {
            Authorization: `Token ${localStorage.getItem('authToken')}`, // Adjust based on your auth method
          },
        });
        setFixedContent(response.data);
      } catch (error) {
        console.error('Error fetching fixed content:', error);
      }
    };

    fetchFixedContent();
  }, []);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: 'user' };
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);

      // Check if input matches a FixedContent question
      const foundContent = fixedContent.find(
        (item) => item.question.toLowerCase() === input.toLowerCase()
      );

      if (foundContent) {
        setMessages(prev => [...prev, { text: foundContent.answer, sender: 'bot' }]);
        setIsLoading(false);
        setInput('');
        return;
      }

      // If no FixedContent match, call chatbot API
      try {
        const response = await api.post<ChatResponse>('/chat/', { message: input });
        setMessages(prev => [...prev, { text: response.data.response, sender: 'bot' }]);
      } catch (error) {
        console.error('Chat API Error:', error);
        setMessages(prev => [...prev, { text: 'Sorry, an error occurred.', sender: 'bot' }]);
      } finally {
        setIsLoading(false);
        setInput('');
      }
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        <h1>Welcome to LynxUP - Catbot!</h1>
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-box">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default App;
