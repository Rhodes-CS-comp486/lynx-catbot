import { useState } from 'react'
import './App.css'
import api from './api';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

interface ChatResponse {
  response: string;
}


function App() {
  const [messages, setMessages] = useState<Message[]>([{ text: 'Lets chat!', sender: 'bot' }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim()) {
      setMessages(prev => [...prev, { text: input, sender: 'user' }]);
      setIsLoading(true);

      try {
        const response = await api.post<ChatResponse>('/chat/', {
          message: input
        });

        setMessages(prev => [...prev, {
          text: response.data.response,
          sender: 'bot'
        }]);
      } catch (error) {
        console.error('Chat API Error:', error);
        setMessages(prev => [...prev, {
          text: 'Sorry, I encountered an error. Please try again.',
          sender: 'bot'
        }]);
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

export default App
