'use client';
import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!userInput.trim()) return;

    // Add user's message to chat history
    setChatHistory([...chatHistory, { sender: 'user', message: userInput }]);

    setLoading(true);

    // Send the user's message to the server
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: userInput }),
    });

    const data = await response.json();

    setLoading(false);

    // This adds the chatbots response to the chat history
    setChatHistory([...chatHistory, { sender: 'user', message: userInput }, { sender: 'assistant', message: data.message }]);

    // Feature to clear the chat
    setUserInput('');


  };

  return (
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        {/* <h1 align= 'center' marginBottom= "2%">Uber Driver Chatbot</h1> */}
        <div style={{ border: '1px solid #ccc', height: '500px', overflowY: 'scroll', marginBottom: '20px', marginTop: '10px', backgroundColor: "#F5F5F5"}}>
        <h2 align= 'center' style={{backgroundColor: "#B87333", color: "#F5F5DC", padding: "20px", position: "fixed", width: "538px"}}>Uber Driver Chatbot</h2>
          <div style={{padding: '10px', marginTop: '50px'}} >
          {chatHistory.map((chat, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                {/* <strong>{chat.sender === 'user' ? 'You: ' : 'Assistant: '}</strong> */}
                
                {chat.sender === 'user' ? 
                  <div style={{display: "flex", justifyContent: "right"}}>
                  

                  <div style={{backgroundColor: "#F7D16C", borderRadius: "20px", padding: "3%", width: "70%", marginTop: "4%"}}>
                    <span>{chat.message}</span>
                  </div>
                  </div>
                : 
                 
                  <div style={{backgroundColor: "#D3D3D3", borderRadius: "20px", padding: "3%", width: "70%", marginTop: "4%"}}>
                    <span>{chat.message}</span>
                  </div>
                }
              </div>              
          ))}

          {loading ? 
                  <div style = {{display: 'flex', direction: 'row'}} className={styles.loadingDots}>
                    <div className={styles.dot}></div>
                    <div className={styles.dot}></div>
                    <div className={styles.dot}></div>
                  </div>
                  :
                  <span></span>
          } 
          </div>
          
        </div>
        <form onSubmit={handleSubmit}>
          <textarea
              type="text"
              rows={2}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your message..."
              style={{ width: '100%', padding: '10px', boxSizing: 'border-box', resize: 'vertical', fontFamily: "sans-serif" }}
          />
        
          <button type="submit" style={{ marginTop: '10px', width: '100%', padding: '10px', backgroundColor: '#F4A300', color: '#fff', border: 'none', fontSize: "15px" }}>
            Send
          </button>
        </form>
      </div>
  );
}
