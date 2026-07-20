import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, BookOpen, Trash2, Clock, Search, ChevronRight, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import api from '../api';

const SURAH_NAMES = {
  1:'Fatiha',2:'Bakara',3:'Al-i İmran',4:'Nisa',5:'Maide',6:"En'am",7:"A'raf",8:'Enfal',9:'Tevbe',10:'Yunus',
  11:'Hud',12:'Yusuf',13:"Ra'd",14:'İbrahim',15:'Hicr',16:'Nahl',17:'İsra',18:'Kehf',19:'Meryem',20:'Taha',
  21:'Enbiya',22:'Hac',23:"Mü'minun",24:'Nur',25:'Furkan',26:"Şu'ara",27:'Neml',28:'Kasas',29:"Ankebut",30:'Rum',
  31:'Lokman',32:'Secde',33:'Ahzab',34:"Sebe'",35:'Fatır',36:'Yasin',37:'Saffat',38:'Sad',39:'Zümer',40:"Mü'min",
  41:'Fussilet',42:'Şura',43:'Zuhruf',44:'Duhan',45:'Casiye',46:'Ahkaf',47:'Muhammed',48:'Fetih',49:'Hucurat',50:'Kaf',
  51:'Zariyat',52:'Tur',53:'Necm',54:'Kamer',55:'Rahman',56:"Vak'a",57:'Hadid',58:'Mücadele',59:'Haşr',60:'Mümtehine',
  61:'Saf',62:"Cum'a",63:'Münafikun',64:'Tegabün',65:'Talak',66:'Tahrim',67:'Mülk',68:'Kalem',69:'Hakka',70:"Me'aric",
  71:'Nuh',72:'Cin',73:'Müzzemmil',74:'Müddessir',75:'Kıyamet',76:'İnsan',77:'Mürselat',78:"Nebe'",79:"Nazi'at",80:'Abese',
  81:'Tekvir',82:'İnfitar',83:'Mutaffifin',84:'İnşikak',85:'Büruc',86:'Tarık',87:"A'la",88:'Gaşiye',89:'Fecr',90:'Beled',
  91:'Şems',92:'Leyl',93:'Duha',94:'İnşirah',95:'Tin',96:'Alak',97:'Kadir',98:'Beyyine',99:'Zilzal',100:'Adiyat',
  101:"Kari'a",102:'Tekasür',103:'Asr',104:'Hümeze',105:'Fil',106:'Kureyş',107:"Ma'un",108:'Kevser',109:'Kafirun',110:'Nasr',
  111:'Tebbet',112:'İhlas',113:'Felak',114:'Nas'
};

const JUZ_MAP = {1:1,2:1,3:3,4:4,5:6,6:7,7:8,8:9,9:10,10:11,11:12,12:12,13:13,14:13,15:14,16:14,17:15,18:15,
  19:16,20:16,21:17,22:17,23:18,24:18,25:18,26:19,27:19,28:20,29:20,30:21,31:21,32:21,33:21,34:22,35:22,
  36:22,37:23,38:23,39:23,40:24,41:24,42:25,43:25,44:25,45:25,46:26,47:26,48:26,49:26,50:26,51:26,52:27,
  53:27,54:27,55:27,56:27,57:27,58:28,59:28,60:28,61:28,62:28,63:28,64:28,65:28,66:28,67:29,68:29,69:29,
  70:29,71:29,72:29,73:29,74:29,75:29,76:29,77:29,78:30,79:30,80:30,81:30,82:30,83:30,84:30,85:30,86:30,
  87:30,88:30,89:30,90:30,91:30,92:30,93:30,94:30,95:30,96:30,97:30,98:30,99:30,100:30,101:30,102:30,
  103:30,104:30,105:30,106:30,107:30,108:30,109:30,110:30,111:30,112:30,113:30,114:30};

export default function BookmarksPage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [lastRead, setLastRead] = useState(null);
  const [view, setView] = useState('bookmarks'); // bookmarks | juz

  useEffect(() => {
    if (!user?.uid) return;
    api.get(`/quran/bookmarks/${user.uid}`)
      .then(r => { setBookmarks(Array.isArray(r.data) ? r.data : []); })
      .catch(() => {})
      .finally(() => setLoading(false));
    const lr = localStorage.getItem('lastRead');
    if (lr) try { setLastRead(JSON.parse(lr)); } catch {}
  }, [user]);

  const removeBookmark = useCallback(async (id) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
    try { await api.delete(`/quran/bookmark/${id}`); } catch {}
  }, []);

  const goToVerse = (surah, verse) => {
    localStorage.setItem('lastRead', JSON.stringify({ surah, verse, date: new Date().toISOString() }));
    navigate(`/quran/${surah}?verse=${verse}`);
  };

  const filtered = bookmarks.filter(b => {
    if (!search) return true;
    const name = SURAH_NAMES[b.surah] || '';
    return name.toLowerCase().includes(search.toLowerCase()) || String(b.surah).includes(search) || String(b.verse).includes(search);
  });

  // Group bookmarks by surah
  const grouped = filtered.reduce((acc, b) => {
    const key = b.surah;
    if (!acc[key]) acc[key] = [];
    acc[key].push(b);
    return acc;
  }, {});

  // Juz groups (1-30)
  const juzList = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="animate-fade-in pb-4">
      {/* Header */}
      <div className="px-5 pt-10 pb-4" style={{ background: `linear-gradient(180deg, ${theme.surface}88 0%, transparent 100%)` }}>
        <div className="flex items-center gap-2 mb-4">
          <Bookmark size={20} style={{ color: theme.gold }} />
          <h1 className="text-xl font-bold" style={{ color: theme.textPrimary, fontFamily: 'Playfair Display, serif' }}>
            Yer İmleri & Okuma
          </h1>
        </div>

        {/* Last Read Banner */}
        {lastRead && (
          <button onClick={() => goToVerse(lastRead.surah, lastRead.verse)}
            className="w-full mb-4 p-3 rounded-xl flex items-center gap-3 transition-transform active:scale-[0.98]"
            style={{ background: `linear-gradient(135deg, ${theme.gold}20, ${theme.gold}08)`, border: `1px solid ${theme.gold}30` }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${theme.gold}20` }}>
              <Clock size={18} style={{ color: theme.gold }} />
            </div>
            <div className="flex-1 text-left">
              <p className="text-xs font-medium" style={{ color: theme.gold }}>Kaldığın Yerden Devam Et</p>
              <p className="text-sm font-semibold" style={{ color: theme.textPrimary }}>
                {SURAH_NAMES[lastRead.surah] || `Sure ${lastRead.surah}`} — Ayet {lastRead.verse}
              </p>
            </div>
            <ChevronRight size={16} style={{ color: theme.gold }} />
          </button>
        )}

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-3">
          {[{id:'bookmarks',label:'Yer İmleri',icon:Bookmark},{id:'juz',label:'Cüz Okuma',icon:BookOpen}].map(tab => (
            <button key={tab.id} onClick={() => setView(tab.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all"
              style={{ background: view === tab.id ? `${theme.gold}20` : theme.inputBg,
                       color: view === tab.id ? theme.gold : theme.textSecondary,
                       border: `1px solid ${view === tab.id ? theme.gold + '40' : theme.inputBorder}` }}>
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search (bookmarks view only) */}
        {view === 'bookmarks' && (
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.textSecondary }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Sure veya ayet ara..."
              className="w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none"
              style={{ background: theme.inputBg, border: `1px solid ${theme.inputBorder}`, color: theme.textPrimary }} />
          </div>
        )}
      </div>

      <div className="px-5">
        {view === 'bookmarks' ? (
          loading ? (
            <div className="flex justify-center py-12">
              <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: theme.gold, borderTopColor: 'transparent' }} />
            </div>
          ) : Object.keys(grouped).length === 0 ? (
            <div className="text-center py-12">
              <Bookmark size={40} className="mx-auto mb-3 opacity-30" style={{ color: theme.textSecondary }} />
              <p className="text-sm" style={{ color: theme.textSecondary }}>
                {search ? 'Sonuç bulunamadı' : 'Henüz yer imi eklenmemiş'}
              </p>
              <p className="text-xs mt-1" style={{ color: theme.textSecondary }}>
                Sure okurken ayetleri yer imlerine ekleyebilirsiniz
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(grouped).sort(([a],[b]) => Number(a) - Number(b)).map(([surah, items]) => (
                <div key={surah} className="rounded-xl overflow-hidden" style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
                  <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: `1px solid ${theme.cardBorder}` }}>
                    <div className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold" style={{ background: `${theme.gold}20`, color: theme.gold }}>
                      {surah}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold" style={{ color: theme.textPrimary }}>{SURAH_NAMES[Number(surah)] || `Sure ${surah}`}</p>
                      <p className="text-[10px]" style={{ color: theme.textSecondary }}>Cüz {JUZ_MAP[Number(surah)] || '—'}</p>
                    </div>
                    <Star size={14} style={{ color: theme.gold }} />
                  </div>
                  <div className="divide-y" style={{ borderColor: theme.cardBorder }}>
                    {items.sort((a,b) => a.verse - b.verse).map(b => (
                      <div key={b.id} className="flex items-center px-4 py-2.5 gap-3">
                        <button onClick={() => goToVerse(b.surah, b.verse)} className="flex-1 text-left">
                          <span className="text-sm font-medium" style={{ color: theme.textPrimary }}>Ayet {b.verse}</span>
                        </button>
                        <button onClick={() => goToVerse(b.surah, b.verse)}
                          className="px-2.5 py-1 rounded-md text-xs font-medium"
                          style={{ background: `${theme.gold}15`, color: theme.gold }}>
                          Oku
                        </button>
                        <button onClick={() => removeBookmark(b.id)}
                          className="p-1.5 rounded-md transition-colors hover:bg-red-500/10">
                          <Trash2 size={14} className="text-red-400/60" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* Juz View */
          <div className="grid grid-cols-3 gap-2">
            {juzList.map(juz => {
              const surahsInJuz = Object.entries(JUZ_MAP).filter(([, j]) => j === juz).map(([s]) => Number(s));
              const first = surahsInJuz[0];
              const last = surahsInJuz[surahsInJuz.length - 1];
              return (
                <button key={juz} onClick={() => first && navigate(`/quran/${first}`)}
                  className="p-3 rounded-xl text-center transition-transform active:scale-95"
                  style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
                  <p className="text-lg font-bold" style={{ color: theme.gold }}>{juz}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: theme.textSecondary }}>Cüz</p>
                  {first && last && (
                    <p className="text-[9px] mt-1 truncate" style={{ color: theme.textSecondary }}>
                      {SURAH_NAMES[first]}–{SURAH_NAMES[last]}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}