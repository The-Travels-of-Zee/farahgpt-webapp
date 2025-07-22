"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const SavedMessagesPage = () => {
  const [savedMessages, setSavedMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMessages, setFilteredMessages] = useState([]);

  useEffect(() => {
    const mockSavedMessages = [
      {
        id: 1,
        content: "Assalamu Alaikum! I'm Farah, your course mentor. What would you like to know about this course?",
        timestamp: "18:36",
        date: "Today",
        sender: "Farah",
        photo_url: "F",
        saved: true,
      },
      {
        id: 2,
        content:
          "The Art of Dream Duas is a comprehensive course that explores the spiritual dimensions of Islamic supplications and their connection to our subconscious mind.",
        timestamp: "18:45",
        date: "Today",
        sender: "Farah",
        photo_url: "F",
        saved: true,
      },
      {
        id: 3,
        content: "Can you explain more about the practical applications of dream interpretation in daily life?",
        timestamp: "19:12",
        date: "Yesterday",
        sender: "You",
        photo_url: "Y",
        saved: true,
      },
      {
        id: 4,
        content:
          "Dream interpretation in Islam follows specific guidelines from the Quran and Sunnah. There are three types of dreams: true dreams from Allah, dreams from the self, and dreams from Shaytan.",
        timestamp: "19:15",
        date: "Yesterday",
        sender: "Farah",
        photo_url: "F",
        saved: true,
      },
      {
        id: 5,
        content: "I feel demotivated and have been struggling with consistency in my prayers and Islamic studies.",
        timestamp: "14h ago",
        date: "Yesterday",
        sender: "You",
        photo_url: "Y",
        saved: true,
      },
    ];

    setSavedMessages(mockSavedMessages);
    setFilteredMessages(mockSavedMessages);
  }, []);

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
    setSavedMessages((prev) => prev.filter((msg) => msg.id !== messageId));
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
                    {/* photo_url */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        message.sender === "Farah" ? "bg-teal-500 text-white" : "bg-gray-600 text-white"
                      }`}
                    >
                      {message.photo_url}
                    </div>

                    {/* Message Content */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">{message.sender}</span>
                        <span className="text-xs text-gray-500">{message.date}</span>
                        <span className="text-xs text-gray-500">{message.timestamp}</span>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </div>

                  {/* Unsave Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => unsaveMessage(message.id)}
                    className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Unsave message"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
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

        {/* Back to Chat Button */}
        {/* <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="fixed bottom-6 right-6"
        >
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-full shadow-lg transition-colors flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>Back to Chat</span>
            </motion.button>
          </Link>
        </motion.div> */}
      </div>
    </div>
  );
};

export default SavedMessagesPage;
