import { useTheme } from "../contexts/ThemeContext";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { ChevronRight, ArrowRight, Shield, Building2, Target, Zap, Award, Clock, Users, CheckCircle } from 'lucide-react';



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

  return (
      <div className="relative overflow-hidden">
        <main className="relative">
          {/* Hero Section - Redesigned */}
          <section className="relative min-h-screen flex items-center overflow-hidden">
            {/* Background with parallax effect */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-900 via-gray-900 to-purple-900"
            >
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[url('/img/homesImg/home.jpeg')] bg-cover bg-center mix-blend-overlay opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-purple-600/10" />
              </div>
            </motion.div>

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
                    <span className="block">СТРОИТЕЛЬНАЯ</span>
                    <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    КОМПАНИЯ
                  </span>
                    <span className="block">«ЛЕГИОН»</span>
                  </motion.h1>

                  {/* Subtitle */}
                  <motion.p
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-xl text-gray-300 max-w-2xl"
                  >
                    Профессиональные строительно-монтажные работы любой сложности.
                    От проектирования до сдачи объекта «под ключ».
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
                      { value: "100%", label: "Гарантия" },
                      { value: "24/7", label: "Поддержка" },
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
                      <span>Начать проект</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                        to="/services"
                        className="group inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300"
                    >
                      <span>Наши услуги</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
                      title: "Защита от БПЛА",
                      description: "Современные системы защиты периметра",
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

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
              <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-white/50"
              >
                <ChevronRight className="w-6 h-6 rotate-90" />
              </motion.div>
            </motion.div>
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
                  Почему выбирают нас
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Комплексный подход и внимание к деталям делают нас лидером в строительной отрасли
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    icon: <Clock className="w-8 h-8" />,
                    title: "Соблюдение сроков",
                    description: "Строгое соблюдение договорных обязательств и этапов строительства"
                  },
                  {
                    icon: <CheckCircle className="w-8 h-8" />,
                    title: "Качество работ",
                    description: "Использование только проверенных материалов и технологий"
                  },
                  {
                    icon: <Users className="w-8 h-8" />,
                    title: "Опытная команда",
                    description: "Квалифицированные специалисты с многолетним опытом"
                  },
                  {
                    icon: <Shield className="w-8 h-8" />,
                    title: "Гарантия",
                    description: "Гарантия на все виды работ от 2 до 5 лет"
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
          <section className="py-24">
            <div className="container mx-auto px-4">
              <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                  Наши основные услуги
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Полный спектр строительно-монтажных работ для реализации ваших проектов
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    title: "Подготовительные работы",
                    description: "Полный комплекс подготовительных работ для начала строительства",
                    features: ["Демонтаж конструкций", "Подготовка участка", "Устройство лесов", "Благоустройство"],
                    color: "from-blue-500 to-cyan-500"
                  },
                  {
                    title: "Строительство зданий",
                    description: "Возведение промышленных и гражданских объектов под ключ",
                    features: ["Фундаментные работы", "Монтаж конструкций", "Кровельные работы", "Отделка"],
                    color: "from-purple-500 to-pink-500"
                  },
                  {
                    title: "Металлоконструкции",
                    description: "Изготовление и монтаж металлических конструкций любой сложности",
                    features: ["Проектирование", "Изготовление", "Монтаж", "Антикоррозийная защита"],
                    color: "from-orange-500 to-red-500"
                  },
                  {
                    title: "Теплоизоляция",
                    description: "Работы по теплоизоляции оборудования и трубопроводов",
                    features: ["Теплоизоляция труб", "Энергосбережение", "Защита оборудования", "Монтаж"],
                    color: "from-green-500 to-emerald-500"
                  },
                  {
                    title: "Защита от БПЛА",
                    description: "Современные системы защиты периметра от беспилотников",
                    features: ["Установка систем", "Настройка", "Обслуживание", "Консультации"],
                    color: "from-indigo-500 to-blue-500"
                  },
                  {
                    title: "Дополнительные услуги",
                    description: "Широкий спектр дополнительных строительных услуг",
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
                              service.title === "Подготовительные работы" ? "/services.jpeg?category=Подготовительные работы" :
                              service.title === "Металлоконструкции" ? "/services.jpeg?category=Монтаж металлических конструкций" :
                              service.title === "Теплоизоляция" ? "/services.jpeg?category=Теплоизоляционные работы" :
                              service.title === "Защита от БПЛА" ? "/services.jpeg?category=Дополнительные услуги" :
                              service.title === "Дополнительные услуги" ? "/services.jpeg?category=Дополнительные услуги" :
                              service.title === "Строительство зданий" ? "/services.jpeg?category=Устройство монолитных и сборных бетонных и железобетонных конструкций" :
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
        </main>
      </div>
  );
}