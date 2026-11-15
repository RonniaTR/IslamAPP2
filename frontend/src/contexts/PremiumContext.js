import React, { createContext, useContext } from 'react';

// 🎁 TAMAMEN ÜCRETSİZ MODEL (docs/YENI_OZELLIKLER.md 0.5)
//
// Karar: her özellik herkese ücretsiz, reklam yok, giriş zorunlu değil.
// Bu bağlam yalnız eski çağrılar bozulmasın diye duruyor: `canUseFeature` her zaman true döner,
// sunucuya `/premium/status` isteği atılmaz. Yeni kodda usePremium KULLANILMAZ; hiçbir özellik
// bir ödeme koşuluna bağlanmaz.
const FREE = {
  premium: true,          // "kilitli mi?" diye bakan eski kod için: hiçbir şey kilitli değil
  plan: 'free',
  features: {},
  loading: false,
  checkPremium: async () => {},
  canUseFeature: () => true,
};

const PremiumContext = createContext(FREE);

export function PremiumProvider({ children }) {
  return <PremiumContext.Provider value={FREE}>{children}</PremiumContext.Provider>;
}

export const usePremium = () => useContext(PremiumContext);
