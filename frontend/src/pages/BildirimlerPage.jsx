import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, BellRing, BellOff, Sparkles, Clock } from 'lucide-react';
import { tercihOku, tercihYaz, izinIste, bildirimleriKur, denemeGonder, bildirimleriTamamenKapat } from '../services/bildirim';
import BildirimIzni, { TurListesi } from '../components/bildirim/BildirimIzni';

// 🔔 Bildirim tercihleri: tamamen kapatma anahtarı, türleri aç/kapa, saatleri seç, animasyonlu hâl/âyet ve namaz vakti bildirimi gönder.
const ALTIN = '#D8B76A';

export default function BildirimlerPage() {
  const navigate = useNavigate();
  const [tercih, setTercih] = useState(tercihOku);
  const [mesaj, setMesaj] = useState('');

  useEffect(() => {
    tercihYaz({ ...tercihOku(), ...tercih });
    if (!tercih.tamamenKapali && tercih.izin === 'verildi') bildirimleriKur(true);
  }, [tercih]);

  const izin = async () => {
    const t = await izinIste();
    setTercih(t);
    setMesaj('Akıllı bildirimler etkinleştirildi. Aşağıdan canlı bildirimi hemen deneyebilirsin.');
    denemeGonder('hal');
  };

  const tamamenKapatAc = async () => {
    const yeniKapali = !tercih.tamamenKapali;
    const t = await bildirimleriTamamenKapat(yeniKapali);
    setTercih(t);
    setMesaj(yeniKapali
      ? 'Tüm bildirimler tamamen kapatıldı. Artık hiçbir bildirim veya pencere çıkmayacak.'
      : 'Bildirimler yeniden açıldı.');
  };

  const canliHal = async () => {
    if (tercih.tamamenKapali) {
      const acik = { ...tercih, tamamenKapali: false, izin: 'verildi' };
      setTercih(tercihYaz(acik));
    }
    await denemeGonder('hal');
  };

  const canliNamaz = async () => {
    if (tercih.tamamenKapali) {
      const acik = { ...tercih, tamamenKapali: false, izin: 'verildi' };
      setTercih(tercihYaz(acik));
    }
    await denemeGonder('namaz');
  };

  return (
    <div data-testid="bildirimler" style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0B2E23 0%, #061A13 100%)', color: '#F4EFE3', paddingBottom: 130 }}>
      <BildirimIzni sadeceCanli />
      <header style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px' }}>
        <button type="button" onClick={() => navigate(-1)} aria-label="Geri" style={{ width: 44, height: 44, borderRadius: 22, border: '1px solid rgba(216,183,106,0.35)', background: 'rgba(255,255,255,0.05)', color: '#F4EFE3', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <ChevronLeft size={22} />
        </button>
        <div>
          <h1 style={{ margin: 0, fontFamily: '"Fraunces", serif', fontSize: 24, fontWeight: 800, color: '#F4EFE3' }}>Bildirimler</h1>
          <p style={{ margin: 0, fontSize: 13, color: 'rgba(244,239,227,0.72)' }}>Düşüncene göre âyet · Namaz vakti · Tam kontrol</p>
        </div>
      </header>
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 560, margin: '0 auto' }}>
        {/* Bildirimleri Tamamen Kapat / Aç Ana Şalteri */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 16px', borderRadius: 20, background: tercih.tamamenKapali ? 'rgba(239, 68, 68, 0.14)' : 'rgba(255,255,255,0.06)', border: `1.5px solid ${tercih.tamamenKapali ? '#EF4444' : 'rgba(216,183,106,0.35)'}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 40, height: 40, borderRadius: 14, background: tercih.tamamenKapali ? 'rgba(239, 68, 68, 0.22)' : 'rgba(216,183,106,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <BellOff size={19} color={tercih.tamamenKapali ? '#FCA5A5' : ALTIN} />
            </span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: '#F4EFE3' }}>Bildirimleri Tamamen Kapat</div>
              <div style={{ fontSize: 12, color: 'rgba(244,239,227,0.7)' }}>
                {tercih.tamamenKapali ? 'Kapalı — hiçbir bildirim veya pencere çıkmaz' : 'Açık olduğunda tüm bildirimler tamamen susturulur'}
              </div>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={!!tercih.tamamenKapali}
            data-testid="bildirim-tamamen-kapat-switch"
            onClick={tamamenKapatAc}
            style={{ width: 54, height: 30, borderRadius: 15, background: tercih.tamamenKapali ? '#EF4444' : 'rgba(255,255,255,0.18)', position: 'relative', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', flexShrink: 0 }}>
            <span style={{ position: 'absolute', top: 3, left: tercih.tamamenKapali ? 26 : 3, width: 22, height: 22, borderRadius: 11, background: '#FFF', transition: 'left 160ms' }} />
          </button>
        </div>

        {!tercih.tamamenKapali && tercih.izin !== 'verildi' && (
          <button type="button" onClick={izin} style={{ minHeight: 52, borderRadius: 26, border: 'none', background: ALTIN, color: '#1A1A1A', fontWeight: 800, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
            <BellRing size={18} /> Bildirimlere İzin Ver ve Etkinleştir
          </button>
        )}

        <TurListesi tercih={tercih} setTercih={setTercih} saatler />

        {/* Temalı Animasyonlu Bildirimleri Canlı Gör */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button type="button" data-testid="canli-hal-btn" onClick={canliHal}
            style={{ minHeight: 50, borderRadius: 20, border: `1.5px solid ${ALTIN}`, background: 'rgba(216,183,106,0.15)', color: '#F4EFE3', fontWeight: 800, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '0 12px', cursor: 'pointer' }}>
            <Sparkles size={16} color={ALTIN} /> Hâl &amp; Âyet Bildirimi
          </button>
          <button type="button" data-testid="canli-namaz-btn" onClick={canliNamaz}
            style={{ minHeight: 50, borderRadius: 20, border: '1.5px solid rgba(216,183,106,0.45)', background: 'rgba(255,255,255,0.06)', color: '#F4EFE3', fontWeight: 800, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '0 12px', cursor: 'pointer' }}>
            <Clock size={16} color={ALTIN} /> Vakit Hatırlatması
          </button>
        </div>

        {mesaj && <p style={{ margin: 0, fontSize: 13, color: ALTIN, fontWeight: 700, textAlign: 'center' }}>{mesaj}</p>}
        <p style={{ margin: 0, fontSize: 12, color: 'rgba(244,239,227,0.65)', lineHeight: 1.55 }}>
          &ldquo;Günün nasıl geçti?&rdquo; bildiriminde düşünceni ve hâlini seçtiğinde gelen âyet, meal paketinden değiştirilmeden ve kaynağıyla temalı bir kartta açılır. Kapatılan bildirimler gün içinde bir daha tekrar çıkmaz.
        </p>
      </div>
    </div>
  );
}
