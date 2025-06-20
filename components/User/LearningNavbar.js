"use client";
import { useState } from "react";
import Link from "next/link";

const LearningNavbar = () => {
  const [activeTab, setActiveTab] = useState("All courses");
  const tabs = ["All courses", "Wishlist", "Archived"];

  return (
    <div className="bg-slate-900 text-white px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8">
        <Link href="/learning">My Learning</Link>
      </h1>
      <nav className="flex flex-wrap gap-x-6 gap-y-3">
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
      </nav>
    </div>
  );
};

export default LearningNavbar;
