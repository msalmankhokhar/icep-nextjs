"use client";
import { Magazine } from "@/utils/magazinesTypes";
import React, { useState, useMemo, useEffect } from "react";
import {
  LuSearch,
  LuEye,
  LuPencil,
  LuTrash2,
  LuDownload,
  LuCalendar,
  LuFileText,
  LuChevronLeft,
  LuChevronRight,
  LuChevronUp,
  LuChevronDown,
  LuLoader,
} from "react-icons/lu";

export default function ListMagazines() {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [sortField, setSortField] = useState<keyof Magazine>("publishDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch magazines data
  useEffect(() => {
    const fetchMagazines = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/magazines");
        const result = await response.json();

        if (result.success) {
          // Convert ISO date strings back to Date objects
          const magazinesWithDates = result.data.map(
            (magazine: Record<string, unknown>) => ({
              ...magazine,
              publishDate: new Date(magazine.publishDate as string),
            })
          );
          setMagazines(magazinesWithDates);
        } else {
          setError(result.error || "Failed to fetch magazines");
        }
      } catch (err) {
        setError("Failed to fetch magazines");
        console.error("Error fetching magazines:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMagazines();
  }, []);

  // Get unique years and months for filtering
  const years = useMemo(() => {
    const uniqueYears = Array.from(new Set(magazines.map((m) => m.year)));
    return uniqueYears.sort((a, b) => parseInt(b) - parseInt(a));
  }, [magazines]);

  const months = useMemo(() => {
    const uniqueMonths = Array.from(new Set(magazines.map((m) => m.month)));
    return uniqueMonths.sort((a, b) => {
      const monthNames = [
        "january",
        "february",
        "march",
        "april",
        "may",
        "june",
        "july",
        "august",
        "september",
        "october",
        "november",
        "december",
      ];
      return (
        monthNames.indexOf(a.toLowerCase()) -
        monthNames.indexOf(b.toLowerCase())
      );
    });
  }, [magazines]);

  // Filter and sort magazines
  const filteredAndSortedMagazines = useMemo(() => {
    const filtered = magazines.filter((magazine) => {
      const matchesSearch =
        magazine.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        magazine.year.includes(searchQuery) ||
        magazine.month.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesYear = !selectedYear || magazine.year === selectedYear;
      const matchesMonth = !selectedMonth || magazine.month === selectedMonth;

      return matchesSearch && matchesYear && matchesMonth;
    });

    // Sort magazines
    filtered.sort((a, b) => {
      let aValue: string | number = a[sortField as keyof Magazine] as
        | string
        | number;
      let bValue: string | number = b[sortField as keyof Magazine] as
        | string
        | number;
      if (sortField === "publishDate") {
        aValue = a.publishDate.getTime();
        bValue = b.publishDate.getTime();
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [
    magazines,
    searchQuery,
    selectedYear,
    selectedMonth,
    sortField,
    sortDirection,
  ]);

  // Pagination
  const totalPages = Math.ceil(
    filteredAndSortedMagazines.length / itemsPerPage
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMagazines = filteredAndSortedMagazines.slice(
    startIndex,
    endIndex
  );

  // Handle sorting
  const handleSort = (field: keyof Magazine) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
    setCurrentPage(1);
  };

  // Handle filters
  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    setSelectedMonth("");
    setCurrentPage(1);
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    setCurrentPage(1);
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Handle actions
  const handleView = (magazine: Magazine) => {
    window.open(magazine.fileUrl, "_blank");
  };

  const handleEdit = (magazine: Magazine) => {
    // TODO: Implement edit functionality
    console.log("Edit magazine:", magazine.id);
  };

  const handleDelete = async (magazine: Magazine) => {
    if (confirm(`Are you sure you want to delete "${magazine.title}"?`)) {
      try {
        const response = await fetch(`/api/magazines?id=${magazine.id}`, {
          method: "DELETE",
        });

        const result = await response.json();

        if (result.success) {
          // Remove the magazine from the local state
          setMagazines((prevMagazines) =>
            prevMagazines.filter((mag) => mag.id !== magazine.id)
          );

          // Show detailed success message
          const { fileDeleted, blobDeleted } = result.data;
          let message = `Magazine "${magazine.title}" deleted successfully!`;

          if (fileDeleted && blobDeleted) {
            message +=
              "\n\n✓ File deleted from local storage\n✓ File deleted from Vercel Blob storage";
          } else if (fileDeleted) {
            message += "\n\n✓ File deleted from local storage";
          } else if (blobDeleted) {
            message += "\n\n✓ File deleted from Vercel Blob storage";
          } else {
            message += "\n\n⚠ File may still exist in storage";
          }

          alert(message);
        } else {
          alert(`Error deleting magazine: ${result.message || result.error}`);
        }
      } catch (error) {
        console.error("Error deleting magazine:", error);
        alert("Failed to delete magazine. Please try again.");
      }
    }
  };

  const handleDownload = (magazine: Magazine) => {
    const link = document.createElement("a");
    link.href = magazine.fileUrl;
    link.download = magazine.title + ".pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] lg:ml-64 ml-16 bg-gray-50 p-4 lg:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center px-4">
            <LuLoader className="mx-auto h-8 w-8 animate-spin text-brand-blue" />
            <p className="mt-2 text-sm text-gray-600">Loading magazines...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] lg:ml-64 ml-16 bg-gray-50 p-4 lg:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center px-4">
            <div className="mx-auto h-12 w-12 text-red-500 mb-4">
              <LuFileText className="h-full w-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error Loading Magazines
            </h3>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-brand-blue text-white px-4 py-2 rounded-lg hover:bg-brand-blue/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] lg:ml-64 ml-16 bg-gray-50 p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Magazines Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and organize your magazine collection
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {filteredAndSortedMagazines.length} magazine
              {filteredAndSortedMagazines.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2 lg:col-span-2">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Search Magazines
            </label>
            <div className="relative">
              <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                id="search"
                type="text"
                placeholder="Search by title, year, or month..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              />
            </div>
          </div>

          {/* Year Filter */}
          <div>
            <label
              htmlFor="year-filter"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Filter by Year
            </label>
            <select
              id="year-filter"
              value={selectedYear}
              onChange={(e) => handleYearChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            >
              <option value="">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Month Filter */}
          <div>
            <label
              htmlFor="month-filter"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Filter by Month
            </label>
            <select
              id="month-filter"
              value={selectedMonth}
              onChange={(e) => handleMonthChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              disabled={!selectedYear}
            >
              <option value="">All Months</option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month.charAt(0).toUpperCase() + month.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Magazines Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {currentMagazines.length === 0 ? (
          <div className="text-center py-12">
            <LuFileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No magazines found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || selectedYear || selectedMonth
                ? "Try adjusting your search or filter criteria."
                : "Get started by adding your first magazine."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block">
              <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 min-w-[200px]"
                        onClick={() => handleSort("title")}
                      >
                        <div className="flex items-center gap-2">
                          Title
                          {sortField === "title" &&
                            (sortDirection === "asc" ? (
                              <LuChevronUp className="w-4 h-4" />
                            ) : (
                              <LuChevronDown className="w-4 h-4" />
                            ))}
                        </div>
                      </th>
                      <th
                        className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 min-w-[80px]"
                        onClick={() => handleSort("year")}
                      >
                        <div className="flex items-center gap-2">
                          Year
                          {sortField === "year" &&
                            (sortDirection === "asc" ? (
                              <LuChevronUp className="w-4 h-4" />
                            ) : (
                              <LuChevronDown className="w-4 h-4" />
                            ))}
                        </div>
                      </th>
                      <th
                        className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 min-w-[100px]"
                        onClick={() => handleSort("month")}
                      >
                        <div className="flex items-center gap-2">
                          Month
                          {sortField === "month" &&
                            (sortDirection === "asc" ? (
                              <LuChevronUp className="w-4 h-4" />
                            ) : (
                              <LuChevronDown className="w-4 h-4" />
                            ))}
                        </div>
                      </th>
                      <th
                        className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 min-w-[120px]"
                        onClick={() => handleSort("publishDate")}
                      >
                        <div className="flex items-center gap-2">
                          Published Date
                          {sortField === "publishDate" &&
                            (sortDirection === "asc" ? (
                              <LuChevronUp className="w-4 h-4" />
                            ) : (
                              <LuChevronDown className="w-4 h-4" />
                            ))}
                        </div>
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentMagazines.map((magazine) => (
                      <tr key={magazine.id} className="hover:bg-gray-50">
                        <td className="px-3 sm:px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 truncate max-w-[180px] sm:max-w-none">
                            {magazine.title}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-[180px] sm:max-w-none">
                            {magazine.description}
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">
                          {magazine.year}
                        </td>
                        <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">
                          {magazine.month.charAt(0).toUpperCase() +
                            magazine.month.slice(1)}
                        </td>
                        <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">
                          {formatDate(magazine.publishDate)}
                        </td>
                        <td className="px-3 sm:px-6 py-4 text-sm font-medium">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <button
                              onClick={() => handleView(magazine)}
                              className="text-brand-blue hover:text-brand-blue/80 p-1 rounded"
                              aria-label="View magazine"
                            >
                              <LuEye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDownload(magazine)}
                              className="text-green-600 hover:text-green-700 p-1 rounded"
                              aria-label="Download magazine"
                            >
                              <LuDownload className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(magazine)}
                              className="text-yellow-600 hover:text-yellow-700 p-1 rounded"
                              aria-label="Edit magazine"
                            >
                              <LuPencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(magazine)}
                              className="text-red-600 hover:text-red-700 p-1 rounded"
                              aria-label="Delete magazine"
                            >
                              <LuTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden">
              {currentMagazines.map((magazine) => (
                <div
                  key={magazine.id}
                  className="p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {magazine.title}
                      </h3>
                      <p
                        className="text-sm text-gray-500 mt-1 overflow-hidden text-ellipsis"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {magazine.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <LuCalendar className="w-3 h-3 flex-shrink-0" />
                          {magazine.year}
                        </span>
                        <span className="flex-shrink-0">
                          {magazine.month.charAt(0).toUpperCase() +
                            magazine.month.slice(1)}
                        </span>
                        <span className="flex-shrink-0">
                          {formatDate(magazine.publishDate)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center sm:justify-end gap-1 sm:gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleView(magazine)}
                        className="text-brand-blue hover:text-brand-blue/80 p-2 rounded transition-colors"
                        aria-label="View magazine"
                      >
                        <LuEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(magazine)}
                        className="text-green-600 hover:text-green-700 p-2 rounded transition-colors"
                        aria-label="Download magazine"
                      >
                        <LuDownload className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(magazine)}
                        className="text-yellow-600 hover:text-yellow-700 p-2 rounded transition-colors"
                        aria-label="Edit magazine"
                      >
                        <LuPencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(magazine)}
                        className="text-red-600 hover:text-red-700 p-2 rounded transition-colors"
                        aria-label="Delete magazine"
                      >
                        <LuTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-700 text-center sm:text-left">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, filteredAndSortedMagazines.length)} of{" "}
            {filteredAndSortedMagazines.length} results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LuChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg ${
                    currentPage === pageNum
                      ? "bg-brand-blue text-white"
                      : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LuChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
