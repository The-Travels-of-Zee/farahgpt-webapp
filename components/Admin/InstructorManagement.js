"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Trash2,
  BookOpen,
  Users,
  Star,
  DollarSign,
  Eye,
  X,
  Calendar,
  Award,
  TrendingUp,
  Filter,
  MoreVertical,
  AlertTriangle,
} from "lucide-react";
import { fetchInstructors } from "@/lib/actions/instructorActions";

const InstructorCard = ({ instructor, index, onView, onRemove }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getStatusColor = (status) => {
    return status === "active" ? "bg-green-500" : "bg-gray-400";
  };

  const getRevenueColor = (growth) => {
    if (growth > 0) return "text-green-600";
    if (growth < 0) return "text-red-600";
    return "text-gray-600";
  };

  return (
    <>
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <div className="flex flex-col md:flex-row md:items-start md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          {/* Left Side */}
          <div className="flex flex-col sm:flex-row sm:space-x-4 flex-1">
            {/* photo_url and status */}
            <div className="relative flex-shrink-0 w-14 h-14 mb-4 sm:mb-0">
              <img
                src={instructor.photo_url}
                alt={instructor.name}
                className="w-full h-full rounded-full object-cover ring-2 ring-gray-100"
              />
              <div
                className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(
                  instructor.status
                )}`}
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{instructor.name}</h3>
                <span
                  className={`max-w-min mt-1 sm:mt-0 px-2 py-1 rounded-full text-xs font-medium ${
                    instructor.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {instructor.status}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-1">{instructor.email}</p>
              <p className="text-sm text-indigo-600 font-medium mb-3">{instructor.specialization}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-600">{instructor.totalCourses} courses</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-green-500" />
                  {/* <span className="text-gray-600">{instructor.totalStudents.toLocaleString()} students</span> */}
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-gray-600">{instructor.avgRating}/5</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span className="text-gray-600">{instructor.lastActive}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-start justify-between md:flex-col md:items-end space-x-2 md:space-x-0 md:space-y-2">
            <div className="text-right">
              {/* <div className="text-lg font-semibold text-gray-900">${instructor.totalRevenue.toLocaleString()}</div> */}
              <div className={`flex items-center justify-end text-sm ${getRevenueColor(instructor.revenueGrowth)}`}>
                <TrendingUp className="w-3 h-3 mr-1" />
                {instructor.revenueGrowth > 0 ? "+" : ""}
                {instructor.revenueGrowth}%
              </div>
            </div>

            {/* More menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <button
                    onClick={() => {
                      onView(instructor);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Courses</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(true);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove Instructor</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-md w-full"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Remove Instructor</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                Are you sure you want to remove <strong>{instructor.name}</strong>? This will also affect their{" "}
                {instructor.totalCourses} courses and {instructor.totalStudents} students.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onRemove(instructor.id);
                    setShowDeleteConfirm(false);
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const CourseDetailModal = ({ instructor, onClose }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src={instructor.photo_url} alt={instructor.name} className="w-12 h-12 rounded-full object-cover" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{instructor.name}</h2>
              <p className="text-sm text-gray-600">{instructor.specialization}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Total Courses</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{instructor.totalCourses}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">Total Students</span>
              </div>
              {/* <div className="text-2xl font-bold text-green-600">{instructor.totalStudents.toLocaleString()}</div> */}
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-900">Avg Rating</span>
              </div>
              <div className="text-2xl font-bold text-yellow-600">{instructor.avgRating}/5</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Total Revenue</span>
              </div>
              {/* <div className="text-2xl font-bold text-purple-600">${instructor.totalRevenue.toLocaleString()}</div> */}
            </div>
          </div>

          {/* <h3 className="text-lg font-semibold text-gray-900 mb-4">Courses</h3>
          <div className="space-y-4">
            {instructor.courses.map((course) => (
              <div key={course.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-2">{course.title}</h4>
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{course.students} students</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4" />
                        <span>{course.rating}/5</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4" />
                        <span>${course.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div> */}
        </div>
      </motion.div>
    </motion.div>
  );
};

const InstructorManagement = () => {
  const [instructors, setInstructors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch instructors on component mount
  useEffect(() => {
    const loadInstructors = async () => {
      try {
        setLoading(true);
        const result = await fetchInstructors();
        if (result.success) {
          setInstructors(result.data || []);
        }
      } catch (error) {
        console.error("Error loading courses:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInstructors();
  }, []);

  const filteredInstructors = instructors.filter((instructor) => {
    const matchesSearch =
      instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || instructor.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleViewCourses = (instructor) => {
    setSelectedInstructor(instructor);
    setShowCourseModal(true);
  };

  const handleRemoveInstructor = (instructorId) => {
    setInstructors(instructors.filter((instructor) => instructor.id !== instructorId));
  };

  const totalInstructors = instructors.length;
  const activeInstructors = instructors.filter((i) => i.status === "active").length;
  const totalRevenue = instructors.reduce((sum, instructor) => sum + instructor.totalRevenue, 0);
  const totalStudents = instructors.reduce((sum, instructor) => sum + instructor.totalStudents, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Instructor Management</h1>
            <p className="text-gray-600">Manage and monitor your instructors and their performance</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Instructor Management</h1>
          <p className="text-gray-600">Manage and monitor your Instructors and their performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Instructors</p>
                <p className="text-2xl font-bold text-gray-900">{totalInstructors}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Instructors</p>
                <p className="text-2xl font-bold text-gray-900">{activeInstructors}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                {/* <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p> */}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                {/* <p className="text-2xl font-bold text-gray-900">{totalStudents.toLocaleString()}</p> */}
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search Instructors by name, email, or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* instructors List */}
        <div className="space-y-4">
          {filteredInstructors.length > 0 ? (
            filteredInstructors.map((instructor, index) => (
              <InstructorCard
                key={index}
                instructor={instructor}
                index={index}
                onView={handleViewCourses}
                onRemove={handleRemoveInstructor}
              />
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Instructors found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        {/* Course Detail Modal */}
        <AnimatePresence>
          {showCourseModal && selectedInstructor && (
            <CourseDetailModal
              instructor={selectedInstructor}
              onClose={() => {
                setShowCourseModal(false);
                setSelectedInstructor(null);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InstructorManagement;
