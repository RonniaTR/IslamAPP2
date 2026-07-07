import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { TYPOGRAPHY } from '../../styles/designTokens';

export function Typography({ 
  variant = 'body', 
  color = 'primary', // primary, secondary, muted, gold, inherit
  weight,
  className = '', 
  style = {}, 
  children,
  ...props 
}) {
  const { theme } = useTheme();

  // Variant mappings
  const variantStyles = {
    h1: { fontSize: '28px', fontWeight: weight || 800, fontFamily: TYPOGRAPHY.fonts.heading, letterSpacing: '-0.02em' },
    h2: { fontSize: '24px', fontWeight: weight || 800, fontFamily: TYPOGRAPHY.fonts.heading, letterSpacing: '-0.02em' },
    h3: { fontSize: '20px', fontWeight: weight || 700, fontFamily: TYPOGRAPHY.fonts.heading },
    h4: { fontSize: '18px', fontWeight: weight || 700, fontFamily: TYPOGRAPHY.fonts.heading },
    subtitle1: { fontSize: '16px', fontWeight: weight || 600, fontFamily: TYPOGRAPHY.fonts.body },
    subtitle2: { fontSize: '14px', fontWeight: weight || 600, fontFamily: TYPOGRAPHY.fonts.body },
    body: { fontSize: '15px', fontWeight: weight || 400, fontFamily: TYPOGRAPHY.fonts.body, lineHeight: 1.5 },
    bodySmall: { fontSize: '13px', fontWeight: weight || 400, fontFamily: TYPOGRAPHY.fonts.body, lineHeight: 1.5 },
    caption: { fontSize: '11px', fontWeight: weight || 500, fontFamily: TYPOGRAPHY.fonts.body },
  };

  // Color mappings
  const colorStyles = {
    primary: theme.textPrimary,
    secondary: theme.textSecondary,
    muted: theme.textMuted,
    gold: theme.gold,
    inherit: 'inherit',
    white: '#FFFFFF',
  };

  const Component = ['h1', 'h2', 'h3', 'h4'].includes(variant) ? variant : 'p';

  return (
    <Component
      className={className}
      style={{
        ...variantStyles[variant],
        color: colorStyles[color],
        margin: 0,
        ...style
      }}
      {...props}
    >
      {children}
    </Component>
  );
}
