// frontend/src/pages/Dashboard.js
// 🏠 ANA EKRAN v2 (tuval G1) — Ana sayfa ve Keşfet tek akışta.
// Sıra: selam · vakit kartı · vakte göre öneri · arama/Sor · kaldığın yerler · modlar · günün ayeti/hadisi · bugün.
// Bütün değerler gerçek kaynaktan gelir; kaynak boşsa o parça hiç gösterilmez (sahte ilerleme yok).
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, MessageCircle, Check, Zap, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { getTodayPlan, isTaskDone, getStreak, TASK_POOL } from '../services/pathEngine';
import { isReturnMode, getReturnDay, LAST_DAY } from '../services/returnEngine';
import { getCachedStats, fetchStats, subscribeStats } from '../services/gamification';
import { getDailyHadith } from '../data/dailyHadith';
import { getFeatures, getHomeFeatures } from '../features/registry';
import { QURAN_PUBLIC } from '../config/quranAccess';
import { loadDefter } from './DefterPage';
import { useTx } from '../i18n';
import PrayerCard from '../components/home/PrayerCard';
import GokKubbe from '../components/home/GokKubbe';
import KalbindenGecen from '../components/home/KalbindenGecen';
import OneCikanAyet from '../components/home/OneCikanAyet';
import BildirimIzni from '../components/bildirim/BildirimIzni';
import SessizDavet from '../components/SessizDavet';
import ModKartlari from '../components/home/ModKartlari';

const PAPER = { bg: '#FBF8F0', ink: '#1A1A1A', soft: '#5C4B2A', line: '#D9CDAE' };
const read = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };


/** Günün vaktine göre tek öneri. Kur'an önerisi yalnız Kur'an bölümleri açıksa çıkar. */
function suggestion(hour) {
  if (hour >= 4 && hour < 11) return { tag: 'Sabah', title: 'Sabah zikirleri', sub: 'Güne birkaç dakikalık zikirle başla', route: '/dhikr', cta: 'Aç' };
  if (hour >= 11 && hour < 16) return { tag: 'Gün ortası', title: 'Günün hadisi', sub: 'Kaynağıyla tek hadis', route: '/hadith', cta: 'Oku' };
  if (hour >= 16 && hour < 19) return { tag: 'İkindi', title: 'Kelime Koçu', sub: 'Beş dakikalık tekrar', route: '/kelime', cta: 'Başla' };
  if (hour >= 19 && hour < 22) return { tag: 'Akşam', title: 'Aile Sofrası', sub: 'Sofrada konuşmak için tek kart', route: '/sofra', cta: 'Aç' };
  return QURAN_PUBLIC
    ? { tag: 'Gece', title: 'Uyku öncesi: Mülk suresi', sub: '30 ayet', route: '/quran/67', cta: 'Oku' }
    : { tag: 'Gece', title: 'Günün muhasebesi', sub: 'Amel defterine iki satır', route: '/journal', cta: 'Yaz' };
}

export default function Dashboard() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const tt = useTx();
  const [q, setQ] = useState('');
  const [stats, setStats] = useState(() => getCachedStats());
  useEffect(() => {
    const off = subscribeStats(setStats);
    fetchStats(user).then((st) => { if (st) setStats(st); });
    return off;
  }, [user]);

  const plan = getTodayPlan();
  const tasks = plan ? plan.tasks.map((id) => ({ id, ...(TASK_POOL[id] || { title: id, xp: 0 }), done: isTaskDone(plan, id) })) : [];
  const worship = tasks.filter((t) => !t.xp);
  const study = tasks.filter((t) => t.xp > 0);
  const hadith = useMemo(() => getDailyHadith(), []);
  const sug = suggestion(new Date().getHours());
  const streak = getStreak();

  // KALDIĞIN YERLER — yalnız gerçekten başlanmış olanlar
  const places = [];
  const lastRead = read('quran_last');
  const lastPage = Number(read('mushaf_last_page')) || 0;
  if (QURAN_PUBLIC && lastPage > 1) places.push({ tag: 'Mushaf', title: `${tt('Sayfa')} ${lastPage}`, sub: `${lastPage} / 604`, pct: (lastPage / 604) * 100, route: `/mushaf/${lastPage}` });
  if (QURAN_PUBLIC && lastRead?.surah) places.push({ tag: 'Son okunan', title: lastRead.name || `${lastRead.surah}. ${tt('sure')}`, sub: lastRead.ayah && lastRead.total ? `${lastRead.ayah} / ${lastRead.total} ${tt('ayet')}` : '', pct: lastRead.ayah && lastRead.total ? (lastRead.ayah / lastRead.total) * 100 : null, route: `/quran/${lastRead.surah}` });
  if (plan) places.push({ tag: 'Nur Yolu', title: tt('Bugünkü yolum'), sub: `${tasks.filter((t) => t.done).length} / ${tasks.length}${streak > 1 ? ` · ${streak} ${tt('gün')}` : ''}`, pct: tasks.length ? (tasks.filter((t) => t.done).length / tasks.length) * 100 : 0, route: '/yol' });
  if (isReturnMode()) { const d = Math.min(getReturnDay(), LAST_DAY); places.push({ tag: 'Kırk Perde', title: tt('Dönüş Odası'), sub: `${d}. ${tt('gün')}`, pct: (d / LAST_DAY) * 100, route: '/donus' }); }
  const hatim = read('hatim_plan_v1');
  if (hatim) places.push({ tag: 'Esnek hatim', title: tt('Hatim planım'), sub: tt('Bugünkü payı gör'), pct: null, route: '/hatim-plani' });
  const defterCount = loadDefter().length;
  if (defterCount) places.push({ tag: 'Defter', title: tt('Hayat ayetleri'), sub: `${defterCount} ${tt('ayet')}`, pct: null, route: '/defter' });

  // ARAMA — özellik kaydında arar; bulunamazsa soruyu Rehber'e taşır
  const needle = q.trim().toLocaleLowerCase('tr');
  const found = needle.length > 1
    ? getFeatures().filter((f) => `${f.title} ${f.desc} ${tt(f.title)}`.toLocaleLowerCase('tr').includes(needle)).slice(0, 6)
    : [];
  const ask = () => navigate(needle ? `/rehber?q=${encodeURIComponent(q.trim())}` : '/rehber');

  const card = { borderRadius: 20, background: theme.surface, border: `1px solid ${theme.cardBorder}` };
  const label = { fontSize: 11, fontWeight: 600, letterSpacing: 1.6, color: theme.textSecondary, textTransform: 'uppercase', paddingTop: 4 };
  const initial = (user?.name || '?').trim().charAt(0).toLocaleUpperCase('tr');

  return (
    <div data-testid="dashboard" style={{ minHeight: '100vh', background: theme.bg, color: theme.textPrimary, paddingBottom: 110 }}>
      <BildirimIzni />
      <div className="stagger" style={{ maxWidth: 560, margin: '0 auto', padding: '18px 20px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>

        <header style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
            <span style={{ fontSize: 13, color: theme.textSecondary }}>{tt('Esselâmü aleyküm')}</span>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 700, letterSpacing: -0.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || tt('Hoş geldin')}</span>
          </div>
          <button type="button" aria-label={tt('Bildirim ayarları')} onClick={() => navigate('/bildirimler')} style={{ width: 44, height: 44, borderRadius: 22, background: theme.surface, border: `1px solid ${theme.cardBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Bell size={18} color={theme.textSecondary} />
          </button>
          <button type="button" aria-label={tt('Profil')} onClick={() => navigate('/profile')} style={{ width: 44, height: 44, borderRadius: 22, background: theme.surface, border: `2px solid ${theme.gold}`, color: theme.gold, fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>{initial}</button>
        </header>

        <GokKubbe />
        <OneCikanAyet />
        <PrayerCard />
        <SessizDavet />

        <button type="button" onClick={() => navigate(sug.route)} style={{ ...card, borderRadius: 18, padding: '12px 12px 12px 16px', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'start', cursor: 'pointer', color: theme.textPrimary }}>
          <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.4, color: theme.gold, textTransform: 'uppercase' }}>{tt(sug.tag)} · {tt('vakte göre')}</span>
            <span style={{ fontSize: 15, fontWeight: 600 }}>{tt(sug.title)}</span>
            <span style={{ fontSize: 12, color: theme.textSecondary }}>{tt(sug.sub)}</span>
          </span>
          <span style={{ height: 44, padding: '0 18px', borderRadius: 22, background: theme.gold, color: '#1A1A1A', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center' }}>{tt(sug.cta)}</span>
        </button>

        <KalbindenGecen />

        <form onSubmit={(e) => { e.preventDefault(); if (found[0]) navigate(found[0].route); else ask(); }} style={{ display: 'flex', gap: 8 }} role="search">
          <label style={{ flex: 1, minHeight: 48, borderRadius: 24, ...{ background: theme.surface, border: `1px solid ${theme.cardBorder}` }, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', minWidth: 0 }}>
            <Search size={17} color={theme.textSecondary} aria-hidden="true" />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={tt('Uygulamada ara ya da bir soru yaz')} aria-label={tt('Ara')}
              style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', color: theme.textPrimary, fontFamily: 'inherit', fontSize: 14 }} />
          </label>
          <button type="button" onClick={ask} style={{ minHeight: 48, padding: '0 16px', borderRadius: 24, background: 'transparent', border: `1px solid ${theme.gold}`, color: theme.gold, display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            <MessageCircle size={16} aria-hidden="true" /> {tt('Sor')}
          </button>
        </form>
        {needle.length > 1 && (
          <div style={{ ...card, padding: '4px 14px' }}>
            {found.map((f) => (
              <button key={f.id} type="button" onClick={() => navigate(f.route)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, minHeight: 48, background: 'none', border: 'none', borderBottom: `1px solid ${theme.cardBorder}`, color: theme.textPrimary, textAlign: 'start', cursor: 'pointer' }}>
                <span aria-hidden="true">{f.emoji}</span>
                <span style={{ flex: 1 }}><span style={{ fontSize: 14, fontWeight: 600 }}>{tt(f.title)}</span><br /><span style={{ fontSize: 11, color: theme.textSecondary }}>{tt(f.desc)}</span></span>
              </button>
            ))}
            <button type="button" onClick={ask} style={{ width: '100%', minHeight: 48, background: 'none', border: 'none', color: theme.gold, textAlign: 'start', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
              {tt("Rehber'e sor")}: “{q.trim()}”
            </button>
          </div>
        )}

        {places.length > 0 && (<>
          <span style={label}>{tt('Kaldığın yerler')}</span>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', margin: '0 -20px', padding: '0 20px 4px' }}>
            {places.map((p) => (
              <button key={p.tag} type="button" onClick={() => navigate(p.route)} style={{ ...card, borderRadius: 18, flexShrink: 0, width: 160, padding: 14, display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'start', color: theme.textPrimary, cursor: 'pointer' }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, color: theme.gold, textTransform: 'uppercase' }}>{tt(p.tag)}</span>
                <span style={{ fontSize: 15, fontWeight: 700 }}>{p.title}</span>
                <span style={{ fontSize: 11, color: theme.textSecondary }}>{p.sub}</span>
                {p.pct != null && <span style={{ height: 4, borderRadius: 2, background: theme.bg, display: 'block', overflow: 'hidden' }}><span style={{ display: 'block', width: `${Math.min(100, Math.round(p.pct))}%`, height: 4, background: theme.gold }} /></span>}
              </button>
            ))}
          </div>
        </>)}

        <ModKartlari />

        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', margin: '0 -20px', padding: '0 20px 2px' }}>
          {getHomeFeatures().map((f) => (
            <button key={f.id} type="button" onClick={() => navigate(f.route)} style={{ flexShrink: 0, minHeight: 44, padding: '0 14px', borderRadius: 22, background: theme.surface, border: `1px solid ${theme.cardBorder}`, color: theme.textPrimary, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              <span aria-hidden="true">{f.emoji}</span>{tt(f.title)}
            </button>
          ))}
          <button type="button" onClick={() => navigate('/ozellikler')} style={{ flexShrink: 0, minHeight: 44, padding: '0 16px', borderRadius: 22, background: theme.gold, border: 'none', color: '#1A1A1A', fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>{tt('Tümü')}</button>
        </div>

        {/* Kutsal metin sabit kâğıt kartta; tema ne olursa olsun aynı (tasarım dili 0.8) */}
        {QURAN_PUBLIC && (
          <section style={{ borderRadius: 22, background: PAPER.bg, color: PAPER.ink, padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.4, color: '#6E5410', textTransform: 'uppercase' }}>{tt('Günün ayeti')}</span>
              <span style={{ fontSize: 12, color: PAPER.soft }}>{tt('Bakara')} 152</span>
            </div>
            <p dir="rtl" lang="ar" style={{ margin: 0, fontFamily: "'Amiri', serif", fontSize: 28, lineHeight: 1.7, textAlign: 'right' }}>فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button type="button" onClick={() => navigate('/quran/2')} style={{ height: 40, padding: '0 16px', borderRadius: 20, background: PAPER.ink, border: 'none', color: PAPER.bg, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{tt('Meal ve tefsir')}</button>
              <button type="button" onClick={() => navigate('/mushaf/23')} style={{ height: 40, padding: '0 16px', borderRadius: 20, background: 'transparent', border: `1px solid ${PAPER.line}`, color: PAPER.ink, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{tt("Mushaf'ta aç")}</button>
            </div>
          </section>
        )}

        {hadith && (
          <section style={{ borderRadius: 22, background: PAPER.bg, color: PAPER.ink, padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.4, color: '#6E5410', textTransform: 'uppercase' }}>{tt('Günün hadisi')}</span>
            {hadith.arabic && <p dir="rtl" lang="ar" style={{ margin: 0, fontFamily: "'Amiri', serif", fontSize: 22, lineHeight: 1.8, textAlign: 'right' }}>{hadith.arabic}</p>}
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55 }}>“{hadith.turkish}”</p>
            <span style={{ fontSize: 12, color: PAPER.soft }}>{hadith.source}</span>
          </section>
        )}

        <span style={label}>{tt('Bugün')}</span>
        {!plan && (
          <button type="button" onClick={() => navigate('/yol')} style={{ ...card, padding: 16, textAlign: 'start', color: theme.textPrimary, cursor: 'pointer' }}>
            <span style={{ fontSize: 15, fontWeight: 700, display: 'block' }}>{tt('Bugünkü Yolum')}</span>
            <span style={{ fontSize: 12, color: theme.textSecondary }}>{tt('Sana uygun günlük planı birlikte kuralım.')}</span>
          </button>
        )}
        {worship.length > 0 && (
          <section style={{ ...card, padding: '6px 16px 12px' }} onClick={() => navigate('/yol')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0 6px' }}>
              <Lock size={13} color={theme.textSecondary} aria-hidden="true" />
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>{tt('İbadet')}</span>
              <span style={{ fontSize: 11, color: theme.textSecondary }}>{tt('yalnızca sende · puansız')}</span>
            </div>
            {worship.map((t) => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 44, borderTop: `1px solid ${theme.cardBorder}` }}>
                <span style={{ width: 22, height: 22, borderRadius: 11, boxSizing: 'border-box', background: t.done ? theme.gold : 'transparent', border: t.done ? 'none' : `1.5px dashed ${theme.textMuted}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{t.done && <Check size={12} color="#1A1A1A" strokeWidth={3.5} />}</span>
                <span style={{ fontSize: 14 }}>{tt(t.title)}</span>
              </div>
            ))}
          </section>
        )}
        {study.length > 0 && (
          <section style={{ ...card, padding: '6px 16px 12px' }} onClick={() => navigate('/yol')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0 6px' }}>
              <Zap size={13} color={theme.gold} aria-hidden="true" />
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>{tt('İlim görevleri')}</span>
              <span style={{ fontSize: 11, color: theme.textSecondary }}>{tt('XP kazandırır')} · {stats?.total_points || 0} XP</span>
            </div>
            {study.map((t) => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 44, borderTop: `1px solid ${theme.cardBorder}` }}>
                <span style={{ flex: 1, fontSize: 14, textDecoration: t.done ? 'line-through' : 'none', color: t.done ? theme.textSecondary : theme.textPrimary }}>{tt(t.title)}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: t.done ? '#1A1A1A' : theme.gold, background: t.done ? theme.gold : 'transparent', borderRadius: 8, padding: '2px 6px' }}>+{t.xp} XP</span>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
