// components/courses/CourseCard.tsx
import { motion } from "framer-motion";
import Button, { Badge } from "@/components/ui/Button";
import { Users, Calendar, MoreHorizontal, Eye, Edit, Trash2, Crown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import fetchCourses from "@/lib/actions/courseActions";
import { useEffect, useRef, useState } from "react";

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
        {/* <CourseProgress completionRate={course.completionRate} /> */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-sm text-gray-600">
            Revenue: <span className="font-semibold text-green-600">${revenue}</span>
          </div>
          {/* <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              View Analytics
            </Button>
            <Button variant="blueToGreen" size="sm" className="w-full sm:w-auto">
              Manage Course
            </Button>
          </div> */}
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

// components/courses/CourseStats.tsx

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

// WASTE CODE
// components/courses/CourseList.tsx
// import CourseCard from "./CourseCard";

// export const CourseList = ({ courses }) => (
//   <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//     {courses.map((course, index) => (
//       <CourseCard key={course.id} course={course} index={index} />
//     ))}
//   </div>
// );

export const AllCourses = () => {
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
  return courses;
};
