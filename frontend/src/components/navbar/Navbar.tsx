import SearchBar from './SearchBar';
import ProfileDropdown from './ProfileDropdown';

export default function Navbar() {
  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // Search functionality will be implemented later
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">FEED</h1>
            </div>
          </div>

          <SearchBar 
            onSearch={handleSearch}
            placeholder="Search projects, tasks, users..."
          />

          <ProfileDropdown />
        </div>
      </div>

      <div className="md:hidden px-4 pb-3 border-t border-gray-200">
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Search..."
        />
      </div>
    </nav>
  );
}