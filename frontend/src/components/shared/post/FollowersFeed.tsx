import React, { useCallback, useState } from 'react';
import { useInfiniteFollowersFeed, useToggleLike, useToggleShare } from '../../../hooks/usePost';
import PostCardWithSlider from './PostCardWithSlider';
import { Loader2, Users } from 'lucide-react';
import PostSkeleton from './PostSkeleton';
import ErrorState from '../states/ErrorState';
import ShareModal from './ShareModal';
import { userController } from '../../../jotai/user.atom';

interface FollowersFeedProps {
  useShareDropdown?: boolean;
}

const FollowersFeed: React.FC<FollowersFeedProps> = ({ useShareDropdown = false }) => {
  const { id, name, email } = userController.useState(['id', 'name', 'email']);
  const currentUser = id ? { id, name, email } : null;
  const toggleLikeMutation = useToggleLike();
  const toggleShareMutation = useToggleShare();
  
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteFollowersFeed(10);

  const handleLike = (postId: string, postOwnerId?: string) => {
    toggleLikeMutation.mutate({ postId, postOwnerId });
  };

  const handleShare = (postId: string, isCurrentlyShared: boolean) => {
    if (isCurrentlyShared) {
      toggleShareMutation.mutate({ 
        postId, 
        isCurrentlyShared: true 
      });
    } else {
      toggleShareMutation.mutate({ 
        postId, 
        isCurrentlyShared: false 
      });
    }
  };

  const handleShareWithComment = (postId: string) => {
    const post = allPosts.find(p => p.id === postId);
    setSelectedPost(post);
    setShareModalOpen(true);
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

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 1000 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <PostSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-gray-400 mb-4">
          <Users size={48} className="mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600">No posts from followers</h3>
          <p className="text-sm text-gray-500 mt-2 mb-4">
            Follow some users to see their posts in your feed!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {allPosts.map((post) => (
        <PostCardWithSlider
          key={post.id}
          post={post}
          onLike={handleLike}
          onShare={handleShare}
          onShareWithComment={handleShareWithComment}
          isLiked={post.isLiked || false}
          isShared={post.isShared || false}
          currentUserId={currentUser?.id}
          useShareDropdown={useShareDropdown}
        />
      ))}

      {isFetchingNextPage && (
        <div className="flex items-center justify-center py-8">
          <Loader2 size={24} className="animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Loading more posts...</span>
        </div>
      )}

      {!hasNextPage && allPosts.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">You've reached the end of your followers' posts!</p>
        </div>
      )}

      {useShareDropdown && (
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

export default FollowersFeed;