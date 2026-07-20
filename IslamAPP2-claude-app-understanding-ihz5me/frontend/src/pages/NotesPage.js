import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Trash2, Copy, Share2, Sparkles, BookOpen, Loader2, Check, ScrollText } from 'lucide-react';
import { useLang } from '../contexts/LangContext';
import { useTheme } from '../contexts/ThemeContext';
import api from '../api';

export default function NotesPage() {
  const navigate = useNavigate();
  const { t } = useLang();
  const { theme } = useTheme();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [copied, setCopied] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/notes');
      setNotes(Array.isArray(data) ? data : []);
    } catch { setNotes([]); }
    setLoading(false);
  };

  const deleteNote = async (noteId) => {
    setDeleting(noteId);
    try {
      await api.delete(`/notes/${encodeURIComponent(noteId)}`);
      setNotes(prev => prev.filter(n => n.created_at !== noteId));
    } catch {}
    setDeleting(null);
  };

  const copyNote = (note) => {
    const appName = t.login_title || 'İslami Yaşam Asistanı';
    const text = `${note.title}\n\n${note.content}${note.scholar_name ? `\n\n— ${note.scholar_name}` : ''}\n\n— ${appName}`;
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(note.created_at);
    setTimeout(() => setCopied(null), 2000);
  };

  const shareNote = (note) => {
    const appName = t.login_title || 'İslami Yaşam Asistanı';
    const text = `${note.title}\n\n${note.content}${note.scholar_name ? `\n\n— ${note.scholar_name}` : ''}\n\n— ${appName}`;
    if (navigator.share) navigator.share({ title: note.title, text }).catch(() => {});
    else copyNote(note);
  };

  const filtered = filter === 'all' ? notes : notes.filter(n => n.type === filter);

  return (
    <div className="animate-fade-in" data-testid="notes-page" style={{ background: theme.bg }}>
      <div className="px-5 pt-6 pb-4" style={{ background: `linear-gradient(180deg, ${theme.surface} 0%, transparent 100%)` }}>
        <div className="flex items-center gap-2 mb-1">
          <Heart size={20} style={{ color: theme.gold }} />
          <h1 className="text-xl font-bold" style={{ color: theme.textPrimary, fontFamily: 'Playfair Display, serif' }}>{t.my_notes_title || 'Notlarım'}</h1>
        </div>
        <p className="text-xs" style={{ color: theme.textSecondary }}>{t.notes_desc || 'Kaydettiğiniz ayetler, kıssalar ve hadisler'}</p>

        <div className="flex gap-2 mt-3">
          {[
            { id: 'all', label: t.all || 'Tümü' },
            { id: 'ayah', label: t.filter_verses || 'Ayetler' },
            { id: 'kissa', label: t.filter_stories || 'Kıssalar' },
            { id: 'hadith', label: t.filter_hadiths || 'Hadisler' },
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} data-testid={`filter-${f.id}`}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors`}
              style={
                filter === f.id
                  ? { background: `${theme.gold}20`, color: theme.gold, border: `1px solid ${theme.gold}30` }
                  : { background: theme.inputBg, color: theme.textSecondary, border: `1px solid ${theme.inputBorder}` }
              }>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pb-6">
        {loading ? (
          <div className="text-center py-12">
            <Loader2 size={24} className="animate-spin mx-auto" style={{ color: theme.gold }} />
            <p className="text-xs mt-2" style={{ color: theme.textSecondary }}>{t.loading || 'Yükleniyor...'}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <Heart size={40} className="mx-auto mb-3" style={{ color: `${theme.textSecondary}50` }} />
            <p className="text-sm" style={{ color: theme.textSecondary }}>{t.no_notes || 'Henüz kayıtlı notunuz yok'}</p>
            <p className="text-xs mt-1" style={{ color: `${theme.textSecondary}90` }}>{t.no_notes_desc || "Kur'an ve hadis bölümlerinden beğendiğin içerikleri kaydet"}</p>
            <button onClick={() => navigate('/quran')} data-testid="go-to-quran"
              className="mt-4 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              style={{ background: `${theme.gold}15`, color: theme.gold }}>
              <BookOpen size={14} className="inline mr-1" /> {t.go_to_quran || "Kur'an'a Git"}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((note, i) => (
              <div key={note.created_at || i} data-testid={`note-item-${i}`}
                className="card-islamic rounded-xl p-4 animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {note.type === 'kissa' ? (
                      <Sparkles size={14} className="text-[#D4AF37] shrink-0" />
                    ) : note.type === 'hadith' ? (
                      <ScrollText size={14} className="text-sky-300 shrink-0" />
                    ) : (
                      <BookOpen size={14} className="text-emerald-400 shrink-0" />
                    )}
                    <div>
                      <p className="text-sm font-semibold text-[#F5F5DC]">{note.title}</p>
                      {note.scholar_name && (
                        <p className="text-[10px] text-[#D4AF37]/80 mt-0.5">{note.scholar_name}</p>
                      )}
                    </div>
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                    note.type === 'kissa'
                      ? 'bg-[#D4AF37]/15 text-[#D4AF37]'
                      : note.type === 'hadith'
                        ? 'bg-sky-400/15 text-sky-300'
                        : 'bg-emerald-500/15 text-emerald-400'
                  }`}>
                    {note.type === 'kissa' ? (t.note_type_story || 'Kıssa') : note.type === 'hadith' ? (t.note_type_hadith || 'Hadis') : (t.note_type_verse || 'Ayet')}
                  </span>
                </div>

                <p className="text-xs text-[#F5F5DC]/75 leading-relaxed line-clamp-4 whitespace-pre-wrap">{note.content}</p>

                {note.surah_number && (
                  <button onClick={() => navigate(`/quran/${note.surah_number}`)} data-testid={`note-go-surah-${i}`}
                    className="mt-2 text-[10px] text-emerald-400 hover:text-emerald-300 transition-colors">
                    Sure {note.surah_number}, Ayet {note.verse_number} →
                  </button>
                )}

                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-[#D4AF37]/10">
                  <button onClick={() => copyNote(note)} data-testid={`copy-note-${i}`}
                    className="flex items-center gap-1 text-[10px] text-[#D4AF37] px-2 py-1 rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 transition-colors">
                    {copied === note.created_at ? <Check size={10} /> : <Copy size={10} />}
                    {copied === note.created_at ? (t.copied || 'Kopyalandı') : (t.copy || 'Kopyala')}
                  </button>
                  <button onClick={() => shareNote(note)} data-testid={`share-note-${i}`}
                    className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg transition-colors"
                    style={{ background: `${theme.gold}10`, color: theme.gold }}>
                    <Share2 size={10} /> {t.share || 'Paylaş'}
                  </button>
                  <button onClick={() => deleteNote(note.created_at)} data-testid={`delete-note-${i}`}
                    className="flex items-center gap-1 text-[10px] text-red-400 px-2 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors ml-auto"
                    disabled={deleting === note.created_at}>
                    {deleting === note.created_at ? <Loader2 size={10} className="animate-spin" /> : <Trash2 size={10} />}
                    {t.delete || 'Sil'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
