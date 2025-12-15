import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useSetAtom } from 'jotai';
import { userAtom } from '../jotai/user.atom';
import type { User } from '../jotai/user.atom';
import { loginUser, signupUser } from '../api/auth.api';
import type { LoginFormData, SignupFormData } from '../schemas/authSchemas';

interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
}

export const useLogin = () => {
  const setUser = useSetAtom(userAtom);

  return useMutation<AuthResponse, Error, LoginFormData>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.token);
      setUser(data.user);
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
};

export const useSignup = () => {
  const setUser = useSetAtom(userAtom);

  return useMutation<AuthResponse, Error, SignupFormData>({
    mutationFn: signupUser,
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.token);
      setUser(data.user);
    },
    onError: (error) => {
      console.error('Signup failed:', error);
    },
  });
};

export const useLogout = () => {
  const setUser = useSetAtom(userAtom);
    const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      localStorage.removeItem('access_token');
      setUser(null);
      navigate('/login');
    },
    onSuccess: () => {
      console.log('Logged out successfully');
    },
  });
};