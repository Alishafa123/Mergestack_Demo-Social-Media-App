import React, { useState } from 'react';
import { X, Share } from 'lucide-react';

import Button from '@components/shared/buttons/Button';

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 border border-gray-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Share Post</h3>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isLoading}
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {(postContent || authorName) && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
              {authorName && (
                <p className="font-semibold text-base text-gray-700 mb-2">
                  {authorName}
                </p>
              )}
              {postContent && (
                <p className="text-base text-gray-600 line-clamp-4 leading-relaxed">
                  {postContent}
                </p>
              )}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-base font-medium text-gray-700 mb-3">
              Add a message (optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Say something about this post..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              rows={5}
              maxLength={500}
              disabled={isLoading}
            />
            <p className="text-sm text-gray-500 mt-2">
              {message.length}/500 characters
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50">
          <Button
            variant="secondary"
            size="md"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleShare}
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            <Share size={18} />
            <span>{isLoading ? 'Sharing...' : 'Share'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;