import { useNavigate } from 'react-router-dom';

import SearchBar from '@components/shared/navbar/SearchBar';
import ProfileDropdown from '@components/shared/navbar/ProfileDropdown';

interface NavbarProps {
  onStatsClick?: () => void;
  onLatestClick?: () => void;
}

export default function Navbar({ onStatsClick, onLatestClick }: NavbarProps = {}) {
  const navigate = useNavigate();

  const handleFeedClick = () => {
    navigate('/dashboard');
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-lg border-b border-gray-200 backdrop-blur-sm bg-white/95">
      <div className="w-full px-2 sm:px-4 lg:px-8">
        <div className="flex items-center h-25 md:justify-between">
          <div className="flex-shrink-0">
            <button
              onClick={handleFeedClick}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight hover:from-blue-700 hover:to-purple-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg px-2 sm:px-3 py-2"
            >
              FEED
            </button>
          </div>

          <div className="flex-1 min-w-0 mx-1 sm:mx-2 md:flex-initial md:w-96 lg:w-[500px] xl:w-[600px] md:mx-8">
            <SearchBar 
              placeholder="Search..."
            />
          </div>

          <div className="flex-shrink-0">
            <ProfileDropdown 
              onStatsClick={onStatsClick}
              onLatestClick={onLatestClick}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}