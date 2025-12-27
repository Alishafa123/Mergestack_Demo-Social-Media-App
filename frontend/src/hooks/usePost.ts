import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';

import { USER_STATS_QUERY_KEY } from '@hooks/useProfile';
import type { CreatePostData, PostsResponse } from '@api/post.api';
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  toggleLike,
  sharePost,
  unsharePost,
  getTrendingPosts,
  getUserTopPosts,
  getFollowersFeed,
} from '@api/post.api';
import { showToast } from '@components/shared/toast';

export const POST_QUERY_KEY = ['posts'];

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostData) => createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: TOP_POSTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: FOLLOWERS_FEED_QUERY_KEY });
      showToast.success('Post created successfully! 🎉');
    },
    onError: (error: any) => {
      console.error('Post creation failed:', error);
      const errorMessage = error?.response?.data?.message || 'Failed to create post. Please try again.';
      showToast.error(errorMessage);
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
    mutationFn: ({ postId, content }: { postId: string; content: string }) => updatePost(postId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: TOP_POSTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: FOLLOWERS_FEED_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: TRENDING_QUERY_KEY });
      showToast.success('Post updated successfully! ✏️');
    },
    onError: (error: any) => {
      console.error('Post update failed:', error);
      const errorMessage = error?.response?.data?.message || 'Failed to update post. Please try again.';
      showToast.error(errorMessage);
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
      queryClient.invalidateQueries({ queryKey: FOLLOWERS_FEED_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: TRENDING_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: USER_STATS_QUERY_KEY });
      showToast.success('Post deleted successfully! 🗑️');
    },
    onError: (error: any) => {
      console.error('Post deletion failed:', error);
      const errorMessage = error?.response?.data?.message || 'Failed to delete post. Please try again.';
      showToast.error(errorMessage);
    },
  });
};

export const useToggleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId }: { postId: string; postOwnerId?: string }) => toggleLike(postId),
    onMutate: async ({ postId }: { postId: string; postOwnerId?: string }) => {
      // Cancel outgoing refetches for all post queries
      await queryClient.cancelQueries({ queryKey: [...POST_QUERY_KEY, 'infinite'] });
      await queryClient.cancelQueries({ queryKey: [...TRENDING_QUERY_KEY, 'infinite'] });
      await queryClient.cancelQueries({ queryKey: [...FOLLOWERS_FEED_QUERY_KEY, 'infinite'] });

      // Get previous data for rollback
      const previousGeneralData = queryClient.getQueriesData({ queryKey: [...POST_QUERY_KEY, 'infinite'] });
      const previousTrendingData = queryClient.getQueriesData({ queryKey: [...TRENDING_QUERY_KEY, 'infinite'] });
      const previousFollowersData = queryClient.getQueriesData({ queryKey: [...FOLLOWERS_FEED_QUERY_KEY, 'infinite'] });

      // Update function for optimistic updates
      const updatePostInPages = (old: any) => {
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
                  likes_count: post.isLiked ? Math.max(0, post.likes_count - 1) : post.likes_count + 1,
                };
              }
              return post;
            }),
          })),
        };
      };

      // Optimistically update all feed caches
      queryClient.setQueriesData({ queryKey: [...POST_QUERY_KEY, 'infinite'] }, updatePostInPages);
      queryClient.setQueriesData({ queryKey: [...TRENDING_QUERY_KEY, 'infinite'] }, updatePostInPages);
      queryClient.setQueriesData({ queryKey: [...FOLLOWERS_FEED_QUERY_KEY, 'infinite'] }, updatePostInPages);

      return { previousGeneralData, previousTrendingData, previousFollowersData };
    },
    onError: (err, _variables, context) => {
      // Rollback all caches on error
      if (context?.previousGeneralData) {
        context.previousGeneralData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousTrendingData) {
        context.previousTrendingData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousFollowersData) {
        context.previousFollowersData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      console.error('Like toggle failed:', err);
    },
    onSettled: (_data, _error, { postOwnerId }) => {
      // Invalidate all post-related queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: [...POST_QUERY_KEY, 'infinite'] });
      queryClient.invalidateQueries({ queryKey: [...TRENDING_QUERY_KEY, 'infinite'] });
      queryClient.invalidateQueries({ queryKey: [...FOLLOWERS_FEED_QUERY_KEY, 'infinite'] });
      queryClient.invalidateQueries({ queryKey: TOP_POSTS_QUERY_KEY });

      if (postOwnerId) {
        const queryKey = [...USER_STATS_QUERY_KEY, postOwnerId];
        queryClient.invalidateQueries({ queryKey });
      } else {
        console.log('  ❌ postOwnerId is missing - cannot invalidate user stats');
      }

      queryClient.invalidateQueries({ queryKey: USER_STATS_QUERY_KEY });
    },
  });
};

export const useToggleShare = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      sharedContent,
      isCurrentlyShared,
    }: {
      postId: string;
      sharedContent?: string;
      isCurrentlyShared: boolean;
    }) => {
      return isCurrentlyShared ? unsharePost(postId) : sharePost(postId, sharedContent);
    },
    onMutate: async ({ postId, isCurrentlyShared }) => {
      // Cancel outgoing refetches for all post queries
      await queryClient.cancelQueries({ queryKey: [...POST_QUERY_KEY, 'infinite'] });
      await queryClient.cancelQueries({ queryKey: [...TRENDING_QUERY_KEY, 'infinite'] });
      await queryClient.cancelQueries({ queryKey: [...FOLLOWERS_FEED_QUERY_KEY, 'infinite'] });

      // Get previous data for rollback
      const previousGeneralData = queryClient.getQueriesData({ queryKey: [...POST_QUERY_KEY, 'infinite'] });
      const previousTrendingData = queryClient.getQueriesData({ queryKey: [...TRENDING_QUERY_KEY, 'infinite'] });
      const previousFollowersData = queryClient.getQueriesData({ queryKey: [...FOLLOWERS_FEED_QUERY_KEY, 'infinite'] });

      // Update function for optimistic updates
      const updatePostInPages = (old: any) => {
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
                  shares_count: isCurrentlyShared ? Math.max(0, post.shares_count - 1) : post.shares_count + 1,
                };
              }
              return post;
            }),
          })),
        };
      };

      // Optimistically update all feed caches
      queryClient.setQueriesData({ queryKey: [...POST_QUERY_KEY, 'infinite'] }, updatePostInPages);
      queryClient.setQueriesData({ queryKey: [...TRENDING_QUERY_KEY, 'infinite'] }, updatePostInPages);
      queryClient.setQueriesData({ queryKey: [...FOLLOWERS_FEED_QUERY_KEY, 'infinite'] }, updatePostInPages);

      return { previousGeneralData, previousTrendingData, previousFollowersData };
    },
    onError: (err: any, _variables, context) => {
      // Rollback all caches on error
      if (context?.previousGeneralData) {
        context.previousGeneralData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousTrendingData) {
        context.previousTrendingData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousFollowersData) {
        context.previousFollowersData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      console.error('Share toggle failed:', err);
      const errorMessage = err?.response?.data?.message || 'Failed to share post. Please try again.';
      showToast.error(errorMessage);
    },
    onSettled: (_data, error, variables) => {
      // Invalidate all post-related queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: [...POST_QUERY_KEY, 'infinite'] });
      queryClient.invalidateQueries({ queryKey: [...TRENDING_QUERY_KEY, 'infinite'] });
      queryClient.invalidateQueries({ queryKey: [...FOLLOWERS_FEED_QUERY_KEY, 'infinite'] });
      queryClient.invalidateQueries({ queryKey: TOP_POSTS_QUERY_KEY });

      // Show success toast only if no error
      if (!error) {
        const message = variables.isCurrentlyShared ? 'Post unshared successfully! 📤' : 'Post shared successfully! 📢';
        showToast.success(message);
      }
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

export const FOLLOWERS_FEED_QUERY_KEY = ['posts', 'followers'];

export const useGetFollowersFeed = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: [...FOLLOWERS_FEED_QUERY_KEY, { page, limit }],
    queryFn: () => getFollowersFeed(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useInfiniteFollowersFeed = (limit: number = 10) => {
  return useInfiniteQuery({
    queryKey: [...FOLLOWERS_FEED_QUERY_KEY, 'infinite', { limit }],
    queryFn: ({ pageParam = 1 }) => getFollowersFeed(pageParam, limit),
    getNextPageParam: (lastPage: PostsResponse, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
    initialPageParam: 1,
  });
};
