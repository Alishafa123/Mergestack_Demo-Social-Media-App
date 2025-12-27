import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import { AuthUtils } from '@utils/auth';
import { userController } from '@jotai/user.atom';
import { showToast } from '@components/shared/toast';
import { userProfileController } from '@jotai/userprofile.atom';
import { loginUser, signupUser, forgotPassword, resetPassword } from '@api/auth.api';
import type {
  LoginFormData,
  SignupFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
} from '@schemas/authSchemas';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Profile {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  bio?: string;
  profile_url?: string;
  city?: string;
  country?: string;
}

interface AuthResponse {
  success: boolean;
  user: User;
  profile: Profile;
  token?: string;
  refreshToken?: string;
  expiresAt?: number;
  requiresEmailConfirmation?: boolean;
  message?: string;
}

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation<AuthResponse, Error, LoginFormData>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (data.token && data.refreshToken && data.expiresAt) {
        AuthUtils.setTokens(data.token, data.refreshToken, data.expiresAt);
        userController.login(data.user.id, data.user.name, data.user.email);
        showToast.success(`Welcome back, ${data.user.name}!`);
        navigate('/dashboard');
      }

      if (data.profile) {
        userProfileController.setUserProfile(
          data.profile.id || '',
          data.profile.first_name || '',
          data.profile.last_name || '',
          data.profile.phone || '',
          data.profile.date_of_birth || '',
          data.profile.gender || '',
          data.profile.bio || '',
          data.profile.profile_url || '',
          data.profile.city || '',
          data.profile.country || '',
        );
      }
    },
    onError: (error: any) => {
      console.error('Login failed:', error);
      const errorMessage =
        error?.response?.data?.message || 'Login failed. Please check your credentials and try again.';
      showToast.error(errorMessage);
    },
  });
};

export const useSignup = () => {
  const navigate = useNavigate();
  return useMutation<AuthResponse, Error, SignupFormData>({
    mutationFn: signupUser,
    onSuccess: (data) => {
      const message = data.message || 'Account created successfully! Please check your email to verify your account.';
      showToast.success(message, { autoClose: 8000 });
      navigate('/login');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Signup failed. Please try again.';
      showToast.error(errorMessage);
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
      showToast.info('You have been logged out successfully');
      navigate('/login');
    },
    onError: () => {
      showToast.error('Failed to logout. Please try again.');
    },
  });
};

export const useForgotPassword = () => {
  const navigate = useNavigate();

  return useMutation<{ success: boolean; message: string }, Error, ForgotPasswordFormData>({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      const message = data.message || 'Password reset email sent successfully! Please check your inbox.';
      showToast.success(message, { autoClose: 8000 });
      navigate('/login');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to send password reset email. Please try again.';
      showToast.error(errorMessage);
    },
  });
};

export const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation<{ success: boolean; message: string }, Error, ResetPasswordFormData & { token: string }>({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      const message = data.message || 'Password reset successfully! You can now login with your new password.';
      showToast.success(message, { autoClose: 8000 });
      navigate('/login');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to reset password. Please try again.';
      showToast.error(errorMessage);
    },
  });
};
