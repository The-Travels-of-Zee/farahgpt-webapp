import { motion } from "framer-motion";
import { Clock, Star, BookOpen, TrendingUp, Lock, BadgeDollarSignIcon, Crown, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/Button";
import { useEffect, useState, useMemo } from "react";
import { fetchUsers } from "@/lib/actions/userActions";
import { Pagination } from "../Pagination";
import useUser from "@/hooks/useUser";

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
              student.photo_url ||
              `https://ui-photo_urls.com/api/?name=${encodeURIComponent(
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

  const { user } = useUser();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Sorting state
  const [sortBy, setSortBy] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");

  // Sort options
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "alphabetical", label: "A-Z" },
    { value: "alphabetical-desc", label: "Z-A" },
    { value: "premium-first", label: "Premium First" },
    { value: "free-first", label: "Free First" },
    { value: "most-courses", label: "Most Courses" },
    { value: "least-courses", label: "Least Courses" },
    { value: "highest-rating", label: "Highest Rating" },
    { value: "lowest-rating", label: "Lowest Rating" },
    { value: "active-first", label: "Active First" },
    { value: "inactive-first", label: "Inactive First" },
  ];

  // Filter and sort students
  const filteredAndSortedStudents = useMemo(() => {
    let filtered = students.filter((student) => {
      const name = student.name || student.full_name || "";
      const email = student.email || "";
      const matchesSearch =
        name.toLowerCase().includes(searchTerm.toLowerCase()) || email.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });

    // Sort students
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        case "oldest":
          return new Date(a.created_at || 0) - new Date(b.created_at || 0);
        case "alphabetical":
          const nameA = a.name || a.full_name || a.email || "";
          const nameB = b.name || b.full_name || b.email || "";
          return nameA.localeCompare(nameB);
        case "alphabetical-desc":
          const nameA2 = a.name || a.full_name || a.email || "";
          const nameB2 = b.name || b.full_name || b.email || "";
          return nameB2.localeCompare(nameA2);
        case "premium-first":
          const aPremium = a.subscription_tier === "premium" ? 1 : 0;
          const bPremium = b.subscription_tier === "premium" ? 1 : 0;
          return bPremium - aPremium;
        case "free-first":
          const aFree = a.subscription_tier === "premium" ? 0 : 1;
          const bFree = b.subscription_tier === "premium" ? 0 : 1;
          return bFree - aFree;
        case "most-courses":
          return (b.courses_enrolled || 0) - (a.courses_enrolled || 0);
        case "least-courses":
          return (a.courses_enrolled || 0) - (b.courses_enrolled || 0);
        case "highest-rating":
          return (b.rating || 0) - (a.rating || 0);
        case "lowest-rating":
          return (a.rating || 0) - (b.rating || 0);
        case "active-first":
          const aActive = a.status === "active" || a.is_active ? 1 : 0;
          const bActive = b.status === "active" || b.is_active ? 1 : 0;
          return bActive - aActive;
        case "inactive-first":
          const aInactive = a.status === "active" || a.is_active ? 0 : 1;
          const bInactive = b.status === "active" || b.is_active ? 0 : 1;
          return bInactive - aInactive;
        default:
          return 0;
      }
    });

    return filtered;
  }, [students, searchTerm, sortBy]);

  // Total pages
  const totalPages = Math.ceil(filteredAndSortedStudents.length / itemsPerPage);

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
    return filteredAndSortedStudents.slice(startIndex, endIndex);
  }, [filteredAndSortedStudents, currentPage, itemsPerPage]);

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
        const result = await fetchUsers(user?.id);
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
        {/* Header with search and sorting */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Students Overview</h2>
            <span className="text-sm text-gray-500">
              {filteredAndSortedStudents.length} of {students.length} students
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none w-full sm:w-auto px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Students list */}
        <div className="space-y-4">
          {currentStudents.map((student, index) => (
            <StudentCard key={student.id || index} student={student} index={index} />
          ))}
        </div>

        {/* No results message */}
        {filteredAndSortedStudents.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
            <p className="mt-1 text-sm text-gray-500">
              No students match your search criteria. Try adjusting your search terms.
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredAndSortedStudents.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={filteredAndSortedStudents.length}
            onItemsPerPageChange={handleItemsPerPageChange}
            showItemsPerPage={true}
          />
        )}
      </div>
    </div>
  );
};

export { StudentCard, StudentsList };
export default StudentsList;
