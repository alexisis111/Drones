import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import {
  Shield,
  Clock,
  Award,
  Zap,
  Users,
  CheckCircle,
  ArrowRight,
  Briefcase,
  Phone,
  MapPin,
  BriefcaseBusiness,
  Target,
  Building2,
  Globe2
} from 'lucide-react';
import { Link } from 'react-router';
import Breadcrumbs, { type BreadcrumbItem } from './Breadcrumbs';

interface Vacancy {
  id: number;
  position: string;
  department: string;
  requirements: string[];
  conditions: string[];
  contact: string;
  salary?: string;
  imageUrl: string;
}

interface VacanciesGalleryProps {
  breadcrumbs?: BreadcrumbItem[];
}

const VacanciesGallery: React.FC<VacanciesGalleryProps> = ({ breadcrumbs }) => {
  const { theme } = useTheme();

  const vacancies: Vacancy[] = [
    {
      id: 1,
      position: "Электрогазосварщик",
      department: "Производственный отдел",
      requirements: [
        "Опыт работы от двух лет",
        "Наличие документов, подтверждающих квалификацию",
        "Комплект документов для оформления по ТК РФ"
      ],
      conditions: [
        "Пятидневная рабочая неделя, полная занятость",
        "Официальное оформление по ТК РФ",
        "Корпоративная связь",
        "Обучение и развитие",
        "Своевременная выплата заработной платы"
      ],
      contact: "+7 921 591-65-06",
      salary: "По договоренности",
      imageUrl: "data:image/jpeg;base64,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"
    },
    {
      id: 2,
      position: "Отделочник",
      department: "Производственный отдел",
      requirements: [
        "Наличие документов, подтверждающих квалификацию",
        "Комплект документов для оформления по ТК РФ"
      ],
      conditions: [
        "Пятидневная рабочая неделя, полная занятость",
        "Официальное оформление по ТК РФ",
        "Корпоративная связь",
        "Обучение и развитие",
        "Своевременная выплата заработной платы"
      ],
      contact: "+7 921 591-65-06",
      salary: "По договоренности",
      imageUrl: "https://resizer.mail.ru/p/a303ee0e-46ad-5055-b1c3-145c8d833d08/AQAGPEIfo6po6-UjYkvPJn_dB71FH8Sl-L5i1huO1kpaphQKkIFBA3nEptN1yUwG2EBemdMJCp0fuSE4l_LGjmiXX7s.jpg"
    },
    {
      id: 3,
      position: "Слесарь-монтажник",
      department: "Производственный отдел",
      requirements: [
        "Наличие документов, подтверждающих квалификацию",
        "Комплект документов для оформления по ТК РФ"
      ],
      conditions: [
        "Пятидневная рабочая неделя, полная занятость",
        "Официальное оформление по ТК РФ",
        "Корпоративная связь",
        "Обучение и развитие",
        "Своевременная выплата заработной платы"
      ],
      contact: "+7 921 591-65-06",
      salary: "По договоренности",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVbbGppYNWG8niGabZcxsRyJ5LNZY23CCSOA&s"
    },
    {
      id: 4,
      position: "Подсобный рабочий",
      department: "Производственный отдел",
      requirements: [
        "Комплект документов для оформления по ТК РФ"
      ],
      conditions: [
        "Пятидневная рабочая неделя, полная занятость",
        "Официальное оформление по ТК РФ",
        "Корпоративная связь",
        "Обучение и развитие",
        "Своевременная выплата заработной платы"
      ],
      contact: "+7 921 591-65-06",
      salary: "По договоренности",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQy4oc7yBxLnGgrYR48E1D6HYeAlDR63b8TOw&s"
    },
    {
      id: 5,
      position: "Специалист по монтажу пожарной безопасности",
      department: "Производственный отдел",
      requirements: [
        "Опыт работы",
        "Наличие документов, подтверждающих квалификацию",
        "Комплект документов для оформления по ТК РФ"
      ],
      conditions: [
        "Пятидневная рабочая неделя, полная занятость",
        "Официальное оформление по ТК РФ",
        "Корпоративная связь",
        "Обучение и развитие",
        "Своевременная выплата заработной платы"
      ],
      contact: "+7 921 591-65-06",
      salary: "По договоренности",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUPJ7_shE0iE1S63QlIqGJ3FxNAKtMUnvdDw&s"
    }
  ];

  return (
      <div className="relative overflow-hidden">
        {/* Hero Section */}
        <section className="relative w-full flex items-center">
          <div className="relative container mx-auto px-4 z-10">
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
                  <Briefcase className="w-4 h-4" />
                  <span className="text-sm font-medium">Присоединяйтесь к нашей команде</span>
                </motion.div>

                {/* Main heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black"
                >
                  <div className={theme === 'dark' ? 'text-white' : 'text-black'}>Открытые</div>
                  <div className={theme === 'dark' ? 'text-white' : 'text-black'}>Вакансии</div>
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                    в нашей компании
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
                  Мы всегда рады новым талантливым специалистам. Присоединяйтесь к нашей команде
                  профессионалов и развивайтесь вместе с нами.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4"
                >
                  <Link
                      to="/contacts"
                      className={`group inline-flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 text-white px-4 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 text-xs sm:text-sm md:text-base ${
                          theme === 'dark'
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                              : 'bg-gradient-to-r from-blue-600 to-purple-600'
                      }`}
                  >
                    <span>Связаться с нами</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </Link>

                  <a
                      href="tel:+79215916506"
                      className={`group inline-flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 px-4 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-xl font-semibold border transition-all duration-300 text-xs sm:text-sm md:text-base ${
                          theme === 'dark'
                              ? 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700 hover:border-gray-600'
                              : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                      }`}
                  >
                    <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                    <span>+7 921 591-65-06</span>
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
                    title: "Официальное трудоустройство",
                    description: "Оформление по ТК РФ",
                    gradient: "from-blue-500 to-cyan-500",
                    bgGradient: "from-blue-900/30 to-cyan-900/30"
                  },
                  {
                    icon: <Clock className="w-6 h-6" />,
                    title: "График работы",
                    description: "Пятидневная рабочая неделя",
                    gradient: "from-purple-500 to-pink-500",
                    bgGradient: "from-purple-900/30 to-pink-900/30"
                  },
                  {
                    icon: <Award className="w-6 h-6" />,
                    title: "Развитие",
                    description: "Обучение и карьерный рост",
                    gradient: "from-orange-500 to-red-500",
                    bgGradient: "from-orange-900/30 to-red-900/30"
                  },
                  {
                    icon: <Zap className="w-6 h-6" />,
                    title: "Стабильность",
                    description: "Своевременная зарплата",
                    gradient: "from-green-500 to-emerald-500",
                    bgGradient: "from-green-900/30 to-emerald-900/30"
                  }
                ].map((benefit, i) => (
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
                          className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${benefit.gradient} blur-xl pointer-events-none`}
                          style={{
                            opacity: 0.3,
                            animation: `pulse-fade ${5 + i * 1.5}s ease-in-out infinite`,
                            animationDelay: `${i * 0.7}s`
                          }}
                      />

                      <div className={`relative overflow-hidden rounded-2xl p-5 transition-all duration-700 shadow-lg hover:shadow-xl border hover:border-transparent ${
                        theme === 'dark'
                            ? `bg-gradient-to-br ${benefit.bgGradient} border-gray-700/50`
                            : `bg-white border-gray-200`
                      }`}
                        style={{
                          backgroundSize: '200% 200%',
                          animation: `gradient-shift ${8 + i * 2}s ease infinite`,
                          animationDelay: `${i * 0.5}s`
                        }}>
                        <div className="flex items-start gap-4">
                          <div className={`flex-shrink-0 p-3 rounded-xl bg-gradient-to-br ${benefit.gradient} shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                            {benefit.icon}
                          </div>
                          <div>
                            <h3 className={`text-base font-bold mb-1 ${
                              theme === 'dark' ? 'text-white' : 'text-black'
                            }`}>{benefit.title}</h3>
                            <p className={`text-sm ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>{benefit.description}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Vacancies Section */}
        <section className={`relative py-16 overflow-hidden ${
          theme === 'dark'
              ? 'bg-neutral-900'
              : 'bg-white'
        }`}>
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
                          ? 'bg-neutral-900 border border-white'
                          : 'bg-white border border-gray'
                  }`}>
                <BriefcaseBusiness className="w-4 h-4"/>
                <span className="text-sm font-medium">Трудоустройство</span>
              </div>
              <h2 className={`text-3xl md:text-4xl lg:text-5xl font-black mb-6 ${
                  theme === 'dark' ? 'text-white' : 'text-black'
              }`}>
                Доступные вакансии
              </h2>
              <p className={`text-lg md:text-xl max-w-3xl mx-auto ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Узнайте о текущих возможностях трудоустройства в нашей компании
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {vacancies.map((vacancy, index) => (
                  <motion.div
                      key={vacancy.id}
                      initial={{opacity: 0, y: 30}}
                      whileInView={{opacity: 1, y: 0}}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -12, scale: 1.03 }}
                      className="group relative"
                  >
                    {/* Pulsing glow effect */}
                    <div
                        className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500 pointer-events-none"
                    />

                    <div className={`relative overflow-hidden rounded-[2rem] transition-all duration-500 shadow-xl hover:shadow-2xl border hover:border-transparent ${
                      theme === 'dark'
                        ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700/50'
                        : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
                    }`}
                      style={{
                        backgroundSize: '200% 200%',
                        animation: `gradient-shift 5s ease infinite`
                      }}>
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                            src={vacancy.imageUrl}
                            alt={vacancy.position}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/img/vacancies/default.jpeg';
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                        {/* Badge */}
                        <div className="absolute top-4 left-4">
                          <span className="bg-blue-600/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/20 shadow-lg">
                            Активная вакансия
                          </span>
                        </div>

                        {/* Salary Badge */}
                        {vacancy.salary && (
                            <div className="absolute top-4 right-4">
                              <span className="bg-green-500/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/20 shadow-lg">
                                {vacancy.salary}
                              </span>
                            </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="mb-4">
                          <h3 className={`text-xl font-black mb-2 ${
                            theme === 'dark' ? 'text-white' : 'text-black'
                          }`}>
                            {vacancy.position}
                          </h3>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                          }`}>
                            {vacancy.department}
                          </p>
                        </div>

                        {/* Requirements */}
                        <div className="mb-4">
                          <h4 className={`text-xs font-semibold mb-2 uppercase tracking-wide ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            Требования:
                          </h4>
                          <ul className="space-y-1">
                            {vacancy.requirements.slice(0, 2).map((req, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                                    theme === 'dark' ? 'text-green-400' : 'text-green-500'
                                  }`} />
                                  <span className={`text-sm ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                  }`}>{req}</span>
                                </li>
                            ))}
                          </ul>
                        </div>

                        {/* Conditions */}
                        <div className="mb-6">
                          <h4 className={`text-xs font-semibold mb-2 uppercase tracking-wide ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            Условия:
                          </h4>
                          <ul className="space-y-1">
                            {vacancy.conditions.slice(0, 2).map((cond, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                                    theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
                                  }`} />
                                  <span className={`text-sm ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                  }`}>{cond}</span>
                                </li>
                            ))}
                          </ul>
                        </div>

                        {/* Contact & Apply */}
                        <div className="flex flex-col gap-3">
                          <div className={`flex items-center text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            <Phone className="w-4 h-4 mr-2" />
                            <span>{vacancy.contact}</span>
                          </div>
                          <Link
                              to="/contacts"
                              className="w-full text-center py-3 px-4 rounded-xl font-semibold transition-all bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-lg"
                          >
                            Откликнуться
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className={`relative py-16 overflow-hidden ${
          theme === 'dark'
              ? 'bg-neutral-900'
              : 'bg-white'
        }`}>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
            >
              <div
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 mb-4 backdrop-blur-sm ${
                      theme === 'dark'
                          ? 'bg-purple-900/30 text-purple-400 border border-purple-800/30'
                          : 'bg-purple-100 text-purple-600 border border-purple-200'
                  }`}>
                <Award className="w-4 h-4"/>
                <span className="text-sm font-medium">Преимущества</span>
              </div>
              <h2 className={`text-3xl md:text-4xl lg:text-5xl font-black mb-6 ${
                  theme === 'dark' ? 'text-white' : 'text-black'
              }`}>
                Почему стоит работать у нас?
              </h2>
              <p className={`text-lg md:text-xl max-w-3xl mx-auto ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Мы создаем комфортные условия для работы и развития каждого сотрудника
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {[
                {
                  icon: <Shield className="w-8 h-8" />,
                  title: "Официальное трудоустройство",
                  description: "Оформление по ТК РФ с первого дня",
                  gradient: "from-blue-500 to-cyan-500",
                  bgGradient: "from-blue-900/30 to-cyan-900/30"
                },
                {
                  icon: <Clock className="w-8 h-8" />,
                  title: "Гибкий график",
                  description: "Пятидневная рабочая неделя",
                  gradient: "from-purple-500 to-pink-500",
                  bgGradient: "from-purple-900/30 to-pink-900/30"
                },
                {
                  icon: <Award className="w-8 h-8" />,
                  title: "Развитие",
                  description: "Обучение и карьерный рост",
                  gradient: "from-orange-500 to-red-500",
                  bgGradient: "from-orange-900/30 to-red-900/30"
                },
                {
                  icon: <Users className="w-8 h-8" />,
                  title: "Команда",
                  description: "Дружный коллектив профессионалов",
                  gradient: "from-green-500 to-emerald-500",
                  bgGradient: "from-green-900/30 to-emerald-900/30"
                }
              ].map((benefit, i) => (
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
                        className={`absolute inset-0 rounded-[2rem] bg-gradient-to-r ${benefit.gradient} opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500 pointer-events-none`}
                        style={{
                          animation: `pulse ${2 + i * 0.5}s cubic-bezier(0.4, 0, 0.6, 1) infinite`
                        }}
                    />

                    {/* Main card */}
                    <div className={`relative overflow-hidden rounded-[2rem] p-8 h-full flex flex-col transition-all duration-500 shadow-xl hover:shadow-2xl border hover:border-transparent ${
                      theme === 'dark'
                        ? `bg-gradient-to-br ${benefit.bgGradient} border-gray-700/50`
                        : `bg-white border-gray-200`
                    }`}
                      style={{
                        backgroundSize: '200% 200%',
                        animation: `gradient-shift ${3 + i * 0.7}s ease infinite`
                      }}>
                      {/* Icon container */}
                      <div className="relative mb-6">
                        <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${benefit.gradient} shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ${
                          theme === 'dark' ? 'text-white' : 'text-black'
                        }`}>
                          {benefit.icon}
                        </div>
                        {/* Small decorative dots */}
                        <div className="absolute -bottom-2 -right-2 flex gap-1">
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${benefit.gradient} opacity-60`} />
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${benefit.gradient} opacity-40`} />
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className={`text-xl font-black mb-4 tracking-tight ${
                        theme === 'dark' ? 'text-white' : 'text-black'
                      }`}>
                        {benefit.title}
                      </h3>

                      {/* Description */}
                      <p className={`flex-grow leading-relaxed text-base ${
                        theme === 'dark' ? 'text-white' : 'text-black'
                      }`}>
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={`relative py-24 overflow-hidden ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600'
            : 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500'
        }`}>
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-20 z-0">
            <div className="absolute top-20 left-20 w-60 h-60 rounded-full bg-white/10 blur-3xl animate-blob" />
            <div className="absolute bottom-20 right-20 w-60 h-60 rounded-full bg-white/10 blur-3xl animate-blob animation-delay-2000" />
            <div className="absolute top-1/2 left-1/2 w-60 h-60 rounded-full bg-white/10 blur-3xl animate-blob animation-delay-4000" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center"
            >
              <div className={`inline-flex items-center gap-2 backdrop-blur-sm rounded-full px-4 py-2 mb-4 border ${
                theme === 'dark'
                  ? 'bg-white/20 border-white/30'
                  : 'bg-black/10 border-black/20'
              }`}>
                <Briefcase className={`w-4 h-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}/>
                <span className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Не нашли подходящую вакансию?</span>
              </div>

              <h2 className={`text-3xl md:text-4xl lg:text-5xl font-black mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Отправьте нам свое резюме
              </h2>

              <p className={`text-lg md:text-xl max-w-3xl mx-auto mb-10 ${
                theme === 'dark' ? 'text-white/90' : 'text-gray-900'
              }`}>
                Мы обязательно с вами свяжемся, если появится подходящая должность.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                    to="/contacts"
                    className={`group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 ${
                      theme === 'dark'
                        ? 'bg-white text-gray-900'
                        : 'bg-gray-900 text-white'
                    }`}
                >
                  <span className={theme === 'dark' ? 'text-gray-900' : 'text-white'}>Отправить резюме</span>
                  <ArrowRight className="w-5 h-5"/>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
  );
};

export default VacanciesGallery;
