import React, { useEffect, useState } from 'react';
import { Loader2, TrendingUp } from 'lucide-react';
import PostCardWithSlider from './PostCardWithSlider';
import PostSkeleton from './PostSkeleton';
import Button from '../buttons/Button';
import ShareModal from './ShareModal';
import DeleteConfirmModal from '../modals/DeleteConfirmModal';
import EditPostModal from '../modals/EditPostModal';
import EmptyState from '../states/EmptyState';
import ErrorState from '../states/ErrorState';
import { useInfiniteTrendingPosts, useToggleLike, useToggleShare, useDeletePost, useUpdatePost } from '../../../hooks/usePost';

interface TrendingPostsFeedProps {
  enableShareModal?: boolean;
  useShareDropdown?: boolean; 
}

const TrendingPostsFeed: React.FC<TrendingPostsFeedProps> = ({ 
  enableShareModal = false, 
  useShareDropdown = false 
}) => {
  const toggleLikeMutation = useToggleLike();
  const toggleShareMutation = useToggleShare();
  const deletePostMutation = useDeletePost();
  const updatePostMutation = useUpdatePost();
  
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteTrendingPosts(10);

  const handleDelete = (postId: string) => {
    const post = allPosts.find(p => p.id === postId);
    setSelectedPost(post);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedPost) {
      deletePostMutation.mutate(selectedPost.id, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setSelectedPost(null);
        },
        onError: (error) => {
          console.error('Failed to delete post:', error);
        }
      });
    }
  };

  const handleEdit = (postId: string) => {
    const post = allPosts.find(p => p.id === postId);
    setSelectedPost(post);
    setEditModalOpen(true);
  };

  const handleSaveEdit = (content: string) => {
    if (selectedPost) {
      updatePostMutation.mutate(
        { postId: selectedPost.id, content },
        {
          onSuccess: () => {
            setEditModalOpen(false);
            setSelectedPost(null);
          },
          onError: (error) => {
            console.error('Failed to update post:', error);
          }
        }
      );
    }
  };

  const handleLike = (postId: string, postOwnerId?: string) => {
    toggleLikeMutation.mutate({ postId, postOwnerId });
  };

  const handleComment = (postId: string) => {
    console.log('Comment on post:', postId);
  };

  const handleShare = (postId: string, isCurrentlyShared: boolean) => {
    if (isCurrentlyShared) {
      toggleShareMutation.mutate({ 
        postId, 
        isCurrentlyShared: true 
      });
    } else {
      if (enableShareModal) {
        const post = allPosts.find(p => p.id === postId);
        setSelectedPost(post);
        setShareModalOpen(true);
      } else {
        toggleShareMutation.mutate({ 
          postId, 
          isCurrentlyShared: false 
        });
      }
    }
  };

  const handleModalShare = (message?: string) => {
    if (selectedPost) {
      toggleShareMutation.mutate({ 
        postId: selectedPost.id, 
        sharedContent: message,
        isCurrentlyShared: false 
      });
      setShareModalOpen(false);
      setSelectedPost(null);
    }
  };

  const handleShareWithComment = (postId: string) => {
    const post = allPosts.find(p => p.id === postId);
    setSelectedPost(post);
    setShareModalOpen(true);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000 
      ) {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <PostSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to load trending posts"
        message={error instanceof Error ? error.message : 'Something went wrong'}
      />
    );
  }

  const allPosts = data?.pages.flatMap(page => page.posts) || [];
  
  if (allPosts.length === 0) {
    return (
      <EmptyState
        icon={<TrendingUp className="w-12 h-12 text-gray-400" />}
        title="No trending posts yet"
        description="Be the first to create a trending post!"
        actionLabel="Create Post"
        actionPath="/create-post"
      />
    );
  }

  return (
    <div className="space-y-6">
      {allPosts.map((post) => (
        <PostCardWithSlider
          key={post.id}
          post={post}
          onLike={handleLike}
          onComment={handleComment}
          onShare={handleShare}
          onShareWithComment={handleShareWithComment}
          onDelete={handleDelete}
          onEdit={handleEdit}
          isLiked={post.isLiked || false} 
          isShared={post.isShared || false} 
          useShareDropdown={useShareDropdown}
        />
      ))}

      {hasNextPage && (
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

      {!hasNextPage && allPosts.length > 0 && (
        <div className="text-center py-6">
          <p className="text-gray-500 text-sm">
            You've reached the end of trending posts! 🎉
          </p>
        </div>
      )}

      {(enableShareModal || useShareDropdown) && (
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
      )}

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedPost(null);
        }}
        onConfirm={handleConfirmDelete}
        isLoading={deletePostMutation.isPending}
        message="Are you sure you want to delete this post? This action cannot be undone and will also remove all shares of this post."
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

export default TrendingPostsFeed;
