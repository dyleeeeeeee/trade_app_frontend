import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

export interface StaggerConfig {
  staggerChildren?: number;
  delayChildren?: number;
  staggerDirection?: 1 | -1;
  staggerAxis?: 'x' | 'y';
}
export interface ItemConfig {
  delay?: number;
  duration?: number;
  ease?: any; // Using any to avoid complex Framer Motion typing
}

export function useStaggeredAnimation(
  itemCount: number,
  config: StaggerConfig = {},
  itemConfig: ItemConfig = {}
) {
  const controls = useAnimation();

  const {
    staggerChildren = 0.1,
    delayChildren = 0,
    staggerDirection = 1
  } = config;

  const {
    delay = 0,
    duration = 0.4,
    ease = [0.25, 0.46, 0.45, 0.94]
  } = itemConfig;

  useEffect(() => {
    controls.start('visible');
  }, [controls, itemCount]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerChildren * staggerDirection,
        delayChildren,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      filter: 'blur(4px)'
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 25,
        mass: 0.8,
        delay,
        duration,
      },
    },
  } as const;

  return {
    containerVariants,
    itemVariants,
    controls,
  };
}

// Hook for fluid hover animations
export function useFluidHover() {
  return {
    whileHover: {
      scale: 1.02,
      y: -2,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 25,
        mass: 0.8
      }
    },
    whileTap: {
      scale: 0.98,
      transition: {
        type: 'spring',
        stiffness: 600,
        damping: 20,
        mass: 0.5
      }
    },
  };
}

// Hook for fluid focus animations
export function useFluidFocus() {
  return {
    whileFocus: {
      scale: 1.01,
      boxShadow: "0 0 0 2px rgba(var(--primary), 0.2)",
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25
      }
    },
  };
}

// Hook for loading animations
export function useLoadingAnimation() {
  return {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
      mass: 0.8
    }
  };
}

// Advanced morphing animations for buttons
export function useMorphingButton() {
  return {
    idle: {
      scale: 1,
      borderRadius: '0.5rem',
      background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary)) 100%)'
    },
    hover: {
      scale: 1.02,
      y: -2,
      borderRadius: '0.75rem',
      background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary)/0.8))',
      boxShadow: '0 10px 25px -5px rgba(var(--primary), 0.3)',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 25,
        mass: 0.8
      }
    },
    tap: {
      scale: 0.95,
      borderRadius: '0.25rem',
      transition: {
        type: 'spring',
        stiffness: 600,
        damping: 20,
        mass: 0.5
      }
    },
    loading: {
      scale: 0.98,
      borderRadius: '2rem',
      background: 'linear-gradient(45deg, hsl(var(--primary)), hsl(var(--primary)/0.8), hsl(var(--primary)))',
      backgroundSize: '200% 200%',
      animation: 'shimmer 2s ease-in-out infinite',
    }
  };
}

// Micro-interaction animations for icons
export function useIconMicro() {
  return {
    whileHover: {
      scale: 1.1,
      rotate: [0, -10, 10, 0],
      transition: {
        rotate: {
          duration: 0.6,
          ease: 'easeInOut'
        },
        scale: {
          type: 'spring',
          stiffness: 400,
          damping: 25
        }
      }
    },
    whileTap: {
      scale: 0.9,
      rotate: 180,
      transition: {
        duration: 0.2
      }
    }
  };
}

// Parallax scroll effect
export function useParallax() {
  return {
    initial: { y: 0 },
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };
}

// Fluid text animations
export function useTextReveal() {
  return {
    initial: {
      opacity: 0,
      y: 30,
      filter: 'blur(10px)'
    },
    animate: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
        mass: 0.8
      }
    }
  };
}

// Pulse animation for notifications
export function usePulse() {
  return {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };
}

// Magnetic hover effect
export function useMagneticHover() {
  return {
    whileHover: {
      scale: 1.02,
      rotateX: 5,
      rotateY: 5,
      transformPerspective: 1000,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };
}

// Fluid card flip animation
export function useCardFlip() {
  return {
    initial: { rotateY: 0 },
    animate: { rotateY: 180 },
    exit: { rotateY: 0 },
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  };
}

// Success/error state animations
export function useStateAnimation(type: 'success' | 'error' | 'warning' | 'info') {
  const colors = {
    success: 'rgb(34, 197, 94)',
    error: 'rgb(239, 68, 68)',
    warning: 'rgb(245, 158, 11)',
    info: 'rgb(59, 130, 246)'
  };

  return {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      boxShadow: `0 0 20px ${colors[type]}20`,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25
      }
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };
}

// Typing animation for text
export function useTypingAnimation(text: string, speed: number = 50) {
  const [displayText, setDisplayText] = React.useState('');

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return displayText;
}

// Floating animation for decorative elements
export function useFloating() {
  return {
    animate: {
      y: [0, -10, 0],
      rotate: [0, 2, -2, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };
}

// Glitch effect for special states
export function useGlitch() {
  return {
    animate: {
      x: [0, -2, 2, -1, 1, 0],
      y: [0, 1, -1, 0.5, -0.5, 0],
      filter: ['hue-rotate(0deg)', 'hue-rotate(90deg)', 'hue-rotate(180deg)', 'hue-rotate(0deg)'],
      transition: {
        duration: 0.3,
        repeat: 3,
        ease: 'easeInOut'
      }
    }
  };
}
