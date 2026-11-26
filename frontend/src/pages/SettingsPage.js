import React, { useEffect, useRef, useState } from 'react';
import TemaPencereleri from '../components/tema/TemaPencereleri';
import MenuBicimSecici from '../components/nav/MenuBicimSecici';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MapPin, Bell, BellOff, Sparkles, Palette, Type, Globe, Volume2, User, Baby, Info, BookOpen, Loader2, ShieldCheck, LogOut, Compass } from 'lucide-react';
import { useTheme, TEXT_SCALES } from '../contexts/ThemeContext';
import { useAppMode } from '../contexts/AppModeContext';
import { useLang } from '../contexts/LangContext';
import { useTx } from '../i18n';
import { usePrayerTimes, TURKISH_CITIES } from '../hooks/usePrayerTimes';
import ambient from '../services/ambient';
import notifications from '../services/notifications';
import { tercihOku, bildirimleriTamamenKapat, denemeGonder } from '../services/bildirim';
import BildirimIzni from '../components/bildirim/BildirimIzni';
import { VAKIT_MAKAM, MAKAM_NAMES } from '../services/donusAudio';
import sound from '../services/sound';
import ReadingSettingsSheet from '../components/ReadingSettingsSheet';
import { HUSU_KEY, loadHusu } from '../components/HusuPerdesi';
import { useAuth } from '../contexts/AuthContext';
import HesapSilKarti from '../components/hesap/HesapSilKarti';
import ParentGate from '../components/kids/ParentGate';
import ModGecisi from '../components/giris/ModGecisi';

// ⚙️ AYARLAR v2 (docs/YENI_OZELLIKLER.md Faz 1–2)
// Tek sayfa, altı bölüm: Görünüm · Yazı · Konum · Bildirimler · Dil ve ses · Diğer.
// Her ayar anında uygulanır ve cihazda saklanır; "Kaydet" düğmesi yoktur.

const NOTIF_KEY = 'notif_prefs_v2';
const PRAYERS = [
  ['Fajr', 'İmsak'], ['Dhuhr', 'Öğle'], ['Asr', 'İkindi'], ['Maghrib', 'Akşam'], ['Isha', 'Yatsı'],
];
const loadNotif = () => {
  try { return { enabled: false, minutes: 10, prayers: ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'], ...JSON.parse(localStorage.getItem(NOTIF_KEY)) }; }
  catch { return { enabled: false, minutes: 10, prayers: ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] }; }
};

export default function SettingsPage() {
  const { theme, themeId, setTheme, themes, fontId, setFont, fonts, textScale, setTextScale } = useTheme();
  const { setAppMode, isChild } = useAppMode();
  const { lang, setLang } = useLang() || {};
  const { city, changeCity, locate, timings } = usePrayerTimes();
  const navigate = useNavigate();
  const tt = useTx();
  const { user, firebaseUser, logout } = useAuth();
  const [gate, setGate] = useState(null);       // çocuk modundan çıkış / hesap işlemleri için ebeveyn sorusu
  const [hesapAcik, setHesapAcik] = useState(false);
  const [gecis, setGecis] = useState(null);     // mod değişiminde kapı geçişi: 'adult' | 'child'

  const [showReading, setShowReading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locMsg, setLocMsg] = useState('');
  const [notif, setNotif] = useState(loadNotif);
  const [notifMsg, setNotifMsg] = useState('');
  const [akilliTercih, setAkilliTercih] = useState(tercihOku);
  const timers = useRef([]);
  const [husu, setHusuState] = useState(loadHusu);
  const setHusu = (v) => { setHusuState(v); try { localStorage.setItem(HUSU_KEY, JSON.stringify(v)); } catch { /* kota */ } };
  const [amb, setAmb] = useState(ambient.getState());
  useEffect(() => ambient.subscribe(() => setAmb(ambient.getState())), []);

  // Bildirim tercihleri değişince sakla ve bugünün kalan vakitlerini planla.
  useEffect(() => {
    try { localStorage.setItem(NOTIF_KEY, JSON.stringify(notif)); } catch { /* kota */ }
    // Önceki planı iptal et; aynı vakit için iki hatırlatma kurulmasın.
    timers.current.forEach((id) => clearTimeout(id));
    timers.current = [];
    notifications.cancelPrayerReminders();
    if (!notif.enabled || !timings) return;
    PRAYERS.forEach(([key, name]) => {
      if (notif.prayers.includes(key) && timings[key]) {
        try {
          const id = notifications.schedulePrayerReminder(tt(name), timings[key].slice(0, 5), notif.minutes);
          if (id) timers.current.push(id);
        } catch { /* desteklenmiyor */ }
      }
    });
  }, [notif, timings]);

  const doLocate = async () => {
    setLocating(true); setLocMsg('');
    const r = await locate();
    setLocating(false);
    setLocMsg(r.ok
      ? `${tt('Konum güncellendi')}: ${r.city}`
      : r.reason === 'denied' ? tt('Konum izni verilmedi. Şehri aşağıdan elle seçebilirsin.')
        : tt('Konum alınamadı. Şehri aşağıdan elle seçebilirsin.'));
  };

  const toggleNotif = async () => {
    if (notif.enabled) { setNotif({ ...notif, enabled: false }); setNotifMsg(''); return; }
    let ok = false;
    try { ok = await notifications.requestPermission(); } catch { ok = false; }
    if (!ok) { setNotifMsg(tt('Bildirim izni verilmedi. Cihaz ayarlarından izin verebilirsin.')); return; }
    setNotif({ ...notif, enabled: true });
    setNotifMsg(tt('Vakit hatırlatmaları açıldı.'));
  };

  const card = { background: theme.surface, border: `1px solid ${theme.cardBorder}`, borderRadius: 24, padding: 16 };
  const label = { color: theme.textSecondary, fontSize: 12, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase' };
  const H = ({ icon: Icon, children }) => (
    <div className="flex items-center gap-2 mb-3"><Icon size={16} style={{ color: theme.gold }} /><span style={label}>{children}</span></div>
  );
  const Chip = ({ on, onClick, children }) => (
    <button onClick={onClick} aria-pressed={on}
      style={{ minHeight: 40, padding: '0 14px', borderRadius: 20, fontSize: 13, fontWeight: on ? 700 : 500, cursor: 'pointer',
        background: on ? theme.gold : 'transparent', color: on ? '#1A1A1A' : theme.textPrimary, border: `1px solid ${on ? theme.gold : theme.cardBorder}` }}>
      {children}
    </button>
  );
  const Row = ({ icon: Icon, text, value, onClick }) => (
    <button onClick={onClick} className="w-full flex items-center justify-between py-3" style={{ borderBottom: `1px solid ${theme.cardBorder}` }}>
      <span className="flex items-center gap-3"><Icon size={18} style={{ color: theme.textSecondary }} />
        <span style={{ color: theme.textPrimary, fontSize: 14, fontWeight: 600 }}>{text}</span></span>
      <span className="flex items-center gap-2" style={{ color: theme.textSecondary, fontSize: 12 }}>{value}<ChevronRight size={16} /></span>
    </button>
  );

  const themeList = ['revza', 'dark', 'isilti', 'husu', 'sevgi', 'sukun', 'bereket', 'light', 'emerald'].filter((id) => themes[id]);

  return (
    <div className="min-h-screen pb-28" style={{ background: theme.bg }} data-testid="settings-page">
      <div className="flex items-center px-4 pt-6 pb-4 sticky top-0 z-10" style={{ background: theme.bg }}>
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5">
          <ChevronLeft size={24} style={{ color: theme.textPrimary }} />
          <span className="font-extrabold text-xl" style={{ color: theme.textPrimary, fontFamily: 'var(--font-heading)' }}>{tt('Ayarlar')}</span>
        </button>
      </div>

      <div className="px-4 flex flex-col gap-4 max-w-xl mx-auto">

        {/* GÖRÜNÜM */}
        <section style={card} data-testid="theme-studio">
          <H icon={Palette}>{tt('Tema')}</H>
          <div style={{ color: theme.textPrimary }}>
            <TemaPencereleri themes={themes} themeList={themeList} themeId={themeId} setTheme={setTheme} tt={tt} />
          </div>
          <p style={{ color: theme.textMuted, fontSize: 11, marginTop: 10 }}>{tt("Mushaf sayfası temadan etkilenmez; Kur'an metni her zaman aynı kâğıt üzerinde görünür.")}</p>
        </section>

        {/* MENÜ BİÇİMİ */}
        <section style={card} data-testid="menu-bicimi">
          <H icon={Compass}>{tt('Menü biçimi')}</H>
          <MenuBicimSecici theme={theme} tt={tt} />
        </section>

        {/* YAZI */}
        <section style={card}>
          <H icon={Type}>{tt('Yazı stili')}</H>
          <div className="flex flex-wrap gap-2 mb-3">
            {Object.values(fonts).map((f) => (
              <button key={f.id} onClick={() => setFont(f.id)} aria-pressed={f.id === fontId}
                style={{ minHeight: 56, padding: '6px 14px', borderRadius: 16, cursor: 'pointer', textAlign: 'start',
                  background: f.id === fontId ? theme.surfaceLight : 'transparent', border: `1px solid ${f.id === fontId ? theme.gold : theme.cardBorder}` }}>
                <div style={{ fontFamily: f.heading, color: theme.textPrimary, fontSize: 16, fontWeight: 700 }}>{tt(f.name)}</div>
                <div style={{ fontFamily: f.body, color: theme.textSecondary, fontSize: 11 }}>Aa Ğğ Şş 123</div>
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {[['kucuk', 'Küçük'], ['normal', 'Normal'], ['buyuk', 'Büyük'], ['cokBuyuk', 'Çok büyük']].filter(([id]) => TEXT_SCALES[id]).map(([id, n]) => (
              <Chip key={id} on={textScale === id} onClick={() => setTextScale(id)}>{tt(n)}</Chip>
            ))}
          </div>
          <button onClick={() => setShowReading(true)} className="mt-3 flex items-center gap-2" style={{ color: theme.gold, fontSize: 13, fontWeight: 600 }}>
            <BookOpen size={15} /> {tt('Okuma ayarları (Arapça boyutu, okuma teması)')}
          </button>
        </section>

        {/* KONUM */}
        <section style={card}>
          <H icon={MapPin}>{tt('Konum ve namaz vakitleri')}</H>
          <div className="flex items-center justify-between gap-3 mb-3">
            <div>
              <div style={{ color: theme.textPrimary, fontWeight: 700, fontSize: 16 }}>{city}</div>
              <div style={{ color: theme.textSecondary, fontSize: 11 }}>{tt('Hesap: Diyanet yöntemi')}</div>
            </div>
            <button onClick={doLocate} disabled={locating}
              style={{ minHeight: 44, padding: '0 16px', borderRadius: 22, background: theme.gold, color: '#1A1A1A', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              {locating ? <Loader2 size={15} className="animate-spin" /> : <MapPin size={15} />} {tt('Konumumu bul')}
            </button>
          </div>
          {locMsg && <p role="status" style={{ color: theme.textSecondary, fontSize: 12, marginBottom: 8 }}>{locMsg}</p>}
          <select value={city} onChange={(e) => changeCity(e.target.value)} aria-label={tt('Şehir seç')}
            style={{ width: '100%', minHeight: 44, borderRadius: 14, padding: '0 12px', background: theme.inputBg, color: theme.textPrimary, border: `1px solid ${theme.inputBorder}`, fontSize: 14 }}>
            {TURKISH_CITIES.map((c) => <option key={c} value={c} style={{ color: '#111' }}>{c}</option>)}
          </select>
          <p style={{ color: theme.textMuted, fontSize: 11, marginTop: 8 }}>{tt('Konumun yalnız bu cihazda saklanır.')}</p>
        </section>

        {/* BİLDİRİMLER */}
        <section style={card}>
          <BildirimIzni sadeceCanli />
          <H icon={Bell}>{tt('Bildirimler')}</H>
          {/* Bildirimleri Tamamen Kapatma Ana Şalteri */}
          <div className="flex items-center justify-between gap-3 mb-3 pb-3" style={{ borderBottom: `1px solid ${theme.cardBorder}` }}>
            <span style={{ color: theme.textPrimary, fontSize: 14, fontWeight: 700 }}>
              <span className="flex items-center gap-1.5"><BellOff size={15} style={{ color: akilliTercih.tamamenKapali ? '#EF4444' : theme.gold }} /> {tt('Bildirimleri tamamen kapat')}</span>
              <span style={{ display: 'block', color: theme.textSecondary, fontSize: 11, fontWeight: 400 }}>
                {akilliTercih.tamamenKapali ? tt('Kapalı — hiçbir bildirim veya izin penceresi çıkmaz') : tt('Açıldığında tüm bildirimler kalıcı olarak susturulur')}
              </span>
            </span>
            <button
              type="button"
              onClick={async () => {
                const yeni = !akilliTercih.tamamenKapali;
                const t = await bildirimleriTamamenKapat(yeni);
                setAkilliTercih(t);
                if (yeni) setNotif({ ...notif, enabled: false });
              }}
              role="switch"
              aria-checked={!!akilliTercih.tamamenKapali}
              style={{ flexShrink: 0, width: 52, height: 30, borderRadius: 15, background: akilliTercih.tamamenKapali ? '#EF4444' : theme.surfaceLight, position: 'relative', cursor: 'pointer', border: `1px solid ${theme.cardBorder}` }}>
              <span style={{ position: 'absolute', top: 3, left: akilliTercih.tamamenKapali ? 25 : 3, width: 22, height: 22, borderRadius: 11, background: '#FFF', transition: 'left 160ms' }} />
            </button>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span style={{ color: theme.textPrimary, fontSize: 14, fontWeight: 600 }}>{tt('Namaz vakti hatırlatması')}</span>
            <button onClick={toggleNotif} role="switch" aria-checked={notif.enabled}
              style={{ width: 52, height: 30, borderRadius: 15, background: notif.enabled ? theme.gold : theme.surfaceLight, position: 'relative', cursor: 'pointer', border: `1px solid ${theme.cardBorder}` }}>
              <span style={{ position: 'absolute', top: 3, left: notif.enabled ? 25 : 3, width: 22, height: 22, borderRadius: 11, background: '#FFF', transition: 'left 160ms' }} />
            </button>
          </div>
          {notifMsg && <p role="status" style={{ color: theme.textSecondary, fontSize: 12, marginBottom: 8 }}>{notifMsg}</p>}
          {notif.enabled && (
            <>
              <div className="flex flex-wrap gap-2 mb-3">
                {PRAYERS.map(([key, name]) => {
                  const on = notif.prayers.includes(key);
                  return <Chip key={key} on={on} onClick={() => setNotif({ ...notif, prayers: on ? notif.prayers.filter((p) => p !== key) : [...notif.prayers, key] })}>{tt(name)}</Chip>;
                })}
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <span style={{ color: theme.textSecondary, fontSize: 12 }}>{tt('Vakitten önce')}:</span>
                {[5, 10, 15, 30].map((m) => <Chip key={m} on={notif.minutes === m} onClick={() => setNotif({ ...notif, minutes: m })}>{m} {tt('dk')}</Chip>)}
              </div>
            </>
          )}
          {/* Huşu perdesi (8.2) */}
          <div className="flex items-center justify-between gap-3 mt-4">
            <span style={{ color: theme.textPrimary, fontSize: 14, fontWeight: 600 }}>{tt('Huşu perdesi')}
              <span style={{ display: 'block', color: theme.textSecondary, fontSize: 11, fontWeight: 400 }}>{tt('Vakit girince sakin bir perde açılır; tek dokunuşla kalkar')}</span></span>
            <button onClick={() => setHusu({ ...husu, enabled: !husu.enabled })} role="switch" aria-checked={husu.enabled}
              style={{ flexShrink: 0, width: 52, height: 30, borderRadius: 15, background: husu.enabled ? theme.gold : theme.surfaceLight, position: 'relative', cursor: 'pointer', border: `1px solid ${theme.cardBorder}` }}>
              <span style={{ position: 'absolute', top: 3, left: husu.enabled ? 25 : 3, width: 22, height: 22, borderRadius: 11, background: '#FFF', transition: 'left 160ms' }} />
            </button>
          </div>
          {husu.enabled && (
            <div className="flex flex-wrap gap-2 mt-2">
              {[10, 15, 20].map((m) => <Chip key={m} on={husu.minutes === m} onClick={() => setHusu({ ...husu, minutes: m })}>{m} {tt('dk')}</Chip>)}
            </div>
          )}
          {/* Vakitlerin makamı (8.1): her vaktin kendi makamında kısa ney cümlesi — cihazda üretilir */}
          <div className="mt-4">
            <span style={label}>{tt('Vakitlerin makamı · dinle')}</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {PRAYERS.map(([key, name]) => (
                <Chip key={key} on={false} onClick={() => sound.play('vakit', key)}>{tt(name)} · {MAKAM_NAMES[VAKIT_MAKAM[key]]}</Chip>
              ))}
            </div>
          </div>
          <p style={{ color: theme.textMuted, fontSize: 11, marginTop: 10 }}>{tt('Hatırlatmalar davettir; kaçırdığın vakit için uyarı gönderilmez.')}</p>
          <div className="flex flex-wrap gap-3 mt-3">
            <button type="button" onClick={() => denemeGonder('hal')} className="flex items-center gap-1.5 px-3 py-2 rounded-xl" style={{ background: `${theme.gold}18`, border: `1px solid ${theme.gold}50`, color: theme.textPrimary, fontSize: 12.5, fontWeight: 700 }}>
              <Sparkles size={14} style={{ color: theme.gold }} /> {tt('Hâl & Âyet Bildirimini Şimdi Gör')}
            </button>
            <button type="button" onClick={() => navigate('/bildirimler')} className="flex items-center gap-1.5 px-3 py-2 rounded-xl" style={{ background: theme.surfaceLight, border: `1px solid ${theme.cardBorder}`, color: theme.gold, fontSize: 12.5, fontWeight: 700 }}>
              <Bell size={14} /> {tt('Akıllı bildirim tercihleri')}
            </button>
          </div>
        </section>

        {/* DİL VE SES */}
        <section style={card}>
          <H icon={Globe}>{tt('Dil')}</H>
          <div className="flex flex-wrap gap-2 mb-4">
            {[['tr', 'Türkçe'], ['en', 'English'], ['ar', 'العربية']].map(([id, n]) => (
              <Chip key={id} on={lang === id} onClick={() => setLang && setLang(id)}>{n}</Chip>
            ))}
          </div>
          <H icon={Volume2}>{tt('Huzur sesi')}</H>
          <div className="flex flex-wrap gap-2 items-center mb-2">
            <Chip on={amb.playing} onClick={() => ambient.toggle()}>{amb.playing ? tt('Açık') : tt('Kapalı')}</Chip>
            {(amb.tracks || []).map((t) => <Chip key={t.id} on={amb.track === t.id} onClick={() => ambient.setTrack(t.id)}>{tt(t.name || t.label || t.id)}</Chip>)}
          </div>
          <input type="range" min="0" max="1" step="0.05" value={amb.volume ?? 0.5} onChange={(e) => ambient.setVolume(Number(e.target.value))}
            aria-label={tt('Ses düzeyi')} style={{ width: '100%', accentColor: theme.gold }} />
          <p style={{ color: theme.textMuted, fontSize: 11, marginTop: 6 }}>{tt('Sesler cihazda üretilir; kayıt içermez.')}</p>
        </section>

        {/* HESAP VE GİZLİLİK — mağaza şartı: gizlilik politikası ve uygulama içinden hesap silme */}
        <section style={card} data-testid="hesap-gizlilik">
          <H icon={ShieldCheck}>{tt('Hesap ve gizlilik')}</H>
          <p style={{ color: theme.textSecondary, fontSize: 13, margin: '0 0 6px' }}>
            {firebaseUser && !firebaseUser.isAnonymous
              ? `${tt('Giriş')}: ${firebaseUser.email || firebaseUser.displayName || ''}`
              : user && user.isGuest ? tt('Misafir olarak kullanıyorsun; verilerin yalnız bu cihazda.') : ''}
          </p>
          <Row icon={ShieldCheck} text={tt('Gizlilik politikası')} value="" onClick={() => navigate('/gizlilik')} />
          {!isChild && <Row icon={User} text={tt('Profil')} value="" onClick={() => navigate('/profile')} />}
          <button type="button" onClick={() => (isChild ? setGate('hesap') : setHesapAcik((v) => !v))} data-testid="hesap-sil-ac"
            className="w-full flex items-center justify-between py-3" style={{ borderBottom: hesapAcik ? 'none' : `1px solid ${theme.cardBorder}` }}>
            <span className="flex items-center gap-3"><Info size={18} style={{ color: '#DC2626' }} />
              <span style={{ color: '#DC2626', fontSize: 14, fontWeight: 700 }}>{firebaseUser && !firebaseUser.isAnonymous ? tt('Hesabımı sil') : tt('Verilerimi sil')}</span></span>
            <ChevronRight size={16} style={{ color: theme.textSecondary, transform: hesapAcik ? 'rotate(90deg)' : 'none', transition: 'transform .2s' }} />
          </button>
          {hesapAcik && (
            <div style={{ padding: '8px 2px 12px', borderBottom: `1px solid ${theme.cardBorder}` }}>
              <HesapSilKarti pal={{ text: theme.textPrimary, muted: theme.textSecondary, border: theme.cardBorder }} />
            </div>
          )}
          {user && !isChild && (
            <button type="button" onClick={async () => { await logout(); navigate('/login', { replace: true }); }}
              className="w-full flex items-center gap-3 py-3" style={{ color: theme.textPrimary, fontSize: 14, fontWeight: 600 }}>
              <LogOut size={18} style={{ color: theme.textSecondary }} /> {tt('Çıkış yap')}
            </button>
          )}
        </section>

        {/* DİĞER */}
        <section style={{ ...card, paddingTop: 4, paddingBottom: 4 }}>
          <Row icon={Baby} text={isChild ? tt('Yetişkin Moduna Geç') : tt('Çocuk Moduna Geç')} value={isChild ? tt('Çocuk') : tt('Yetişkin')}
            onClick={() => (isChild ? setGate('mod') : setGecis('child'))} />
          <Row icon={Info} text={tt('Kaynaklar ve lisanslar')} value="" onClick={() => navigate(isChild ? '/kids/licenses' : '/licenses')} />
        </section>
      </div>

      <ReadingSettingsSheet open={showReading} onClose={() => setShowReading(false)} />
      {gate && (
        <ParentGate modal title={gate === 'mod' ? tt('Yetişkin moduna geçiş') : tt('Hesap ve veriler')}
          onCancel={() => setGate(null)}
          onOpen={() => { const g = gate; setGate(null); if (g === 'mod') setGecis('adult'); else setHesapAcik(true); }} />
      )}
      {gecis && (
        <ModGecisi to={gecis} onDone={() => { const m = gecis; setGecis(null); setAppMode(m); navigate(m === 'child' ? '/kids' : '/', { replace: true }); }} />
      )}
    </div>
  );
}
