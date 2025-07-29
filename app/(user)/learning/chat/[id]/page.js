"use client";
import { useState, useEffect } from "react";
import { ChatSidebar } from "@/components/CourseChat/ChatSidebar";
import { ChatArea } from "@/components/CourseChat/ChatArea";
import { useChatStorage } from "@/hooks/useChatStorage";
import { v4 as uuidv4 } from "uuid";

const INITIAL_MESSAGE = {
  id: uuidv4(),
  role: "assistant", // Changed from isUser: false to role for consistency
  content: "Assalamu Alaikum! I'm Farah, your course mentor. What would you like to know about this course?",
  time: new Date().toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  }),
};

export default function Chat() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [loading, setLoading] = useState(false);

  // Use the chat storage hook
  const chatStorage = useChatStorage();
  const {
    createNewSession,
    switchToSession,
    renameSession,
    deleteSession,
    getRecentSessions,
    getCurrentSession,
    addMessageToCurrentSession,
    currentSessionId,
    chatSessions,
  } = chatStorage;

  // Get current session and messages
  const currentSession = getCurrentSession();
  const messages = currentSession?.messages || [];

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
  }, [isSidebarOpen]);

  // Create initial session if none exists
  useEffect(() => {
    if (!chatStorage.loading && !currentSessionId && chatSessions.length === 0) {
      createNewSession().then(async (newSession) => {
        // Add initial message to the new session
        await addMessageToCurrentSession(INITIAL_MESSAGE);
      });
    }
  }, [chatStorage.loading, currentSessionId, chatSessions.length, createNewSession, addMessageToCurrentSession]);

  const handleSendMessage = async (text) => {
    if (!currentSessionId) {
      // Create new session if none exists
      await createNewSession();
    }

    const userMessage = {
      id: uuidv4(),
      role: "user",
      content: text,
      time: new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // Add user message to storage
    await addMessageToCurrentSession(userMessage);

    // Set loading state for AI response
    setLoading(true);

    // Simulated AI response
    setTimeout(async () => {
      const aiResponse = {
        id: uuidv4(),
        role: "assistant",
        content:
          "Thank you for your question. I'm here to help you with Islamic teachings and guidance. How can I assist you further?",
        time: new Date().toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      // Add AI response to storage
      await addMessageToCurrentSession(aiResponse);
      setLoading(false);
    }, 1000);
  };

  const handleNewChat = async () => {
    const newSession = await createNewSession();
    // Add initial message to the new session
    await addMessageToCurrentSession(INITIAL_MESSAGE);

    // Auto-close sidebar on mobile after creation
    if (!isDesktop) {
      setIsSidebarOpen(false);
    }
  };

  const handleChatSelect = async (chat) => {
    await switchToSession(chat.id);

    // Auto-close sidebar on mobile after selection
    if (!isDesktop) {
      setIsSidebarOpen(false);
    }
  };

  const handleChatRename = async (chatId, newTitle) => {
    await renameSession(chatId, newTitle);
  };

  const handleChatDelete = async (chatId) => {
    await deleteSession(chatId);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Show loading while initializing
  if (chatStorage.loading) {
    return (
      <div className="flex h-dvh bg-white overflow-hidden items-center justify-center">
        <div className="text-slate-500">Loading chat sessions...</div>
      </div>
    );
  }

  return (
    <div className="flex h-dvh bg-white overflow-hidden">
      {/* Sidebar */}
      <ChatSidebar
        onNewChat={handleNewChat}
        recentChats={getRecentSessions()}
        onChatSelect={handleChatSelect}
        onChatRename={handleChatRename}
        onChatDelete={handleChatDelete}
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        currentSessionId={currentSessionId}
        messageCount={messages.length}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <ChatArea
          onSendMessage={handleSendMessage}
          onToggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
      </div>
    </div>
  );
}
