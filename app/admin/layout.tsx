"use client";
import Sidebar from "@/components/AdminComponents/Sidebar";
import Logo from "@/components/Logo";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { authUtils, AdminUser } from "@/utils/authUtils";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  console.log(currentUser)

  // Check if current page is login page
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const authenticated = authUtils.isAuthenticated();
      const user = authUtils.getCurrentUser();

      setIsAuthenticated(authenticated);
      setCurrentUser(user);
      setIsLoading(false);

      // Only redirect to login if not authenticated and not already on login page
      if (!authenticated && !isLoginPage) {
        router.push("/admin/login");
      }
    };

    checkAuth();
  }, [router, isLoginPage]);

  const handleLogout = () => {
    authUtils.logout();
    router.push("/admin/login");
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If on login page, render without admin layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Don't render admin layout if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-22">
            {/* Logo */}
            <Logo />

            {/* User Info and Logout Button */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleLogout}
                className="bg-brand-blue/85 text-brand-white btn"
                aria-label="Logout from your account"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div>
        <Sidebar />
        {children}
      </div>
    </>
  );
}
