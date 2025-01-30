// Secure routes with random strings to prevent brute force attacks
export const SECURE_ROUTES = {
  // Auth routes
  SIGNIN: '/auth-mlp2024/signin',
  REGISTER: '/auth-mlp2024/register',
  RESET: '/auth-mlp2024/reset',
  AUTH_CALLBACK: '/auth-mlp2024/callback',

  // Admin routes
  ADMIN: '/secure-dashboard-mlp2024',
  ADMIN_BLOG: '/secure-dashboard-mlp2024/blog',
  ADMIN_CATEGORIES: '/secure-dashboard-mlp2024/categories',
  ADMIN_APPOINTMENTS: '/secure-dashboard-mlp2024/appointments',
  ADMIN_NEWSLETTER: '/secure-dashboard-mlp2024/newsletter',
  ADMIN_PROFILE: '/secure-dashboard-mlp2024/profile',
  ADMIN_SETTINGS: '/secure-dashboard-mlp2024/settings',

  // Public routes that need authentication
  APPOINTMENTS: '/rendez-vous',
  APPOINTMENTS_NEW: '/rendez-vous/new',
  APPOINTMENTS_MANAGE: '/rendez-vous/manage',
} as const;

// Helper function to check if a path is an admin path
export const isAdminPath = (path: string): boolean => {
  return path.startsWith('/secure-dashboard-mlp2024');
}

// Helper function to check if a path is an authenticated path
export const isAuthPath = (path: string): boolean => {
  return path.startsWith('/auth-mlp2024');
}

// Helper function to check if a path is a protected path (requires authentication)
export const isProtectedPath = (path: string): boolean => {
  return isAdminPath(path) || path.startsWith('/rendez-vous/manage');
}
