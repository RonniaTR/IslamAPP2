import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, ChevronLeft } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useTx } from '../i18n';
import { QURAN_PUBLIC, REVIEW_PARAM, REVIEW_TARGET } from '../config/quranAccess';

// 🔒 Kur'an içeren sayfaları saran kapı. Bayrak kapalıyken sayfa hiç yüklenmez;
// yerine sade bir bilgi kartı gösterilir. Bkz. config/quranAccess.js.
export default function QuranGate({ children }) {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const tt = useTx();
  const licensesPath = location.pathname.startsWith('/kids') ? '/kids/licenses' : '/licenses';

  if (QURAN_PUBLIC) return children;

  return (
    <div className="min-h-screen flex flex-col px-6 pt-8 pb-24" style={{ background: theme.bg }} data-testid="quran-gate">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 self-start mb-10" style={{ color: theme.textSecondary }}>
        <ChevronLeft size={20} /> <span className="text-sm font-semibold">{tt('Geri')}</span>
      </button>
      <div className="m-auto max-w-sm text-center rounded-[24px] p-7"
        style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}` }}>
        <ShieldCheck size={36} className="mx-auto mb-4" style={{ color: '#D4AF37' }} />
        <h1 className="text-lg font-bold mb-2" style={{ color: theme.textPrimary }}>
          {tt("Kur'an bölümü Diyanet onay sürecinde")}
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: theme.textSecondary }}>
          {tt("Kur'an-ı Kerim'in elektronik ortamda yayımlanması, Diyanet İşleri Başkanlığı Mushafları İnceleme ve Kıraat Kurulu onayına bağlıdır. Onay tamamlandığında bu bölüm açılacak.")}
        </p>
        <button onClick={() => navigate(licensesPath)} className="mt-5 text-sm font-semibold underline" style={{ color: theme.textPrimary }}>
          {tt('Kaynaklar ve lisanslar')}
        </button>
      </div>
    </div>
  );
}

// Kurul inceleme bağlantısı: /?inceleme=1
// İnceleyen kişi önce giriş ekranını görür ("Misafir olarak devam et"); ana ekrana vardığında
// doğrudan Kur'an listesine yönlendirilir. İşaret sekme kapanana kadar sessionStorage'da durur.
const REVIEW_KEY = 'kurul_inceleme';

export function ReviewRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (!QURAN_PUBLIC) return;
    try {
      const params = new URLSearchParams(location.search);
      if (params.get(REVIEW_PARAM) === '1') sessionStorage.setItem(REVIEW_KEY, '1');
      if (location.pathname === '/' && sessionStorage.getItem(REVIEW_KEY) === '1') {
        sessionStorage.removeItem(REVIEW_KEY);
        navigate(REVIEW_TARGET, { replace: true });
      }
    } catch { /* sessionStorage kapalıysa yönlendirme yapılmaz */ }
  }, [location.search, location.pathname, navigate]);
  return null;
}
