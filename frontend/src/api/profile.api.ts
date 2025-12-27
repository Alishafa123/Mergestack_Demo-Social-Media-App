import api from '@services/axios';
import type { ProfileFormData } from '@schemas/profileSchemas';

export interface SearchUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  profile?: {
    id: number;
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
    createdAt: string;
    updatedAt: string;
  };
}

export interface SearchUsersResponse {
  success: boolean;
  query: string;
  users: SearchUser[];
  total: number;
  hasMore: boolean;
}

export const getProfile = async () => {
  const res = await api.get('/profile/me');
  return res.data;
};

export const getProfileById = async (userId: string) => {
  const res = await api.get(`/profile/${userId}`);
  return res.data;
};

export const updateProfile = async (data: ProfileFormData & { profileImage?: File }) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (key === 'profileImage' && value instanceof File) {
      formData.append('profileImage', value);
    } else if (
      value !== undefined &&
      value !== null &&
      value !== '' &&
      key !== 'profileImage' &&
      key !== 'profile_url'
    ) {
      formData.append(key, String(value));
    }
  });

  const res = await api.put('/profile/me', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const deleteProfile = async () => {
  const res = await api.delete('/profile/me');
  return res.data;
};

export interface UserStats {
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalPosts: number;
  followersCount: number;
  followingCount: number;
}

export interface UserStatsResponse {
  success: boolean;
  stats: UserStats;
}

export const getUserStats = async (): Promise<UserStatsResponse> => {
  const res = await api.get('/profile/stats/me');
  return res.data;
};

export const getUserStatsById = async (userId: string): Promise<UserStatsResponse> => {
  const res = await api.get(`/profile/stats/${userId}`);
  return res.data;
};

export const searchUsers = async (query: string, page: number = 1, limit: number = 10) => {
  const params = new URLSearchParams({
    q: query,
    page: page.toString(),
    limit: limit.toString(),
  });

  const res = await api.get(`/profile/users/search?${params}`);
  return res.data as SearchUsersResponse;
};
