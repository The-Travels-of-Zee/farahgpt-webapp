import { motion } from "@/lib/motion";
import { Clock, Star, BookOpen, TrendingUp } from "lucide-react";
import { Badge } from "./Button";

const StudentCard = ({ student, index = 0 }) => {
  const studentData = student || {};

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
      className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors space-y-4 md:space-y-0 md:space-x-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      {/* Left Section */}
      <div className="flex items-start md:items-center space-x-4 w-full md:w-2/3">
        <div className="relative flex-shrink-0">
          <img
            src={
              studentData.avatar ||
              `https://ui-avatars.com/api/?name=${studentData.name || "Student"}&background=3b82f6&color=fff`
            }
            alt={studentData.name || "Student"}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div
            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
              studentData.status === "active" ? "bg-green-500" : "bg-gray-400"
            }`}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="text-sm font-medium text-gray-900 truncate">{studentData.name || "Unknown Student"}</h4>
            <Badge color={getStatusColor(studentData.status)}>{studentData.status || "inactive"}</Badge>
          </div>
          <p className="text-sm text-gray-600 truncate mb-2">{studentData.email || "No email"}</p>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <BookOpen className="w-3 h-3" />
              <span>{studentData.coursesEnrolled || 0} courses</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{studentData.lastActive || "Never"}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3" />
              <span>{studentData.rating || 0}/5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex justify-between md:justify-end items-center space-x-6 w-full md:w-1/3">
        <div className="text-right w-1/2">
          <div className="text-sm font-medium text-gray-900">{studentData.progress || 0}% Complete</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div
              className={`h-2 rounded-full ${getProgressColor(studentData.progress || 0)}`}
              style={{ width: `${studentData.progress || 0}%` }}
            />
          </div>
        </div>

        <div className="text-right w-1/2">
          <div className="text-sm font-medium text-gray-900">${studentData.totalSpent || 0}</div>
          <div
            className={`flex items-center justify-end text-xs ${
              studentData.revenueGrowth >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            <TrendingUp className="w-3 h-3 mr-1" />
            {studentData.revenueGrowth || 0}%
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const StudentsList = () => {
  return (
    <div className="space-y-4 px-4 sm:px-6 lg:px-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Students Overview</h2>
      {dummyStudents.map((student, index) => (
        <StudentCard key={student.id} student={student} index={index} />
      ))}
    </div>
  );
};

export { StudentCard, StudentsList };
export default StudentCard;
