"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  User,
  ChevronDown,
  Shield,
  Users,
  BookOpen,
  Settings,
  LogOut,
  BarChart3,
  DollarSign,
  FileText,
  Flag,
  Database,
  UserPlus,
  Plus,
  Activity,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Link from "next/link";
import NotificationDropdown from "../Notification";
import { useRouter } from "next/navigation";

// 🔐 Mock authentication hook for admin (replace with real auth later)
const useAuth = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const user = isLoggedIn
    ? {
        name: "Admin Dashboard",
        email: "admin@farahgpt.com",
        avatar: null,
        initials: "SM",
        role: "Super Admin",
      }
    : null;

  return {
    isLoggedIn,
    user,
    login: () => setIsLoggedIn(true),
    logout: () => {
      setIsLoggedIn(false);
      router.push("/admin/login");
    },
  };
};

const AdminNavbar = () => {
  const { isLoggedIn, user, logout } = useAuth();

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [notifications] = useState(5); // More notifications for admin

  const dropdownRef = useRef(null);
  const quickActionsRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsUserDropdownOpen(false);
      }
      if (quickActionsRef.current && !quickActionsRef.current.contains(e.target)) {
        setIsQuickActionsOpen(false);
      }
    };

    if (isUserDropdownOpen || isQuickActionsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserDropdownOpen, isQuickActionsOpen]);

  const dropdownLinks = [
    { icon: BarChart3, label: "Analytics Dashboard", href: "/admin/analytics" },
    { icon: Shield, label: "Admin Settings", href: "/admin/settings" },
    { icon: Activity, label: "System Logs", href: "/admin/logs" },
    { icon: Database, label: "Database Management", href: "/admin/database" },
    { icon: Settings, label: "Platform Settings", href: "/admin/platform-settings" },
  ];

  const quickActions = [
    { icon: UserPlus, label: "Add Admin User", href: "/admin/users/add", color: "bg-blue-500" },
    { icon: BookOpen, label: "Review Courses", href: "/admin/courses/review", color: "bg-green-500" },
    { icon: Flag, label: "Handle Reports", href: "/admin/reports", color: "bg-red-500" },
    { icon: FileText, label: "Generate Report", href: "/admin/reports/generate", color: "bg-purple-500" },
  ];

  return (
    <motion.header
      className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left Side - Logo and Admin Greeting */}
          <div className="flex items-center space-x-4">
            <Link href="/admin/dashboard" className="flex-shrink-0">
              <div className="flex items-center space-x-2 mr-4">
                <img src="/favicon/favicon.svg" width={48} height={48} alt="farahgpt-logo" className="inline" />
                <h1 className="text-xl font-roboto">FarahGPT</h1>
              </div>
            </Link>

            {isLoggedIn && (
              <div className="hidden md:block ml-4">
                <h2 className="text-lg font-medium text-gray-900">Admin Control Panel</h2>
                <p className="text-sm text-gray-600">Monitor and manage platform operations</p>
              </div>
            )}
          </div>

          {/* Right Side - Search & Admin Actions */}
          <div className="flex items-center space-x-4">
            {/* Enhanced Search Bar for Admin */}
            {/* <div className="hidden md:block relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users, courses, reports..."
                className="block w-72 pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
              />
            </div> */}

            {isLoggedIn && (
              <>
                {/* Quick Actions Dropdown */}
                {/* <div className="relative" ref={quickActionsRef}>
                  <Button
                    variant="blueToGreen"
                    onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
                    className="flex items-center justify-center min-w-max space-x-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Plus className="h-4 w-4" />
                    <span className="inline">Quick Actions</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>

                  <AnimatePresence>
                    {isQuickActionsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute -right-1/2 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                      >
                        {quickActions.map((action) => (
                          <motion.a
                            key={action.label}
                            href={action.href}
                            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            whileHover={{ x: 2 }}
                          >
                            <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center mr-3`}>
                              <action.icon className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <div className="font-medium">{action.label}</div>
                            </div>
                          </motion.a>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div> */}

                {/* Admin Notifications */}
                <div className="relative">
                  <NotificationDropdown />
                </div>

                {/* System Status Indicator */}
                <div className="hidden lg:flex items-center justify-between space-x-2 px-3 py-1 bg-green-50 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-700 font-medium">System Healthy</span>
                </div>

                {/* Admin Settings */}
                {/* <Link href="/admin/settings">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Settings className="h-6 w-6" />
                  </button>
                </Link> */}

                {/* Admin Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <motion.button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-secondary to-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">{user.initials}</span>
                    </div>
                    <div className="hidden xl:block text-left">
                      <div className="text-sm font-medium text-gray-900">{user.role}</div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </motion.button>

                  <AnimatePresence>
                    {isUserDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            <img
                              src="/favicon/favicon.svg"
                              width={48}
                              height={48}
                              alt="farahgpt-logo"
                              className="inline"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{user.role}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </div>

                        {/* <div className="py-2">
                          {dropdownLinks.map((item) => (
                            <motion.a
                              key={item.label}
                              href={item.href}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                              whileHover={{ x: 2 }}
                            >
                              <item.icon className="h-4 w-4 mr-3 text-gray-400" />
                              {item.label}
                            </motion.a>
                          ))}
                        </div> */}

                        <div className="border-t border-gray-100 py-2">
                          <div className="px-4 py-2">
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>Session</span>
                              <span className="text-green-600">Secure</span>
                            </div>
                          </div>
                          <motion.button
                            onClick={logout}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            whileHover={{ x: 2 }}
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
              placeholder="Search users, courses, reports..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
            />
          </div>
        </div>

        {/* Admin Status Bar (optional - can be hidden) */}
        <div className="hidden lg:flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center space-x-6 text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>1,247 Active Users</span>
            </div>
            <div className="flex items-center space-x-1">
              <BookOpen className="w-3 h-3" />
              <span>89 Courses</span>
            </div>
            <div className="flex items-center space-x-1">
              <DollarSign className="w-3 h-3" />
              <span>$45.2K Revenue</span>
            </div>
            <div className="flex items-center space-x-1">
              <Flag className="w-3 h-3" />
              <span>3 Pending Reports</span>
            </div>
          </div>
          <div className="text-xs text-gray-500">Last updated: {new Date().toLocaleTimeString()}</div>
        </div>
      </div>
    </motion.header>
  );
};

export default AdminNavbar;
