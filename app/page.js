'use client';
import { useState } from 'react';

export default function Home() {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userInput.trim()) return;

    // Add user's message to chat history
    setChatHistory([...chatHistory, { sender: 'user', message: userInput }]);

    // Send the user's message to the server
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: userInput }),
    });

    const data = await response.json();

    // This adds the chatbots response to the chat history
    setChatHistory([...chatHistory, { sender: 'user', message: userInput }, { sender: 'assistant', message: data.message }]);

    // Feature to clear the chat
    setUserInput('');
  };

  return (
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        <h1 align= 'center'>Uber Driver Chatbot</h1>
        <div style={{ border: '1px solid #ccc', padding: '10px', height: '400px', overflowY: 'scroll', marginBottom: '20px' }}>
          {chatHistory.map((chat, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                <strong>{chat.sender === 'user' ? 'You: ' : 'Assistant: '}</strong>
                <span>{chat.message}</span>
              </div>
          ))}
        </div>
        <form onSubmit={handleSubmit}>
          <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your message..."
              style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
          />
          <button type="submit" style={{ marginTop: '10px', width: '100%', padding: '10px', backgroundColor: '#ffa600', color: '#fff', border: 'none' }}>
            Send
          </button>
        </form>
      </div>
  );
}
