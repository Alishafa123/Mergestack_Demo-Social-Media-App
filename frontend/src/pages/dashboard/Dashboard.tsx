import { useState } from 'react';
import { TrendingUp, Home, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Navbar from '../../components/shared/navbar/Navbar';
import PostFeed from '../../components/shared/post/PostFeed';
import TrendingPostsFeed from '../../components/shared/post/TrendingPostsFeed';
import FollowersFeed from '../../components/shared/post/FollowersFeed';
import CreatePostPrompt from '../../components/shared/post/CreatePostPrompt';
import { UserProfileCard } from '../../components/shared/profile';
import { TopPostsCard, RecentFollowersCard } from '../../components/shared/activity';

type FeedTab = 'home' | 'trending' | 'following';

interface TabConfig {
  id: FeedTab;
  label: string;
  icon: LucideIcon;
}

const tabs: TabConfig[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'following', label: 'Following', icon: Users },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<FeedTab>('home');

  const renderTabButton = (tab: TabConfig) => {
    const Icon = tab.icon;
    const isActive = activeTab === tab.id;
    
    return (
      <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id)}
        className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 font-medium transition-colors ${
          isActive
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`}
      >
        <Icon size={20} />
        <span>{tab.label}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="w-full px-2 sm:px-4 py-6">
        <div className="max-w-[3000px] mx-auto">
          <div className="flex items-start gap-6 lg:gap-12">
            <div className="hidden lg:block w-[25%] flex-shrink-0">
              <div className="sticky top-28 h-fit">
                <UserProfileCard />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <CreatePostPrompt />

             <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="flex border-b border-gray-200">
                  {tabs.map(renderTabButton)}
                </div>
              </div>

              {activeTab === 'home' ? (
                <PostFeed useShareDropdown={true} />
              ) : activeTab === 'following' ? (
                <FollowersFeed useShareDropdown={true} />
              ) : (
                <TrendingPostsFeed useShareDropdown={true} />
              )}
            </div>

            <div className="hidden xl:block w-[25%] flex-shrink-0">
              <div className="sticky top-28 h-fit space-y-6">
                <TopPostsCard />
                <RecentFollowersCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}