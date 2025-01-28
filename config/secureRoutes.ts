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
  ADMIN_APPOINTMENTS: '/secure-dashboard-mlp2024/appointments',
  ADMIN_NEWSLETTER: '/secure-dashboard-mlp2024/newsletter',
  ADMIN_SETTINGS: '/secure-dashboard-mlp2024/settings',
} as const;

// Helper function to check if a path is an admin path
export const isAdminPath = (path: string): boolean => {
  return path.startsWith('/secure-dashboard-mlp2024');
};
