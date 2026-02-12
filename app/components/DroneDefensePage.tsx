import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { Shield, Building2, Target, Zap, Award, Clock, Users, CheckCircle, ChevronRight, ArrowRight, Radio, Eye, AlertTriangle, Lock, Maximize2 } from 'lucide-react';
import { Link } from 'react-router';
import ZOKVisualization from '../components/ZOKVisualization';
import FullscreenModal from './FullscreenModal';

const DroneDefensePage: React.FC = () => {
  const { theme } = useTheme();
  const [scrollY, setScrollY] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Optimized background with parallax effect */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-900 via-gray-900 to-purple-900"
        >
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('https://www.promstroysever.ru/upload/iblock/780/0ee4fjsuiqq2v92s7jndm7kopb0aa5ry.png')] bg-cover bg-center mix-blend-overlay opacity-20" />
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
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium text-white">Системы защиты периметра</span>
              </motion.div>

              {/* Main heading */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white"
              >
                <span className="block">Защита от</span>
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Беспилотников
                </span>
                <span className="block">и дронов</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-300 max-w-2xl"
              >
                Современные системы защиты периметра от беспилотных летательных аппаратов. 
                Многоуровневая система защиты. Надежность конструкции. Гарантия качества.
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {[
                  { value: "99.9%", label: "Безопасность" },
                  { value: "3", label: "Уровня защиты" },
                  { value: "10 лет", label: "Гарантия" },
                  { value: "100%", label: "Покрытие" },
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
                  <span>Заказать систему</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/proposal"
                  className="group inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <span>Получить консультацию</span>
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
                  icon: <Radio className="w-6 h-6" />,
                  title: "Защита периметра",
                  description: "Многоуровневая защита",
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  icon: <Eye className="w-6 h-6" />,
                  title: "Современный подход",
                  description: "Качественные материалы",
                  color: "from-purple-500 to-pink-500"
                },
                {
                  icon: <AlertTriangle className="w-6 h-6" />,
                  title: "Гарантия качества",
                  description: "Гарантируем долговечность",
                  color: "from-orange-500 to-red-500"
                },
                {
                  icon: <Lock className="w-6 h-6" />,
                  title: "Закрывающие документы",
                  description: "Вся сопутствующая документация",
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

      {/* Visualization Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
        <div className="container mx-auto px-4">
          <motion.div
              initial={{opacity: 0, y: 50}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Демонстрация работы системы
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Интерактивная визуализация системы защиты периметра от беспилотных летательных аппаратов
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-2xl relative">
            <ZOKVisualization enableControls={false}/>
            <button
                onClick={() => setIsModalOpen(true)}
                className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/80 backdrop-blur-sm text-gray-800 hover:bg-white transition-all shadow-lg"
                aria-label="Открыть в полноэкранном режиме"
            >
              <Maximize2 className="w-5 h-5"/>
            </button>

            <FullscreenModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
              <ZOKVisualization enableControls={true}/>
            </FullscreenModal>
          </div>

          <motion.div
              initial={{opacity: 0, y: 50}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              className="text-center pt-16"
          >
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto flex items-center justify-center gap-2">
              Нажмите на иконку
              <span className="inline-flex items-center justify-center p-1 rounded border border-gray-300 dark:border-gray-600">
                <Maximize2 className="w-5 h-5"/>
              </span>
              чтобы посмотреть объект в 3D
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
              initial={{opacity: 0, y: 50}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Особенности системы
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Современные технологии для обеспечения безопасности вашего объекта
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Полная защита",
                description: "Комплексная система защиты периметра от всех типов беспилотников"
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: "Трехуровневая защита",
                description: "Мы используем несколько уровней защиты для максимальной безопасности"
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Быстрое возведение",
                description: "Работаем быстро и качественно"
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: "гарантия качества",
                description: "Надежное качество конструкции гарантирует долговечность"
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: "Сертифицированное оборудование",
                description: "Все компоненты системы имеют необходимые сертификаты соответствия"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Наша поддержка",
                description: "Всегда на связи и готовы помочь в любой ситуации"
              }
            ].map((feature, i) => (
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
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Области применения
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Система защиты периметра от БПЛА для различных типов объектов
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Building2 className="w-8 h-8" />,
                title: "Промышленные объекты",
                description: "Защита производственных площадок и складов",
                imageUrl: "https://thumbs.dreamstime.com/b/%D0%BF%D1%80%D0%BE%D0%BC%D1%8B%D1%88%D0%BB%D0%B5%D0%BD%D0%BD%D1%8B%D0%B9-%D0%BE%D0%B1%D1%8A%D0%B5%D0%BA%D1%82-%D0%BD%D0%B5%D1%84%D1%82%D1%8F%D0%BD%D0%BE%D0%B9-%D0%BF%D1%80%D0%BE%D0%BC%D1%8B%D1%88%D0%BB%D0%B5%D0%BD%D0%BD%D0%BE%D1%81%D1%82%D0%B8-%D1%82%D0%B0%D0%BD%D0%BA%D0%B8-%D1%82%D1%80%D1%83%D0%B1%D0%BE%D0%BF%D1%80%D0%BE%D0%B2%D0%BE%D0%B4%D0%BE%D0%B2-201992006.jpg"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Государственные учреждения",
                description: "Объекты с особым режимом безопасности",
                imageUrl: "https://1sn.ru/storage/posts/138736.jpeg"
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Частный бизнес",
                description: "Объекты с ограниченным доступом",
                imageUrl: "https://bzplan.ru/wp-content/uploads/2016/06/Biznes-plan-mini-zavoda-po-proizvodstvu-tsementa.jpg"
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: "Критическая инфраструктура",
                description: "Энергетические и транспортные объекты",
                imageUrl: "https://storge-bk.ru/wp-content/uploads/2020/12/transformatori.jpg"
              }
            ].map((application, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={application.imageUrl}
                    alt={application.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                </div>
                <div className="p-6">
                  <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white mb-4">
                    {application.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {application.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {application.description}
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
              Готовы защитить свой объект?
            </h2>

            <p className="text-xl opacity-90 max-w-3xl mx-auto mb-12">
              Обратитесь к нашим специалистам и получите индивидуальное решение 
              для защиты вашего объекта от беспилотных летательных аппаратов.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contacts"
                className="group inline-flex items-center justify-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <span>Заказать систему</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/proposal"
                className="group inline-flex items-center justify-center gap-3 bg-transparent text-white px-8 py-4 rounded-xl font-semibold border-2 border-white hover:bg-white/10 transition-all duration-300"
              >
                <span>Получить консультацию</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default DroneDefensePage;