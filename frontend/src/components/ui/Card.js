import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

export function Card({ 
  children, 
  className = '', 
  style = {}, 
  onClick, 
  gradient, 
  border = true,
  hover = true,
  padding = '20px',
  ...props 
}) {
  const { theme } = useTheme();

  const baseStyle = {
    background: gradient || theme.cardBg,
    borderRadius: '24px',
    padding: padding,
    border: border ? `1px solid ${theme.cardBorder}` : 'none',
    position: 'relative',
    overflow: 'hidden',
    cursor: onClick ? 'pointer' : 'default',
    ...style
  };

  if (onClick || hover) {
    return (
      <motion.div
        whileHover={hover ? { y: -2, scale: 1.01 } : {}}
        whileTap={onClick ? { scale: 0.98 } : {}}
        onClick={onClick}
        className={className}
        style={baseStyle}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={className} style={baseStyle} {...props}>
      {children}
    </div>
  );
}
