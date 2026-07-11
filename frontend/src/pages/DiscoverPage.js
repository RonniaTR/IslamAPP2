import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const SECTIONS = [
  {
    title: '🎮 Oyun & Yarışma',
    items: [
      { path: '/games', icon: '🎡', title: 'Çarkıfelek', desc: 'Çevir, soruyu bil, XP kazan', color: '#10B981' },
      { path: '/games', icon: '🔤', title: 'Kelime Tamamlama', desc: 'İpucundan İslami terimi bul', color: '#8B5CF6' },
      { path: '/games', icon: '⚡', title: 'Hızlı Bilgi', desc: '60 saniyede bilgi maratonu', color: '#F59E0B' },
      { path: '/games', icon: '🔗', title: 'Eşleştirme', desc: 'Terimi anlamıyla eşleştir', color: '#06B6D4' },
    ],
  },
  {
    title: 'İbadet & İlim',
    items: [
      { path: '/fiqh', icon: '⚖️', title: 'İslami Bilgi (Fıkıh)', desc: 'Abdest, namaz, oruç rehberi', color: '#10B981' },
      { path: '/dhikr', icon: '📿', title: 'Zikir & Tesbih', desc: 'Günlük zikir takibi', color: '#8B5CF6' },
      { path: '/qibla', icon: '🧭', title: 'Kıble Pusulası', desc: 'Kıble yönünü bul', color: '#F59E0B' },
      { path: '/scholars', icon: '📚', title: 'Âlimlerle Sohbet', desc: 'AI destekli âlim görüşleri', color: '#3B82F6' },
    ],
  },
  {
    title: 'Kur\'an & Hadis',
    items: [
      { path: '/library', icon: '📚', title: 'Makale Kütüphanesi', desc: 'Okudukça derinleşen yazılar', color: '#10B981' },
      { path: '/quran', icon: '📖', title: 'Kur\'an-ı Kerim', desc: 'Arapça metin + Türkçe meal', color: '#C8A55A' },
      { path: '/hadith', icon: '📜', title: 'Hadis-i Şerifler', desc: 'Buhari, Müslim koleksiyonu', color: '#EF4444' },
      { path: '/bookmarks', icon: '🔖', title: 'Yer İmleri & Cüz', desc: 'Okuma takibi', color: '#6366F1' },
    ],
  },
  {
    title: 'Yapay Zeka & Eğitim',
    items: [
      { path: '/chat', icon: '🤖', title: 'İslami AI Sohbet', desc: 'Sorularına yapay zeka cevabı', color: '#06B6D4' },
      { path: '/games', icon: '🏆', title: 'Oyun Modu', desc: '4 oyunla XP kazan, seviye atla', color: '#F97316' },
      { path: '/comparative', icon: '📊', title: 'Karşılaştırmalı Dinler', desc: 'İslam, Hristiyanlık, Yahudilik', color: '#10B981' },
    ],
  },
  {
    title: 'Diğer',
    items: [
      { path: '/ramadan', icon: '🌙', title: 'Ramazan Özel', desc: 'İftar, sahur, dualar', color: '#C8A55A' },
      { path: '/profile', icon: '👤', title: 'Profil & Rozetler', desc: 'Seviye, istatistikler', color: '#8B5CF6' },
      { path: '/notes', icon: '📝', title: 'Notlarım', desc: 'Kişisel notlar', color: '#3B82F6' },
    ],
  },
];

export default function DiscoverPage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-24" style={{ background: theme.bg }}>
      {/* Header */}
      <div className="px-5 pt-6 pb-3">
        <div className="flex items-center gap-2 mb-1">
          <Compass size={22} style={{ color: theme.gold }} />
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: theme.textPrimary }}>Keşfet</h1>
        </div>
        <p className="text-xs" style={{ color: theme.textSecondary }}>Tüm özellikler ve İslami ilim yolculuğun</p>
      </div>

      {/* Feature Sections */}
      <div className="px-5 space-y-5">
        {SECTIONS.map((section, si) => (
          <div key={si}>
            <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: theme.textSecondary }}>{section.title}</p>
            <div className="space-y-2">
              {section.items.map((item, i) => (
                <motion.button key={item.path}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: si * 0.05 + i * 0.03 }}
                  onClick={() => navigate(item.path)}
                  className="w-full text-left rounded-2xl p-3.5 flex items-center gap-3 active:scale-[0.98] transition-transform"
                  style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}` }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: `${item.color}12` }}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" style={{ color: theme.textPrimary }}>{item.title}</p>
                    <p className="text-xs" style={{ color: theme.textSecondary }}>{item.desc}</p>
                  </div>
                  <ChevronRight size={16} style={{ color: theme.textSecondary }} />
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}