import { BookOpen, Search, X } from "lucide-react";
import Button from "./Button";

const CoursesEmptyState = ({ hasFilters, onClearFilters }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
    <div className="text-center">
      <div className="text-gray-400 mb-4">
        {hasFilters ? <Search className="w-16 h-16 mx-auto" /> : <BookOpen className="w-16 h-16 mx-auto" />}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {hasFilters ? "No courses found" : "No courses available"}
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {hasFilters
          ? "Try adjusting your search terms or filters to find what you're looking for."
          : "There are no courses available at the moment. Please check back later."}
      </p>
      {hasFilters && (
        <Button variant="outline" onClick={onClearFilters} className="flex items-center gap-2">
          <X className="w-4 h-4" />
          Clear All Filters
        </Button>
      )}
    </div>
  </div>
);

export default CoursesEmptyState;
