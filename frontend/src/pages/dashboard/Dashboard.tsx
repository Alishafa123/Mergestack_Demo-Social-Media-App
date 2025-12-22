import { useState } from 'react';
import { TrendingUp, Home, Users } from 'lucide-react';
import Navbar from '../../components/shared/navbar/Navbar';
import PostFeed from '../../components/shared/post/PostFeed';
import TrendingPostsFeed from '../../components/shared/post/TrendingPostsFeed';
import FollowersFeed from '../../components/shared/post/FollowersFeed';
import CreatePostPrompt from '../../components/shared/post/CreatePostPrompt';
import { UserProfileCard } from '../../components/shared/profile';
import { TopPostsCard, RecentFollowersCard } from '../../components/shared/activity';

type FeedTab = 'home' | 'trending' | 'following';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<FeedTab>('home');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-full mx-auto px-4 py-6">
        <div className="flex gap-6 max-w-7xl mx-auto">
          {/* Left Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-6">
              <UserProfileCard />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-2xl">
            <CreatePostPrompt />

            {/* Feed Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('home')}
                  className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === 'home'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Home size={20} />
                  <span>Home</span>
                </button>
                <button
                  onClick={() => setActiveTab('following')}
                  className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === 'following'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Users size={20} />
                  <span>Following</span>
                </button>
                <button
                  onClick={() => setActiveTab('trending')}
                  className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === 'trending'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <TrendingUp size={20} />
                  <span>Trending</span>
                </button>
              </div>
            </div>

            {/* Posts Feed */}
            {activeTab === 'home' ? (
              <PostFeed useShareDropdown={true} />
            ) : activeTab === 'following' ? (
              <FollowersFeed useShareDropdown={true} />
            ) : (
              <TrendingPostsFeed useShareDropdown={true} />
            )}
          </div>

          {/* Right Sidebar */}
          <div className="hidden xl:block w-80 flex-shrink-0">
            <div className="sticky top-6 space-y-6">
              <TopPostsCard />
              <RecentFollowersCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}