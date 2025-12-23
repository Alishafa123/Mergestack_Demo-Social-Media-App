import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Trash2, Edit3 } from 'lucide-react';

interface PostOptionsDropdownProps {
  onDelete: () => void;
  onEdit?: () => void;
}

const PostOptionsDropdown: React.FC<PostOptionsDropdownProps> = ({ onDelete, onEdit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleDelete = () => {
    setIsOpen(false);
    onDelete();
  };

  const handleEdit = () => {
    setIsOpen(false);
    onEdit?.();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="p-3 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Post options"
      >
        <MoreHorizontal size={24} className="text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {onEdit && (
            <button
              onClick={handleEdit}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-gray-700 transition-colors"
            >
              <Edit3 size={18} />
              <span className="text-base">Edit</span>
            </button>
          )}
          
          <button
            onClick={handleDelete}
            className="w-full px-4 py-3 text-left hover:bg-red-50 flex items-center space-x-3 text-red-600 transition-colors"
          >
            <Trash2 size={18} />
            <span className="text-base">Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PostOptionsDropdown;