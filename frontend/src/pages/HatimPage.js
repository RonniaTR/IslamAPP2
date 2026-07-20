import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Users, CheckCircle, Circle, Plus, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { db } from '../services/firebase';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';

export default function HatimPage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [hatimData, setHatimData] = useState(null);
  const [hatimId, setHatimId] = useState('global_hatim_1'); // Default global room

  useEffect(() => {
    const docRef = doc(db, 'hatims', hatimId);
    
    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setHatimData(snap.data());
      } else {
        // Initialize if not exists
        const initialJuzs = Array.from({ length: 30 }, (_, i) => ({
          juzNumber: i + 1,
          assignedTo: null,
          assignedName: null,
          completed: false
        }));
        setDoc(docRef, {
          id: hatimId,
          createdAt: new Date().toISOString(),
          juzs: initialJuzs
        }).catch(console.error);
      }
    });

    return () => unsubscribe();
  }, [hatimId]);

  const claimJuz = async (juzIndex) => {
    if (!hatimData || !user) return;
    const juz = hatimData.juzs[juzIndex];
    if (juz.assignedTo && juz.assignedTo !== user.user_id && juz.assignedTo !== user.id) {
      alert("Bu cüz başkası tarafından alınmış.");
      return;
    }
    
    const newJuzs = [...hatimData.juzs];
    const isMine = juz.assignedTo === (user.user_id || user.id);
    
    // Toggle claim/unclaim or complete
    if (!isMine && !juz.assignedTo) {
      // Claim
      newJuzs[juzIndex].assignedTo = user.user_id || user.id;
      newJuzs[juzIndex].assignedName = user.name || 'İsimsiz Yiğit';
    } else if (isMine && !juz.completed) {
      // Mark Complete
      newJuzs[juzIndex].completed = true;
    } else if (isMine && juz.completed) {
      // Unclaim / Reset
      newJuzs[juzIndex].completed = false;
      newJuzs[juzIndex].assignedTo = null;
      newJuzs[juzIndex].assignedName = null;
    }

    try {
      await updateDoc(doc(db, 'hatims', hatimId), { juzs: newJuzs });
    } catch(e) { console.error(e); }
  };

  if (!hatimData) return <div className="min-h-screen flex items-center justify-center" style={{ background: theme.bg }}>Yükleniyor...</div>;

  const completedCount = hatimData.juzs.filter(j => j.completed).length;

  return (
    <div className="min-h-screen pb-24" style={{ background: theme.bg }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-6 pb-4 sticky top-0 z-10" style={{ background: theme.surface }}>
        <button onClick={() => navigate(-1)} className="p-2 transition-opacity hover:opacity-70">
          <ChevronLeft size={24} style={{ color: theme.textPrimary }} />
        </button>
        <h1 className="font-bold text-lg" style={{ color: theme.textPrimary }}>Sosyal Hatim</h1>
        <button className="p-2" onClick={() => {
          navigator.clipboard.writeText(`Gel beraber hatim indirelim! Oda: ${hatimId}`);
          alert('Davet linki kopyalandı!');
        }}>
          <Share2 size={20} style={{ color: theme.primary }} />
        </button>
      </div>

      <div className="px-4 mt-4">
        {/* Progress Card */}
        <div className="rounded-2xl p-6 text-center mb-6" style={{ background: theme.surface, border: `1px solid ${theme.cardBorder}` }}>
          <Users size={32} className="mx-auto mb-2" style={{ color: theme.gold }} />
          <h2 className="text-xl font-bold mb-1" style={{ color: theme.textPrimary }}>Kolektif Hatim</h2>
          <p className="text-sm mb-4" style={{ color: theme.textSecondary }}>Bu hatimi diğer kardeşlerimizle birlikte tamamlıyoruz.</p>
          
          <div className="w-full bg-black/10 rounded-full h-4 mb-2 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(completedCount/30)*100}%`, background: theme.primary }} />
          </div>
          <p className="text-xs font-bold" style={{ color: theme.primary }}>{completedCount} / 30 Cüz Tamamlandı</p>
        </div>

        {/* Juz List */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {hatimData.juzs.map((juz, idx) => {
            const isMine = juz.assignedTo === (user?.user_id || user?.id);
            const isTaken = juz.assignedTo && !isMine;
            
            let statusColor = theme.surfaceLight;
            let textColor = theme.textPrimary;
            if (juz.completed) {
              statusColor = `${theme.success}20`;
              textColor = theme.success;
            } else if (isMine) {
              statusColor = `${theme.primary}20`;
              textColor = theme.primary;
            } else if (isTaken) {
              statusColor = `${theme.textSecondary}20`;
              textColor = theme.textSecondary;
            }

            return (
              <motion.button
                whileTap={isTaken ? {} : { scale: 0.95 }}
                key={idx}
                onClick={() => claimJuz(idx)}
                disabled={isTaken}
                className="p-3 rounded-xl flex flex-col items-center justify-center border transition-all"
                style={{ 
                  background: statusColor, 
                  borderColor: isMine || juz.completed ? textColor : theme.cardBorder,
                  opacity: isTaken ? 0.7 : 1
                }}
              >
                <div className="text-lg font-bold mb-1" style={{ color: textColor }}>{juz.juzNumber}. Cüz</div>
                {juz.completed ? (
                  <CheckCircle size={20} color={theme.success} className="mb-1" />
                ) : (
                  <Circle size={20} color={textColor} className="mb-1" />
                )}
                <div className="text-[10px] font-medium truncate w-full text-center" style={{ color: theme.textSecondary }}>
                  {juz.assignedName ? juz.assignedName : 'Alınmadı'}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
