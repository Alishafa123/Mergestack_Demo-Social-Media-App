import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  followUser,
  unfollowUser,
  getFollowStatus,
  getFollowers,
  getFollowing,
} from '@api/user.api';
import { showToast } from '@components/shared/toast';
import { USER_ERRORS, SUCCESS_MESSAGES } from '@constants/errors';

export const USER_QUERY_KEY = ['user'];
export const FOLLOW_STATUS_QUERY_KEY = ['followStatus'];
export const FOLLOWERS_QUERY_KEY = ['followers'];
export const FOLLOWING_QUERY_KEY = ['following'];
export const RECENT_FOLLOWERS_QUERY_KEY = ['recentFollowers'];

export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => followUser(userId),
    onSuccess: (data, userId) => {
      queryClient.setQueryData([...FOLLOW_STATUS_QUERY_KEY, userId], {
        success: true,
        isFollowing: data.isFollowing,
      });

      queryClient.invalidateQueries({ queryKey: [...FOLLOWERS_QUERY_KEY, userId] });
      queryClient.invalidateQueries({ queryKey: [...RECENT_FOLLOWERS_QUERY_KEY, userId] });
      queryClient.invalidateQueries({ queryKey: ['userStats', userId] });
      showToast.success(SUCCESS_MESSAGES.USER_FOLLOWED);
    },
    onError: (error: any) => {
      console.error('Follow user failed:', error);
      const errorMessage = error?.response?.data?.message || USER_ERRORS.FOLLOW_FAILED;
      showToast.error(errorMessage);
    },
  });
};

export const useUnfollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => unfollowUser(userId),
    onSuccess: (data, userId) => {
      // Update follow status cache
      queryClient.setQueryData([...FOLLOW_STATUS_QUERY_KEY, userId], {
        success: true,
        isFollowing: data.isFollowing,
      });

      queryClient.invalidateQueries({ queryKey: [...FOLLOWERS_QUERY_KEY, userId] });
      queryClient.invalidateQueries({ queryKey: [...RECENT_FOLLOWERS_QUERY_KEY, userId] });
      queryClient.invalidateQueries({ queryKey: ['userStats', userId] });
      showToast.success(SUCCESS_MESSAGES.USER_UNFOLLOWED);
    },
    onError: (error: any) => {
      console.error('Unfollow user failed:', error);
      const errorMessage = error?.response?.data?.message || USER_ERRORS.UNFOLLOW_FAILED;
      showToast.error(errorMessage);
    },
  });
};

export const useGetFollowStatus = (userId: string) => {
  return useQuery({
    queryKey: [...FOLLOW_STATUS_QUERY_KEY, userId],
    queryFn: () => getFollowStatus(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useGetFollowers = (userId: string, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: [...FOLLOWERS_QUERY_KEY, userId, { page, limit }],
    queryFn: () => getFollowers(userId, page, limit),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetFollowing = (userId: string, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: [...FOLLOWING_QUERY_KEY, userId, { page, limit }],
    queryFn: () => getFollowing(userId, page, limit),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetRecentFollowers = (userId: string) => {
  return useQuery({
    queryKey: [...RECENT_FOLLOWERS_QUERY_KEY, userId],
    queryFn: () => getFollowers(userId, 1, 3),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
