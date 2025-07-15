"use client";
import React, { useEffect, useState } from "react";
import CourseCard from "@/components/User/CourseCard";
import { FilterBar } from "@/components/User/FilterBar";
import Header from "@/components/User/LearningNavbar";
import fetchCourses from "@/lib/actions/courseActions";
import useUserStore from "@/store/userStore";
import { useRouter } from "next/navigation";

// Course Grid Component
const CourseGrid = ({ courses }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {courses.map((course, index) => (
        <CourseCard key={course.id} course={course} index={index} />
      ))}
    </div>
  );
};

// Main Dashboard Component
const LearningDashboard = () => {
  const { isPremium } = useUserStore();
  const router = useRouter();
  if (!isPremium) {
    return router.push("/plans");
  }
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    sort: "Recently Accessed",
    categories: "",
    progress: "",
    seller_name: "",
  });

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

  const filteredCourses = courses
    .filter((course) => {
      const query = searchQuery.toLowerCase();
      return course.title.toLowerCase().includes(query) || course.seller_name.toLowerCase().includes(query);
    })
    .filter((course) => {
      if (filters.categories) {
        return course.title.toLowerCase().includes(filters.categories.toLowerCase());
      }
      return true;
    })
    .filter((course) => {
      if (filters.progress === "Completed") return course.progress === 100;
      if (filters.progress === "In Progress") return course.progress > 0 && course.progress < 100;
      if (filters.progress === "Not Started") return course.progress === 0;
      return true;
    })
    .filter((course) => {
      if (filters.seller_name) {
        return course.seller_name.toLowerCase().includes(filters.seller_name.toLowerCase());
      }
      return true;
    });

  // Optional sorting
  if (filters.sort === "A-Z") {
    filteredCourses.sort((a, b) => a.title.localeCompare(b.title));
  } else if (filters.sort === "Z-A") {
    filteredCourses.sort((a, b) => b.title.localeCompare(a.title));
  }

  const filterOptions = [
    // {
    //   label: "Category",
    //   value: "categories",
    //   options: ["Design", "Development", "Programming", "Business", "Marketing"],
    //   placeholder: "Categories",
    //   onChange: "categories",
    // },
    // {
    //   label: "Progress",
    //   value: "progress",
    //   options: ["Not Started", "In Progress", "Completed"],
    //   placeholder: "Progress",
    //   onChange: "progress",
    // },
    {
      label: "Instructor",
      value: "instructor",
      options: Array.from(new Set(courses.map((course) => course.seller_name))),
      placeholder: "Instructors",
      onChange: "seller_name",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <FilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filters={filters}
          filterOptions={filterOptions}
          setFilters={setFilters}
        />
        {loading ? (
          <div className="min-h-screen bg-gray-50">
            <div className="text-center mt-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading courses...</p>
            </div>
          </div>
        ) : (
          <CourseGrid courses={filteredCourses} />
        )}
        {/* <CoursesList /> */}
      </div>
    </div>
  );
};

export default LearningDashboard;
