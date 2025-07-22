"use client";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { DetailedStats } from "./StatCard";
import Link from "next/link";
import Button from "/components/ui/Button";
import { AdminCourseCard, CourseFilters, CourseResults } from "./CourseCard";
import CouponGenerator from "./CouponGenerator";
import { ChevronDown, List, Search, Star, Users } from "lucide-react";
import fetchCourses from "@/lib/actions/courseActions";

const EarningsChart = dynamic(() => import("./EarningsChart"), { ssr: false });
const StatCard = dynamic(() => import("./StatCard"), { ssr: false });
const StudentCard = dynamic(() => import("./StudentCard"), { ssr: false });

// --- Tab Navigation Component ---
const TabNav = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "earnings", label: "Earnings", icon: "💰" },
    { id: "coupongenerator", label: "Coupons", icon: "💲" },
    { id: "students", label: "Students", icon: "👥" },
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

const TotalCourseStats = () => {
  // State for courses data
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter and sort states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [view, setView] = useState("list");

  // Fetch courses on component mount
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        const result = await fetchCourses();
        if (result.success) {
          setCourses(result.data || []);
        }
      } catch (error) {
        console.error("Error loading courses:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  // Filter and sort courses using the same logic as the enhanced component
  const filteredAndSortedCourses = useMemo(() => {
    return courses
      .filter((course) => {
        // Search filter
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          const matchesSearch =
            course.title?.toLowerCase().includes(searchLower) ||
            course.description?.toLowerCase().includes(searchLower) ||
            course.seller_name?.toLowerCase().includes(searchLower);
          if (!matchesSearch) return false;
        }

        // Status filter
        if (statusFilter !== "all") {
          const courseStatus = course.status?.toLowerCase() || "draft";
          if (courseStatus !== statusFilter) return false;
        }

        return true;
      })
      .sort((a, b) => {
        let aValue, bValue;

        switch (sortBy) {
          case "title":
            aValue = a.title?.toLowerCase() || "";
            bValue = b.title?.toLowerCase() || "";
            break;
          case "created_at":
            aValue = new Date(a.created_at || a.createdAt || 0);
            bValue = new Date(b.created_at || b.createdAt || 0);
            break;
          case "studentsEnrolled":
            aValue = parseInt(a.studentsEnrolled) || 0;
            bValue = parseInt(b.studentsEnrolled) || 0;
            break;
          case "seller_name":
            aValue = a.seller_name?.toLowerCase() || "";
            bValue = b.seller_name?.toLowerCase() || "";
            break;
          default:
            aValue = a.title?.toLowerCase() || "";
            bValue = b.title?.toLowerCase() || "";
        }

        if (sortOrder === "asc") {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
  }, [courses, searchTerm, statusFilter, sortBy, sortOrder]);

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading state for filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="h-10 bg-gray-200 rounded-md"></div>
            </div>
            <div className="flex gap-3">
              <div className="h-10 w-20 bg-gray-200 rounded-md"></div>
              <div className="h-10 w-24 bg-gray-200 rounded-md"></div>
            </div>
          </div>
        </div>

        {/* Loading state for create button */}
        <div className="h-12 w-40 bg-gray-200 rounded-lg animate-pulse"></div>

        {/* Loading state for content */}
        <div className="text-center mt-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  const filterProps = {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    view,
    setView,
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Filter Component */}
      <CourseFilters {...filterProps} />

      {/* Create Course Button */}
      <div className="flex justify-between items-center">
        <Link href="/instructor/course-upload">
          <Button variant="blueToGreen" size="lg">
            Create Course
          </Button>
        </Link>
      </div>

      {/* Course Results */}
      <CourseResults
        courses={filteredAndSortedCourses}
        totalCourses={courses.length}
        filteredCount={filteredAndSortedCourses.length}
        view={view}
        CardComponent={AdminCourseCard}
      />
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
      case "courses":
        return <TotalCourseStats />;
      case "analytics":
        return (
          <div className="space-y-6">
            <StatCard />
            <DetailedStats />
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
        <div>{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default DashboardTabs;
