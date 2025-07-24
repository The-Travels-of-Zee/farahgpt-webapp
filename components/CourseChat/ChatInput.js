"use client";
import { useState } from "react";
import { Send } from "lucide-react";
import { motion } from "framer-motion";
import { z } from "zod";

const messageSchema = z.object({
  text: z.string().min(1, "Message cannot be empty").max(1000, "Message too long"),
});

export const ChatInput = ({ chatHook, onSendMessage }) => {
  const { loading, error, sendMessage } = chatHook;
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const validatedMessage = messageSchema.parse({ text: message.trim() });

      // First, show the user message immediately in the chat
      onSendMessage(validatedMessage.text);

      // Clear the input
      setMessage("");

      // Then send to AI (this will add the AI response when it comes back)
      await sendMessage(validatedMessage.text);
    } catch (err) {
      console.log(err.errors[0].message);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 lg:left-72 right-0 border-t border-slate-200 bg-white p-3 sm:p-4 z-10">
      <div className="flex w-full max-w-screen-xl justify-between mx-auto items-end gap-2 sm:gap-3">
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask a question..."
            className="w-full p-2.5 sm:p-3 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
            rows={2}
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
          type="button"
          onClick={handleSubmit}
          disabled={!message.trim() || loading}
          className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Send className="w-4 h-4" />
          )}
        </motion.button>
      </div>
    </div>
  );
};
