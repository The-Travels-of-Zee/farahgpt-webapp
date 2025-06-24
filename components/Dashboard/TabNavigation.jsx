"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { DetailedStats } from "./StatCard";
import Link from "next/link";
import Button from "./Button";
import { dummyCourses } from "./CourseCard";
import { AdminCourseCard } from "./CourseCard";

// Dynamic imports (with SSR disabled if needed)
// const AdminCourseCard = dynamic(() => import("./CourseCard").then((mod) => mod.AdminCourseCard), { ssr: false });
const EarningsChart = dynamic(() => import("./EarningsChart"), { ssr: false });
const StatCard = dynamic(() => import("./StatCard"), { ssr: false });
const StudentCard = dynamic(() => import("./StudentCard"), { ssr: false });

// Tab Navigation Component (inline to avoid circular import)
const TabNav = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "earnings", label: "Earnings", icon: "💰" },
    { id: "students", label: "Students", icon: "👥" },
    { id: "courses", label: "Courses", icon: "📚" },
    { id: "analytics", label: "Analytics", icon: "📊" },
  ];

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-4 lg:space-x-8" aria-label="Tabs">
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

  const renderTabContent = () => {
    switch (activeTab) {
      case "earnings":
        return <EarningsChart />;
      case "students":
        return <StudentCard />;
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

  return (
    <div className="bg-gray-50 min-h-screen">
      <TabNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default DashboardTabs;
