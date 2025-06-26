"use client";
import { motion } from "framer-motion";
import { MoreHorizontal, Star } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "../ui/button";

const CourseCard = ({ course, index }) => {
  const getProgressColor = (progress) => {
    if (progress === 100) return "text-green-600";
    if (progress >= 50) return "text-orange-600";
    return "text-blue-600";
  };

  const pathname = usePathname();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <div className="relative">
        <div className={`h-48 ${course.bgColor} flex items-center justify-center`}>
          <div className="text-white text-6xl">{course.icon}</div>
        </div>
        <button className="absolute top-4 right-4 text-white hover:text-gray-200">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
        <p className="text-sm text-gray-600 mb-3">{course.instructor}</p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <span className={`text-sm font-medium ${getProgressColor(course.progress)}`}>
              {course.progress}% complete
            </span>
          </div>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-orange-400 fill-current" />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Your rating</span>
        </div>

        {course.progress === 0 && (
          <Link href={`${pathname}/${course.id}`}>
            <Button variant="gradientGreen" size="md" className="mt-4 w-full">
              START COURSE
            </Button>
          </Link>
        )}
        {course.progress > 0 && (
          <Link href={`${pathname}/${course.id}`}>
            <Button variant="gradientGreen" size="md" className="mt-4 w-full">
              CONTINUE
            </Button>
          </Link>
        )}
      </div>
    </motion.div>
  );
};

export default CourseCard;
