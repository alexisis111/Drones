import React from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { MapPin, Phone, Mail, Building2, Shield, Briefcase, Users, Star, ChevronRight, Facebook, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  const { theme } = useTheme();

  return (
    <footer className={`py-16 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-gray-300'
        : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700'
    }`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* О компании */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-4">
              <Building2 className="w-8 h-8 text-blue-500 mr-2" />
              <h3 className={`text-xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>ООО "ЛЕГИОН"</h3>
            </div>
            <p className="mb-4">
              Строительно-монтажная компания с 12-летним опытом работы.
            </p>
            <p className="mb-6">
              Специализируемся на крупных проектах в Ленинградской области и на Северо-Западе России.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className={`p-2 rounded-full ${
                  theme === 'dark'
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                } shadow-md transition-all`}
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className={`p-2 rounded-full ${
                  theme === 'dark'
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                } shadow-md transition-all`}
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {/* Быстрые ссылки */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className={`text-lg font-bold mb-6 flex items-center ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              Быстрые ссылки
            </h3>
            <ul className="space-y-3">
              {[
                { to: "/", label: "Главная" },
                { to: "/company", label: "О компании" },
                { to: "/services", label: "Наши услуги" },
                { to: "/portfolio", label: "Портфолио" },
                { to: "/contacts", label: "Контакты" },
                { to: "/vacancies", label: "Вакансии" },
                { to: "/drone-defense", label: "Защита от БПЛА" },
                { to: "/proposal", label: "Специальное предложение" }
              ].map((item, index) => (
                <motion.li
                  key={item.to}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 + index * 0.05 }}
                >
                  <Link
                    to={item.to}
                    className={`flex items-center group ${
                      theme === 'dark'
                        ? 'text-gray-300 hover:text-white'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    <ChevronRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Услуги */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className={`text-lg font-bold mb-6 flex items-center ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              <Briefcase className="w-5 h-5 mr-2 text-blue-500" />
              Наши услуги
            </h3>
            <ul className="space-y-3">
              {[
                "Строительство и ремонт",
                "Монтаж металлоконструкций",
                "Отделочные работы",
                "Бетонные и железобетонные работы",
                "Теплоизоляционные работы",
                "Инженерные сети",
                "Строительство ангаров",
                "Защита от БПЛА"
              ].map((service, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.25 + index * 0.05 }}
                  className="flex items-center"
                >
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'
                  }`}></div>
                  {service}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Контакты */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className={`text-lg font-bold mb-6 flex items-center ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              <Shield className="w-5 h-5 mr-2 text-green-500" />
              Контакты
            </h3>
            <address className="not-italic space-y-4">
              <div className="flex items-start">
                <MapPin className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`} />
                <div>
                  <p className="mb-1">188992, Ленинградская обл.,</p>
                  <p className="mb-1">Выборгский район, г. Светогорск,</p>
                  <p>ул. Максима Горького, д. 7</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`} />
                <div>
                  <p className="mb-1"><strong>Телефон/факс:</strong> 8 (81378) 40-235</p>
                  <p className="mb-1"><strong>Генеральный директор:</strong> +7 931 247-08-88</p>
                  <p className="mb-1"><strong>Отдел снабжения:</strong> +7 921 340 36 16</p>
                  <p><strong>Отдел кадров:</strong> +7 921 591-65-06</p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`} />
                <p>l-legion@bk.ru</p>
              </div>
            </address>
          </motion.div>
        </div>

        <motion.div
          className={`mt-12 pt-8 border-t ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>&copy; {new Date().getFullYear()} ООО "ЛЕГИОН". Все права защищены.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/privacy"
                className={`hover:text-blue-600 transition-colors text-sm ${
                  theme === 'dark' ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Политика
              </Link>
              <Link
                to="/terms"
                className={`hover:text-blue-600 transition-colors text-sm ${
                  theme === 'dark' ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Условия
              </Link>
              <Link
                to="/proposal"
                className={`flex items-center font-medium text-sm ${
                  theme === 'dark'
                    ? 'text-blue-400 hover:text-blue-300'
                    : 'text-blue-600 hover:text-blue-700'
                }`}
              >
                Предложение
                <ChevronRight className="w-3 h-3 ml-1" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;