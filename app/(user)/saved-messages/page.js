"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const SavedMessagesPage = () => {
  const [savedMessages, setSavedMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMessages, setFilteredMessages] = useState([]);

  // Load saved messages from localStorage
  useEffect(() => {
    const loadSavedMessages = () => {
      try {
        const stored = localStorage.getItem("savedMessages");
        if (stored) {
          const messages = JSON.parse(stored);
          // Transform the stored messages to match the component's expected format
          const transformedMessages = messages.map((message, index) => ({
            id: `saved_${index}_${Date.now()}`, // Generate unique ID
            content: message.content,
            timestamp: message.time,
            date: formatDate(message.savedAt),
            sender: "Farah", // Since we only save AI messages
            photo_url: "F",
            saved: true,
            savedAt: message.savedAt,
          }));
          setSavedMessages(transformedMessages);
          setFilteredMessages(transformedMessages);
        }
      } catch (error) {
        console.error("Error loading saved messages:", error);
        setSavedMessages([]);
        setFilteredMessages([]);
      }
    };

    loadSavedMessages();

    // Listen for localStorage changes (if messages are saved/unsaved in other tabs)
    const handleStorageChange = (e) => {
      if (e.key === "savedMessages") {
        loadSavedMessages();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Helper function to format date
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (messageDate.getTime() === today.getTime()) {
      return "Today";
    } else if (messageDate.getTime() === yesterday.getTime()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  // Filter messages based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredMessages(savedMessages);
    } else {
      const filtered = savedMessages.filter(
        (message) =>
          message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          message.sender.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMessages(filtered);
    }
  }, [searchQuery, savedMessages]);

  // Unsave message function
  const unsaveMessage = (messageId) => {
    try {
      // Find the message to remove
      const messageToRemove = savedMessages.find((msg) => msg.id === messageId);
      if (!messageToRemove) return;

      // Update localStorage
      const storedMessages = JSON.parse(localStorage.getItem("savedMessages") || "[]");
      const updatedStoredMessages = storedMessages.filter(
        (stored) => !(stored.content === messageToRemove.content && stored.time === messageToRemove.timestamp)
      );
      localStorage.setItem("savedMessages", JSON.stringify(updatedStoredMessages));

      // Update component state
      setSavedMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    } catch (error) {
      console.error("Error removing saved message:", error);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -100, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white shadow-sm border-b border-gray-200"
      >
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-800 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Saved Messages</h1>
                <p className="text-sm text-gray-600">{filteredMessages.length} messages saved</p>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Search Bar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search saved messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </motion.div>

        {/* Messages List */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
          <AnimatePresence>
            {filteredMessages.map((message) => (
              <motion.div
                key={message.id}
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {/* Avatar */}
                    <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <img
                        src="/favicon/favicon.png"
                        width={24}
                        height={24}
                        alt="farah-logo"
                        className="inline p-0.5"
                      />
                    </div>

                    {/* Message Content */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">{message.sender}</span>
                        <span className="text-xs text-gray-500">{message.date}</span>
                        <span className="text-xs text-gray-500">{message.timestamp}</span>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{message.content}</p>
                      {message.savedAt && (
                        <p className="text-xs text-gray-400 mt-2">
                          Saved on {new Date(message.savedAt).toLocaleDateString()} at{" "}
                          {new Date(message.savedAt).toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Unsave Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => unsaveMessage(message.id)}
                    className="ml-4 p-2 text-yellow-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Unsave message"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredMessages.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? "No messages found" : "No saved messages"}
            </h3>
            <p className="text-gray-600">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Start saving important messages from your conversations"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SavedMessagesPage;
