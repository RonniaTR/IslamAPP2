import { useState, useEffect } from 'react';
import { cmsContent, userStats } from '../data/cmsContent';

export function useDiscoverContent() {
  const [data, setData] = useState({
    continueLearning: [],
    forYou: [],
    popular: [],
    dailyFacts: [],
    ongoingSeries: [],
    audioContents: [],
    stories: [],
    premium: [],
    loading: true
  });

  const [stats, setStats] = useState(userStats);

  useEffect(() => {
    // Simulating API call latency
    const timer = setTimeout(() => {
      
      // 1. Continue Learning
      const continueLearning = cmsContent.filter(item => item.isContinue);
      
      // 2. For You (Recommendation Algorithm)
      // Filter items matching user's favorite tags, not marked as 'continue', and limit to top 5
      const forYou = cmsContent.filter(item => 
        !item.isContinue && 
        (item.type === 'article' || item.type === 'quiz') &&
        item.tags.some(tag => userStats.favoriteTags.includes(tag)) || item.badge === 'SANA ÖZEL'
      ).slice(0, 5);

      // 3. Popular
      const popular = cmsContent.filter(item => item.isPopular);

      // 4. Daily Facts
      const dailyFacts = cmsContent.filter(item => item.type === 'fact');

      // 5. Ongoing Series
      const ongoingSeries = cmsContent.filter(item => item.type === 'series');

      // 6. Audio Contents
      const audioContents = cmsContent.filter(item => item.type === 'audio' && !item.isContinue);

      // 7. Stories
      const stories = cmsContent.filter(item => item.type === 'story');

      // 8. Premium
      const premium = cmsContent.filter(item => item.type === 'premium');

      setData({
        continueLearning,
        forYou,
        popular,
        dailyFacts,
        ongoingSeries,
        audioContents,
        stories,
        premium,
        loading: false
      });
      
    }, 500); // 500ms delay to simulate network

    return () => clearTimeout(timer);
  }, []);

  return { data, stats };
}
