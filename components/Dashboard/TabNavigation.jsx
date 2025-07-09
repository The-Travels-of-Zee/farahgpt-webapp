"use client";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { DetailedStats } from "./StatCard";
import Link from "next/link";
import Button from "/components/ui/Button";
import { AdminCourseCard } from "./CourseCard";
import CouponGenerator from "./CouponGenerator";
import { ChevronDown, List, Search, Star, Users } from "lucide-react";
import { fetchCourses } from "@/lib/actions/courseActions";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [minRating, setMinRating] = useState(0);

  // Fetch courses from courseActions
  // Add state for courses data
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Filter and sort courses
  const filteredAndSortedCourses = useMemo(() => {
    let filtered = courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase());

      // const matchesStatus = selectedStatus === "all" || course.status === selectedStatus;

      // const matchesPrice = course.price >= priceRange[0] && course.price <= priceRange[1];

      // const matchesRating = course.rating >= minRating;

      // return matchesSearch && matchesStatus && matchesPrice && matchesRating;

      return matchesSearch;
    });

    // Sort courses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt);
        case "oldest":
          return new Date(a.created_at || a.createdAt) - new Date(b.created_at || b.createdAt);
        case "popular":
          return (b.studentsEnrolled || 0) - (a.studentsEnrolled || 0);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        case "alphabetical":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [courses, searchTerm, selectedStatus, sortBy, priceRange, minRating]);

  // Show loading state
  if (loading) {
    return (
      <>
        <div className="sticky top-0 z-30">
          <div className="max-w-7xl mx-auto py-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary/50 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Search and Filter Bar */}
      <div className="sticky top-0 z-30">
        <div className="max-w-7xl mx-auto py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary/50 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Results */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-lg text-gray-900">
            <span className="font-semibold">{filteredAndSortedCourses.length}</span> courses found
          </p>
          {searchTerm && (
            <p className="text-sm text-gray-600 mt-1">
              Showing results for "<span className="font-medium">{searchTerm}</span>"
            </p>
          )}
        </div>
      </div>
      <Link href="/instructor/course-upload">
        <Button variant="blueToGreen" className="mb-4" size="lg">
          Create Course
        </Button>
      </Link>
      {filteredAndSortedCourses.length > 0 ? (
        <div className={"space-y-6"}>
          {filteredAndSortedCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={"h-fit"}
            >
              <AdminCourseCard course={course} index={index} />
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
        </motion.div>
      )}
    </>
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
