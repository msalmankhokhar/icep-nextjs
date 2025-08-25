"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import {
  LuFilePlus,
  LuFiles,
  LuFileText,
  LuLayoutDashboard,
  LuPlus,
} from "react-icons/lu";

export default function Sidebar() {
  const pathname = usePathname();
  const menuItems = [
    {
      title: "Dashboard",
      path: "/admin",
      icon: <LuLayoutDashboard className="w-8 h-8 lg:w-5 lg:h-5" />,
    },
    {
      title: "Add Magazine",
      path: "/admin/addMagazine",
      icon: <LuPlus className="w-8 h-8 lg:w-5 lg:h-5" />,
    },
    {
      title: "Magazines",
      path: "/admin/listMagazines",
      icon: <LuFiles className="w-8 h-8 lg:w-5 lg:h-5" />,
    },
    {
      title: "Add Past Paper",
      path: "/admin/addPastPaper",
      icon: <LuFilePlus className="w-8 h-8 lg:w-5 lg:h-5" />,
    },
    {
      title: "Past Papers",
      path: "/admin/listPastPapers",
      icon: <LuFileText className="w-8 h-8 lg:w-5 lg:h-5" />,
    },
  ];
  return (
    <aside className="h-screen bg-white border-r border-gray-200 fixed left-0 top-22 overflow-y-auto transition-all duration-300 lg:w-64 w-20">
      {/* Navigation Menu */}
      <nav className="p-4">
        <div className="space-y-6">
          {menuItems.map((item) => {
            const isActive =
              item.path === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center lg:justify-start justify-center w-full px-2 lg:px-4 py-4 lg:py-3 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? "bg-brand-blue text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center justify-center w-full lg:w-auto lg:justify-start">
                  {item.icon}
                  <span className="font-medium lg:block hidden lg:ml-3">
                    {item.title}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer Section */}
      <div className="absolute bottom-20 w-full p-4 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <span className="lg:block hidden">Version 1.0.0</span>
          <span className="lg:block hidden">•</span>
          <span className="lg:block hidden">ICEP INSTITUTE</span>
        </div>
      </div>
    </aside>
  );
}
