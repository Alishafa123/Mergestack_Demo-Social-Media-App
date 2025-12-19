import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { createPost, getPosts, getPost, updatePost, deletePost, toggleLike, sharePost, unsharePost, getTrendingPosts, getUserTopPosts } from '../api/post.api';
import type { CreatePostData, PostsResponse } from '../api/post.api';

export const POST_QUERY_KEY = ['posts'];

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostData) => createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: TOP_POSTS_QUERY_KEY });
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

export const useInfinitePosts = (limit: number = 10, userId?: string) => {
  return useInfiniteQuery({
    queryKey: [...POST_QUERY_KEY, 'infinite', { limit, userId }],
    queryFn: ({ pageParam = 1 }) => getPosts(pageParam, limit, userId),
    getNextPageParam: (lastPage: PostsResponse, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000, 
    initialPageParam: 1,
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
      queryClient.invalidateQueries({ queryKey: TOP_POSTS_QUERY_KEY });
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
      queryClient.invalidateQueries({ queryKey: TOP_POSTS_QUERY_KEY });
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
    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: [...POST_QUERY_KEY, 'infinite'] });

      const previousData = queryClient.getQueriesData({ queryKey: [...POST_QUERY_KEY, 'infinite'] });

      queryClient.setQueriesData(
        { queryKey: [...POST_QUERY_KEY, 'infinite'] },
        (old: any) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              posts: page.posts.map((post: any) => {
                if (post.id === postId) {
                  return {
                    ...post,
                    isLiked: !post.isLiked,
                    likes_count: post.isLiked 
                      ? Math.max(0, post.likes_count - 1)
                      : post.likes_count + 1
                  };
                }
                return post;
              })
            }))
          };
        }
      );

      return { previousData };
    },
    onError: (err, _postId, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      console.error('Like toggle failed:', err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [...POST_QUERY_KEY, 'infinite'] });
      queryClient.invalidateQueries({ queryKey: TOP_POSTS_QUERY_KEY });
    },
  });
};

export const useToggleShare = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, sharedContent, isCurrentlyShared }: { 
      postId: string; 
      sharedContent?: string; 
      isCurrentlyShared: boolean;
    }) => {
      return isCurrentlyShared ? unsharePost(postId) : sharePost(postId, sharedContent);
    },
    onMutate: async ({ postId, isCurrentlyShared }) => {
      await queryClient.cancelQueries({ queryKey: [...POST_QUERY_KEY, 'infinite'] });

      const previousData = queryClient.getQueriesData({ queryKey: [...POST_QUERY_KEY, 'infinite'] });

      queryClient.setQueriesData(
        { queryKey: [...POST_QUERY_KEY, 'infinite'] },
        (old: any) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              posts: page.posts.map((post: any) => {
                if (post.id === postId) {
                  return {
                    ...post,
                    isShared: !isCurrentlyShared,
                    shares_count: isCurrentlyShared 
                      ? Math.max(0, post.shares_count - 1)
                      : post.shares_count + 1
                  };
                }
                return post;
              })
            }))
          };
        }
      );

      return { previousData };
    },
    onError: (err, _variables, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      console.error('Share toggle failed:', err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [...POST_QUERY_KEY, 'infinite'] });
      queryClient.invalidateQueries({ queryKey: TOP_POSTS_QUERY_KEY });
    },
  });
};

export const TRENDING_QUERY_KEY = ['posts', 'trending'];

export const useGetTrendingPosts = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: [...TRENDING_QUERY_KEY, { page, limit }],
    queryFn: () => getTrendingPosts(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useInfiniteTrendingPosts = (limit: number = 10) => {
  return useInfiniteQuery({
    queryKey: [...TRENDING_QUERY_KEY, 'infinite', { limit }],
    queryFn: ({ pageParam = 1 }) => getTrendingPosts(pageParam, limit),
    getNextPageParam: (lastPage: PostsResponse, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
    initialPageParam: 1,
  });
};

export const TOP_POSTS_QUERY_KEY = ['posts', 'top', 'me'];

export const useGetUserTopPosts = () => {
  return useQuery({
    queryKey: TOP_POSTS_QUERY_KEY,
    queryFn: getUserTopPosts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};