// components/courses/CourseCard.tsx
import { motion } from "framer-motion";
import Button, { Badge } from "./Button";
import { Users, DollarSign, Star, Calendar, MoreHorizontal, Eye, Edit, Trash2, Stars } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Course Card component for admin dashboard
export const AdminCourseCard = ({ course, index = 0, revenue = 0 }) => {
  const pathname = usePathname();
  const getStatusColor = (status) => {
    const colors = {
      published: "green",
      draft: "yellow",
      archived: "gray",
      pending: "orange",
    };
    return colors[status] || "gray";
  };

  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col sm:flex-row h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      {/* Thumbnail */}
      <div className="w-full sm:w-40 h-48 sm:h-auto bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0">
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
            {course.title?.charAt(0) || "C"}
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
          </div>
          <CourseCardMenu />
        </div>

        <CourseStats course={course} />
        <CourseProgress completionRate={course.completionRate} />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-sm text-gray-600">
            Revenue: <span className="font-semibold text-green-600">${revenue}</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              View Analytics
            </Button>
            <Button variant="primary" size="sm" className="w-full sm:w-auto">
              Manage Course
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Course Card component for explore page
export const ExploreCourseCard = ({ course, index = 0, view = "list" }) => {
  const pathname = usePathname();
  const isGrid = view === "grid";

  const getStatusColor = (status) => {
    const colors = {
      published: "green",
      draft: "yellow",
      archived: "gray",
      pending: "orange",
    };
    return colors[status] || "gray";
  };

  return (
    <motion.div
      className={`
        bg-white border border-gray-200 rounded-lg overflow-hidden transition-shadow hover:shadow-md
        ${isGrid ? "flex flex-col h-full" : "flex flex-col sm:flex-row h-full"}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      {/* Thumbnail */}
      <div
        className={`
          ${isGrid ? "h-44 w-full" : "w-full sm:w-40 h-48 sm:h-auto"}
          bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0
        `}
      >
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
            {course.title?.charAt(0) || "C"}
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
          </div>
        </div>

        <CourseStats course={course} />

        {/* Footer */}
        <div
          className={`flex ${
            isGrid ? "flex-col gap-2 mt-2" : "flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          }`}
        >
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Link href={`${pathname}/../learning/${course.id}`}>
              <Button variant="primary" size="sm" className={`w-full sm:w-auto ${isGrid ? "text-sm px-3 py-1.5" : ""}`}>
                Start Learning
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// components/courses/CourseCardMenu.tsx
export const CourseCardMenu = () => (
  <div className="relative group self-end sm:self-start">
    <button className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
      <MoreHorizontal className="w-5 h-5" />
    </button>
    <div className="absolute right-0 top-8 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
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
  </div>
);

// components/courses/CourseStats.tsx

export const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const CourseStats = ({ course }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4 text-sm text-gray-600">
    <div className="flex items-center space-x-2">
      <Users className="w-4 h-4" />
      <span>{course.studentsEnrolled || 0} students</span>
    </div>
    <div className="flex items-center space-x-2">
      <Star className="w-4 h-4" />
      <span>
        {course.rating || 0} ({course.reviews || 0})
      </span>
    </div>
    <div className="max-w-min flex items-center space-x-2 bg-yellow-200 py-1 px-2 rounded-full text-sm text-amber-600">
      <Stars className="w-4 h-4" />
      <span>Premium</span>
    </div>
    <div className="flex items-center space-x-2">
      <Calendar className="w-4 h-4" />
      <span>{formatDate(course.createdAt)}</span>
    </div>
  </div>
);

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

// components/courses/CourseList.tsx
// import CourseCard from "./CourseCard";

export const CourseList = ({ courses }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    {courses.map((course, index) => (
      <CourseCard key={course.id} course={course} index={index} />
    ))}
  </div>
);

export const dummyCourses = [
  {
    id: 1,
    title: "Visionaire: The Art of Dream Duas",
    author: "Shaykh Muhammad Alshareef (rahimaullah)",
    description:
      "Unlock the secrets of effective dua with this comprehensive course. Learn how to make impactful supplications that resonate with your heart and mind.",
    thumbnail: null,
    status: "published",
    studentsEnrolled: 1247,
    price: 149,
    rating: 4.8,
    reviews: 324,
    createdAt: "2024-01-15",
    completionRate: 78,
    totalRevenue: 185603,
  },
  {
    id: 2,
    title: "Dream Worldwide Arabic Workbook",
    author: "Ustadh Nouman Ali Khan",
    description:
      "Enhance your Arabic language skills with our interactive workbook. Perfect for beginners and advanced learners alike, this course offers practical exercises and real-world applications.",
    thumbnail: null,
    status: "published",
    studentsEnrolled: 892,
    price: 199,
    rating: 4.7,
    reviews: 156,
    createdAt: "2023-11-20",
    completionRate: 65,
    totalRevenue: 177508,
  },
  {
    id: 3,
    title: "Master the Arabic alphabet and start reading with confidence in just 21 Days",
    author: "Ustadh Yasir Qadhi",
    description:
      "Learn the Arabic alphabet and basic reading skills in this intensive 21-day course. Ideal for beginners, this course provides a solid foundation for further Arabic studies.",
    thumbnail: null,
    status: "draft",
    studentsEnrolled: 0,
    price: 129,
    rating: 0,
    reviews: 0,
    createdAt: "2024-03-10",
    completionRate: 15,
    totalRevenue: 0,
  },
  {
    id: 4,
    title: "Hadith Arabic: Learn the Language of the Prophet (ﷺ)",
    author: "Ustadh Omar Suleiman",
    description:
      "Dive into the language of Hadith with this specialized course. Understand the nuances of Arabic used in Hadith literature and enhance your comprehension of Islamic texts.",
    thumbnail: null,
    status: "published",
    studentsEnrolled: 634,
    price: 179,
    rating: 4.9,
    reviews: 89,
    createdAt: "2023-12-05",
    completionRate: 82,
    totalRevenue: 113486,
  },
  {
    id: 5,
    title: "Tafsir Essentials: Understanding the meaning of the Quran",
    author: "Sheikh Assim Al Hakeem",
    description:
      "Explore the essential concepts of Tafsir in this course. Gain a deeper understanding of the Quran's meanings and interpretations, enhancing your spiritual connection.",
    thumbnail: null,
    status: "pending",
    studentsEnrolled: 23,
    price: 99,
    rating: 4.2,
    reviews: 12,
    createdAt: "2024-02-28",
    completionRate: 45,
    totalRevenue: 2277,
  },
  {
    id: 6,
    title: "Faith & Finances: Islamic Wealth Principles",
    author: "Islamic Finance Faculty",
    description:
      "Learn how to manage your finances in accordance with Islamic principles. This course covers topics such as halal investments, zakat calculation, and ethical financial practices.",
    thumbnail: null,
    status: "archived",
    studentsEnrolled: 445,
    price: 159,
    rating: 4.6,
    reviews: 78,
    createdAt: "2023-08-12",
    completionRate: 71,
    totalRevenue: 70755,
  },
];
