import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export function Skeleton({ 
  width, 
  height, 
  borderRadius = '8px', 
  className = '', 
  style = {} 
}) {
  const { theme } = useTheme();

  return (
    <div
      className={`animate-pulse ${className}`}
      style={{
        width: width || '100%',
        height: height || '20px',
        borderRadius: borderRadius,
        background: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
        ...style
      }}
    />
  );
}
