import React, { useEffect, useState, useCallback } from 'react';
import { Loader2, TrendingUp, Users } from 'lucide-react';

import { showToast } from '@components/shared/toast';
import Button from '@components/shared/buttons/Button';
import ShareModal from '@components/shared/post/ShareModal';
import EmptyState from '@components/shared/states/EmptyState';
import ErrorState from '@components/shared/states/ErrorState';
import PostSkeleton from '@components/shared/post/PostSkeleton';
import EditPostModal from '@components/shared/modals/EditPostModal';
import PostCardWithSlider from '@components/shared/post/PostCardWithSlider';
import {
  useInfinitePosts,
  useInfiniteTrendingPosts,
  useInfiniteFollowersFeed,
  useToggleLike,
  useToggleShare,
  useDeletePost,
  useUpdatePost,
} from '@hooks/usePost';

type FeedType = 'general' | 'trending' | 'followers';

interface FeedProps {
  feedType: FeedType;
  userId?: string;
}

const Feed: React.FC<FeedProps> = ({ feedType, userId }) => {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

  const toggleLikeMutation = useToggleLike();
  const toggleShareMutation = useToggleShare();
  const deletePostMutation = useDeletePost();
  const updatePostMutation = useUpdatePost();

  const generalFeedQuery = useInfinitePosts(10, userId);
  const trendingFeedQuery = useInfiniteTrendingPosts(10);
  const followersFeedQuery = useInfiniteFollowersFeed(10);

  const getActiveQuery = () => {
    switch (feedType) {
      case 'general':
        return generalFeedQuery;
      case 'trending':
        return trendingFeedQuery;
      case 'followers':
        return followersFeedQuery;
      default:
        return generalFeedQuery;
    }
  };

  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = getActiveQuery();

  // Feed configuration based on type
  const getFeedConfig = (type: FeedType) => {
    switch (type) {
      case 'trending':
        return {
          emptyState: {
            icon: <TrendingUp className="w-12 h-12 text-gray-400" />,
            title: 'No trending posts yet',
            description: 'Be the first to create a trending post!',
            actionLabel: 'Create Post',
            actionPath: '/create-post',
            showAction: true,
          },
          errorTitle: 'Failed to load trending posts',
          endMessage: "You've reached the end of trending posts! 🎉",
          showLoadMoreButton: true,
        };
      case 'followers':
        return {
          emptyState: {
            icon: <Users size={48} className="mx-auto mb-4 text-gray-400" />,
            title: 'No posts from followers',
            description: 'Follow some users to see their posts in your feed!',
            showAction: false,
          },
          errorTitle: 'Failed to load posts',
          endMessage: "You've reached the end of your followers' posts!",
          showLoadMoreButton: false,
        };
      case 'general':
      default:
        return {
          emptyState: {
            title: 'No posts yet',
            description: userId ? "This user hasn't posted anything yet." : 'Be the first to share something!',
            actionLabel: 'Create Your First Post',
            actionPath: '/create-post',
            showAction: !userId,
          },
          errorTitle: 'Failed to load posts',
          endMessage: "You've reached the end of the feed! 🎉",
          showLoadMoreButton: true,
        };
    }
  };

  const config = getFeedConfig(feedType);

  const handleDelete = (postId: string) => {
    setDeletingPostId(postId);
    deletePostMutation.mutate(postId, {
      onSuccess: () => {
        setDeletingPostId(null);
        // Toast is handled in the hook
      },
      onError: () => {
        setDeletingPostId(null);
        // Toast is handled in the hook
      },
    });
  };

  const handleEdit = (postId: string) => {
    const post = allPosts.find((p) => p.id === postId);
    setSelectedPost(post);
    setEditModalOpen(true);
  };

  const handleSaveEdit = (content: string) => {
    if (selectedPost) {
      updatePostMutation.mutate(
        { postId: selectedPost.id, content },
        {
          onSuccess: () => {
            showToast.success('Post updated successfully! ✏️');
            setEditModalOpen(false);
            setSelectedPost(null);
          },
          onError: (error: any) => {
            console.error('Failed to update post:', error);
            const errorMessage = error?.response?.data?.message || 'Failed to update post. Please try again.';
            showToast.error(errorMessage);
          },
        },
      );
    }
  };

  const handleLike = (postId: string, postOwnerId?: string) => {
    toggleLikeMutation.mutate({ postId, postOwnerId });
  };

  const handleShare = (postId: string, isCurrentlyShared: boolean) => {
    if (isCurrentlyShared) {
      toggleShareMutation.mutate({
        postId,
        isCurrentlyShared: true,
      });
    } else {
      toggleShareMutation.mutate({
        postId,
        isCurrentlyShared: false,
      });
    }
  };

  const handleModalShare = (message?: string) => {
    if (selectedPost) {
      toggleShareMutation.mutate({
        postId: selectedPost.id,
        sharedContent: message,
        isCurrentlyShared: false,
      });
      setShareModalOpen(false);
      setSelectedPost(null);
    }
  };

  const handleShareWithComment = (postId: string) => {
    const post = allPosts.find((p) => p.id === postId);
    setSelectedPost(post);
    setShareModalOpen(true);
  };

  const handleDeleteShare = (postId: string) => {
    toggleShareMutation.mutate({
      postId,
      isCurrentlyShared: true,
    });
  };

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    if (feedType === 'followers') {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll, feedType]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <PostSkeleton key={`${feedType}-skeleton-${index}`} />
        ))}
      </div>
    );
  }

  if (isError || error) {
    return (
      <ErrorState title={config.errorTitle} message={error instanceof Error ? error.message : 'Something went wrong'} />
    );
  }

  const allPosts = data?.pages.flatMap((page) => page.posts) || [];

  if (allPosts.length === 0) {
    return (
      <EmptyState
        icon={config.emptyState.icon}
        title={config.emptyState.title}
        description={config.emptyState.description}
        actionLabel={config.emptyState.actionLabel}
        actionPath={config.emptyState.actionPath}
        showAction={config.emptyState.showAction}
      />
    );
  }

  return (
    <div className="space-y-6">
      {allPosts.map((post, index) => (
        <PostCardWithSlider
          key={`${feedType}-${post.id}-${index}`}
          post={post}
          onLike={handleLike}
          onShare={handleShare}
          onShareWithComment={handleShareWithComment}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onDeleteShare={handleDeleteShare}
          isLiked={post.isLiked || false}
          isShared={post.isShared || false}
          isDeleting={deletePostMutation.isPending && deletingPostId === post.id}
          isDeletingShare={toggleShareMutation.isPending}
        />
      ))}

      {config.showLoadMoreButton && hasNextPage && (
        <div className="flex justify-center py-6">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="outline"
            size="md"
            className="flex items-center space-x-2"
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading more...</span>
              </>
            ) : (
              <span>Load More Posts</span>
            )}
          </Button>
        </div>
      )}

      {!config.showLoadMoreButton && isFetchingNextPage && (
        <div className="flex items-center justify-center py-8">
          <Loader2 size={24} className="animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Loading more posts...</span>
        </div>
      )}

      {!hasNextPage && allPosts.length > 0 && (
        <div className="text-center py-6">
          <p className="text-gray-500 text-sm">{config.endMessage}</p>
        </div>
      )}

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => {
          setShareModalOpen(false);
          setSelectedPost(null);
        }}
        onShare={handleModalShare}
        isLoading={toggleShareMutation.isPending}
        postContent={selectedPost?.content}
        authorName={
          selectedPost?.user.profile?.first_name && selectedPost?.user.profile?.last_name
            ? `${selectedPost.user.profile.first_name} ${selectedPost.user.profile.last_name}`
            : selectedPost?.user.name
        }
      />

      <EditPostModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedPost(null);
        }}
        onSave={handleSaveEdit}
        isLoading={updatePostMutation.isPending}
        post={selectedPost}
      />
    </div>
  );
};

export default Feed;
