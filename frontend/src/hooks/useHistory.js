import { useEffect } from 'react';
import { HistoryService } from '../services/HistoryService';

export function useHistory(content, scrollPosition = 0, audioPosition = 0, duration = 100) {
  useEffect(() => {
    if (!content) return;

    // We use a debounce-like behavior to save progress when unmounting or periodically
    const saveInterval = setInterval(() => {
      let progress = 0;
      let currentPos = 0;

      if (content.type === 'audio' || content.audioUrl) {
        // Audio progress
        currentPos = audioPosition;
        progress = duration > 0 ? (audioPosition / duration) * 100 : 0;
      } else {
        // Scroll progress for articles/lessons
        currentPos = scrollPosition;
        // Simple mock for scroll progress based on screen height
        const documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
        const windowHeight = window.innerHeight;
        const maxScroll = documentHeight - windowHeight;
        
        progress = maxScroll > 0 ? (scrollPosition / maxScroll) * 100 : 100;
        if (progress > 100) progress = 100;
      }

      HistoryService.saveProgress('anonymous', content, progress, currentPos);
    }, 10000); // Save every 10 seconds

    return () => clearInterval(saveInterval);
  }, [content, scrollPosition, audioPosition, duration]);

  // Provide manual save function
  const saveNow = async (progress, pos) => {
    if (content) {
      await HistoryService.saveProgress('anonymous', content, progress, pos);
    }
  };

  return { saveNow };
}
