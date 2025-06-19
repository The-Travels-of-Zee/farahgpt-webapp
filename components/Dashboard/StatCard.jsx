import { motion } from "@/lib/motion";
import {
  Users,
  DollarSign,
  BookOpen,
  TrendingUp,
  Star,
  Clock,
  Award,
  Target,
  BarChart3,
  CreditCard,
  UserCheck,
  Calendar,
} from "lucide-react";

const StatCard = ({ title, value, change, icon: Icon, color, index = 0 }) => {
  // Default values in case props are undefined
  const cardTitle = title || "No Title";
  const cardValue = value || "0";
  const cardChange = change || "0%";
  const CardIcon = Icon || TrendingUp; // Default icon
  const cardColor = color || "blue";

  const colorClasses = {
    green: "text-green-600 bg-green-50",
    blue: "text-blue-600 bg-blue-50",
    orange: "text-orange-600 bg-orange-50",
    purple: "text-purple-600 bg-purple-50",
    red: "text-red-600 bg-red-50",
    yellow: "text-yellow-600 bg-yellow-50",
    indigo: "text-indigo-600 bg-indigo-50",
    pink: "text-pink-600 bg-pink-50",
  };

  const getChangeColor = (changeValue) => {
    if (typeof changeValue !== "string") return "text-gray-600";
    if (changeValue.includes("+")) return "text-green-600";
    if (changeValue.includes("-")) return "text-red-600";
    return "text-gray-600";
  };

  return (
    <motion.div
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{cardTitle}</p>
          <p className="text-2xl font-bold text-gray-900 mb-1">{cardValue}</p>
          <p className={`text-sm ${getChangeColor(cardChange)}`}>{cardChange}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[cardColor] || colorClasses.blue}`}>
          <CardIcon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
};

// Dummy data for testing
export const dummyStats = [
  {
    id: 1,
    title: "Total Students",
    value: "2,847",
    change: "+12.5% from last month",
    icon: Users,
    color: "blue",
  },
  {
    id: 2,
    title: "Monthly Revenue",
    value: "$24,680",
    change: "+8.2% from last month",
    icon: DollarSign,
    color: "green",
  },
  {
    id: 3,
    title: "Active Courses",
    value: "43",
    change: "+3 new courses",
    icon: BookOpen,
    color: "purple",
  },
  {
    id: 4,
    title: "Course Completion Rate",
    value: "78.3%",
    change: "+2.1% improvement",
    icon: TrendingUp,
    color: "orange",
  },
  {
    id: 5,
    title: "Average Rating",
    value: "4.7",
    change: "+0.2 from last month",
    icon: Star,
    color: "yellow",
  },
  {
    id: 6,
    title: "Study Hours",
    value: "15,240",
    change: "+18.7% increase",
    icon: Clock,
    color: "indigo",
  },
  {
    id: 7,
    title: "Certificates Issued",
    value: "1,923",
    change: "+15.3% this month",
    icon: Award,
    color: "pink",
  },
  {
    id: 8,
    title: "Conversion Rate",
    value: "12.4%",
    change: "-1.2% from last month",
    icon: Target,
    color: "red",
  },
  {
    id: 9,
    title: "Monthly Signups",
    value: "456",
    change: "+23.8% increase",
    icon: UserCheck,
    color: "green",
  },
  {
    id: 10,
    title: "Refund Rate",
    value: "3.2%",
    change: "-0.8% improvement",
    icon: CreditCard,
    color: "red",
  },
  {
    id: 11,
    title: "Engagement Score",
    value: "85.6%",
    change: "+4.3% improvement",
    icon: BarChart3,
    color: "blue",
  },
  {
    id: 12,
    title: "Upcoming Events",
    value: "12",
    change: "Next: Tomorrow",
    icon: Calendar,
    color: "purple",
  },
];

// Example usage components
const StatsGrid = ({ stats = dummyStats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard
          key={stat.id}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          icon={stat.icon}
          color={stat.color}
          index={index}
        />
      ))}
    </div>
  );
};

const QuickStats = () => {
  // Just the main 4 stats for a quick overview
  const mainStats = dummyStats.slice(0, 4);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Analytics Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat, index) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            color={stat.color}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

const DetailedStats = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Detailed Analytics</h2>
        <div className="text-sm text-gray-500">Last updated: 2 hours ago</div>
      </div>
      <StatsGrid />
    </div>
  );
};

// Individual category stats
const RevenueStats = () => {
  const revenueStats = [
    dummyStats[1], // Monthly Revenue
    dummyStats[8], // Monthly Signups
    dummyStats[7], // Conversion Rate
    dummyStats[9], // Refund Rate
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Revenue Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {revenueStats.map((stat, index) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            color={stat.color}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

const StudentStats = () => {
  const studentStats = [
    dummyStats[0], // Total Students
    dummyStats[3], // Course Completion Rate
    dummyStats[4], // Average Rating
    dummyStats[5], // Study Hours
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Student Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {studentStats.map((stat, index) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            color={stat.color}
            index={index}
          />
        ))}
        <DetailedStats />
      </div>
    </div>
  );
};

export { StatCard, StatsGrid, QuickStats, DetailedStats, RevenueStats, StudentStats };
export default StatCard;
