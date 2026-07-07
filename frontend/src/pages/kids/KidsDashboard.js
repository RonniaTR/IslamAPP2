import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Star, Diamond, Flame, Shield, Gift, CheckCircle2 } from 'lucide-react';
import { COLORS, TYPOGRAPHY, RADIUS, SHADOWS, KIDS_CATEGORIES } from '../../styles/designTokens';
import { useAppMode } from '../../contexts/AppModeContext';

// ─── Stat Kartı ───
function StatBadge({ icon, value, label, labelColor }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '12px 16px',
      borderRadius: RADIUS.kidsLg,
      background: 'rgba(255,255,255,0.95)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      flex: 1,
      minWidth: '80px',
    }}>
      <div style={{ fontSize: '24px', marginBottom: '4px' }}>{icon}</div>
      <span style={{ fontSize: '13px', fontWeight: 800, color: COLORS.kids.text, fontFamily: TYPOGRAPHY.fonts.kids }}>{value}</span>
      <span style={{ fontSize: '10px', fontWeight: 600, color: labelColor || COLORS.kids.textSecondary, fontFamily: TYPOGRAPHY.fonts.kids, textAlign: 'center' }}>
        {label}
      </span>
    </div>
  );
}

// ─── Kategori Kartı (Grid Item) ───
function CategoryCard({ category, index, onClick }) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 + index * 0.05, type: 'spring', stiffness: 200 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '20px 10px 14px',
        borderRadius: RADIUS.kidsCard,
        background: `linear-gradient(135deg, ${category.color}EE 0%, ${category.color} 100%)`,
        boxShadow: `0 8px 24px ${category.color}40`,
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        aspectRatio: '0.9',
      }}
    >
      {/* İkon Gölgesi & Işık */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 40%)',
        pointerEvents: 'none'
      }} />

      {/* İkon */}
      <div style={{
        fontSize: '48px',
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
        marginBottom: 'auto',
        transform: 'translateY(10px)',
      }}>
        {category.icon}
      </div>

      {/* Başlık */}
      <span style={{
        fontSize: '13px',
        fontWeight: 800,
        color: '#FFFFFF',
        fontFamily: TYPOGRAPHY.fonts.kids,
        textAlign: 'center',
        lineHeight: 1.2,
        textShadow: '0 2px 4px rgba(0,0,0,0.2)',
        zIndex: 1,
        marginTop: '10px'
      }}>
        {category.title}
      </span>
    </motion.button>
  );
}

// ─── Günün Görevi ───
function DailyTask() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      style={{
        margin: '20px 20px 0',
        padding: '14px 20px',
        borderRadius: RADIUS.full,
        background: 'linear-gradient(90deg, #F0FDF4 0%, #DCFCE7 100%)',
        border: '2px solid #86EFAC',
        boxShadow: '0 8px 20px rgba(74,222,128,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div style={{
        width: '36px', height: '36px', borderRadius: '12px',
        background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}>
        <span style={{ fontSize: '20px' }}>📝</span>
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '11px', color: '#166534', fontWeight: 800, fontFamily: TYPOGRAPHY.fonts.kids, letterSpacing: '0.02em' }}>
          Günün Görevi
        </p>
        <p style={{ fontSize: '14px', fontWeight: 700, color: '#14532D', fontFamily: TYPOGRAPHY.fonts.kids }}>
          Besmele ile yemek ye!
        </p>
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '4px',
        background: '#FFFFFF', padding: '6px 12px', borderRadius: RADIUS.full,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}>
        <Star size={14} color="#F59E0B" fill="#F59E0B" />
        <span style={{ fontSize: '13px', fontWeight: 800, color: '#F59E0B', fontFamily: TYPOGRAPHY.fonts.kids }}>
          +10
        </span>
      </div>
    </motion.div>
  );
}

// ─── Arka Plan Manzarası (CSS Art) ───
function ScenicBackground() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Gökyüzü */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #87CEEB 0%, #E0F6FF 100%)' }} />
      
      {/* Bulutlar */}
      <div style={{ position: 'absolute', top: '10%', left: '-10%', width: '120px', height: '40px', background: '#FFFFFF', borderRadius: '40px', opacity: 0.8, filter: 'blur(1px)' }} />
      <div style={{ position: 'absolute', top: '5%', right: '10%', width: '150px', height: '50px', background: '#FFFFFF', borderRadius: '50px', opacity: 0.9, filter: 'blur(1px)' }} />
      <div style={{ position: 'absolute', top: '25%', left: '15%', width: '80px', height: '30px', background: '#FFFFFF', borderRadius: '30px', opacity: 0.7, filter: 'blur(1px)' }} />
      <div style={{ position: 'absolute', top: '18%', right: '-5%', width: '100px', height: '35px', background: '#FFFFFF', borderRadius: '35px', opacity: 0.8, filter: 'blur(1px)' }} />

      {/* Arka Dağlar / Tepeler */}
      <div style={{ position: 'absolute', bottom: '0', left: '-20%', right: '-20%', height: '50vh', background: '#81C784', borderRadius: '50% 50% 0 0', transform: 'scaleX(1.5)', opacity: 0.6 }} />
      
      {/* Ön Çimenlik */}
      <div style={{ position: 'absolute', bottom: '0', left: '-10%', right: '-10%', height: '35vh', background: 'linear-gradient(180deg, #66BB6A 0%, #43A047 100%)', borderRadius: '40% 40% 0 0', transform: 'scaleX(1.2)' }} />

      {/* Ağaçlar (Sol) */}
      <div style={{ position: 'absolute', bottom: '15%', left: '5%', fontSize: '40px', filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.15))' }}>🌳</div>
      <div style={{ position: 'absolute', bottom: '25%', left: '-5%', fontSize: '60px', filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.15))' }}>🌲</div>

      {/* Ağaçlar (Sağ) */}
      <div style={{ position: 'absolute', bottom: '20%', right: '2%', fontSize: '50px', filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.15))' }}>🌳</div>
      <div style={{ position: 'absolute', bottom: '30%', right: '-2%', fontSize: '45px', filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.15))' }}>🌲</div>
      
      {/* Yol patikası */}
      <div style={{ position: 'absolute', bottom: '0', left: '40%', width: '20%', height: '15vh', background: '#E6C280', borderRadius: '50% 50% 0 0', opacity: 0.5, transform: 'perspective(10px) rotateX(10deg)' }} />

      {/* Çiçekler */}
      <div style={{ position: 'absolute', bottom: '12%', left: '20%', fontSize: '14px' }}>🌼</div>
      <div style={{ position: 'absolute', bottom: '8%', left: '35%', fontSize: '12px' }}>🌸</div>
      <div style={{ position: 'absolute', bottom: '10%', right: '25%', fontSize: '14px' }}>🌼</div>
      <div style={{ position: 'absolute', bottom: '15%', right: '35%', fontSize: '12px' }}>🌷</div>
    </div>
  );
}

// ─── Ana Bileşen ───
export default function KidsDashboard() {
  const navigate = useNavigate();
  const { activeChildProfile, setAppMode } = useAppMode();

  const profile = activeChildProfile || { name: 'Yusuf', avatar: '👦', level: 4, xp: 450 };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      <ScenicBackground />

      <div style={{ position: 'relative', zIndex: 10, paddingBottom: '30px' }}>
        {/* Header - Üst Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px 0',
        }}>
          <button
            onClick={() => setAppMode(null)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px 8px 12px',
              borderRadius: RADIUS.full,
              background: 'rgba(255,255,255,0.95)',
              border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            }}
          >
            <ChevronLeft size={18} color={COLORS.kids.text} />
            <span style={{ fontSize: '14px', fontWeight: 800, color: COLORS.kids.text, fontFamily: TYPOGRAPHY.fonts.kids }}>
              Çocuk Modu
            </span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Yıldız */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.95)', padding: '6px 12px', borderRadius: RADIUS.full, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <Star size={16} color="#F59E0B" fill="#F59E0B" />
              <span style={{ fontSize: '14px', fontWeight: 800, color: COLORS.kids.text, fontFamily: TYPOGRAPHY.fonts.kids }}>1250</span>
            </div>
            {/* Elmas */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.95)', padding: '6px 12px', borderRadius: RADIUS.full, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <Diamond size={16} color="#3B82F6" fill="#60A5FA" />
              <span style={{ fontSize: '14px', fontWeight: 800, color: COLORS.kids.text, fontFamily: TYPOGRAPHY.fonts.kids }}>230</span>
            </div>
            {/* Avatar */}
            <div style={{ position: 'relative', width: '38px', height: '38px', borderRadius: '19px', background: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', border: '2px solid #FFFFFF', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              {profile.avatar}
              <div style={{ position: 'absolute', bottom: -2, right: -2, background: '#22C55E', borderRadius: '50%', padding: '2px', border: '2px solid #FFFFFF' }}>
                <CheckCircle2 size={10} color="#FFFFFF" />
              </div>
            </div>
          </div>
        </div>

        {/* Karşılama Alanı */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ padding: '24px 20px 16px', display: 'flex', alignItems: 'center', gap: '16px' }}
        >
          <div style={{
            width: '70px', height: '70px', borderRadius: '35px',
            background: 'radial-gradient(circle at 30% 30%, #FFEDD5, #FDBA74)',
            border: '4px solid #FFFFFF',
            boxShadow: '0 8px 24px rgba(249,115,22,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '40px',
            transform: 'scaleX(-1)', // Karakteri sağa baktırmak için
          }}>
            {profile.avatar}
          </div>
          <div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: 900,
              color: '#0F172A',
              fontFamily: TYPOGRAPHY.fonts.kids,
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              Merhaba {profile.name}! <motion.span animate={{ rotate: [0, 20, 0, 20, 0] }} transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}>👋</motion.span>
            </h1>
            <p style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#334155',
              fontFamily: TYPOGRAPHY.fonts.kids,
              marginTop: '4px',
            }}>
              Bugün ne öğrenmek istersin?
            </p>
          </div>
        </motion.div>

        {/* Stat Row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{
            display: 'flex',
            gap: '12px',
            padding: '0 20px',
            marginBottom: '24px',
          }}
        >
          <StatBadge icon="🔥" value="3" label="Günlük Seri" labelColor="#EA580C" />
          <StatBadge icon="🏅" value="450" label="Puanın" labelColor="#B45309" />
          <StatBadge icon="🛡️" value="Seviye 4" label="Mini Âlim" labelColor="#15803D" />
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '60px', borderRadius: RADIUS.kidsLg,
            background: 'rgba(255,255,255,0.95)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            fontSize: '28px'
          }}>
            🎁
          </div>
        </motion.div>

        {/* Kategori Grid — 8 kategori (Görsel referans) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          padding: '0 20px',
        }}>
          {KIDS_CATEGORIES.map((cat, i) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              index={i}
              onClick={() => navigate(cat.path)}
            />
          ))}
        </div>

        {/* Günün Görevi */}
        <DailyTask />
      </div>
    </div>
  );
}
