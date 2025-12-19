import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import PostCardWithSlider from './PostCardWithSlider';
import PostSkeleton from './PostSkeleton';
import Button from '../buttons/Button';
import ShareModal from './ShareModal';
import { useInfinitePosts, useToggleLike, useToggleShare } from '../../../hooks/usePost';
import { userController } from '../../../jotai/user.atom';

interface PostFeedProps {
  userId?: string; // Filter posts by specific user (optional)
  enableShareModal?: boolean;
  useShareDropdown?: boolean; 
}

const PostFeed: React.FC<PostFeedProps> = ({ userId, enableShareModal = false, useShareDropdown = false }) => {
  const { id, name, email } = userController.useState(['id', 'name', 'email']);
  const currentUser = id ? { id, name, email } : null;
  const toggleLikeMutation = useToggleLike();
  const toggleShareMutation = useToggleShare();
  const navigate = useNavigate();
  
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
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Failed to load posts
          </h3>
          <p className="text-red-600 mb-4">
            {error instanceof Error ? error.message : 'Something went wrong'}
          </p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            size="sm"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const allPosts = data?.pages.flatMap(page => page.posts) || [];
  
  if (allPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No posts yet
          </h3>
          <p className="text-gray-500 mb-4">
            {userId ? 'This user hasn\'t posted anything yet.' : 'Be the first to share something!'}
          </p>
          {!userId && (
            <Button
              onClick={() => navigate('/posts-create')}
              variant="primary"
              size="md"
            >
              Create Your First Post
            </Button>
          )}
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