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
    try {
      // Try Phase 3 v2 translations first (deeper coverage)
      const { data } = await api.get(`/i18n/v2/${langCode}`);
      setT(data.translations);
      setDefaultCountry(data.default_country || (langCode === 'ar' ? 'SA' : langCode === 'en' ? 'US' : 'TR'));
      setDirection(data.direction || 'ltr');
      document.documentElement.dir = data.direction || 'ltr';
      if (data.font_family) {
        document.documentElement.style.setProperty('--app-font', data.font_family);
      }
    } catch {
      try {
        // Fallback to Phase 1 translations
        const { data } = await api.get(`/i18n/${langCode}`);
        setT(data.translations);
        setDefaultCountry(data.default_country);
        const dir = langCode === 'ar' ? 'rtl' : 'ltr';
        setDirection(dir);
        document.documentElement.dir = dir;
      } catch {
        setT({});
      }
    }
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
