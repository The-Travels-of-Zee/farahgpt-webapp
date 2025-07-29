"use client";
import { useState, useEffect } from "react";
import { ChatSidebar } from "@/components/CourseChat/ChatSidebar";
import { ChatArea } from "@/components/CourseChat/ChatArea";
import { v4 as uuidv4 } from "uuid";

const SAMPLE_RECENT_CHATS = [
  {
    id: "1",
    title: "New conversation",
    preview: "",
    time: "14h ago",
  },
  {
    id: "2",
    title: "I feel demotivated",
    preview: "I have been praying for my pr...",
    time: "18h ago",
  },
];

const INITIAL_MESSAGES = [
  {
    id: uuidv4(),
    isUser: false,
    text: "Assalamu Alaikum! I'm Farah, your course mentor. What would you like to know about this course?",
    time: "18:36",
  },
];

export default function Chat() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [recentChats, setRecentChats] = useState(SAMPLE_RECENT_CHATS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const checkIsDesktop = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      // Auto-open sidebar on desktop, auto-close on mobile
      if (desktop && !isSidebarOpen) {
        setIsSidebarOpen(true);
      } else if (!desktop && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop);
    return () => window.removeEventListener("resize", checkIsDesktop);
  }, []);

  const handleSendMessage = (text) => {
    const userMessage = {
      id: uuidv4(),
      isUser: true,
      text,
      time: new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Simulated AI response
    setTimeout(() => {
      const aiResponse = {
        id: uuidv4(),
        isUser: false,
        text: "Thank you for your question. I'm here to help you with Islamic teachings and guidance. How can I assist you further?",
        time: new Date().toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleNewChat = () => {
    const newChat = {
      id: uuidv4(),
      title: "New conversation",
      preview: "",
      time: "Just now",
    };
    setRecentChats((prev) => [newChat, ...prev]);
    setMessages([INITIAL_MESSAGES[0]]);
  };

  const handleChatSelect = (chat) => {
    console.log("Selected chat:", chat);
    // In real app, fetch messages based on chat.id
    setMessages([INITIAL_MESSAGES[0]]);

    // Auto-close sidebar on mobile after selection
    if (!isDesktop) {
      setIsSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex h-dvh bg-white overflow-hidden">
      {/* Sidebar */}
      <ChatSidebar
        onNewChat={handleNewChat}
        recentChats={recentChats}
        onChatSelect={handleChatSelect}
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <ChatArea
          messages={messages}
          onSendMessage={handleSendMessage}
          onToggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
      </div>
    </div>
  );
}
