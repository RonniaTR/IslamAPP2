import { useState, useEffect } from 'react';
import { userStats } from '../data/cmsContent';
import { DiscoverService } from '../services/DiscoverService';
import { useAuth } from '../contexts/AuthContext';

export function useDiscoverContent() {
  const { user } = useAuth();
  const [data, setData] = useState({
    continueLearning: [],
    forYou: [],
    popular: [],
    dailyFacts: [],
    ongoingSeries: [],
    audioContents: [],
    stories: [],
    premium: [],
    categories: [],
    loading: true
  });

  const [stats, setStats] = useState(userStats);

  useEffect(() => {
    const fetchDynamicContent = async () => {
      try {
        const userId = user?.uid || 'anonymous';
        const feedData = await DiscoverService.getDiscoverFeed(userId);
        
        setData({
          continueLearning: feedData.continueLearning || [],
          forYou: feedData.forYou || [],
          popular: feedData.popular || [],
          dailyFacts: feedData.dailyFacts || [],
          ongoingSeries: feedData.ongoingSeries || [],
          audioContents: feedData.audioContents || [],
          stories: feedData.stories || [],
          premium: feedData.premium || [],
          categories: feedData.categories || [],
          loading: false
        });
      } catch (err) {
        console.error('Error fetching discover feed from Firebase', err);
        setData(prev => ({ ...prev, loading: false }));
      }
    };

    fetchDynamicContent();
  }, []);

  return { data, stats };
}
