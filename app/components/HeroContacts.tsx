import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { Phone, Mail, MapPin, ArrowRight, Clock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface HeroContactsProps {
  ctaLink?: string;
  ctaButtonText?: string;
}

const HeroContacts: React.FC<HeroContactsProps> = ({
  ctaLink = '/contacts',
  ctaButtonText = 'Обсудить проект'
}) => {
  const { theme } = useTheme();

  const contactItems = [
    {
      icon: <Phone className="w-5 h-5" />,
      label: 'Телефон',
      value: '+7 (931) 247-08-88',
      href: 'tel:+79312470888'
    },
    {
      icon: <Mail className="w-5 h-5" />,
      label: 'Email',
      value: 'l-legion@bk.ru',
      href: 'mailto:l-legion@bk.ru'
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: 'Адрес',
      value: 'Ленинградская область',
      href: '/contacts'
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: 'Режим работы',
      value: 'Пн-Пт: 09:00-18:00',
      href: null
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="space-y-6"
    >
      {/* Contact Cards */}
      <div className="space-y-4">
        {contactItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className={`group relative overflow-hidden rounded-2xl p-4 transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-white/5 hover:bg-white/10 border border-white/10'
                : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
            } ${item.href ? 'cursor-pointer' : ''}`}
            {...(item.href ? {} : { role: 'presentation' })}
          >
            {item.href && (
              <Link
                to={item.href}
                className="absolute inset-0 z-10"
                aria-label={`${item.label}: ${item.value}`}
              />
            )}
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white'
                  : 'bg-gradient-to-br from-blue-600 to-purple-600 text-white'
              }`}>
                {item.icon}
              </div>
              <div className="flex-1">
                <div className={`text-xs font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {item.label}
                </div>
                <div className={`text-sm font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {item.value}
                </div>
              </div>
              {item.href && (
                <ArrowRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`} />
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Link
          to={ctaLink}
          className="group relative flex items-center justify-center gap-3 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-[1.02]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="relative z-10">{ctaButtonText}</span>
          <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>

      {/* Trust Badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className={`text-center text-sm ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}
      >
        <span className="inline-flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Работаем по всей России
        </span>
      </motion.div>
    </motion.div>
  );
};

export default HeroContacts;
