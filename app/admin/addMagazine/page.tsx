"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Magazine } from "@/utils/magazinesTypes";

interface FormData {
  title: string;
  year: string;
  month: string;
  week: string;
  description: string;
}

export default function AddMagazinePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    year: new Date().getFullYear().toString(),
    month: "january",
    week: "",
    description: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const months = [
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

  const years = Array.from({ length: 10 }, (_, i) =>
    (new Date().getFullYear() - i).toString()
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setError("Please select a PDF file");
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        // 50MB limit
        setError("File size must be less than 50MB");
        return;
      }
      setSelectedFile(file);
      setError("");
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setError("Please select a PDF file");
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        setError("File size must be less than 50MB");
        return;
      }
      setSelectedFile(file);
      setError("");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const uploadToVercelBlob = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message || "Failed to upload to Vercel Blob"
        );
      }

      const data = await res.json();
      return data.url;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new Error(err.message || "Unexpected error while uploading");
      } else {
        throw new Error("Unexpected error while uploading");
      }
    }
  };

  const saveMagazineData = async (magazineData: Magazine) => {
    try {
      const response = await fetch("/api/magazines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(magazineData),
      });

      if (!response.ok) {
        throw new Error("Failed to save magazine data");
      }
    } catch (error) {
      console.error("Error saving magazine data:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedFile) {
      setError("Please select a PDF file");
      return;
    }

    if (!formData.title.trim()) {
      setError("Please enter a title");
      return;
    }

    if (!formData.week.trim()) {
      setError("Please enter a week");
      return;
    }

    if (!formData.description.trim()) {
      setError("Please enter a description");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Upload to Vercel Blob
      const vercelBlobURL = await uploadToVercelBlob(selectedFile);
      console.log(vercelBlobURL);

      // Generate unique magazine ID
      const magazineId = `${formData.week}_${formData.month}_${
        formData.year
      }_${Date.now()}`;
      console.log(magazineId);
      // Create magazine object
      const magazineData: Magazine = {
        id: magazineId,
        title: formData.title,
        year: formData.year,
        month: formData.month,
        week: formData.week,
        description: formData.description,
        filePath: `/docs/magazines/${selectedFile.name}`,
        fileUrl: vercelBlobURL,
        publishDate: new Date(),
      };
      console.log(magazineData);
      // Save magazine data
      await saveMagazineData(magazineData);

      setSuccess("Magazine added successfully!");

      // Reset form
      setFormData({
        title: "",
        year: new Date().getFullYear().toString(),
        month: "january",
        week: "",
        description: "",
      });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Redirect to magazines list after 2 seconds
      setTimeout(() => {
        router.push("/admin");
      }, 2000);
    } catch (error) {
      console.error("Error adding magazine:", error);
      setError("Failed to add magazine. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] lg:ml-64 ml-16 bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-brand-blue">
            Add New Magazine
          </h1>
          <p className="text-gray-600 mt-1">
            Upload a new magazine PDF and add it to the collection.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-brand-blue">
              Magazine Details
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 text-green-600 p-4 rounded-lg text-sm">
                {success}
              </div>
            )}

            {/* File Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Magazine PDF File *
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  selectedFile
                    ? "border-green-300 bg-green-50"
                    : "border-gray-300 hover:border-brand-blue"
                }`}
                onDrop={handleFileDrop}
                onDragOver={handleDragOver}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {selectedFile ? (
                  <div>
                    <svg
                      className="w-12 h-12 text-green-500 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-green-600 font-medium">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        if (fileInputRef.current)
                          fileInputRef.current.value = "";
                      }}
                      className="mt-2 text-sm text-red-600 hover:text-red-800"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div>
                    <svg
                      className="w-12 h-12 text-gray-400 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="text-gray-600 font-medium">
                      Drop your PDF file here, or{" "}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-brand-blue hover:text-brand-blue-600"
                      >
                        browse
                      </button>
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      PDF files only, max 50MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Magazine Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Magazine Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-colors"
                  placeholder="Enter magazine title"
                  required
                />
              </div>

              {/* Year */}
              <div>
                <label
                  htmlFor="year"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Year *
                </label>
                <select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-colors"
                  required
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Month */}
              <div>
                <label
                  htmlFor="month"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Month *
                </label>
                <select
                  id="month"
                  name="month"
                  value={formData.month}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-colors"
                  required
                >
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month.charAt(0).toUpperCase() + month.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Week */}
              <div>
                <label
                  htmlFor="week"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Week *
                </label>
                <input
                  type="text"
                  id="week"
                  name="week"
                  value={formData.week}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-colors"
                  placeholder="e.g., Week 1, 1-7"
                  required
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-colors"
                  placeholder="Enter magazine description"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => router.push("/admin")}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Adding Magazine...
                  </div>
                ) : (
                  "Add Magazine"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
