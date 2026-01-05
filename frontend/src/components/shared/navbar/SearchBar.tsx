import { Search } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

import { useNavigate } from 'react-router-dom';
import { useSearchUsers } from '@hooks/useSearch';
import SearchResults from '@components/shared/search/SearchResults';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = 'Search...' }: SearchBarProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { data: searchResults, isLoading } = useSearchUsers(debouncedQuery, 1, 8);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setTimeout(() => setIsFocused(false), 150);
  };

  const handleUserClick = (userId: string) => {
    setIsFocused(false);
    setSearchQuery('');
    navigate(`/user/${userId}`);
  };

  return (
    <div className="w-full max-w-2xl px-2 sm:px-0" ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`relative transition-all duration-200 rounded-full ${
            isFocused ? 'transform scale-105 shadow-lg' : 'shadow-sm hover:shadow-md'
          }`}
        >
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search
              size={22}
              className={`transition-colors duration-200 ${isFocused ? 'text-blue-500' : 'text-gray-400'}`}
            />
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={`block w-full pl-12 pr-12 py-4 text-base bg-gray-50 border-0 rounded-full leading-5 placeholder-gray-500 focus:outline-none focus:bg-white focus:placeholder-gray-400 transition-all duration-200 ${
              isFocused ? 'ring-2 ring-blue-500 bg-white' : 'hover:bg-gray-100'
            }`}
          />
        </div>

        {searchQuery && isFocused && (
          <div className="absolute z-50 mt-2 w-[calc(100vw-60px)] sm:w-full bg-white shadow-xl rounded-2xl border border-gray-100 max-h-96 overflow-hidden left-1/2 transform -translate-x-1/2 sm:left-0 sm:transform-none sm:translate-x-0">
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Search size={16} />
                <span className="truncate">Search results for "{searchQuery}"</span>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              <SearchResults
                users={searchResults?.users || []}
                isLoading={isLoading}
                query={searchQuery}
                onUserClick={handleUserClick}
              />
            </div>

            {searchResults && searchResults.users.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                <p className="text-xs text-gray-500 text-center">
                  Showing {searchResults.users.length} of {searchResults.total} results
                </p>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
