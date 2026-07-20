import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import Confetti from './Confetti';

/**
 * DOĞRU / YANLIŞ CEVAP overlay'i — referans tasarım birebir.
 * mode: 'correct' | 'wrong' | null
 * correct: { xp, combo }
 * wrong:   { answer, explanation, source }
 */
export default function FeedbackOverlay({ mode, data = {}, onContinue, theme }) {
  return (
    <AnimatePresence>
      {mode && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-6"
          style={{ background: 'rgba(4, 12, 8, 0.88)', backdropFilter: 'blur(6px)' }}>
          <motion.div initial={{ scale: 0.85, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.4 }}
            className="relative w-full max-w-sm rounded-3xl p-7 text-center overflow-hidden"
            style={{
              background: mode === 'correct' ? 'linear-gradient(170deg, #062e1c, #04150d)' : 'linear-gradient(170deg, #2e0a0a, #150404)',
              border: `1.5px solid ${mode === 'correct' ? '#10B98160' : '#EF444460'}`,
            }}>
            {mode === 'correct' && <Confetti count={22} />}
            {/* İkon halkası */}
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: 'spring', bounce: 0.6 }}
              className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center relative"
              style={{ background: mode === 'correct' ? '#10B98122' : '#EF444422', border: `2.5px solid ${mode === 'correct' ? '#10B981' : '#EF4444'}` }}>
              {mode === 'correct' ? <Check size={38} strokeWidth={3} style={{ color: '#10B981' }} /> : <X size={38} strokeWidth={3} style={{ color: '#EF4444' }} />}
            </motion.div>

            {mode === 'correct' ? (
              <>
                <h3 className="text-2xl font-black mb-1" style={{ color: '#10B981' }}>Harika!</h3>
                <p className="text-xs mb-3" style={{ color: '#A8B5A0' }}>Doğru cevapladın.</p>
                <p className="text-3xl font-black mb-1" style={{ color: '#ffd369' }}>+{data.xp} XP</p>
                {data.combo >= 2 && (
                  <motion.p initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="text-sm font-black" style={{ color: '#F59E0B' }}>
                    🔥 COMBO x{data.combo}
                  </motion.p>
                )}
              </>
            ) : (
              <>
                <h3 className="text-2xl font-black mb-1" style={{ color: '#EF4444' }}>Maalesef!</h3>
                <p className="text-xs mb-3" style={{ color: '#A8B5A0' }}>
                  Doğru cevap: <span className="font-black" style={{ color: '#ffd369' }}>{data.answer}</span>
                </p>
                {data.explanation && (
                  <div className="rounded-xl p-3 mb-2 text-left" style={{ background: '#ffffff08', border: '1px solid #ffffff12' }}>
                    <p className="text-[10px] font-black uppercase tracking-wide mb-1" style={{ color: '#ffd369' }}>Açıklama</p>
                    <p className="text-xs leading-relaxed" style={{ color: '#e5ddd0' }}>{data.explanation}</p>
                  </div>
                )}
                {data.source && <p className="text-[9px]" style={{ color: '#A8B5A0' }}>Kaynak: {data.source}</p>}
              </>
            )}

            <button onClick={onContinue}
              className="w-full mt-5 py-3 rounded-2xl font-black text-sm active:scale-95 transition-transform"
              style={{
                background: mode === 'correct' ? '#10B981' : '#EF44441c',
                border: mode === 'correct' ? 'none' : '1px solid #EF444460',
                color: mode === 'correct' ? '#04150d' : '#f7bcbc',
              }}>
              Devam Et
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
