import React from 'react';
import { User, MapPin, Loader2 } from 'lucide-react';
import type { SearchUser } from '../../../api/profile.api';

interface SearchResultsProps {
  users: SearchUser[];
  isLoading: boolean;
  query: string;
  onUserClick?: (user: SearchUser) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  users,
  isLoading,
  query,
  onUserClick
}) => {
  // Debug logging
  console.log('SearchResults received users:', users);
  users.forEach(user => {
    console.log(`User ${user.name}:`, {
      hasProfile: !!user.profile,
      profileUrl: user.profile?.profile_url,
      firstName: user.profile?.first_name,
      lastName: user.profile?.last_name
    });
  });
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="animate-spin text-gray-400" size={24} />
        <span className="ml-2 text-gray-500">Searching...</span>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8">
        <User className="mx-auto text-gray-300 mb-3" size={48} />
        <p className="text-gray-500 font-medium">No users found</p>
        <p className="text-gray-400 text-sm">Try searching with a different name</p>
      </div>
    );
  }

  const getDisplayName = (user: SearchUser) => {
    if (user.profile?.first_name && user.profile?.last_name) {
      return `${user.profile.first_name} ${user.profile.last_name}`;
    }
    return user.name;
  };

  const highlightQuery = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-800 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div className="space-y-2">
      {users.map((user) => {
        const displayName = getDisplayName(user);
        
        return (
          <div
            key={user.id}
            onClick={() => onUserClick?.(user)}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          >
            {/* Avatar */}
            <div className="flex-shrink-0">
              {user.profile?.profile_url ? (
                <img
                  src={user.profile.profile_url}
                  alt={displayName}
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    console.log('Image failed to load:', user.profile?.profile_url);
                    // Hide the broken image and show fallback
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.nextElementSibling) {
                      (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              <div 
                className={`w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center ${
                  user.profile?.profile_url ? 'hidden' : 'flex'
                }`}
              >
                <span className="text-white font-semibold text-lg">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <p className="font-semibold text-gray-900 truncate">
                  {highlightQuery(displayName, query)}
                </p>
                {user.profile?.city && (
                  <div className="flex items-center text-gray-500 text-sm">
                    <MapPin size={12} className="mr-1" />
                    <span>{user.profile.city}</span>
                  </div>
                )}
              </div>
              
              {user.profile?.bio && (
                <p className="text-gray-600 text-sm truncate mt-1">
                  {user.profile.bio}
                </p>
              )}
              
              <p className="text-gray-400 text-xs mt-1">
                @{user.email.split('@')[0]}
              </p>
            </div>

            {/* Follow Button (placeholder for future) */}
            <div className="flex-shrink-0">
              <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                View Profile
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SearchResults;