"use client";

import { motion, AnimatePresence } from "@/lib/motion";
import {
  BellDotIcon,
  CircleArrowLeft,
  Crown,
  DollarSign,
  Lock,
  Trash,
  TrendingUp,
  User,
  Wallet,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const sidebarLinks = [
  {
    id: "profile-settings",
    label: "Profile Settings",
    icon: User,
  },
  {
    id: "account-security",
    label: "Account Security",
    icon: Lock,
  },
  {
    id: "payment-settings",
    label: "Payment Settings",
    icon: DollarSign,
  },
  {
    id: "payment-receive",
    label: "Payment Receiving",
    icon: TrendingUp,
  },
  {
    id: "withdraw-funds",
    label: "Withdraw Funds",
    icon: Wallet,
  },
  {
    id: "notification-settings",
    label: "Notification Settings",
    icon: BellDotIcon,
  },
  {
    id: "close-account",
    label: "Close Account",
    icon: Trash,
  },
];

const SettingsSidebar = ({ isOpen, onToggle, activeSection, onSectionChange }) => {
  const [formData, setFormData] = useState({
    firstName: "Shaheer",
    lastName: "Mansoor",
    profileImage: null,
  });
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
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
        className={`fixed lg:static top-0 left-0 h-full w-[min(320px,85vw)] sm:w-80 bg-white border-r border-teal-200 flex flex-col z-50 lg:z-0 lg:!transform-none ${
          isOpen ? "shadow-xl lg:shadow-none" : ""
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-teal-200 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Link
              href="/learning"
              className="w-8 h-8 bg-teal-50 rounded-full flex items-center justify-center hover:bg-teal-100 transition-colors"
              aria-label="Back to learning"
            >
              <CircleArrowLeft className="w-5 h-5 text-teal-700" />
            </Link>

            <div className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-sm">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </span>
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
                {formData.profileImage ? (
                  <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-white" />
                )}
              </div>
            </div>
            <div className="flex items-center text-sm sm:text-base font-medium text-teal-800">Shaheer Mansoor</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4 flex-1 overflow-y-auto">
          <ul className="px-4 space-y-1.5">
            {sidebarLinks.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
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
      </motion.div>
    </>
  );
};

export default SettingsSidebar;
