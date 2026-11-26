/**
 * Lightweight PageTransition wrapper — renders immediately with zero blocking exit delay
 * so bottom menu tab switches are instantaneous on phones and tablets.
 */
import React from 'react';

export default function PageTransition({ children }) {
  return <div style={{ width: '100%' }}>{children}</div>;
}
