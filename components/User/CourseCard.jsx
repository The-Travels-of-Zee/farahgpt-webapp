"use client";
import { motion } from "framer-motion";
import { MoreHorizontal, Star } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "@/components/ui/Button";

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
        <div className="w-full flex items-center justify-center aspect-square bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0">
          {course.course_image ? (
            <img src={course.course_image} alt={course.title} className="w-auto h-full aspect-square object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
              {course.title.charAt(0) || "C"}
            </div>
          )}
        </div>
        <button className="absolute top-4 right-4 text-white hover:text-gray-200">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
        <p className="text-sm text-gray-600 mb-3">{course.seller_name}</p>

        {/* <div className="flex items-center justify-between mb-3">
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
        </div> */}

        {/* <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Your rating</span>
        </div> */}

        <Link href={`${pathname}/chat/${course.id}`}>
          <Button variant="blueToGreen" size="md" className="w-full">
            START LEARNING
          </Button>
        </Link>
        {course.progress > 0 && (
          <Link href={`${pathname}/chat/${course.id}`}>
            <Button variant="gradientGreen" size="md" className="w-full">
              CONTINUE
            </Button>
          </Link>
        )}
      </div>
    </motion.div>
  );
};

export default CourseCard;
