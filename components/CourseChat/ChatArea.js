import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { useHalalChat } from "@/hooks/useHalalChat";

export const ChatArea = ({ onToggleSidebar, onSendMessage }) => {
  const chatHook = useHalalChat();
  const { messages, loading } = chatHook;
  const [displayMessages, setDisplayMessages] = useState([]);
  const bottomRef = useRef(null); // Ref to scroll anchor

  // Keep displayMessages synced with actual chat messages
  useEffect(() => {
    setDisplayMessages(messages);
  }, [messages]);

  // Scroll to bottom function
  const scrollToBottom = useCallback(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // Scroll to bottom on new messages or loading state
  useEffect(() => {
    scrollToBottom();
  }, [displayMessages, loading, scrollToBottom]);

  // Handle word-by-word scrolling during AI typing
  const handleWordAdded = useCallback(() => {
    // Use a small delay to ensure the DOM has updated
    setTimeout(() => {
      scrollToBottom();
    }, 10);
  }, [scrollToBottom]);

  const handleSendMessage = (userMessage) => {
    const userMessageObj = {
      role: "user",
      content: userMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // Show the user message immediately
    setDisplayMessages((prev) => [...prev, userMessageObj]);

    if (onSendMessage) {
      onSendMessage(userMessage);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full min-w-0">
      {/* Mobile Header */}
      <div className="lg:hidden border-b border-slate-200 pt-20 p-3 sm:p-4 bg-white flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onToggleSidebar}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5 text-slate-600" />
        </motion.button>
        <h1 className="font-semibold text-slate-800 text-sm sm:text-base">Visionaire Chat</h1>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto pb-40 lg:pb-80 pt-8 lg:pt-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-2 sm:px-0">
          {displayMessages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message}
              isUser={message.role === "user"}
              onWordAdded={message.role !== "user" ? handleWordAdded : undefined}
            />
          ))}

          {/* AI is thinking */}
          {loading && (
            <ChatMessage message={{ content: "Farah is thinking...", time: "" }} isUser={false} isLoading={true} />
          )}

          {/* Welcome placeholder */}
          {displayMessages.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center h-full text-slate-500 p-4"
            >
              <div className="text-center max-w-md">
                <h2 className="text-lg sm:text-xl font-medium mb-2">Welcome to Visionaire</h2>
                <p className="text-sm sm:text-base">
                  Start a conversation about Islamic teachings and dream interpretation
                </p>
              </div>
            </motion.div>
          )}

          {/* Scroll anchor */}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Chat Input */}
      <ChatInput chatHook={chatHook} onSendMessage={handleSendMessage} />
    </div>
  );
};
