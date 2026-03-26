import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api';

const LangContext = createContext(null);

const LANGUAGES = [
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷', dir: 'ltr' },
  { code: 'en', name: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
];

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem('app_lang') || 'tr');
  const [t, setT] = useState({});
  const [defaultCountry, setDefaultCountry] = useState('TR');
  const [selectedCity, setSelectedCityState] = useState(() => localStorage.getItem('app_city') || 'istanbul');
  const [direction, setDirection] = useState('ltr');

  const loadTranslations = useCallback(async (langCode) => {
    let base = {};
    // Always load v1 first (has basic keys: home, quran, hadith, etc.)
    try {
      const { data } = await api.get(`/i18n/${langCode}`);
      base = data.translations || data || {};
      setDefaultCountry(data.default_country || (langCode === 'ar' ? 'SA' : langCode === 'en' ? 'US' : 'TR'));
      const dir = langCode === 'ar' ? 'rtl' : 'ltr';
      setDirection(dir);
      document.documentElement.dir = dir;
    } catch { /* v1 failed, continue */ }

    // Then overlay v2 keys (premium, gamification, tafsir, etc.)
    try {
      const { data } = await api.get(`/i18n/v2/${langCode}`);
      const v2 = data.translations || data || {};
      base = { ...base, ...v2 };
      if (data.direction) {
        setDirection(data.direction);
        document.documentElement.dir = data.direction;
      }
      if (data.default_country) setDefaultCountry(data.default_country);
      if (data.font_family) {
        document.documentElement.style.setProperty('--app-font', data.font_family);
      }
    } catch { /* v2 failed, use v1 only */ }

    setT(base);
  }, []);

  useEffect(() => { loadTranslations(lang); }, [lang, loadTranslations]);

  const setLang = (newLang) => {
    setLangState(newLang);
    localStorage.setItem('app_lang', newLang);
  };

  const setSelectedCity = (cityId) => {
    setSelectedCityState(cityId);
    localStorage.setItem('app_city', cityId);
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t, defaultCountry, selectedCity, setSelectedCity, LANGUAGES, direction }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
