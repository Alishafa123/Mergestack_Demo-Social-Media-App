import { useMutation } from '@tanstack/react-query';
import { AuthUtils } from '../utils/auth';
import { loginUser, signupUser } from '../api/auth.api';
import type { LoginFormData, SignupFormData } from '../schemas/authSchemas';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
}

export const useLogin = () => {

  return useMutation<AuthResponse, Error, LoginFormData>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.token);
      AuthUtils.setUserData({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email
      });
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
};

export const useSignup = () => {
  return useMutation<AuthResponse, Error, SignupFormData>({
    mutationFn: signupUser,
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.token);
      AuthUtils.setUserData({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email
      });
    },
    onError: (error) => {
      console.error('Signup failed:', error);
    },
  });
};

export const useLogout = () => {

  return useMutation({
    mutationFn: async () => {
      AuthUtils.clearAuth();
    },
    onSuccess: () => {
      console.log('Logged out successfully');
    },
  });
};