"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Menu,
  X,
  Home,
  BookOpen,
  User,
  MessageCircle,
  Star,
  Settings,
  ChevronRight,
  Crown,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const Main = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const sidebarVariants = {
    closed: { x: -280, opacity: 0 },
    open: { x: 0, opacity: 1 },
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100">
      <div className="container mx-auto relative">
        {/* Mobile Menu Button */}
        <motion.button
          className="absolute top-5 left-4 z-30 lg:hidden bg-emerald-600 text-white p-2 rounded-lg shadow-lg"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>

        {/* Sidebar */}
        <motion.div
          className={`fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-emerald-800 to-emerald-900 text-white shadow-2xl z-20 lg:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 lg:transition-none`}
          variants={sidebarVariants}
          initial="closed"
          animate={isSidebarOpen ? "open" : "closed"}
        >
          {/* Logo Section */}
          <div className="p-6 border-b border-emerald-700/50">
            <motion.div
              className="flex items-center space-x-3"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold">F</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">FarahGPT</h1>
                <p className="text-emerald-200 text-sm">Islamic AI Companion</p>
              </div>
            </motion.div>
          </div>

          {/* User Welcome */}
          <motion.div
            className="p-4 mx-4 mt-26 bg-emerald-700/50 rounded-lg border border-emerald-600/30"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center space-x-3">
              <User className="w-8 h-8 text-emerald-200" />
              <div>
                <p className="font-medium">Welcome back!</p>
                <div className="flex items-center space-x-1">
                  <Crown className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-emerald-200">Premium User</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
          <nav className="mt-6 px-4">
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {[
                { icon: Home, label: "Home", active: true },
                { icon: BookOpen, label: "Courses" },
                { icon: User, label: "Profile" },
              ].map((item, index) => (
                <motion.button
                  key={item.label}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    item.active
                      ? "bg-emerald-600 text-white shadow-lg"
                      : "text-emerald-200 hover:bg-emerald-700/50 hover:text-white"
                  }`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </motion.button>
              ))}
            </motion.div>
          </nav>

          {/* Quick Actions */}
          <div className="mt-8 px-4">
            <h3 className="text-sm font-medium text-emerald-300 mb-3">QUICK ACTIONS</h3>
            <div className="space-y-2">
              {[
                { icon: MessageCircle, label: "New Chat" },
                { icon: Star, label: "Saved Messages" },
                { icon: Sparkles, label: "Premium Active" },
              ].map((item, index) => (
                <motion.button
                  key={item.label}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-emerald-200 hover:bg-emerald-700/50 hover:text-white rounded-lg transition-all"
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <item.icon size={18} />
                  <span className="text-sm">{item.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div>
          <motion.div
            className="min-h-screen p-6 lg:p-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Header */}
            <motion.div className="mb-8 text-center" variants={itemVariants}>
              <h1 className="text-4xl lg:text-5xl font-bold text-emerald-900 mb-2">FarahGPT</h1>
              <p className="text-lg text-emerald-700">Your AI-powered Islamic companion for learning and guidance</p>
            </motion.div>

            {/* Premium Plan Card */}
            <motion.div className="max-w-2xl mx-auto mb-8" variants={itemVariants}>
              <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 border-2 border-yellow-300 rounded-2xl p-6 lg:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-200/30 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Crown className="w-8 h-8 text-yellow-600" />
                      <h2 className="text-2xl font-bold text-yellow-800">Premium Plan</h2>
                    </div>
                    <motion.div
                      className="bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-medium"
                      whileHover={{ scale: 1.05 }}
                    >
                      ACTIVE
                    </motion.div>
                  </div>

                  <p className="text-yellow-700 mb-6">
                    You have access to advanced courses, chat history and priority support
                  </p>

                  <div className="grid md:grid-cols-3 gap-2 place-items-start lg:place-items-center mb-6">
                    {["Advanced Islamic Courses", "Priority Support", "Chat History Access"].map((feature, index) => (
                      <motion.div
                        key={feature}
                        className="flex items-center space-x-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                        <span className="text-sm text-yellow-800">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  <Link href="/plans">
                    <motion.button
                      className="min-w-max p-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-medium transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Manage Subscription
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Start Chat Button */}
            <motion.div className="max-w-6xl mx-auto mb-12" variants={itemVariants}>
              <Link href="/learning/chat">
                <motion.button
                  className="min-w-max p-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl font-medium text-lg shadow-lg flex items-center justify-center space-x-3"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MessageCircle size={24} />
                  <span>Start a Chat</span>
                  <ChevronRight size={20} />
                </motion.button>
              </Link>
            </motion.div>

            {/* Feature Cards */}
            <motion.div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6" variants={itemVariants}>
              {[
                {
                  icon: BookOpen,
                  title: "Islamic Courses",
                  description: "Comprehensive courses on Quran, Hadith, and Islamic jurisprudence",
                  color: "from-blue-500 to-blue-600",
                },
                {
                  icon: MessageCircle,
                  title: "AI Guidance",
                  description: "Get instant answers to your Islamic questions with AI assistance",
                  color: "from-emerald-500 to-emerald-600",
                },
                {
                  icon: Star,
                  title: "Premium Features",
                  description: "Access advanced content and priority support",
                  color: "from-yellow-500 to-yellow-600",
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-10 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    </main>
  );
};

export default Main;
