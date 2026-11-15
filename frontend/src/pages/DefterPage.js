import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Trash2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useTx } from '../i18n';

// 📓 HAYAT AYETLERİ DEFTERİ (docs/YENI_OZELLIKLER.md 8.9)
// Mushaf'ta bir ayete dokunup "Defterime ekle" denince buraya düşer: ayet + tarih + isteğe bağlı tek cümle.
// Yalnız cihazda durur. Ayet metni kâğıt kartta gösterilir.
export const DEFTER_KEY = 'hayat_ayetleri_v1';
export const loadDefter = () => { try { return JSON.parse(localStorage.getItem(DEFTER_KEY)) || []; } catch { return []; } };
export const addToDefter = (entry) => {
  const list = loadDefter();
  if (list.some((x) => x.surah === entry.surah && x.ayah === entry.ayah)) return false;
  try { localStorage.setItem(DEFTER_KEY, JSON.stringify([{ ...entry, at: Date.now(), note: '' }, ...list])); } catch { return false; }
  return true;
};

export default function DefterPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const tt = useTx();
  const [list, setList] = useState(loadDefter);
  const persist = (next) => { setList(next); try { localStorage.setItem(DEFTER_KEY, JSON.stringify(next)); } catch { /* kota */ } };
  const year = new Date().getFullYear();
  const thisYear = list.filter((x) => new Date(x.at).getFullYear() === year).length;

  return (
    <div className="min-h-screen pb-28" style={{ background: theme.bg }} data-testid="defter-page">
      <div className="flex items-center gap-2 px-4 pt-6 pb-3">
        <button onClick={() => navigate(-1)} aria-label={tt('Geri')}><ChevronLeft size={24} style={{ color: theme.textPrimary }} /></button>
        <div>
          <h1 className="text-xl font-extrabold" style={{ color: theme.textPrimary }}>{tt('Hayat Ayetleri')}</h1>
          <p style={{ color: theme.textSecondary, fontSize: 11 }}>{year} · {thisYear} {tt('ayet seninle kaldı')}</p>
        </div>
      </div>
      <div className="px-4 max-w-xl mx-auto flex flex-col gap-3">
        {list.length === 0 && (
          <p style={{ color: theme.textSecondary, fontSize: 14, lineHeight: 1.6 }}>
            {tt("Mushaf'ta bir ayete dokun ve “Defterime ekle”yi seç. Zor ya da güzel bir anda karşına çıkan ayetler burada birikir.")}
          </p>
        )}
        {list.map((x) => (
          <div key={`${x.surah}:${x.ayah}`} style={{ background: '#FBF8F0', color: '#1A1A1A', borderRadius: 14, padding: 14 }}>
            <p dir="rtl" lang="ar" style={{ fontFamily: "'Amiri', serif", fontSize: 21, lineHeight: 1.9, textAlign: 'right' }}>{x.ar}</p>
            {x.meal && <p style={{ fontSize: 13.5, lineHeight: 1.55, marginTop: 6 }}>{x.meal}</p>}
            <input value={x.note || ''} placeholder={tt('Bir cümle not (isteğe bağlı)')} aria-label={tt('Not')}
              onChange={(e) => persist(list.map((y) => (y === x ? { ...y, note: e.target.value } : y)))}
              style={{ width: '100%', marginTop: 8, minHeight: 38, borderRadius: 10, padding: '0 10px', background: '#FFFDF6', border: '1px solid #D6C79E', fontSize: 13, color: '#1A1A1A' }} />
            <div className="flex items-center justify-between mt-2" style={{ fontSize: 11, color: '#8A7A55' }}>
              <button onClick={() => navigate(`/quran/${x.surah}`)}>{x.surah}:{x.ayah} · {new Date(x.at).toLocaleDateString('tr-TR')} ›</button>
              <button onClick={() => persist(list.filter((y) => y !== x))} aria-label={tt('Defterden çıkar')}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
