import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Message } from "../components/types";
import Cerebras from "@cerebras/cerebras_cloud_sdk";
import "../index.css";

const ChatbotComponent = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! How can I assist you today?", isBot: true },
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false); // Track if chatbot is open
  const location = useLocation(); // Get current route
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Reference for scrolling

  const client = new Cerebras({
    apiKey: "csk-pfdwvj9f6mmfe5n698txm9m5ryvpmxv3t3n66evyvrnpc2rm",
  });

  useEffect(() => {
    // Close chatbot whenever route changes
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    // Scroll to the bottom of the messages when new messages are added
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Dependency array includes messages

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, isBot: false };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");

    try {
      const completionCreateResponse = await client.chat.completions.create({
        messages: [{ role: "user", content: input }],
        model: "llama3.1-8b",
      });

      const botResponseText =
        completionCreateResponse.choices[0]?.message?.content ||
        "Sorry, I didn't understand that.";

      const botMessage: Message = { text: botResponseText, isBot: true };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        text: "Sorry, I encountered an error. Please try again.",
        isBot: true,
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  return (
    <div className={`chatbot-container ${isOpen ? "open" : "closed"}`}>
      <div className="chatbot-header">
        <span>Chatbot</span>
        <button
          className="chatbot-toggle-button"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "−" : "+"}
        </button>
      </div>

      {isOpen && (
        <div className="chatbot-content">
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chatbot-message ${
                  msg.isBot ? "chatbot-bot-message" : "chatbot-user-message"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {/* Empty div for scrolling target */}
            <div ref={messagesEndRef} />
          </div>
          <form
            className="chatbot-input-container"
            onSubmit={handleSendMessage}
          >
            <input
              className="chatbot-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Write your message here"
            />
            <button className="chatbot-send-button" type="submit">
              ➤
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatbotComponent;
