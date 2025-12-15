import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useSetAtom } from 'jotai';
import { userController } from '../jotai/user.atom';
import type { User } from '../jotai/user.atom';
import { loginUser, signupUser } from '../api/auth.api';
import type { LoginFormData, SignupFormData } from '../schemas/authSchemas';

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
      userController.updateState({
        id: data.user.id, name: data.user.name, email: data.user.email
      })
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
      userController.login(data.user.id, data.user.name, data.user.email);
    },
    onError: (error) => {
      console.error('Signup failed:', error);
    },
  });
};

export const useLogout = () => {

  return useMutation({
    mutationFn: async () => {
      localStorage.removeItem('access_token');
      userController.logout();
    },
    onSuccess: () => {
      console.log('Logged out successfully');
    },
  });
};