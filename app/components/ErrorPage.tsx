import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, MessageCircle, Wrench, Clock } from 'lucide-react';

const ErrorPage: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    // Проверяем тему напрямую из localStorage или system preference
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(storedTheme === 'dark' || (!storedTheme && prefersDark));
  }, []);
  
  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${
      isDark
        ? 'bg-gradient-to-br from-gray-900 via-red-950/20 to-gray-900'
        : 'bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50'
    }`}>
      <div className="text-center max-w-2xl mx-auto">
        {/* Animated Icon */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, -5, 5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="w-32 h-32 mx-auto bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl"
            >
              <Wrench className="w-16 h-16 text-white" />
            </motion.div>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity
              }}
              className="absolute inset-0 bg-red-400 rounded-full blur-xl"
            />
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Упс! Что-то пошло не так
          </h1>
          <p className={`text-xl mb-6 ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Мы уже знаем о проблеме и работаем над её устранением
          </p>
        </motion.div>

        {/* Status Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className={`rounded-xl p-4 shadow-lg ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <AlertTriangle className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <p className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>Обнаружена ошибка</p>
          </div>
          <div className={`rounded-xl p-4 shadow-lg ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <Wrench className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>Команда работает</p>
          </div>
          <div className={`rounded-xl p-4 shadow-lg ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>Скоро всё заработает</p>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="space-y-4"
        >
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Хотите ускорить решение? Напишите нам!
          </p>

          <a
            href="https://t.me/Christopher_Nolan_NY"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <MessageCircle className="w-6 h-6" />
            <span>Написать в Telegram</span>
          </a>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className={`mt-8 text-sm ${
            isDark ? 'text-gray-500' : 'text-gray-500'
          }`}
        >
          <p>Приносим извинения за неудобства</p>
        </motion.div>
      </div>
    </div>
  );
};

export default ErrorPage;
