import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import {
  Shield,
  Building2,
  Target,
  Zap,
  Award,
  Clock,
  Users,
  CheckCircle,
  ChevronRight,
  ArrowRight,
  AlertTriangle,
  Lock,
  Maximize2,
  Trophy, Phone, MessageSquare
} from 'lucide-react';
import { Link } from 'react-router';
// import ZOKVisualization from '../components/ZOKVisualization';
import FullscreenModal from './FullscreenModal';
import FaqSection from './FaqSection';
import ProjectEstimateModal from './ProjectEstimateModal';
import Breadcrumbs, { type BreadcrumbItem } from './Breadcrumbs';
import { useCallbackForm } from '../hooks/useCallbackForm';
import { CallbackModal } from './CallbackModal';

interface DroneDefensePageProps {
  breadcrumbs?: BreadcrumbItem[];
}

const DroneDefensePage: React.FC<DroneDefensePageProps> = ({ breadcrumbs }) => {
  const { theme } = useTheme();
  const [scrollY, setScrollY] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEstimateModalOpen, setIsEstimateModalOpen] = useState(false);

  // ----модалка для заказа звонка -----
  const {
    callbackForm,
    isCallbackSubmitting,
    callbackSuccess,
    phoneError,
    isCallbackModalOpen,
    setIsCallbackModalOpen,
    handleCallbackChange,
    handlePhoneChange,
    handlePhoneBlur,
    handlePhoneFocus,
    handleCallbackSubmit
  } = useCallbackForm('DroneDefensePage - обратный звонок');

  // Обработчик отправки формы (обёртка над хуком)
  const onCallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleCallbackSubmit(
      'DroneDefensePage - обратный звонок',
      '📞 Новое сообщение на обратный звонок'
    );
  };

  // ---------------------------------------

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleEstimateSubmit = async (formData: any) => {
    console.log('Submitting estimate form:', formData);
    try {
      const response = await fetch('/api/telegram-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log('Submit result:', result);

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Ошибка при отправке заявки');
      }

      return result;
    } catch (error) {
      console.error('Submit error:', error);
      throw error;
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen md:min-h-[60vh] flex items-center overflow-hidden">
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
          {/* Хлебные крошки */}
          {breadcrumbs && (
              <div className="py-4">
                <Breadcrumbs breadcrumbs={breadcrumbs} className="text-white/80"/>
              </div>
          )}
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center py-4">
            {/* Left column - Main content */}
            <motion.div
                initial={{opacity: 0, x: -50}}
                animate={{opacity: 1, x: 0}}
                transition={{duration: 0.8}}
                className="space-y-6 md:space-y-8"
            >
              {/* Badge + Slogan */}
              <motion.div
                  initial={{opacity: 0, y: 20}}
                  animate={{opacity: 1, y: 0}}
                  transition={{delay: 0.2}}
                  className="space-y-3"
              >
                <div
                    className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 md:px-4 md:py-2 border border-white/20 mr-2">
                  <Shield className="w-3 h-3 md:w-4 md:h-4"/>
                  <span className="text-xs md:text-sm font-medium text-white">Системы защиты периметра</span>
                </div>
                <div
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-full px-3 py-1.5 md:px-4 md:py-2 border border-blue-400/30">
                  <Trophy className="w-3 h-3 md:w-4 md:h-4 text-yellow-400"/>
                  <span className="text-xs md:text-sm font-bold text-white">№1 в России по производству и установке ЗОК</span>
                </div>
              </motion.div>

              {/* Main heading - SEO Optimized H1 */}
              <motion.h1
                  initial={{opacity: 0, y: 30}}
                  animate={{opacity: 1, y: 0}}
                  transition={{delay: 0.3}}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white"
              >
                <span className="block">Комплексная защита от БПЛА</span>
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        любые виды объектов.
      </span>
                <span className="block text-sm md:text-lg lg:text-xl text-gray-300 mt-2">
        по <a
                    href="https://protect.gost.ru/v.aspx?control=8&baseC=101&page=4&month=-1&year=-1&search=&RegNum=54&DocOnPageCount=100&id=253478"
                    className="inline-flex items-center gap-1 hover:underline text-blue-400"
                    target="_blank"
                    rel="noopener noreferrer"
                >
          СП 542.1325800.2024
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="md:w-4 md:h-4">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </a>
      </span>
              </motion.h1>

              {/* SEO-optimized subtitle with keywords */}
              <motion.p
                  initial={{opacity: 0, y: 30}}
                  animate={{opacity: 1, y: 0}}
                  transition={{delay: 0.4}}
                  className="text-sm md:text-lg text-gray-300 max-w-2xl"
              >
                Установка антидроновых систем под ключ: ТЭК, заводы, склады и частные объекты. Решения для крупных, средних и малых предприятий.
              </motion.p>

              {/* Protected objects list */}
              <motion.div
                  initial={{opacity: 0, y: 30}}
                  animate={{opacity: 1, y: 0}}
                  transition={{delay: 0.45}}
                  className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs md:text-sm"
              >
                {[
                  {title: "🏭 Крупные", items: ["ТЭЦ","НПЗ","аэропорты","морские порты","ж/д узлы","оборонные предприятия","объекты критической инфраструктуры","и пр"]},
                  {title: "🏢 Средние", items: ["Заводы","склады,","логистические хабы","агрокомплексы","дата-центры","торговые комплексы","и пр" ]},
                  {title: "🏠 Малые", items: ["КНС","ГРПШ","водозаборные станции","cотовые вышки","модульные котельные","узлы теплоснабжения", "и пр"]},
                ].map((cat, i) => (
                    <div key={i} className="p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                      <div className="font-semibold text-white mb-2">{cat.title}</div>
                      <div className="text-gray-400 space-y-1">
                        {cat.items.map((item, j) => (
                            <div key={j} className="flex items-center gap-2">
                              <span className="w-1 h-1 bg-blue-400 rounded-full"></span>
                              {item}
                            </div>
                        ))}
                      </div>
                    </div>
                ))}
              </motion.div>

              {/* Stats */}
              <motion.div
                  initial={{opacity: 0, y: 30}}
                  animate={{opacity: 1, y: 0}}
                  transition={{delay: 0.5}}
                  className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
              >
                {[
                  {value: "99.9%", label: "Эффективность"},
                  {value: "3", label: "Уровня защиты"},
                  {value: "10 лет", label: "Гарантия"}
                ].map((stat, i) => (
                    <div key={i}
                         className="text-center p-3 md:p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-400/50 transition-colors">
                      <div className="text-lg md:text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-xs text-gray-400">{stat.label}</div>
                    </div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-3 md:gap-4"
              >
                <a
                    href="tel:+79312470888"
                    className="px-4 py-3 md:px-6 md:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25 inline-flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  <Phone className="w-4 h-4" />
                  Позвонить
                </a>

                <button
                    onClick={() => setIsCallbackModalOpen(true)}
                    className="px-4 py-3 md:px-6 md:py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all inline-flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  <MessageSquare className="w-4 h-4" />
                  Заказать обратный звонок
                </button>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                  initial={{opacity: 0}}
                  animate={{opacity: 1}}
                  transition={{delay: 0.7}}
                  className="flex flex-wrap gap-3 md:gap-4 pt-3 md:pt-4 border-t border-white/10"
              >
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-400"/>
                  Сертифицировано ФСТЭК
                </div>
                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-400"/>
                  Монтаж по всей РФ
                </div>
                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-400"/>
                  Сопровождение на всех этапах
                </div>
              </motion.div>
            </motion.div>

            {/* Right column - Important Info Block */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="space-y-4"
            >
              {/* Warning Block */}
              <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-br from-red-600 to-orange-600 rounded-3xl p-5 shadow-2xl"
              >
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-white" />
                  <h3 className="text-lg font-bold text-white">Нормативные требования</h3>
                </div>
                
                <p className="text-white/90 text-xs mb-4">
                  Согласно Постановлению Правительства РФ от 05.05.2012 № 460 (в ред. от 2023 г.)
                </p>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
                  <h4 className="text-sm font-bold text-white mb-3">Обязанности руководителей</h4>
                  <p className="text-white/90 text-xs mb-3">
                    Руководители объектов ТЭК, промышленности и других критически важных сфер 
                    <strong> обязаны</strong> обеспечивать их антитеррористическую защищенность
                  </p>
                  
                  <Link
                      to="/contacts"
                      className="w-full inline-flex items-center justify-center gap-2 bg-white text-red-600 px-3 py-2 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 text-xs"
                  >
                    <span>Получить консультацию</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Последствия несоответствия
                  </h4>
                  <ul className="space-y-2">
                    {[
                      "Административные штрафы и приостановку деятельности",
                      "Персональную ответственность руководителей"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-white text-xs">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                          {i + 1}
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              {/* Regulatory Cards */}
              <div className="grid grid-cols-1 gap-3">
                {[
                  {
                    number: "01",
                    title: "ПП РФ №1046",
                    date: "от 03.08.2024",
                    description: "Защита объектов ТЭК от дронов",
                    color: "from-blue-500 to-cyan-500"
                  },
                  {
                    number: "02",
                    title: "ПП РФ №258",
                    date: "от 03.03.2024",
                    description: "Безопасность предприятий от БПЛА",
                    color: "from-purple-500 to-pink-500"
                  },
                  {
                    number: "03",
                    title: "ФЗ №390-ФЗ",
                    date: "«О безопасности»",
                    description: "Безопасность стратегических объектов",
                    color: "from-orange-500 to-red-500"
                  },
                  {
                    number: "04",
                    title: "СП 542.1325800",
                    date: "действующий",
                    description: "Проектирование защитных конструкций",
                    color: "from-green-500 to-emerald-500"
                  }
                ].map((regulation, i) => (
                  <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      className="group relative bg-white dark:bg-gray-800 rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${regulation.color}`} />
                    <div className="flex items-start gap-3">
                      <div
                          className={`flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br ${regulation.color} flex items-center justify-center text-white font-bold text-xs shadow-lg`}>
                        {regulation.number}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-xs font-bold text-gray-900 dark:text-white">
                            {regulation.title}
                          </p>
                          <span className="text-[10px] text-gray-500 dark:text-gray-400">
                            {regulation.date}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          {regulation.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Info Note */}
              <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 text-center"
              >
                <p className="text-white text-xs mb-2">
                  <Shield className="w-4 h-4 inline-block mr-1 -mt-0.5 text-green-400" />
                  Установка ЗОК и ограждение периметра регулируется государством
                </p>
                <Link
                    to="/contacts"
                    className="text-blue-400 hover:text-blue-300 text-xs font-semibold transition-colors inline-flex items-center gap-1"
                >
                  <span>Узнать подробнее о соответствии требованиям</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </motion.div>
            </motion.div>
          </div>

        </div>

        {/* Bottom Gradient Fade for smooth transition */}
        <div className="absolute bottom-0 left-0 right-0 h-[500px] bg-gradient-to-b from-transparent via-red-50/50 to-red-50 dark:via-red-950/60 dark:to-red-950/80 pointer-events-none" />
      </section>

      {/* Protection Levels Section - Космическая версия */}
      <section className="relative bg-black py-8 overflow-hidden">
        {/* Top gradient overlay for smooth transition */}
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />

        {/* Фоновый эффект звездного неба */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20px 20px, rgba(255,255,255,0.05) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>

        {/* Анимированные линии */}
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent animate-pulse"></div>
        <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent animate-pulse delay-1000"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
          >
      <span className="inline-block px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-purple-300 text-sm mb-4">
        • ТРИ УРОВНЯ ЗАЩИТЫ •
      </span>
            <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-blue-200 mb-6">
              3 стадии успешной реализации проекта
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              От идеи до полноценной защиты — комплексный подход к безопасности вашего объекта
            </p>
          </motion.div>

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Level 1 - Расчет стоимости (Фиолетовая) */}
              <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="group relative"
              >
                <div className="relative backdrop-blur-xl bg-gradient-to-br from-purple-500/20 via-fuchsia-500/10 to-pink-500/20 rounded-3xl p-8 border border-white/20 shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/10 to-fuchsia-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>

                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent"></div>

                  <div className="relative">
                    <div className="flex items-center justify-between mb-6">
                      <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/20">
                        <Award className="w-4 h-4 text-purple-300" />
                        <span className="font-semibold text-sm tracking-wider">СТАДИЯ 1</span>
                      </div>
                      <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                  Бесплатно
                </span>
                    </div>

                    <h3 className="text-3xl font-bold text-white mb-3 leading-tight">
                      Расчет стоимости <br/>защиты
                    </h3>

                    <p className="text-purple-200/80 mb-6">
                      Индивидуальное комплексное решение для вашего объекта
                    </p>

                    <div className="space-y-3 mb-6">
                      {[
                        "Расчет стоимости системы защиты",
                        "Индивидуальный подход к вашему объекту",
                        "Проект с учётом климатических условий",
                        "Оптимальное решение по цене и эффективности"
                      ].map((item, i) => (
                          <div key={i} className="flex items-start gap-3 group/item">
                            <div className="relative">
                              <div className="absolute inset-0 bg-purple-400 rounded-full blur-md opacity-0 group-hover/item:opacity-50 transition-opacity"></div>
                              <CheckCircle className="relative w-5 h-5 text-purple-300 flex-shrink-0 mt-0.5" />
                            </div>
                            <span className="text-sm text-gray-300">{item}</span>
                          </div>
                      ))}
                    </div>

                    <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-xs text-purple-300/70 mb-2">ПОДХОДИТ ДЛЯ:</p>
                      <div className="flex flex-wrap gap-1">
                        {["Порты", "Аэропорты", "ТЭЦ", "ЦОД", "Хим. производства"].map((tag, i) => (
                            <span key={i} className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
                      {tag}
                    </span>
                        ))}
                      </div>
                    </div>

                    <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); setIsEstimateModalOpen(true); }}
                        className="group/btn relative flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold overflow-hidden transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                      <span className="relative text-white">Получить бесплатный расчет</span>
                      <ChevronRight className="relative w-5 h-5 text-white group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Level 2 - Защита от БПЛА (Красная/Оранжевая) */}
              <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="group relative"
              >
                <div className="relative backdrop-blur-xl bg-gradient-to-br from-red-500/20 via-orange-500/10 to-yellow-500/20 rounded-3xl p-8 border border-white/20 shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-600/10 to-orange-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-500 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-orange-500 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>

                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent"></div>

                  <div className="relative">
                    <div className="flex items-center justify-between mb-6">
                      <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/20">
                        <Shield className="w-4 h-4 text-red-300" />
                        <span className="font-semibold text-sm tracking-wider">СТАДИЯ 2</span>
                      </div>
                      <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-300 to-orange-300">
                  До 400 кг
                </span>
                    </div>

                    <h3 className="text-3xl font-bold text-white mb-3 leading-tight">
                      Защита от <br/>БПЛА
                    </h3>

                    <p className="text-red-200/80 mb-6">
                      Быстровозводимые конструкции с трёхуровневой защитой
                    </p>

                    <div className="space-y-3 mb-6">
                      {[
                        "Стальной каркас с сеткой",
                        "Монтаж на опоры-колонны",
                        "Индивидуальный расчёт фундамента",
                        "Антикоррозийное покрытие"
                      ].map((item, i) => (
                          <div key={i} className="flex items-start gap-3 group/item">
                            <div className="relative">
                              <div className="absolute inset-0 bg-red-400 rounded-full blur-md opacity-0 group-hover/item:opacity-50 transition-opacity"></div>
                              <Shield className="relative w-5 h-5 text-red-300 flex-shrink-0 mt-0.5" />
                            </div>
                            <span className="text-sm text-gray-300">{item}</span>
                          </div>
                      ))}
                    </div>

                    <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-xs text-red-300/70 mb-2">ЗАЩИЩАЕМ:</p>
                      <div className="flex flex-wrap gap-1">
                        {["Нефтебазы", "Газовые объекты", "Заводы", "Мосты", "Плотины"].map((tag, i) => (
                            <span key={i} className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
                      {tag}
                    </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4 p-3 rounded-lg bg-red-950/30 border border-red-500/30">
                      <p className="text-xs text-red-200/80">
                        <span className="font-bold">Главная задача:</span> предотвращение столкновения БПЛА с объектом
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Level 3 - Эксплуатация и сервис (Зеленая/Голубая) */}
              <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="group relative"
              >
                <div className="relative backdrop-blur-xl bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-teal-500/20 rounded-3xl p-8 border border-white/20 shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600/0 via-green-600/10 to-teal-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-500 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-teal-500 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>

                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent"></div>

                  <div className="relative">
                    <div className="flex items-center justify-between mb-6">
                      <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/20">
                        <CheckCircle className="w-4 h-4 text-green-300" />
                        <span className="font-semibold text-sm tracking-wider">СТАДИЯ 3</span>
                      </div>
                      <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-teal-300">
                  25+ лет
                </span>
                    </div>

                    <h3 className="text-3xl font-bold text-white mb-3 leading-tight">
                      Эксплуатация <br/>и сервис
                    </h3>

                    <p className="text-green-200/80 mb-6">
                      Минимальные затраты на всём жизненном цикле
                    </p>

                    <div className="space-y-3 mb-6">
                      {[
                        "Проектирование под минимальные затраты",
                        "Бесперебойная эксплуатация",
                        "Быстрое восстановление после атак",
                        "Полный цикл: от идеи до сервиса"
                      ].map((item, i) => (
                          <div key={i} className="flex items-start gap-3 group/item">
                            <div className="relative">
                              <div className="absolute inset-0 bg-green-400 rounded-full blur-md opacity-0 group-hover/item:opacity-50 transition-opacity"></div>
                              <CheckCircle className="relative w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                            </div>
                            <span className="text-sm text-gray-300">{item}</span>
                          </div>
                      ))}
                    </div>

                    <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-xs text-green-300/70 mb-2">ПОЛНЫЙ ЦИКЛ РАБОТ:</p>
                      <div className="flex flex-wrap gap-1">
                        {["Проектирование", "Изготовление", "Монтаж", "АКЗ", "Сервис"].map((tag, i) => (
                            <span key={i} className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
                      {tag}
                    </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4 grid grid-cols-3 gap-2">
                      {[
                        { label: "Проектов", value: "20+" },
                        { label: "Лет опыта", value: "12" },
                        { label: "Объектов", value: "100+" }
                      ].map((stat, i) => (
                          <div key={i} className="text-center p-2 rounded-lg bg-white/5 border border-white/10">
                            <div className="text-lg font-bold text-white">{stat.value}</div>
                            <div className="text-xs text-gray-400">{stat.label}</div>
                          </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom Gradient Fade for smooth transition */}
        <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-b from-transparent via-black/50 to-gray-50 dark:via-purple-900/30 dark:to-gray-900 pointer-events-none" />
      </section>

      <ProjectEstimateModal
        isOpen={isEstimateModalOpen}
        onClose={() => setIsEstimateModalOpen(false)}
        onSubmit={handleEstimateSubmit}
      />

      {/* Visualization Section */}
      <section className="relative py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
        {/* Top gradient overlay for smooth transition */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-50 dark:from-gray-900 to-transparent pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
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
            {/*<ZOKVisualization enableControls={false}/>*/}
            <img src="/ZOK.gif" alt="#s"/>
            <button
                onClick={() => setIsModalOpen(true)}
                className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/80 backdrop-blur-sm text-gray-800 hover:bg-white transition-all shadow-lg"
                aria-label="Открыть в полноэкранном режиме"
            >
              <Maximize2 className="w-5 h-5"/>
            </button>

            <FullscreenModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
              {/*<ZOKVisualization enableControls={true}/>*/}
              <img src="/ZOK.gif" alt="#s"/>
            </FullscreenModal>
          </div>

          <motion.div
              initial={{opacity: 0, y: 50}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              className="text-center pt-16"
          >
          </motion.div>
        </div>

        {/* Bottom Gradient Fade for smooth transition */}
        <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-b from-transparent via-white/50 to-gray-50 dark:via-gray-900/30 dark:to-gray-950 pointer-events-none" />
      </section>

      {/* Features Section */}
      <section className="relative py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
        {/* Top gradient overlay for smooth transition */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white dark:from-gray-950 to-transparent pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
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

        {/* Bottom Gradient Fade for smooth transition */}
        <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-b from-transparent via-gray-50/50 to-gray-50 dark:via-gray-900/50 dark:to-gray-900 pointer-events-none" />
      </section>

      {/* Applications Section */}
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

        {/* Bottom Gradient Fade for smooth transition */}
        <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-b from-transparent via-white/50 to-gray-50 dark:via-gray-900/50 dark:to-gray-900 pointer-events-none" />
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
            question: "Что такое система защиты периметра от БПЛА?",
            answer: "Система защиты периметра от беспилотных летательных аппаратов (БПЛА) - это комплекс технических средств, предназначенных для обнаружения, идентификации и нейтрализации беспилотников, которые могут представлять угрозу для охраняемого объекта."
          },
          {
            question: "Как работает система защиты?",
            answer: "Инновационное решение в защите от дронов и БПЛА.Наша система использует многоуровневый подход: физические барьеры в виде прочных металлических конструкций. Используем металлическую сетку в 3 уровня. Это позволяет эффективно противодействовать различным типам беспилотников."
          },
          {
            question: "Какие объекты можно защитить с помощью вашей системы?",
            answer: "Мы обеспечиваем защиту промышленных объектов, государственных учреждений, объектов критической инфраструктуры, частного бизнеса и других стратегически важных сооружений."
          },
          {
            question: "Какова эффективность вашей системы защиты?",
            answer: "Наша система обеспечивает 99.9% эффективности в защите охраняемой территории от проникновения беспилотных летательных аппаратов при правильной установке и настройке."
          },
          {
            question: "Какие гарантии вы предоставляете на систему защиты?",
            answer: "Мы предоставляем 10 лет гарантии на наши системы защиты периметра от БПЛА, включая обслуживание и техническую поддержку."
          }
        ]}
        title="Часто задаваемые вопросы о защите от дронов"
        subtitle="Ответы на наиболее популярные вопросы о системах защиты периметра от беспилотников"
      />
      {/* Callback Modal */}
      <CallbackModal
        isOpen={isCallbackModalOpen}
        onClose={() => setIsCallbackModalOpen(false)}
        callbackForm={callbackForm}
        isCallbackSubmitting={isCallbackSubmitting}
        callbackSuccess={callbackSuccess}
        phoneError={phoneError}
        handleCallbackChange={handleCallbackChange}
        handlePhoneChange={handlePhoneChange}
        handlePhoneBlur={handlePhoneBlur}
        handlePhoneFocus={handlePhoneFocus}
        handleSubmit={onCallbackSubmit}
      />
      </div>
    </div>
  );
};

export default DroneDefensePage;