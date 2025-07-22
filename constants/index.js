// This file contains various constants used throughout the application, including course categories, status options, sort options, dummy notifications, footer sections, and privacy policy content.

// EXPLORE COURSES PAGE
export const statusOptions = [
  { value: "all", label: "All Courses" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "pending", label: "Pending Review" },
  { value: "archived", label: "Archived" },
];

export const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "popular", label: "Most Popular" },
  // { value: "rating", label: "Highest Rated" },
  // { value: "price-low", label: "Price: Low to High" },
  // { value: "price-high", label: "Price: High to Low" },
  { value: "alphabetical", label: "A-Z" },
];

// INSTRUCTOR DASHBOARD PAGE
import {
  Users,
  // DollarSign,
  // BookOpen,
  // TrendingUp,
  Star,
  Clock,
  Award,
  Target,
  BarChart3,
  CreditCard,
  UserCheck,
  Calendar,
} from "lucide-react";

export const customStats = [
  {
    id: 1,
    title: "Total Students",
    value: "2,847",
    change: "+12.5% from last month",
    icon: Users,
    color: "blue",
  },
  {
    id: 2,
    title: "Monthly Revenue",
    value: "$24,680",
    change: "+8.2% from last month",
    icon: DollarSign,
    color: "green",
  },
  {
    id: 3,
    title: "Active Courses",
    value: "43",
    change: "+3 new courses",
    icon: BookOpen,
    color: "purple",
  },
  {
    id: 4,
    title: "Monthly Signups",
    value: "456",
    change: "+23.8% increase",
    icon: UserCheck,
    color: "green",
  },
];
// Dummy data for testing
export const dummyStats = [
  {
    id: 1,
    title: "Total Students",
    value: "2,847",
    change: "+12.5% from last month",
    icon: Users,
    color: "blue",
  },
  {
    id: 2,
    title: "Monthly Revenue",
    value: "$24,680",
    change: "+8.2% from last month",
    icon: DollarSign,
    color: "green",
  },
  {
    id: 3,
    title: "Active Courses",
    value: "43",
    change: "+3 new courses",
    icon: BookOpen,
    color: "purple",
  },
  {
    id: 4,
    title: "Course Completion Rate",
    value: "78.3%",
    change: "+2.1% improvement",
    icon: TrendingUp,
    color: "orange",
  },
  {
    id: 5,
    title: "Average Rating",
    value: "4.7",
    change: "+0.2 from last month",
    icon: Star,
    color: "yellow",
  },
  {
    id: 6,
    title: "Study Hours",
    value: "15,240",
    change: "+18.7% increase",
    icon: Clock,
    color: "indigo",
  },
  {
    id: 7,
    title: "Certificates Issued",
    value: "1,923",
    change: "+15.3% this month",
    icon: Award,
    color: "pink",
  },
  {
    id: 8,
    title: "Conversion Rate",
    value: "12.4%",
    change: "-1.2% from last month",
    icon: Target,
    color: "red",
  },
  {
    id: 9,
    title: "Monthly Signups",
    value: "456",
    change: "+23.8% increase",
    icon: UserCheck,
    color: "green",
  },
  {
    id: 10,
    title: "Refund Rate",
    value: "3.2%",
    change: "-0.8% improvement",
    icon: CreditCard,
    color: "red",
  },
  {
    id: 11,
    title: "Engagement Score",
    value: "85.6%",
    change: "+4.3% improvement",
    icon: BarChart3,
    color: "blue",
  },
  {
    id: 12,
    title: "Upcoming Events",
    value: "12",
    change: "Next: Tomorrow",
    icon: Calendar,
    color: "purple",
  },
];

// SETTINGS PAGE
import { BellDotIcon, DollarSign, Lock, Trash, TrendingUp, User, Wallet } from "lucide-react";

export const sidebarLinks = [
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

// DUMMY NOTIFICATIONS
export const dummyNotifications = [
  {
    id: 1,
    type: "success",
    title: "Order Completed",
    message: "Your order #12345 has been successfully processed",
    time: "2 min ago",
    unread: true,
  },
  {
    id: 2,
    type: "warning",
    title: "Payment Reminder",
    message: "Your subscription will expire in 3 days",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 3,
    type: "info",
    title: "New Feature",
    message: "Check out our latest dashboard updates",
    time: "2 hours ago",
    unread: false,
  },
  {
    id: 4,
    type: "alert",
    title: "Security Alert",
    message: "New login detected from unknown device",
    time: "1 day ago",
    unread: true,
  },
  {
    id: 5,
    type: "info",
    title: "Welcome!",
    message: "Thanks for joining our platform",
    time: "2 days ago",
    unread: false,
  },
  {
    id: 101,
    type: "success",
    title: "Profile Updated",
    message: "Your profile information has been successfully updated",
    time: "3 days ago",
    unread: false,
    archivedAt: "3 days ago",
  },
  {
    id: 102,
    type: "info",
    title: "System Maintenance",
    message: "Scheduled maintenance completed successfully",
    time: "1 week ago",
    unread: false,
    archivedAt: "5 days ago",
  },
  {
    id: 103,
    type: "warning",
    title: "Password Changed",
    message: "Your password was changed successfully",
    time: "2 weeks ago",
    unread: false,
    archivedAt: "1 week ago",
  },
  {
    id: 104,
    type: "alert",
    title: "Login Attempt",
    message: "Failed login attempt from unknown location",
    time: "3 weeks ago",
    unread: false,
    archivedAt: "2 weeks ago",
  },
];

// FOOTER SECTIONS
import { BookOpen, HelpCircle, Facebook, Twitter, Instagram, Youtube, Linkedin } from "lucide-react";

export const footerSections = [
  // {
  //   title: "Islamic Learning",
  //   icon: BookOpen,
  //   links: [
  //     { name: "Quran Studies", href: "https://www.quran.com" },
  //     { name: "Hadith Collection", href: "https://www.sunnah.com" },
  //     { name: "Islamic Jurisprudence", href: "/fiqh" },
  //     { name: "Arabic Language", href: "/arabic" },
  //     { name: "Islamic History", href: "/history" },
  //     { name: "Tafsir & Commentary", href: "/tafsir" },
  //   ],
  // },
  // {
  //   title: "AI Services",
  //   icon: Bot,
  //   links: [
  //     { name: "AI Guidance", href: "/guidance" },
  //     { name: "Prayer Times", href: "/prayer" },
  //     { name: "Qibla Direction", href: "/qibla" },
  //     { name: "Islamic Q&A", href: "/qa" },
  //     { name: "Dua Recommendations", href: "/duas" },
  //     { name: "Lifestyle Guidance", href: "/lifestyle" },
  //   ],
  // },
  // {
  //   title: "Community",
  //   icon: Users,
  //   links: [
  //     { name: "Discussion Forums", href: "/forums" },
  //     { name: "Study Groups", href: "/groups" },
  //     { name: "Scholar Connect", href: "/scholars" },
  //     { name: "Events & Webinars", href: "/events" },
  //     { name: "Community Guidelines", href: "/guidelines" },
  //     { name: "Volunteer", href: "/volunteer" },
  //   ],
  // },
  {
    title: "Support",
    icon: HelpCircle,
    links: [
      // { name: "Help Center", href: "/help" },
      { name: "Contact Us", href: "/contact" },
      { name: "Technical Support", href: "/contact" },
      { name: "Feature Requests", href: "/contact" },
      { name: "Bug Reports", href: "/contact" },
      // { name: "Documentation", href: "/docs" },
    ],
  },
];
import { PiTiktokLogo } from "react-icons/pi";
export const socialLinks = [
  { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/company/farahgpt/" },
  { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/share/1EejMRmzs4/?mibextid=wwXIfr" },
  {
    name: "Instagram",
    icon: Instagram,
    href: "https://www.instagram.com/farahgpt?igsh=cjkyMnZhZnIyM2tz&utm_source=qr",
  },
  { name: "TikTok", icon: PiTiktokLogo, href: "https://www.tiktok.com/@farahgpt?_t=ZS-8yDjWFcjHXw&_r=1" },
];

export const bottomLinks = [
  { name: "Privacy Policy", href: "/privacy-policy" },
  // { name: "Terms of Service", href: "/terms" },
  // { name: "Cookie Policy", href: "/cookies" },
  // { name: "Accessibility", href: "/accessibility" },
];

// PRIVACY POLICY PAGE
export const privacyPolicy = {
  content: `# Privacy Policy

**Last Updated:** 21/5/2025

## Introduction

Welcome to FarahGPT. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share your personal information when you use our App.

## Information We Collect

### 1. Information You Provide
- **Account Information:** When you sign up for our App, We may collect identifiers such as your name, email address, and any other information you provide when creating an account.
- **User Content:** We may collect any content you upload, post, or otherwise transmit through the App, including messages, photos, and other media.

### 2. Information We Collect Automatically
- **Usage Data:** We collect information about your interactions with the App, such as the features you use and the time spent on the App.
- **Device Information:** We collect information about the device you use to access the App, including IP address, device type, and operating system.

### 3. Information from Third Parties
- **Third-Party Services:** If you connect to the App through a third-party service (e.g., social media), we may collect information from that service as permitted by their privacy policies.

## Legal Basis

We process your personal information based on your consent, to fulfill our contractual obligations, and where we have a legitimate interest.

## Children’s Privacy

Our App is not intended for use by children under the age of 13 (or 16 in the EU). We do not knowingly collect personal information from children.

## How We Use Your Information

We may use the information we collect for the following purposes:
- **To Provide and Maintain Our Service:** We use your information to operate and improve the App.
- **To Communicate with You:** We may use your contact information to send you updates, notifications, and other communications related to the App.
- **To Personalize Your Experience:** We may use your information to personalize your experience with the App and to offer you content tailored to your interests.
- **For Analytics and Research:** We use the information to analyze how our users interact with the App and to improve our services.

## Sharing Your Information

We do not share your personal information with third parties except in the following circumstances:
- **With Your Consent:** We may share your information with third parties if you give us explicit consent to do so.
- **Service Providers:** We may share your information with third-party service providers who perform services on our behalf.
- **Legal Requirements:** We may disclose your information if required by law, or if we believe that such action is necessary to comply with legal obligations, protect our rights, or prevent fraud.

## Your Rights and Choices

- **Access and Correction:** You have the right to access and correct the personal information we hold about you.
- **Data Deletion:** You may request that we delete your personal information by contacting us at [Your Contact Information].
- **Opt-Out:** You may opt out of receiving promotional communications from us by following the instructions in those communications.

## Security

We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure. However, no security system is completely secure, and we cannot guarantee the absolute security of your information.

We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.

## Changes to This Privacy Policy

We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Effective Date" above. Your continued use of the App after such changes signifies your acceptance of the revised Privacy Policy.

## Contact Us

If you have any questions or concerns about this Privacy Policy, please contact us at:

FarahGPT

📧 [info@thetravelsofzee.com](mailto:info@thetravelsofzee.com)  
🕌 With sincerity and responsibility,  
**Team Farah**

`,
};
