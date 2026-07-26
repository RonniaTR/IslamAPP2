import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Volume2, Loader } from 'lucide-react';
import api from '../../api';
import { useTx } from '../../i18n';

/**
 * QUIZCORE — bütün soru tabanlı modların ortak motoru.
 * ─────────────────────────────────────────────────────
 * Soru kartı + şıklar + doğru/yanlış renklendirme + jokerle gizlenen
 * şıklar + 🔊 SESLENDİRME (backend Edge-TTS → tarayıcı yedeği) +
 * 📳 titreşim. Buraya eklenen her iyileştirme TÜM modlara yansır.
 *
 * Kontrollü bileşen: akış (süre, can, skor) oyunda kalır.
 *   q:        {type:'mc'|'tf', question, options, correct_index, category?}
 *   flash:    seçilen şık indexi | null (oyun yönetir)
 *   hidden:   joker ile gizlenen şık indexleri
 *   onPick:   (index) => void
 *   percentHint: sayı → "≈ %X oyuncu doğru cevapladı" satırı
 */

const LS_NARRATE = 'voice_narration';
export const narrationEnabled = () => { try { return localStorage.getItem(LS_NARRATE) === '1'; } catch { return false; } };
export const setNarrationEnabled = (on) => { try { localStorage.setItem(LS_NARRATE, on ? '1' : '0'); } catch { /* ignore */ } };

export default function QuizCore({ q, accent, theme, flash, hidden = [], onPick, percentHint, minHeight = 110 }) {
  const tt = useTx();
  const options = q ? (q.type === 'tf' ? ['Doğru', 'Yanlış'] : q.options) : [];

  // 📳 Titreşim: cevap anında (doğru kısa, yanlış çift)
  const prevFlash = useRef(null);
  useEffect(() => {
    if (q && flash !== null && prevFlash.current === null && navigator.vibrate) {
      navigator.vibrate(flash === q.correct_index ? 28 : [55, 45, 55]);
    }
    prevFlash.current = flash;
  }, [flash, q]);

  // 🔊 Seslendirme (backend TTS → Web Speech yedeği)
  const [speaking, setSpeaking] = useState(false);
  const [narrate, setNarrate] = useState(narrationEnabled);
  const audioRef = useRef(null);

  const stopSpeak = useCallback(() => {
    if (audioRef.current) { try { audioRef.current.pause(); } catch { /* ignore */ } audioRef.current = null; }
    try { window.speechSynthesis?.cancel(); } catch { /* ignore */ }
    setSpeaking(false);
  }, []);

  const fallbackSpeak = useCallback((text) => {
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'tr-TR'; u.rate = 0.95;
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(u);
    } catch { setSpeaking(false); }
  }, []);

  const speak = useCallback(async (text) => {
    if (!text) return;
    stopSpeak();
    setSpeaking(true);
    try {
      const { data } = await api.post('/tts', { text });
      if (data?.audio) {
        const a = new Audio(`data:audio/mp3;base64,${data.audio}`);
        audioRef.current = a;
        a.onended = () => setSpeaking(false);
        a.onerror = () => fallbackSpeak(text);
        await a.play();
        return;
      }
      throw new Error('empty');
    } catch { fallbackSpeak(text); }
  }, [stopSpeak, fallbackSpeak]);

  // Sesli anlatım açıksa yeni soruyu otomatik oku (şıklarla birlikte)
  const qKey = q ? (q.id || q.question) : null;
  useEffect(() => {
    if (narrate && q) {
      const optText = options.map((o, i) => `${['A', 'B', 'C', 'D'][i]}: ${o}`).join('. ');
      speak(`${q.question} ${optText}`);
    }
    return stopSpeak;
  }, [qKey, narrate]); // yalnızca soru değişince oku (options türetilmiş değer)

  if (!q) return null;

  return (
    <div>
      {/* Soru kartı */}
      <div className="rounded-2xl p-5 mb-4 relative" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, minHeight }}>
        <div className="flex items-center justify-between gap-2">
          {q.category && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${accent}18`, color: accent }}>{tt(q.category)}</span>
          )}
          <div className="flex items-center gap-1.5 ml-auto">
            {/* Tek seferlik okuma */}
            <button onClick={() => (speaking ? stopSpeak() : speak(q.question))}
              className="w-7 h-7 rounded-lg flex items-center justify-center active:scale-90 transition-transform"
              style={{ background: `${accent}14`, border: `1px solid ${accent}35` }}
              aria-label="Soruyu seslendir">
              {speaking ? <Loader size={13} className="animate-spin" style={{ color: accent }} /> : <Volume2 size={13} style={{ color: accent }} />}
            </button>
            {/* Otomatik sesli anlatım */}
            <button onClick={() => { const v = !narrate; setNarrate(v); setNarrationEnabled(v); if (!v) stopSpeak(); }}
              className="text-[8px] font-black px-2 py-1 rounded-lg active:scale-95 transition-transform"
              style={{
                background: narrate ? `${accent}20` : `${theme.textSecondary}10`,
                border: `1px solid ${narrate ? `${accent}50` : theme.cardBorder}`,
                color: narrate ? accent : theme.textSecondary,
              }}>
              {tt('OTO')} {narrate ? tt('AÇIK') : tt('KAPALI')}
            </button>
          </div>
        </div>
        <h3 className="text-base font-bold mt-2.5" style={{ color: theme.textPrimary }}>{q.question}</h3>
      </div>

      {/* Şıklar */}
      <div className={q.type === 'tf' ? 'grid grid-cols-2 gap-3' : 'flex flex-col gap-2.5'}>
        {options.map((opt, i) => {
          if (hidden.includes(i)) {
            return <div key={i} className="p-3.5 rounded-xl text-sm" style={{ background: `${theme.textSecondary}06`, border: `1px dashed ${theme.cardBorder}`, color: `${theme.textSecondary}60` }}>—</div>;
          }
          const chosen = flash === i;
          const isRight = flash !== null && i === q.correct_index;
          const isWrong = chosen && !isRight;
          return (
            <motion.button key={i} onClick={() => onPick(i)} disabled={flash !== null}
              animate={isRight && flash !== null ? { scale: [1, 1.03, 1] } : isWrong ? { x: [-5, 5, -3, 0] } : {}}
              transition={{ duration: 0.35 }}
              className="p-3.5 rounded-xl text-sm font-semibold text-left transition-colors active:scale-98 flex items-center justify-between"
              style={{
                background: isRight ? '#10B98122' : isWrong ? '#EF444422' : `${theme.textSecondary}0f`,
                border: `1px solid ${isRight ? '#10B981' : isWrong ? '#EF4444' : theme.cardBorder}`,
                color: theme.textPrimary,
                boxShadow: isRight ? '0 0 18px #10B98130' : 'none',
              }}>
              <span>
                {q.type !== 'tf' && <span className="font-bold mr-2" style={{ color: accent }}>{['A', 'B', 'C', 'D'][i]}.</span>}
                {opt}
              </span>
              {isRight && <Check size={15} style={{ color: '#10B981' }} />}
              {isWrong && <X size={15} style={{ color: '#EF4444' }} />}
            </motion.button>
          );
        })}
      </div>

      {typeof percentHint === 'number' && (
        <p className="text-center text-[10px] mt-3" style={{ color: theme.textSecondary }}>≈ %{percentHint} oyuncu bunu doğru cevapladı</p>
      )}
    </div>
  );
}
