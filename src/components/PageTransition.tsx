import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Page transition — purposeful, not decorative. A short fade with a small
 * rise communicates "new page" without performing. Honors reduced motion
 * (fades only). Exit accelerates, enter decelerates (Apple's physics).
 */
export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const reduce = useReducedMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: reduce ? 0 : 8 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.28, ease: [0, 0, 0.2, 1] } }}
        exit={{ opacity: 0, y: reduce ? 0 : -6, transition: { duration: 0.16, ease: [0.4, 0, 1, 1] } }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
