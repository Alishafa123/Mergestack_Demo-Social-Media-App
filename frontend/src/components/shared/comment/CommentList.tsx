import React from 'react';
import { Loader2 } from 'lucide-react';
import CommentItem from './CommentItem';
import Button from '../buttons/Button';
import { useInfiniteComments } from '../../../hooks/useComment';
import type { Comment } from '../../../api/comment.api';

interface CommentListProps {
  postId: string;
  limit?: number;
}

const CommentList: React.FC<CommentListProps> = ({ 
  postId, 
  limit = 10 
}) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = useInfiniteComments(postId, limit);

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="animate-spin text-gray-400" size={20} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500 text-sm">Failed to load comments</p>
      </div>
    );
  }

  const comments = data?.pages.flatMap(page => page.comments) || [];

  if (comments.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500 text-sm">No comments yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {comments.map((comment: Comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          postId={postId}
        />
      ))}
      
      {hasNextPage && (
        <div className="flex justify-center pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="text-gray-600"
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="animate-spin mr-2" size={14} />
                Loading...
              </>
            ) : (
              'Load more comments'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CommentList;