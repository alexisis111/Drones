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
import { LocalBusinessSchema, ServiceSchema, ConstructionBusinessSchema } from "../components/SchemaOrg";
import FaqSection from "../components/FaqSection";
import Breadcrumbs, { type BreadcrumbItem } from "../components/Breadcrumbs";
import HeroContacts from "../components/HeroContacts";
import { services } from "../data/services";
import { Tag } from 'lucide-react';



export function Welcome() {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setIsVisible(true);

    // Прокрутка к прайс-листу если в URL есть якорь #price-list
    if (window.location.hash === '#price-list') {
      setTimeout(() => {
        const element = document.getElementById('price-list');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Прайс-лист
  const priceList = [
    { name: "Разборка зданий и сооружений", price: "от 180 ₽/м³", slug: "razborka-zdaniy-i-sooruzheniy" },
    { name: "Сборка лесов", price: "от 150 ₽/м²", slug: "sborka-lesov" },
    { name: "Подготовка участка", price: "от 12 000 ₽/сотка", slug: "podgotovka-stroitelnogo-uchastka" },
    { name: "Благоустройство территорий", price: "от 1 100 ₽/м²", slug: "blagoustroystvo-territoriy" },
    { name: "Изготовление металлоконструкций", price: "от 80 000 ₽/т", slug: "izgotovlenie-metallokonstruktsiy" },
    { name: "Монтаж тех. трубопроводов", price: "от 450 ₽/п.м.", slug: "montazh-tekhnologicheskikh-truboprovodov" },
    { name: "Монтаж тех. площадок", price: "от 2 500 ₽/м²", slug: "montazh-tekhnologicheskikh-ploshchadok" },
    { name: "АКЗ (антикоррозийная защита)", price: "от 250 ₽/м²", slug: "antikorroziynaya-zashchita" },
    { name: "Устройство каменных конструкций", price: "от 1 800 ₽/м²", slug: "ustroystvo-kamennykh-konstruktsiy" },
    { name: "Устройство фундаментов", price: "от 4 500 ₽/м³", slug: "ustroystvo-fundamentov" },
    { name: "Монтаж сборного ЖБИ", price: "от 2 500 ₽/м³", slug: "montazh-sbornogo-zhelezobetona" },
    { name: "Теплоизоляция оборудования/труб", price: "от 450 ₽/м²", slug: "teploizolyatsiya-truboprovodov" },
    { name: "Земляные работы", price: "от 350 ₽/м³", slug: "zemlyanye-raboty" },
    { name: "Строительство ангаров", price: "от 10 000 ₽/м²", slug: "stroitelstvo-angarov" },
    { name: "Грузоперевозки", price: "от 600 ₽/час", slug: "gruzoperevozki" },
    { name: "Огнезащита конструкций", price: "от 450 ₽/м²", slug: "ognezashchita-konstruktsiy" }
  ];

  // Данные для схемы
  const businessData = {
    name: "Строительная компания ЛЕГИОН",
    description: "ООО «ЛЕГИОН» — надёжная строительная компания с 2012 года. Офис в г. Светогорск (Ленинградская область). Выполняем полный цикл строительных работ: от подготовительных работ до сдачи объекта под ключ. Специализируемся на строительстве зданий, монтаже металлоконструкций, теплоизоляции и комплексных решениях для промышленных и гражданских объектов. Работаем по всей России. Гарантия качества, соблюдение сроков, индивидуальный подход к каждому проекту.",
    url: "https://xn--78-glchqprh.xn--p1ai/",
    logo: "/Logo-1.png",
    address: "Ленинградская область, г. Светогорск, ул. Максима Горького, 7",
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
          <ConstructionBusinessSchema {...businessData} />
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
                      <span>Услуги и цены</span>
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

            {/* Bottom Gradient Fade for smooth transition */}
            <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-b from-transparent via-gray-900/30 to-gray-50 dark:via-gray-900/50 dark:to-gray-900 pointer-events-none" />
          </section>

          {/* Price List Section */}
          <section id="price-list" className="relative py-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black overflow-hidden">
            {/* Top gradient overlay for smooth transition */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-50 dark:from-gray-900 to-transparent pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full px-6 py-2.5 mb-4 shadow-lg shadow-blue-500/30">
                  <Building2 className="w-5 h-5" />
                  <span className="text-sm font-bold">Прайс-лист</span>
                </div>
              </motion.div>

              {/* Price List Table */}
              <div className="max-w-5xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-blue-600 to-purple-600">
                        <tr>
                          <th className="text-left text-white font-bold py-5 px-6 text-sm">Наименование услуги</th>
                          <th className="text-right text-white font-bold py-5 px-6 text-sm">Цена</th>
                          <th className="text-center text-white font-bold py-5 px-6 text-sm">Действие</th>
                        </tr>
                      </thead>
                      <tbody>
                        {priceList.map((item, index) => (
                          <motion.tr
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.03 }}
                            className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                              index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/50 dark:bg-gray-800/50'
                            }`}
                          >
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex-shrink-0" />
                                <span className="text-gray-900 dark:text-white font-medium text-sm">{item.name}</span>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg px-3 py-1.5 text-sm font-bold whitespace-nowrap">
                                <Tag className="w-3.5 h-3.5" />
                                {item.price}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-center">
                              <Link
                                to={`/service/${item.slug}`}
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105"
                              >
                                <span>Перейти</span>
                                <ArrowRight className="w-4 h-4" />
                              </Link>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-700">
                    {priceList.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.03 }}
                        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex-shrink-0 mt-2" />
                          <div className="flex-1">
                            <h3 className="text-gray-900 dark:text-white font-semibold text-sm leading-snug mb-2">
                              {item.name}
                            </h3>
                            <div className="flex items-center justify-between">
                              <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg px-2.5 py-1.5 text-xs font-bold whitespace-nowrap">
                                <Tag className="w-3 h-3" />
                                {item.price}
                              </span>
                              <Link
                                to={`/service/${item.slug}`}
                                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1.5 rounded-lg font-semibold text-xs transition-all duration-300 active:scale-95"
                              >
                                <span>Перейти</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mt-12"
                >
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300"
                  >
                    <span>Все услуги</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* Bottom Gradient Fade for smooth transition */}
            <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-white dark:from-gray-950 via-gray-100/50 dark:via-gray-900/50 to-transparent pointer-events-none" />
          </section>


          {/* Why Choose Us Section */}
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

            {/* Bottom Gradient Fade for smooth transition */}
            <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-white dark:from-gray-950 via-gray-100/50 dark:via-gray-900/50 to-transparent pointer-events-none" />
          </section>


          {/* SEO Text Section */}
          <section className="relative py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
            {/* Top gradient overlay for smooth transition */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-50 dark:from-gray-900 to-transparent pointer-events-none" />
            
            <div className="container mx-auto px-4 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-5xl mx-auto"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                  Строительная компания ЛЕГИОН — строительство в СПб, Ленинградской области и по всей России
                </h2>
                
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                    <strong>ООО «ЛЕГИОН»</strong> — строительная компания полного цикла, работающая с 2012 года. Офис находится в г. Светогорск (Ленинградская область, ул. Максима Горького, 7). Мы выполняем строительные работы любой сложности для промышленных и гражданских объектов в Санкт-Петербурге, Ленинградской области и по всей территории Российской Федерации. За 12 лет работы реализовано более 100 проектов — от небольших зданий до крупных промышленных комплексов.
                  </p>

                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-5">
                    Услуги строительной компании — полный цикл работ
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <span className="text-2xl">🏗️</span>
                        Подготовительные работы
                      </h4>
                      <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span><strong>Разборка зданий</strong> — снос и демонтаж с вывозом</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span><strong>Сборка лесов</strong> — для фасадных работ</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span><strong>Подготовка участка</strong> — расчистка и разметка</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span><strong>Благоустройство</strong> — озеленение и мощение</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <span className="text-2xl">🏢</span>
                        Металлоконструкции
                      </h4>
                      <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span><strong>Изготовление</strong> — по чертежам заказчика</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span><strong>Монтаж трубопроводов</strong> — установка и ремонт</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span><strong>Техплощадки</strong> — для обслуживания</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span><strong>Антикоррозия</strong> — защита от ржавчины</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <span className="text-2xl">🏗️</span>
                        Общестроительные работы
                      </h4>
                      <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span><strong>Каменные конструкции</strong> — кладка кирпича и блоков</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span><strong>Фундаменты</strong> — монолитные и сборные</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span><strong>ЖБИ конструкции</strong> — монтаж плит и блоков</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <span className="text-2xl">🔥</span>
                        Теплоизоляция
                      </h4>
                      <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span><strong>Оборудование</strong> — изоляция механизмов</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span><strong>Трубопроводы</strong> — защита от промерзания</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <span className="text-2xl">🚛</span>
                      Дополнительные услуги
                    </h4>
                    <div className="grid md:grid-cols-2 gap-3 text-gray-700 dark:text-gray-300 text-sm">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span><strong>Земляные работы</strong> — котлованы и траншеи</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span><strong>Строительство ангаров</strong> — под ключ</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span><strong>Грузоперевозки</strong> — доставка материалов</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span><strong>Огнезащита</strong> — металла и дерева</span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-5">
                    Преимущества строительной фирмы ЛЕГИОН
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 mb-8">
                    <div className="flex items-start gap-3 bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">12 лет на рынке</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">Более 100 успешных проектов по России</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Соблюдение сроков</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">Работаем строго по договору</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">ГОСТ и СНиП</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">Гарантия качества от 2 до 5 лет</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Своё производство</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">Изготовление металлоконструкций</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/20 rounded-xl p-6 mt-8 border border-blue-100 dark:border-blue-800">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      📍 Как заказать строительные услуги
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      Офис компании находится по адресу: <strong>Ленинградская область, г. Светогорск, ул. Максима Горького, 7</strong>.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      Работаем со всеми регионами России — от Санкт-Петербурга и Ленинградской области до Дальнего Востока. 
                      Предоставляем бесплатную консультацию, расчёт сметы и коммерческое предложение для вашего объекта.
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      ☎ <strong>+7 931 247-08-88</strong> — звоните для обсуждения вашего проекта!
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Bottom Gradient Fade for smooth transition to CTA section */}
            <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-blue-600/10 via-white/50 dark:from-blue-900/20 dark:via-gray-950/50 to-transparent pointer-events-none" />
          </section>

          {/* CTA Section */}
          <section className="relative py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
            {/* Top gradient overlay for smooth transition */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-50 dark:from-gray-900 to-transparent pointer-events-none" />
            
            <div className="container mx-auto px-4 relative z-10">
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

            {/* Bottom Gradient Fade for smooth transition */}
            <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-b from-transparent via-blue-600/20 to-gray-50 dark:via-purple-900/50 dark:to-gray-950 pointer-events-none" />
          </section>

          {/* FAQ Section */}
          <div className="relative">
            {/* Top gradient overlay for smooth transition */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-50 dark:from-gray-950 to-transparent pointer-events-none" />
            
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
          </div>

        </main>
      </div>
  );
}