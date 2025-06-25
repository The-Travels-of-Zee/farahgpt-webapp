"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const EarningsChart = () => {
  const [chartType, setChartType] = useState("line");
  const [timeframe, setTimeframe] = useState("6months");

  const earningsData = {
    "6months": [
      { month: "Jan", earnings: 2400, courses: 12 },
      { month: "Feb", earnings: 1800, courses: 15 },
      { month: "Mar", earnings: 3200, courses: 18 },
      { month: "Apr", earnings: 2800, courses: 20 },
      { month: "May", earnings: 3800, courses: 22 },
      { month: "Jun", earnings: 4200, courses: 25 },
    ],
    "12months": [
      { month: "Jul 23", earnings: 1200, courses: 8 },
      { month: "Aug 23", earnings: 1800, courses: 10 },
      { month: "Sep 23", earnings: 1600, courses: 11 },
      { month: "Oct 23", earnings: 2200, courses: 13 },
      { month: "Nov 23", earnings: 1900, courses: 12 },
      { month: "Dec 23", earnings: 2800, courses: 15 },
      { month: "Jan 24", earnings: 2400, courses: 12 },
      { month: "Feb 24", earnings: 1800, courses: 15 },
      { month: "Mar 24", earnings: 3200, courses: 18 },
      { month: "Apr 24", earnings: 2800, courses: 20 },
      { month: "May 24", earnings: 3800, courses: 22 },
      { month: "Jun 24", earnings: 4200, courses: 25 },
    ],
  };

  const currentData = earningsData[timeframe];

  return (
    <motion.div
      className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-4">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Earnings Overview</h3>
          <p className="text-sm text-gray-600">Track your monthly earnings performance</p>
        </div>
        <div className="flex flex-wrap gap-2 justify-end">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {["6months", "12months"].map((type) => (
              <button
                key={type}
                onClick={() => setTimeframe(type)}
                className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md transition-colors ${
                  timeframe === type ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {type === "6months" ? "6M" : "1Y"}
              </button>
            ))}
          </div>
          <div className="flex bg-gray-100 rounded-lg p-1">
            {["line", "bar"].map((type) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md transition-colors ${
                  chartType === type ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full h-64 sm:h-80 md:h-[22rem] lg:h-[26rem]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "line" ? (
            <LineChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value, name) => [`$${value}`, name === "earnings" ? "Earnings" : "Courses"]}
              />
              <Line
                type="monotone"
                dataKey="earnings"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                activeDot={{
                  r: 6,
                  stroke: "#3b82f6",
                  strokeWidth: 2,
                  fill: "white",
                }}
              />
            </LineChart>
          ) : (
            <BarChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value) => [`$${value}`, "Earnings"]}
              />
              <Bar dataKey="earnings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default EarningsChart;
