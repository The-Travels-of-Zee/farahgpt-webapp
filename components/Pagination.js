import { useState, useMemo } from "react";
import { Search, Filter, X, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

// Pagination Component
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  onItemsPerPageChange,
  showItemsPerPage = true,
}) => {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4 py-4 bg-white border-t border-gray-200 text-sm">
      <div className="flex flex-col sm:flex-row items-center gap-3 text-gray-600">
        <span className="text-center sm:text-left">
          Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of <strong>{totalItems}</strong> results
        </span>

        {showItemsPerPage && (
          <div className="flex items-center gap-2">
            <label htmlFor="itemsPerPage" className="text-gray-500">
              Show:
            </label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              {[5, 10, 20, 50].map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center flex-wrap gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="flex items-center px-3 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </button>

        {visiblePages.map((page, index) => (
          <button
            key={index}
            onClick={() => page !== "..." && onPageChange(page)}
            disabled={page === "..."}
            aria-current={page === currentPage ? "page" : undefined}
            className={`min-w-[36px] px-3 py-2 text-sm font-medium border border-gray-300 transition rounded-md ${
              page === currentPage
                ? "bg-blue-600 text-white border-blue-600"
                : page === "..."
                ? "text-gray-400 cursor-default"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className="flex items-center px-3 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;

// Advanced Filtering Component
const AdvancedFilter = ({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  sortOptions = [],
  filters = [],
  onFilterChange,
  onClearFilters,
  activeFiltersCount = 0,
  showAdvanced = false,
  onToggleAdvanced,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      {/* Search and Sort Row */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        {/* Search */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Sort */}
        {sortOptions.length > 0 && (
          <div className="sm:w-48">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Advanced Toggle */}
        {filters.length > 0 && (
          <button
            onClick={onToggleAdvanced}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {activeFiltersCount}
              </span>
            )}
            <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && filters.length > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filters.map((filter) => (
              <div key={filter.key} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">{filter.label}</label>

                {filter.type === "select" && (
                  <select
                    value={filter.value}
                    onChange={(e) => onFilterChange(filter.key, e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {filter.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}

                {filter.type === "range" && (
                  <div className="space-y-2">
                    <input
                      type="range"
                      min={filter.min}
                      max={filter.max}
                      value={filter.value}
                      onChange={(e) => onFilterChange(filter.key, Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{filter.min}</span>
                      <span className="font-medium">{filter.value}</span>
                      <span>{filter.max}</span>
                    </div>
                  </div>
                )}

                {filter.type === "price-range" && (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filter.value[0]}
                        onChange={(e) => onFilterChange(filter.key, [Number(e.target.value), filter.value[1]])}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filter.value[1]}
                        onChange={(e) => onFilterChange(filter.key, [filter.value[0], Number(e.target.value)])}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={onClearFilters}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100"
              >
                <X className="w-4 h-4" />
                Clear all filters ({activeFiltersCount})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Main Hook for Filtering and Pagination
const useFilteredData = (data, config) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState(config.defaultSort || "");
  const [filters, setFilters] = useState(config.defaultFilters || {});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(config.defaultItemsPerPage || 10);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter((item) => {
      // Search filter
      if (searchTerm && config.searchFields) {
        const matchesSearch = config.searchFields.some((field) =>
          item[field]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (!matchesSearch) return false;
      }

      // Custom filters
      if (config.customFilters) {
        for (const [key, filterFn] of Object.entries(config.customFilters)) {
          if (filters[key] !== undefined && filters[key] !== "" && filters[key] !== "all") {
            if (!filterFn(item, filters[key])) return false;
          }
        }
      }

      return true;
    });

    // Sort data
    if (sortBy && config.sortOptions) {
      const sortOption = config.sortOptions.find((opt) => opt.value === sortBy);
      if (sortOption && sortOption.sortFn) {
        filtered.sort(sortOption.sortFn);
      }
    }

    return filtered;
  }, [data, searchTerm, sortBy, filters, config]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const paginatedData = filteredAndSortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset to first page when filters change
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSortBy(config.defaultSort || "");
    setFilters(config.defaultFilters || {});
    setCurrentPage(1);
  };

  const activeFiltersCount = [
    searchTerm ? 1 : 0,
    ...Object.entries(filters).map(([key, value]) => {
      if (value === "" || value === "all" || value === undefined) return 0;
      return 1;
    }),
  ].reduce((sum, count) => sum + count, 0);

  return {
    // Data
    filteredData: filteredAndSortedData,
    paginatedData,

    // Search & Sort
    searchTerm,
    sortBy,
    handleSearchChange,
    handleSortChange,

    // Filters
    filters,
    handleFilterChange,
    clearFilters,
    activeFiltersCount,
    showAdvanced,
    setShowAdvanced,

    // Pagination
    currentPage,
    totalPages,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage: (value) => {
      setItemsPerPage(value);
      setCurrentPage(1);
    },

    // Stats
    totalItems: data.length,
    filteredCount: filteredAndSortedData.length,
  };
};

// Complete Filter and Pagination Component
const FilteredDataView = ({ data = [], config, renderItem, renderEmpty, className = "" }) => {
  const {
    paginatedData,
    searchTerm,
    sortBy,
    handleSearchChange,
    handleSortChange,
    filters,
    handleFilterChange,
    clearFilters,
    activeFiltersCount,
    showAdvanced,
    setShowAdvanced,
    currentPage,
    totalPages,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage,
    totalItems,
    filteredCount,
  } = useFilteredData(data, config);

  return (
    <div className={className}>
      {/* Filters */}
      <AdvancedFilter
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        sortOptions={config.sortOptions || []}
        filters={config.filterComponents || []}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        activeFiltersCount={activeFiltersCount}
        showAdvanced={showAdvanced}
        onToggleAdvanced={() => setShowAdvanced(!showAdvanced)}
      />

      {/* Results */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {paginatedData.length > 0 ? (
          <>
            <div className="divide-y divide-gray-200">
              {paginatedData.map((item, index) => renderItem(item, index))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredCount}
              onItemsPerPageChange={setItemsPerPage}
            />
          </>
        ) : renderEmpty ? (
          renderEmpty()
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No items found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export { Pagination, AdvancedFilter, useFilteredData, FilteredDataView };
