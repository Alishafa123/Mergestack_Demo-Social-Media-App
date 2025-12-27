import api from '@services/axios';

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  parent_comment_id?: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    profile?: {
      id: number;
      user_id: string;
      first_name?: string;
      last_name?: string;
      profile_url?: string;
    };
  };
  replies?: Comment[];
}

export interface CommentsResponse {
  success: boolean;
  comments: Comment[];
  total: number;
  hasMore: boolean;
}

export interface CreateCommentData {
  content: string;
  parentCommentId?: string;
}

export interface CommentResponse {
  success: boolean;
  message: string;
  comment: Comment;
}

// Get comments for a post
export const getPostComments = async (postId: string, page: number = 1, limit: number = 20) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  const res = await api.get(`/posts/${postId}/comments?${params}`);
  return res.data as CommentsResponse;
};

// Create a comment or reply
export const createComment = async (postId: string, data: CreateCommentData) => {
  const res = await api.post(`/posts/${postId}/comments`, data);
  return res.data as CommentResponse;
};

// Update a comment
export const updateComment = async (commentId: string, content: string) => {
  const res = await api.put(`/comments/${commentId}`, { content });
  return res.data as CommentResponse;
};

// Delete a comment
export const deleteComment = async (commentId: string) => {
  const res = await api.delete(`/comments/${commentId}`);
  return res.data;
};
