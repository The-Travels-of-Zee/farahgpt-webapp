import { motion } from "framer-motion";
import { Clock, Star, BookOpen, TrendingUp, Lock, BadgeDollarSignIcon, Crown } from "lucide-react";
import { Badge } from "@/components/ui/Button";
import { useEffect, useState, useMemo } from "react";
import { fetchUsers } from "@/lib/actions/userActions";
import { Pagination } from "../Pagination";

// StudentCard Component
const StudentCard = ({ student, index = 0 }) => {
  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-blue-500";
    if (progress >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStatusColor = (status) => {
    const colors = {
      active: "green",
      inactive: "gray",
      completed: "blue",
    };
    return colors[status] || "gray";
  };

  return (
    <motion.div
      className="flex flex-col md:flex-row md:items-center justify-between bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:bg-gray-100 transition-colors space-y-4 md:space-y-0 md:space-x-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      {/* Left Section */}
      <div className="flex items-start md:items-center space-x-4 w-full md:w-2/3">
        <div className="relative flex-shrink-0">
          <img
            src={
              student.photo_url ||
              student.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                student.name || student.email || "Student"
              )}&background=3b82f6&color=fff`
            }
            alt={student.name || student.email || "Student"}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div
            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
              student.status === "active" || student.is_active ? "bg-green-500" : "bg-gray-400"
            }`}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {student.name || student.full_name || student.email || "Unknown Student"}
            </h4>
            <Badge color={getStatusColor(student.status || (student.is_active ? "active" : "inactive"))}>
              {student.status || (student.is_active ? "active" : "inactive")}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 truncate mb-2">{student.email || "No email"}</p>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <BookOpen className="w-3 h-3" />
              <span>{student.courses_enrolled || 0} courses</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{student.created_at ? new Date(student.created_at).toLocaleDateString() : "Never"}</span>
            </div>
            <div className="flex items-center space-x-1">
              {student.subscription_tier === "premium" ? (
                <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-sm">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </span>
              ) : (
                <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-medium flex items-center shadow-sm">
                  Free Tier
                </span>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <BadgeDollarSignIcon className="w-4 h-4" />
              <span>Promo: {student.promo_code || "N/A"}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3" />
              <span>{student.rating || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// StudentsList Component
const StudentsList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Total pages
  const totalPages = Math.ceil(students.length / itemsPerPage);

  // Automatically reset currentPage if it's out of bounds
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // Paginate students
  const currentStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return students.slice(startIndex, endIndex);
  }, [students, currentPage, itemsPerPage]);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleItemsPerPageChange = (newLimit) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  };

  // Fetch students
  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchUsers();
        if (result.success && result.data) {
          setStudents(result.data);
        } else {
          setError(result.error || "Failed to fetch students");
          setStudents([]);
        }
      } catch (error) {
        setError("Error loading students: " + error.message);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, []);

  // Loading
  if (loading) {
    return (
      <div className="space-y-4 px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Students Overview</h2>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading students...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="space-y-4 px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Students Overview</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!students || students.length === 0) {
    return (
      <div className="space-y-4 px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Students Overview</h2>
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
          <p className="mt-1 text-sm text-gray-500">No students have been registered yet.</p>
        </div>
      </div>
    );
  }

  // Main Render
  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="space-y-6 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Students Overview</h2>
          <span className="text-sm text-gray-500">{students.length} students</span>
        </div>

        <div className="space-y-4">
          {currentStudents.map((student, index) => (
            <StudentCard key={student.id || index} student={student} index={index} />
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={students.length}
          onItemsPerPageChange={handleItemsPerPageChange}
          showItemsPerPage={true}
        />
      </div>
    </div>
  );
};

export { StudentCard, StudentsList };
export default StudentsList;
