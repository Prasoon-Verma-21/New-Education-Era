"use client";
import React, { useState } from "react";
import axiosInstance from "../axiosConfig";

const ChatBox = () => {
  const [isClosed, setIsClosed] = useState(true);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add a loading state

  const handleToggle = () => {
    setIsClosed(!isClosed);
  };

  const handleSend = async () => {
    if (message.trim() === "") return;

    // Add the user's message to the chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: message, sender: "user" },
    ]);
    setMessage("");

    try {
      setIsLoading(true); // Start loading state

      // Make an API request to the backend to get the bot's response
      const response = await axiosInstance.post("/api/chat", { message });

      // Add the bot's response to the chat after the API call
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: response.data.response, sender: "bot" },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Handle error case (optional)
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Sorry, something went wrong.", sender: "bot" },
      ]);
    } finally {
      setIsLoading(false); // End loading state
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-10 sm:right-5">
      {isClosed ? (
        <button
          onClick={handleToggle}
          className="bg-gradient-to-b from-blue-400 to-pink-400 text-white w-12 h-12 rounded-full shadow-md flex items-center justify-center hover:opacity-90"
        >
          💬
        </button>
      ) : (
        <div className="w-72 sm:w-80 h-[95vh] sm:h-96 bg-gradient-to-b from-black via-blue-300 to-pink-500 border border-blue-500 rounded-lg shadow-lg flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-b from-pink-200 to-red-50 text-black flex items-center justify-between p-3 rounded-t-lg border border-black">
            <h3 className="text-bold text-lg font-medium">ChatBot</h3>
            <button
              onClick={handleToggle}
              className="text-red-500 text-xl hover:text-red-600"
            >
              ✖
            </button>
          </div>

          {/* Messages Section */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-blue-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] sm:max-w-[70%] p-2 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-black"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] sm:max-w-[70%] p-2 rounded-lg bg-gray-500 text-white">
                  <span>Bot is typing...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Section */}
          <div className="flex items-center p-3 bg-gradient-to-b from-red-50 to-pink-200 rounded-b-lg border border-black">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 bg-gray-50 text-gray-800 border border-black rounded-md outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base"
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="ml-2 bg-blue-500 text-white px-3 sm:px-4 py-2 rounded-md hover:bg-blue-800 border border-black text-sm sm:text-base"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
