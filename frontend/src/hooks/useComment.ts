import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { getPostComments, createComment, updateComment, deleteComment } from '../api/comment.api';
import type { CreateCommentData, CommentsResponse } from '../api/comment.api';

export const COMMENT_QUERY_KEY = ['comments'];

export const useGetPostComments = (postId: string, page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: [...COMMENT_QUERY_KEY, postId, { page, limit }],
    queryFn: () => getPostComments(postId, page, limit),
    enabled: !!postId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useInfiniteComments = (postId: string, limit: number = 20) => {
  return useInfiniteQuery({
    queryKey: [...COMMENT_QUERY_KEY, postId, 'infinite', { limit }],
    queryFn: ({ pageParam = 1 }) => getPostComments(postId, pageParam, limit),
    getNextPageParam: (lastPage: CommentsResponse, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    enabled: !!postId,
    staleTime: 2 * 60 * 1000,
    initialPageParam: 1,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, data }: { postId: string; data: CreateCommentData }) => 
      createComment(postId, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: [...COMMENT_QUERY_KEY, variables.postId] 
      });
      
      queryClient.invalidateQueries({ 
        queryKey: ['posts'] 
      });
    },
    onError: (error) => {
      console.error('Comment creation failed:', error);
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) => 
      updateComment(commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMMENT_QUERY_KEY });
    },
    onError: (error) => {
      console.error('Comment update failed:', error);
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMMENT_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      console.error('Comment deletion failed:', error);
    },
  });
};