import { useState } from 'react'
import './App.css'
import { useEffect } from 'react'
import api from './api'

function App() {
  const [messages, setMessages] = useState([{ text: 'Lets chat!', sender: 'bot' }]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');
      // Simulate bot response
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, { text: 'This is a bot response.', sender: 'bot' }]);
      }, 1000);
    }
  };

  fetch('http://localhost:8000/api/test')
    .then(response => response.json())
    .then(data => console.log('Backend response:', data))
    .catch(error => console.error('Error:', error));

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
