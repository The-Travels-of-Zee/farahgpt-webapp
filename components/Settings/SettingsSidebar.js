"use client";

import { sidebarLinks } from "@/constants";
import { useUser } from "@/hooks/useUser";
import useUserStore from "@/store/userStore";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Crown, User, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const SettingsSidebar = ({ isOpen, onToggle, activeSection, onSectionChange }) => {
  const { user, isPremium, refreshUser, _hasHydrated } = useUser();
  // const { isPremium } = useUserStore();
  // console.lozg(user);

  const [activeTab, setActiveTab] = useState("profile-settings");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const urlParams = new URLSearchParams(window.location.search);
    const tabFromUrl = urlParams.get("tab");
    const savedTab = localStorage.getItem("settings-active-tab");

    const initialTab = tabFromUrl || savedTab || "profile-settings";

    const validTabs = [
      "profile-settings",
      "account-security",
      "payment-settings",
      "payment-receive",
      "withdraw-funds",
      "notification-settings",
      "close-account",
    ];

    if (validTabs.includes(initialTab)) {
      setActiveTab(initialTab);
      onSectionChange(initialTab, true);
    }
  }, [onSectionChange]);

  // Auto-refresh user data after hydration to ensure we have latest data
  useEffect(() => {
    if (_hasHydrated && user?.id) {
      refreshUser(user.id);
    }
  }, [_hasHydrated, user?.id]);

  // Listen for profile update events
  useEffect(() => {
    const handleProfileUpdated = () => {
      if (user?.id) {
        refreshUser(user.id);
      }
    };

    window.addEventListener("profileUpdated", handleProfileUpdated);

    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdated);
    };
  }, [user?.id, refreshUser]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    onSectionChange(tabId);

    // Save to localStorage
    localStorage.setItem("settings-active-tab", tabId);

    // Update URL without page refresh
    const url = new URL(window.location);
    url.searchParams.set("tab", tabId);
    window.history.replaceState({}, "", url);
  };

  const Navigations = () => {
    if (!isClient) {
      return (
        <nav className="mt-4 flex-1 overflow-y-auto">
          <ul className="px-4 space-y-1.5">
            {sidebarLinks.map((item) => (
              <li key={item.id}>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-teal-700">
                  <item.icon className="w-5 h-5 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      );
    }
    return (
      <nav className="mt-4 flex-1 overflow-y-auto">
        <ul className="px-4 space-y-1.5">
          {sidebarLinks.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out ${
                  activeSection === item.id
                    ? "bg-gradient-to-r from-teal-100 to-teal-50 text-teal-700 shadow-sm"
                    : "hover:bg-teal-50 text-slate-700 hover:text-teal-700"
                }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    );
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-10 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{
          x: isOpen ? 0 : "-100%",
          transition: { type: "spring", damping: 30, stiffness: 300 },
        }}
        className={`fixed lg:static top-0 left-0 h-full w-[min(320px,85vw)] sm:w-80 bg-white border-r border-teal-200 flex flex-col z-20 lg:!transform-none ${
          isOpen ? "shadow-xl lg:shadow-none" : ""
        }`}
      >
        {/* Header */}
        <div className="p-4 mt-18 lg:mt-0 border-b border-teal-200 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Link
              href="/learning"
              className="w-8 h-8 bg-teal-50 rounded-full flex items-center justify-center hover:bg-teal-100 transition-colors"
              aria-label="Back to learning"
            >
              <ArrowLeft className="w-5 h-5 text-teal-700" />
            </Link>

            <div className="flex items-center gap-2">
              {isPremium && (
                <>
                  <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-sm">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </span>
                </>
              )}
              <button
                onClick={onToggle}
                className="w-6 h-6 text-teal-600 hover:text-teal-800 lg:hidden transition-colors"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* User Info */}
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center overflow-hidden shadow-lg">
                {user?.photo_url ? (
                  <img src={user?.photo_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-white" />
                )}
              </div>
            </div>
            <div className="flex items-center text-sm sm:text-base font-medium text-teal-800">{user?.name}</div>
          </div>
        </div>

        {/* Navigation */}
        <Navigations />
      </motion.div>
    </>
  );
};

export default SettingsSidebar;
