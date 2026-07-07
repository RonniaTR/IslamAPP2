import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronRight, Play, Gift, Trophy, Flame, Star, Diamond, Users, BookOpen, Clock, Award, Gamepad2, BarChart3, Zap, Target, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { TYPOGRAPHY, SHADOWS } from '../styles/designTokens';

// ─── Stat Badge ───
function StatBadge({ icon, value, label, color }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '14px 18px', borderRadius: '16px',
      background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)',
      flex: 1, minWidth: 0,
    }}>
      <div style={{
        width: '40px', height: '40px', borderRadius: '12px',
        background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: '18px', fontWeight: 800, color: '#1F2937', margin: 0 }}>{value}</p>
        <p style={{ fontSize: '11px', fontWeight: 600, color: '#9CA3AF', margin: 0, whiteSpace: 'nowrap' }}>{label}</p>
      </div>
    </div>
  );
}

// ─── Daily Task Icon ───
function TaskIcon({ icon, label, count, progress, active }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1 }}>
      <div style={{
        width: '48px', height: '48px', borderRadius: '50%',
        background: active ? '#E8F5E9' : '#F3F4F6',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '22px', position: 'relative',
      }}>
        {icon}
        {active && (
          <div style={{
            position: 'absolute', bottom: -2, right: -2,
            width: '18px', height: '18px', borderRadius: '50%',
            background: '#0D5C2F', border: '2px solid #FFF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
        )}
      </div>
      <p style={{ fontSize: '11px', fontWeight: 700, color: '#374151', margin: 0, textAlign: 'center' }}>{label}</p>
      <p style={{ fontSize: '10px', fontWeight: 600, color: active ? '#0D5C2F' : '#9CA3AF', margin: 0 }}>{count}</p>
      <div style={{ width: '100%', height: '3px', borderRadius: '2px', background: '#F3F4F6', overflow: 'hidden' }}>
        <div style={{ width: `${progress}%`, height: '100%', borderRadius: '2px', background: active ? '#0D5C2F' : '#D1D5DB' }} />
      </div>
    </div>
  );
}

// ─── Quiz Mode Card ───
function QuizCard({ title, subtitle, gradient, badge, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        minWidth: '160px', flex: '0 0 auto',
        padding: '20px 16px', borderRadius: '20px',
        background: gradient, border: 'none', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', gap: '8px',
        position: 'relative', overflow: 'hidden', textAlign: 'left',
      }}
    >
      {badge && (
        <div style={{
          position: 'absolute', top: '10px', right: '10px',
          padding: '3px 10px', borderRadius: '20px',
          background: '#22C55E', color: '#FFF',
          fontSize: '10px', fontWeight: 800,
        }}>
          {badge}
        </div>
      )}
      <div style={{
        width: '44px', height: '44px', borderRadius: '14px',
        background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '8px',
      }}>
        <Gamepad2 size={22} color="#FFF" />
      </div>
      <p style={{ fontSize: '15px', fontWeight: 800, color: '#FFF', margin: 0 }}>{title}</p>
      <p style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: 1.4 }}>{subtitle}</p>
      <div style={{
        marginTop: 'auto', paddingTop: '12px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '8px 16px', borderRadius: '12px',
        background: 'rgba(255,255,255,0.2)',
      }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFF' }}>Oyna</span>
      </div>
    </motion.button>
  );
}

// ─── Leaderboard Row ───
function LeaderRow({ rank, name, avatar, score, isTop3 }) {
  const rankColors = { 1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32' };
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '10px 0', borderBottom: '1px solid #F3F4F6',
    }}>
      <div style={{
        width: '24px', height: '24px', borderRadius: '50%',
        background: isTop3 ? rankColors[rank] : '#F3F4F6',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '12px', fontWeight: 800, color: isTop3 ? '#FFF' : '#6B7280',
      }}>
        {rank}
      </div>
      <div style={{
        width: '32px', height: '32px', borderRadius: '50%',
        background: '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '16px',
      }}>
        {avatar}
      </div>
      <p style={{ flex: 1, fontSize: '13px', fontWeight: 700, color: '#374151', margin: 0 }}>{name}</p>
      <p style={{ fontSize: '14px', fontWeight: 800, color: '#0D5C2F', margin: 0 }}>{score.toLocaleString()}</p>
    </div>
  );
}

// ─── Discover Category ───
function DiscoverCategory({ icon, label, count, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
        background: 'none', border: 'none', cursor: 'pointer',
        minWidth: '80px', flex: '0 0 auto',
      }}
    >
      <div style={{
        width: '64px', height: '64px', borderRadius: '20px',
        background: '#F9FAFB', border: '1px solid #F3F4F6',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '28px',
      }}>
        {icon}
      </div>
      <p style={{ fontSize: '12px', fontWeight: 700, color: '#374151', margin: 0, textAlign: 'center' }}>{label}</p>
      <p style={{ fontSize: '10px', fontWeight: 600, color: '#9CA3AF', margin: 0 }}>{count}</p>
    </motion.button>
  );
}

// ═══════════════════════════════════════════
// ─── ANA DASHBOARD ───
// ═══════════════════════════════════════════
export default function Dashboard() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('home');

  const navItems = [
    { id: 'home', label: 'Ana Sayfa' },
    { id: 'categories', label: 'Kategoriler' },
    { id: 'ai', label: 'AI Muftu' },
    { id: 'library', label: 'Kutuphane' },
    { id: 'friends', label: 'Arkadaslar' },
  ];

  const handleNavClick = (id) => {
    setActiveNav(id);
    if (id === 'categories') navigate('/discover');
    else if (id === 'ai') navigate('/ai-chat');
    else if (id === 'library') navigate('/quran');
    else if (id === 'friends') navigate('/leaderboard');
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '100px', background: '#F5F5F0' }} data-testid="dashboard">
      {/* TOP NAVIGATION BAR */}
      <div className="dashboard-topnav" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 24px', position: 'sticky', top: 0, zIndex: 50,
        backdropFilter: 'blur(16px)', background: 'rgba(255,255,255,0.97)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="28" height="28" viewBox="0 0 40 40">
            <path d="M20 2 C10 2 2 10 2 20 C2 30 10 38 20 38 C15 34 12 28 12 20 C12 12 15 6 20 2Z" fill="#0D5C2F" />
            <circle cx="20" cy="20" r="18" fill="none" stroke="#0D5C2F" strokeWidth="1.5" opacity="0.3" />
          </svg>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#1F2937', letterSpacing: '-0.02em' }}>IslamAPP</span>
        </div>

        <div className="dashboard-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => handleNavClick(item.id)} style={{
              padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer',
              fontSize: '13px', fontWeight: 700,
              background: activeNav === item.id ? '#0D5C2F' : 'transparent',
              color: activeNav === item.id ? '#FFF' : '#4B5563',
              transition: 'all 0.2s',
            }}>
              {item.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button style={{
            width: '40px', height: '40px', borderRadius: '50%', background: '#F9FAFB',
            border: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', position: 'relative',
          }}>
            <Bell size={18} color="#4B5563" />
            <span style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444', border: '2px solid #FFF' }} />
          </button>
          <div onClick={() => navigate('/profile')} style={{
            width: '36px', height: '36px', borderRadius: '50%', background: '#C8A55A',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            border: '2px solid #E0C47A',
          }}>
            <span style={{ fontSize: '16px' }}>{'👨🏻'}</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 16px' }}>

        {/* ROW 1: Greeting + Stats */}
        <div className="dash-row-1" style={{ display: 'grid', gap: '16px', marginBottom: '16px' }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="dash-greeting" style={{
            borderRadius: '24px', padding: '28px', position: 'relative', overflow: 'hidden',
            background: 'linear-gradient(135deg, #0D5C2F 0%, #1A7A42 60%, #0D5C2F 100%)',
            boxShadow: '0 12px 32px rgba(13,92,47,0.25)',
          }}>
            <div style={{ position: 'absolute', top: -30, right: -30, width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
            <div style={{ position: 'absolute', bottom: -40, left: -20, width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 1 }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', border: '3px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '28px' }}>{'👨🏻'}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', margin: '0 0 2px', fontWeight: 500 }}>Hos geldin,</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <p style={{ fontSize: '20px', fontWeight: 800, color: '#FFF', margin: 0 }}>{user?.name || 'Misafir'}</p>
                  <span style={{ padding: '3px 12px', borderRadius: '20px', background: '#C8A55A', color: '#FFF', fontSize: '11px', fontWeight: 700 }}>Seviye 12</span>
                </div>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', margin: '6px 0 0', fontStyle: 'italic', lineHeight: 1.4 }}>
                  "Ilim, amelle guzellesir; ameli degerli kilan da ihlastir." - Imam Safii
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="dash-stats" style={{ display: 'flex', gap: '12px' }}>
            <StatBadge icon={<Flame size={20} color="#F97316" />} value="7" label="Gunluk Seri" color="#F97316" />
            <StatBadge icon={<Star size={20} color="#EAB308" />} value="1.250" label="Puanim" color="#EAB308" />
            <StatBadge icon={<Diamond size={20} color="#6366F1" />} value="230" label="Jeton" color="#6366F1" />
          </motion.div>
        </div>

        {/* ROW 2: Daily Goal + Ilim Yolcusu */}
        <div className="dash-row-2" style={{ display: 'grid', gap: '16px', marginBottom: '16px' }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="dash-goal" style={{
            background: '#FFF', borderRadius: '24px', padding: '24px',
            border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1F2937', margin: '0 0 4px' }}>Gunluk Hedef</h3>
                <p style={{ fontSize: '12px', fontWeight: 500, color: '#9CA3AF', margin: 0 }}>Hedefini tamamla, odulleri kazan!</p>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '14px', background: '#FFF7ED', border: '1px solid #FFEDD5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Gift size={20} color="#F97316" />
              </div>
            </div>
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280', margin: '0 0 8px' }}>3 / 5 gorev tamamlandi</p>
            <div style={{ height: '6px', borderRadius: '3px', background: '#F3F4F6', overflow: 'hidden', marginBottom: '20px' }}>
              <div style={{ width: '60%', height: '100%', borderRadius: '3px', background: 'linear-gradient(90deg, #0D5C2F, #22C55E)' }} />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <TaskIcon icon="🕌" label="Namazini kil" count="5/5" progress={100} active={true} />
              <TaskIcon icon="📖" label="Kuran oku" count="10/20" progress={50} active={true} />
              <TaskIcon icon="📿" label="Zikir yap" count="3/10" progress={30} active={true} />
              <TaskIcon icon="💡" label="Bilgi ogren" count="1/1" progress={100} active={true} />
              <TaskIcon icon="🔗" label="Paylasim yap" count="0/1" progress={0} active={false} />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="dash-ilim" style={{
            background: '#FFF', borderRadius: '24px', padding: '24px',
            border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>🏆</div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1F2937', margin: '0 0 12px' }}>Ilim Yolcusu</h3>
            <div style={{ width: '100%', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#0D5C2F' }}>2.350 / 3.000 XP</span>
              </div>
              <div style={{ height: '8px', borderRadius: '4px', background: '#F3F4F6', overflow: 'hidden' }}>
                <div style={{ width: '78%', height: '100%', borderRadius: '4px', background: 'linear-gradient(90deg, #0D5C2F, #22C55E)' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '20px', width: '100%', justifyContent: 'center' }}>
              {[{ val: '125', label: 'Oyun' }, { val: '82%', label: 'Basari' }, { val: '45', label: 'Rozet' }].map((s, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '20px', fontWeight: 800, color: '#1F2937', margin: '0 0 2px' }}>{s.val}</p>
                  <p style={{ fontSize: '11px', fontWeight: 600, color: '#9CA3AF', margin: 0 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ROW 3: Bil Bakalim + Haftanin Liderleri */}
        <div className="dash-row-3" style={{ display: 'grid', gap: '16px', marginBottom: '16px' }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="dash-quiz" style={{
            background: '#FFF', borderRadius: '24px', padding: '24px',
            border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1F2937', margin: '0 0 4px' }}>Bil Bakalim</h3>
                <p style={{ fontSize: '12px', fontWeight: 500, color: '#9CA3AF', margin: 0 }}>Bilgini test et, oduller kazan!</p>
              </div>
              <button onClick={() => navigate('/quiz')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 700, color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Tum Modlar <ChevronRight size={14} />
              </button>
            </div>
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px', WebkitOverflowScrolling: 'touch' }}>
              <QuizCard title="Tek Basina" subtitle="Kendini gelistir, bilgini test et." gradient="linear-gradient(135deg, #0D5C2F, #1A7A42)" onClick={() => navigate('/quiz')} />
              <QuizCard title="Online Yarisma" subtitle="Gercek zamanli oyuncularla yaris." gradient="linear-gradient(135deg, #F59E0B, #D97706)" badge="Canli 128" onClick={() => navigate('/multiplayer-quiz')} />
              <QuizCard title="Arkadasinla" subtitle="Arkadasini davet et, bilginizi olcun." gradient="linear-gradient(135deg, #3B82F6, #2563EB)" onClick={() => navigate('/quiz')} />
              <QuizCard title="Gunluk Sinav" subtitle="Her gun yeni sorular seni bekliyor." gradient="linear-gradient(135deg, #8B5CF6, #7C3AED)" onClick={() => navigate('/quiz')} />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="dash-leaders" style={{
            background: '#FFF', borderRadius: '24px', padding: '24px',
            border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1F2937', margin: 0 }}>Haftanin Liderleri</h3>
              <button onClick={() => navigate('/leaderboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 700, color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Tumunu Gor <ChevronRight size={14} />
              </button>
            </div>
            <LeaderRow rank={1} name="Yusuf K." avatar="👦" score={4850} isTop3 />
            <LeaderRow rank={2} name="Zeynep A." avatar="👩" score={4210} isTop3 />
            <LeaderRow rank={3} name="Ahmet E." avatar="👨" score={3980} isTop3 />
            <LeaderRow rank={4} name="Merve D." avatar="👩" score={3450} />
            <LeaderRow rank={5} name="Hasan K." avatar="👨" score={3210} />
            <button onClick={() => navigate('/leaderboard')} style={{
              width: '100%', marginTop: '12px', padding: '10px', borderRadius: '14px',
              border: '1px solid #F3F4F6', background: '#FAFAFA', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              fontSize: '13px', fontWeight: 700, color: '#6B7280',
            }}>
              <BarChart3 size={16} /> Liderlik Tablosu
            </button>
          </motion.div>
        </div>

        {/* ROW 4: Tournament Banner */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{
          borderRadius: '24px', padding: '24px', marginBottom: '16px',
          background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '16px', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: '10%', left: '5%', fontSize: '12px', opacity: 0.3 }}>{'✨'}</div>
          <div style={{ position: 'absolute', bottom: '15%', right: '30%', fontSize: '10px', opacity: 0.2 }}>{'⭐'}</div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFF', margin: '0 0 4px' }}>Buyuk Bil Bakalim Turnuvasi</h3>
            <p style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.6)', margin: '0 0 16px' }}>Bilgini goster, buyuk odulu kazan!</p>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              {[
                { icon: '🏆', label: 'Odul Havuzu', value: '50.000 TL' },
                { icon: '🎟️', label: 'Katilim Ucreti', value: '150 TL' },
                { icon: '⏰', label: 'Son Kayit', value: '02g 14sa 33dk' },
              ].map((item, i) => (
                <div key={i}>
                  <p style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', margin: '0 0 2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>{item.icon}</span> {item.label}
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: 800, color: '#FFF', margin: 0 }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
          <button style={{
            padding: '14px 28px', borderRadius: '16px', background: '#22C55E', border: 'none', cursor: 'pointer',
            fontSize: '14px', fontWeight: 800, color: '#FFF', boxShadow: '0 6px 20px rgba(34,197,94,0.4)', whiteSpace: 'nowrap',
          }}>
            Turnuvaya Katil
          </button>
        </motion.div>

        {/* ROW 5: Kesfet */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1F2937', margin: 0 }}>Kesfet</h3>
            <button onClick={() => navigate('/discover')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 700, color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Tum Kategoriler <ChevronRight size={14} />
            </button>
          </div>
          <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px', WebkitOverflowScrolling: 'touch' }}>
            <DiscoverCategory icon="📖" label="Kur'an-i Kerim" count="1.250 soru" onClick={() => navigate('/quran')} />
            <DiscoverCategory icon="📜" label="Hadis" count="980 soru" onClick={() => navigate('/knowledge')} />
            <DiscoverCategory icon="🕌" label="Siyer" count="820 soru" onClick={() => navigate('/knowledge')} />
            <DiscoverCategory icon="📚" label="Ilmihal" count="1.100 soru" onClick={() => navigate('/discover')} />
            <DiscoverCategory icon="🌙" label="Akaid" count="640 soru" onClick={() => navigate('/discover')} />
            <DiscoverCategory icon="🏛️" label="Kultur" count="590 soru" onClick={() => navigate('/discover')} />
          </div>
        </motion.div>

        {/* ROW 6: Gunluk Dua + Rozetler + Seri */}
        <div className="dash-row-6" style={{ display: 'grid', gap: '16px', marginBottom: '16px' }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="dash-dua" style={{
            background: '#FFF', borderRadius: '24px', padding: '24px',
            border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#1F2937', margin: '0 0 16px' }}>Gunluk Dua</h3>
            <p style={{ fontSize: '28px', fontWeight: 700, color: '#1F2937', textAlign: 'right', fontFamily: 'serif', lineHeight: 1.6, margin: '0 0 8px', direction: 'rtl' }}>
              {'رَبِّ زِدْنِي عِلْمًا'}
            </p>
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280', margin: '0 0 4px', fontStyle: 'italic' }}>"Rabbim! Ilmimi artir."</p>
            <p style={{ fontSize: '10px', fontWeight: 600, color: '#9CA3AF', margin: 0 }}>Taha Suresi - 114</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="dash-badges" style={{
            background: '#FFF', borderRadius: '24px', padding: '24px',
            border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#1F2937', margin: 0 }}>Son Rozetlerim</h3>
              <button onClick={() => navigate('/gamification')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 700, color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '2px' }}>
                Tumunu Gor <ChevronRight size={12} />
              </button>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              {['🏅', '⭐', '🎖️', '🏆', '💎'].map((badge, i) => (
                <div key={i} style={{
                  width: '48px', height: '48px', borderRadius: '14px',
                  background: '#FEF3C7', border: '1px solid #FDE68A',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px',
                }}>
                  {badge}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="dash-streak" style={{
            background: '#FFF', borderRadius: '24px', padding: '24px',
            border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#EF4444', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Flame size={16} color="#EF4444" /> Serin Devam Ediyor!
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '36px', fontWeight: 900, color: '#1F2937' }}>7</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#9CA3AF' }}>Gunluk Seri</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
              {['Pzt', 'Sal', 'Car', 'Per', 'Cum', 'Cmt', 'Paz'].map((day, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: i < 7 ? '#0D5C2F' : '#F3F4F6',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={i < 7 ? 'white' : '#D1D5DB'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span style={{ fontSize: '9px', fontWeight: 600, color: '#9CA3AF' }}>{day}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

      </div>

      {/* RESPONSIVE CSS */}
      <style>{`
        .dashboard-nav-links { display: none !important; }
        .dash-row-1 { grid-template-columns: 1fr; }
        .dash-row-2 { grid-template-columns: 1fr; }
        .dash-row-3 { grid-template-columns: 1fr; }
        .dash-row-6 { grid-template-columns: 1fr; }
        .dash-stats { flex-wrap: wrap; }

        @media (min-width: 768px) {
          .dash-row-1 { grid-template-columns: 1.5fr 1fr; align-items: stretch; }
          .dash-row-2 { grid-template-columns: 1.5fr 1fr; align-items: stretch; }
          .dash-row-3 { grid-template-columns: 1fr 1fr; align-items: start; }
          .dash-row-6 { grid-template-columns: 1fr 1fr 1fr; }
          .dash-stats { flex-wrap: nowrap; }
        }

        @media (min-width: 1024px) {
          .dashboard-nav-links { display: flex !important; }
          .dash-row-1 { grid-template-columns: 1.8fr 1fr; }
          .dash-row-2 { grid-template-columns: 1.8fr 1fr; }
        }
      `}</style>
    </div>
  );
}
