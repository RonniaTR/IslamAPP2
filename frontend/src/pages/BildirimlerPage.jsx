import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, BellRing } from 'lucide-react';
import { tercihOku, tercihYaz, izinIste, bildirimleriKur, denemeGonder } from '../services/bildirim';
import { TurListesi } from '../components/bildirim/BildirimIzni';

// 🔔 Bildirim tercihleri: türleri aç/kapa, saatleri seç, deneme bildirimi gönder.
const ALTIN = '#D8B76A';

export default function BildirimlerPage() {
  const navigate = useNavigate();
  const [tercih, setTercih] = useState(tercihOku);
  const [mesaj, setMesaj] = useState('');
  useEffect(() => { tercihYaz({ ...tercihOku(), ...tercih }); if (tercih.izin === 'verildi') bildirimleriKur(true); }, [tercih]);

  const izin = async () => { const t = await izinIste(); setTercih(t); setMesaj(t.izin === 'verildi' ? 'İzin verildi; bildirimler planlandı.' : 'İzin verilmedi. Telefonun Ayarlar > Bildirimler bölümünden açabilirsin.'); };
  const deneme = async () => { try { await denemeGonder(); setMesaj('3 saniye içinde örnek bildirim gelecek. Bildirimi aşağı çekip bir hâl seç.'); } catch { setMesaj('Bu cihazda bildirim gönderilemedi.'); } };

  return (
    <div data-testid="bildirimler" style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0B2E23 0%, #061A13 100%)', color: '#F4EFE3', paddingBottom: 130 }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px' }}>
        <button type="button" onClick={() => navigate(-1)} aria-label="Geri" style={{ width: 44, height: 44, borderRadius: 22, border: '1px solid rgba(216,183,106,0.35)', background: 'rgba(255,255,255,0.05)', color: '#F4EFE3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={22} />
        </button>
        <div>
          <h1 style={{ margin: 0, fontFamily: '"Fraunces", serif', fontSize: 24, fontWeight: 800 }}>Bildirimler</h1>
          <p style={{ margin: 0, fontSize: 13, color: 'rgba(244,239,227,0.65)' }}>Az, yerinde, senin seçtiğin</p>
        </div>
      </header>
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {tercih.izin !== 'verildi' && (
          <button type="button" onClick={izin} style={{ minHeight: 52, borderRadius: 26, border: 'none', background: ALTIN, color: '#1A1A1A', fontWeight: 800, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <BellRing size={18} /> Bildirimlere izin ver
          </button>
        )}
        <TurListesi tercih={tercih} setTercih={setTercih} saatler />
        <button type="button" onClick={deneme} disabled={tercih.izin !== 'verildi'}
          style={{ minHeight: 46, borderRadius: 23, border: `1px solid ${ALTIN}`, background: 'transparent', color: ALTIN, fontWeight: 700, opacity: tercih.izin === 'verildi' ? 1 : 0.45 }}>
          Deneme bildirimi gönder
        </button>
        {mesaj && <p style={{ margin: 0, fontSize: 13, color: 'rgba(244,239,227,0.8)', textAlign: 'center' }}>{mesaj}</p>}
        <p style={{ margin: 0, fontSize: 12, color: 'rgba(244,239,227,0.55)', lineHeight: 1.55 }}>
          Sıralama, son 7 günde en çok vakit geçirdiğin bölümlere göre yapılır. Bu bilgi yalnız bu telefonda tutulur, hiçbir yere gönderilmez.
          "Günün nasıl geçti?" bildiriminde bir hâl seçtiğinde gelen âyet, meal paketinden değiştirilmeden ve kaynağıyla gösterilir.
        </p>
      </div>
    </div>
  );
}
