import SearchBar from './SearchBar';
import ProfileDropdown from './ProfileDropdown';

export default function Navbar() {
  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // Search functionality will be implemented later
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-lg border-b border-gray-200 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
              FEED
            </h1>
          </div>

          <div className="flex-1 max-w-2xl mx-8 hidden md:block">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search posts, users..."
            />
          </div>

          <div className="flex-shrink-0">
            <ProfileDropdown />
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-4 border-t border-gray-200">
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Search..."
        />
      </div>
    </nav>
  );
}