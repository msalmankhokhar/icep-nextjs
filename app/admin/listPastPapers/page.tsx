"use client";
import { AdminPastPaper } from "@/utils/pastPapersAdminTypes";
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
  LuBookOpen,
  LuGraduationCap,
} from "react-icons/lu";

export default function ListPastPapers() {
  const [pastPapers, setPastPapers] = useState<AdminPastPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSubjectType, setSelectedSubjectType] = useState("");
  const [sortField, setSortField] =
    useState<keyof AdminPastPaper>("uploadDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch past papers data
  useEffect(() => {
    const fetchPastPapers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/pastPapers");
        const result = await response.json();

        if (result.success) {
          // Convert ISO date strings back to Date objects
          const papersWithDates = result.data.map((paper: any) => ({
            ...paper,
            uploadDate: new Date(paper.uploadDate),
          }));
          setPastPapers(papersWithDates);
        } else {
          setError(result.error || "Failed to fetch past papers");
        }
      } catch (err) {
        setError("Failed to fetch past papers");
        console.error("Error fetching past papers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPastPapers();
  }, []);

  // Get unique values for filtering
  const examTypes = useMemo(() => {
    const uniqueExams = Array.from(new Set(pastPapers.map((p) => p.examType)));
    return uniqueExams.sort();
  }, [pastPapers]);

  const subjects = useMemo(() => {
    const filteredPapers = selectedExam
      ? pastPapers.filter((p) => p.examType === selectedExam)
      : pastPapers;
    const uniqueSubjects = Array.from(
      new Set(filteredPapers.map((p) => p.subject))
    );
    return uniqueSubjects.sort();
  }, [pastPapers, selectedExam]);

  const years = useMemo(() => {
    const uniqueYears = Array.from(new Set(pastPapers.map((p) => p.year)));
    return uniqueYears.sort((a, b) => parseInt(b) - parseInt(a));
  }, [pastPapers]);

  const subjectTypes = useMemo(() => {
    const uniqueTypes = Array.from(
      new Set(pastPapers.map((p) => p.subjectType))
    );
    return uniqueTypes.sort();
  }, [pastPapers]);

  // Filter and sort past papers
  const filteredAndSortedPapers = useMemo(() => {
    let filtered = pastPapers.filter((paper) => {
      const matchesSearch =
        paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.examType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.year.includes(searchQuery) ||
        paper.yearRange.includes(searchQuery);
      const matchesExam = !selectedExam || paper.examType === selectedExam;
      const matchesSubject =
        !selectedSubject || paper.subject === selectedSubject;
      const matchesYear = !selectedYear || paper.year === selectedYear;
      const matchesSubjectType =
        !selectedSubjectType || paper.subjectType === selectedSubjectType;

      return (
        matchesSearch &&
        matchesExam &&
        matchesSubject &&
        matchesYear &&
        matchesSubjectType
      );
    });

    // Sort papers
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === "uploadDate") {
        aValue = a.uploadDate.getTime();
        bValue = b.uploadDate.getTime();
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [
    pastPapers,
    searchQuery,
    selectedExam,
    selectedSubject,
    selectedYear,
    selectedSubjectType,
    sortField,
    sortDirection,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedPapers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPapers = filteredAndSortedPapers.slice(startIndex, endIndex);

  // Handle sorting
  const handleSort = (field: keyof AdminPastPaper) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
    setCurrentPage(1);
  };

  // Handle filters
  const handleExamChange = (exam: string) => {
    setSelectedExam(exam);
    setSelectedSubject("");
    setCurrentPage(1);
  };

  const handleSubjectChange = (subject: string) => {
    setSelectedSubject(subject);
    setCurrentPage(1);
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    setCurrentPage(1);
  };

  const handleSubjectTypeChange = (type: string) => {
    setSelectedSubjectType(type);
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
  const handleView = (paper: AdminPastPaper) => {
    window.open(paper.fileUrl, "_blank");
  };

  const handleEdit = (paper: AdminPastPaper) => {
    // TODO: Implement edit functionality
    console.log("Edit past paper:", paper.id);
  };

  const handleDelete = async (paper: AdminPastPaper) => {
    if (confirm(`Are you sure you want to delete "${paper.title}"?`)) {
      try {
        const response = await fetch(`/api/pastPapers?id=${paper.id}`, {
          method: "DELETE",
        });

        const result = await response.json();

        if (result.success) {
          // Remove the paper from the local state
          setPastPapers((prevPapers) =>
            prevPapers.filter((p) => p.id !== paper.id)
          );

          // Show detailed success message
          const { fileDeleted, blobDeleted } = result.data;
          let message = `Past paper "${paper.title}" deleted successfully!`;

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
          alert(`Error deleting past paper: ${result.message || result.error}`);
        }
      } catch (error) {
        console.error("Error deleting past paper:", error);
        alert("Failed to delete past paper. Please try again.");
      }
    }
  };

  const handleDownload = (paper: AdminPastPaper) => {
    const link = document.createElement("a");
    link.href = paper.fileUrl;
    link.download = paper.title + ".pdf";
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
            <p className="mt-2 text-sm text-gray-600">Loading past papers...</p>
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
              Error Loading Past Papers
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
              Past Papers Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and organize your past papers collection
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {filteredAndSortedPapers.length} past paper
              {filteredAndSortedPapers.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Search Past Papers
            </label>
            <div className="relative">
              <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                id="search"
                type="text"
                placeholder="Search by title, subject, exam type..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              />
            </div>
          </div>

          {/* Exam Type Filter */}
          <div>
            <label
              htmlFor="exam-filter"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Exam Type
            </label>
            <select
              id="exam-filter"
              value={selectedExam}
              onChange={(e) => handleExamChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            >
              <option value="">All Exams</option>
              {examTypes.map((exam) => (
                <option key={exam} value={exam}>
                  {exam}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Filter */}
          <div>
            <label
              htmlFor="subject-filter"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Subject
            </label>
            <select
              id="subject-filter"
              value={selectedSubject}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              disabled={!selectedExam}
            >
              <option value="">All Subjects</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <label
              htmlFor="year-filter"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Year
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

          {/* Subject Type Filter */}
          <div>
            <label
              htmlFor="subject-type-filter"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Type
            </label>
            <select
              id="subject-type-filter"
              value={selectedSubjectType}
              onChange={(e) => handleSubjectTypeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            >
              <option value="">All Types</option>
              {subjectTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Past Papers Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {currentPapers.length === 0 ? (
          <div className="text-center py-12">
            <LuFileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No past papers found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ||
              selectedExam ||
              selectedSubject ||
              selectedYear ||
              selectedSubjectType
                ? "Try adjusting your search or filter criteria."
                : "Get started by adding your first past paper."}
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
                        className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 min-w-[100px]"
                        onClick={() => handleSort("examType")}
                      >
                        <div className="flex items-center gap-2">
                          Exam
                          {sortField === "examType" &&
                            (sortDirection === "asc" ? (
                              <LuChevronUp className="w-4 h-4" />
                            ) : (
                              <LuChevronDown className="w-4 h-4" />
                            ))}
                        </div>
                      </th>
                      <th
                        className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 min-w-[150px]"
                        onClick={() => handleSort("subject")}
                      >
                        <div className="flex items-center gap-2">
                          Subject
                          {sortField === "subject" &&
                            (sortDirection === "asc" ? (
                              <LuChevronUp className="w-4 h-4" />
                            ) : (
                              <LuChevronDown className="w-4 h-4" />
                            ))}
                        </div>
                      </th>
                      <th
                        className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 min-w-[100px]"
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
                        onClick={() => handleSort("subjectType")}
                      >
                        <div className="flex items-center gap-2">
                          Type
                          {sortField === "subjectType" &&
                            (sortDirection === "asc" ? (
                              <LuChevronUp className="w-4 h-4" />
                            ) : (
                              <LuChevronDown className="w-4 h-4" />
                            ))}
                        </div>
                      </th>
                      <th
                        className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 min-w-[120px]"
                        onClick={() => handleSort("uploadDate")}
                      >
                        <div className="flex items-center gap-2">
                          Upload Date
                          {sortField === "uploadDate" &&
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
                    {currentPapers.map((paper) => (
                      <tr key={paper.id} className="hover:bg-gray-50">
                        <td className="px-3 sm:px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 truncate max-w-[180px] sm:max-w-none">
                            {paper.title}
                          </div>
                          {paper.description && (
                            <div className="text-sm text-gray-500 truncate max-w-[180px] sm:max-w-none">
                              {paper.description}
                            </div>
                          )}
                        </td>
                        <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              paper.examType === "CSS"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {paper.examType}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">
                          {paper.subject}
                        </td>
                        <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">
                          {paper.yearRange}
                        </td>
                        <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              paper.subjectType === "compulsory"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-orange-100 text-orange-800"
                            }`}
                          >
                            {paper.subjectType.charAt(0).toUpperCase() +
                              paper.subjectType.slice(1)}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">
                          {formatDate(paper.uploadDate)}
                        </td>
                        <td className="px-3 sm:px-6 py-4 text-sm font-medium">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <button
                              onClick={() => handleView(paper)}
                              className="text-brand-blue hover:text-brand-blue/80 p-1 rounded"
                              aria-label="View past paper"
                            >
                              <LuEye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDownload(paper)}
                              className="text-green-600 hover:text-green-700 p-1 rounded"
                              aria-label="Download past paper"
                            >
                              <LuDownload className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(paper)}
                              className="text-yellow-600 hover:text-yellow-700 p-1 rounded"
                              aria-label="Edit past paper"
                            >
                              <LuPencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(paper)}
                              className="text-red-600 hover:text-red-700 p-1 rounded"
                              aria-label="Delete past paper"
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
              {currentPapers.map((paper) => (
                <div
                  key={paper.id}
                  className="p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {paper.title}
                      </h3>
                      {paper.description && (
                        <p
                          className="text-sm text-gray-500 mt-1 overflow-hidden text-ellipsis"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {paper.description}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            paper.examType === "CSS"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {paper.examType}
                        </span>
                        <span className="flex items-center gap-1">
                          <LuBookOpen className="w-3 h-3 flex-shrink-0" />
                          {paper.subject}
                        </span>
                        <span className="flex-shrink-0">{paper.yearRange}</span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            paper.subjectType === "compulsory"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {paper.subjectType.charAt(0).toUpperCase() +
                            paper.subjectType.slice(1)}
                        </span>
                        <span className="flex items-center gap-1">
                          <LuCalendar className="w-3 h-3 flex-shrink-0" />
                          {formatDate(paper.uploadDate)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center sm:justify-end gap-1 sm:gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleView(paper)}
                        className="text-brand-blue hover:text-brand-blue/80 p-2 rounded transition-colors"
                        aria-label="View past paper"
                      >
                        <LuEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(paper)}
                        className="text-green-600 hover:text-green-700 p-2 rounded transition-colors"
                        aria-label="Download past paper"
                      >
                        <LuDownload className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(paper)}
                        className="text-yellow-600 hover:text-yellow-700 p-2 rounded transition-colors"
                        aria-label="Edit past paper"
                      >
                        <LuPencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(paper)}
                        className="text-red-600 hover:text-red-700 p-2 rounded transition-colors"
                        aria-label="Delete past paper"
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
            {Math.min(endIndex, filteredAndSortedPapers.length)} of{" "}
            {filteredAndSortedPapers.length} results
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
