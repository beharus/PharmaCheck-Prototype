import { useState, useRef, useEffect } from "react";
import { X, Send, Loader2, Bot, User } from "lucide-react";

const API_URL = "https://ai-chat-bot-oig5.onrender.com/api/chat/";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const animatedTexts = [
  "PharmaAI Assistant",
  "Chat with AI",
  "Ask Any Questions",
  "Medicine Expert",
  "24/7 Available",
];

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hello! I'm your PharmaCheck assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [showText, setShowText] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Animated text rotation
  useEffect(() => {
    if (isOpen) return;

    const textInterval = setInterval(() => {
      setShowText(false);
      setTimeout(() => {
        setCurrentTextIndex((prev) => (prev + 1) % animatedTexts.length);
        setShowText(true);
      }, 300);
    }, 3000);

    return () => clearInterval(textInterval);
  }, [isOpen]);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Send message to API
  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();

      // Add bot response
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text:
          result.response ||
          result.message ||
          "I apologize, I couldn't process that. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    sendMessage(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-1 sm:right-6 w-full left-1 sm:left-auto sm:w-[400px] max-w-[calc(100vw-24px)] h-[600px] max-h-[calc(100vh-150px)] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl flex flex-col z-[1000] animate-slideInUp">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-br from-blue-500 to-cyan-400 text-white rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full backdrop-blur-sm flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold">PharmaAI Assistant</h3>
                <p className="text-xs flex items-center gap-1.5 opacity-90">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-800 flex flex-col gap-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === "user" ? "flex-row-reverse" : ""} animate-fadeInUp`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === "bot" 
                    ? "bg-gradient-to-br from-blue-500 to-cyan-400 text-white" 
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}>
                  {message.sender === "bot" ? (
                    <Bot className="w-5 h-5" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </div>
                <div className={`max-w-[75%] flex flex-col gap-1 ${
                  message.sender === "user" ? "items-end" : ""
                }`}>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    message.sender === "bot" 
                      ? "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-tl-none text-gray-800 dark:text-gray-200" 
                      : "bg-gradient-to-br from-blue-500 to-cyan-400 text-white rounded-tr-none"
                  }`}>
                    {message.text}
                  </div>
                  <span className={`text-xs text-gray-500 dark:text-gray-400 px-2 ${
                    message.sender === "user" ? "text-right" : ""
                  }`}>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 animate-fadeInUp">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-tl-none">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-typing"></span>
                    <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-typing animation-delay-200"></span>
                    <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-typing animation-delay-400"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-3 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-b-2xl">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            />
            <button
              onClick={handleSubmit}
              disabled={!inputValue.trim() || isLoading}
              className="w-11 h-11 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center text-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
              aria-label="Send message"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Animated Text Label */}
      {!isOpen && (
        <div className={`fixed bottom-[34px] right-[105px] bg-white dark:bg-gray-800 text-blue-600 dark:text-cyan-400 px-5 py-3 rounded-full text-sm font-semibold shadow-lg whitespace-nowrap z-[999] border-2 border-blue-500 dark:border-cyan-400 transition-all duration-300 ${
          showText 
            ? "animate-fadeSlideIn opacity-100 translate-x-0" 
            : "animate-fadeSlideOut opacity-0 translate-x-4"
        }`}>
          {animatedTexts[currentTextIndex]}
          <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-[8px] border-l-blue-500 dark:border-l-cyan-400 border-y-[8px] border-y-transparent"></div>
        </div>
      )}

      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-1 sm:bottom-6 sm:right-6 w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center cursor-pointer shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 z-[1000] text-white"
        aria-label="Open chat"
      >
        {isOpen ? (
          <X className="w-7 h-7" />
        ) : (
          <>
            <Bot className="w-8 h-8" />
            <span className="absolute -top-1 -right-1 min-w-[28px] h-7 px-2 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-[3px] border-white shadow-md">
              AI
            </span>
          </>
        )}
      </button>

      {/* Add these to your global CSS (tailwind.config.js or global.css) */}
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeSlideOut {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(10px);
          }
        }

        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.7;
          }
          30% {
            transform: translateY(-4px);
            opacity: 1;
          }
        }

        .animate-slideInUp {
          animation: slideInUp 0.3s ease-out;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease-out;
        }

        .animate-fadeSlideIn {
          animation: fadeSlideIn 0.5s ease-out;
        }

        .animate-fadeSlideOut {
          animation: fadeSlideOut 0.3s ease-out;
        }

        .animate-typing {
          animation: typing 1.4s ease-in-out infinite;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        /* Mobile responsive styles using class selectors */
        @media (max-width: 640px) {
          /* Chat window */

          /* Animated text label - use a more specific selector */
          .fixed.bottom-\\[34px\\].right-\\[105px\\],
          .fixed[class*="bottom-\\[34px\\]"],
          .fixed[class*="right-\\[105px\\]"] {
            bottom: 28px;
            right: 80px;
            font-size: 0.8rem;
            padding: 0.6rem 1rem;
          }

          /* Message width on mobile */
          .max-w-\\[75\\%\\] {
            max-width: 85% !important;
          }
        }

        /* Custom scrollbar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }

        .dark .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #4b5563;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }

        .dark .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
    </>
  );
};

export default ChatbotWidget;