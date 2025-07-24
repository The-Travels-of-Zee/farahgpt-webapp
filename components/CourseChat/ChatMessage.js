import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export const ChatMessage = ({ message, isUser = true, isLoading = false }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [displayedWords, setDisplayedWords] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  // Check if message is already saved
  useEffect(() => {
    if (!isUser) {
      const savedMessages = JSON.parse(localStorage.getItem("savedMessages") || "[]");
      const messageExists = savedMessages.some(
        (saved) => saved.content === message.content && saved.time === message.time
      );
      setIsSaved(messageExists);
    }
  }, [message.content, message.time, isUser]);

  // Word-by-word fade-in animation
  useEffect(() => {
    if (!isUser && message?.content && !isLoading) {
      const words = message.content.split(" ");
      setDisplayedWords([]);
      setIsTyping(true);

      let index = 0;
      const interval = setInterval(() => {
        setDisplayedWords((prev) => [...prev, words[index]]);
        index++;
        if (index >= words.length) {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 60); // Faster speed (adjust if needed)

      return () => clearInterval(interval);
    } else {
      // For user messages or loading state, show full message instantly
      setDisplayedWords(message.content.split(" "));
      setIsTyping(false);
    }
  }, [message.content, isUser, isLoading]);

  const toggleSave = () => {
    if (isUser || isLoading) return;
    const savedMessages = JSON.parse(localStorage.getItem("savedMessages") || "[]");

    if (isSaved) {
      const updatedMessages = savedMessages.filter(
        (saved) => !(saved.content === message.content && saved.time === message.time)
      );
      localStorage.setItem("savedMessages", JSON.stringify(updatedMessages));
      setIsSaved(false);
    } else {
      const messageToSave = {
        ...message,
        savedAt: new Date().toISOString(),
      };
      savedMessages.push(messageToSave);
      localStorage.setItem("savedMessages", JSON.stringify(savedMessages));
      setIsSaved(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-2 sm:gap-3 p-3 sm:p-4 ${isUser ? "justify-end" : ""}`}
    >
      {!isUser && (
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
          <img src="/favicon/favicon.png" width={64} height={64} alt="farahgpt-logo" className="inline p-1" />
        </div>
      )}

      <div className={`flex flex-col max-w-[85%] sm:max-w-[75%] lg:max-w-2xl ${isUser ? "items-end" : ""}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-slate-600 text-sm sm:text-base">{isUser ? "You" : "Farah"}</span>
          <span className="text-xs text-slate-500">{message.time}</span>

          {!isUser && (
            <button
              onClick={toggleSave}
              className={`ml-2 p-1 rounded-full transition-colors duration-200 ${
                isSaved ? "text-yellow-500 hover:text-yellow-600" : "text-slate-400 hover:text-slate-600"
              }`}
              title={isSaved ? "Unsave message" : "Save message"}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill={isSaved ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
              >
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
              </svg>
            </button>
          )}
        </div>

        <div
          className={`p-2.5 sm:p-3 rounded-lg break-words ${
            isUser ? "bg-primary text-white ml-auto" : "bg-white border border-slate-200"
          }`}
        >
          <p className="text-sm sm:text-base leading-relaxed flex flex-wrap">
            {displayedWords.map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="mr-1"
              >
                {word}
              </motion.span>
            ))}
            {/* {isTyping && <motion.span className="animate-pulse ml-1">|</motion.span>} */}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
