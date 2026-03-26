import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLang } from '../contexts/LangContext';

const duaTexts = {
  tr: {
    title: 'Okumaya Başlamadan Önce',
    taawwudh: 'Eûzü billâhi mineş-şeytânir-racîm',
    taawwudhMeaning: 'Kovulmuş şeytanın şerrinden Allah\'a sığınırım.',
    basmala: 'Bismillâhir-rahmânir-rahîm',
    basmalaMeaning: 'Rahman ve Rahim olan Allah\'ın adıyla.',
    dua: 'Allah\'ım! Kur\'an-ı Kerim ile gönlümü aç, işlerimi kolaylaştır, dilimi çöz ki ayetlerini anlayayım.',
    begin: 'Okumaya Başla',
    skip: 'Atla',
  },
  en: {
    title: 'Before You Begin Reading',
    taawwudh: 'A\'udhu billahi minash-shaytanir-rajim',
    taawwudhMeaning: 'I seek refuge in Allah from the accursed Satan.',
    basmala: 'Bismillahir-Rahmanir-Rahim',
    basmalaMeaning: 'In the name of Allah, the Most Gracious, the Most Merciful.',
    dua: 'O Allah, open my heart with the Quran, ease my affairs, and untie my tongue so I may understand Your verses.',
    begin: 'Begin Reading',
    skip: 'Skip',
  },
  ar: {
    title: 'قبل البدء بالقراءة',
    taawwudh: 'أعوذ بالله من الشيطان الرجيم',
    taawwudhMeaning: 'أستعيذ بالله من الشيطان الرجيم.',
    basmala: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    basmalaMeaning: 'بسم الله الرحمن الرحيم.',
    dua: 'اللّهمّ افتح لي بالقرآن قلبي، ويسّر لي أموري، واحلل عقدة من لساني يفقهوا قولي.',
    begin: 'ابدأ القراءة',
    skip: 'تخطّي',
  },
};

export default function PreReadingDua({ show, onClose }) {
  const { theme } = useTheme();
  const { lang } = useLang();
  const texts = duaTexts[lang] || duaTexts.tr;
  const isRTL = lang === 'ar';

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="quran-dua-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="animate-dua-enter relative max-w-md w-[92%] mx-auto rounded-3xl overflow-hidden"
            style={{
              background: `linear-gradient(170deg, ${theme.surface}f0 0%, ${theme.bg}f5 100%)`,
              border: `1px solid ${theme.gold}20`,
              boxShadow: `0 0 60px rgba(212,175,55,0.08), 0 25px 50px rgba(0,0,0,0.4)`,
              direction: isRTL ? 'rtl' : 'ltr',
            }}
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Decorative top line */}
            <div className="h-1 w-full" style={{
              background: `linear-gradient(90deg, transparent, ${theme.gold}60, transparent)`
            }} />

            {/* Geometric corner accents */}
            <div className="absolute top-4 left-4 w-8 h-8 opacity-20" style={{
              border: `1px solid ${theme.gold}`,
              borderRadius: '4px',
              transform: 'rotate(45deg)',
            }} />
            <div className="absolute top-4 right-4 w-8 h-8 opacity-20" style={{
              border: `1px solid ${theme.gold}`,
              borderRadius: '4px',
              transform: 'rotate(45deg)',
            }} />

            <div className="p-6 pt-8">
              {/* Title */}
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{
                  background: `linear-gradient(135deg, ${theme.gold}25, ${theme.gold}10)`,
                  border: `1px solid ${theme.gold}20`,
                }}>
                  <BookOpen size={22} style={{ color: theme.gold }} />
                </div>
                <h2 className="text-lg font-bold" style={{
                  color: theme.gold,
                  fontFamily: 'Playfair Display, serif',
                }}>{texts.title}</h2>
              </div>

              {/* Ta'awwudh */}
              <div className="text-center mb-5">
                <p className="font-arabic text-2xl mb-2 leading-relaxed" style={{
                  color: theme.gold,
                  direction: 'rtl',
                  fontFamily: 'Amiri, serif',
                }}>أعوذ بالله من الشيطان الرجيم</p>
                <p className="text-xs italic mb-1" style={{ color: theme.textSecondary }}>{texts.taawwudh}</p>
                <p className="text-xs" style={{ color: theme.textSecondary }}>{texts.taawwudhMeaning}</p>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px" style={{ background: `${theme.gold}15` }} />
                <div className="w-2 h-2 rounded-full" style={{ background: `${theme.gold}30` }} />
                <div className="flex-1 h-px" style={{ background: `${theme.gold}15` }} />
              </div>

              {/* Basmala */}
              <div className="text-center mb-5">
                <p className="font-arabic text-3xl mb-2 leading-relaxed" style={{
                  color: `${theme.textPrimary}ee`,
                  direction: 'rtl',
                  fontFamily: 'Amiri, serif',
                }}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                <p className="text-xs italic mb-1" style={{ color: theme.textSecondary }}>{texts.basmala}</p>
                <p className="text-xs" style={{ color: theme.textSecondary }}>{texts.basmalaMeaning}</p>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px" style={{ background: `${theme.gold}15` }} />
                <div className="w-1.5 h-1.5 rounded-sm transform rotate-45" style={{ background: `${theme.gold}30` }} />
                <div className="flex-1 h-px" style={{ background: `${theme.gold}15` }} />
              </div>

              {/* Dua */}
              <div className="text-center mb-6 px-2">
                <p className="text-sm leading-relaxed" style={{ color: theme.textPrimary }}>{texts.dua}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-2xl text-sm font-semibold transition-all active:scale-[0.97]"
                  style={{
                    background: `linear-gradient(135deg, ${theme.gold}, ${theme.goldLight || theme.gold}dd)`,
                    color: '#0A1F14',
                    boxShadow: `0 4px 20px ${theme.gold}30`,
                  }}
                >
                  {texts.begin}
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-3 rounded-2xl text-sm transition-all active:scale-[0.97]"
                  style={{
                    background: `${theme.gold}08`,
                    color: theme.textSecondary,
                    border: `1px solid ${theme.gold}15`,
                  }}
                >
                  {texts.skip}
                </button>
              </div>
            </div>

            {/* Bottom decorative line */}
            <div className="h-0.5 w-full" style={{
              background: `linear-gradient(90deg, transparent, ${theme.gold}30, transparent)`
            }} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
