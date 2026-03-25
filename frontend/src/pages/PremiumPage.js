import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, Check, Lock, Sparkles, Star, BookOpen, Shield, Zap, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePremium } from '../contexts/PremiumContext';
import { useTheme } from '../contexts/ThemeContext';
import api from '../api';

const FEATURES = [
  { icon: Sparkles, title: 'Sınırsız AI Müftü', desc: 'Günlük limit olmadan İslami sorular sorun', free: '5/gün', premium: 'Sınırsız' },
  { icon: BookOpen, title: 'Tefsir Karşılaştırma', desc: '5 alimin yorumunu karşılaştırın', free: '1 alim', premium: '5 alim' },
  { icon: Shield, title: 'Offline Kur\'an', desc: 'İnternet olmadan da Kur\'an okuyun', free: '—', premium: '✓' },
  { icon: Zap, title: 'Reklamsız', desc: 'Tamamen reklamsız deneyim', free: '—', premium: '✓' },
  { icon: Star, title: 'Günlük Görevler', desc: 'Daha fazla günlük görev ve XP', free: '2/gün', premium: 'Sınırsız' },
  { icon: Crown, title: 'AI Bildirimler', desc: 'Kişisel AI destekli bildirimler', free: '—', premium: '✓' },
];

export default function PremiumPage() {
  const { user } = useAuth();
  const { premium, checkPremium } = usePremium();
  const { theme } = useTheme();
  const [plans, setPlans] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    api.get('/premium/plans').then(r => setPlans(r.data)).catch(() => {});
  }, []);

  const handleSubscribe = async () => {
    setProcessing(true);
    try {
      await api.post('/premium/activate', {
        user_id: user?.user_id,
        plan_type: selectedPlan,
        payment_id: `demo_${Date.now()}`,
      });
      await checkPremium();
    } catch {} finally {
      setProcessing(false);
    }
  };

  if (premium) {
    return (
      <div className="min-h-screen pb-20" style={{ background: theme.bg }}>
        <div className="px-5 pt-10 pb-6 text-center" style={{ background: `linear-gradient(180deg, ${theme.gold}15 0%, transparent 100%)` }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 15 }}
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: `linear-gradient(135deg, ${theme.gold}, ${theme.goldLight})` }}>
            <Crown size={36} className="text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold" style={{ color: theme.textPrimary, fontFamily: 'Playfair Display, serif' }}>Premium Üye</h1>
          <p className="text-sm mt-2" style={{ color: theme.textSecondary }}>Tüm özelliklerin kilidi açık</p>
        </div>
        <div className="px-4 space-y-3 mt-4">
          {FEATURES.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
              className="flex items-center gap-3 p-3 rounded-xl" style={{ background: theme.cardBg, border: `1px solid ${theme.gold}20` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${theme.gold}20` }}>
                <f.icon size={18} style={{ color: theme.gold }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: theme.textPrimary }}>{f.title}</p>
                <p className="text-[10px]" style={{ color: theme.textSecondary }}>{f.desc}</p>
              </div>
              <Check size={16} style={{ color: theme.gold }} />
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  const premiumPlan = plans?.premium;

  return (
    <div className="min-h-screen pb-20" style={{ background: theme.bg }}>
      {/* Header */}
      <div className="px-5 pt-10 pb-6 text-center" style={{ background: `linear-gradient(180deg, ${theme.gold}15 0%, transparent 100%)` }}>
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3"
          style={{ background: `linear-gradient(135deg, ${theme.gold}40, ${theme.gold}20)` }}>
          <Crown size={28} style={{ color: theme.gold }} />
        </motion.div>
        <h1 className="text-xl font-bold" style={{ color: theme.textPrimary, fontFamily: 'Playfair Display, serif' }}>Premium'a Geç</h1>
        <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>İslami yolculuğunuzu üst seviyeye taşıyın</p>
      </div>

      {/* Plan Toggle */}
      <div className="mx-4 mt-4 flex rounded-xl p-1" style={{ background: theme.inputBg }}>
        {['monthly', 'yearly'].map(p => (
          <button key={p} onClick={() => setSelectedPlan(p)}
            className="flex-1 py-2 rounded-lg text-xs font-medium transition-all relative"
            style={selectedPlan === p ? { background: theme.gold, color: '#fff' } : { color: theme.textSecondary }}>
            {p === 'monthly' ? 'Aylık' : 'Yıllık'}
            {p === 'yearly' && <span className="absolute -top-2 right-1 text-[8px] px-1.5 py-0.5 rounded-full bg-red-500 text-white">-33%</span>}
          </button>
        ))}
      </div>

      {/* Price */}
      <div className="text-center mt-5">
        <motion.div key={selectedPlan} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <span className="text-3xl font-bold" style={{ color: theme.gold }}>
            ₺{selectedPlan === 'monthly' ? premiumPlan?.price_monthly || '49.99' : premiumPlan?.price_yearly || '399.99'}
          </span>
          <span className="text-xs ml-1" style={{ color: theme.textSecondary }}>/{selectedPlan === 'monthly' ? 'ay' : 'yıl'}</span>
        </motion.div>
        {selectedPlan === 'yearly' && (
          <p className="text-[10px] mt-1" style={{ color: theme.gold }}>Aylık ₺33.33 — %33 tasarruf</p>
        )}
      </div>

      {/* Features Comparison */}
      <div className="px-4 mt-6 space-y-2">
        {FEATURES.map((f, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}
            className="flex items-center gap-3 p-3 rounded-xl" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${theme.gold}15` }}>
              <f.icon size={16} style={{ color: theme.gold }} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold" style={{ color: theme.textPrimary }}>{f.title}</p>
              <p className="text-[9px]" style={{ color: theme.textSecondary }}>{f.desc}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] line-through" style={{ color: theme.textSecondary }}>{f.free}</p>
              <p className="text-[10px] font-semibold" style={{ color: theme.gold }}>{f.premium}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <div className="px-4 mt-6">
        <motion.button whileTap={{ scale: 0.97 }} onClick={handleSubscribe} disabled={processing}
          className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm text-white disabled:opacity-50"
          style={{ background: `linear-gradient(135deg, ${theme.gold}, ${theme.goldLight})` }}>
          {processing ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Crown size={18} />
              Premium'a Geç
            </>
          )}
        </motion.button>
        <p className="text-center text-[9px] mt-2" style={{ color: theme.textSecondary }}>
          İstediğiniz zaman iptal edebilirsiniz
        </p>
      </div>
    </div>
  );
}
