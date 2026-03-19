import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import {
  Shield,
  Users,
  Award,
  Clock,
  MapPin,
  HardHat,
  Building2,
  Target,
  Zap,
  CheckCircle,
  ArrowRight,
  Globe2,
  Network,
  Warehouse,
  AlertTriangle,
  CirclePile,
  Phone
} from 'lucide-react';
import { Link } from "react-router";
import { LocalBusinessSchema } from './SchemaOrg';
import Breadcrumbs, { type BreadcrumbItem } from './Breadcrumbs';

interface CompanyShowcaseProps {
  breadcrumbs?: BreadcrumbItem[];
}

const CompanyShowcase: React.FC<CompanyShowcaseProps> = ({ breadcrumbs }) => {
  const { theme } = useTheme();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Данные для схемы
  const businessData = {
    name: "Строительная компания ЛЕГИОН",
    description: "Строительная компания «ЛЕГИОН». Строим по всей России. Полный цикл работ: от подготовительных работ до сдачи объекта под ключ. Строительство зданий, монтаж металлоконструкций и комплексные решения для вашего бизнеса.",
    url: "https://xn--78-glchqprh.xn--p1ai/company",
    logo: "/Logo-2.png",
    address: "Российская Федерация",
    telephone: "+79312470888",
    email: "l-legion@bk.ru",
    openingHours: ["Mo-Fr 09:00-18:00"],
    sameAs: [
      "https://vk.com/legion__78",
      "https://max.ru/join/VSfgaLaU34O8mOpcRQMbEUcHlhFA62rS5LSpmhy0K5M",
      'https://t.me/+XaGL8WXjVwQwYjVi'
    ],
    priceRange: "$$$"
  };

  return (
      <div className="relative overflow-hidden">
        {/* Schema.org structured data */}
        <LocalBusinessSchema {...businessData} />

        {/* Hero Section */}
        <section className="relative w-full flex items-center">



          {/* Content */}
          <div className="relative container mx-auto px-4 z-10">
            {/* Хлебные крошки */}
            {breadcrumbs && (
                <div className="py-4">
                  <Breadcrumbs breadcrumbs={breadcrumbs} className={
                    theme === 'dark'
                        ? 'text-white/80'
                        : 'text-black'
                  } />
                </div>
            )}

            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Left column - Main content */}
              <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-6 md:space-y-8"
              >
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 ${
                      theme === 'dark'
                        ? 'bg-blue-900/30 text-blue-400 border border-blue-800/50'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                >
                  <Shield className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="text-sm font-medium">С 2012 года на рынке</span>
                </motion.div>


                {/* Main heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black"
                >
                  <div className={theme === 'dark' ? 'text-white' : 'text-black'}>Строительная</div>
                  <div className={theme === 'dark' ? 'text-white' : 'text-black'}>компания «ЛЕГИОН»</div>
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                    Строим по всей России
                  </div>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className={`text-sm sm:text-base md:text-lg max-w-xl ${
                        theme === 'dark' ? 'text-gray-300' : 'text-black/90'
                    }`}
                >
                  Полный цикл работ: от подготовительных работ до сдачи объекта под ключ. Строительство зданий, монтаж металлоконструкций и комплексные решения для вашего бизнеса.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4"
                >
                  <a
                      href="#history"
                      className={`group inline-flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 text-white px-4 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 text-xs sm:text-sm md:text-base ${
                          theme === 'dark'
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                              : 'bg-gradient-to-r from-blue-600 to-purple-600'
                      }`}
                  >
                    <span>Узнать больше</span>
                    <HardHat className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </a>

                  <a
                      href="/services"
                      className={`group inline-flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 px-4 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-xl font-semibold border transition-all duration-300 text-xs sm:text-sm md:text-base ${
                          theme === 'dark'
                              ? 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700 hover:border-gray-600'
                              : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                      }`}
                  >
                    <span>Наши услуги</span>
                    <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </a>
                </motion.div>
              </motion.div>

              {/* Right column - Feature cards (Desktop only) */}
              <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="hidden lg:block space-y-4"
              >
                {[
                  {
                    icon: <Shield className="w-6 h-6" />,
                    title: "Ассоциация \"СК ЛО\"",
                    description: "Членство в саморегулируемой организации",
                    gradient: "from-blue-500 to-cyan-500",
                    bgGradient: "from-blue-900/30 to-cyan-900/30"
                  },
                  {
                    icon: <Shield className="w-6 h-6" />,
                    title: "Ассоциация СРО \"ОсноваПроект\"",
                    description: "Членство в саморегулируемой организации",
                    gradient: "from-purple-500 to-pink-500",
                    bgGradient: "from-purple-900/30 to-pink-900/30"
                  },
                  {
                    icon: <Target className="w-6 h-6" />,
                    title: "Точность работ",
                    description: "Соблюдение всех нормативов и сроков",
                    gradient: "from-orange-500 to-red-500",
                    bgGradient: "from-orange-900/30 to-red-900/30"
                  },
                  {
                    icon: <Zap className="w-6 h-6" />,
                    title: "Скорость",
                    description: "Оперативное выполнение задач",
                    gradient: "from-green-500 to-emerald-500",
                    bgGradient: "from-green-900/30 to-emerald-900/30"
                  },
                  {
                    icon: <Globe2 className="w-6 h-6" />,
                    title: "География",
                    description: "Работаем по всей России",
                    gradient: "from-indigo-500 to-blue-500",
                    bgGradient: "from-indigo-900/30 to-blue-900/30"
                  }
                ].map((feature, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        whileHover={{ x: -10, scale: 1.02 }}
                        className="group relative"
                    >
                      {/* Pulsing glow effect */}
                      <div
                          className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.gradient} blur-xl pointer-events-none`}
                          style={{
                            opacity: 0.3,
                            animation: `pulse-fade ${5 + i * 1.5}s ease-in-out infinite`,
                            animationDelay: `${i * 0.7}s`
                          }}
                      />

                      {/* Main card */}
                      <div className={`relative overflow-hidden rounded-2xl p-5 transition-all duration-700 shadow-lg hover:shadow-xl border hover:border-transparent ${
                        theme === 'dark'
                          ? `bg-gradient-to-br ${feature.bgGradient} border-gray-700/50`
                          : `bg-white border-gray-200`
                      }`}
                        style={{
                          backgroundSize: '200% 200%',
                          animation: `gradient-shift ${8 + i * 2}s ease infinite`,
                          animationDelay: `${i * 0.5}s`
                        }}>
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                            {feature.icon}
                          </div>
                          <div>
                            <h3 className={`text-lg font-bold mb-1 ${
                              theme === 'dark' ? 'text-white' : 'text-black'
                            }`}>{feature.title}</h3>
                            <p className={`text-sm ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>{feature.description}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                ))}
              </motion.div>

              {/* Mobile Feature Cards - Visible only on mobile */}
              <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="lg:hidden grid grid-cols-2 gap-4 mt-8"
              >
                {[
                  {
                    icon: <Shield className="w-5 h-5" />,
                    title: "СК ЛО",
                    description: "Членство в СРО"
                  },
                  {
                    icon: <Shield className="w-5 h-5" />,
                    title: "ОсноваПроект",
                    description: "Членство в СРО"
                  },
                  {
                    icon: <Target className="w-5 h-5" />,
                    title: "Точность",
                    description: "Соблюдение нормативов"
                  },
                  {
                    icon: <Zap className="w-5 h-5" />,
                    title: "Скорость",
                    description: "Оперативность"
                  },
                  {
                    icon: <Globe2 className="w-5 h-5" />,
                    title: "География",
                    description: "Вся Россия"
                  }
                ].map((feature, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        className={`backdrop-blur-sm rounded-xl p-4 ${
                            theme === 'dark'
                                ? 'bg-white/5 border border-white/10'
                                : 'bg-white/70 border border-gray-200'
                        }`}
                    >
                      <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white mb-2 shadow-md ${
                        theme === 'light' ? 'bg-gray-800' : ''
                      }`}>
                        {feature.icon}
                      </div>
                      <h3 className={`text-sm font-bold mb-1 ${
                          theme === 'dark' ? 'text-white' : 'text-black'
                      }`}>{feature.title}</h3>
                      <p className={`text-xs ${
                          theme === 'dark' ? 'text-white/90' : 'text-gray-600'
                      }`}>{feature.description}</p>
                    </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Company History Section */}
        <section id="history" className={`relative py-16 overflow-hidden`}>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
                initial={{opacity: 0, y: 50}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                className="text-center mb-12"
            >
              <div
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 mb-4 backdrop-blur-sm ${
                      theme === 'dark'
                          ? 'bg-blue-900/30 text-blue-400 border border-blue-800/30'
                          : 'bg-blue-100 text-blue-600 border border-blue-200'
                  }`}>
                <CirclePile className="w-4 h-4"/>
                <span className="text-sm font-medium">История компании</span>
              </div>
              <h2 className={`text-3xl md:text-4xl lg:text-5xl font-black ${
                  theme === 'dark' ? 'text-white' : 'text-black'
              }`}>
                Путь к успеху
              </h2>
            </motion.div>

            {/* Timeline - Mobile version */}
            <div className="md:hidden max-w-sm mx-auto space-y-6">
              {[
                {
                  year: "2012",
                  title: "Основание компании",
                  description: "Компания начала свою деятельность 12 ноября 2012 года, специализируясь на строительно-монтажных работах.",
                  icon: Building2,
                  gradient: "from-blue-500 to-cyan-500"
                },
                {
                  year: "2017",
                  title: "Членство в СРО",
                  description: "Вступление в Ассоциацию \"СК ЛО\" и Ассоциацию СРО \"ОсноваПроект\" для расширения возможностей.",
                  icon: Shield,
                  gradient: "from-purple-500 to-pink-500"
                },
                {
                  year: "2020",
                  title: "Рост объёмов",
                  description: "За 6 лет объёмы производства выросли на 60%, подтверждая доверие клиентов по всей России.",
                  icon: Award,
                  gradient: "from-orange-500 to-red-500"
                },
                {
                  year: "2023",
                  title: "Новые направления",
                  description: "Запуск направления по защите от БПЛА и расширение спектра теплоизоляционных работ.",
                  icon: Zap,
                  gradient: "from-green-500 to-emerald-500"
                }
              ].map((item, i) => {
                const Icon = item.icon;
                
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <motion.div
                      whileHover={{ y: -3, scale: 1.02 }}
                      className={`relative overflow-hidden rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-500 ${
                        theme === 'dark'
                          ? 'bg-gray-800/80 backdrop-blur-sm border border-gray-700/50'
                          : 'bg-white border border-gray-200'
                      }`}
                      style={{
                        backgroundSize: '200% 200%',
                        animation: `gradient-shift ${8 + i}s ease infinite`
                      }}
                    >
                      {/* Пульсирующее свечение */}
                      <div
                          className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 hover:opacity-10 blur-xl transition-opacity duration-700 pointer-events-none`}
                          style={{
                            animation: `pulse-fade ${5 + i * 1.5}s ease-in-out infinite`,
                            animationDelay: `${i * 0.7}s`
                          }}
                      />

                      <div className="flex items-start gap-3">
                        {/* Иконка */}
                        <div className={`flex-shrink-0 p-2.5 rounded-xl bg-gradient-to-br ${item.gradient} text-white shadow-lg`}>
                          <Icon className="w-4 h-4" />
                        </div>

                        {/* Контент */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={`text-base font-black bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}>
                              {item.year}
                            </span>
                          </div>
                          <h3 className={`text-sm font-bold mb-1.5 ${
                            theme === 'dark' ? 'text-white' : 'text-black'
                          }`}>
                            {item.title}
                          </h3>
                          <p className={`text-xs leading-relaxed ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>

            {/* Timeline - Desktop version */}
            <div className="hidden md:block max-w-4xl mx-auto relative">
              {/* Центральная линия */}
              <div className={`absolute left-1/2 top-0 bottom-0 w-0.5 ${
                theme === 'dark' 
                  ? 'bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500' 
                  : 'bg-gradient-to-b from-blue-600 via-purple-600 to-pink-600'
              }`} />

              {[
                {
                  year: "2012",
                  title: "Основание компании",
                  description: "Компания начала свою деятельность 12 ноября 2012 года, специализируясь на строительно-монтажных работах.",
                  icon: Building2,
                  gradient: "from-blue-500 to-cyan-500"
                },
                {
                  year: "2017",
                  title: "Членство в СРО",
                  description: "Вступление в Ассоциацию \"СК ЛО\" и Ассоциацию СРО \"ОсноваПроект\" для расширения возможностей.",
                  icon: Shield,
                  gradient: "from-purple-500 to-pink-500"
                },
                {
                  year: "2020",
                  title: "Рост объёмов",
                  description: "За 6 лет объёмы производства выросли на 60%, подтверждая доверие клиентов по всей России.",
                  icon: Award,
                  gradient: "from-orange-500 to-red-500"
                },
                {
                  year: "2023",
                  title: "Новые направления",
                  description: "Запуск направления по защите от БПЛА и расширение спектра теплоизоляционных работ.",
                  icon: Zap,
                  gradient: "from-green-500 to-emerald-500"
                }
              ].map((item, i) => {
                const Icon = item.icon;
                const isLeft = i % 2 === 0;
                
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className={`relative flex items-center mb-12 last:mb-0 ${
                      isLeft ? 'flex-row' : 'flex-row-reverse'
                    }`}
                  >
                    {/* Точка на линии */}
                    <div className={`absolute left-1/2 transform -translate-x-1/2 z-10`}>
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${item.gradient} ring-4 ${
                        theme === 'dark' ? 'ring-gray-900' : 'ring-white'
                      }`} />
                    </div>

                    {/* Карточка */}
                    <div className={`w-1/2 ${isLeft ? 'pr-12' : 'pl-12'}`}>
                      <motion.div
                        whileHover={{ y: -5, scale: 1.02 }}
                        className={`relative overflow-hidden rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-500 ${
                          theme === 'dark'
                            ? 'bg-gray-800/80 backdrop-blur-sm border border-gray-700/50'
                            : 'bg-white border border-gray-200'
                        }`}
                        style={{
                          backgroundSize: '200% 200%',
                          animation: `gradient-shift ${8 + i}s ease infinite`
                        }}
                      >
                        {/* Пульсирующее свечение */}
                        <div
                            className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 hover:opacity-10 blur-xl transition-opacity duration-700 pointer-events-none`}
                            style={{
                              animation: `pulse-fade ${5 + i * 1.5}s ease-in-out infinite`,
                              animationDelay: `${i * 0.7}s`
                            }}
                        />

                        <div className="flex items-start gap-4">
                          {/* Иконка */}
                          <div className={`flex-shrink-0 p-3 rounded-xl bg-gradient-to-br ${item.gradient} text-white shadow-lg`}>
                            <Icon className="w-5 h-5" />
                          </div>

                          {/* Контент */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-lg font-black bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}>
                                {item.year}
                              </span>
                            </div>
                            <h3 className={`text-base font-bold mb-2 ${
                              theme === 'dark' ? 'text-white' : 'text-black'
                            }`}>
                              {item.title}
                            </h3>
                            <p className={`text-sm leading-relaxed ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className={`relative py-24 overflow-hidden overflow-x-hidden ${
            theme === 'dark'
                ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-900'
                : 'bg-gradient-to-b from-white via-gray-50 to-gray-50'
        }`}>
          {/* Top gradient overlay for smooth transition */}
          <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-b ${
              theme === 'dark' ? 'from-gray-950' : 'from-white'
          } to-transparent pointer-events-none`} />

          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-20">
            <div className={`absolute top-20 right-0 sm:top-40 sm:right-20 w-40 h-40 sm:w-60 sm:h-60 md:w-80 md:h-80 rounded-full blur-3xl ${
                theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-500/5'
            }`}></div>
            <div className={`absolute bottom-20 left-0 sm:bottom-40 sm:left-20 w-40 h-40 sm:w-60 sm:h-60 md:w-80 md:h-80 rounded-full blur-3xl ${
                theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-500/5'
            }`}></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
              <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 mb-4 backdrop-blur-sm ${
                  theme === 'dark'
                      ? 'bg-purple-900/30 text-purple-400 border border-purple-800/30'
                      : 'bg-purple-100 text-purple-600 border border-purple-200'
              }`}>
                <Target className="w-4 h-4"/>
                <span className="text-sm font-medium">Наша миссия и приоритеты</span>
              </div>
              <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
                  theme === 'dark' ? 'text-white' : 'text-black'
              }`}>
                Мы стремимся к созданию безопасных и надежных пространств
              </h2>
              <p className={`text-xl max-w-3xl mx-auto ${
                  theme === 'dark' ? 'text-white/90' : 'text-black/90'
              }`}>
                Используем передовые технологии и лучшие практики в строительной отрасли по всей России
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Users className="w-8 h-8" />,
                  title: "Кадровая политика",
                  description: "К выполнению работ допускаются профильные специалисты с опытом в конкретном направлении",
                  gradient: "from-blue-500 to-cyan-500",
                  bgGradient: "from-blue-900/30 to-cyan-900/30"
                },
                {
                  icon: <Zap className="w-8 h-8" />,
                  title: "Курс на инновации",
                  description: "Мастера всегда в курсе новейших технологий и предлагают лучшие решения",
                  gradient: "from-purple-500 to-pink-500",
                  bgGradient: "from-purple-900/30 to-pink-900/30"
                },
                {
                  icon: <Shield className="w-8 h-8" />,
                  title: "Ответственность",
                  description: "Построенные объекты рассчитаны на десятилетия эксплуатации без капитального ремонта",
                  gradient: "from-orange-500 to-red-500",
                  bgGradient: "from-orange-900/30 to-red-900/30"
                },
                {
                  icon: <HardHat className="w-8 h-8" />,
                  title: "Автономность",
                  description: "Всё спецоборудование, транспорт и инструменты являются собственностью компании",
                  gradient: "from-green-500 to-emerald-500",
                  bgGradient: "from-green-900/30 to-emerald-900/30"
                },
                {
                  icon: <Award className="w-8 h-8" />,
                  title: "Безупречное качество",
                  description: "Акты выполнения работ сопровождаются фото- и видеоматериалами",
                  gradient: "from-indigo-500 to-blue-500",
                  bgGradient: "from-indigo-900/30 to-blue-900/30"
                },
                {
                  icon: <Target className="w-8 h-8" />,
                  title: "Индивидуальный подход",
                  description: "Разрабатываем решения под конкретные задачи и особенности вашего объекта",
                  gradient: "from-amber-500 to-orange-500",
                  bgGradient: "from-amber-900/30 to-orange-900/30"
                }
              ].map((item, i) => (
                  <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="group relative"
                  >
                    {/* Pulsing glow effect */}
                    <div
                        className={`absolute inset-0 rounded-[2rem] bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500 pointer-events-none`}
                        style={{
                          animation: `pulse ${2 + i * 0.5}s cubic-bezier(0.4, 0, 0.6, 1) infinite`
                        }}
                    />

                    {/* Main card */}
                    <div className={`relative overflow-hidden rounded-[2rem] p-8 h-full transition-all duration-500 shadow-xl hover:shadow-2xl border hover:border-transparent ${
                        theme === 'dark'
                            ? `bg-gradient-to-br ${item.bgGradient} border-gray-700/50`
                            : `bg-white border-gray-200`
                    }`}
                         style={{
                           backgroundSize: "200% 200%",
                           animation: `gradient-shift ${3 + i * 0.7}s ease infinite`
                         }}>
                      {/* Icon container */}
                      <div className="relative mb-6">
                        <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${item.gradient} shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 text-white ${
                          theme === 'light' ? 'bg-gray-800' : ''
                        }`}>
                          {item.icon}
                        </div>
                        {/* Small decorative dots */}
                        <div className="absolute -bottom-2 -right-2 flex gap-1">
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${item.gradient} opacity-60`} />
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${item.gradient} opacity-40`} />
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className={`text-xl font-black mb-4 tracking-tight ${
                          theme === 'dark' ? 'text-white' : 'text-black'
                      }`}>
                        {item.title}
                      </h3>

                      {/* Description */}
                      <p className={`leading-relaxed text-base ${
                          theme === 'dark' ? 'text-white/90' : 'text-black/90'
                      }`}>
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Regional Presence Section */}
        <section className="relative py-12">
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className={`relative overflow-hidden rounded-[2rem] p-8 md:p-10 shadow-2xl ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white'
                  : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-black'
              }`}>
                {/* Decorative elements */}
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />

                {/* Content */}
                <div className="relative z-10">
                  <div className="text-center mb-12">
                    <div className={`inline-flex items-center gap-2 backdrop-blur-sm rounded-full px-4 py-2 mb-4 border ${
                      theme === 'dark'
                        ? 'bg-white/20 border-white/30 text-white'
                        : 'bg-white/50 border-gray-300 text-black'
                    }`}>
                      <Globe2 className="w-4 h-4" />
                      <span className="text-sm font-medium">География присутствия</span>
                    </div>
                    <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black mb-6 ${
                      theme === 'dark' ? 'text-white' : 'text-black'
                    }`}>
                      Работаем по всей России
                    </h2>
                    <p className={`text-lg md:text-xl max-w-3xl mx-auto ${
                      theme === 'dark' ? 'text-white/90' : 'text-gray-700'
                    }`}>
                      Успешно реализуем проекты в различных регионах Российской Федерации
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      {
                        region: "Северо-Западный ФО",
                        icon: <Warehouse className="w-8 h-8" />,
                        cities: ["Санкт-Петербург", "Ленинградская область", "Мурманск", "Архангельск"],
                        color: "from-blue-500 to-cyan-500"
                      },
                      {
                        region: "Центральный ФО",
                        icon: <Building2 className="w-8 h-8" />,
                        cities: ["Москва", "Московская область", "Тверь", "Ярославль"],
                        color: "from-purple-500 to-pink-500"
                      },
                      {
                        region: "Другие регионы",
                        icon: <Network className="w-8 h-8" />,
                        cities: ["Южный ФО", "Приволжский ФО", "Уральский ФО", "Сибирский ФО"],
                        color: "from-green-500 to-emerald-500"
                      }
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -5 }}
                        className={`rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 ${
                          theme === 'dark'
                            ? 'bg-white/10 backdrop-blur-sm border border-white/20'
                            : 'bg-white/70 backdrop-blur-sm border border-gray-200'
                        }`}
                      >
                        <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${item.color} mb-6 shadow-lg`}>
                          {item.icon}
                        </div>
                        <h3 className={`text-xl font-bold mb-4 ${
                          theme === 'dark' ? 'text-white' : 'text-black'
                        }`}>
                          {item.region}
                        </h3>
                        <ul className="space-y-2">
                          {item.cities.map((city, j) => (
                            <li key={j} className="flex items-center gap-2">
                              <MapPin className={`w-4 h-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                              <span className={theme === 'dark' ? 'text-white/90' : 'text-black/90'}>{city}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
        <section className="relative py-8">
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-4 backdrop-blur-sm bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/30">
                <Award className="w-4 h-4" />
                <span className="text-sm font-medium">Наши ценности</span>
              </div>
              <h2 className={`text-4xl md:text-5xl font-black mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-black'
              }`}>
                Принципы нашей работы
              </h2>
              <p className={`text-xl max-w-3xl mx-auto ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Руководствуемся принципами, которые обеспечивают качество и надежность в каждой работе
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {[
                {
                  icon: <Shield className="w-8 h-8" />,
                  title: "Безопасность",
                  description: "Приоритет безопасности в каждом проекте",
                  gradient: "from-blue-500 to-cyan-500",
                  bgGradient: "from-blue-900/30 to-cyan-900/30"
                },
                {
                  icon: <Award className="w-8 h-8" />,
                  title: "Качество",
                  description: "Соблюдение всех стандартов и норм",
                  gradient: "from-purple-500 to-pink-500",
                  bgGradient: "from-purple-900/30 to-pink-900/30"
                },
                {
                  icon: <Clock className="w-8 h-8" />,
                  title: "Надежность",
                  description: "Гарантия на все виды работ от 2 до 5 лет",
                  gradient: "from-orange-500 to-red-500",
                  bgGradient: "from-orange-900/30 to-red-900/30"
                },
                {
                  icon: <Users className="w-8 h-8" />,
                  title: "Команда",
                  description: "Опытные специалисты с профильным образованием",
                  gradient: "from-green-500 to-emerald-500",
                  bgGradient: "from-green-900/30 to-emerald-900/30"
                }
              ].map((value, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -12, scale: 1.03 }}
                  className="group relative"
                >
                  {/* Pulsing glow effect */}
                  <div
                    className={`absolute inset-0 rounded-[2rem] bg-gradient-to-r ${value.gradient} opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500 pointer-events-none`}
                    style={{
                      animation: `pulse ${2 + i * 0.5}s cubic-bezier(0.4, 0, 0.6, 1) infinite`
                    }}
                  />

                  {/* Main card */}
                  <div className={`relative overflow-hidden rounded-[2rem] p-8 h-full flex flex-col transition-all duration-500 shadow-xl hover:shadow-2xl border hover:border-transparent ${
                    theme === 'dark'
                      ? `bg-gradient-to-br ${value.bgGradient} border-gray-700/50`
                      : `bg-white border-gray-200`
                  }`}
                    style={{
                      backgroundSize: '200% 200%',
                      animation: `gradient-shift ${3 + i * 0.7}s ease infinite`
                    }}>
                    {/* Icon container */}
                    <div className="relative mb-6">
                      <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${value.gradient} shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ${
                        theme === 'dark' ? 'text-white' : 'text-black'
                      }`}>
                        {value.icon}
                      </div>
                      {/* Small decorative dots */}
                      <div className="absolute -bottom-2 -right-2 flex gap-1">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${value.gradient} opacity-60`} />
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${value.gradient} opacity-40`} />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className={`text-xl font-black mb-4 tracking-tight ${
                      theme === 'dark' ? 'text-white' : 'text-black'
                    }`}>
                      {value.title}
                    </h3>

                    {/* Description */}
                    <p className={`flex-grow leading-relaxed text-base ${
                      theme === 'dark' ? 'text-white' : 'text-black'
                    }`}>
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24">
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className={`relative overflow-hidden rounded-[2rem] p-8 md:p-10 shadow-2xl ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white'
                  : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-black'
              }`}>
                {/* Decorative elements */}
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />

                {/* Content */}
                <div className="relative z-10 text-center">
                  <div className={`inline-flex items-center gap-2 backdrop-blur-sm rounded-full px-4 py-2 mb-4 border ${
                    theme === 'dark'
                      ? 'bg-white/20 border-white/30 text-white'
                      : 'bg-white/50 border-gray-300 text-black'
                  }`}>
                    <Phone className="w-4 h-4" />
                    <span className="text-sm font-medium">Свяжитесь с нами</span>
                  </div>
                  <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black mb-6 ${
                    theme === 'dark' ? 'text-white' : 'text-black'
                  }`}>
                    Готовы начать сотрудничество?
                  </h2>

                  <p className={`text-lg md:text-xl max-w-3xl mx-auto mb-8 ${
                    theme === 'dark' ? 'text-white/90' : 'text-gray-700'
                  }`}>
                    Оставьте заявку и получите бесплатную консультацию от наших экспертов.
                    Мы поможем реализовать ваш проект в любом регионе России с учетом всех требований и пожеланий.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                      href="/contacts"
                      className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3.5 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                      <span>Обсудить проект</span>
                      <HardHat className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>

                    <a
                      href="/services"
                      className={`group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold border transition-all duration-300 ${
                        theme === 'dark'
                          ? 'bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20'
                          : 'bg-white/80 text-gray-900 border-gray-300 hover:bg-white'
                      }`}
                    >
                      <span>Наши услуги</span>
                      <Building2 className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
  );
};

export default CompanyShowcase;