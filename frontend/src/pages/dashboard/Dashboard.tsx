import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, Home, Users } from 'lucide-react';

import Feed from '@components/shared/post/Feed';
import Navbar from '@components/shared/navbar/Navbar';
import Button from '@components/shared/buttons/Button';
import { UserProfileCard } from '@components/shared/profile';
import { StatsModal, LatestModal } from '@components/shared/modals';
import CreatePostPrompt from '@components/shared/post/CreatePostPrompt';
import { TopPostsCard, RecentFollowersCard } from '@components/shared/activity';

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
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showLatestModal, setShowLatestModal] = useState(false);

  const handleStatsClick = () => {
    setShowStatsModal(true);
  };

  const handleLatestClick = () => {
    setShowLatestModal(true);
  };

  const renderTabButton = (tab: TabConfig) => {
    const Icon = tab.icon;
    const isActive = activeTab === tab.id;

    return (
      <Button
        key={tab.id}
        variant="tab"
        size="lg"
        leftIcon={<Icon size={16} className="sm:w-5 sm:h-5" />}
        onClick={() => setActiveTab(tab.id)}
        className={`flex-1 min-w-0 px-2 sm:px-4 md:px-6 text-xs sm:text-sm md:text-base ${
          isActive ? 'text-blue-600 border-blue-600 bg-blue-50 hover:bg-blue-100' : 'border-transparent'
        }`}
        aria-pressed={isActive}
        role="tab"
      >
        <span className="truncate">{tab.label}</span>
      </Button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onStatsClick={handleStatsClick} onLatestClick={handleLatestClick} />

      <div className="w-full px-1 sm:px-2 md:px-4 py-4 sm:py-6">
        <div className="max-w-[3000px] mx-auto">
          <div className="flex items-start gap-2 sm:gap-4 lg:gap-6 xl:gap-12">
            <div className="hidden lg:block w-[25%] flex-shrink-0">
              <div className="fixed w-[25%] top-28 h-fit">
                <UserProfileCard />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <CreatePostPrompt />

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 sm:mb-6">
                <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">{tabs.map(renderTabButton)}</div>
              </div>

              {activeTab === 'home' ? (
                <Feed feedType="general" />
              ) : activeTab === 'following' ? (
                <Feed feedType="followers" />
              ) : (
                <Feed feedType="trending" />
              )}
            </div>

            <div className="hidden xl:block w-[25%] flex-shrink-0">
              <div className="fixed w-[25%] top-28 h-fit space-y-6">
                <TopPostsCard />
                <RecentFollowersCard />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <StatsModal isOpen={showStatsModal} onClose={() => setShowStatsModal(false)} />
      <LatestModal isOpen={showLatestModal} onClose={() => setShowLatestModal(false)} />
    </div>
  );
}
