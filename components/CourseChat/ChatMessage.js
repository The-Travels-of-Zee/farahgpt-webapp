import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Markdown from "react-markdown";

export const ChatMessage = ({ message, isUser = true, isLoading = false, onWordAdded }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
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

  // Character-by-character or word-by-word animation that preserves markdown
  useEffect(() => {
    if (!isUser && message?.content && !isLoading) {
      const fullText = message.content;
      const words = fullText.split(" ");
      setDisplayedText("");
      setIsTyping(true);

      let currentWordIndex = 0;
      let displayedWords = [];

      const interval = setInterval(() => {
        displayedWords.push(words[currentWordIndex]);
        const newText = displayedWords.join(" ");
        setDisplayedText(newText);

        // Notify parent component that content was updated
        if (onWordAdded) {
          onWordAdded();
        }

        currentWordIndex++;
        if (currentWordIndex >= words.length) {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 60); // Adjust speed as needed

      return () => clearInterval(interval);
    } else {
      // For user messages or loading state, show full message instantly
      if (message?.content) {
        setDisplayedText(message.content);
      }
      setIsTyping(false);
    }
  }, [message.content, isUser, isLoading, onWordAdded]);

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

        <article
          className={`p-2.5 sm:p-3 rounded-lg break-words ${
            isUser ? "bg-primary text-white ml-auto" : ""
          }`}
        >
          {isUser ? (
            // For user messages, render as plain text without markdown
            <p className="text-sm sm:text-base leading-relaxed m-0">{displayedText}</p>
          ) : (
            // For AI messages, render with markdown and proper styling
            <div
              className={`
              prose prose-slate prose-sm sm:prose-base max-w-none
              prose-headings:text-slate-800 
              prose-headings:font-semibold
              prose-h1:text-2xl prose-h1:mb-6 prose-h1:text-emerald-700
              prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-emerald-600 prose-h2:border-b prose-h2:border-emerald-100 prose-h2:pb-2
              prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-slate-700
              prose-h4:text-base prose-h4:mt-4 prose-h4:mb-2 prose-h4:text-slate-600
              prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-4 prose-p:mt-0
              prose-strong:text-slate-800 prose-strong:font-semibold
              prose-em:text-slate-700
              prose-ul:my-4 prose-ul:text-slate-600
              prose-ol:my-4 prose-ol:text-slate-600
              prose-li:my-1 prose-li:leading-relaxed
              prose-li:marker:text-emerald-500
              prose-blockquote:border-l-4 prose-blockquote:border-emerald-200 prose-blockquote:bg-emerald-50/50 prose-blockquote:py-3 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:my-4
              prose-blockquote:text-slate-700 prose-blockquote:italic
              prose-code:bg-slate-100 prose-code:text-emerald-700 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-medium
              prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto prose-pre:my-4
              prose-a:text-emerald-600 prose-a:font-medium prose-a:no-underline hover:prose-a:text-emerald-700 hover:prose-a:underline prose-a:transition-colors
              prose-table:border-collapse prose-table:border prose-table:border-slate-200 prose-table:rounded-lg prose-table:overflow-hidden prose-table:my-4
              prose-th:bg-emerald-50 prose-th:text-emerald-800 prose-th:font-semibold prose-th:p-3 prose-th:border prose-th:border-slate-200
              prose-td:p-3 prose-td:border prose-td:border-slate-200 prose-td:text-slate-600
              prose-hr:border-emerald-100 prose-hr:my-8
            `}
            >
              <Markdown>{displayedText}</Markdown>
              {isTyping && (
                <motion.span
                  className="inline-block w-2 h-5 bg-emerald-500 ml-1 animate-pulse"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
            </div>
          )}
        </article>
      </div>
    </motion.div>
  );
};
