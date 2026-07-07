import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Bookmark, Share2, Type, List, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { TYPOGRAPHY } from '../styles/designTokens';
import api from '../api';
import { fetchWithCache } from '../services/cache';

export default function KnowledgeDetail() {
  const { cardId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState(14); // default text-sm roughly

  useEffect(() => {
    if (cardId.startsWith('hadith_')) {
      const actualId = cardId.replace('hadith_', '');
      fetchWithCache(`hadith_${actualId}`, () => api.get(`/hadiths/${actualId}`).then(r => r.data).catch(() => api.get(`/hadith/${actualId}`).then(r => r.data)), { ttl: 24 * 60 * 60 * 1000 })
        .then((data) => {
          setArticle({
            title: data.theme || data.bookTr || 'Hadis-i Şerif',
            image: "https://images.unsplash.com/photo-1590076215667-87ebffeb36e6?auto=format&fit=crop&q=80&w=800",
            content: `${data.arabic ? data.arabic + '\n\n' : ''}${data.turkish || ''}\n\nKaynak: ${data.bookTr || ''}`
          });
          setLoading(false);
        })
        .catch(() => {
          setArticle({
            title: "Hadis-i Şerif",
            image: "https://images.unsplash.com/photo-1590076215667-87ebffeb36e6?auto=format&fit=crop&q=80&w=800",
            content: "Ameller niyetlere göredir."
          });
          setLoading(false);
        });
    } else {
      fetchWithCache(`knowledge_${cardId}`, () => api.get(`/knowledge/${cardId}`).then(r => r.data), { ttl: 24 * 60 * 60 * 1000 })
        .then(({ data }) => {
          setArticle(data || null);
          setLoading(false);
        })
        .catch(() => {
          // Mock fallback
          setArticle({
            title: "Tevekkül Nedir? Nasıl Gerçekleşir?",
            image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=800",
            content: "Tevekkül, kişinin elinden geleni yaptıktan sonra, duruşunu bozmadan, inancını sarsmadan sonucu Allah'a bırakmasıdır. İslami literatürde tevekkül; kalbin sadece Allah'a güvenip dayanması, O'ndan başkasına iltica etmemesi anlamına gelir.\n\nBir Müslümanın hayatındaki en önemli kavramlardan biri tevekküldür. Sadece dua ederek beklemek değil, aynı zamanda sebeplere sarılmak ve çaba göstermektir.\n\nPeygamber Efendimiz (s.a.v) devesini bağlamadan tevekkül ettiğini söyleyen bir bedeviye, 'Önce deveni bağla, sonra tevekkül et!' buyurarak tevekkülün doğru tanımını yapmıştır.\n\nTevekkül, tembellik değil, aksine en yüksek düzeyde bir faaliyettir. Zira kişi, elinden gelen tüm imkanları seferber ettikten sonra, kalbini endişelerden arındırır ve Mutlak Güç Sahibine teslim olur. Bu, insana büyük bir huzur ve psikolojik dayanıklılık sağlar."
          });
          setLoading(false);
        });
    }
  }, [cardId]);

  return (
    <div className="min-h-screen bg-white" data-testid="knowledge-detail">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 pt-6 pb-4 sticky top-0 z-10" style={{ background: theme.primary }}>
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 transition-opacity hover:opacity-70">
          <ChevronLeft size={24} color="#FFF" />
          <span className="font-extrabold text-lg tracking-tight text-white" style={{ fontFamily: TYPOGRAPHY.fonts.heading }}>
            Makale Okuma
          </span>
        </button>
        <div className="flex items-center gap-3">
          <button className="p-2 transition-opacity hover:opacity-70"><Bookmark size={20} color="#FFF" /></button>
          <button className="p-2 transition-opacity hover:opacity-70"><Share2 size={20} color="#FFF" /></button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Loader className="animate-spin text-primary w-8 h-8" /></div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-24">
          {/* Hero Image */}
          <div className="w-full aspect-[4/3] relative">
            <img src={article?.image} alt={article?.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          <div className="px-5 pt-6 relative -mt-6 bg-white rounded-t-[32px]">
            <h1 className="text-2xl font-bold mb-6 leading-tight" style={{ color: theme.textPrimary, fontFamily: TYPOGRAPHY.fonts.heading }}>
              {article?.title}
            </h1>
            
            <div className="prose prose-sm max-w-none pb-20">
              {article?.content?.split('\n').map((paragraph, idx) => (
                <p key={idx} className="mb-4 leading-relaxed font-medium" style={{ color: theme.textSecondary, fontSize: `${fontSize}px` }}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Bottom Reading Toolbar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t z-20" style={{ borderColor: theme.cardBorder }}>
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <button onClick={() => setFontSize(Math.max(12, fontSize - 2))} className="flex items-center gap-1 font-bold text-gray-400 hover:text-gray-800 transition-colors">
              A-
            </button>
            <button onClick={() => setFontSize(Math.min(24, fontSize + 2))} className="flex items-center gap-1 font-bold text-gray-800 transition-colors">
              A+
            </button>
          </div>
          
          <div className="flex-1 mx-8 h-1 bg-gray-200 rounded-full overflow-hidden">
             <div className="h-full bg-primary" style={{ width: '30%', background: theme.primary }} />
          </div>
          
          <button><Bookmark size={20} style={{ color: theme.textSecondary }} /></button>
        </div>
      </div>
    </div>
  );
}
