import { useState, useEffect } from 'react';
import { useTheme } from "../contexts/ThemeContext";
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import {
  ChevronRight,
  ArrowRight,
  Shield,
  Building2,
  Target,
  Zap,
  Award,
  Clock,
  Users,
  CheckCircle,
  Star,
  Layers,
  Phone
} from 'lucide-react';
import { LocalBusinessSchema, ServiceSchema } from "../components/SchemaOrg";
import FaqSection from "../components/FaqSection";
import Breadcrumbs, { type BreadcrumbItem } from "../components/Breadcrumbs";
import HeroContacts from "../components/HeroContacts";



export function Welcome() {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setIsVisible(true);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Данные для схемы
  const businessData = {
    name: "Строительная компания ЛЕГИОН",
    description: "ООО «ЛЕГИОН» — надёжная строительная компания. Выполняем полный цикл строительных работ: от подготовительных работ до сдачи объекта под ключ. Специализируемся на строительстве зданий, монтаже металлоконструкций, теплоизоляции и комплексных решениях для промышленных и гражданских объектов. Работаем по всей России. Гарантия качества, соблюдение сроков, индивидуальный подход к каждому проекту.",
    url: "https://xn--78-glchqprh.xn--p1ai/", // https://легион.рф/
    logo: "/Logo-1.png",
    address: "Ленинградская область",
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

  const services = [
    {
      name: "Строительство зданий",
      description: "Возведение промышленных и гражданских объектов под ключ",
      serviceType: "Строительные работы"
    },
    {
      name: "Монтаж металлоконструкций",
      description: "Изготовление и монтаж металлических конструкций любой сложности",
      serviceType: "Монтажные работы"
    },
    {
      name: "Защита от БПЛА",
      description: "Современные системы защиты периметра от беспилотников",
      serviceType: "Системы безопасности"
    },
    {
      name: "Подготовительные работы",
      description: "Полный комплекс подготовительных работ для начала строительства",
      serviceType: "Подготовительные работы"
    }
  ];

  return (
      <div className="relative overflow-hidden">
        <main className="relative">
          {/* Schema.org structured data */}
          <LocalBusinessSchema {...businessData} />
          {services.map((service, index) => (
            <ServiceSchema 
              key={index}
              name={service.name}
              description={service.description}
              serviceType={service.serviceType}
              provider={businessData}
            />
          ))}
          {/* Hero Section - Modern & Cool Design */}
          <section className="relative flex items-center overflow-hidden">
            {/* Animated Background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-black"
              style={{ y: scrollY * 0.5 }}
            >
              {/* Image Overlay */}
              <div className="absolute inset-0 bg-[url('/img/homesImg/home.jpeg')] bg-cover bg-center mix-blend-overlay opacity-15" />

              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-purple-600/10" />
            </motion.div>

            {/* Content */}
            <div className="relative container mx-auto px-4 z-10 py-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center"
              >
                {/* Left Column - Main Content */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-4 sm:space-y-6 md:space-y-8"
                >
                  {/* Animated Badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-full px-3 sm:px-6 py-2 sm:py-3 border border-blue-400/30"
                  >
                    <motion.div
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                    </motion.div>
                    <span className="text-xs sm:text-sm font-semibold text-white">С 2012 года на рынке</span>
                    <div className="flex gap-0.5 sm:gap-1">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                        >
                          <Star className="w-2 h-2 sm:w-3 sm:h-3 text-yellow-400 fill-yellow-400" />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Main Heading with Gradient Animation */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-1 sm:space-y-2"
                  >
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight text-white">
                      <motion.span
                        className="block"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        Строительная
                      </motion.span>
                      <motion.span
                        className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent bg-[length:200%_auto]"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{
                          opacity: 1,
                          x: 0,
                          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                        }}
                        transition={{
                          delay: 0.5,
                          backgroundPosition: { duration: 5, repeat: Infinity, ease: "linear" }
                        }}
                      >
                        компания «ЛЕГИОН»
                      </motion.span>
                      <motion.span
                        className="block text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mt-2 sm:mt-3"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        Строим по всей России
                      </motion.span>
                    </h1>
                  </motion.div>

                  {/* Subtitle with Highlight */}
                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-2xl leading-relaxed"
                  >
                    <span className="text-white font-semibold">Полный цикл работ:</span> от
                    подготовительных работ до сдачи объекта под ключ.{' '}
                    <span className="text-blue-400">Строительство зданий</span>,{' '}
                    <span className="text-purple-400">монтаж металлоконструкций</span> и{' '}
                    <span className="text-pink-400">комплексные решения</span> для вашего бизнеса.
                  </motion.p>

                  {/* Stats Row */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:gap-6"
                  >
                    {[
                      { value: "12+", label: "Лет опыта", icon: <Award className="w-4 h-4 md:w-5 md:h-5" /> },
                      { value: "100+", label: "Проектов", icon: <Building2 className="w-4 h-4 md:w-5 md:h-5" /> }
                    ].map((stat, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 + i * 0.1 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="group bg-white/5 dark:bg-gray-800/50 backdrop-blur-xl border border-white/10 dark:border-gray-700 rounded-2xl p-3 md:p-4 hover:bg-white/10 dark:hover:bg-gray-800/70 hover:border-blue-400/50 transition-all duration-300"
                      >
                        <div className="flex items-center gap-2 mb-1 text-blue-400 group-hover:text-blue-300">
                          {stat.icon}
                        </div>
                        <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                        <div className="text-xs md:text-sm text-gray-400">{stat.label}</div>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* CTA Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                  >
                    <Link
                      to="/contacts"
                      className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative z-10">Начать проект</span>
                      <ChevronRight className="relative z-10 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                      to="/services"
                      className="group inline-flex items-center justify-center gap-2 sm:gap-3 bg-white/10 dark:bg-gray-800/50 backdrop-blur-xl text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold border border-white/20 dark:border-gray-700 hover:bg-white/20 dark:hover:bg-gray-800/70 hover:border-white/30 transition-all duration-300"
                    >
                      <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Услуги</span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>

                  {/* Trust Indicators */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 pt-2 sm:pt-4"
                  >
                    <div className="flex items-center gap-1.5 sm:gap-2 text-gray-400">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                      <span className="text-xs sm:text-sm">ГОСТ и СНиП</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-gray-400">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                      <span className="text-xs sm:text-sm">Гарантия</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-gray-400">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                      <span className="text-xs sm:text-sm">По договору</span>
                    </div>
                  </motion.div>

                  {/* Mobile Contact Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 }}
                    className="lg:hidden mt-6"
                  >
                    <Link
                      to="/contacts"
                      className="group flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-xl font-semibold hover:shadow-xl transition-all"
                    >
                      <Phone className="w-5 h-5" />
                      <span>Связаться с нами</span>
                    </Link>
                  </motion.div>
                </motion.div>

                {/* Right Column - Contact Cards */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="lg:pl-8"
                >
                  <div className="hidden lg:block">
                    <HeroContacts
                      ctaLink="/contacts"
                      ctaButtonText="Обсудить проект"
                    />
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Wave Divider - Smooth Transition */}
            <div className="absolute bottom-0 left-0 right-0">
              <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                <path
                  d="M0 0C48 0 144 0 288 12C432 24 576 48 720 56C864 64 1008 56 1152 48C1296 40 1392 24 1440 12V120H0V0Z"
                  className="fill-gray-50 dark:fill-gray-950"
                />
                <path
                  d="M0 0C60 8 180 24 300 32C420 40 540 40 660 36C780 32 900 24 1020 20C1140 16 1260 16 1380 12V120H0V0Z"
                  className="fill-gray-50/70 dark:fill-gray-950/70"
                />
                <path
                  d="M0 0C80 16 240 48 400 56C560 64 720 48 880 40C1040 32 1200 32 1360 24V120H0V0Z"
                  className="fill-gray-50/40 dark:fill-gray-950/40"
                />
              </svg>
            </div>
          </section>

          {/* Why Choose Us Section */}
          <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
            <div className="container mx-auto px-4">
              <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-16"
              >
                <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full px-4 py-2 mb-4">
                  <Award className="w-4 h-4" />
                  <span className="text-sm font-medium">Наше преимущество</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                  Почему выбирают ЛЕГИОН
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Профессиональный подход к строительству и монтажным работам
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    icon: <Clock className="w-8 h-8" />,
                    title: "Соблюдение сроков",
                    description: "Строгое соблюдение договорных обязательств и сроков выполнения всех видов строительных работ"
                  },
                  {
                    icon: <CheckCircle className="w-8 h-8" />,
                    title: "Качество работ",
                    description: "Работаем по СНиП и ГОСТ. Только проверенные материалы и технологии строительства"
                  },
                  {
                    icon: <Users className="w-8 h-8" />,
                    title: "Опытная команда",
                    description: "Квалифицированные специалисты с многолетним опытом в строительной отрасли"
                  },
                  {
                    icon: <Shield className="w-8 h-8" />,
                    title: "Гарантия качества",
                    description: "Гарантия на все виды строительных и монтажных работ от 2 до 5 лет"
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
                      <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                        <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white mb-6">
                          {item.icon}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 flex-grow">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section className="py-24">
            <div className="container mx-auto px-4">
              <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                  Наши услуги
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Полный спектр строительно-монтажных работ для промышленных и гражданских объектов
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    title: "Подготовительные работы",
                    description: "Полный комплекс подготовительных работ для начала строительства",
                    features: ["Демонтаж конструкций", "Подготовка участка", "Устройство лесов", "Благоустройство территории"],
                    color: "from-blue-500 to-cyan-500"
                  },
                  {
                    title: "Строительство зданий",
                    description: "Возведение промышленных и гражданских объектов под ключ",
                    features: ["Фундаментные работы", "Монтаж конструкций", "Кровельные работы", "Отделка помещений"],
                    color: "from-purple-500 to-pink-500"
                  },
                  {
                    title: "Металлоконструкции",
                    description: "Изготовление и монтаж металлических конструкций любой сложности",
                    features: ["Проектирование КМ", "Изготовление на заводе", "Монтаж на объекте", "Антикоррозийная защита"],
                    color: "from-orange-500 to-red-500"
                  },
                  {
                    title: "Теплоизоляция",
                    description: "Работы по теплоизоляции оборудования, трубопроводов и строительных конструкций",
                    features: ["Теплоизоляция труб", "Энергосбережение", "Защита оборудования", "Монтаж изоляции"],
                    color: "from-green-500 to-emerald-500"
                  },
                  {
                    title: "Защита от БПЛА",
                    description: "Монтаж антидрон сетки для защиты промышленных объектов",
                    features: ["Проектирование защиты", "Монтаж сетки", "Обслуживание систем", "Консультации"],
                    color: "from-indigo-500 to-blue-500"
                  },
                  {
                    title: "Дополнительные услуги",
                    description: "Широкий спектр дополнительных строительных услуг",
                    features: ["Земляные работы", "Грузоперевозки", "Огнезащита металла", "Ремонтные работы"],
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
                              service.title === "Защита от БПЛА" ? "/services?category=Дополнительные услуги" :
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
                  Готовы начать проект?
                </h2>

                <p className="text-xl opacity-90 max-w-3xl mx-auto mb-12">
                  Оставьте заявку и получите бесплатную консультацию от наших экспертов.
                  Мы поможем реализовать ваш проект с учетом всех требований и пожеланий.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                      to="/contacts"
                      className="group inline-flex items-center justify-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
                  >
                    <span>Обсудить проект</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                      to="/portfolio"
                      className="group inline-flex items-center justify-center gap-3 bg-transparent text-white px-8 py-4 rounded-xl font-semibold border-2 border-white hover:bg-white/10 transition-all duration-300"
                  >
                    <span>Посмотреть работы</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>

          {/* FAQ Section */}
          <FaqSection
            faqs={[
              {
                question: "Какие услуги вы предоставляете?",
                answer: "Мы предоставляем полный спектр строительно-монтажных работ: подготовительные работы, строительство зданий, монтаж металлоконструкций, теплоизоляцию, а также системы защиты периметра для промышленных объектов."
              },
              {
                question: "Какой у вас опыт работы?",
                answer: "Компания ООО «ЛЕГИОН» работает на рынке с 2012 года, за это время мы реализовали более 150 проектов в Санкт-Петербурге, Ленинградской области и других регионах России."
              },
              {
                question: "Какие гарантии вы предоставляете?",
                answer: "Мы предоставляем гарантию на все виды работ от 2 до 5 лет в зависимости от типа работ. Гарантия качества зафиксирована в договоре."
              },
              {
                question: "Работаете ли вы по всей России?",
                answer: "Да, мы работаем по всей России. Оставьте заявку или закажите обратный звонок, расскажем обо всем подробно"
              },
              {
                question: "Какие документы вы предоставляете?",
                answer: "Мы предоставляем полный пакет закрывающих документов: договор, акты выполненных работ, сертификаты качества, гарантийные обязательства и исполнительную документацию."
              }
            ]}
            title="Часто задаваемые вопросы"
            subtitle="Ответы на вопросы о строительных услугах компании ЛЕГИОН"
          />

        </main>
      </div>
  );
}