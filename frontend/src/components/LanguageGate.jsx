import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { useLang } from '../contexts/LangContext';

// 🌍 İLK AÇILIŞ DİL SEÇİCİ
// Uygulama ilk kez açıldığında (app_lang henüz seçilmemişse) tek seferlik
// bir dil ekranı gösterir. Cihaz diline göre bir seçenek önerilir; kullanıcı
// onaylayınca tercih kaydedilir ve ekran bir daha görünmez.
// Ayarlar > Dil bölümünden her zaman değiştirilebilir.

const PICKED_KEY = 'app_lang_picked';

// Her dilin kendi dilinde yazılmış metinleri (sözlüğe bağımlı değil —
// kullanıcı henüz dili seçmediği için sözlük doğru dili bilemez).
const COPY = {
  tr: { title: 'Dilinizi seçin', sub: 'Daha sonra Ayarlar’dan değiştirebilirsiniz', cta: 'Devam Et', suggested: 'Önerilen' },
  en: { title: 'Choose your language', sub: 'You can change this later in Settings', cta: 'Continue', suggested: 'Suggested' },
  ar: { title: 'اختر لغتك', sub: 'يمكنك تغييرها لاحقًا من الإعدادات', cta: 'متابعة', suggested: 'مقترح' },
};

/** Tarayıcı dilinden desteklenen bir dil koduna eşle. */
function detectLang(supported) {
  try {
    const candidates = [navigator.language, ...(navigator.languages || [])].filter(Boolean);
    for (const c of candidates) {
      const base = String(c).toLowerCase().split('-')[0];
      if (supported.includes(base)) return base;
    }
  } catch { /* ignore */ }
  return 'tr';
}

export default function LanguageGate() {
  const { lang, setLang, LANGUAGES } = useLang();
  const codes = useMemo(() => LANGUAGES.map(l => l.code), [LANGUAGES]);
  const suggested = useMemo(() => detectLang(codes), [codes]);

  const [open, setOpen] = useState(() => {
    try {
      // Daha önce dil seçilmişse (veya eski kurulumda app_lang varsa) gösterme
      return !localStorage.getItem(PICKED_KEY) && !localStorage.getItem('app_lang');
    } catch { return false; }
  });
  const [choice, setChoice] = useState(suggested);

  // Öneri hesaplandıktan sonra seçimi hizala
  useEffect(() => { setChoice(suggested); }, [suggested]);

  if (!open) return null;

  const copy = COPY[choice] || COPY.tr;
  const isRTL = choice === 'ar';

  const confirm = () => {
    try { localStorage.setItem(PICKED_KEY, '1'); } catch { /* quota */ }
    if (choice !== lang) setLang(choice);
    setOpen(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center px-6"
        style={{ background: '#04150d' }}
        dir={isRTL ? 'rtl' : 'ltr'}
        data-testid="language-gate">
        <motion.div
          initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 22 }}
          className="w-full max-w-sm">
          <div className="text-center mb-8">
            <span className="text-5xl block mb-4">🌙</span>
            <h1 className="text-2xl font-black mb-1.5" style={{ fontFamily: 'Playfair Display, serif', color: '#f7e6ae' }}>
              {copy.title}
            </h1>
            <p className="text-xs" style={{ color: '#A8B5A0' }}>{copy.sub}</p>
          </div>

          <div className="space-y-2.5 mb-7">
            {LANGUAGES.map((l) => {
              const active = choice === l.code;
              return (
                <button key={l.code} onClick={() => setChoice(l.code)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all active:scale-[0.98]"
                  style={{
                    background: active ? 'rgba(255,211,105,0.12)' : 'rgba(255,255,255,0.04)',
                    border: `1.5px solid ${active ? 'rgba(255,211,105,0.55)' : 'rgba(255,255,255,0.08)'}`,
                  }}>
                  <span className="text-2xl">{l.flag}</span>
                  <span className="flex-1 text-start text-sm font-bold" style={{ color: active ? '#ffd369' : '#F5F5DC' }}>
                    {l.name}
                  </span>
                  {l.code === suggested && !active && (
                    <span className="text-[9px] font-bold px-2 py-1 rounded-full"
                      style={{ background: 'rgba(255,211,105,0.12)', color: '#ffd369' }}>
                      {(COPY[l.code] || COPY.tr).suggested}
                    </span>
                  )}
                  {active && (
                    <span className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#ffd369' }}>
                      <Check size={14} color="#04150d" strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button onClick={confirm}
            className="w-full py-4 rounded-2xl font-black text-base active:scale-[0.98] transition-transform"
            style={{ background: 'linear-gradient(135deg, #ffd369, #d4af37)', color: '#04150d' }}>
            {copy.cta}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
