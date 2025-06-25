"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Heart,
  ShoppingCart,
  Bell,
  User,
  ChevronDown,
  Menu,
  X,
  BookOpen,
  Award,
  Settings,
  LogOut,
  Globe,
} from "lucide-react";
import Link from "next/link";
import NotificationDropdown from "./Notification";
import Button from "./Dashboard/Button";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // const [cartItems] = useState(3); // Mock cart items
  // const [notifications] = useState(2); // Mock notifications

  const pathname = typeof window !== "undefined" ? window.location.pathname : "";

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

  // Mock user data
  const user = {
    name: "Shaheer Mansoor",
    email: "shaheer.mansoor@example.com",
    avatar: "SM",
    initials: "SM",
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsUserDropdownOpen(false);
  };

  const navigationItems = [
    { icon: User, label: "My Profile", href: "/dashboard", authRequired: true },
    { icon: BookOpen, label: "My learning", href: "/learning", authRequired: true },
    { icon: Settings, label: "Account Settings", href: "/user/account-settings", authRequired: true },
  ];

  const dropdownLinks = [
    { icon: User, label: "My Profile", href: "/dashboard" },
    { icon: BookOpen, label: "My Learning", href: "/learning" },
    // { icon: Award, label: "My Certificates", href: "/dashboard" },
    { icon: Settings, label: "Account Settings", href: "/user/account-settings" },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <div className="flex items-center space-x-2 mr-4">
                <div className="w-8 h-8">
                  <img src="/favicon/favicon.svg" width={64} height={64} alt="farahgpt-logo" className="inline" />
                </div>
                <span className="text-2xl font-bold text-gray-900">FarahGPT</span>
              </div>
            </Link>
            <Link href="/explore-courses" className="flex items-center px-4 py-2 text-md text-gray-700 cursor-pointer">
              Explore
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          {/* <div className="hidden lg:flex items-center space-x-8">
            {navigationItems.map(
              (item) =>
                (!item.authRequired || isLoggedIn) && (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-gray-700 hover:text-secondary font-medium transition-colors"
                    whileHover={{ y: -1 }}
                  >
                    {item.label}
                  </Link>
                )
            )}
          </div> */}

          {/* Search Bar */}
          {isLoggedIn && pathname === "/dashboard" && (
            <div className="hidden md:block ml-4">
              <h2 className="text-lg font-medium text-gray-900">Welcome back, {user.name.split(" ")[0]}!</h2>
              <p className="text-sm text-gray-600">Here's what's happening with your courses today.</p>
            </div>
          )}
          {/* <div className="flex-1 max-w-2xl mx-8 hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Search for anything"
              />
            </div>
          </div> */}

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {/* Wishlist */}
                {/* <motion.button
                  className="p-2 text-gray-600 hover:text-secondary transition-colors relative"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart className="h-6 w-6" />
                </motion.button> */}

                {/* Cart */}
                {/* <motion.button
                  className="p-2 text-gray-600 hover:text-secondary transition-colors relative"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ShoppingCart className="h-6 w-6" />
                  {cartItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItems}
                    </span>
                  )}
                </motion.button> */}

                {/* Notifications */}
                <NotificationDropdown />

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
                          {isLoggedIn && (
                            <Link href="/instructor/course-upload">
                              <Button
                                className="bg-gradient-to-r ml-4 mb-2 from-(--primary-light) to-secondary text-white"
                                size="md"
                              >
                                Create Course
                              </Button>
                            </Link>
                          )}
                          {dropdownLinks.map((item) => (
                            <Link
                              key={item.label}
                              href={item.href}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <item.icon className="h-4 w-4 mr-3 text-gray-400" />
                              {item.label}
                            </Link>
                          ))}
                        </div>

                        <div className="border-t border-gray-100 py-2">
                          <motion.button
                            onClick={handleLogout}
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
            ) : (
              /* Login/Signup Buttons */
              <div className="hidden md:flex items-center space-x-2">
                <motion.button
                  onClick={handleLogin}
                  className="px-4 py-2 text-gray-700 font-medium hover:text-secondary transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Log in
                </motion.button>
                <motion.button
                  onClick={handleLogin}
                  className="px-4 py-2 bg-gray-900 text-white font-medium rounded hover:bg-gray-800 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign up
                </motion.button>
                {/* <motion.button
                  className="p-2 text-gray-600 hover:text-secondary transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Globe className="h-6 w-6" />
                </motion.button> */}
              </div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-secondary transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {/* <div className="md:hidden pb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Search for anything"
            />
          </div>
        </div> */}
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-4 space-y-4">
              {isLoggedIn && (
                <Link href="/instructor/course-upload">
                  <Button className="bg-gradient-to-r mb-4 from-(--primary-light) to-secondary text-white" size="md">
                    Create Course
                  </Button>
                </Link>
              )}
              {navigationItems.map(
                (item) =>
                  (!item.authRequired || isLoggedIn) && (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="block text-gray-700 hover:text-secondary font-medium transition-colors"
                    >
                      <item.icon className="inline-block mr-2 h-5 w-5 text-gray-400" />
                      {item.label}
                    </Link>
                  )
              )}
              {isLoggedIn && (
                <motion.button
                  onClick={handleLogout}
                  className="flex items-center w-full pt-2 border-t-blue-100 border-t-1 text-red-600 hover:bg-red-50 transition-colors"
                  whileHover={{ x: 0 }}
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign Out
                </motion.button>
              )}
              {!isLoggedIn && (
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <motion.button
                    onClick={handleLogin}
                    className="block w-full text-left px-4 py-2 text-gray-700 font-medium hover:text-secondary transition-colors"
                    whileHover={{ x: 4 }}
                  >
                    Log in
                  </motion.button>
                  <motion.button
                    onClick={handleLogin}
                    className="block w-full text-left px-4 py-2 bg-gray-900 text-white font-medium rounded hover:bg-gray-800 transition-colors"
                    whileHover={{ x: 4 }}
                  >
                    Sign up
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
