import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt after 15 seconds of usage
      setTimeout(() => setShow(true), 15000);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const install = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShow(false);
    setDeferredPrompt(null);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 max-w-[430px] mx-auto animate-fade-in" data-testid="install-prompt">
      <div className="rounded-2xl p-4 border border-[#D4AF37]/30 shadow-xl"
        style={{ background: 'linear-gradient(135deg, #0F3D2E 0%, #0A1F14 100%)' }}>
        <button onClick={() => setShow(false)} className="absolute top-3 right-3 text-[#A8B5A0] hover:text-white">
          <X size={16} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 flex items-center justify-center shrink-0">
            <Download size={18} className="text-[#D4AF37]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-[#F5F5DC]">Uygulamayı Yükle</p>
            <p className="text-[10px] text-[#A8B5A0]">Ana ekranına ekle, uygulama gibi kullan</p>
          </div>
          <button onClick={install} data-testid="install-btn"
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#0A1F14]"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #B8860B)' }}>
            Yükle
          </button>
        </div>
      </div>
    </div>
  );
}
