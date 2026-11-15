import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Send, Loader2, Phone, BookOpen } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useTx } from '../i18n';
import api from '../api';

// 📚 REHBER — kaynaklı yapay zekâ (tuval M1–M4, backend/rehber.py)
// İlke: kütüphaneci, müftü değil. Her cevap bir güven etiketi ve kaynak listesi taşır.
// Görsel kural: yapay zekâ metni koyu kart + altın sol çizgi; kutsal metin her zaman kâğıt kartta.

const PAPER = '#FBF8F0';
const INK = '#1A1A1A';
const LABELS = {
  acik: { text: 'Kaynakta açık', bg: '#1F4D33', fg: '#8EE3B0' },
  fark: { text: 'Görüş farkı var', bg: '#4A3A12', fg: '#F2CF6B' },
  yok: { text: 'Kaynağım yok', bg: '#4A1F1F', fg: '#F2A6A6' },
};
const TABS = [['sor', 'Sor'], ['bugun', 'Bugün bana ne söyler?'], ['dogrula', 'Doğrula'], ['anlat', 'Kendi cümlenle']];

function AyahCard({ s, onOpen, tt }) {
  return (
    <button onClick={onOpen} className="w-full text-left rounded-xl p-4" style={{ background: PAPER, color: INK }}>
      <p className="text-[14px] leading-relaxed">{s.meal}</p>
      <p className="text-[11px] mt-2" style={{ color: '#8A7A55' }}>[{s.n}] {s.ref} · {tt('Sureyi aç')} ›</p>
    </button>
  );
}

export default function RehberPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const tt = useTx();
  const [tab, setTab] = useState('sor');
  const [text, setText] = useState('');
  const [surah, setSurah] = useState('');
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState(null);
  const [err, setErr] = useState('');
  const [why, setWhy] = useState(false);

  const pick = (t) => { setTab(t); setRes(null); setErr(''); setText(''); setWhy(false); };

  const run = async () => {
    const q = text.trim();
    if (q.length < 3 || busy) return;
    setBusy(true); setErr(''); setRes(null); setWhy(false);
    try {
      let data;
      if (tab === 'sor') ({ data } = await api.post('/rehber/sor', { question: q }));
      else if (tab === 'bugun') ({ data } = await api.post('/rehber/ayet', { text: q }));
      else if (tab === 'dogrula') ({ data } = await api.post('/rehber/dogrula', { text: q }));
      else ({ data } = await api.post('/rehber/anlat', { surah: Number(surah) || 1, text: q }));
      setRes(data);
    } catch (e) {
      setErr(tt('Şu an cevap alınamadı. İnternet bağlantını kontrol edip yeniden dene.'));
    } finally { setBusy(false); }
  };

  const hint = {
    sor: 'Bir soru yaz. Cevap yalnız uygulamadaki meal ve tefsire dayanır.',
    bugun: 'Gününü bir cümleyle anlat. Yorum yapmayız; sana en yakın ayetleri buluruz.',
    dogrula: 'Sana gelen bir "hadis" mesajını yapıştır. Kaynaklarda arayalım.',
    anlat: 'Bir sure numarası yaz, o sureyi kendi cümlelerinle özetle. Tefsirle karşılaştıralım; puan yok.',
  }[tab];
  const placeholder = { sor: 'Sorunu yaz…', bugun: 'Bugün…', dogrula: 'Mesajı buraya yapıştır…', anlat: 'Bu sure şunu anlatıyor…' }[tab];

  const aiCard = { background: '#0A1F14', color: '#F5F5DC', borderLeft: '3px solid #D4AF37', borderRadius: 18, padding: 16 };
  const L = res?.label ? LABELS[res.label] : null;

  return (
    <div className="min-h-screen pb-28" style={{ background: theme.bg }} data-testid="rehber-page">
      <div className="flex items-center gap-2 px-4 pt-6 pb-3">
        <button onClick={() => navigate(-1)} aria-label={tt('Geri')}><ChevronLeft size={24} style={{ color: theme.textPrimary }} /></button>
        <div>
          <h1 className="text-xl font-extrabold" style={{ color: theme.textPrimary }}>{tt('Rehber')}</h1>
          <p className="text-[11px]" style={{ color: theme.textSecondary }}>{tt('Yapay zekâ · kaynak gösterir · fetva vermez')}</p>
        </div>
      </div>

      <div className="px-4 flex gap-2 overflow-x-auto pb-2">
        {TABS.map(([id, n]) => (
          <button key={id} onClick={() => pick(id)} aria-pressed={tab === id}
            style={{ whiteSpace: 'nowrap', minHeight: 36, padding: '0 14px', borderRadius: 18, fontSize: 13, fontWeight: tab === id ? 700 : 500,
              background: tab === id ? theme.gold : 'transparent', color: tab === id ? '#1A1A1A' : theme.textPrimary, border: `1px solid ${tab === id ? theme.gold : theme.cardBorder}` }}>
            {tt(n)}
          </button>
        ))}
      </div>

      <div className="px-4 mt-2 flex flex-col gap-3 max-w-xl mx-auto">
        <p className="text-[13px]" style={{ color: theme.textSecondary }}>{tt(hint)}</p>

        {tab === 'anlat' && (
          <input type="number" min="1" max="114" value={surah} onChange={(e) => setSurah(e.target.value)} placeholder={tt('Sure numarası (1–114)')}
            style={{ minHeight: 44, borderRadius: 14, padding: '0 12px', background: theme.inputBg, color: theme.textPrimary, border: `1px solid ${theme.inputBorder}`, fontSize: 14 }} />
        )}
        <div className="flex gap-2 items-end">
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={tab === 'sor' ? 2 : 3} placeholder={tt(placeholder)}
            style={{ flex: 1, borderRadius: 16, padding: 12, background: theme.inputBg, color: theme.textPrimary, border: `1px solid ${theme.inputBorder}`, fontSize: 14, resize: 'none' }} />
          <button onClick={run} disabled={busy || text.trim().length < 3} aria-label={tt('Gönder')}
            style={{ width: 48, height: 48, borderRadius: 24, background: theme.gold, opacity: busy || text.trim().length < 3 ? 0.4 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {busy ? <Loader2 size={20} className="animate-spin" color="#1A1A1A" /> : <Send size={20} color="#1A1A1A" />}
          </button>
        </div>

        {err && <p role="alert" className="text-[13px]" style={{ color: theme.error || '#F2A6A6' }}>{err}</p>}

        {/* SOR */}
        {res && tab === 'sor' && (
          <div style={aiCard}>
            <div className="flex items-center gap-2 mb-2">
              {L && <span style={{ background: L.bg, color: L.fg, fontSize: 11, fontWeight: 700, borderRadius: 8, padding: '3px 9px' }}>{tt(L.text)}</span>}
              <span style={{ fontSize: 10, color: '#7E9488', letterSpacing: 0.4 }}>{tt('YAPAY ZEKÂ · KAYNAKLI')}</span>
            </div>
            <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{res.answer}</p>
            {res.label !== 'acik' && (
              <a href="tel:190" className="mt-3 flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: '#16301F', color: '#F5F5DC', fontSize: 13, fontWeight: 600 }}>
                <Phone size={15} color="#D4AF37" /> {tt('Diyanet fetva hattı · Alo 190')}
              </a>
            )}
            {res.sources?.length > 0 && (
              <button onClick={() => setWhy(!why)} className="mt-3" style={{ minHeight: 32, padding: '0 12px', borderRadius: 16, border: '1px solid #7A6A2C', color: '#D4AF37', fontSize: 12 }}>
                {why ? tt('Kaynakları gizle') : tt('Nereden biliyorum?')}
              </button>
            )}
            {why && (
              <div className="mt-3 flex flex-col gap-2">
                {res.sources.map((s) => <AyahCard key={s.n} s={s} tt={tt} onOpen={() => navigate(`/quran/${s.surah}`)} />)}
                <p style={{ fontSize: 10, color: '#7E9488' }}>{res.credits?.meal}{res.credits?.tafsir ? ` · ${res.credits.tafsir}` : ''}</p>
              </div>
            )}
          </div>
        )}

        {/* BUGÜN */}
        {res && tab === 'bugun' && (
          res.results?.length ? (
            <>
              {res.results.map((s) => <AyahCard key={s.n} s={s} tt={tt} onOpen={() => navigate(`/quran/${s.surah}`)} />)}
              <p style={{ fontSize: 10, color: theme.textMuted }}>{res.credits?.meal} · {tt('Yazdığın cümle saklanmaz.')}</p>
            </>
          ) : <p className="text-[13px]" style={{ color: theme.textSecondary }}>{tt('Bu cümleye yakın bir ayet bulamadım. Başka kelimelerle dener misin?')}</p>
        )}

        {/* DOĞRULA */}
        {res && tab === 'dogrula' && (
          <div style={aiCard}>
            <p className="text-[16px] font-bold mb-1">{res.result === 'bulundu' ? `✓ ${tt('Kaynakta bulundu')}` : `? ${tt('Kaynaklarda bulunamadı')}`}</p>
            {res.hadith && (
              <div className="rounded-xl p-3 mt-2" style={{ background: '#16301F' }}>
                <p className="text-[13px] leading-relaxed">{res.hadith.text}</p>
                <p className="text-[11px] mt-2" style={{ color: '#D4AF37' }}>{res.hadith.source}</p>
              </div>
            )}
            <p className="text-[12px] mt-3" style={{ color: '#9DB3A5' }}>{res.note}</p>
          </div>
        )}

        {/* ANLAT */}
        {res && tab === 'anlat' && (
          <div style={aiCard}>
            <span style={{ fontSize: 10, color: '#7E9488', letterSpacing: 0.4 }}>{tt('YAPAY ZEKÂ · TEFSİRLE KARŞILAŞTIRDI')}</span>
            {res.caught && <p className="text-[14px] leading-relaxed mt-2"><strong>{tt('Yakaladığın')}:</strong> {res.caught}</p>}
            {res.add && <p className="text-[14px] leading-relaxed mt-2"><strong>{tt('Ekleyebileceğin')}:</strong> {res.add}</p>}
            <button onClick={() => navigate(`/quran/${Number(surah) || 1}`)} className="mt-3 flex items-center gap-2" style={{ color: '#D4AF37', fontSize: 13, fontWeight: 600 }}>
              <BookOpen size={15} /> {tt('Tefsiri aç')}
            </button>
            <p style={{ fontSize: 10, color: '#7E9488', marginTop: 8 }}>{res.credits?.tafsir}</p>
          </div>
        )}
      </div>
    </div>
  );
}
