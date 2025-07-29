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
  Star,
  Lock,
  Crown,
} from "lucide-react";
import Link from "next/link";
import NotificationDropdown from "./Notification";
import Button from "./ui/Button";
import { useRouter, usePathname } from "next/navigation";
import useUserStore from "@/store/userStore";
import useUser from "@/hooks/useUser";

const Navbar = () => {
  const pageURL = usePathname();
  const { user, isLoggedIn, role, isPremium, logout } = useUser();
  // console.log("Store Role:", role);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const router = useRouter();

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

  const handleLogout = () => {
    logout();
    setIsUserDropdownOpen(false);
    router.push("/login");
  };

  // Route guarding function
  const handleProtectedRoute = (href, authRequired, premiumRequired = false) => {
    if (authRequired && !isLoggedIn) {
      // Redirect to login if not authenticated
      router.push(`/login?redirect=${encodeURIComponent(href)}`);
      return;
    }

    if (premiumRequired && !isPremium) {
      // Redirect to upgrade page if premium required but user is not premium
      router.push(`/plans?redirect=${encodeURIComponent(href)}`);
      return;
    }

    // If all checks pass, navigate to the route
    router.push(href);
  };

  // Protected Link component
  const ProtectedLink = ({ href, authRequired, premiumRequired = false, children, className = "", onClick = null }) => {
    const canAccess = (!authRequired || isLoggedIn) && (!premiumRequired || isPremium);

    if (canAccess) {
      return (
        <Link href={href} className={className} onClick={onClick}>
          {children}
        </Link>
      );
    }

    return (
      <button
        onClick={() => handleProtectedRoute(href, authRequired, premiumRequired)}
        className={`${className} cursor-pointer`}
      >
        {children}
      </button>
    );
  };

  // Role-based navigation configuration
  const roleBasedLinks = {
    both: [
      { icon: User, label: "My Dashboard", href: "/instructor/dashboard", authRequired: true },
      { icon: BookOpen, label: "My Learning", href: "/learning", authRequired: true, premiumRequired: true },
      { icon: Star, label: "Saved Messages", href: "/saved-messages", authRequired: true },
      { icon: Settings, label: "Account Settings", href: "/user/account-settings", authRequired: true },
    ],
    instructor: [
      { icon: User, label: "My Dashboard", href: "/instructor/dashboard", authRequired: true },
      { icon: Settings, label: "Account Settings", href: "/user/account-settings", authRequired: true },
    ],
    user: [
      { icon: BookOpen, label: "My Learning", href: "/learning", authRequired: true, premiumRequired: true },
      { icon: Star, label: "Saved Messages", href: "/saved-messages", authRequired: true },
      { icon: Settings, label: "Account Settings", href: "/user/account-settings", authRequired: true },
    ],
  };

  // Render navigation item with appropriate styling and icons
  const renderNavItem = (item, isMobile = false) => {
    const { icon: Icon, label, href, authRequired, premiumRequired } = item;
    const canAccess = (!authRequired || isLoggedIn) && (!premiumRequired || isPremium);

    const baseClassName = isMobile
      ? "flex items-center w-full text-gray-700 hover:text-secondary font-medium transition-colors"
      : "flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors";

    const disabledClassName = isMobile
      ? "flex items-center min-w-max text-gray-400 font-medium cursor-pointer"
      : "flex items-center px-4 py-2 text-sm text-gray-400 cursor-pointer";

    return (
      <ProtectedLink
        key={label}
        onClick={() => setIsMobileMenuOpen(false)}
        href={href}
        authRequired={authRequired}
        premiumRequired={premiumRequired}
        className={canAccess ? baseClassName : disabledClassName}
      >
        <Icon className={`h-4 w-4 mr-3 ${canAccess ? "text-gray-400" : "text-gray-300"}`} />
        <span className="flex-1">{label}</span>
        {!canAccess && (
          <div className="flex items-center ml-2">
            {authRequired && !isLoggedIn && <Lock className="h-3 w-3 text-gray-400" />}
            {premiumRequired && !isPremium && <Crown className="h-3 w-3 text-amber-500" />}
          </div>
        )}
      </ProtectedLink>
    );
  };

  const currentLinks = roleBasedLinks[role] || [];

  return (
    <nav
      className={`bg-white shadow-sm border-b border-gray-200 ${
        pageURL.includes("/learning/") ? "fixed" : "sticky"
      } w-full top-0 z-50`}
    >
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
            <Link href="/explore-courses" className="flex items-center px-4 py-2 text-md text-gray-700 ">
              Explore
            </Link>
          </motion.div>

          {/* Welcome Message */}
          {isLoggedIn && pathname === "/instructor/dashboard" && (
            <div className="hidden md:block ml-4">
              <h2 className="text-lg font-medium text-gray-900">
                Welcome back, {user?.name.split(" ")[0]}!
                {isPremium && <Crown className="inline h-4 w-4 ml-1 text-amber-500" />}
              </h2>
              <p className="text-sm text-gray-600">Here's what's happening with your courses today.</p>
            </div>
          )}

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {/* Notifications */}
                <NotificationDropdown />

                {/* User Profile Dropdown */}
                <div className="relative hidden lg:block" ref={dropdownRef}>
                  <motion.button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center relative">
                      {user?.photo_url ? (
                        <img src={user?.photo_url} className="w-8 h-8 rounded-full" alt="user-profile-image" />
                      ) : (
                        <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">{user?.initials}</span>
                        </div>
                      )}
                      {isPremium && (
                        <Crown className="absolute -top-1 -right-1 h-3 w-3 text-amber-500 bg-white rounded-full" />
                      )}
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
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                              <p className="text-sm text-gray-500">{user?.email}</p>
                            </div>
                          </div>
                          {isPremium && (
                            <div className="flex items-center space-x-1 mt-1">
                              <span className="max-w-min bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-sm">
                                <Crown className="w-4 h-4 mr-1" />
                                Premium
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="py-2">
                          {(role === "instructor" || role === "both") && (
                            <ProtectedLink
                              href="/instructor/course-upload"
                              authRequired={true}
                              className="block px-4 py-2"
                            >
                              <Button className="bg-gradient-to-r from-(--primary-light) to-secondary text-white w-full">
                                Create Course
                              </Button>
                            </ProtectedLink>
                          )}
                          {currentLinks.map((item) => renderNavItem(item, false))}

                          {(role === "user" || role === "both") && !isPremium && (
                            <div className="pt-2">
                              <button
                                onClick={() => router.push("/plans")}
                                className="flex ml-3 min-w-max items-center px-3 py-2 text-sm bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-md hover:from-amber-600 hover:to-orange-600 transition-colors"
                              >
                                <Crown className="h-4 w-4 mr-2" />
                                Upgrade to Premium
                              </button>
                            </div>
                          )}
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
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => router.push("/login")}
                  className="hover:text-secondary transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Log in
                </Button>
                <Button
                  variant="gradientGreen"
                  size="md"
                  onClick={() => router.push("/signup-user")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign up
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden flex items-center gap-2 p-2 text-gray-600 hover:text-secondary transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center relative">
                {user?.photo_url ? (
                  <img src={user?.photo_url} className="w-8 h-8 rounded-full" alt="user-profile-image" />
                ) : (
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">{user?.initials}</span>
                  </div>
                )}
                {isPremium && (
                  <Crown className="absolute -top-1 -right-1 h-3 w-3 text-amber-500 bg-white rounded-full" />
                )}
              </div>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>
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
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-md font-medium text-gray-900">{user?.name}</p>
                  <p className="text-md text-gray-500">{user?.email}</p>
                </div>
              </div>
              {isPremium && (
                <div className="flex items-center space-x-1 mt-1">
                  <span className="max-w-min bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-sm">
                    <Crown className="w-4 h-4 mr-1" />
                    Premium
                  </span>
                </div>
              )}
            </div>
            <div className="px-4 py-4 space-y-4">
              {isLoggedIn && (
                <>
                  {(role === "instructor" || role === "both") && (
                    <ProtectedLink href="/instructor/course-upload" authRequired={true} className="block mb-3">
                      <Button className="bg-gradient-to-r from-(--primary-light) to-secondary text-white mix-w-max">
                        Create Course
                      </Button>
                    </ProtectedLink>
                  )}
                  {currentLinks.map((item) => renderNavItem(item, true))}
                  {(role === "user" || role === "both") && !isPremium && (
                    <div className="pt-2">
                      <button
                        onClick={() => router.push("/plans")}
                        className="flex min-w-max items-center px-3 py-2 text-sm bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-md hover:from-amber-600 hover:to-orange-600 transition-colors"
                      >
                        <Crown className="h-4 w-4 mr-2" />
                        Upgrade to Premium
                      </button>
                    </div>
                  )}
                  <motion.button
                    onClick={handleLogout}
                    className="flex items-center w-full pt-2 border-t border-gray-100 text-red-600 hover:bg-red-50 transition-colors"
                    whileHover={{ x: 0 }}
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign Out
                  </motion.button>
                </>
              )}

              {!isLoggedIn && (
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <motion.button
                    onClick={() => router.push("/login")}
                    className="block w-full text-left px-4 py-2 text-gray-700 font-medium hover:text-secondary transition-colors"
                    whileHover={{ x: 4 }}
                  >
                    Log in
                  </motion.button>
                  <motion.button
                    onClick={() => router.push("/signup-user")}
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
