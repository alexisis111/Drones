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
  Warehouse, AlertTriangle, CirclePile
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
    description: "ООО «ЛЕГИОН» - строительно-монтажная компания по всей России. Создаем безопасные и надежные пространства для промышленных, коммерческих и жилых объектов. Защищаем от наземных и воздушных угроз с помощью передовых технологий.",
    url: "https://xn--78-glchqprh.xn--p1ai/company",
    logo: "/Logo-1.png",
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
        <section className="relative min-h-[60vh] flex items-center overflow-hidden">
          {/* Background with parallax effect */}
          <motion.div
              className="absolute inset-0 bg-gradient-to-br from-blue-900 via-gray-900 to-purple-900"
          >
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[url('/img/homesImg/about_comp.jpeg')] bg-cover bg-center mix-blend-overlay opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-purple-600/10" />
            </div>
          </motion.div>

          {/* Content */}
          <div className="relative container mx-auto px-4 z-10">
            {/* Хлебные крошки */}
            {breadcrumbs && (
              <div className="py-4">
                <Breadcrumbs breadcrumbs={breadcrumbs} className="text-white/80" />
              </div>
            )}

            <div className="grid lg:grid-cols-2 gap-12 items-center py-8">
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
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium text-white">С 2012 года на рынке</span>
                </motion.div>

                {/* Main heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white"
                >
                  <span className="block">ООО «ЛЕГИОН»</span>
                  <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Надежность и качество
                </span>
                  <span className="block">в каждой детали</span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl text-gray-300 max-w-2xl"
                >
                  Строительно-монтажная компания с 12-летним опытом работы по всей России.
                  Создаем безопасные и надежные пространства для промышленных, коммерческих
                  и жилых объектов. Защищаем от наземных и воздушных угроз с помощью передовых технологий.
                </motion.p>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                  {[
                    { value: "12+", label: "Лет опыта" },
                    { value: "150+", label: "Проектов" },
                    { value: "2-5 лет", label: "Гарантия" },
                    { value: "Вся Россия", label: "География" },
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
                  <a
                      href="#history"
                      className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    <span>Узнать больше</span>
                    <HardHat className="w-5 h-5" />
                  </a>

                  <a
                      href="#services"
                      className="group inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300"
                  >
                    <span>Наши услуги</span>
                    <Building2 className="w-5 h-5" />
                  </a>
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
                    title: "Ассоциация \"СК ЛО\"",
                    description: "Членство в саморегулируемой организации",
                    color: "from-blue-500 to-cyan-500"
                  },
                  {
                    icon: <Shield className="w-6 h-6" />,
                    title: "Ассоциация СРО \"ОсноваПроект\"",
                    description: "Членство в саморегулируемой организации",
                    color: "from-blue-500 to-cyan-500"
                  },
                  {
                    icon: <Target className="w-6 h-6" />,
                    title: "Точность работ",
                    description: "Соблюдение всех нормативов и сроков",
                    color: "from-purple-500 to-pink-500"
                  },
                  {
                    icon: <Zap className="w-6 h-6" />,
                    title: "Скорость",
                    description: "Оперативное выполнение задач",
                    color: "from-orange-500 to-red-500"
                  },
                  {
                    icon: <Globe2 className="w-6 h-6" />,
                    title: "География",
                    description: "Работаем по всей России",
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

          {/* Bottom Gradient Fade for smooth transition */}
          <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-b from-transparent via-gray-900/30 to-gray-50 dark:via-gray-900/50 dark:to-gray-900 pointer-events-none" />
        </section>

        {/* Company History Section */}
        <section id="history" className="relative py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black overflow-hidden">
          {/* Top gradient overlay for smooth transition */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-50 dark:from-gray-900 to-transparent pointer-events-none" />
          
          {/* Декоративные элементы фона */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
                initial={{opacity: 0, y: 50}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                className="text-center mb-16"
            >
              <div
                  className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full px-4 py-2 mb-4">
                <CirclePile className="w-4 h-4"/>
                <span className="text-sm font-medium">История компании</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Путь к успеху
              </h2>
            </motion.div>

            <div className="max-w-5xl mx-auto">
              {/* Мобильная версия (до md) - вертикальная хронология */}
              <div className="block md:hidden space-y-6">
                {[
                  {
                    year: "2012",
                    title: "Основание компании",
                    description: "Компания начала свою деятельность 12 ноября 2012 года, специализируясь на строительно-монтажных работах. С первых лет работы мы зарекомендовали себя как надежный партнер в строительной отрасли.",
                    icon: "🏢",
                    color: "from-blue-500 to-cyan-500"
                  },
                  {
                    year: "2017",
                    title: "Членство в СРО",
                    description: "Компания стала членом саморегулируемых организаций - Ассоциация \"Строительный комплекс Ленинградской области\" (Ассоциация \"СК ЛО\") и Ассоциация СРО \"ОсноваПроект\", что позволило расширить спектр предоставляемых услуг.",
                    icon: "📋",
                    color: "from-purple-500 to-pink-500"
                  },
                  {
                    year: "2020",
                    title: "Рост объемов",
                    description: "За 6 лет объемы производства выросли на 60 процентов, что подтверждает высокий уровень доверия со стороны клиентов и качество выполняемых работ по всей России.",
                    icon: "📈",
                    color: "from-orange-500 to-red-500"
                  },
                  {
                    year: "2023",
                    title: "Расширение направлений",
                    description: "Компания расширила спектр услуг, включив в себя современные системы защиты от беспилотников, что позволило занять нишу в сфере обеспечения безопасности объектов по всей стране.",
                    icon: "🛡️",
                    color: "from-green-500 to-emerald-500"
                  }
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="relative"
                    >
                      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border-l-4 border-transparent hover:border-blue-500 group">
                        <div className="flex items-start gap-4">
                          <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            {item.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                          <span className={`text-2xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                            {item.year}
                          </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                              {item.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                ))}
              </div>

              {/* Десктопная версия (md и выше) - горизонтальная хронология */}
              <div className="hidden md:block relative">
                {/* Прогресс-бар с анимацией */}
                <div className="absolute top-24 left-0 right-0 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                      initial={{ width: "0%" }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                      className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                  />
                </div>

                {/* Timeline items */}
                <div className="grid grid-cols-4 gap-6 mt-32">
                  {[
                    {
                      year: "2012",
                      title: "Основание",
                      description: "Начало деятельности компании",
                      icon: "🏢",
                      color: "from-blue-500 to-cyan-500",
                      details: "Компания начала свою деятельность 12 ноября 2012 года, специализируясь на строительно-монтажных работах. С первых лет работы мы зарекомендовали себя как надежный партнер."
                    },
                    {
                      year: "2017",
                      title: "Членство в СРО",
                      description: "Вступление в ассоциации",
                      icon: "📋",
                      color: "from-purple-500 to-pink-500",
                      details: "Компания стала членом саморегулируемых организаций - Ассоциация \"Строительный комплекс Ленинградской области\" (Ассоциация \"СК ЛО\") и Ассоциация СРО \"ОсноваПроект\", что позволило расширить спектр предоставляемых услуг.",
                    },
                    {
                      year: "2020",
                      title: "Рост объемов",
                      description: "+60% к объемам производства",
                      icon: "📈",
                      color: "from-orange-500 to-red-500",
                      details: "За 6 лет объемы производства выросли на 60 процентов, что подтверждает высокий уровень доверия со стороны клиентов и качество выполняемых работ по всей России."
                    },
                    {
                      year: "2023",
                      title: "Новые направления",
                      description: "Системы защиты от БПЛА",
                      icon: "🛡️",
                      color: "from-green-500 to-emerald-500",
                      details: "Компания расширила спектр услуг, включив в себя современные системы защиты от беспилотников, что позволило занять нишу в сфере обеспечения безопасности объектов по всей стране."
                    }
                  ].map((item, i) => (
                      <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.2 }}
                          className="relative group"
                      >
                        {/* Year marker */}
                        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                          <div className="relative">
                            <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 + 0.5, type: "spring" }}
                                className={`w-14 h-14 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-lg shadow-xl z-20 group-hover:scale-110 transition-transform duration-300`}
                            >
                              {item.year}
                            </motion.div>
                          </div>
                        </div>

                        {/* Content card */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group-hover:border-t-4 border-blue-500"
                        >
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            {item.icon}
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                            {item.description}
                          </p>

                          {/* Hidden details that appear on hover */}
                          <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-2xl p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-2xl z-30 overflow-auto">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl mb-4`}>
                              {item.icon}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                              {item.year} - {item.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {item.details}
                            </p>
                          </div>
                        </motion.div>
                      </motion.div>
                  ))}
                </div>

                {/* Дополнительная информация о компании */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                    className="mt-20 text-center"
                >
                  <div className="inline-flex items-center gap-4 bg-white dark:bg-gray-800 rounded-full px-6 py-3 shadow-lg">
                    <span className="text-gray-600 dark:text-gray-300">За более чем</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">10 лет</span>
                    <span className="text-gray-600 dark:text-gray-300">реализовано</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">100+</span>
                    <span className="text-gray-600 dark:text-gray-300">проектов по всей России</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Bottom Gradient Fade for smooth transition */}
          <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-b from-transparent via-white/50 to-gray-50 dark:via-gray-900/30 dark:to-gray-950 pointer-events-none" />
        </section>

        {/* Our Mission Section */}
        <section className="relative py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
          {/* Top gradient overlay for smooth transition */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white dark:from-gray-950 to-transparent pointer-events-none" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Наша миссия и приоритеты
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Мы стремимся к созданию безопасных и надежных пространств по всей России, используя передовые технологии и лучшие практики в строительной отрасли
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Users className="w-8 h-8" />,
                  title: "Кадровая политика",
                  description: "К выполнению работ допускаются профильные специалисты с опытом в конкретном направлении"
                },
                {
                  icon: <Zap className="w-8 h-8" />,
                  title: "Курс на инновации",
                  description: "Мастера всегда в курсе новейших технологий и предлагают лучшие решения"
                },
                {
                  icon: <Shield className="w-8 h-8" />,
                  title: "Ответственность",
                  description: "Построенные объекты рассчитаны на десятилетия эксплуатации без капитального ремонта"
                },
                {
                  icon: <HardHat className="w-8 h-8" />,
                  title: "Автономность",
                  description: "Всё спецоборудование, транспорт и инструменты являются собственностью компании"
                },
                {
                  icon: <Award className="w-8 h-8" />,
                  title: "Безупречное качество",
                  description: "Акты выполнения работ сопровождаются фото- и видеоматериалами"
                },
                {
                  icon: <Target className="w-8 h-8" />,
                  title: "Индивидуальный подход",
                  description: "Разрабатываем решения под конкретные задачи и особенности вашего объекта"
                }
              ].map((item, i) => (
                  <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="group relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300">
                      <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white mb-6">
                        {item.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="relative py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
          {/* Top gradient overlay for smooth transition */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-50 dark:from-gray-900 to-transparent pointer-events-none" />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Основные направления деятельности
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Полный спектр строительно-монтажных работ для реализации ваших проектов в любом регионе России
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Подготовительные работы",
                  description: "Полный комплекс подготовительных работ для начала строительства в любом регионе России",
                  features: ["Демонтаж конструкций", "Подготовка участка", "Устройство лесов", "Благоустройство"],
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  title: "Строительство зданий",
                  description: "Возведение промышленных и гражданских объектов под ключ по всей России",
                  features: ["Фундаментные работы", "Монтаж конструкций", "Кровельные работы", "Отделка"],
                  color: "from-purple-500 to-pink-500"
                },
                {
                  title: "Металлоконструкции",
                  description: "Изготовление и монтаж металлических конструкций любой сложности в любом регионе",
                  features: ["Проектирование", "Изготовление", "Монтаж", "Антикоррозийная защита"],
                  color: "from-orange-500 to-red-500"
                },
                {
                  title: "Теплоизоляция",
                  description: "Работы по теплоизоляции оборудования и трубопроводов в любых климатических зонах России",
                  features: ["Теплоизоляция труб", "Энергосбережение", "Защита оборудования", "Монтаж"],
                  color: "from-green-500 to-emerald-500"
                },
                {
                  title: "Защита от БПЛА",
                  description: "Современные системы защиты периметра от беспилотников для объектов по всей России",
                  features: ["Установка систем", "Настройка", "Обслуживание", "Консультации"],
                  color: "from-indigo-500 to-blue-500"
                },
                {
                  title: "Дополнительные услуги",
                  description: "Широкий спектр дополнительных строительных услуг в любом регионе",
                  features: ["Земляные работы", "Грузоперевозки", "Огнезащита", "Ремонтные работы"],
                  color: "from-yellow-500 to-orange-500"
                }
              ].map((service, i) => (
                  <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ y: -10 }}
                      className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${service.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300 rounded-full -translate-y-16 translate-x-16`} />

                    <div className="relative p-8">
                      <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${service.color} text-white mb-6`}>
                        <Building2 className="w-6 h-6" />
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        {service.title}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        {service.description}
                      </p>

                      <ul className="space-y-3 mb-8">
                        {service.features.map((feature, j) => (
                            <li key={j} className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                            </li>
                        ))}
                      </ul>

                      <Link
                          to={
                            service.title === "Подготовительные работы" ? "/services?category=Подготовительные работы" :
                                service.title === "Металлоконструкции" ? "/services?category=Монтаж металлических конструкций" :
                                    service.title === "Теплоизоляция" ? "/services?category=Теплоизоляционные работы" :
                                        service.title === "Защита от БПЛА" ? "/drone-defense" :
                                            service.title === "Дополнительные услуги" ? "/services?category=Дополнительные услуги" :
                                                service.title === "Строительство зданий" ? "/services?category=Устройство монолитных и сборных бетонных и железобетонных конструкций" :
                                                    "/services"
                          }
                          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold group/link"
                      >
                        <span>Подробнее</span>
                        <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom Gradient Fade for smooth transition */}
          <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-b from-transparent via-white/30 to-gray-50 dark:via-gray-900/30 dark:to-gray-900 pointer-events-none" />
        </section>

        {/* Regional Presence Section */}
        <section className="relative py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
          {/* Top gradient overlay for smooth transition */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-50 dark:from-gray-900 to-transparent pointer-events-none" />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                География присутствия
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Мы успешно реализуем проекты в различных регионах Российской Федерации
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
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
                      className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
                  >
                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${item.color} text-white mb-6`}>
                      {item.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {item.region}
                    </h3>
                    <ul className="space-y-2">
                      {item.cities.map((city, j) => (
                          <li key={j} className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                            <MapPin className="w-4 h-4 text-blue-500" />
                            {city}
                          </li>
                      ))}
                    </ul>
                  </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom Gradient Fade for smooth transition */}
          <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-b from-transparent via-gray-900/30 to-gray-50 dark:via-gray-900/50 dark:to-gray-900 pointer-events-none" />
        </section>

        {/* Values Section */}
        <section className="relative py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
          {/* Top gradient overlay for smooth transition */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-50 dark:from-gray-900 to-transparent pointer-events-none" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Наши ценности
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Мы руководствуемся принципами, которые обеспечивают качество и надежность в каждой работе
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <Shield className="w-8 h-8" />,
                  title: "Безопасность",
                  description: "Приоритет безопасности в каждом проекте"
                },
                {
                  icon: <Award className="w-8 h-8" />,
                  title: "Качество",
                  description: "Соблюдение всех стандартов и норм"
                },
                {
                  icon: <Clock className="w-8 h-8" />,
                  title: "Надежность",
                  description: "Гарантия на все виды работ от 2 до 5 лет"
                },
                {
                  icon: <Users className="w-8 h-8" />,
                  title: "Команда",
                  description: "Опытные специалисты с профильным образованием"
                }
              ].map((value, i) => (
                  <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="text-center"
                  >
                    <div className="inline-flex p-5 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 text-white mb-6">
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {value.description}
                    </p>
                  </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom Gradient Fade for smooth transition */}
          <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-b from-transparent via-white/50 to-gray-50 dark:via-gray-900/30 dark:to-gray-950 pointer-events-none" />
        </section>

        {/* CTA Section */}
        <section className="relative py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
          {/* Top gradient overlay for smooth transition */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-50 dark:from-gray-950 to-transparent pointer-events-none" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center text-white"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Готовы начать сотрудничество?
              </h2>

              <p className="text-xl opacity-90 max-w-3xl mx-auto mb-12">
                Оставьте заявку и получите бесплатную консультацию от наших экспертов.
                Мы поможем реализовать ваш проект в любом регионе России с учетом всех требований и пожеланий.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                    href="/contacts"
                    className="group inline-flex items-center justify-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <span>Обсудить проект</span>
                  <HardHat className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>

                <a
                    href="/services"
                    className="group inline-flex items-center justify-center gap-3 bg-transparent text-white px-8 py-4 rounded-xl font-semibold border-2 border-white hover:bg-white/10 transition-all duration-300"
                >
                  <span>Наши услуги</span>
                  <Building2 className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Bottom Gradient Fade for smooth transition */}
          <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-b from-transparent via-purple-900/30 to-gray-50 dark:via-gray-900/50 dark:to-gray-950 pointer-events-none" />
        </section>
      </div>
  );
};

export default CompanyShowcase;