/**
 * Page Transition wrapper using Framer Motion.
 * Provides smooth fade + slide animations between route changes.
 */
import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
};

// Daha kısa süre → 'mode="wait"' altında geri/ileri geçişlerdeki
// hissedilir bekleme azalır, sayfa daha hızlı açılır.
const pageTransition = {
  type: 'tween',
  ease: 'easeOut',
  duration: 0.14,
};

export default function PageTransition({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
}
