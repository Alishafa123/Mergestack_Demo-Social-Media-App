import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createPost, getPosts, getPost, updatePost, deletePost, toggleLike } from '../api/post.api';
import type { CreatePostData } from '../api/post.api';

export const POST_QUERY_KEY = ['posts'];

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostData) => createPost(data),
    onSuccess: () => {
      // Invalidate posts query to refresh the feed
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEY });
    },
    onError: (error) => {
      console.error('Post creation failed:', error);
    },
  });
};

export const useGetPosts = (page: number = 1, limit: number = 10, userId?: string) => {
  return useQuery({
    queryKey: [...POST_QUERY_KEY, { page, limit, userId }],
    queryFn: () => getPosts(page, limit, userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetPost = (postId: string) => {
  return useQuery({
    queryKey: [...POST_QUERY_KEY, postId],
    queryFn: () => getPost(postId),
    enabled: !!postId,
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, content }: { postId: string; content: string }) => 
      updatePost(postId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEY });
    },
    onError: (error) => {
      console.error('Post update failed:', error);
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEY });
    },
    onError: (error) => {
      console.error('Post deletion failed:', error);
    },
  });
};

export const useToggleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => toggleLike(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEY });
    },
    onError: (error) => {
      console.error('Like toggle failed:', error);
    },
  });
};