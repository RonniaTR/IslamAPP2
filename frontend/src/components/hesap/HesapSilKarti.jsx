import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Loader2, Trash2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { isCancel } from '../../services/authNative';

// 🗑️ HESAP SİLME KARTI — Ayarlar'da ve /hesap-sil web sayfasında aynı bileşen.
// İki aşamalı onay; geri alınamaz olduğu açıkça yazılır. Silinenlerin listesi gizlilik metniyle aynıdır.
// `pal`: renk paleti (Ayarlar temanın renkleriyle, web sayfası kendi renkleriyle çağırır).
const STEP_TEXT = {
  reauth: 'Güvenlik için hesabını bir kez daha seç…',
  data: 'Sunucudaki verilerin siliniyor…',
  auth: 'Hesabın kapatılıyor…',
  device: 'Bu cihaz temizleniyor…',
  done: 'Tamamlandı.',
};

export default function HesapSilKarti({ pal, afterDelete = '/' }) {
  const { user, firebaseUser, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);
  const [wipe, setWipe] = useState(true);
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const account = firebaseUser && !firebaseUser.isAnonymous;
  const guest = !account && user && user.isGuest;

  const run = async () => {
    setBusy(true); setError('');
    try {
      await deleteAccount({ wipeDevice: account ? wipe : true, onStep: setStep });
      setDone(true);
      setTimeout(() => navigate(afterDelete, { replace: true }), 1800);
    } catch (e) {
      if (isCancel(e)) setError('Hesap seçimi kapatıldı; hiçbir şey silinmedi.');
      else if (/network/i.test(String(e && e.code))) setError('İnternet bağlantısı gerekiyor. Bağlanınca yeniden dene.');
      else setError('Silme tamamlanamadı. Bir süre sonra yeniden dene; sorun sürerse bize yaz.');
    } finally {
      setBusy(false);
    }
  };

  const btn = (danger) => ({
    minHeight: 50, padding: '0 18px', borderRadius: 16, fontWeight: 800, fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer',
    background: danger ? '#DC2626' : 'transparent', color: danger ? '#FFFFFF' : pal.text, border: danger ? 'none' : `1px solid ${pal.border}`,
  });

  if (done) {
    return (
      <div role="status" style={{ display: 'flex', gap: 10, alignItems: 'center', color: pal.text }}>
        <CheckCircle2 color="#16A34A" /> <span>{account ? 'Hesabın ve verilerin silindi. Hayırlı yolculuklar.' : 'Bu cihazdaki verilerin silindi.'}</span>
      </div>
    );
  }

  if (!account && !guest) {
    return <p style={{ margin: 0, color: pal.muted, fontSize: 14, lineHeight: 1.6 }}>Hesabını silmek için önce o hesapla giriş yap; ardından bu bölümde silme düğmesi görünür.</p>;
  }

  return (
    <div data-testid="hesap-sil" style={{ color: pal.text }}>
      {account ? (
        <>
          <p style={{ margin: '0 0 8px', fontSize: 14, lineHeight: 1.6 }}>
            <strong>{firebaseUser.email || firebaseUser.displayName}</strong> hesabını silersen şunlar <strong>kalıcı olarak</strong> silinir:
          </p>
          <ul style={{ margin: '0 0 12px', paddingInlineStart: 20, listStyle: 'disc', fontSize: 14, lineHeight: 1.7, color: pal.muted }}>
            <li>Profilin, puanın, seviyen ve rozetlerin</li>
            <li>Okuma geçmişin, yer imlerin ve hedeflerin</li>
            <li>Dönüş yolunun bulut yedeği</li>
            <li>Giriş kaydın (Google/Apple ile bağlantı)</li>
          </ul>
          <label style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 14, marginBottom: 14, cursor: 'pointer' }}>
            <input type="checkbox" checked={wipe} onChange={(e) => setWipe(e.target.checked)} style={{ width: 18, height: 18, accentColor: '#DC2626' }} />
            Bu cihazdaki verileri de sil (notlar, mektup, çocuk ilerlemesi, ayarlar)
          </label>
        </>
      ) : (
        <p style={{ margin: '0 0 12px', fontSize: 14, lineHeight: 1.6 }}>
          Misafir olarak kullanıyorsun; sunucuda sana ait bir kayıt yok. Bu cihazdaki bütün uygulama verilerini (notlar, ilerleme, ayarlar) silebilirsin.
        </p>
      )}

      {!confirm ? (
        <button type="button" onClick={() => setConfirm(true)} style={btn(false)} data-testid="hesap-sil-baslat">
          <Trash2 size={18} color="#DC2626" /> {account ? 'Hesabımı sil' : 'Cihazdaki verileri sil'}
        </button>
      ) : (
        <div role="alertdialog" aria-label="Silme onayı" style={{ padding: 14, borderRadius: 18, border: '1px solid #FCA5A5', background: 'rgba(220,38,38,0.07)' }}>
          <p style={{ display: 'flex', gap: 8, margin: '0 0 12px', fontSize: 14, lineHeight: 1.55, fontWeight: 700 }}>
            <AlertTriangle size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: 2 }} /> Bu işlem geri alınamaz. Emin misin?
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button type="button" onClick={run} disabled={busy} style={btn(true)} data-testid="hesap-sil-onay">
              {busy ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />} Evet, kalıcı olarak sil
            </button>
            <button type="button" onClick={() => setConfirm(false)} disabled={busy} style={btn(false)}>Vazgeç</button>
          </div>
          {busy && step && <p style={{ margin: '10px 0 0', fontSize: 13, color: pal.muted }}>{STEP_TEXT[step] || ''}</p>}
        </div>
      )}
      {error && <p role="alert" style={{ margin: '10px 0 0', color: '#DC2626', fontSize: 13 }}>{error}</p>}
    </div>
  );
}
