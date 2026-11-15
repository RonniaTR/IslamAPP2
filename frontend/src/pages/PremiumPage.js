import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Check, Share2, AlertTriangle, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useTx } from '../i18n';
import { TYPOGRAPHY } from '../styles/designTokens';

// 🤝 DESTEKÇİ SAYFASI (eski "Nur Premium")
//
// Uygulama tamamen ücretsizdir; bu sayfa hiçbir şeyi kilitlemez ve ödeme almaz
// (docs/YENI_OZELLIKLER.md 0.5). Destek = paylaşmak ve hata bildirmek.
// Bağış ileride eklenecekse önce mağaza kuralları araştırılır.
const SUPPORT_MAIL = 'mailto:?subject=IslamAPP%20geri%20bildirim';

export default function PremiumPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const tt = useTx();
  const [copied, setCopied] = useState(false);

  const promises = [
    'Bütün özellikler ücretsiz',
    'Reklam yok',
    'Hesap açmak zorunlu değil',
    'Verileriniz cihazınızda kalır',
  ];

  const share = async () => {
    const url = window.location.origin;
    const text = tt('Ücretsiz ve reklamsız bir İslami yaşam uygulaması:');
    try {
      if (navigator.share) await navigator.share({ title: 'IslamAPP', text, url });
      else { await navigator.clipboard.writeText(`${text} ${url}`); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    } catch { /* kullanıcı vazgeçti */ }
  };

  return (
    <div className="min-h-screen pb-12 flex flex-col" style={{ background: theme.primary }} data-testid="supporter-page">
      <div className="flex items-center px-4 pt-6 pb-4">
        <button onClick={() => navigate(-1)} className="p-2 transition-opacity hover:opacity-70" aria-label={tt('Geri')}>
          <ChevronLeft size={24} color="#FFF" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center px-6 mt-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 rounded-[32px] flex items-center justify-center mb-6"
          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
          <span className="text-5xl" aria-hidden>🤝</span>
        </motion.div>

        <h1 className="text-3xl font-extrabold text-white mb-2 text-center" style={{ fontFamily: TYPOGRAPHY.fonts.heading }}>
          {tt('Herkese ücretsiz')}
        </h1>
        <p className="text-[13px] font-medium text-white/70 mb-10 text-center max-w-xs">
          {tt('Bu uygulamada kilitli özellik, abonelik ya da reklam yoktur ve olmayacak.')}
        </p>

        <div className="w-full flex flex-col gap-5 mb-12">
          {promises.map((p) => (
            <div key={p} className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: theme.gold }}>
                <Check size={16} color="#000" strokeWidth={3} />
              </div>
              <span className="text-[15px] font-semibold text-white/90">{tt(p)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 mt-auto flex flex-col gap-3">
        <p className="text-[12px] text-white/60 text-center mb-1">{tt('Destek olmak istersen:')}</p>
        <button onClick={share}
          className="w-full py-4 rounded-[20px] font-bold text-base flex items-center justify-center gap-2 active:scale-95 transition-transform"
          style={{ background: theme.gold, color: '#000' }}>
          <Share2 size={18} /> {copied ? tt('Bağlantı kopyalandı') : tt('Bir yakınınla paylaş')}
        </button>
        <a href={SUPPORT_MAIL}
          className="w-full py-3 rounded-[20px] font-semibold text-sm flex items-center justify-center gap-2 text-white"
          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
          <AlertTriangle size={16} /> {tt('Hata ya da yanlış bilgi bildir')}
        </a>
        <button onClick={() => navigate('/licenses')}
          className="w-full py-2 text-[13px] font-semibold text-white/70 flex items-center justify-center gap-2 underline underline-offset-4">
          <FileText size={14} /> {tt('Kaynaklar ve lisanslar')}
        </button>
      </div>
    </div>
  );
}
