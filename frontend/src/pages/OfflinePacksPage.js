import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Download, Check, Trash2, Loader2, WifiOff, Wifi } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useTx } from '../i18n';
import { PACKS, installPack, installedPacks, removePack } from '../services/offline';
import { getDiagnostics, clearDiagnostics } from '../services/diagnostics';

// 📦 ÇEVRİMDIŞI VE CİHAZ — paketler (meal, tefsir, Mushaf) ve yalnız cihazda duran tanılama kaydı.
export default function OfflinePacksPage() {
  const { theme } = useTheme();
  const tt = useTx();
  const navigate = useNavigate();
  const [have, setHave] = useState([]);
  const [busy, setBusy] = useState(null);
  const [missing, setMissing] = useState([]);
  const [online, setOnline] = useState(typeof navigator === 'undefined' ? true : navigator.onLine);
  const [diag, setDiag] = useState(() => getDiagnostics());
  const [copied, setCopied] = useState(false);

  const refresh = () => installedPacks().then(setHave);
  useEffect(() => {
    refresh();
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on); window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  const get = async (id) => {
    setBusy(id);
    const ok = await installPack(id);
    if (!ok) setMissing((m) => m.concat(id));
    await refresh();
    setBusy(null);
  };
  const drop = async (id) => { await removePack(id); refresh(); };
  const copy = async () => {
    try { await navigator.clipboard.writeText(JSON.stringify(diag, null, 1)); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* pano yok */ }
  };

  const card = { background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 18, padding: 14 };
  const label = { fontSize: 11, fontWeight: 600, letterSpacing: 1.4, color: theme.textSecondary, textTransform: 'uppercase' };

  return (
    <div className="min-h-screen pb-28" style={{ background: theme.bg, color: theme.textPrimary }} data-testid="offline-page">
      <div className="flex items-center gap-2 px-4 pt-6 pb-3">
        <button onClick={() => navigate(-1)} aria-label={tt('Geri')}><ChevronLeft size={24} style={{ color: theme.textPrimary }} /></button>
        <h1 className="text-xl font-extrabold flex-1">{tt('Çevrimdışı ve cihaz')}</h1>
        <span className="flex items-center gap-1 text-[12px]" style={{ color: online ? theme.textSecondary : theme.gold }}>
          {online ? <Wifi size={14} /> : <WifiOff size={14} />} {online ? tt('Bağlı') : tt('Çevrimdışı')}
        </span>
      </div>

      <div className="stagger px-4 flex flex-col gap-3 max-w-xl mx-auto">
        <p className="text-[13px]" style={{ color: theme.textSecondary }}>
          {tt('İndirilen paketler bu cihazda durur; bağlantı olmadan meal, tefsir ve Rehber araması çalışır.')}
        </p>
        <span style={label}>{tt('Paketler')}</span>
        {PACKS.map((p) => {
          const ok = have.includes(p.id);
          const none = missing.includes(p.id);
          return (
            <div key={p.id} style={{ ...card, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{tt(p.title)}</div>
                <div style={{ fontSize: 12, color: theme.textSecondary }}>
                  {none ? tt(p.gated ? 'Diyanet onayından sonra yayımlanacak' : 'Şu an indirilemedi') : p.desc}
                </div>
              </div>
              {ok ? (
                <>
                  <Check size={18} color={theme.gold} aria-label={tt('Cihazda')} />
                  <button onClick={() => drop(p.id)} aria-label={tt('Paketi sil')} style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Trash2 size={17} color={theme.textMuted} />
                  </button>
                </>
              ) : (
                <button onClick={() => get(p.id)} disabled={busy === p.id || none} aria-label={tt('İndir')}
                  style={{ minHeight: 40, padding: '0 14px', borderRadius: 20, background: theme.gold, color: '#1A1A1A', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, opacity: none ? 0.35 : 1 }}>
                  {busy === p.id ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />} {tt('İndir')}
                </button>
              )}
            </div>
          );
        })}

        <span style={{ ...label, marginTop: 10 }}>{tt('Tanılama (yalnız bu cihazda)')}</span>
        <div style={card}>
          <p className="text-[12px]" style={{ color: theme.textSecondary }}>
            {tt('Hata ve sayfa sayıları hiçbir yere gönderilmez. Bir sorun bildirirken kopyalayıp paylaşabilirsin.')}
          </p>
          <p className="text-[13px] mt-2">{tt('Kayıtlı hata')}: <b>{diag.errors.length}</b></p>
          {diag.errors.slice(0, 3).map((e) => (
            <p key={e.t} className="text-[11px] mt-1" data-ltr style={{ color: theme.textMuted, wordBreak: 'break-word' }}>{e.route} · {e.msg}</p>
          ))}
          {diag.usage.length > 0 && (
            <p className="text-[12px] mt-2" data-ltr style={{ color: theme.textSecondary }}>
              {diag.usage.slice(0, 6).map(([k, v]) => `${k} ${v}`).join(' · ')}
            </p>
          )}
          <div className="flex gap-2 mt-3">
            <button onClick={copy} style={{ minHeight: 36, padding: '0 14px', borderRadius: 18, border: `1px solid ${theme.gold}`, color: theme.gold, fontSize: 12, fontWeight: 600 }}>
              {copied ? tt('Kopyalandı') : tt('Raporu kopyala')}
            </button>
            <button onClick={() => { clearDiagnostics(); setDiag(getDiagnostics()); }} style={{ minHeight: 36, padding: '0 14px', borderRadius: 18, border: `1px solid ${theme.cardBorder}`, color: theme.textSecondary, fontSize: 12 }}>
              {tt('Kaydı sil')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
