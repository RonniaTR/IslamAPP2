import React from 'react';
import ReactDOM from 'react-dom/client';
import { Capacitor } from '@capacitor/core';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// SERVİS ÇALIŞANI (çevrimdışı önbellek) — yalnız WEB sürümünde.
// Telefon uygulamasında dosyalar zaten paketin içindedir; servis çalışanı orada eski sürümü önbellekten
// sunup güncellemeleri gizleyebilirdi. Bu yüzden telefonda kaydedilmez, önceden kaydedilmişse kaldırılır.
if ('serviceWorker' in navigator) {
  if (Capacitor.isNativePlatform()) {
    navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister())).catch(() => {});
  } else {
    window.addEventListener('load', () => {
      // İlk kurulumda da "controllerchange" gelir; o anda sayfayı yenilemek açılış sahnesini yarıda kesiyordu.
      // Yalnız GÜNCELLEMEDE (önceden bir servis çalışanı varken) yenilenir.
      const hadController = !!navigator.serviceWorker.controller;
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!hadController || refreshing) return;
        refreshing = true;
        window.location.reload();
      });
      navigator.serviceWorker.register('/sw.js').then((registration) => {
        registration.update().catch(() => {});
      }).catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
    });
  }
}
