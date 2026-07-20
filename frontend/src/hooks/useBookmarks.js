import { useState, useEffect } from 'react';
import { BookmarkService } from '../services/BookmarkService';

export function useBookmarks(contentId) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!contentId) {
      setLoading(false);
      return;
    }

    const checkBookmark = async () => {
      try {
        const result = await BookmarkService.isBookmarked('anonymous', contentId);
        setIsBookmarked(result);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    checkBookmark();
  }, [contentId]);

  const toggleBookmark = async (content) => {
    if (!content) return;
    try {
      // Optimistic UI update
      setIsBookmarked(!isBookmarked);
      const result = await BookmarkService.toggleBookmark('anonymous', content);
      setIsBookmarked(result);
    } catch (e) {
      // Revert on error
      setIsBookmarked(!isBookmarked);
      console.error(e);
    }
  };

  return { isBookmarked, toggleBookmark, loading };
}
