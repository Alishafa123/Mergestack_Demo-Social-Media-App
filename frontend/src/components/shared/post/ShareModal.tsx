import React, { useState } from 'react';
import { X, Share } from 'lucide-react';
import Button from '../buttons/Button';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (message?: string) => void;
  isLoading?: boolean;
  postContent?: string;
  authorName?: string;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  onShare,
  isLoading = false,
  postContent,
  authorName
}) => {
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleShare = () => {
    onShare(message.trim() || undefined);
    setMessage('');
  };

  const handleClose = () => {
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 border border-gray-300">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Share Post</h3>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-full"
            disabled={isLoading}
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-4">
          {(postContent || authorName) && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
              {authorName && (
                <p className="font-semibold text-sm text-gray-700 mb-1">
                  {authorName}
                </p>
              )}
              {postContent && (
                <p className="text-sm text-gray-600 line-clamp-3">
                  {postContent}
                </p>
              )}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add a message (optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Say something about this post..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              maxLength={500}
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              {message.length}/500 characters
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleShare}
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            <Share size={16} />
            <span>{isLoading ? 'Sharing...' : 'Share'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;