"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "@/lib/motion";
import { Search, Bell, User, ChevronDown, BookOpen, Award, Settings, LogOut } from "lucide-react";
import Button from "./Button";
import Link from "next/link";
import NotificationDropdown from "../Notification";

// 🔐 Mock authentication hook (replace with real auth later)
const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const user = isLoggedIn
    ? {
        name: "Shaheer Mansoor",
        email: "shaheer.mansoor@example.com",
        avatar: null,
        initials: "SM",
      }
    : null;

  return { isLoggedIn, user, login: () => setIsLoggedIn(true), logout: () => setIsLoggedIn(false) };
};

const DashboardNavbar = () => {
  const { isLoggedIn, user, logout } = useAuth();

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [notifications] = useState(2);

  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    if (isUserDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserDropdownOpen]);

  const dropdownLinks = [
    { icon: User, label: "My Profile", href: "/dashboard" },
    { icon: BookOpen, label: "My Learning", href: "/learning" },
    // { icon: Award, label: "My Certificates", href: "/dashboard" },
    { icon: Settings, label: "Account Settings", href: "/instructor/account-settings" },
  ];
  return (
    <motion.header
      className="bg-white border-b border-gray-200 sticky top-0 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side - Logo and Greeting */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex-shrink-0">
              <div className="flex items-center space-x-2 mr-4">
                <div className="w-8 h-8">
                  <img src="/favicon/favicon.svg" width={64} height={64} alt="farahgpt-logo" className="inline" />
                </div>
                <span className="hidden lg:inline text-2xl font-bold text-gray-900">FarahGPT</span>
              </div>
            </Link>

            {isLoggedIn && (
              <div className="hidden md:block ml-4">
                <h2 className="text-lg font-medium text-gray-900">Welcome back, {user.name.split(" ")[0]}!</h2>
                <p className="text-sm text-gray-600">Here's what's happening with your courses today.</p>
              </div>
            )}
          </div>

          {/* Right Side - Search & Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="hidden md:block relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search courses, students..."
                className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            {isLoggedIn && (
              <>
                {/* Create Course */}
                <Link href="/instructor/course-upload">
                  <Button className="bg-gradient-to-r from-(--primary-light) to-secondary text-white" size="md">
                    Create Course
                  </Button>
                </Link>

                {/* Notifications */}
                {/* <motion.button
                  className="p-2 text-gray-600 hover:text-secondary transition-colors relative"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Bell className="h-6 w-6" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </motion.button> */}
                <NotificationDropdown />
                {/* Settings */}
                <Link href="/instructor/account-settings">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                    <Settings className="h-6 w-6" />
                  </button>
                </Link>

                {/* User Profile Dropdown */}
                <div className="relative hidden lg:block" ref={dropdownRef}>
                  <motion.button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">{user.initials}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </motion.button>

                  <AnimatePresence>
                    {isUserDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>

                        <div className="py-2">
                          {dropdownLinks.map((item) => (
                            <motion.a
                              key={item.label}
                              href={item.href}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              whileHover={{ x: 0 }}
                            >
                              <item.icon className="h-4 w-4 mr-3 text-gray-400" />
                              {item.label}
                            </motion.a>
                          ))}
                        </div>

                        <div className="border-t border-gray-100 py-2">
                          <motion.button
                            onClick={logout}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            whileHover={{ x: 0 }}
                          >
                            <LogOut className="h-4 w-4 mr-3" />
                            Sign Out
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden px-4 pb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search courses, students..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default DashboardNavbar;
