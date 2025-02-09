import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaRobot,
  FaUser,
  FaPaperPlane,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";

const Detection = () => {
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const chatContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    const userMessage = symptoms.trim();
    setSymptoms("");
    setLoading(true);
    setError(null);

    // Add user message immediately
    const newUserMessage = { type: "user", content: userMessage };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);

    try {
      const response = await axios.post("http://localhost:8080/predict", {
        description: userMessage,
      });

      // Add AI response
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "bot", content: response.data.referral },
      ]);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: "error",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const Message = ({ type, content }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start gap-3 mb-4 ${
        type === "user" ? "flex-row-reverse" : ""
      }`}
    >
      <div
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center 
        ${type === "user" ? "bg-blue-50" : "bg-gray-50"}`}
      >
        {type === "user" ? (
          <FaUser className="text-blue-500" />
        ) : (
          <FaRobot className="text-gray-700" />
        )}
      </div>
      <div
        className={`px-4 py-2 rounded-lg max-w-[80%] ${
          type === "user"
            ? "bg-blue-500 text-white ml-auto"
            : type === "error"
            ? "bg-red-50 text-red-600"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {content}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Warning Banner */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-amber-800">
            <FaExclamationTriangle className="text-amber-600" />
            <p className="text-sm">
              <span className="font-semibold">Beta Testing:</span> This AI
              symptom analyzer is under development. Results are for reference
              only and should not replace professional medical advice.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header with new styling */}
        <div className="mb-6 bg-white p-6 rounded-xl shadow-sm border border-blue-100">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FaRobot className="text-blue-500 text-3xl" />
            </div>
            AI Symptom Analyzer
          </h1>
          <p className="text-gray-600 mt-3 pl-14">
            Describe your symptoms in detail, and I'll help you identify which
            medical specialist you should consult.
          </p>
        </div>

        {/* Chat Container with updated styling */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div
            ref={chatContainerRef}
            className="h-[500px] overflow-y-auto p-6 space-y-4 bg-gray-50"
          >
            {messages.length === 0 && (
              <div className="text-center p-8 bg-white rounded-lg border border-gray-100">
                <FaRobot className="text-blue-500 text-4xl mx-auto mb-3" />
                <p className="text-gray-600">
                  👋 Hello! Please describe your symptoms in detail, and I'll
                  help you find the appropriate specialist.
                </p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <Message key={idx} {...msg} />
            ))}
            {loading && (
              <div className="flex items-center justify-center gap-3 p-4 bg-white rounded-lg border border-gray-100">
                <FaSpinner className="animate-spin text-blue-500" />
                <span className="text-gray-600">
                  Analyzing your symptoms...
                </span>
              </div>
            )}
          </div>

          {/* Input Form with updated styling */}
          <div className="border-t p-4 bg-white rounded-b-xl">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="flex-1 rounded-xl border-gray-200 focus:border-blue-500 
                         focus:ring-2 focus:ring-blue-100 resize-none bg-gray-50
                         transition-all duration-200"
                placeholder="Describe your symptoms here..."
                rows={2}
              />
              <button
                type="submit"
                disabled={loading || !symptoms.trim()}
                className="px-5 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 
                         disabled:bg-gray-300 disabled:cursor-not-allowed
                         flex items-center gap-2 transition-all duration-200 h-fit
                         hover:shadow-md active:scale-95"
              >
                <FaPaperPlane />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detection;
