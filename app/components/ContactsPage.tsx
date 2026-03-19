import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import {
  Shield,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  ArrowRight,
  Headset,
  Clock,
  CheckCircle,
  Users,
  Building2
} from 'lucide-react';
import ContactForm from "~/components/ContactForm";
import Breadcrumbs, { type BreadcrumbItem } from './Breadcrumbs';
import { useCallbackForm } from '../hooks/useCallbackForm';
import { CallbackModal } from './CallbackModal';

interface ContactsPageProps {
  breadcrumbs?: BreadcrumbItem[];
}

const ContactsPage: React.FC<ContactsPageProps> = ({ breadcrumbs }) => {
  const { theme } = useTheme();
  const [scrollY, setScrollY] = useState(0);

  // Хук для формы обратного звонка
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
  } = useCallbackForm('ContactsPage - обратный звонок');

  // Обработчик отправки формы
  const onCallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleCallbackSubmit(
      'ContactsPage - обратный звонок',
      '📞 Новое сообщение на обратный звонок'
    );
  };

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
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">Свяжитесь с нами</span>
                </motion.div>

                {/* Main heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black"
                >
                  <div className={theme === 'dark' ? 'text-white' : 'text-black'}>Свяжитесь</div>
                  <div className={theme === 'dark' ? 'text-white' : 'text-black'}>С Нами</div>
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                    Удобным способом
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
                  Мы всегда на связи и готовы ответить на все ваши вопросы. Обратитесь к нам любым удобным способом, и мы свяжемся с вами в ближайшее время.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4"
                >
                  <a
                      href="tel:+79312470888"
                      className={`group inline-flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 text-white px-4 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 text-xs sm:text-sm md:text-base ${
                          theme === 'dark'
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                              : 'bg-gradient-to-r from-blue-600 to-purple-600'
                      }`}
                  >
                    <span>Позвонить</span>
                    <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </a>

                  <button
                      onClick={() => setIsCallbackModalOpen(true)}
                      className={`group inline-flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 px-4 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-xl font-semibold border transition-all duration-300 text-xs sm:text-sm md:text-base ${
                          theme === 'dark'
                              ? 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700 hover:border-gray-600'
                              : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                      }`}
                  >
                    <span>Заказать звонок</span>
                    <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </button>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4"
                >
                  {[
                    { value: "12+", label: "Лет опыта" },
                    { value: "100+", label: "Проектов" },
                  ].map((stat, i) => (
                      <div key={i} className={`text-center p-2 sm:p-3 md:p-4 rounded-xl backdrop-blur-sm shadow-lg transition-all duration-300 ${
                          theme === 'dark'
                              ? 'bg-gray-800/50 border border-gray-700 hover:border-blue-500/50'
                              : 'bg-white border border-gray-200 hover:border-blue-400'
                      }`}>
                        <div className={`text-lg sm:text-xl md:text-2xl font-bold ${
                            theme === 'dark' ? 'text-white' : 'text-black'
                        }`}>{stat.value}</div>
                        <div className={`text-[10px] sm:text-xs md:text-sm ${
                            theme === 'dark' ? 'text-white/90' : 'text-gray-600'
                        }`}>{stat.label}</div>
                      </div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Right column - Contact Form */}
              <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
              >
                <ContactForm theme={theme}/>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Cards Section */}
        <section className={`relative overflow-hidden py-8 ${
          theme === 'dark'
              ? 'bg-neutral-900'
              : 'bg-white '
        }`}>
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 right-0 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="absolute bottom-20 left-0 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl" />
          </div>

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
                          ? 'bg-neutral-900'
                          : 'bg-white border border-gray-200'
                  }`}>
                <Headset className="w-4 h-4"/>
                <span className="text-sm font-medium">Наши контакты</span>
              </div>
              <h2 className={`text-3xl md:text-4xl lg:text-5xl font-black mb-6 ${
                  theme === 'dark' ? 'text-white' : 'text-black'
              }`}>
                Свяжитесь с нами
              </h2>
              <p className={`text-lg md:text-xl max-w-3xl mx-auto ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Наши специалисты всегда готовы ответить на ваши вопросы
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {[
                {
                  icon: Phone,
                  title: "Телефон/факс",
                  description: "8 (81378) 40-235",
                  gradient: "from-blue-500 to-cyan-500",
                  bgGradient: "from-blue-900/30 to-cyan-900/30",
                  link: "tel:+78137840235"
                },
                {
                  icon: Phone,
                  title: "Генеральный директор",
                  description: "+7 931 247-08-88",
                  gradient: "from-purple-500 to-pink-500",
                  bgGradient: "from-purple-900/30 to-pink-900/30",
                  link: "tel:+79312470888"
                },
                {
                  icon: Phone,
                  title: "Отдел снабжения",
                  description: "+7 921 340 36 16",
                  gradient: "from-orange-500 to-red-500",
                  bgGradient: "from-orange-900/30 to-red-900/30",
                  link: "tel:+79213403616"
                },
                {
                  icon: Phone,
                  title: "Отдел кадров",
                  description: "+7 921 591-65-06",
                  gradient: "from-green-500 to-emerald-500",
                  bgGradient: "from-green-900/30 to-emerald-900/30",
                  link: "tel:+79215916506"
                },
                {
                  icon: Mail,
                  title: "Email",
                  description: "l-legion@bk.ru",
                  gradient: "from-indigo-500 to-blue-500",
                  bgGradient: "from-indigo-900/30 to-blue-900/30",
                  link: "mailto:l-legion@bk.ru"
                },
                {
                  icon: MapPin,
                  title: "Адрес",
                  description: "Ленинградская обл., г. Светогорск, ул. Максима Горького, д. 7",
                  gradient: "from-amber-500 to-orange-500",
                  bgGradient: "from-amber-900/30 to-orange-900/30",
                  link: null
                },
                {
                  icon: Shield,
                  title: "Реквизиты",
                  description: "ИНН 7802808155 | КПП 470401001",
                  gradient: "from-violet-500 to-purple-500",
                  bgGradient: "from-violet-900/30 to-purple-900/30",
                  link: null
                },
                {
                  icon: Clock,
                  title: "Часы работы",
                  description: "Пн-Пт: 9:00 - 18:00 | Сб-Вс: выходной",
                  gradient: "from-rose-500 to-pink-500",
                  bgGradient: "from-rose-900/30 to-pink-900/30",
                  link: null
                }
              ].map((contact, i) => {
                const Icon = contact.icon;
                return (
                  <motion.div
                      key={i}
                      initial={{opacity: 0, y: 30}}
                      whileInView={{opacity: 1, y: 0}}
                      viewport={{once: true}}
                      transition={{delay: i * 0.1}}
                      whileHover={{ y: -12, scale: 1.03 }}
                      className="group relative"
                  >
                    {/* Pulsing glow effect */}
                    <div
                        className={`absolute inset-0 rounded-[2rem] bg-gradient-to-r ${contact.gradient} opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500 pointer-events-none`}
                        style={{
                          animation: `pulse ${2 + i * 0.5}s cubic-bezier(0.4, 0, 0.6, 1) infinite`
                        }}
                    />

                    {contact.link ? (
                        <a
                            href={contact.link}
                            className={`relative overflow-hidden rounded-[2rem] p-8 h-full flex flex-col transition-all duration-500 shadow-xl hover:shadow-2xl border hover:border-transparent ${
                              theme === 'dark'
                                ? `bg-gradient-to-br ${contact.bgGradient} border-gray-700/50`
                                : `bg-white border-gray-200`
                            }`}
                            style={{
                              backgroundSize: '200% 200%',
                              animation: `gradient-shift ${3 + i * 0.7}s ease infinite`
                            }}
                        >
                          <div className="relative mb-6">
                            <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${contact.gradient} shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ${
                              theme === 'dark' ? 'text-white' : 'text-black'
                            }`}>
                              <Icon className="w-8 h-8" />
                            </div>
                            {/* Small decorative dots */}
                            <div className="absolute -bottom-2 -right-2 flex gap-1">
                              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${contact.gradient} opacity-60`} />
                              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${contact.gradient} opacity-40`} />
                            </div>
                          </div>

                          <h3 className={`text-xl font-black mb-4 tracking-tight ${
                            theme === 'dark' ? 'text-white' : 'text-black'
                          }`}>
                            {contact.title}
                          </h3>

                          <p className={`flex-grow leading-relaxed text-base ${
                            theme === 'dark' ? 'text-white/90' : 'text-gray-600'
                          }`}>
                            {contact.description}
                          </p>
                        </a>
                    ) : (
                        <div
                            className={`relative overflow-hidden rounded-[2rem] p-8 h-full flex flex-col transition-all duration-500 shadow-xl hover:shadow-2xl border hover:border-transparent ${
                              theme === 'dark'
                                ? `bg-gradient-to-br ${contact.bgGradient} border-gray-700/50`
                                : `bg-white border-gray-200`
                            }`}
                            style={{
                              backgroundSize: '200% 200%',
                              animation: `gradient-shift ${3 + i * 0.7}s ease infinite`
                            }}
                        >
                          <div className="relative mb-6">
                            <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${contact.gradient} shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ${
                              theme === 'dark' ? 'text-white' : 'text-black'
                            }`}>
                              <Icon className="w-8 h-8" />
                            </div>
                            {/* Small decorative dots */}
                            <div className="absolute -bottom-2 -right-2 flex gap-1">
                              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${contact.gradient} opacity-60`} />
                              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${contact.gradient} opacity-40`} />
                            </div>
                          </div>

                          <h3 className={`text-xl font-black mb-4 tracking-tight ${
                            theme === 'dark' ? 'text-white' : 'text-black'
                          }`}>
                            {contact.title}
                          </h3>

                          <p className={`flex-grow leading-relaxed text-base ${
                            theme === 'dark' ? 'text-white/90' : 'text-gray-600'
                          }`}>
                            {contact.description}
                          </p>
                        </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className={`relative py-8 overflow-hidden ${
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
                          ? 'bg-purple-900/30 text-purple-400 border border-purple-800/30'
                          : 'bg-purple-100 text-purple-600 border border-purple-200'
                  }`}>
                <MapPin className="w-4 h-4"/>
                <span className="text-sm font-medium">Как нас найти</span>
              </div>
            </motion.div>

            <motion.div
                initial={{opacity: 0, y: 50}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                className="max-w-6xl mx-auto"
            >
              <div className={`relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 ${
                theme === 'dark' ? 'border-gray-800' : 'border-white'
              }`}>
                <iframe
                    src="https://yandex.ru/map-widget/v1/?ll=28.935041%2C61.109662&z=17&l=map&pt=28.935041%2C61.109662,pm2rdm&mode=search&text=%D0%A1%D1%82%D1%80%D0%BE%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D0%B0%D1%8F%20%D0%BA%D0%BE%D0%BC%D0%BF%D0%B0%D0%BD%D0%B8%D1%8F%20Legion%2C%20%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%20%D0%A1%D0%B2%D0%B5%D1%82%D0%BE%D0%B3%D0%BE%D1%80%D1%81%D0%BA%2C%20%D1%83%D0%BB%D0%B8%D1%86%D0%B0%20%D0%9C%D0%B0%D0%BA%D1%81%D0%B8%D0%BC%D0%B0%20%D0%93%D0%BE%D1%80%D1%8C%D0%BA%D0%BE%D0%B3%D0%BE%2C%207"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allowFullScreen={true}
                    title="Карта - Офис компании ООО 'ЛЕГИОН'"
                    className="w-full h-full"
                    style={{position: 'relative', border: 0}}
                />

                {/* Overlay with address info */}
                <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8">
                  <div className={`rounded-2xl p-4 md:p-6 backdrop-blur-md shadow-2xl ${
                    theme === 'dark'
                      ? 'bg-gray-900/90 border border-gray-700/50'
                      : 'bg-white/90 border border-gray-200'
                  }`}>
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="p-2 md:p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
                        <MapPin className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-lg md:text-xl font-bold mb-1 md:mb-2 ${
                          theme === 'dark' ? 'text-white' : 'text-black'
                        }`}>Наш офис</h3>
                        <p className={`text-sm md:text-base mb-2 md:mb-3 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          188992, Ленинградская обл., Выборгский район, г. Светогорск, ул. Максима Горького, д. 7
                        </p>
                        <a
                            href="https://yandex.ru/maps/-/CPUuiH9f"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm md:text-base font-semibold text-blue-500 hover:text-blue-400 transition-colors"
                        >
                          <span>Открыть в Яндекс Картах</span>
                          <ArrowRight className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={`relative py-24 overflow-hidden ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600'
            : 'bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400'
        }`}>
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-20 z-0">
            <div className="absolute top-20 left-20 w-60 h-60 rounded-full bg-white/10 blur-3xl animate-blob" />
            <div className="absolute bottom-20 right-20 w-60 h-60 rounded-full bg-white/10 blur-3xl animate-blob animation-delay-2000" />
            <div className="absolute top-1/2 left-1/2 w-60 h-60 rounded-full bg-white/10 blur-3xl animate-blob animation-delay-4000" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
                initial={{opacity: 0, y: 50}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                className="text-center"
            >
              <div className={`inline-flex items-center gap-2 backdrop-blur-sm rounded-full px-4 py-2 mb-4 border ${
                theme === 'dark'
                  ? 'bg-white/20 border-white/30'
                  : 'bg-black/10 border-black/20'
              }`}>
                <Building2 className={`w-4 h-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}/>
                <span className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Начать сотрудничество</span>
              </div>

              <h2 className={`text-3xl md:text-4xl lg:text-5xl font-black mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Готовы начать проект?
              </h2>

              <p className={`text-lg md:text-xl max-w-3xl mx-auto mb-10 ${
                theme === 'dark' ? 'text-white/90' : 'text-gray-900'
              }`}>
                Свяжитесь с нами прямо сейчас и получите консультацию от наших экспертов.
                Мы поможем реализовать ваш проект с учетом всех требований.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                    href="tel:+78137840235"
                    className={`group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 ${
                      theme === 'dark'
                        ? 'bg-white text-gray-900'
                        : 'bg-gray-900 text-white'
                    }`}
                >
                  <Phone className="w-5 h-5"/>
                  <span className={theme === 'dark' ? 'text-gray-900' : 'text-white'}>Позвонить нам</span>
                </a>

                <a
                    href="mailto:l-legion@bk.ru"
                    className={`group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold border-2 transition-all duration-300 ${
                      theme === 'dark'
                        ? 'bg-transparent text-white border-white hover:bg-white/10'
                        : 'bg-transparent text-gray-900 border-gray-900 hover:bg-gray-900/10'
                    }`}
                >
                  <Mail className="w-5 h-5"/>
                  <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Написать письмо</span>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

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
  );
};

export default ContactsPage;
