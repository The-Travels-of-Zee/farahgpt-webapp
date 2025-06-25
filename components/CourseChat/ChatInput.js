"use client";
import { useState } from "react";
import { Send } from "lucide-react";
import { motion } from "framer-motion";
import { z } from "zod";

const messageSchema = z.object({
  text: z.string().min(1, "Message cannot be empty").max(1000, "Message too long"),
});

export const ChatInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      const validatedMessage = messageSchema.parse({ text: message.trim() });
      onSendMessage(validatedMessage.text);
      setMessage("");
      setError("");
    } catch (err) {
      setError(err.errors[0].message);
    }
  };

  return (
    <div className="border-t border-slate-200 p-3 sm:p-4 bg-white">
      <form onSubmit={handleSubmit} className="flex justify-between items-center gap-2 sm:gap-3">
        <div className="flex-1 min-w-0">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask a question..."
            className="w-full p-2.5 sm:p-3 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
            rows="2"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={!message.trim()}
          className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </motion.button>
      </form>
    </div>
  );
};
