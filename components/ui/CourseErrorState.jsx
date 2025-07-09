import { AlertCircle, RefreshCw } from "lucide-react";
import Button from "./Button";

// Error component for course fetching
const CourseErrorState = ({ error, onRetry }) => (
  <div className="bg-white rounded-lg shadow-sm border border-red-200 p-8">
    <div className="text-center">
      <div className="text-red-500 mb-4">
        <AlertCircle className="w-16 h-16 mx-auto" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Courses</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={onRetry} className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      </div>
    </div>
  </div>
);

export default CourseErrorState;
