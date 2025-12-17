// Simple localStorage-based auth utilities

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export const AuthUtils = {
  getToken: (): string | null => {
    return localStorage.getItem('access_token');
  },

  isAuthenticated: (): boolean => {
    return !!AuthUtils.getToken();
  },

  getCurrentUser: (): AuthUser | null => {
    const token = AuthUtils.getToken();
    if (!token) return null;
    

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

 
  setUserData: (user: AuthUser): void => {
    localStorage.setItem('user_data', JSON.stringify(user));
  },


  clearAuth: (): void => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
  }
};