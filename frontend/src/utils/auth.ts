// Simple localStorage-based auth utilities

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export const AuthUtils = {
  // Get token from localStorage
  getToken: (): string | null => {
    return localStorage.getItem('access_token');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!AuthUtils.getToken();
  },

  // Get current user from token (simplified - in real app you'd decode JWT)
  getCurrentUser: (): AuthUser | null => {
    const token = AuthUtils.getToken();
    if (!token) return null;
    
    // For now, we'll store user data separately in localStorage
    // In a real app, you'd decode the JWT token
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch {
        return null;
      }
    }
    return null;
  },

  // Set user data (called after login)
  setUserData: (user: AuthUser): void => {
    localStorage.setItem('user_data', JSON.stringify(user));
  },

  // Clear auth data
  clearAuth: (): void => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
  }
};