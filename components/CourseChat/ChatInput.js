"use client";
import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";

const messageSchema = z.object({
  text: z.string().min(1, "Message cannot be empty").max(1000, "Message too long"),
});

export const ChatInput = ({ chatHook, onSendMessage }) => {
  const { loading, error, sendMessage } = chatHook;
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  // Auto-resize textarea height
  useEffect(() => {
    const resize = () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        const scrollHeight = textareaRef.current.scrollHeight;
        textareaRef.current.style.height = `${Math.min(scrollHeight, 150)}px`;
      }
    };

    requestAnimationFrame(resize);
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const validatedMessage = messageSchema.parse({ text: message.trim() });

      onSendMessage(validatedMessage.text);
      setMessage("");

      await sendMessage(validatedMessage.text);
    } catch (err) {
      console.log(err.errors?.[0]?.message || err.message);
    }
  };

  const isMessageValid = message.trim().length > 0 && message.trim().length <= 1000;

  return (
    <div className="fixed bottom-0 left-0 lg:left-72 right-0 z-50">
      <div className="bg-white/95 backdrop-blur-xl border-t border-slate-200/60">
        <div className="max-w-screen-xl mx-auto p-3 sm:p-4 lg:p-6">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium flex items-center gap-2"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-end gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <div
                className={`
                  relative rounded-2xl border-2 transition-all duration-300 overflow-hidden
                  ${
                    isFocused
                      ? "border-emerald-300 bg-white shadow-md"
                      : "border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300"
                  }
                `}
              >
                <div className="relative flex items-end">
                  <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Type your message here..."
                    className="flex-1 py-3 px-3 bg-transparent border-none resize-none focus:outline-none text-slate-700 placeholder-slate-400 text-sm sm:text-base leading-6 max-h-[150px]"
                    style={{ minHeight: "24px" }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (isMessageValid && !loading) handleSubmit(e);
                      }
                    }}
                  />
                </div>

                <AnimatePresence>
                  {message.length > 800 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-4 pb-2 text-right"
                    >
                      <span
                        className={`text-xs font-medium ${
                          message.length > 1000
                            ? "text-red-500"
                            : message.length > 950
                            ? "text-orange-500"
                            : "text-slate-400"
                        }`}
                      >
                        {message.length}/1000
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleSubmit}
              disabled={!isMessageValid || loading}
              className={`
                relative flex items-center justify-center rounded-2xl font-semibold transition-all duration-300 flex-shrink-0
                ${
                  loading || !isMessageValid
                    ? "w-12 h-12 sm:w-14 sm:h-14"
                    : "w-12 h-12 sm:w-14 sm:h-14 lg:w-auto lg:h-12 lg:px-6"
                }
                ${
                  isMessageValid && !loading
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-emerald-500/25"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }
              `}
            >
              <div className="relative flex items-center gap-2">
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <AnimatePresence>
                      {isMessageValid && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          className="hidden lg:block text-sm whitespace-nowrap overflow-hidden"
                        >
                          Send
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </div>
            </motion.button>
          </div>

          <AnimatePresence>
            {!message && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: 0.2 }}
                className="mt-3 flex flex-wrap gap-2"
              >
                {[
                  "What does this dream mean?",
                  "Islamic guidance on...",
                  "Help me understand...",
                  "Can you explain...?",
                ].map((suggestion, index) => (
                  <motion.button
                    key={suggestion}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMessage(suggestion)}
                    className="px-3 py-1.5 text-xs sm:text-sm bg-slate-100 hover:bg-emerald-500 text-slate-600 hover:text-white rounded-full transition-all duration-200 border border-slate-200 hover:border-emerald-500"
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
