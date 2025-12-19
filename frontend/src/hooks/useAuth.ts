import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { userController } from '../jotai/user.atom';
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
  token?: string;
  refreshToken?: string;
  expiresAt?: number;
  requiresEmailConfirmation?: boolean;
  message?: string;
}


export const useLogin = () => {
  return useMutation<AuthResponse, Error, LoginFormData>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (data.token && data.refreshToken && data.expiresAt) {
        AuthUtils.setTokens(data.token, data.refreshToken, data.expiresAt);
        userController.login(data.user.id, data.user.name, data.user.email);
      }
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
      console.log('Email confirmation required:', data.message);
    },
    onError: (error) => {
      console.error('Signup failed:', error);
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async () => {
      userController.logout();
    },
    onSuccess: () => {
      console.log('Logged out successfully');
      AuthUtils.clearAuth();
      navigate('/login');
    },
  });
};