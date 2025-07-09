// components/courses/CourseCard.tsx
import { motion } from "framer-motion";
import Button, { Badge } from "@/components/ui/Button";
import { Users, DollarSign, Star, Calendar, MoreHorizontal, Eye, Edit, Trash2, Stars, Crown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import fetchCourses from "@/lib/actions/courseActions";

// Course Card component for admin dashboard
export const AdminCourseCard = ({ course, index = 0, revenue = 0 }) => {
  const getStatusColor = (status) => {
    const colors = {
      published: "primaryGreen",
      draft: "yellow",
      archived: "gray",
      pending: "orange",
    };
    return colors[status?.trim().toLowerCase()] || "gray";
  };

  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col sm:flex-row h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      {/* Thumbnail */}
      <div className="w-full sm:w-40 aspect-square bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0">
        {course.course_image ? (
          <img src={course.course_image} alt={course.title} className="w-full h-full aspect-square object-cover" />
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
            <p className="mt-2 text-sm font-semibold text-primary">{course.author}</p>
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

// Course Card component for explore page
export const ExploreCourseCard = ({ course, index = 0, view = "list" }) => {
  const pathname = usePathname();
  const isGrid = view === "grid";

  // const getStatusColor = (status) => {
  //   const colors = {
  //     published: "green",
  //     draft: "yellow",
  //     archived: "gray",
  //     pending: "orange",
  //   };
  //   return colors[status] || "gray";
  // };

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
      <div className={`w-full sm:w-40 aspect-square bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0`}>
        {course.course_image ? (
          <img src={course.course_image} alt={course.title} className="w-full h-full aspect-square object-cover" />
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

        <CourseStats course={course} />

        {/* Footer */}
        <div
          className={`flex ${
            isGrid ? "flex-col gap-2 mt-2" : "flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          }`}
        >
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Link href={`${pathname}/../learning/${course.id}`}>
              <Button variant="blueToGreen" size="md" className="w-full sm:w-auto">
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

const CourseStats = ({ course }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4 text-sm text-gray-600">
      <div className="flex items-center space-x-2">
        <Users className="w-4 h-4" />
        <span>{course.studentsEnrolled || "100+"} students</span>
      </div>
      {/* <div className="flex items-center space-x-2">
        <Star className="w-4 h-4" />
        <span>
          {course.rating || 0} ({course.reviews || 0})
        </span>
      </div> */}
      <span className="max-w-min bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-sm">
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
