import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../api';

const PremiumContext = createContext(null);

export function PremiumProvider({ children }) {
  const { user } = useAuth();
  const [premium, setPremium] = useState(false);
  const [plan, setPlan] = useState('free');
  const [features, setFeatures] = useState({});
  const [loading, setLoading] = useState(true);

  const checkPremium = useCallback(async () => {
    if (!user?.user_id) {
      setPremium(false);
      setPlan('free');
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get(`/premium/status/${user.user_id}`);
      setPremium(data.premium);
      setPlan(data.plan);
      setFeatures(data.features || {});
    } catch {
      setPremium(false);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { checkPremium(); }, [checkPremium]);

  const canUseFeature = (featureKey) => {
    if (premium) return true;
    const limit = features[featureKey];
    if (limit === undefined) return true;
    return limit === -1 || limit > 0;
  };

  return (
    <PremiumContext.Provider value={{ premium, plan, features, loading, checkPremium, canUseFeature }}>
      {children}
    </PremiumContext.Provider>
  );
}

export const usePremium = () => useContext(PremiumContext);
