"use client";
import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import Button from "@/components/ui/Button";

export const FilterBar = ({ searchQuery, setSearchQuery, filters, setFilters }) => {
  const FilterDropdown = ({ label, value, options, placeholder, onChange, showClear = true }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (selectedValue) => {
      onChange(selectedValue);
      setIsOpen(false);
    };

    const handleClear = () => {
      onChange("");
      setIsOpen(false);
    };

    const displayValue = value || placeholder;
    const isActive = Boolean(value);

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-between gap-2 px-4 py-2 border rounded-md min-w-[140px] text-left transition-colors ${
            isActive
              ? "border-emerald-700 bg-(--primary-light)/10 text-emerald-700"
              : "border-primary text-primary hover:bg-primary/5"
          }`}
        >
          <span className="truncate">{displayValue}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <div className="absolute left-0 top-full mt-1 w-full min-w-[200px] bg-white border border-gray-200 rounded-md shadow-lg z-20 py-1">
              {showClear && value && (
                <>
                  <button
                    onClick={handleClear}
                    className="w-full text-left px-4 py-2 text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    Clear {label}
                  </button>
                  <div className="border-t border-gray-100 my-1" />
                </>
              )}
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={`w-full text-left px-4 py-2 transition-colors ${
                    value === option ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  const handleReset = () => {
    setFilters({
      sort: "Recently Accessed",
      categories: "",
      progress: "",
      instructor: "",
    });
  };

  const hasActiveFilters = filters.categories || filters.progress || filters.instructor;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900 whitespace-nowrap">Sort by:</span>
          <FilterDropdown
            label="Sort"
            value={filters.sort}
            options={["Recently Accessed", "A-Z", "Z-A", "Date Added"]}
            placeholder="Recently Accessed"
            onChange={(value) => setFilters((prev) => ({ ...prev, sort: value }))}
            showClear={false}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-900 whitespace-nowrap">Filter by:</span>

          <FilterDropdown
            label="Category"
            value={filters.categories}
            options={["Design", "Development", "Programming", "Business", "Marketing"]}
            placeholder="All Categories"
            onChange={(value) => setFilters((prev) => ({ ...prev, categories: value }))}
          />

          <FilterDropdown
            label="Progress"
            value={filters.progress}
            options={["Not Started", "In Progress", "Completed"]}
            placeholder="All Progress"
            onChange={(value) => setFilters((prev) => ({ ...prev, progress: value }))}
          />

          <FilterDropdown
            label="Instructor"
            value={filters.instructor}
            options={[
              "Shaykh Muhammad Alshareef (rahimaullah)",
              "Ustadh Nouman Ali Khan",
              "Ustadh Yasir Qadhi",
              "Ustadh Omar Suleiman",
              "Sheikh Assim Al Hakeem",
            ]}
            placeholder="All Instructors"
            onChange={(value) => setFilters((prev) => ({ ...prev, instructor: value }))}
          />

          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="text-sm text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-900">Active filters:</span>
          {filters.categories && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-sm rounded-md">
              Category: {filters.categories}
              <button
                onClick={() => setFilters((prev) => ({ ...prev, categories: "" }))}
                className="hover:text-primary/70"
              >
                ×
              </button>
            </span>
          )}
          {filters.progress && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-sm rounded-md">
              Progress: {filters.progress}
              <button
                onClick={() => setFilters((prev) => ({ ...prev, progress: "" }))}
                className="hover:text-primary/70"
              >
                ×
              </button>
            </span>
          )}
          {filters.instructor && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-sm rounded-md">
              Instructor: {filters.instructor}
              <button
                onClick={() => setFilters((prev) => ({ ...prev, instructor: "" }))}
                className="hover:text-primary/70"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-end gap-2 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery || ""}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
          />
        </div>
        <Button variant="gradientGreen" className="flex items-center justify-center">
          <Search className="w-4 h-6" />
        </Button>
      </div>
    </div>
  );
};
