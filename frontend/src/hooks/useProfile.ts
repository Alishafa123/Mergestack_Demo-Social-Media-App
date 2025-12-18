import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProfile, updateProfile, deleteProfile, getUserStats, getUserStatsById } from '../api/profile.api';
import type { ProfileFormData } from '../schemas/profileSchemas';

export const PROFILE_QUERY_KEY = ['profile'];
export const USER_STATS_QUERY_KEY = ['userStats'];

export const useGetProfile = () => {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: getProfile,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProfileFormData & { profileImage?: File }) => updateProfile(data),
    onSuccess: (data) => {
      queryClient.setQueryData(PROFILE_QUERY_KEY, data);
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
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