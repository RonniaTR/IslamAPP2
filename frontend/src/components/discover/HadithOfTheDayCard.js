import React, { useState, useEffect } from 'react';
import { BookOpen, Share2, Play, Pause, Loader2 } from 'lucide-react';
import { Typography } from '../ui/Typography';
import { db } from '../../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

export function HadithOfTheDayCard() {
  const [hadith, setHadith] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchRandomHadith = async () => {
      try {
        const randId = `hadith-${Math.floor(Math.random() * 500)}`;
        const docRef = doc(db, 'hadiths', randId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setHadith(docSnap.data());
        } else {
          // Fallback if not found
          setHadith({
            arabic: "مَنْ دَلَّ عَلَى خَيْرٍ فَلَهُ مِثْلُ أَجْرِ فَاعِلِهِ",
            turkish: "\"Kim bir hayra delalet ederse (öncülük ederse), ona o hayrı işleyenin sevabı kadar sevap verilir.\"",
            source: "Müslim",
            bookTr: "Zikir"
          });
        }
      } catch (e) {
        console.error("Error fetching hadith", e);
      } finally {
        setLoading(false);
      }
    };
    fetchRandomHadith();
  }, []);

  const toggleSpeech = () => {
    if (!hadith) return;
    
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(hadith.turkish);
      utterance.lang = 'tr-TR';
      utterance.rate = 0.9;
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '0 24px 24px', display: 'flex', justifyContent: 'center' }}>
        <Loader2 className="animate-spin text-[#CDA434]" size={32} />
      </div>
    );
  }

  return (
    <div style={{ padding: '0 24px 24px' }}>
      <div style={{
        position: 'relative',
        width: '100%',
        borderRadius: '24px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #1A1A1A 0%, #0D0D0D 100%)',
        boxShadow: '0 16px 32px rgba(0,0,0,0.3)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")',
          opacity: 0.1
        }} />
        
        <div style={{ position: 'relative', zIndex: 2, padding: '24px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.1)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <Typography variant="caption" style={{ color: '#FFF', fontWeight: 800, fontSize: '11px', textTransform: 'uppercase' }}>
                <span style={{ fontSize: '14px', marginRight: '4px' }}>🌟</span> Günün Hadisi
              </Typography>
            </div>
            <Typography variant="caption" style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{hadith?.source} {hadith?.bookTr && `- ${hadith.bookTr}`}</Typography>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <Typography variant="h2" style={{ color: '#CDA434', fontFamily: "'Amiri', serif", fontSize: '26px', lineHeight: 1.6, marginBottom: '16px' }}>
              {hadith?.arabic}
            </Typography>
            <Typography variant="bodySmall" style={{ color: '#FFF', lineHeight: 1.6, maxWidth: '90%', margin: '0 auto', fontSize: '15px' }}>
              {hadith?.turkish}
            </Typography>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={toggleSpeech}
              style={{
              flex: 1,
              padding: '12px',
              borderRadius: '12px',
              background: isPlaying ? 'rgba(205, 164, 52, 0.2)' : 'rgba(255,255,255,0.1)',
              border: isPlaying ? '1px solid #CDA434' : '1px solid rgba(255,255,255,0.2)',
              color: isPlaying ? '#CDA434' : '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}>
              {isPlaying ? <Pause size={16} /> : <Play size={16} />} 
              {isPlaying ? 'Durdur' : 'Sesli Dinle'}
            </button>
            <button style={{
              width: '44px',
              borderRadius: '12px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}>
              <Share2 size={16} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
