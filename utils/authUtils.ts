// Authentication utility functions for admin panel

export interface AdminUser {
  email: string;
  name: string;
  role: string;
}

// Admin credentials (in a real app, this would be stored securely on the server)
const ADMIN_CREDENTIALS = {
  email: "admin@icep.com",
  password: "Icep.Admin@7295",
  name: "Admin User",
  role: "admin",
};

export const authUtils = {
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (typeof window === "undefined") return false;
    const token = localStorage.getItem("admin_token");
    const user = localStorage.getItem("admin_user");
    return !!(token && user);
  },

  // Get current user
  getCurrentUser: (): AdminUser | null => {
    if (typeof window === "undefined") return null;
    const user = localStorage.getItem("admin_user");
    return user ? JSON.parse(user) : null;
  },

  // Login function
  login: async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string; user?: AdminUser }> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check credentials
    if (
      email === ADMIN_CREDENTIALS.email &&
      password === ADMIN_CREDENTIALS.password
    ) {
      const user: AdminUser = {
        email: ADMIN_CREDENTIALS.email,
        name: ADMIN_CREDENTIALS.name,
        role: ADMIN_CREDENTIALS.role,
      };

      // Store authentication data
      localStorage.setItem("admin_token", "admin_token_" + Date.now());
      localStorage.setItem("admin_user", JSON.stringify(user));

      return { success: true, user };
    } else {
      return { success: false, error: "Invalid email or password" };
    }
  },

  // Logout function
  logout: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
  },

  // Check if user has admin role
  isAdmin: (): boolean => {
    const user = authUtils.getCurrentUser();
    return user?.role === "admin";
  },
};
