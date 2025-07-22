"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { DetailedStats } from "@/components/Dashboard/StatCard";
import Link from "next/link";
import Button from "@/components/ui/Button";
// import { AllCourses } from "@/components/Dashboard/CourseCard";
import { AdminCourseCard } from "@/components/Dashboard/CourseCard";
import CouponGenerator from "@/components/Dashboard/CouponGenerator";
import InstructorManagement from "./InstructorManagement";
import fetchCourses from "@/lib/actions/courseActions";
import CourseLoadingState from "../ui/CourseLoadingState";
import CourseErrorState from "../ui/CourseErrorState";
import CoursesEmptyState from "../ui/CoursesEmptyState";

// Dynamic imports for better performance
const EarningsChart = dynamic(() => import("@/components/Dashboard/EarningsChart"), { ssr: false });
const WithdrawalsManagement = dynamic(() => import("@/components/Admin/WithdrawalsManagement"), { ssr: false });
const StatCard = dynamic(() => import("@/components/Dashboard/StatCard"), { ssr: false });
const StudentCard = dynamic(() => import("@/components/Dashboard/StudentCard"), { ssr: false });
// const UserManagement = dynamic(() => import("@/components/Dashboard/UserManagement"), { ssr: false });
// const ContentModeration = dynamic(() => import("./ContentModeration"), { ssr: false });
// const SystemSettings = dynamic(() => import("./SystemSettings"), { ssr: false });
// const ReportsAnalytics = dynamic(() => import("./ReportsAnalytics"), { ssr: false });
// const PaymentManagement = dynamic(() => import("./PaymentManagement"), { ssr: false });
// const NotificationCenter = dynamic(() => import("./NotificationCenter"), { ssr: false });

// --- Tab Navigation Component ---
const TabNav = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "📊", category: "overview" },
    { id: "earnings", label: "Earnings", icon: "💰", category: "financial" },
    { id: "withdrawals", label: "Withdrawals", icon: "💳", category: "financial" },
    { id: "payments", label: "Payments", icon: "💳", category: "financial" },
    { id: "coupongenerator", label: "Coupons", icon: "💲", category: "financial" },
    { id: "instructors", label: "Instructors", icon: "👨‍🏫", category: "management" },
    { id: "students", label: "Students", icon: "🎓", category: "management" },
    { id: "courses", label: "Courses", icon: "📚", category: "content" },
    // { id: "users", label: "Users", icon: "👥", category: "management" },
    // { id: "moderation", label: "Content Moderation", icon: "🛡️", category: "content" },
    // { id: "notifications", label: "Notifications", icon: "🔔", category: "communication" },
    // { id: "reports", label: "Reports", icon: "📈", category: "analytics" },
    // { id: "settings", label: "System Settings", icon: "⚙️", category: "system" },
  ];

  // Group tabs by category for better organization
  const tabCategories = {
    overview: "Overview",
    financial: "Financial",
    management: "User Management",
    content: "Content Management",
    communication: "Communication",
    analytics: "Analytics & Reports",
    system: "System",
  };

  const groupedTabs = tabs.reduce((acc, tab) => {
    if (!acc[tab.category]) acc[tab.category] = [];
    acc[tab.category].push(tab);
    return acc;
  }, {});

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile dropdown for tabs */}
        <div className="sm:hidden">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            {Object.entries(groupedTabs).map(([category, categoryTabs]) => (
              <optgroup key={category} label={tabCategories[category]}>
                {categoryTabs.map((tab) => (
                  <option key={tab.id} value={tab.id}>
                    {tab.icon} {tab.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Desktop tabs */}
        <nav className="hidden sm:flex space-x-2 lg:space-x-4 overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50"
              } whitespace-nowrap py-3 px-3 border-b-2 font-medium text-xs lg:text-sm flex items-center space-x-1 lg:space-x-2 transition-all duration-200 rounded-t-md`}
            >
              <span className="text-sm lg:text-base">{tab.icon}</span>
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

// Placeholder components for demonstration
const PlaceholderComponent = ({ title, description, features = [] }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="text-center py-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      {features.length > 0 && (
        <div className="text-left max-w-md mx-auto">
          <h4 className="font-medium text-gray-900 mb-2">Planned Features:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </div>
);

const AdminDashboardTabs = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isClient, setIsClient] = useState(false);

  // Fetch courses from courseActions
  // Add state for courses data
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [coursesError, setCoursesError] = useState(null);

  // Fetch courses function with proper error handling
  const loadCourses = async () => {
    try {
      setCoursesLoading(true);
      setCoursesError(null);

      const result = await fetchCourses();

      if (result && result.success) {
        setCourses(result.data || []);
      } else {
        // Handle case where result exists but success is false
        const errorMessage = result?.message || result?.error || "Failed to fetch courses";
        setCoursesError(errorMessage);
        setCourses([]);
      }
    } catch (error) {
      console.error("Error loading courses:", error);
      setCoursesError(error.message || "An unexpected error occurred while loading courses");
      setCourses([]);
    } finally {
      setCoursesLoading(false);
    }
  };

  // Load courses when component mounts or when courses tab is accessed
  useEffect(() => {
    if (isClient && activeTab === "courses") {
      loadCourses();
    }
  }, [isClient, activeTab]);

  // Initialize tab from URL or localStorage on client side
  useEffect(() => {
    setIsClient(true);

    // Check URL first for tab parameter
    const urlParams = new URLSearchParams(window.location.search);
    const tabFromUrl = urlParams.get("tab");

    // Check localStorage for previously selected tab
    const savedTab = localStorage.getItem("admin-dashboard-active-tab");

    // Priority: URL > localStorage > default
    const initialTab = tabFromUrl || savedTab || "dashboard";

    // Validate that the tab exists
    const validTabs = [
      "dashboard",
      "withdrawals",
      "earnings",
      "payments",
      "coupongenerator",
      "users",
      "instructors",
      "students",
      "courses",
      "moderation",
      "notifications",
      "reports",
      "settings",
    ];

    if (validTabs.includes(initialTab)) {
      setActiveTab(initialTab);
    }
  }, []);

  // Save to localStorage and update URL when tab changes
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);

    // Save to localStorage
    localStorage.setItem("admin-dashboard-active-tab", tabId);

    // Update URL without page refresh
    const url = new URL(window.location);
    url.searchParams.set("tab", tabId);
    window.history.replaceState({}, "", url);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <StatCard />
            <DetailedStats />
          </div>
        );

      case "earnings":
        return <EarningsChart />;

      case "withdrawals":
        return <WithdrawalsManagement />;

      case "payments":
        return (
          <PlaceholderComponent
            title="Payment Management"
            description="Manage all payment transactions, refunds, and payment methods"
            features={[
              "Transaction history and details",
              "Refund processing and tracking",
              "Payment method management",
              "Dispute resolution tools",
              "Revenue reconciliation",
              "Payment gateway configuration",
            ]}
          />
        );

      case "coupongenerator":
        return <CouponGenerator />;

      case "users":
        return (
          <PlaceholderComponent
            title="User Management"
            description="Comprehensive user account management and administration"
            features={[
              "User search and filtering",
              "Account status management (active/suspended/banned)",
              "User role assignment and permissions",
              "Account verification and KYC",
              "User activity logs and audit trails",
              "Bulk user operations",
              "User communication tools",
            ]}
          />
        );

      case "instructors":
        return <InstructorManagement />;

      case "students":
        return <StudentCard />;

      case "courses":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-900">Course Management</h2>
              <Link href="/instructor/course-upload">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white" size="lg">
                  Create Course
                </Button>
              </Link>
            </div>

            {coursesLoading ? (
              <CourseLoadingState />
            ) : coursesError ? (
              <CourseErrorState error={coursesError} onRetry={loadCourses} />
            ) : courses.length === 0 ? (
              <CoursesEmptyState />
            ) : (
              <div className="grid gap-4">
                {courses.map((course) => (
                  <AdminCourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </div>
        );

      case "moderation":
        return (
          <PlaceholderComponent
            title="Content Moderation"
            description="Review and moderate user-generated content across the platform"
            features={[
              "Pending content review queue",
              "Automated content flagging system",
              "Manual content approval/rejection",
              "Community guidelines enforcement",
              "User report management",
              "Content categorization and tagging",
              "Moderation activity logs",
            ]}
          />
        );

      case "notifications":
        return (
          <PlaceholderComponent
            title="Notification Center"
            description="Manage system-wide notifications and communication campaigns"
            features={[
              "Broadcast notifications to all users",
              "Targeted notifications by user segments",
              "Email campaign management",
              "Push notification scheduling",
              "Notification templates library",
              "Delivery tracking and analytics",
              "Emergency alert system",
            ]}
          />
        );

      case "reports":
        return (
          <PlaceholderComponent
            title="Reports & Analytics"
            description="Comprehensive reporting and business intelligence dashboard"
            features={[
              "Custom report builder",
              "Financial performance reports",
              "User engagement analytics",
              "Course performance metrics",
              "Revenue trend analysis",
              "Export capabilities (PDF, Excel, CSV)",
              "Scheduled report delivery",
              "Real-time data visualization",
            ]}
          />
        );

      case "settings":
        return (
          <PlaceholderComponent
            title="System Settings"
            description="Configure platform-wide settings and system parameters"
            features={[
              "Platform configuration management",
              "Security settings and policies",
              "Integration management (APIs, webhooks)",
              "Backup and restore options",
              "System maintenance tools",
              "Feature flags and toggles",
              "Performance monitoring",
              "Compliance and regulatory settings",
            ]}
          />
        );

      default:
        return (
          <div className="text-center py-8 text-gray-500">
            <p>Select a tab to view content</p>
          </div>
        );
    }
  };

  // Prevent hydration mismatch by not rendering until client-side
  if (!isClient) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-4 lg:space-x-8" aria-label="Tabs">
              <div className="whitespace-nowrap py-4 border-b-2 border-blue-500 font-medium text-sm flex items-center space-x-2">
                <span>📊</span>
                <span>Dashboard</span>
              </div>
            </nav>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <TabNav activeTab={activeTab} setActiveTab={handleTabChange} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="min-h-[600px]">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default AdminDashboardTabs;
