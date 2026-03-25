import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Download, Trash2, Check, Loader2, ArrowLeft, HardDrive, Wifi, WifiOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useLang } from '../contexts/LangContext';
import api from '../api';

const PACK_ICONS = {
  quran_tr: '📖', quran_en: '📖', quran_ar: '📖',
  hadith_all: '📜',
  ui_tr: '🇹🇷', ui_en: '🇬🇧', ui_ar: '🇸🇦',
};

export default function OfflinePacksPage() {
  const { theme } = useTheme();
  const { lang } = useLang();
  const navigate = useNavigate();
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);
  const [installed, setInstalled] = useState(() => {
    try { return JSON.parse(localStorage.getItem('offline_packs') || '{}'); } catch { return {}; }
  });

  useEffect(() => {
    api.get(`/offline/packs?lang=${lang}`).then(r => {
      setPacks(Array.isArray(r.data) ? r.data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [lang]);

  const downloadPack = useCallback(async (packId) => {
    if (downloading) return;
    setDownloading(packId);
    try {
      const { data } = await api.get(`/offline/pack/${packId}`);
      // Store in localStorage (small packs) or IDB for large packs
      const key = `offline_data_${packId}`;
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch {
        // If localStorage is full, use IDB
        if (window.indexedDB) {
          const request = window.indexedDB.open('offlinePacks', 1);
          request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('packs')) db.createObjectStore('packs');
          };
          request.onsuccess = (e) => {
            const db = e.target.result;
            const tx = db.transaction('packs', 'readwrite');
            tx.objectStore('packs').put(data, packId);
          };
        }
      }
      const newInstalled = { ...installed, [packId]: { date: new Date().toISOString(), size: JSON.stringify(data).length } };
      setInstalled(newInstalled);
      localStorage.setItem('offline_packs', JSON.stringify(newInstalled));
    } catch {}
    setDownloading(null);
  }, [downloading, installed]);

  const removePack = useCallback((packId) => {
    localStorage.removeItem(`offline_data_${packId}`);
    const newInstalled = { ...installed };
    delete newInstalled[packId];
    setInstalled(newInstalled);
    localStorage.setItem('offline_packs', JSON.stringify(newInstalled));
    // Also remove from IDB
    if (window.indexedDB) {
      const request = window.indexedDB.open('offlinePacks', 1);
      request.onsuccess = (e) => {
        try {
          const db = e.target.result;
          const tx = db.transaction('packs', 'readwrite');
          tx.objectStore('packs').delete(packId);
        } catch {}
      };
    }
  }, [installed]);

  const totalSize = Object.values(installed).reduce((sum, p) => sum + (p.size || 0), 0);

  return (
    <div className="min-h-screen pb-8" style={{ background: theme.bg }}>
      <div className="px-4 pt-6 pb-5" style={{ background: `linear-gradient(135deg, ${theme.surface}, ${theme.surfaceLight})` }}>
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl" style={{ background: theme.inputBg }}>
            <ArrowLeft size={18} style={{ color: theme.textPrimary }} />
          </button>
          <div>
            <h1 className="text-lg font-bold" style={{ color: theme.textPrimary }}>Çevrimdışı Paketler</h1>
            <p className="text-xs" style={{ color: theme.textSecondary }}>
              İnternet olmadan da kullanın
            </p>
          </div>
          <WifiOff size={20} className="ml-auto" style={{ color: theme.gold }} />
        </div>

        {/* Storage info */}
        <div className="mt-3 rounded-xl p-3" style={{ background: theme.inputBg, border: `1px solid ${theme.inputBorder}` }}>
          <div className="flex items-center gap-2">
            <HardDrive size={14} style={{ color: theme.gold }} />
            <span className="text-xs" style={{ color: theme.textSecondary }}>
              Kullanılan alan: {(totalSize / 1024 / 1024).toFixed(1)} MB · {Object.keys(installed).length} paket yüklü
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-3">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin" style={{ color: theme.gold }} />
          </div>
        ) : packs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm" style={{ color: theme.textSecondary }}>Paket bulunamadı</p>
          </div>
        ) : (
          packs.map((pack, i) => {
            const isInstalled = !!installed[pack.id];
            const isDownloading = downloading === pack.id;

            return (
              <motion.div key={pack.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl p-4"
                style={{ background: theme.cardBg, border: `1px solid ${isInstalled ? `${theme.gold}30` : theme.cardBorder}` }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{PACK_ICONS[pack.id] || '📦'}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: theme.textPrimary }}>{pack.name}</p>
                    <p className="text-[11px]" style={{ color: theme.textSecondary }}>
                      {pack.description || `${pack.size_mb || '?'} MB`}
                    </p>
                  </div>
                  {isInstalled ? (
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full"
                        style={{ background: '#10B98120', color: '#10B981' }}>
                        <Check size={10} /> Yüklü
                      </span>
                      <button onClick={() => removePack(pack.id)}
                        className="p-1.5 rounded-lg transition-colors hover:bg-red-500/10"
                        style={{ color: theme.textSecondary }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => downloadPack(pack.id)} disabled={isDownloading}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                      style={{ background: `${theme.gold}20`, color: theme.gold }}>
                      {isDownloading ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
                      {isDownloading ? 'İndiriliyor...' : 'İndir'}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
