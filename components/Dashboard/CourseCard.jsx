import { motion } from "@/lib/motion";
import { Users, DollarSign, Star, Calendar, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import Button, { Badge } from "./Button";

const CourseCard = ({ course, index = 0 }) => {
  // Default values in case course prop is undefined
  const courseData = course || {};

  const getStatusColor = (status) => {
    const colors = {
      published: "green",
      draft: "yellow",
      archived: "gray",
      pending: "orange",
    };
    return colors[status] || "gray";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Course Image */}
        <div className="w-full sm:w-24 h-48 sm:h-24 bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0">
          {courseData.thumbnail ? (
            <img src={courseData.thumbnail} alt={courseData.title || "Course"} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
              {(courseData.title || "C").charAt(0)}
            </div>
          )}
        </div>

        {/* Course Details */}
        <div className="flex-1 p-4">
          {/* Top Row */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {courseData.title || "Untitled Course"}
                </h3>
                <Badge color={getStatusColor(courseData.status)}>{courseData.status || "draft"}</Badge>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">
                {courseData.description || "No description available"}
              </p>
            </div>

            {/* Menu */}
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
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4 mb-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>{courseData.studentsEnrolled || 0} students</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <DollarSign className="w-4 h-4" />
              <span>${courseData.price || 0}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Star className="w-4 h-4" />
              <span>
                {courseData.rating || 0} ({courseData.reviews || 0} reviews)
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(courseData.createdAt)}</span>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600">Course Progress</span>
              <span className="font-medium text-gray-900">{courseData.completionRate || 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${courseData.completionRate || 0}%` }}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-sm text-gray-600">
              Revenue: <span className="font-semibold text-green-600">${courseData.totalRevenue || 0}</span>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                View Analytics
              </Button>
              <Button variant="primary" size="sm">
                Manage Course
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Dummy data for testing
export const dummyCourses = [
  {
    id: 1,
    title: "React Masterclass: From Beginner to Pro",
    description:
      "Complete guide to React development with hooks, context, and modern patterns. Build real-world projects and master component architecture.",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop",
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
    title: "Python for Data Science",
    description:
      "Learn Python programming with focus on data analysis, visualization, and machine learning using pandas, matplotlib, and scikit-learn.",
    thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=300&fit=crop",
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
    title: "UI/UX Design Fundamentals",
    description:
      "Master the principles of user interface and user experience design. Create stunning, user-friendly designs with industry best practices.",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
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
    title: "Advanced JavaScript Concepts",
    description:
      "Deep dive into JavaScript with closures, prototypes, async programming, and ES6+ features. Perfect for intermediate developers.",
    thumbnail: null, // This will show the first letter
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
    title: "Digital Marketing Strategy",
    description:
      "Comprehensive guide to digital marketing including SEO, social media, content marketing, and paid advertising strategies.",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
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
    title: "Photography Masterclass",
    description:
      "Learn professional photography techniques, composition, lighting, and post-processing with Adobe Lightroom and Photoshop.",
    thumbnail: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop",
    status: "archived",
    studentsEnrolled: 445,
    price: 159,
    rating: 4.6,
    reviews: 78,
    createdAt: "2023-08-12",
    completionRate: 71,
    totalRevenue: 70755,
  },
  {
    id: 7,
    title: "Node.js Backend Development",
    description:
      "Build scalable backend applications with Node.js, Express, MongoDB, and authentication. Deploy to cloud platforms.",
    thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=300&fit=crop",
    status: "published",
    studentsEnrolled: 756,
    price: 189,
    rating: 4.5,
    reviews: 134,
    createdAt: "2023-10-18",
    completionRate: 69,
    totalRevenue: 142884,
  },
  {
    id: 8,
    title: "Machine Learning Fundamentals",
    description:
      "Introduction to machine learning algorithms, supervised and unsupervised learning, and practical implementation with Python.",
    thumbnail: null,
    status: "draft",
    studentsEnrolled: 0,
    price: 249,
    rating: 0,
    reviews: 0,
    createdAt: "2024-04-02",
    completionRate: 25,
    totalRevenue: 0,
  },
];

// Example usage component
const CoursesList = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Courses Overview</h2>
      {dummyCourses.map((course, index) => (
        <CourseCard key={course.id} course={course} index={index} />
      ))}
    </div>
  );
};

export { CourseCard, CoursesList };
export default CourseCard;
