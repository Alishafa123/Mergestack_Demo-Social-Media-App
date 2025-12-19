// Simple localStorage-based auth utilities

export const AuthUtils = {
  getToken: (): string | null => {
    return localStorage.getItem('access_token');
  },

  isAuthenticated: (): boolean => {
    return !!AuthUtils.getToken();
  },

  setTokens: (token: string, refreshToken: string, expiresAt: number): void => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('token_expires_at', expiresAt.toString());
  },

  clearAuth: (): void => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_expires_at');
  }
};