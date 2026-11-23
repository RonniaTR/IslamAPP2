import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import LegalShell, { Bolum, KAGIT } from './LegalShell';
import HesapSilKarti from '../../components/hesap/HesapSilKarti';
import { useAuth } from '../../contexts/AuthContext';
import { canApple } from '../../services/authNative';
import { APP_NAME, SUPPORT_EMAIL } from '../../config/brand';

// 🗑️ HESAP SİLME (web) — Google Play, uygulamayı yeniden kurmadan da silme yapılabilen bir WEB adresi ister: /hesap-sil
// Kişi hesabıyla girer → aynı silme kartı → hesap ve sunucudaki veriler silinir.
export default function HesapSilPage() {
  const { firebaseUser, loading, loginWithGoogle, loginWithApple } = useAuth();
  const [busy, setBusy] = useState('');
  const [err, setErr] = useState('');
  const signedIn = firebaseUser && !firebaseUser.isAnonymous;

  const login = async (kind, fn) => {
    setBusy(kind); setErr('');
    try { await fn(); } catch { setErr('Giriş tamamlanamadı. Yeniden dener misin?'); } finally { setBusy(''); }
  };
  const btn = { minHeight: 50, padding: '0 18px', borderRadius: 16, fontWeight: 800, fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' };

  return (
    <LegalShell title={`${APP_NAME} hesabını sil`} testid="hesap-sil-page">
      <p style={{ fontSize: 15.5, lineHeight: 1.7, margin: 0 }}>
        Bu sayfadan {APP_NAME} hesabını ve sunucudaki bütün verilerini kalıcı olarak silebilirsin. Aynı işlem uygulamada
        <strong> Ayarlar → Hesap ve gizlilik → Hesabımı sil</strong> yolunda da vardır.
      </p>

      <div style={{ marginTop: 18, padding: 18, borderRadius: 20, background: KAGIT.card, border: `1px solid ${KAGIT.border}` }}>
        {loading ? <Loader2 className="animate-spin" /> : signedIn ? (
          <HesapSilKarti pal={{ text: KAGIT.text, muted: KAGIT.muted, border: KAGIT.border }} afterDelete="/hesap-sil" />
        ) : (
          <>
            <p style={{ margin: '0 0 12px', fontSize: 15, lineHeight: 1.6 }}>Önce silmek istediğin hesapla giriş yap:</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button type="button" onClick={() => login('g', loginWithGoogle)} disabled={!!busy} style={{ ...btn, background: '#FFFFFF', border: `1px solid ${KAGIT.border}`, color: '#1F2937' }}>
                {busy === 'g' && <Loader2 size={18} className="animate-spin" />} Google ile giriş yap
              </button>
              {canApple() && (
                <button type="button" onClick={() => login('a', loginWithApple)} disabled={!!busy} style={{ ...btn, background: '#000000', color: '#FFFFFF', border: 'none' }}>
                  {busy === 'a' && <Loader2 size={18} className="animate-spin" />} Apple ile giriş yap
                </button>
              )}
            </div>
            {err && <p role="alert" style={{ color: '#DC2626', margin: '10px 0 0', fontSize: 13 }}>{err}</p>}
          </>
        )}
      </div>

      <Bolum id="ne" title="Neler silinir?">
        <ul style={{ paddingInlineStart: 22, margin: 0, listStyle: 'disc' }}>
          <li>Profil (ad, e-posta, fotoğraf adresi), puan, seviye, rozetler</li>
          <li>Okuma geçmişi, yer imleri, hedefler</li>
          <li>Dönüş yolunun bulut yedeği</li>
          <li>Google/Apple giriş bağlantısı</li>
        </ul>
        <p>Silme anında yapılır ve geri alınamaz. Yedekleme sistemlerindeki kopyalar en geç 30 gün içinde kendiliğinden yok olur.
          Kimlik içermeyen anonim sayaçlar (kandil ışıkları) ve kimliksiz yapay zekâ bildirimleri kişiye bağlanamadığı için silinecek bir kayıt oluşturmaz.</p>
      </Bolum>

      <Bolum id="misafir" title="Misafir olarak kullandıysan">
        <p>Misafir kullanımda sunucuda sana ait kayıt yoktur. Uygulamayı telefonundan kaldırman bütün verilerini siler.</p>
      </Bolum>

      <Bolum id="yardim" title="Yardım">
        <p>
          Giriş yapamıyorsan {SUPPORT_EMAIL
            ? <>hesabının e-posta adresinden <a href={`mailto:${SUPPORT_EMAIL}?subject=Hesap%20silme%20talebi`} style={{ color: KAGIT.gold, fontWeight: 700 }}>{SUPPORT_EMAIL}</a> adresine yaz; en geç 30 gün içinde silinir.</>
            : <>uygulamanın içinden Ayarlar → Hesap ve gizlilik bölümünü kullan.</>}{' '}
          Ayrıntılar için <Link to="/gizlilik" style={{ color: KAGIT.gold, fontWeight: 700 }}>gizlilik politikası</Link>.
        </p>
      </Bolum>
    </LegalShell>
  );
}
