import React, { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { Menu, X, Sun, Moon, Star, Briefcase, Building2, Users, MapPin, Shield, Gift } from 'lucide-react';
import OptimizedImage from './OptimizedImage';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-md ${
      theme === 'dark'
        ? 'bg-gray-900/90 border-b border-gray-800'
        : 'bg-white/90 border-b border-gray-200'
    }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-auto h-16 flex items-center justify-center">
              <OptimizedImage
                src="/Logo-1.png"
                alt="Logo"
                className="w-full h-full object-contain"
                priority={true} // Logo should load immediately
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-1">
            {[
              { to: "/", label: "Главная", icon: Star },
              { to: "/company", label: "О компании", icon: Building2 },
              { to: "/services", label: "Услуги", icon: Briefcase },
              { to: "/portfolio", label: "Портфолио", icon: Briefcase },
              { to: "/contacts", label: "Контакты", icon: MapPin },
              { to: "/vacancies", label: "Вакансии", icon: Users },
              { to: "/drone-defense", label: "Защита от БПЛА", icon: Shield, isSpecial: true }
            ].map((item, index) => (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={item.to}
                  className={`flex items-center px-3 py-2 rounded-lg font-medium transition-all ${
                    theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-1" />
                  <span className="whitespace-nowrap">{item.label}</span>
                  {item.isSpecial && (
                    <span className={`ml-1 px-1.5 py-0.5 text-[0.6rem] font-bold rounded-full animate-pulse ${
                      theme === 'dark' ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white' : 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                    }`}>
                      NEW
                    </span>
                  )}
                </Link>
              </motion.div>
            ))}
          </nav>

          <div className="flex items-center space-x-3">
            {/* Theme Toggle Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={`p-2 rounded-full ${
                theme === 'dark'
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>

            {/* Proposal Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/proposal"
                className={`hidden lg:flex items-center px-3 py-1.5 rounded-lg font-medium text-sm ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                }`}
              >
                <Gift className="w-3 h-3 mr-1" />
                <span>Предложение</span>
              </Link>
            </motion.div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleMenu}
                className={`p-2 rounded-md ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-800'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700"
          >
            <nav className="flex flex-col space-y-2 pt-4">
              {[
                { to: "/", label: "Главная", icon: Star },
                { to: "/company", label: "О компании", icon: Building2 },
                { to: "/services", label: "Услуги", icon: Briefcase },
                { to: "/portfolio", label: "Портфолио", icon: Briefcase },
                { to: "/contacts", label: "Контакты", icon: MapPin },
                { to: "/vacancies", label: "Вакансии", icon: Users },
                { to: "/drone-defense", label: "Защита от БПЛА", icon: Shield, isSpecial: true }
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center px-4 py-3 rounded-lg font-medium ${
                    theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span className="whitespace-nowrap">{item.label}</span>
                  {item.isSpecial && (
                    <span className={`ml-auto px-2 py-0.5 text-xs font-bold rounded-full animate-pulse ${
                      theme === 'dark' ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white' : 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                    }`}>
                      NEW
                    </span>
                  )}
                </Link>
              ))}

              <Link
                to="/proposal"
                className={`flex items-center justify-center mt-4 px-4 py-2.5 rounded-lg font-medium text-sm ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Gift className="w-4 h-4 mr-1.5" />
                <span>Предложение</span>
              </Link>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;