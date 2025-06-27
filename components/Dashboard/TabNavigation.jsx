"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { DetailedStats } from "./StatCard";
import Link from "next/link";
import Button from "/components/ui/Button";
import { dummyCourses } from "./CourseCard";
import { AdminCourseCard } from "./CourseCard";
import CouponGenerator from "./CouponGenerator";
import InstructorManagement from "../Admin/InstructorManagement";

const EarningsChart = dynamic(() => import("./EarningsChart"), { ssr: false });
const StatCard = dynamic(() => import("./StatCard"), { ssr: false });
const StudentCard = dynamic(() => import("./StudentCard"), { ssr: false });

// --- Tab Navigation Component ---
const TabNav = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "earnings", label: "Earnings", icon: "💰" },
    { id: "coupongenerator", label: "Coupons", icon: "💲" },
    { id: "students", label: "Students", icon: "👥" },
    { id: "instructors", label: "Instructors", icon: "👥" },
    { id: "courses", label: "Courses", icon: "📚" },
    { id: "analytics", label: "Analytics", icon: "📊" },
  ];

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-4 lg:space-x-8 flex-wrap" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-200`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

const DashboardTabs = () => {
  const [activeTab, setActiveTab] = useState("earnings");
  const [isClient, setIsClient] = useState(false);

  // Initialize tab from URL or localStorage on client side
  useEffect(() => {
    setIsClient(true);

    // Check URL first for tab parameter
    const urlParams = new URLSearchParams(window.location.search);
    const tabFromUrl = urlParams.get("tab");

    // Check localStorage for previously selected tab
    const savedTab = localStorage.getItem("dashboard-active-tab");

    // Priority: URL > localStorage > default
    const initialTab = tabFromUrl || savedTab || "earnings";

    // Validate that the tab exists
    const validTabs = ["earnings", "coupongenerator", "students", "instructors", "courses", "analytics"];
    if (validTabs.includes(initialTab)) {
      setActiveTab(initialTab);
    }
  }, []);

  // Save to localStorage and update URL when tab changes
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);

    // Save to localStorage
    localStorage.setItem("dashboard-active-tab", tabId);

    // Update URL without page refresh
    const url = new URL(window.location);
    url.searchParams.set("tab", tabId);
    window.history.replaceState({}, "", url);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "earnings":
        return <EarningsChart />;
      case "coupongenerator":
        return <CouponGenerator />;
      case "students":
        return <StudentCard />;
      case "instructors":
        return <InstructorManagement />;
      case "courses":
        return (
          <>
            <Link href="/instructor/course-upload">
              <Button className="bg-gradient-to-r mb-4 from-(--primary-light) to-secondary text-white" size="md">
                Create Course
              </Button>
            </Link>
            {dummyCourses.map((course) => (
              <div key={course.id} className="mb-4">
                <AdminCourseCard course={course} />
              </div>
            ))}
          </>
        );
      case "analytics":
        return (
          <div className="space-y-6">
            <StatCard />
            {/* <StatsGrid /> */}
            {/* <QuickStats /> */}
            <DetailedStats />
            {/* <RevenueStats /> */}
            {/* <StudentStats /> */}
          </div>
        );
      default:
        return <div className="text-center py-8 text-gray-500">Select a tab to view content</div>;
    }
  };

  // Prevent hydration mismatch by not rendering until client-side
  if (!isClient) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-4 lg:space-x-8 flex-wrap" aria-label="Tabs">
              <div className="whitespace-nowrap py-4 border-b-2 border-blue-500 font-medium text-sm flex items-center space-x-2">
                <span>💰</span>
                <span>Earnings</span>
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
        <div
        // className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
        >
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default DashboardTabs;
