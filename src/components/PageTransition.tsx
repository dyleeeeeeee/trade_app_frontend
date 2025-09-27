import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: ReactNode;
}

// Ultra-fluid page transitions with spring physics for 120fps feel
const pageVariants = {
  initial: {
    opacity: 0,
    y: 24,
    scale: 0.96,
    filter: 'blur(8px)',
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
  },
  out: {
    opacity: 0,
    y: -12,
    scale: 1.02,
    filter: 'blur(4px)',
  }
};

// Spring physics for ultra-smooth 120fps animations
const pageTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
  mass: 0.8,
  restDelta: 0.001,
  restSpeed: 0.001,
};

// GPU-accelerated transforms
const pageStyle = {
  willChange: 'transform, opacity, filter',
  backfaceVisibility: 'hidden',
  perspective: 1000,
};

export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        style={pageStyle}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
