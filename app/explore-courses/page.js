"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, List, X, ChevronDown } from "lucide-react";
import Button from "@/components/ui/Button";
import { ExploreCourseCard } from "@/components/Dashboard/CourseCard";
import { sortOptions, statusOptions } from "@/constants";
import fetchCourses from "@/lib/actions/courseActions";
import CourseErrorState from "@/components/ui/CourseErrorState";
import CourseLoadingState from "@/components/ui/CourseLoadingState";
import CoursesEmptyState from "@/components/ui/CoursesEmptyState";

// Skeleton for header while loading
const HeaderSkeleton = () => (
  <div className="bg-white border-b border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="text-center">
        <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
      </div>
    </div>
  </div>
);

// Skeleton for search bar while loading
const SearchSkeleton = () => (
  <div className="bg-white border-b border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="h-10 bg-gray-200 rounded-lg w-full max-w-md animate-pulse"></div>
        <div className="flex items-center gap-3">
          <div className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded-lg w-10 animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
);

const ExploreAllCourses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'grid'
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [minRating, setMinRating] = useState(0);

  // Course data and loading states
  // Add state for courses data
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch courses function with proper error handling
  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchCourses();

      if (result.success) {
        setCourses(result.data || []);
      } else {
        // Handle case where result exists but success is false
        const errorMessage = result.message || result.error || "Failed to fetch courses";
        setError(errorMessage);
        setCourses([]);
      }
    } catch (error) {
      console.error("Error loading courses:", error);
      setError(error.message || "An unexpected error occurred while loading courses");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch courses on component mount
  useEffect(() => {
    loadCourses();
  }, []);

  // Filter and sort courses
  const filteredAndSortedCourses = useMemo(() => {
    if (!courses.length) return [];

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

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedStatus("all");
    setSortBy("newest");
    setPriceRange([0, 500]);
    setMinRating(0);
  };

  const activeFiltersCount = [
    searchTerm,
    selectedStatus !== "all" ? selectedStatus : null,
    priceRange[0] > 0 || priceRange[1] < 500 ? "price" : null,
    minRating > 0 ? "rating" : null,
  ].filter(Boolean).length;

  const hasActiveFilters = activeFiltersCount > 0;

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HeaderSkeleton />
        <SearchSkeleton />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 bg-gray-200 rounded w-40 animate-pulse"></div>
          </div>
          <CourseLoadingState />
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-arefruqaa font-bold text-gray-900 mb-2">
                Explore All Courses
              </h1>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4 sm:px-0">
                Discover our comprehensive collection of courses designed to help you master new skills and advance your
                career.
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CourseErrorState error={error} onRetry={loadCourses} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-arefruqaa font-bold text-gray-900 mb-2">
              Explore All Courses
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4 sm:px-0">
              Discover our comprehensive collection of courses designed to help you master new skills and advance your
              career.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm focus:ring-2 focus:ring-secondary/50 focus:border-transparent"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <Button
                  variant="primaryGreen"
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-secondary/50 focus:border-transparent"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Minimum Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(parseFloat(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-secondary/50 focus:border-transparent"
                  >
                    <option value={0}>Any Rating</option>
                    <option value={4.5}>4.5+ Stars</option>
                    <option value={4.0}>4.0+ Stars</option>
                    <option value={3.5}>3.5+ Stars</option>
                    <option value={3.0}>3.0+ Stars</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    <X className="w-4 h-4 mr-2" />
                    Clear All Filters
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
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

        {/* Course Grid/List */}
        {filteredAndSortedCourses.length > 0 ? (
          <div className={viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-6"}>
            {filteredAndSortedCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={viewMode === "grid" ? "h-fit" : ""}
              >
                <ExploreCourseCard course={course} index={index} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <CoursesEmptyState hasFilters={hasActiveFilters} onClearFilters={clearFilters} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ExploreAllCourses;
