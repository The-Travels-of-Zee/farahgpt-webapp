// Loading component for courses
export const CourseLoadingState = () => (
  <div className="space-y-6">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="flex space-x-4">
            <div className="h-32 w-48 bg-gray-200 rounded-lg"></div>
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="flex space-x-4 mt-4">
                <div className="h-8 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default CourseLoadingState