import React, { useState } from 'react';
import { MoreHorizontal, Reply, Edit, Trash2 } from 'lucide-react';
import CommentForm from '@components/shared/comment/CommentForm';
import { useDeleteComment, useUpdateComment } from '@hooks/useComment';
import { userProfileController } from '@jotai/userprofile.atom';
import type { Comment } from '@api/comment.api';
import { formatRelativeTime } from '@utils/dateUtils';
import Avatar from '@components/shared/ui/Avatar';
import DeleteConfirmModal from '@components/shared/modals/DeleteConfirmModal';

interface CommentItemProps {
  comment: Comment;
  postId: string;
  onReply?: (parentCommentId: string) => void;
  isReply?: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({ 
  comment, 
  postId, 
  onReply, 
  isReply = false 
}) => {
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const { id } = userProfileController.useState(['id']);
  const deleteCommentMutation = useDeleteComment();
  const updateCommentMutation = useUpdateComment();

  const isOwner = id === comment.user_id || id === comment.user?.id;

  const displayName = comment.user.profile?.first_name && comment.user.profile?.last_name
    ? `${comment.user.profile.first_name} ${comment.user.profile.last_name}`
    : comment.user.name;

  const formatDate = (dateString: string) => {
    return formatRelativeTime(dateString);
  };

  const handleEdit = (content: string) => {
    updateCommentMutation.mutate(
      { commentId: comment.id, content },
      {
        onSuccess: () => {
          setIsEditing(false);
        }
      }
    );
  };

  const handleDelete = () => {
    deleteCommentMutation.mutate(comment.id, {
      onSuccess: () => {
        setShowDeleteModal(false);
      },
      onError: () => {
        // Keep modal open on error so user can try again
        // Toast notification is handled in the hook
      }
    });
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    setShowActions(false);
  };

  const handleReply = () => {
    if (onReply) {
      onReply(comment.id);
    } else {
      setShowReplyForm(true);
    }
  };

  return (
    <div className={`${isReply ? 'ml-8 mt-3' : 'mt-4'}`}>
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <Avatar
            src={comment.user.profile?.profile_url}
            name={displayName}
            size="sm"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="bg-gray-100 rounded-2xl px-4 py-2 relative">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-sm text-gray-900">
                {displayName}
              </span>
              {isOwner && (
                <div className="relative">
                  <button
                    onClick={() => setShowActions(!showActions)}
                    className="p-1 hover:bg-gray-200 rounded-full"
                  >
                    <MoreHorizontal size={14} className="text-gray-500" />
                  </button>
                  
                  {showActions && (
                    <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setShowActions(false);
                        }}
                        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <Edit size={14} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={handleDeleteClick}
                        className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {isEditing ? (
              <CommentForm
                initialValue={comment.content}
                onSubmit={handleEdit}
                onCancel={() => setIsEditing(false)}
                placeholder="Edit your comment..."
                submitText="Save"
                isLoading={updateCommentMutation.isPending}
              />
            ) : (
              <p className="text-gray-900 text-sm whitespace-pre-wrap">
                {comment.content}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-4 mt-1 ml-2">
            <span className="text-xs text-gray-500">
              {formatDate(comment.createdAt)}
            </span>
            
            {!isReply && (
              <button
                onClick={handleReply}
                className="flex items-center space-x-1 text-xs text-gray-500 hover:text-blue-600 font-medium"
              >
                <Reply size={12} />
                <span>Reply</span>
              </button>
            )}
          </div>

          {showReplyForm && (
            <div className="mt-3">
              <CommentForm
                postId={postId}
                parentCommentId={comment.id}
                onSuccess={() => setShowReplyForm(false)}
                onCancel={() => setShowReplyForm(false)}
                placeholder="Write a reply..."
                submitText="Reply"
              />
            </div>
          )}

          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  postId={postId}
                  isReply={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        isLoading={deleteCommentMutation.isPending}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
      />
    </div>
  );
};

export default CommentItem;