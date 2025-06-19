import { motion } from "@/lib/motion";

export const ChatMessage = ({ message, isUser = false }) => {
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
          <span className="font-medium text-slate-800 text-sm sm:text-base">{isUser ? "You" : "Farah"}</span>
          <span className="text-xs text-slate-500">{message.time}</span>
        </div>

        <div
          className={`p-2.5 sm:p-3 rounded-lg break-words ${
            isUser ? "bg-blue-500 text-white ml-auto" : "bg-white border border-slate-200"
          }`}
        >
          <p className="text-sm sm:text-base leading-relaxed">{message.text}</p>
        </div>
      </div>
    </motion.div>
  );
};
