import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { Shield, Building2, Target, Zap, Award, Clock, Users, CheckCircle, ChevronRight, ArrowRight, MapPin, Calendar } from 'lucide-react';
import { Link } from 'react-router';

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  location: string;
  year: string;
  category: string;
  imageUrl?: string;
}

const PortfolioGallery: React.FC = () => {
  const { theme } = useTheme();
  const [scrollY, setScrollY] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeFilter, setActiveFilter] = useState<'all' | 'construction' | 'maintenance' | 'security'>('all');

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


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
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Optimized background with parallax effect */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-900 via-gray-900 to-purple-900"
        >
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('/img/homesImg/portfolio.jpeg')] bg-cover bg-center mix-blend-overlay opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-purple-600/10" />
          </div>
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-4 z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center py-32">
            {/* Left column - Main content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20"
              >
                <Award className="w-4 h-4" />
                <span className="text-sm font-medium text-white">100+ успешно завершенных проектов</span>
              </motion.div>

              {/* Main heading */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white"
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
                className="text-xl text-gray-300 max-w-2xl"
              >
                Более 100 успешно реализованных проектов по всей Ленинградской области и Северо-Западному региону. 
                Каждый проект выполнен с соблюдением всех норм и стандартов качества.
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {[
                  { value: "100+", label: "Проектов" },
                  { value: "12+", label: "Лет опыта" },
                  { value: "98%", label: "Удовлетворенность" },
                  { value: "2-5 лет", label: "Гарантия" },
                ].map((stat, i) => (
                  <div key={i} className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  to="/contacts"
                  className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <span>Обсудить проект</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/proposal"
                  className="group inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <span>Оставить заявку</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Right column - Feature cards */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-6"
            >
              {[
                {
                  icon: <Shield className="w-6 h-6" />,
                  title: "Защита периметра",
                  description: "Современные системы защиты от БПЛА",
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  icon: <Building2 className="w-6 h-6" />,
                  title: "Строительство",
                  description: "Полный цикл от фундамента до отделки",
                  color: "from-purple-500 to-pink-500"
                },
                {
                  icon: <Target className="w-6 h-6" />,
                  title: "Точность работ",
                  description: "Соблюдение всех нормативов и сроков",
                  color: "from-orange-500 to-red-500"
                },
                {
                  icon: <Zap className="w-6 h-6" />,
                  title: "Скорость",
                  description: "Оперативное выполнение задач",
                  color: "from-green-500 to-emerald-500"
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  whileHover={{ x: -10 }}
                  className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color}`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Наши проекты
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Ознакомьтесь с нашими реализованными проектами. Каждый из них является примером 
              высокого качества и профессионального подхода.
            </p>
          </motion.div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {[
              { id: 'all', label: 'Все проекты' },
              { id: 'construction', label: 'Строительство' },
              { id: 'maintenance', label: 'Обслуживание' },
              { id: 'security', label: 'Безопасность' }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id as any)}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  activeFilter === filter.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Portfolio Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-64 overflow-hidden">
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                      <Building2 className="w-12 h-12 text-white opacity-50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {project.year}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {project.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {project.description}
                  </p>

                  <div className="flex justify-between items-center mt-6">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{project.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{project.year}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Наши достижения
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Более 12 лет успешной работы на рынке строительных услуг
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Безопасность",
                value: "100%",
                description: "Соблюдение всех норм безопасности"
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: "Качество",
                value: "98%",
                description: "Удовлетворенность клиентов"
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: "Сроки",
                value: "95%",
                description: "Соблюдение сроков сдачи"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Команда",
                value: "50+",
                description: "Опытных специалистов"
              }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative text-center"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300">
                  <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white mb-6">
                    {stat.icon}
                  </div>
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.value}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {stat.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {stat.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Готовы реализовать свой проект?
            </h2>

            <p className="text-xl opacity-90 max-w-3xl mx-auto mb-12">
              Обратитесь к нашим специалистам и получите консультацию по реализации вашего проекта. 
              Мы предложим оптимальное решение с учетом всех ваших требований.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contacts"
                className="group inline-flex items-center justify-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <span>Начать проект</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/proposal"
                className="group inline-flex items-center justify-center gap-3 bg-transparent text-white px-8 py-4 rounded-xl font-semibold border-2 border-white hover:bg-white/10 transition-all duration-300"
              >
                <span>Оставить заявку</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PortfolioGallery;