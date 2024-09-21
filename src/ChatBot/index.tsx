// import { ethers } from 'ethers';
// import { useState } from 'react';

import React, { useState } from 'react';
import './chat.css';
interface Message {
  text: string;
  sender: 'user' | 'ai';
}

// import { useWeb3Auth } from './useWeb3Auth';
function ChatBot({ close }: { close: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    setMessages((prev) => [...prev, { text: 'Getting Data...', sender: 'ai' }]);
    setLoading(true);
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { text: input, sender: 'user' }]);

    try {
      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer `,
          },
          body: JSON.stringify({
            messages: [
              {
                role: 'user',
                content: input,
              },
            ],
            model: 'gpt-4',
            temperature: 0.7,
          }),
        }
      );

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setInput('');
      setMessages((prev) => [
        ...prev,
        { text: data?.choices[0]?.message?.content, sender: 'ai' },
      ]);
      setLoading(false);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        { text: `Error: ${error.message}`, sender: 'ai' },
      ]);
      setLoading(false);
      setInput('');
    }
  };
  const fetchApi = async () => {
    try {
      setMessages((prev) => [
        ...prev,
        { text: 'Getting Data...', sender: 'ai' },
      ]);
      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer `,
          },
          body: JSON.stringify({
            messages: [
              {
                role: 'assistant',
                content:
                  'Define what is ESLProLeague in 1 line and show stats of Brazil and Turkey in short',
              },
            ],
            model: 'gpt-4',
            temperature: 0.7,
          }),
        }
      );

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      console.log(data);
      setMessages(() => [
        { text: data?.choices[0]?.message?.content, sender: 'ai' },
      ]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        { text: `Error: ${error.message}`, sender: 'ai' },
      ]);
    }
  };
  React.useEffect(() => {
    fetchApi();
  }, []);
  return (
    <div className="modal">
      <div className="modal-content">
        <div className="container-content">
          <div className="bg-heading">ESP PRO LEAGUE S20</div>
          <div className="heading-2">PLAY-OFF</div>
          <div className="box-style">
            <div className="box-1-style">
              {' '}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                style={{ width: '20px', height: '20px' }}
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                />
              </svg>
              Eternal Fire | Win 1{' '}
            </div>
            <div>16:15 CEST</div>
            <div className="box-1-style">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                style={{ width: '20px', height: '20px' }}
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"
                />
              </svg>
              MIBR | Win 3
            </div>
          </div>
        </div>
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className={msg.sender}>
              <strong>{msg.sender === 'user' ? 'You' : 'AI'}: </strong>
              {msg.text}
            </div>
          ))}
        </div>
        <form onSubmit={handleSend}>
          <input
            className="input-styles"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message..."
          />

          {loading ? (
            <div className="loader-class">
              <span className="loader"></span>
            </div>
          ) : (
            <button type="submit" className="btn-styles">
              <div style={{ cursor: 'pointer' }}>Send</div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                style={{ width: '25px', height: '25px' }}
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                />
              </svg>
            </button>
          )}
        </form>
        <div className="btn-close" onClick={() => close()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="#fff"
            style={{ width: '30px', height: '30px' }}
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
