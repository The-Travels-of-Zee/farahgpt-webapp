// components/courses/CourseCard.tsx
import { motion } from "framer-motion";
import Button, { Badge } from "@/components/ui/Button";
import {
  Users,
  Calendar,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Crown,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import fetchCourses from "@/lib/actions/courseActions";
import { useEffect, useRef, useState } from "react";

// Filter and Search Component
export const CourseFilters = ({
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
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef(null);

  // Close filters on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setSortBy("title");
    setSortOrder("asc");
  };

  const hasActiveFilters = searchTerm || statusFilter !== "all";

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter and Sort Controls */}
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex border border-gray-300 rounded-md overflow-hidden">
            <button
              onClick={() => setView("list")}
              className={`px-3 py-1 text-sm ${
                view === "list" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              List
            </button>
            <button
              onClick={() => setView("grid")}
              className={`px-3 py-1 text-sm ${
                view === "grid" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Grid
            </button>
          </div>

          {/* Filter Button */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 border rounded-md text-sm ${
                hasActiveFilters ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5 ml-1">
                  {(searchTerm ? 1 : 0) + (statusFilter !== "all" ? 1 : 0)}
                </span>
              )}
            </button>

            {/* Filter Dropdown */}
            {showFilters && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                <div className="p-4 space-y-4">
                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Statuses</option>
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>

                  {/* Sort Options */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                    <div className="flex gap-2">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="title">Title</option>
                        <option value="created_at">Date Created</option>
                        <option value="studentsEnrolled">Students</option>
                        <option value="seller_name">Instructor</option>
                      </select>
                      <button
                        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                        className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Course Card component for admin dashboard
export const AdminCourseCard = ({ course, index = 0, revenue = 0 }) => {
  const getStatusColor = (status) => {
    const colors = {
      published: "primaryGreen",
      draft: "yellow",
      archived: "gray",
      pending: "orange",
    };
    return colors[status.trim().toLowerCase()] || "gray";
  };

  return (
    <motion.div
      className="relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col sm:flex-row h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      {/* Thumbnail */}
      <div className="w-full sm:w-40 aspect-video bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0">
        {course.course_image ? (
          <img src={course.course_image} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
            {course.title.charAt(0) || "C"}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-4 justify-between">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2">
          <div className="min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{course.title || "Untitled Course"}</h3>
              <Badge color={getStatusColor(course.status)}>{course.status || "draft"}</Badge>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{course.description || "No description available"}</p>
            <p className="mt-2 text-sm font-semibold text-primary">{course.seller_name}</p>
          </div>
          <CourseCardMenu />
        </div>

        <CourseStats course={course} />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-sm text-gray-600">
            Revenue: <span className="font-semibold text-green-600">${revenue}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// components/courses/CourseCard.tsx
export const ExploreCourseCard = ({ course, index = 0, view = "list", isPremium }) => {
  const pathname = usePathname();
  const isGrid = view === "grid";

  return (
    <motion.div
      className={`bg-white border border-gray-200 rounded-lg overflow-hidden transition-shadow hover:shadow-md
        ${isGrid ? "flex flex-col h-full min-h-[600px]" : "flex flex-col sm:flex-row h-full"}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      {/* Thumbnail */}
      <div
        className={`${
          isGrid ? "w-full aspect-video" : "w-full sm:w-40 h-full"
        } bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0`}
      >
        {course.course_image ? (
          <img src={course.course_image} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
            {course.title.charAt(0) || "C"}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-4 justify-between">
        {/* Header */}
        <div
          className={`flex ${
            isGrid ? "flex-col gap-2 mb-2" : "flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2"
          }`}
        >
          <div className="min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{course.title || "Untitled Course"}</h3>
            </div>
            <p className={`text-sm text-gray-600 line-clamp-2 ${isGrid ? "min-h-[40px]" : ""}`}>
              {course.description || "No description available"}
            </p>
            <p className="mt-2 text-sm font-semibold text-primary">{course.seller_name}</p>
          </div>
        </div>

        {/* Stats */}
        <CourseStats course={course} view={view} />

        {/* Footer */}
        <div
          className={`flex ${
            isGrid ? "flex-col gap-2 mt-2" : "flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          }`}
        >
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Link href={isPremium ? `${pathname}/../learning/chat/${course.id}` : `${pathname}/../plans`}>
              <Button variant="blueToGreen" size="md" className="w-full sm:w-auto">
                {isPremium ? "Start Learning" : "Get Premium"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const CourseCardMenu = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative self-end sm:self-start" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute right-0 top-0 md:top-10 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <button className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
            <Eye className="w-4 h-4" />
            <span>View Course</span>
          </button>
          <button className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
            <Edit className="w-4 h-4" />
            <span>Edit Course</span>
          </button>
          <button className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
            <span>Delete Course</span>
          </button>
        </div>
      )}
    </div>
  );
};

// components/courses/CourseStats.tsx
export const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export const CourseStats = ({ course, view = "list" }) => {
  const isGrid = view === "grid";

  return (
    <div
      className={`mb-4 text-sm text-gray-600 ${
        isGrid ? "grid grid-cols-1 gap-3" : "flex flex-wrap items-center gap-4"
      }`}
    >
      <div className="flex items-center space-x-2">
        <Users className="w-4 h-4" />
        <span>{course.studentsEnrolled || "100+"} students</span>
      </div>

      {/* Premium Badge */}
      <span className="inline-flex max-w-min items-center bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
        <Crown className="w-4 h-4 mr-1" />
        Premium
      </span>

      <div className="flex items-center space-x-2">
        <Calendar className="w-4 h-4" />
        <span>{formatDate(course.created_at)}</span>
      </div>
    </div>
  );
};

// components/courses/CourseProgress.tsx
export const CourseProgress = ({ completionRate = 0 }) => (
  <div className="mb-4">
    <div className="flex items-center justify-between text-sm mb-1">
      <span className="text-gray-600">Course Progress</span>
      <span className="font-medium text-gray-900">{completionRate}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${completionRate}%` }} />
    </div>
  </div>
);

// Enhanced AllCourses component with filtering logic
export const AllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter and sort states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
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

  // Filter and sort courses
  const filteredAndSortedCourses = courses
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
          aValue = new Date(a.created_at || 0);
          bValue = new Date(b.created_at || 0);
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

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="text-center mt-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return {
    courses: filteredAndSortedCourses,
    totalCourses: courses.length,
    filteredCount: filteredAndSortedCourses.length,
    filters: {
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
    },
  };
};

// Course Results Display Component
export const CourseResults = ({
  courses,
  totalCourses,
  filteredCount,
  view = "list",
  CardComponent = AdminCourseCard,
}) => {
  const isGrid = view === "grid";

  return (
    <div>
      {/* Results Summary */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredCount} of {totalCourses} courses
      </div>

      {/* No Results */}
      {filteredCount === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      ) : (
        /* Course Grid/List */
        <div
          className={`
          ${isGrid ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}
        `}
        >
          {courses.map((course, index) => (
            <CardComponent key={course.id} course={course} index={index} view={view} />
          ))}
        </div>
      )}
    </div>
  );
};
