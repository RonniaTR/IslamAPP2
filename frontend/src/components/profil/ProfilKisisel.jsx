import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Sparkles } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { alanPuanlari, toplamPuan } from '../../services/kazanim';
import { GunCetelesi } from '../../pages/sevap/SevapPointsPage';
import { SevapIsaret } from '../../pages/sevap/SevapAmblem';
import { useAyet } from '../../pages/musluman/meal';
import { SURAHS } from '../../data/surahData';

// 👤 Profilin kişisel kalbi: Sevap Points özeti (küçük yıldız), "Benim âyetim", gün çetelesi.
const ALTIN = '#D8B76A';

function BenimAyetim({ theme }) {
  const navigate = useNavigate();
  const kayit = useMemo(() => { try { return JSON.parse(localStorage.getItem('benim_ayetim')); } catch { return null; } }, []);
  const s = kayit?.s || 13; const a = kayit?.a || 28;
  const meal = useAyet(s, a);
  const metin = meal.satirlar && meal.satirlar[0] ? meal.satirlar[0].text : '';
  if (meal.yok) return null;
  return (
    <button type="button" onClick={() => navigate(`/ayet-tablosu?s=${s}&a=${a}`)}
      style={{ width: '100%', textAlign: 'start', borderRadius: 22, padding: '16px 18px', background: '#FBF8F0', color: '#1A1A1A', border: '1px solid #E5D9BC', cursor: 'pointer' }}>
      <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 1.6, color: '#A9873C' }}>{kayit ? 'BENİM ÂYETİM' : 'BENİM ÂYETİM · Ayet Tablosu\'ndan seç'}</span>
      <p style={{ margin: '6px 0 4px', fontFamily: 'var(--font-okuma)', fontSize: 16, lineHeight: 1.55 }}>{metin || '…'}</p>
      <span style={{ fontSize: 12.5, fontWeight: 700, color: '#0F5C46' }}>{SURAHS[s - 1].name} Sûresi · {a}</span>
    </button>
  );
}

export default function ProfilKisisel() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const alanlar = useMemo(() => alanPuanlari(), []);
  const toplam = useMemo(() => toplamPuan(), []);
  const enIyi = [...alanlar].sort((x, y) => y.puan - x.puan)[0];
  const koyu = theme.isDark !== false;
  return (
    <section data-testid="profil-kisisel" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <motion.button type="button" onClick={() => navigate('/sevap-points')} whileTap={{ scale: 0.98 }} data-testid="sevap-ozet"
        style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 24, cursor: 'pointer', textAlign: 'start',
          background: 'linear-gradient(135deg, #14523F 0%, #08241B 100%)', color: '#F4EFE3', border: `1px solid ${ALTIN}` }}>
        <SevapIsaret boyut={84} id="sp-profil" />
        <span style={{ flex: 1 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, letterSpacing: 1.6, color: ALTIN, fontWeight: 800 }}><Sparkles size={13} /> SEVAP POINTS</span>
          <span style={{ display: 'block', fontFamily: '"Fraunces", serif', fontSize: 30, fontWeight: 800, lineHeight: 1.1 }}>{toplam.toLocaleString('tr-TR')}</span>
          <span style={{ fontSize: 12.5, color: 'rgba(244,239,227,0.7)' }}>{enIyi.puan ? `En çok: ${enIyi.ad} · yıldız haritanı ve ağacını gör` : 'Yıldız haritan ilk adımla çizilmeye başlar'}</span>
        </span>
        <ChevronRight size={20} color={ALTIN} />
      </motion.button>
      <BenimAyetim theme={theme} />
      <div style={{ borderRadius: 22, padding: '14px 14px 16px', background: theme.surface || 'rgba(255,255,255,0.04)', border: `1px solid ${theme.cardBorder || 'rgba(255,255,255,0.1)'}` }}>
        <h3 style={{ margin: '0 0 10px', fontFamily: '"Fraunces", serif', fontSize: 18, fontWeight: 800, color: theme.textPrimary }}>Gün çetelem</h3>
        <GunCetelesi koyu={koyu} />
      </div>
    </section>
  );
}
