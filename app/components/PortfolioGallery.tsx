import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import OptimizedImage from './OptimizedImage';
import {
  Shield,
  Building2,
  Award,
  Clock,
  Users,
  CheckCircle,
  ChevronRight,
  ArrowRight,
  MapPin,
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router';
import Breadcrumbs, { type BreadcrumbItem } from './Breadcrumbs';

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  location: string;
  year: string;
  category: string;
  imageUrl?: string;
}

interface PortfolioGalleryProps {
  breadcrumbs?: BreadcrumbItem[];
}

const PortfolioGallery: React.FC<PortfolioGalleryProps> = ({ breadcrumbs }) => {
  const { theme } = useTheme();
  const [activeFilter, setActiveFilter] = useState<'all' | 'construction' | 'maintenance' | 'security'>('all');


  // Данные для портфолио на основе информации с сайта
  const portfolioItems: PortfolioItem[] = [
    {
      id: 1,
      title: "Теплоизоляция технологического оборудования",
      description: "Выполняется качественная теплоизоляция различного технологического оборудования",
      location: "Северо-Запад России",
      year: "2022",
      category: "construction",
      imageUrl: "/img/portfolio/img1.jpeg"
    },
    {
      id: 2,
      title: "Установка и обвязка технологического оборудования",
      description: "Монтаж и подключение технологического оборудования с обвязкой систем трубопроводами и коммуникациями",
      location: "Ленинградская область",
      year: "2023",
      category: "construction",
      imageUrl: "/img/portfolio/img2.jpeg"
    },
    {
      id: 3,
      title: "Устройство и монтаж площадок обслуживания",
      description: "Создание специализированных площадок для обслуживания оборудования",
      location: "Выборгский район",
      year: "2022",
      category: "construction",
      imageUrl: "/img/portfolio/img3.jpeg"
    },
    {
      id: 4,
      title: "Установка системы откачки сточных вод",
      description: "Монтаж систем водоотведения и откачки сточных вод, ремонт фундамента технологического оборудования",
      location: "Ленинградская область",
      year: "2025",
      category: "maintenance",
      imageUrl: "/img/portfolio/img4.jpeg"
    },
    {
      id: 5,
      title: "Строительство ангара для обслуживания большегрузных автомобилей",
      description: "Возведение специализированных ангаров для технического обслуживания тяжелой техники",
      location: "Северо-Запад России",
      year: "2022",
      category: "construction",
      imageUrl: "/img/portfolio/img5.jpeg"
    },
    {
      id: 6,
      title: "Ремонт мазутного резервуара V = 5000 м³",
      description: "Замена днища и первого пояса обечайки резервуара объемом 5000 кубических метров",
      location: "Ленинградская область",
      year: "2024",
      category: "maintenance",
      imageUrl: "/img/portfolio/img6.jpeg"
    },
    {
      id: 7,
      title: "Ремонт фундамента технологического оборудования",
      description: "Ремонт фундамента технологического оборудования — это комплекс мероприятий по восстановлению несущей способности и геометрических параметров основания.",
      location: "Ленинградская область",
      year: "2025",
      category: "maintenance",
      imageUrl: "/img/portfolio/img7.jpeg"
    },
    {
      id: 8,
      title: "Система защиты периметра от БПЛА",
      description: "Установка современной системы защиты периметра от беспилотных летательных аппаратов",
      location: "Ленинградская область",
      year: "2023",
      category: "security",
      imageUrl: "https://static.tildacdn.com/tild6133-3863-4939-a562-636333646437/4-9.jpg"
    },
    {
      id: 9,
      title: "Монтаж металлических конструкций",
      description: "Изготовление и монтаж металлических конструкций для промышленного объекта",
      location: "Выборгский район",
      year: "2024",
      category: "construction",
      imageUrl: "/img/portfolio/img9.jpeg"
    }
  ];

  // Фильтруем проекты по категории
  const filteredProjects = activeFilter === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(project => project.category === activeFilter);

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full flex items-center">
        {/* Content */}
        <div className="relative container mx-auto px-4 z-10">
          {/* Хлебные крошки */}
          {breadcrumbs && (
            <div className="py-4">
              <Breadcrumbs breadcrumbs={breadcrumbs} className="text-gray-600 dark:text-gray-400" />
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
                <Award className="w-4 h-4" />
                <span className="text-sm font-medium">100+ успешно завершенных проектов</span>
              </motion.div>

              {/* Main heading */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black ${
                  theme === 'dark' ? 'text-white' : 'text-black'
                }`}
              >
                <span className="block">Наши</span>
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Проекты
                </span>
                <span className="block">и реализации</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`text-lg md:text-xl max-w-2xl ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Более 100 успешно реализованных проектов по всей Ленинградской области и Северо-Западному региону.
                Каждый проект выполнен с соблюдением всех норм и стандартов качества.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Link
                  to="/contacts"
                  className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3.5 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <span>Обсудить проект</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/contacts"
                  className={`group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold border transition-all duration-300 ${
                    theme === 'dark'
                      ? 'bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20'
                      : 'bg-white/80 backdrop-blur-sm text-gray-900 border-gray-300 hover:bg-white'
                  }`}
                >
                  <span>Оставить заявку</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
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
                  title: "Защита периметра",
                  description: "Современные системы защиты от БПЛА",
                  gradient: "from-blue-500 to-cyan-500",
                  bgGradient: "from-blue-900/30 to-cyan-900/30"
                },
                {
                  icon: <Building2 className="w-6 h-6" />,
                  title: "Строительство",
                  description: "Полный цикл от фундамента до отделки",
                  gradient: "from-purple-500 to-pink-500",
                  bgGradient: "from-purple-900/30 to-pink-900/30"
                },
                {
                  icon: <Award className="w-6 h-6" />,
                  title: "Качество работ",
                  description: "Соблюдение всех нормативов и сроков",
                  gradient: "from-orange-500 to-red-500",
                  bgGradient: "from-orange-900/30 to-red-900/30"
                },
                {
                  icon: <Clock className="w-6 h-6" />,
                  title: "Скорость",
                  description: "Оперативное выполнение задач",
                  gradient: "from-green-500 to-emerald-500",
                  bgGradient: "from-green-900/30 to-emerald-900/30"
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
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
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
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="relative py-8">
        <div className="container mx-auto px-4 relative z-10">
          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {[
              { id: 'all', label: 'Все проекты' },
              { id: 'construction', label: 'Строительство' },
              { id: 'maintenance', label: 'Обслуживание' },
              { id: 'security', label: 'Безопасность' }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id as any)}
                className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300 text-sm ${
                  activeFilter === filter.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                    : theme === 'dark'
                    ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-800 border border-gray-700'
                    : 'bg-white/80 text-gray-700 hover:bg-white border border-gray-300'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Portfolio Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ y: -4, scale: 1.03 }}
                className="group relative"
              >
                {/* Card */}
                <div className="relative h-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800/40 dark:to-gray-800/20 backdrop-blur-md border border-gray-300 dark:border-gray-700/50 rounded-xl overflow-hidden hover:border-blue-400/60 hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300">
                  {/* Image */}
                  <div className="relative h-28 sm:h-32 overflow-hidden">
                    {project.imageUrl ? (
                      <OptimizedImage
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        width={400}
                        height={300}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                        <Building2 className="w-12 h-12 text-white opacity-50" />
                      </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-2 left-2 z-20">
                      <div className="bg-blue-600/90 dark:bg-white/90 backdrop-blur-sm text-white dark:text-gray-900 text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-md border border-white/20 dark:border-gray-300 shadow-lg">
                        {project.category === 'construction' ? 'Строительство' : 
                         project.category === 'maintenance' ? 'Обслуживание' : 'Безопасность'}
                      </div>
                    </div>

                    {/* Year Badge */}
                    <div className="absolute top-2 right-2 z-20">
                      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-900 dark:text-white text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-md border border-gray-300 dark:border-gray-600 shadow-lg">
                        {project.year}
                      </div>
                    </div>

                    {/* Arrow Icon */}
                    <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:rotate-45">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                        <ArrowUpRight className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-3.5 space-y-2">
                    {/* Title */}
                    <h3 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-black group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 leading-tight transition-colors">
                      {project.title}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                      <MapPin className="w-3 h-3" />
                      <span className="text-[10px] sm:text-xs truncate">{project.location}</span>
                    </div>

                    {/* Learn More */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-[10px] sm:text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                        Подробнее
                      </span>
                      <ChevronRight className="w-3 h-3 text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-purple-600/0 to-pink-600/0 group-hover:from-blue-600/15 group-hover:via-purple-600/15 group-hover:to-pink-600/15 transition-all duration-500 pointer-events-none" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-8">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Безопасность",
                description: "Соблюдение всех норм безопасности",
                gradient: "from-blue-500 to-cyan-500",
                bgGradient: "from-blue-900/30 to-cyan-900/30"
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: "Сроки",
                description: "Соблюдение сроков сдачи",
                gradient: "from-purple-500 to-pink-500",
                bgGradient: "from-purple-900/30 to-pink-900/30"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Команда",
                description: "Опытных специалистов",
                gradient: "from-orange-500 to-red-500",
                bgGradient: "from-orange-900/30 to-red-900/30"
              },
              {
                icon: <CheckCircle className="w-8 h-8" />,
                title: "Качество",
                description: "Гарантия на все работы",
                gradient: "from-green-500 to-emerald-500",
                bgGradient: "from-green-900/30 to-emerald-900/30"
              }
            ].map((item, i) => (
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
                  className={`absolute inset-0 rounded-[2rem] bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500 pointer-events-none`}
                  style={{
                    animation: `pulse ${2 + i * 0.5}s cubic-bezier(0.4, 0, 0.6, 1) infinite`
                  }}
                />

                {/* Main card */}
                <div className={`relative overflow-hidden rounded-[2rem] p-8 h-full flex flex-col transition-all duration-500 shadow-xl hover:shadow-2xl border hover:border-transparent ${
                  theme === 'dark'
                    ? `bg-gradient-to-br ${item.bgGradient} border-gray-700/50`
                    : `bg-white border-gray-200`
                }`}
                  style={{
                    backgroundSize: '200% 200%',
                    animation: `gradient-shift ${3 + i * 0.7}s ease infinite`
                  }}>
                  {/* Icon container */}
                  <div className="relative mb-6">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${item.gradient} shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ${
                      theme === 'dark' ? 'text-white' : 'text-black'
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
                  <p className={`flex-grow leading-relaxed text-base ${
                    theme === 'dark' ? 'text-white' : 'text-black'
                  }`}>
                    {item.description}
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
                <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black mb-6 ${
                  theme === 'dark' ? 'text-white' : 'text-black'
                }`}>
                  Готовы реализовать свой проект?
                </h2>

                <p className={`text-lg md:text-xl max-w-3xl mx-auto mb-8 ${
                  theme === 'dark' ? 'text-white/90' : 'text-gray-700'
                }`}>
                  Обратитесь к нашим специалистам и получите консультацию по реализации вашего проекта.
                  Мы предложим оптимальное решение с учетом всех ваших требований.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    to="/contacts"
                    className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3.5 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    <span>Начать проект</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    to="/contacts"
                    className={`group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold border transition-all duration-300 ${
                      theme === 'dark'
                        ? 'bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20'
                        : 'bg-white/80 text-gray-900 border-gray-300 hover:bg-white'
                    }`}
                  >
                    <span>Оставить заявку</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PortfolioGallery;