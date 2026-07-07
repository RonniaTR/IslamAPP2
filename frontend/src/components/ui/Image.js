import React, { useState } from 'react';
import { Skeleton } from './Skeleton';
import { useTheme } from '../../contexts/ThemeContext';
import { Image as ImageIcon } from 'lucide-react';

export function Image({ 
  src, 
  alt, 
  className = '', 
  style = {}, 
  skeletonHeight = '100%',
  skeletonWidth = '100%',
  fallbackIconSize = 24
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { theme } = useTheme();

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', ...style }} className={className}>
      {!isLoaded && !hasError && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          <Skeleton width={skeletonWidth} height={skeletonHeight} borderRadius="0" />
        </div>
      )}
      
      {hasError ? (
        <div style={{ 
          position: 'absolute', inset: 0, 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: theme.isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
          border: `1px solid ${theme.cardBorder}`
        }}>
          <ImageIcon size={fallbackIconSize} color={theme.textMuted} />
        </div>
      ) : (
        <img
          src={src}
          alt={alt || ''}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setIsLoaded(true);
            setHasError(true);
          }}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out'
          }}
        />
      )}
    </div>
  );
}
