import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useDiscoverContent } from '../hooks/useDiscoverContent';
import { Typography } from '../components/ui/Typography';

import { DiscoverHeader } from '../components/discover/DiscoverHeader';
import { ContinueLearningRow } from '../components/discover/ContinueLearningRow';
import { VerseOfTheDayCard } from '../components/discover/VerseOfTheDayCard';
import { HadithOfTheDayCard } from '../components/discover/HadithOfTheDayCard';
import { ForYouRow } from '../components/discover/ForYouRow';
import { QuickCategories } from '../components/discover/QuickCategories';
import { OngoingSeriesRow } from '../components/discover/OngoingSeriesRow';
import { AudioContentsRow } from '../components/discover/AudioContentsRow';
import { DailyChallengeSection } from '../components/discover/DailyChallengeSection';
import { DailyFactsRow } from '../components/discover/DailyFactsRow';
import { AIRecommendationBanner } from '../components/discover/AIRecommendationBanner';
import { WeeklyChallengeCard } from '../components/discover/WeeklyChallengeCard';
import { UpcomingEventsRow } from '../components/discover/UpcomingEventsRow';
import { StoriesRow } from '../components/discover/StoriesRow';
import { PremiumContentRow } from '../components/discover/PremiumContentRow';

export default function DiscoverPage() {
  const { theme } = useTheme();
  const { data, stats } = useDiscoverContent();

  if (data.loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#052A1E' }}>
        <Typography variant="h3" style={{ color: '#CDA434' }}>İçerikler Yükleniyor...</Typography>
      </div>
    );
  }

  return (
    <div 
      style={{ 
        minHeight: '100vh', 
        paddingBottom: '120px',
        background: '#052A1E', // Very dark green background as requested
        position: 'relative'
      }}
      data-testid="discover-page"
    >
      {/* Top massive dark emerald gradient */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, height: '400px',
        background: 'linear-gradient(to bottom, #031c13 0%, #052A1E 100%)',
        zIndex: 0
      }} />

      {/* Islamic geometric pattern (3% opacity) */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/arabesque.png")', // Free subtle pattern
        opacity: 0.03,
        zIndex: 1,
        pointerEvents: 'none'
      }} />

      {/* Content Container */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column' }}>
        
        <DiscoverHeader streak={stats.streak} level={stats.level} />
        
        <ContinueLearningRow items={data.continueLearning} />
        
        <AIRecommendationBanner stats={stats} />

        <VerseOfTheDayCard />

        <ForYouRow items={data.forYou} title="Sana Özel Öneriler" />

        <ForYouRow items={data.popular} title="Bugün Popüler" viewAll={false} />

        <QuickCategories />

        <HadithOfTheDayCard />

        <DailyFactsRow items={data.dailyFacts} />
        
        <DailyChallengeSection />

        <WeeklyChallengeCard stats={stats} />

        <OngoingSeriesRow items={data.ongoingSeries} title="Seriler" />

        <AudioContentsRow items={data.audioContents} title="Dinlemeye Devam Et" />

        <StoriesRow items={data.stories} />

        <UpcomingEventsRow />

        <PremiumContentRow items={data.premium} />

      </div>
    </div>
  );
}