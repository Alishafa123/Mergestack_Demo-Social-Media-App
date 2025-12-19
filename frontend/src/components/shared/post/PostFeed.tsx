import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import PostCardWithSlider from './PostCardWithSlider';
import PostSkeleton from './PostSkeleton';
import Button from '../buttons/Button';
import ShareModal from './ShareModal';
import EmptyState from '../states/EmptyState';
import ErrorState from '../states/ErrorState';
import { useInfinitePosts, useToggleLike, useToggleShare } from '../../../hooks/usePost';
import { userController } from '../../../jotai/user.atom';

interface PostFeedProps {
  userId?: string; 
  enableShareModal?: boolean;
  useShareDropdown?: boolean; 
}

const PostFeed: React.FC<PostFeedProps> = ({ userId, enableShareModal = false, useShareDropdown = false }) => {
  const { id, name, email } = userController.useState(['id', 'name', 'email']);
  const currentUser = id ? { id, name, email } : null;
  const toggleLikeMutation = useToggleLike();
  const toggleShareMutation = useToggleShare();
  
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfinitePosts(10, userId);

  const handleLike = (postId: string) => {
    toggleLikeMutation.mutate(postId);
  };

  const handleComment = (postId: string) => {
    console.log('Comment on post:', postId);
    // Comment functionality is now handled within PostCardWithSlider
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
        title="Failed to load posts"
        message={error instanceof Error ? error.message : 'Something went wrong'}
      />
    );
  }

  const allPosts = data?.pages.flatMap(page => page.posts) || [];
  
  if (allPosts.length === 0) {
    return (
      <EmptyState
        title="No posts yet"
        description={userId ? 'This user hasn\'t posted anything yet.' : 'Be the first to share something!'}
        actionLabel="Create Your First Post"
        actionPath="/create-post"
        showAction={!userId}
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
          isLiked={post.isLiked || false} 
          isShared={post.isShared || false} 
          currentUserId={currentUser?.id}
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
            You've reached the end of the feed! 🎉
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
    </div>
  );
};

export default PostFeed;