// import React, { useState, useEffect } from "react";
// import Cerebras from "@cerebras/cerebras_cloud_sdk";
// import "./Chatbot.css"; // Import CSS for styling the chatbot

// // Initialize the Cerebras client with your API key
// const client = new Cerebras({
//   apiKey: process.env.REACT_APP_CEREBRAS_API_KEY,
// });

// const Chatbot = () => {
//   const [messages, setMessages] = useState<{ role: string; content: string }[]>(
//     [{ role: "system", content: "Hello! How can I assist you today?" }]
//   );
//   const [userInput, setUserInput] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Handle user input submission
//   const handleSend = async () => {
//     if (!userInput.trim()) return;

//     const userMessage = { role: "user", content: userInput };
//     setMessages((prev) => [...prev, userMessage]);
//     setUserInput("");
//     setLoading(true);

//     try {
//       // Call Cerebras API for chat completion
//       const completionCreateResponse = await client.chat.completions.create({
//         messages: [...messages, userMessage],
//         model: "llama3.1-8b",
//       });

//       const botMessage = completionCreateResponse.choices[0].message;
//       setMessages((prev) => [...prev, botMessage]);
//     } catch (error) {
//       console.error("Error fetching response from Cerebras API:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle pressing Enter to send a message
//   const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
//     if (event.key === "Enter") handleSend();
//   };

//   return (
//     <div className="chatbot">
//       <div className="chatbot-header">AI Chatbot</div>
//       <div className="chatbot-messages">
//         {messages.map((msg, idx) => (
//           <div
//             key={idx}
//             className={`chatbot-message ${
//               msg.role === "user" ? "user" : "bot"
//             }`}
//           >
//             {msg.content}
//           </div>
//         ))}
//         {loading && <div className="chatbot-message bot">Typing...</div>}
//       </div>
//       <div className="chatbot-input">
//         <input
//           type="text"
//           value={userInput}
//           onChange={(e) => setUserInput(e.target.value)}
//           onKeyDown={handleKeyDown}
//           placeholder="Type a message..."
//         />
//         <button onClick={handleSend}>Send</button>
//       </div>
//     </div>
//   );
// };

// export default Chatbot;
