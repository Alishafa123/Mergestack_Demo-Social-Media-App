import { useMutation } from '@tanstack/react-query';
import { AuthUtils } from '../utils/auth';
import { userProfileController } from '../jotai/userprofile.atom';
import { loginUser, signupUser } from '../api/auth.api';
import type { LoginFormData, SignupFormData } from '../schemas/authSchemas';

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
          data.profile.country || ''
        );
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
      localStorage.setItem('access_token', data.token);
      AuthUtils.setUserData({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email
      });
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
          data.profile.country || ''
        );
      }
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