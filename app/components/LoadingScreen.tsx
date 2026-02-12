import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const LoadingScreen: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className={`flex-grow flex items-center justify-center ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="text-center">
        <motion.div
          className="relative w-24 h-24 mx-auto mb-6"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className={`absolute inset-0 rounded-full border-4 ${
            theme === 'dark' 
              ? 'border-blue-500/20 border-t-blue-500' 
              : 'border-blue-300 border-t-blue-600'
          }`}></div>
          <div className="absolute inset-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
        </motion.div>
        
        <motion.h2 
          className={`text-2xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Загрузка контента...
        </motion.h2>
        
        <motion.p 
          className={`text-lg ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Пожалуйста, подождите
        </motion.p>
        
        <motion.div 
          className="mt-6 w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingScreen;