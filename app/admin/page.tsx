import {
  getAllMagazines,
  getMagazinesByMonth,
} from "@/utils/magazinesServerUtils";
import { getAllPastPapers } from "@/utils/pastPapersAdminUtils";
import Link from "next/link";
import React from "react";
import { FaBookOpen, FaEye, FaFileAlt, FaUsers } from "react-icons/fa";

export default function AdminHomepage() {
  const pastpapers = getAllPastPapers();
  const totalPastPapers = pastpapers.length;
  const magazines = getAllMagazines();
  const totalMagazines = magazines.length;
  const magazinesByMonth = getMagazinesByMonth();
  // const totalMagazinesOfCurrentMonth = magazinesByMonth[1].magazines.length;
  const totalMagazinesOfCurrentMonth = 0;
  const totalMagazinesOfLastMonth = magazinesByMonth[0].magazines.length;
  const changeInMagazinesPercentage =
    ((totalMagazinesOfCurrentMonth - totalMagazinesOfLastMonth) /
      totalMagazinesOfLastMonth) *
    100;
  const statsData = [
    {
      title: "Total Past Papers",
      value: totalPastPapers,
      change: "+12%",
      icon: <FaFileAlt className="size-6" />,
    },
    {
      title: "Total Magazines",
      value: totalMagazines,
      change: `${changeInMagazinesPercentage}%`,
      icon: <FaBookOpen className="size-6" />,
    },
    {
      title: "Total Views",
      value: 24030,
      change: "+24%",
      icon: <FaEye className="size-6" />,
    },
    {
      title: "Active Users",
      value: 1600,
      change: "+18%",
      icon: <FaUsers className="size-6" />,
    },
  ];
  return (
    <div className="min-h-[calc(100vh-4rem)] lg:ml-64 ml-16 bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-brand-blue">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here&apos;s what&apos;s happening with your data.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-brand-blue mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className="p-3 bg-brand-blue rounded-lg text-brand-yellow">
                  {stat.icon}
                </div>
              </div>
              <div className="mt-4">
                <span
                  className={`text-sm font-medium ${
                    stat.change.includes("+")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-sm text-gray-600 ml-1">
                  from last month
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-brand-blue">
              Recent Activities
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="p-6 hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-brand-blue">
                    Past Paper Added
                  </h3>
                  <p className="text-gray-600 mt-1">
                    This is past paper of css
                  </p>
                  <p className="text-sm text-gray-500 mt-2">2 PM</p>
                </div>
                <div className="p-2 bg-brand-blue rounded-lg">
                  <svg
                    className="w-5 h-5 text-brand-yellow"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-gray-100">
            <Link
              href="/admin/listPastPapers"
              className="text-brand-blue-800 hover:text-brand-blue-400 text-sm font-medium transition-colors duration-200"
            >
              View all activities →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
