import { motion } from "@/lib/motion";
import { Target, CheckCircle } from "lucide-react";

const StreakTracker = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Start a weekly streak</h2>
          <p className="text-gray-600">Let's chip away at your learning goals.</p>
        </div>

        <div className="flex items-center space-x-8">
          <div className="text-center">
            <div className="flex items-center text-gray-400 mb-1">
              <Target className="w-4 h-4 mr-1" />
              <span className="text-2xl font-bold">0</span>
              <span className="text-sm ml-1">weeks</span>
            </div>
            <p className="text-sm text-gray-500">Current streak</p>
          </div>

          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-green-500 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center text-orange-500 mb-1">
              <span className="text-sm">●</span>
              <span className="ml-1 text-sm font-medium">0/30 course min</span>
            </div>
            <div className="flex items-center text-green-500 mb-1">
              <span className="text-sm">●</span>
              <span className="ml-1 text-sm font-medium">1/1 visit</span>
            </div>
            <p className="text-sm text-gray-500">Jun 15 - 21</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StreakTracker;
