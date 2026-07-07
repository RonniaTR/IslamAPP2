import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export function ProgressBar({ 
  progress = 0, 
  color, 
  height = '8px', 
  bg, 
  className = '', 
  style = {} 
}) {
  const { theme } = useTheme();
  
  // Ensure progress is between 0 and 100
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div 
      className={className}
      style={{ 
        width: '100%', 
        height: height, 
        borderRadius: height, 
        background: bg || (theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'), 
        overflow: 'hidden',
        ...style 
      }}
    >
      <div 
        style={{ 
          width: `${normalizedProgress}%`, 
          height: '100%', 
          borderRadius: height, 
          background: color || theme.primaryGradient,
          transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
        }} 
      />
    </div>
  );
}
