import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { Zap, Shield, Building2 } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className={`flex-grow flex items-center justify-center overflow-hidden ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="text-center relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="absolute w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
        </div>

        {/* Main logo animation */}
        <div className="relative z-10">
          <motion.div
            className="relative w-20 h-20 mx-auto mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Rotating ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 border-r-purple-500" />
            </motion.div>

            {/* Center icon with pulse */}
            <motion.div
              className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Shield className="w-10 h-10 text-white" />
            </motion.div>

            {/* Orbiting dots */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"
                style={{ top: '50%', left: '50%' }}
                animate={{
                  x: [
                    Math.cos((i * 2 * Math.PI) / 3) * 40,
                    Math.cos(((i + 1) * 2 * Math.PI) / 3) * 40,
                    Math.cos((i * 2 * Math.PI) / 3) * 40,
                  ],
                  y: [
                    Math.sin((i * 2 * Math.PI) / 3) * 40,
                    Math.sin(((i + 1) * 2 * Math.PI) / 3) * 40,
                    Math.sin((i * 2 * Math.PI) / 3) * 40,
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            ))}
          </motion.div>
        </div>

        {/* Loading text with gradient */}
        <motion.div
          className="relative z-10 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className={`text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent`}>
            Загрузка...
          </h2>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          className="relative z-10 w-32 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto overflow-hidden"
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 128 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        {/* Feature icons */}
        <motion.div
          className="relative z-10 flex justify-center gap-4 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {[Shield, Building2, Zap].map((Icon, i) => (
            <motion.div
              key={i}
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1], y: [0, -4, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            >
              <Icon className="w-4 h-4 text-blue-500" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingScreen;