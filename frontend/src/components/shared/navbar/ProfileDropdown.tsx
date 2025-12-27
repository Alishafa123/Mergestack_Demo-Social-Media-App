import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Clock } from 'lucide-react';
import { userProfileController } from '@jotai/userprofile.atom'
import { useLogout } from '@hooks/useAuth';
import Avatar from '@components/shared/ui/Avatar';

interface ProfileDropdownProps {
  onStatsClick?: () => void;
  onLatestClick?: () => void;
}

export default function ProfileDropdown({ onStatsClick, onLatestClick }: ProfileDropdownProps = {}) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const logoutMutation = useLogout();
  const { id, first_name, last_name, profile_url } = userProfileController.useState(['id', 'first_name', 'last_name', 'profile_url'])
  
  const handleProfileClick = () => {
    navigate('/profile');
    setIsOpen(false);
  };
  
  const handleTimelineClick = () => {
    if (id) {
      navigate(`/user/${id}`);
      setIsOpen(false);
    }
  };
  
  const handleLogout = () => {
    logoutMutation.mutate();
    setIsOpen(false);
  };

  const handleStatsClick = () => {
    onStatsClick?.();
    setIsOpen(false);
  };

  const handleLatestClick = () => {
    onLatestClick?.();
    setIsOpen(false);
  };
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-center w-14 h-14 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <Avatar
          src={profile_url}
          name={first_name && last_name ? `${first_name} ${last_name}` : 'User'}
          size="lg"
          className="w-12 h-12"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">
                {first_name && last_name ? `${first_name} ${last_name}` : 'User'}
              </p>
            </div>

            <button
              onClick={handleProfileClick}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
            >
              <svg
                className="mr-3 h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Profile
            </button>

            <button
              onClick={handleTimelineClick}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
            >
              <svg
                className="mr-3 h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Timeline
            </button>

            {onStatsClick && (
              <button
                onClick={handleStatsClick}
                className="lg:hidden w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
              >
                <BarChart3 className="mr-3 h-4 w-4 text-gray-400" />
                Stats
              </button>
            )}

            {onLatestClick && (
              <button
                onClick={handleLatestClick}
                className="xl:hidden w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
              >
                <Clock className="mr-3 h-4 w-4 text-gray-400" />
                Activity
              </button>
            )}

            <button
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="mr-3 h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}