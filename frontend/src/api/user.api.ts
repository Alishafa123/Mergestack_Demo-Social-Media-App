import api from '@services/axios';

export interface FollowResponse {
  success: boolean;
  message: string;
  isFollowing: boolean;
}

export interface FollowStatusResponse {
  success: boolean;
  isFollowing: boolean;
}

export interface FollowStatsResponse {
  success: boolean;
  stats: {
    followersCount: number;
    followingCount: number;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  profile?: {
    first_name?: string;
    last_name?: string;
    profile_url?: string;
    bio?: string;
  };
}

export interface FollowersResponse {
  success: boolean;
  followers: Array<{
    follower: UserProfile;
    createdAt: string;
  }>;
  total: number;
  hasMore: boolean;
}

export interface FollowingResponse {
  success: boolean;
  following: Array<{
    followingUser: UserProfile;
    createdAt: string;
  }>;
  total: number;
  hasMore: boolean;
}



export const followUser = async (userId: string): Promise<FollowResponse> => {
  const res = await api.post(`/users/${userId}/follow`);
  return res.data;
};

export const unfollowUser = async (userId: string): Promise<FollowResponse> => {
  const res = await api.delete(`/users/${userId}/follow`);
  return res.data;
};

export const getFollowStatus = async (userId: string): Promise<FollowStatusResponse> => {
  const res = await api.get(`/users/${userId}/follow-status`);
  return res.data;
};

export const getFollowStats = async (userId: string): Promise<FollowStatsResponse> => {
  const res = await api.get(`/users/${userId}/follow-stats`);
  return res.data;
};

export const getFollowers = async (
  userId: string,
  page: number = 1,
  limit: number = 10,
): Promise<FollowersResponse> => {
  const res = await api.get(`/users/${userId}/followers?page=${page}&limit=${limit}`);
  return res.data;
};

export const getFollowing = async (
  userId: string,
  page: number = 1,
  limit: number = 10,
): Promise<FollowingResponse> => {
  const res = await api.get(`/users/${userId}/following?page=${page}&limit=${limit}`);
  return res.data;
};


