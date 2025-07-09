import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";

export const ChatArea = ({ messages, onSendMessage, onToggleSidebar }) => {
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

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto pb-20 lg:pb-44 pt-8 lg:pt-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-2 sm:px-0">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} isUser={message.isUser} />
          ))}

          {messages.length === 0 && (
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
        </div>
      </div>

      {/* Input Area */}
      <ChatInput onSendMessage={onSendMessage} />
    </div>
  );
};
