import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, ChevronDown, Info } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLang } from '../../contexts/LangContext';
import { useTx } from '../../i18n';
import { donusPalette, TEMEL_COLORS, alpha } from '../../donus/palette';
import { getTemel } from '../../data/donusTemeller';

// 🧱 TEMEL — "namaz nasıl kılınır", "abdest nasıl alınır" gibi bir modül.
//
// Adımlar tek tek açılan kartlar hâlinde. Açılan adım okundu sayılır ve
// üstteki ilerleme halkası dolar — kişi nerede kaldığını görür. Kayıt
// localStorage'da tutulur; ders bir sonraki gelişte kaldığı yerden devam eder.

const READ_KEY = 'donus_temel_read';

const load = () => { try { return JSON.parse(localStorage.getItem(READ_KEY)) || {}; } catch { return {}; } };
const save = (v) => { try { localStorage.setItem(READ_KEY, JSON.stringify(v)); } catch { /* quota */ } };

export default function DonusTemel() {
  const { theme } = useTheme();
  const { lang } = useLang();
  const tt = useTx();
  const navigate = useNavigate();
  const { id } = useParams();

  const temel = useMemo(() => getTemel(id, lang), [id, lang]);
  const [openIdx, setOpenIdx] = useState(0);
  const [seen, setSeen] = useState(() => (load()[id] || []));

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  const mark = (i) => {
    if (seen.includes(i)) return;
    const next = [...seen, i];
    setSeen(next);
    const all = load();
    all[id] = next;
    save(all);
  };

  if (!temel) {
    return (
      <div className="px-5 pt-10 text-center">
        <p className="text-sm font-black" style={{ color: theme.textPrimary }}>{tt('Bulunamadı')}</p>
        <button onClick={() => navigate('/donus')} className="mt-4 text-[11px] font-black"
          style={{ color: theme.gold }}>{tt('Geri')}</button>
      </div>
    );
  }

  const p = donusPalette(theme, TEMEL_COLORS[temel.color]);
  const pct = temel.items.length ? seen.length / temel.items.length : 0;
  const ltr = lang === 'ar';
  const dirProps = ltr ? { dir: 'ltr' } : {};
  const dirStyle = ltr ? { textAlign: 'left' } : {};

  return (
    <div className="px-5 pt-4">
      {/* ── Başlık ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
        <button onClick={() => navigate('/donus')}
          className="w-8 h-8 rounded-xl flex items-center justify-center active:scale-90 transition-transform mb-4"
          style={{ background: p.cardTint, border: `1px solid ${p.borderSoft}` }} aria-label={tt('Geri')}>
          <ArrowLeft size={15} style={{ color: p.accent }} />
        </button>

        <div className="flex items-center gap-4">
          <motion.span className="text-5xl"
            animate={{ y: [0, -6, 0] }} transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ filter: `drop-shadow(0 0 16px ${alpha(p.accentGlow, 0.6)})` }}>
            {temel.icon}
          </motion.span>
          <div className="flex-1 min-w-0">
            <h1 className="text-[23px] font-black leading-tight"
              style={{ fontFamily: 'Playfair Display, serif', color: p.text }}>
              {temel.title}
            </h1>
            <p className="text-[11.5px] mt-1" style={{ color: p.accent }}>{temel.lead}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: alpha(p.accent, 0.14) }}>
            <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${pct * 100}%` }}
              transition={{ duration: 0.7 }}
              style={{ background: `linear-gradient(90deg, ${p.accent}, ${p.accentGlow})` }} />
          </div>
          <span className="text-[10px] font-black tabular-nums" style={{ color: p.accent }}>
            {seen.length}/{temel.items.length}
          </span>
        </div>
      </motion.div>

      {/* ── Giriş ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}
        className="rounded-2xl p-4 mb-4"
        style={{ background: p.cardStrong, border: `1.5px solid ${p.borderSoft}` }}>
        <p className="text-[12.5px] leading-relaxed" {...dirProps}
          style={{ color: p.text, opacity: 0.9, ...dirStyle }}>{temel.intro}</p>
      </motion.div>

      {/* ── Adımlar ── */}
      <div className="space-y-2.5">
        {temel.items.map((it, i) => {
          const open = openIdx === i;
          const isSeen = seen.includes(i);
          return (
            <motion.div key={i}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.42 }}
              className="rounded-2xl overflow-hidden"
              style={{
                background: open ? p.cardStrong : p.card,
                border: `1.5px solid ${open ? p.border : p.borderSoft}`,
                boxShadow: open ? p.shadow : 'none',
              }}>
              <button
                onClick={() => { const nxt = open ? -1 : i; setOpenIdx(nxt); if (!open) mark(i); }}
                className="w-full p-4 flex items-center gap-3 text-left">
                <span className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-black shrink-0"
                  style={{
                    background: isSeen ? p.accent : alpha(p.accent, 0.13),
                    color: isSeen ? p.onAccent : p.accent,
                    border: `1.5px solid ${alpha(p.accent, isSeen ? 1 : 0.28)}`,
                  }}>
                  {isSeen ? <Check size={13} strokeWidth={3} /> : i + 1}
                </span>
                <p className="flex-1 text-[13px] font-black leading-snug" {...dirProps}
                  style={{ color: p.text, ...dirStyle }}>{it.title}</p>
                <motion.span animate={{ rotate: open ? 180 : 0 }} className="shrink-0">
                  <ChevronDown size={15} style={{ color: p.dim }} />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}>
                    <div className="px-4 pb-4 pl-[60px]">
                      {it.ar && (
                        <p dir="rtl" lang="ar" className="text-[19px] leading-[2.1] mb-2.5 text-right"
                          style={{
                            fontFamily: "'Amiri', 'Scheherazade New', serif", color: p.accent,
                            textShadow: `0 0 18px ${alpha(p.accentGlow, 0.3)}`,
                          }}>
                          {it.ar}
                        </p>
                      )}
                      {it.tr && (
                        <p className="text-[12px] italic leading-relaxed mb-2" {...dirProps}
                          style={{ fontFamily: 'Georgia, serif', color: p.text, opacity: 0.85, ...dirStyle }}>
                          “{it.tr}”
                        </p>
                      )}
                      {it.body && (
                        <p className="text-[12.5px] leading-[1.8]" {...dirProps}
                          style={{ color: p.text, opacity: 0.82, ...dirStyle }}>{it.body}</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* ── Not ── */}
      {temel.note && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="rounded-2xl p-4 mt-4 flex items-start gap-2.5"
          style={{ background: p.card, border: `1px solid ${p.borderSoft}` }}>
          <Info size={14} className="shrink-0 mt-0.5" style={{ color: p.accent }} />
          <p className="text-[11px] leading-relaxed" {...dirProps}
            style={{ color: p.dim, ...dirStyle }}>{temel.note}</p>
        </motion.div>
      )}

      {/* ── Tamamlandı ── */}
      {seen.length === temel.items.length && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-4 mt-4 text-center"
          style={{ background: alpha(p.accent, 0.14), border: `1.5px solid ${p.border}` }}>
          <p className="text-[12.5px] font-black" style={{ color: p.accent }}>
            ✓ {tt('Bu bölümü bitirdin — istediğin zaman geri dönebilirsin')}
          </p>
        </motion.div>
      )}
    </div>
  );
}
