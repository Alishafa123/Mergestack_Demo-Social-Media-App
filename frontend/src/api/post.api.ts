import api from "../services/axios";

export interface CreatePostData {
  content?: string;
  images?: File[];
}

export interface Post {
  id: string;
  user_id: string;
  content?: string;
  likes_count: number;
  comments_count: number;
  createdAt: string;
  updatedAt: string;
  isLiked?: boolean; // Whether current user has liked this post
  user: {
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
  };
  images?: {
    id: string;
    post_id: string;
    image_url: string;
    image_order: number;
    createdAt: string;
    updatedAt: string;
  }[];
}

export interface PostsResponse {
  success: boolean;
  posts: Post[];
  total: number;
  hasMore: boolean;
}

export const createPost = async (data: CreatePostData) => {
  const formData = new FormData();
  
  if (data.content) {
    formData.append('content', data.content);
  }
  
  if (data.images && data.images.length > 0) {
    data.images.forEach(image => {
      formData.append('images', image);
    });
  }

  const res = await api.post("/posts", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const getPosts = async (page: number = 1, limit: number = 10, userId?: string) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (userId) {
    params.append('userId', userId);
  }

  const res = await api.get(`/posts?${params}`);
  return res.data as PostsResponse;
};

export const getPost = async (postId: string) => {
  const res = await api.get(`/posts/${postId}`);
  return res.data;
};

export const updatePost = async (postId: string, content: string) => {
  const res = await api.put(`/posts/${postId}`, { content });
  return res.data;
};

export const deletePost = async (postId: string) => {
  const res = await api.delete(`/posts/${postId}`);
  return res.data;
};

export const toggleLike = async (postId: string) => {
  const res = await api.post(`/posts/${postId}/like`);
  return res.data;
};