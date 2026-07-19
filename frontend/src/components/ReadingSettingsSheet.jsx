import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Palette, Type } from 'lucide-react';
import {
  READING_THEMES, FONT_MIN, FONT_MAX, AR_MIN, AR_MAX,
  useReadingSettings,
} from '../services/readingSettings';

// 📖 OKUMA AYARLARI SAYFASI (alt sayfa/bottom-sheet)
// Yapı: [Önizleme] → [Tema listesi: her satır kendi paletiyle boyanır ve
// "Bu bir örnek metindir." önizlemesi taşır] → [Metin boyutu kaydırıcısı]
// → [Arapça için ayrı boyut anahtarı + kaydırıcı].
// Değişiklikler ANINDA uygulanır (İptal/Uygula yok — tek dokunuş sadeliği).
// Taşınabilir: readingSettings.js ile birlikte kopyalanıp herhangi bir
// React uygulamasına gömülebilir.

export default function ReadingSettingsSheet({ open, onClose }) {
  const { settings, theme: rt, arabicSize, set } = useReadingSettings();

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[95] flex items-end justify-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ background: 'rgba(0,0,0,0.55)' }} onClick={onClose}>
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', bounce: 0.15, duration: 0.45 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[86vh] overflow-y-auto rounded-t-3xl px-5 pt-4 pb-8"
            style={{ background: rt.surface, border: `1px solid ${rt.border}`, borderBottom: 'none' }}>

            {/* Başlık */}
            <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: `${rt.secondary}50` }} />
            <div className="flex items-center justify-between mb-4">
              <p className="text-base font-black flex items-center gap-2" style={{ color: rt.text }}>
                <Palette size={16} style={{ color: rt.accent }} /> Okuma Ayarları
              </p>
              <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center active:scale-90"
                style={{ background: `${rt.secondary}18`, color: rt.secondary }} aria-label="Kapat">
                <X size={15} />
              </button>
            </div>

            {/* Önizleme */}
            <div className="rounded-2xl p-4 mb-5 text-center" style={{ background: rt.bg, border: `1px solid ${rt.border}` }}>
              <p className="text-[9px] font-black uppercase tracking-[0.25em] mb-2" style={{ color: rt.secondary }}>Önizleme</p>
              <p style={{ fontSize: settings.fontSize, fontFamily: 'Georgia, serif', color: rt.text, lineHeight: 1.7 }}>
                Rahmân ve Rahîm olan Allah'ın adıyla
              </p>
              <p dir="rtl" className="mt-1" style={{ fontSize: arabicSize, fontFamily: "'Amiri', 'Scheherazade New', serif", color: rt.accent, lineHeight: 1.9 }}>
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
            </div>

            {/* Tema listesi */}
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2" style={{ color: rt.secondary }}>Okuma Teması</p>
            <div className="rounded-2xl overflow-hidden mb-5" style={{ border: `1px solid ${rt.border}` }}>
              {READING_THEMES.map(t => {
                const selected = settings.themeId === t.id;
                return (
                  <button key={t.id} onClick={() => set({ themeId: t.id })}
                    className="w-full py-3.5 px-4 text-center transition-all active:opacity-80 relative"
                    style={{ background: t.bg, borderBottom: `1px solid ${t.border}` }}>
                    {selected && (
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black"
                        style={{ background: t.accent, color: t.dark ? '#111' : '#fff' }}>✓</span>
                    )}
                    <p className="text-[15px] font-bold" style={{ fontFamily: 'Georgia, serif', color: t.text }}>{t.name}</p>
                    <p className="text-[11.5px] italic" style={{ fontFamily: 'Georgia, serif', color: t.secondary }}>
                      Bu <span style={{ color: t.accent }}>örnek</span> bir <span style={{ color: t.accent }}>metindir</span>.
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Metin boyutu */}
            <div className="rounded-2xl p-4 mb-4" style={{ background: rt.bg, border: `1px solid ${rt.border}` }}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-black flex items-center gap-1.5" style={{ color: rt.text }}>
                  <Type size={13} style={{ color: rt.accent }} /> Metin boyutu
                </p>
                <span className="text-[11px] font-black px-2 py-0.5 rounded-lg" style={{ background: `${rt.accent}20`, color: rt.accent }}>
                  {settings.fontSize}
                </span>
              </div>
              <input type="range" min={FONT_MIN} max={FONT_MAX} step="1" value={settings.fontSize}
                onChange={e => set({ fontSize: parseInt(e.target.value, 10) })}
                className="w-full" style={{ accentColor: rt.accent }} aria-label="Metin boyutu" />
              <div className="flex justify-between text-[9px] font-bold" style={{ color: rt.secondary }}>
                <span>Daha küçük</span><span>Varsayılan</span><span>Daha büyük</span>
              </div>
            </div>

            {/* Arapça için ayrı boyut */}
            <div className="rounded-2xl p-4" style={{ background: rt.bg, border: `1px solid ${rt.border}` }}>
              <button onClick={() => set({ arabicSeparate: !settings.arabicSeparate })}
                className="w-full flex items-center justify-between gap-3 text-left">
                <div>
                  <p className="text-xs font-black" style={{ color: rt.text }}>Arapça için ayrı boyut</p>
                  <p className="text-[10px] mt-0.5" style={{ color: rt.secondary }}>
                    {settings.arabicSeparate ? 'Arapça satır kendi boyutunu kullanır' : 'Arapça satır ana metin boyutuna uyar'}
                  </p>
                </div>
                <span className="shrink-0 w-11 h-6 rounded-full relative transition-all"
                  style={{ background: settings.arabicSeparate ? rt.accent : `${rt.secondary}35` }}>
                  <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
                    style={{ left: settings.arabicSeparate ? 22 : 2 }} />
                </span>
              </button>
              {settings.arabicSeparate && (
                <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${rt.border}` }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold" style={{ color: rt.secondary }}>Arapça boyutu</span>
                    <span className="text-[11px] font-black px-2 py-0.5 rounded-lg" style={{ background: `${rt.accent}20`, color: rt.accent }}>
                      {settings.arabicSize}
                    </span>
                  </div>
                  <input type="range" min={AR_MIN} max={AR_MAX} step="2" value={settings.arabicSize}
                    onChange={e => set({ arabicSize: parseInt(e.target.value, 10) })}
                    className="w-full" style={{ accentColor: rt.accent }} aria-label="Arapça boyutu" />
                </div>
              )}
            </div>

            <p className="text-[9px] text-center mt-4" style={{ color: rt.secondary }}>
              Ayarlar anında uygulanır ve Mushaf, Makale ve Kıssa okumalarında geçerlidir.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
