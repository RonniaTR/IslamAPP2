import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api';

const LangContext = createContext(null);

const LANGUAGES = [
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem('app_lang') || 'tr');
  const [t, setT] = useState({});
  const [defaultCountry, setDefaultCountry] = useState('TR');
  const [selectedCity, setSelectedCityState] = useState(() => localStorage.getItem('app_city') || 'istanbul');

  const loadTranslations = useCallback(async (langCode) => {
    try {
      const { data } = await api.get(`/i18n/${langCode}`);
      setT(data.translations);
      setDefaultCountry(data.default_country);
    } catch {
      setT({});
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
    <LangContext.Provider value={{ lang, setLang, t, defaultCountry, selectedCity, setSelectedCity, LANGUAGES }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
