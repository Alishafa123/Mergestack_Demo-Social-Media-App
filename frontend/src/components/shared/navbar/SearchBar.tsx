import { useState, useEffect, useRef } from 'react';
import { Search, X, Command } from 'lucide-react';
import SearchResults from '../search/SearchResults';
import { useSearchUsers } from '../../../hooks/useSearch';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = "Search..." }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate=useNavigate();
  
  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Use search hook
  const { data: searchResults, isLoading } = useSearchUsers(debouncedQuery, 1, 8);

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

  const handleClear = () => {
    setSearchQuery('');
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
    <div className="w-full max-w-2xl" ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className={`relative transition-all duration-200 rounded-full ${
          isFocused 
            ? 'transform scale-105 shadow-lg' 
            : 'shadow-sm hover:shadow-md'
        }`}>
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search 
              size={20} 
              className={`transition-colors duration-200 ${
                isFocused ? 'text-blue-500' : 'text-gray-400'
              }`} 
            />
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={`block w-full pl-12 pr-12 py-3 text-sm bg-gray-50 border-0 rounded-full leading-5 placeholder-gray-500 focus:outline-none focus:bg-white focus:placeholder-gray-400 transition-all duration-200 ${
              isFocused 
                ? 'ring-2 ring-blue-500 bg-white' 
                : 'hover:bg-gray-100'
            }`}
          />

          <div className="absolute inset-y-0 right-0 pr-4 flex items-center space-x-2">
            {searchQuery ? (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200 p-1 rounded-full hover:bg-gray-200"
              >
                <X size={16} />
              </button>
            ) : (
              <div className="hidden sm:flex items-center space-x-1 text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded-md">
                <Command size={12} />
                <span>K</span>
              </div>
            )}
          </div>
        </div>

        {searchQuery && isFocused && (
          <div className="absolute z-50 mt-2 w-full bg-white shadow-xl rounded-2xl border border-gray-100 max-h-96 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Search size={16} />
                <span>Search results for "{searchQuery}"</span>
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