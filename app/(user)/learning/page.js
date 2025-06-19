"use client";
import React, { useState } from "react";
import CourseCard from "@/components/User/CourseCard";
import { FilterBar } from "@/components/User/FilterBar";
import Header from "@/components/User/Header";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    sort: "Recently Accessed",
    categories: "",
    progress: "",
    instructor: "",
  });

  const courses = [
    {
      id: 1,
      title: "Build Dynamic Web Apps with React & Firebase",
      instructor: "The Net Ninja",
      progress: 99,
      bgColor: "bg-gradient-to-br from-blue-400 to-blue-600",
      icon: "⚛️",
    },
    {
      id: 2,
      title: "Modern JavaScript (Complete guide, from Novice to Ninja)",
      instructor: "The Net Ninja",
      progress: 100,
      bgColor: "bg-gradient-to-br from-red-400 to-pink-600",
      icon: "JS",
    },
    {
      id: 3,
      title: "Learn Figma in 14 Days - Master UI Design and Prototyping",
      instructor: "Muhammad Ahsan Pervaiz",
      progress: 22,
      bgColor: "bg-gradient-to-br from-purple-400 to-indigo-600",
      icon: "🎨",
    },
    {
      id: 4,
      title: "Freelancing for Designers and Developers - For Beginners",
      instructor: "Muhammad Ahsan Pervaiz",
      progress: 4,
      bgColor: "bg-gradient-to-br from-green-400 to-teal-600",
      icon: "💼",
    },
    {
      id: 5,
      title: "Web Design for Web Developers: Build Beautiful Websites!",
      instructor: "Jonas Schmedtmann",
      progress: 0,
      bgColor: "bg-gradient-to-br from-orange-400 to-red-600",
      icon: "🌐",
    },
  ];

  const filteredCourses = courses
    .filter((course) => {
      const query = searchQuery.toLowerCase();
      return course.title.toLowerCase().includes(query) || course.instructor.toLowerCase().includes(query);
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
      if (filters.instructor) {
        return course.instructor.toLowerCase().includes(filters.instructor.toLowerCase());
      }
      return true;
    });

  // Optional sorting
  if (filters.sort === "A-Z") {
    filteredCourses.sort((a, b) => a.title.localeCompare(b.title));
  } else if (filters.sort === "Z-A") {
    filteredCourses.sort((a, b) => b.title.localeCompare(a.title));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <FilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filters={filters}
          setFilters={setFilters}
        />
        <CourseGrid courses={filteredCourses} />
      </div>
    </div>
  );
};

export default LearningDashboard;
