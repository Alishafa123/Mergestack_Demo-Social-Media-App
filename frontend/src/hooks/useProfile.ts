import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProfile, getProfileById, updateProfile, deleteProfile, getUserStats, getUserStatsById } from '../api/profile.api';
import type { ProfileFormData } from '../schemas/profileSchemas';
import { userProfileController } from '../jotai/userprofile.atom';

export const PROFILE_QUERY_KEY = ['profile'];
export const USER_STATS_QUERY_KEY = ['userStats'];

export const useGetProfile = () => {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: getProfile,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetProfileById = (userId: string) => {
  return useQuery({
    queryKey: [...PROFILE_QUERY_KEY, userId],
    queryFn: () => getProfileById(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProfileFormData & { profileImage?: File }) => updateProfile(data),
    onSuccess: (response) => {
      // Extract user data from the API response structure
      const userData = response.user.profile;
      queryClient.setQueryData(PROFILE_QUERY_KEY, userData);
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      userProfileController.setUserProfile(userData.id, userData.first_name, userData.last_name, userData.phone, userData.date_of_birth, userData.gender, userData.bio, userData.profile_url, userData.city, userData.country)
    },
    onError: (error) => {
      console.error('Profile update failed:', error);
    },
  });
};

export const useDeleteProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProfile,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: PROFILE_QUERY_KEY });
    },
    onError: (error) => {
      console.error('Profile deletion failed:', error);
    },
  });
};

export const useGetUserStats = () => {
  return useQuery({
    queryKey: USER_STATS_QUERY_KEY,
    queryFn: getUserStats,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useGetUserStatsById = (userId: string) => {
  return useQuery({
    queryKey: [...USER_STATS_QUERY_KEY, userId],
    queryFn: () => getUserStatsById(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};