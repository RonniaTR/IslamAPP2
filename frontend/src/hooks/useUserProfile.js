import { useState, useEffect } from 'react';
import { UserService } from '../services/UserService';

export function useUserProfile(userId = 'anonymous') {
  const [profile, setProfile] = useState(null);
  const [worshipStats, setWorshipStats] = useState([]);
  const [learningJourney, setLearningJourney] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [profileData, statsData, journeyData] = await Promise.all([
          UserService.getUserProfile(userId),
          UserService.getWorshipStats(userId),
          UserService.getLearningJourney(userId)
        ]);

        setProfile(profileData);
        setWorshipStats(statsData);
        setLearningJourney(journeyData);
      } catch (e) {
        console.error('Error fetching profile data', e);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId]);

  return { profile, worshipStats, learningJourney, loading };
}
