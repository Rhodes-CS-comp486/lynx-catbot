import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SplashScreen = ({ onComplete }) => {
  const [animationState, setAnimationState] = useState('initial');

  useEffect(() => {
    // First animate in
    const timer1 = setTimeout(() => {
      setAnimationState('visible');
    }, 300);

    // Then animate out
    const timer2 = setTimeout(() => {
      setAnimationState('exit');
    }, 2000);

    // Finally complete the animation
    const timer3 = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 z-50 rounded-2xl"
      initial={{ opacity: 1 }}
      animate={{ opacity: animationState === 'exit' ? 0 : 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: animationState === 'visible' ? 1 : (animationState === 'exit' ? 1.1 : 0.8),
            opacity: animationState === 'visible' ? 1 : (animationState === 'exit' ? 0 : 0)
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="flex flex-col items-center"
        >
          <div className="text-5xl font-bold text-gray-800 dark:text-white mb-2">Catbot</div>

          <motion.div
            className="w-10 h-10 relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 border-4 border-red-500 border-t-transparent rounded-full"></div>
          </motion.div>

          <div className="text-gray-600 dark:text-gray-300 mt-4 opacity-80">Your virtual assistant</div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SplashScreen;