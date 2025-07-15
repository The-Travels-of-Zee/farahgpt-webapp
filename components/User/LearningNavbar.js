"use client";
import { useState } from "react";
import Link from "next/link";
import { Crown } from "lucide-react";

const LearningNavbar = () => {
  const [activeTab, setActiveTab] = useState("All courses");
  const tabs = ["All courses", "Archived"];

  return (
    <div className="flex items-center justify-between bg-gradient-to-r from-(--primary-light) to-secondary text-white px-4 py-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold">
        <Link href="/learning">My Learning</Link>
      </h1>
      <span className="bg-gradient-to-r max-w-min from-yellow-400 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-sm">
        <Crown className="w-3 h-3 mr-1" />
        Premium
      </span>
      {/* <nav className="flex flex-wrap gap-x-6 gap-y-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-1 px-1 text-sm sm:text-base transition-colors duration-200 ${
              activeTab === tab ? "text-white border-b-2 border-white" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav> */}
    </div>
  );
};

export default LearningNavbar;
