import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: ReactNode;
}

// Ultra-fluid page transitions with spring physics for 120fps feel
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
    filter: 'blur(4px)',
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
  },
  out: {
    opacity: 0,
    y: -10,
    scale: 1.01,
    filter: 'blur(2px)',
  }
};

// Spring physics for ultra-smooth 120fps animations
const pageTransition = {
  type: 'spring' as const,
  stiffness: 280,
  damping: 26,
  mass: 0.8,
  restDelta: 0.001,
  restSpeed: 0.001,
};

// GPU-accelerated transforms
const pageStyle = {
  willChange: 'transform, opacity, filter',
  backfaceVisibility: 'hidden' as const,
  perspective: 1000,
};

export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname + (isTransitioning ? '-transitioning' : '')}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        style={pageStyle}
        className="w-full min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
