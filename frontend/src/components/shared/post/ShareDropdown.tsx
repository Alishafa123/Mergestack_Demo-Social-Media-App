import React, { useState, useRef, useEffect } from 'react';
import { Share, MessageSquare, Repeat } from 'lucide-react';

interface ShareDropdownProps {
  onQuickShare: () => void;
  onShareWithComment: () => void;
  isShared: boolean;
  className?: string;
}

const ShareDropdown: React.FC<ShareDropdownProps> = ({
  onQuickShare,
  onShareWithComment,
  isShared,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>('bottom');
  const [horizontalPosition, setHorizontalPosition] = useState<'left' | 'right'>('left');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const handleQuickShare = () => {
    onQuickShare();
    setIsOpen(false);
  };

  const handleShareWithComment = () => {
    onShareWithComment();
    setIsOpen(false);
  };
  
  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const spaceRight = window.innerWidth - rect.right;
      const spaceLeft = rect.left;
      
      setDropdownPosition(spaceBelow < 150 && spaceAbove > 150 ? 'top' : 'bottom');
      
      if (spaceRight < 180 && spaceLeft > 180) {
        setHorizontalPosition('right');
      } else {
        setHorizontalPosition('left');
      }
    }
  };


    useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      updatePosition();
    }

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
          isShared 
            ? 'text-blue-500 hover:text-blue-600 bg-blue-50 hover:bg-blue-100' 
            : 'text-gray-600 hover:text-blue-500 hover:bg-gray-100'
        }`}
      >
        <Share size={18} />
        <span>{isShared ? 'Shared' : 'Share'}</span>
      </button>

      {isOpen && (
        <div className={`absolute bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 w-48 sm:min-w-[180px] ${
          dropdownPosition === 'top' 
            ? 'bottom-full mb-2' 
            : 'top-full mt-2'
        } ${
          horizontalPosition === 'right'
            ? 'right-0'
            : '-left-4'
        }`}>
          {!isShared ? (
            <>
              <button
                onClick={handleQuickShare}
                className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <Repeat size={16} />
                <span>Share</span>
              </button>
              <button
                onClick={handleShareWithComment}
                className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <MessageSquare size={16} />
                <span>Share with comment</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleQuickShare}
              className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
            >
              <Share size={16} />
              <span>Unshare</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ShareDropdown;