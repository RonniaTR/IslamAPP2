import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Bookmark, Share2, Play, Pause, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { TYPOGRAPHY } from '../styles/designTokens';
import { ContentServiceClass } from '../services/ContentService';
import { FirestoreService } from '../services/FirestoreService';
import { useBookmarks } from '../hooks/useBookmarks';
import { useHistory } from '../hooks/useHistory';

export default function ContentDetail() {
  const { type, slug } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioRef, setAudioRef] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [audioPosition, setAudioPosition] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  
  const { isBookmarked, toggleBookmark } = useBookmarks(content?.id);
  useHistory(content, scrollPosition, audioPosition, audioDuration);

  // Track scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Map type to collection name
        const collectionMap = {
          'category': 'categories',
          'theme': 'themes',
          'series': 'series',
          'article': 'articles',
          'lesson': 'lessons',
          'audio': 'audio',
          'story': 'stories'
        };
        const collectionName = collectionMap[type] || 'articles';
        const service = new FirestoreService(collectionName);
        
        const contentData = await service.getBySlug(slug);
        
        if (contentData) {
          setContent(contentData);
          
          // Log activity (view) to Firestore
          try {
            const activityService = new FirestoreService('activities');
            await activityService.create({
              contentId: contentData.id,
              type: type,
              action: 'view',
              userId: 'anonymous' // To be updated when Auth is hooked
            });
          } catch (e) {
            console.error('Failed to log activity', e);
          }
        }
      } catch (err) {
        console.error('Error fetching content detail', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [type, slug]);

  const toggleAudio = () => {
    if (!audioRef) return;
    if (isPlaying) {
      audioRef.pause();
    } else {
      audioRef.play();
    }
    setIsPlaying(!isPlaying);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center" style={{ background: theme.background }}>
        <Loader className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center" style={{ background: theme.background }}>
        <h2 className="text-xl font-bold mb-4" style={{ color: theme.textPrimary }}>İçerik bulunamadı</h2>
        <button onClick={() => navigate(-1)} className="px-6 py-2 bg-green-600 text-white rounded-xl">Geri Dön</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: theme.background }} data-testid="content-detail">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 pt-6 pb-4 sticky top-0 z-10" style={{ background: theme.primary }}>
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 transition-opacity hover:opacity-70">
          <ChevronLeft size={24} color="#FFF" />
          <span className="font-extrabold text-lg tracking-tight text-white" style={{ fontFamily: TYPOGRAPHY.fonts.heading }}>
            Geri
          </span>
        </button>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => toggleBookmark(content)}
            className="p-2 transition-opacity hover:opacity-70"
          >
            <Bookmark size={20} color={isBookmarked ? "#2ECC71" : "#FFF"} fill={isBookmarked ? "#2ECC71" : "none"} />
          </button>
          <button className="p-2 transition-opacity hover:opacity-70"><Share2 size={20} color="#FFF" /></button>
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-24">
        {/* Hero Image */}
        {content.coverImage && (
          <div className="w-full aspect-[4/3] relative">
            <img src={content.coverImage} alt={content.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}

        <div className={`px-5 pt-6 relative ${content.coverImage ? '-mt-6 rounded-t-[32px]' : ''}`} style={{ background: theme.background }}>
          {content.tags && content.tags.length > 0 && (
            <div className="flex gap-2 mb-3">
              {content.tags.map(tag => (
                <span key={tag} className="text-xs font-bold px-2 py-1 rounded" style={{ background: 'rgba(46, 204, 113, 0.1)', color: '#2ECC71' }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <h1 className="text-2xl font-bold mb-2 leading-tight" style={{ color: theme.textPrimary, fontFamily: TYPOGRAPHY.fonts.heading }}>
            {content.title}
          </h1>
          
          {content.description && (
            <p className="text-sm opacity-80 mb-6" style={{ color: theme.textSecondary }}>
              {content.description}
            </p>
          )}

          {/* Audio Player if available */}
          {content.audioUrl && (
            <div className="mb-6 p-4 rounded-2xl border" style={{ background: theme.cardBg, borderColor: theme.cardBorder }}>
              <audio 
                ref={setAudioRef} 
                src={content.audioUrl} 
                onEnded={() => setIsPlaying(false)}
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                onTimeUpdate={(e) => setAudioPosition(e.target.currentTime)}
                onLoadedMetadata={(e) => setAudioDuration(e.target.duration)}
              />
              <div className="flex items-center gap-4">
                <button 
                  onClick={toggleAudio}
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-green-600 text-white"
                >
                  {isPlaying ? <Pause fill="currentColor" /> : <Play fill="currentColor" className="ml-1" />}
                </button>
                <div>
                  <h4 className="font-bold text-sm" style={{ color: theme.textPrimary }}>Sesli İçerik</h4>
                  <p className="text-xs opacity-70" style={{ color: theme.textSecondary }}>
                    {content.narrator ? `Seslendiren: ${content.narrator}` : 'Dinlemek için dokunun'}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Main Content */}
          {content.content && (
            <div className="prose prose-sm max-w-none pb-8">
              {content.content.split('\n').map((paragraph, idx) => (
                <p key={idx} className="mb-4 leading-relaxed font-medium" style={{ color: theme.textSecondary, fontSize: '15px' }}>
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {/* Series Lessons */}
          {type === 'series' && content.lessons && content.lessons.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-bold mb-4" style={{ color: theme.textPrimary }}>Seri Bölümleri</h3>
              <div className="space-y-3">
                {content.lessons.map((lesson, idx) => (
                  <div 
                    key={lesson._id || lesson.id} 
                    onClick={() => navigate(`/content/lesson/${lesson.slug}`)}
                    className="p-4 rounded-xl border flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ background: theme.cardBg, borderColor: theme.cardBorder }}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: 'rgba(46, 204, 113, 0.1)', color: '#2ECC71' }}>
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm" style={{ color: theme.textPrimary }}>{lesson.title}</h4>
                      <p className="text-xs opacity-70" style={{ color: theme.textSecondary }}>{lesson.estimatedReadingTime ? `${lesson.estimatedReadingTime} dk okuma` : 'Bölümü görüntüle'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
