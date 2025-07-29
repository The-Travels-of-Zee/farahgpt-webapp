import { X, Plus, MessageCircle, Crown, ArrowLeft, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

export const ChatSidebar = ({
  onNewChat,
  recentChats,
  onChatSelect,
  onChatRename,
  onChatDelete,
  isOpen,
  onToggle,
  currentSessionId,
  messageCount = 0,
}) => {
  const [editingChatId, setEditingChatId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [showDropdownId, setShowDropdownId] = useState(null);

  const handleStartRename = (chat) => {
    setEditingChatId(chat.id);
    setEditingTitle(chat.title);
    setShowDropdownId(null);
  };

  const handleSaveRename = (chatId) => {
    if (editingTitle.trim()) {
      onChatRename(chatId, editingTitle.trim());
    }
    setEditingChatId(null);
    setEditingTitle("");
  };

  const handleCancelRename = () => {
    setEditingChatId(null);
    setEditingTitle("");
  };

  const handleDeleteChat = (chatId) => {
    onChatDelete(chatId);
    setShowDropdownId(null);
  };

  const handleKeyDown = (e, chatId) => {
    if (e.key === "Enter") {
      handleSaveRename(chatId);
    } else if (e.key === "Escape") {
      handleCancelRename();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          x: isOpen ? 0 : "-400px",
          transition: { type: "spring", damping: 25, stiffness: 200 },
        }}
        className={`
          fixed lg:static top-0 left-0 h-full
          w-[min(320px,85vw)] sm:w-80 lg:pt-16
          bg-slate-50 border-r border-slate-200 
          flex flex-col z-40
          lg:!transform-none lg:w-80
          ${isOpen ? "shadow-xl lg:shadow-none" : ""}
        `}
      >
        {/* Header */}
        <div className="flex-shrink-0 mt-18 lg:mt-0 p-3 sm:p-4 border-b border-slate-200">
          <div className="flex flex-col items-start gap-3">
            <div className="flex items-center justify-between w-full">
              <Link
                href="/learning"
                className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0"
              >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </Link>

              <div className="flex items-center justify-between gap-2 flex-shrink-0">
                <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-sm">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </span>
                <button
                  onClick={onToggle}
                  className="w-5 h-5 text-slate-600 hover:text-slate-800 lg:hidden p-0.5 -m-0.5"
                  aria-label="Close sidebar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="mt-4 flex items-start gap-2 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-slate-800 text-sm sm:text-base leading-tight">
                  Visionaire: The Art of Dream Duas
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">AI Islamic Assistant</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Sessions Info */}
        <div className="flex-shrink-0 p-3 sm:p-4 bg-slate-100/50">
          <h2 className="font-semibold text-slate-700 text-sm sm:text-base mb-1">Chat Sessions</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {messageCount} message{messageCount !== 1 ? "s" : ""} in current session
          </p>
        </div>

        {/* New Chat Button */}
        <div className="flex-shrink-0 p-3 sm:p-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 1024) onToggle();
            }}
            className="
              w-full bg-primary text-white 
              py-2.5 sm:py-3 px-4 rounded-lg 
              font-medium flex items-center justify-center gap-2 
              hover:bg-secondary active:bg-primary/90
              transition-colors text-sm sm:text-base
              focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2
            "
          >
            <Plus className="w-4 h-4 flex-shrink-0" />
            <span>New Chat</span>
          </motion.button>
        </div>

        {/* Recent Chats */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <div className="px-3 sm:px-4 pb-2 flex-shrink-0">
            <h3 className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wide">Recent Chats</h3>
          </div>

          <div className="flex-1 overflow-y-auto px-3 sm:px-4 pb-4">
            {recentChats.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-slate-400">No recent chats yet.</p>
              </div>
            ) : (
              <div className="space-y-1 mt-4">
                {recentChats.map((chat, index) => (
                  <motion.div
                    key={chat.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`
                      relative group rounded-lg transition-colors
                      ${currentSessionId === chat.id ? "bg-primary/10 border border-primary/20" : "hover:bg-slate-100"}
                    `}
                  >
                    {editingChatId === chat.id ? (
                      // Editing mode
                      <div className="p-2.5 sm:p-3">
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, chat.id)}
                          onBlur={() => handleSaveRename(chat.id)}
                          className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          autoFocus
                        />
                      </div>
                    ) : (
                      // Normal mode
                      <>
                        <button
                          className="w-full text-left p-2.5 sm:p-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
                          onClick={() => {
                            onChatSelect(chat);
                            if (window.innerWidth < 1024) onToggle();
                          }}
                        >
                          <h4
                            className={`font-medium text-sm mb-1 line-clamp-1 pr-8 ${
                              currentSessionId === chat.id ? "text-primary" : "text-slate-800"
                            }`}
                          >
                            {chat.title}
                          </h4>
                          {chat.preview && <p className="text-xs text-slate-500 line-clamp-2 mb-1">{chat.preview}</p>}
                          <span className="text-xs text-slate-400">{chat.time}</span>
                        </button>

                        {/* Dropdown Menu */}
                        <div className="absolute top-2 right-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowDropdownId(showDropdownId === chat.id ? null : chat.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded hover:bg-slate-200 transition-all"
                          >
                            <MoreVertical className="w-3 h-3 text-slate-500" />
                          </button>

                          <AnimatePresence>
                            {showDropdownId === chat.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                className="absolute right-0 top-8 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50 min-w-[120px]"
                              >
                                <button
                                  onClick={() => handleStartRename(chat)}
                                  className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <Edit2 className="w-3 h-3" />
                                  Rename
                                </button>
                                <button
                                  onClick={() => handleDeleteChat(chat.id)}
                                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  Delete
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Click outside to close dropdown */}
      {showDropdownId && <div className="fixed inset-0 z-30" onClick={() => setShowDropdownId(null)} />}
    </>
  );
};
