"use client";
import React, { useState, useRef } from "react";
import {
  LuUpload,
  LuFileText,
  LuCheck,
  LuCircle,
  LuLoader,
} from "react-icons/lu";

interface FormData {
  title: string;
  subject: string;
  examType: "CSS" | "PMS";
  subjectType: "compulsory" | "optional";
  year: string;
  yearRange: string;
  description: string;
}

const initialFormData: FormData = {
  title: "",
  subject: "",
  examType: "CSS",
  subjectType: "compulsory",
  year: "",
  yearRange: "",
  description: "",
};

// Predefined subjects for each exam type
const subjects = {
  CSS: {
    compulsory: [
      "English Essay",
      "English (Precis & Composition)",
      "General Science & Ability",
      "Current Affairs",
      "Pakistan Affairs",
      "Islamic Studies",
    ],
    optional: [
      "Political Science",
      "Indo-Pak History",
      "International Relations",
      "Environmental Science",
      "Governance & Public Policies",
      "Economics",
      "Public Administration",
      "Geography",
      "Mathematics",
      "Statistics",
      "Urdu Essay & Composition",
      "General Knowledge",
      "Everyday Science",
      "Punjabi",
    ],
  },
  PMS: {
    compulsory: [
      "English Essay",
      "English (Precis & Composition)",
      "General Science & Ability",
      "Current Affairs",
      "Pakistan Affairs",
      "Islamic Studies",
    ],
    optional: [
      "Political Science",
      "Indo-Pak History",
      "International Relations",
      "Environmental Science",
      "Governance & Public Policies",
      "Economics",
      "Public Administration",
      "Geography",
      "Mathematics",
      "Statistics",
      "Urdu Essay & Composition",
      "General Knowledge",
      "Everyday Science",
    ],
  },
};

export default function AddPastPaper() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get available subjects based on selected exam type and subject type
  const availableSubjects = subjects[formData.examType][formData.subjectType];

  // Generate current year and recent years for selection
  const currentYear = new Date().getFullYear();
  const recentYears = Array.from({ length: 10 }, (_, i) =>
    (currentYear - i).toString()
  );

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Auto-generate title if subject and year range are filled
    if (field === "subject" || field === "yearRange") {
      const newSubject = field === "subject" ? value : formData.subject;
      const newYearRange = field === "yearRange" ? value : formData.yearRange;

      if (newSubject && newYearRange) {
        setFormData((prev) => ({
          ...prev,
          [field]: value,
          title: `${formData.examType} ${newSubject} (${newYearRange})`,
        }));
      }
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf") {
        setSelectedFile(file);
        setSubmitStatus("idle");
      } else {
        alert("Please select a PDF file");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedFile) {
      alert("Please select a PDF file to upload");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("subject", formData.subject);
      formDataToSend.append("examType", formData.examType);
      formDataToSend.append("subjectType", formData.subjectType);
      formDataToSend.append("year", formData.year);
      formDataToSend.append("yearRange", formData.yearRange);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("file", selectedFile);

      const response = await fetch("/api/pastPapers", {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus("success");
        setSubmitMessage("Past paper added successfully!");

        // Reset form
        setFormData(initialFormData);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setSubmitStatus("error");
        setSubmitMessage(
          result.message || result.error || "Failed to add past paper"
        );
      }
    } catch (error) {
      setSubmitStatus("error");
      setSubmitMessage("An error occurred while uploading the file");
      console.error("Error uploading file:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setSelectedFile(null);
    setSubmitStatus("idle");
    setSubmitMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] lg:ml-64 ml-16 bg-gray-50 p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Add New Past Paper
            </h1>
            <p className="text-gray-600 mt-1">
              Upload and organize past papers for CSS and PMS exams
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <LuFileText className="w-5 h-5" />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Exam Type */}
              <div>
                <label
                  htmlFor="examType"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Exam Type *
                </label>
                <select
                  id="examType"
                  value={formData.examType}
                  onChange={(e) =>
                    handleInputChange(
                      "examType",
                      e.target.value as "CSS" | "PMS"
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  required
                >
                  <option value="CSS">CSS (Central Superior Services)</option>
                  <option value="PMS">
                    PMS (Provincial Management Service)
                  </option>
                </select>
              </div>

              {/* Subject Type */}
              <div>
                <label
                  htmlFor="subjectType"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Subject Type *
                </label>
                <select
                  id="subjectType"
                  value={formData.subjectType}
                  onChange={(e) =>
                    handleInputChange(
                      "subjectType",
                      e.target.value as "compulsory" | "optional"
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  required
                >
                  <option value="compulsory">Compulsory</option>
                  <option value="optional">Optional</option>
                </select>
              </div>

              {/* Subject */}
              <div className="md:col-span-2">
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Subject *
                </label>
                <select
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  required
                >
                  <option value="">Select a subject</option>
                  {availableSubjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div>
                <label
                  htmlFor="year"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Year *
                </label>
                <select
                  id="year"
                  value={formData.year}
                  onChange={(e) => handleInputChange("year", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  required
                >
                  <option value="">Select year</option>
                  {recentYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Range */}
              <div>
                <label
                  htmlFor="yearRange"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Year Range *
                </label>
                <input
                  type="text"
                  id="yearRange"
                  value={formData.yearRange}
                  onChange={(e) =>
                    handleInputChange("yearRange", e.target.value)
                  }
                  placeholder="e.g., 2016-2024"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  required
                />
              </div>

              {/* Title */}
              <div className="md:col-span-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="e.g., CSS English Essay (2016-2024)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  required
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Brief description of the past paper content..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <LuUpload className="w-5 h-5" />
              File Upload
            </h2>

            <div className="space-y-4">
              {/* File Input */}
              <div>
                <label
                  htmlFor="file"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  PDF File *
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  id="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-blue file:text-white hover:file:bg-brand-blue/90"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Only PDF files are allowed. Maximum file size: 50MB
                </p>
              </div>

              {/* Selected File Display */}
              {selectedFile && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <LuFileText className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-900">
                          {selectedFile.name}
                        </p>
                        <p className="text-sm text-green-700">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <LuCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Status */}
          {submitStatus !== "idle" && (
            <div
              className={`rounded-lg p-4 ${
                submitStatus === "success"
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="flex items-center gap-3">
                {submitStatus === "success" ? (
                  <LuCheck className="w-5 h-5 text-green-600" />
                ) : (
                  <LuCircle className="w-5 h-5 text-red-600" />
                )}
                <p
                  className={`text-sm font-medium ${
                    submitStatus === "success"
                      ? "text-green-900"
                      : "text-red-900"
                  }`}
                >
                  {submitMessage}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-brand-blue text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-blue/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <LuLoader className="w-5 h-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <LuUpload className="w-5 h-5" />
                  Add Past Paper
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={isSubmitting}
              className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <LuCircle className="w-5 h-5" />
              Reset Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
