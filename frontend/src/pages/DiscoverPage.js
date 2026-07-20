import React from 'react';
import { useDiscoverContent } from '../hooks/useDiscoverContent';
import { DiscoverHeader } from '../components/discover/DiscoverHeader';
import { ContinueLearningRow } from '../components/discover/ContinueLearningRow';
import { VerseOfTheDayCard } from '../components/discover/VerseOfTheDayCard';
import { ForYouRow } from '../components/discover/ForYouRow';
import { QuickCategories } from '../components/discover/QuickCategories';
import { OngoingSeriesRow } from '../components/discover/OngoingSeriesRow';
import { AudioContentsRow } from '../components/discover/AudioContentsRow';
import { ChallengeAndBadgeSection } from '../components/discover/ChallengeAndBadgeSection';
import { Loader2 } from 'lucide-react';

export default function DiscoverPage() {
  const { data, stats } = useDiscoverContent();

  if (data.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#052A1E]">
        <Loader2 className="w-10 h-10 text-[#10b981] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-[#0A1A12] text-white relative font-sans">
      {/* Top massive dark emerald gradient matching the design */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-[#072F21] to-[#0A1A12] z-0 pointer-events-none" />

      {/* Islamic geometric pattern (very subtle) */}
      <div className="absolute top-0 left-0 right-0 bottom-0 opacity-5 pointer-events-none z-[1]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/arabesque.png")' }} />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col pt-8 space-y-8 max-w-4xl mx-auto">
        
        <DiscoverHeader streak={stats?.streak || 12} level={stats?.level || 12} />
        
        <ContinueLearningRow items={data.continueLearning} />
        
        <div className="px-4">
          <VerseOfTheDayCard />
        </div>

        <ForYouRow items={data.forYou} title="Sana Özel" />

        <QuickCategories items={data.categories} />

        <OngoingSeriesRow items={data.ongoingSeries} title="Devam Eden Seriler" />

        <AudioContentsRow items={data.audioContents} title="Sesli İçerikler" />

        <ChallengeAndBadgeSection />

      </div>
    </div>
  );
}