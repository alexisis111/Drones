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
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Send,
  RefreshCw, HardHat, Headset
} from 'lucide-react';
import { useFetcher } from 'react-router';
import ContactForm from "~/components/ContactForm";
import Breadcrumbs, { type BreadcrumbItem } from './Breadcrumbs';

interface ContactsPageProps {
  breadcrumbs?: BreadcrumbItem[];
}

const ContactsPage: React.FC<ContactsPageProps> = ({ breadcrumbs }) => {
  const { theme } = useTheme();
  const [scrollY, setScrollY] = useState(0);

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
        <section className="relative min-h-[60vh] flex items-center overflow-hidden">
          {/* Smooth parallax background effect */}
          <div
              className="absolute inset-0 bg-gradient-to-br from-blue-900 via-gray-900 to-purple-900"
          >
            <div
                className="absolute inset-0 bg-[url('/img/homesImg/contacts.jpeg')] bg-cover bg-center mix-blend-overlay opacity-20"
                style={{
                  transform: 'translateZ(-1px) scale(1.1)',
                  willChange: 'transform',
                  transformStyle: 'preserve-3d'
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"/>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-purple-600/10"/>
          </div>

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
                  initial={{opacity: 0, x: -50}}
                  animate={{opacity: 1, x: 0}}
                  transition={{duration: 0.8}}
                  className="space-y-8"
              >
                {/* Badge */}
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.2}}
                    className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20"
                >
                  <Shield className="w-4 h-4"/>
                  <span className="text-sm font-medium text-white">Свяжитесь с нами</span>
                </motion.div>

                {/* Main heading */}
                <motion.h1
                    initial={{opacity: 0, y: 30}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.3}}
                    className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white"
                >
                  <span className="block">Свяжитесь</span>
                  <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  С Нами
                </span>
                  <span className="block">Удобным способом</span>
                </motion.h1>

                {/* CTA Buttons */}
                <motion.div
                    initial={{opacity: 0, y: 30}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.6}}
                    className="flex flex-wrap gap-4"
                >
                  <a
                      href="tel:+78137840235"
                      className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    <Phone className="w-5 h-5"/>
                    <span>Позвонить</span>
                  </a>
                </motion.div>

                {/* Subtitle */}
                <motion.p
                    initial={{opacity: 0, y: 30}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.4}}
                    className="text-xl text-gray-300 max-w-2xl"
                >
                  Мы всегда на связи и готовы ответить на все ваши вопросы.
                  Обратитесь к нам любым удобным способом, и мы свяжемся с вами в ближайшее время.
                </motion.p>

                {/* Stats */}
                <motion.div
                    initial={{opacity: 0, y: 30}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.5}}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                  {[
                    {value: "24/7", label: "Поддержка"},
                    {value: "12+", label: "Лет опыта"},
                    {value: "100+", label: "Проектов"},
                    {value: "98%", label: "Удовлетворенность"},
                  ].map((stat, i) => (
                      <div key={i}
                           className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                        <div className="text-sm text-gray-400">{stat.label}</div>
                      </div>
                  ))}
                </motion.div>

              </motion.div>

              {/* Right column - Contact Form */}
              <motion.div
                  initial={{opacity: 0, x: 50}}
                  animate={{opacity: 1, x: 0}}
                  transition={{duration: 0.8, delay: 0.3}}
              >
                <ContactForm theme={theme}/>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Information Section - Now below hero */}
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
          <div className="container mx-auto px-4">
            <motion.div
                initial={{opacity: 0, y: 50}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                className="text-center mb-16"
            >
              <div
                  className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full px-4 py-2 mb-4">
                <Headset className="w-4 h-4"/>
                <span className="text-sm font-medium">Связь</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Наши контактные данные
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Наши специалисты всегда готовы ответить на ваши вопросы и помочь с любыми задачами
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <Phone className="w-8 h-8"/>,
                  title: "Телефон/факс",
                  description: "8 (81378) 40-235",
                  color: "from-blue-500 to-cyan-500",
                  link: "tel:+78137840235"
                },
                {
                  icon: <Phone className="w-8 h-8"/>,
                  title: "Генеральный директор",
                  description: "+7 931 247-08-88",
                  color: "from-purple-500 to-pink-500",
                  link: "tel:+79312470888"
                },
                {
                  icon: <Phone className="w-8 h-8"/>,
                  title: "Отдел снабжения",
                  description: "+7 921 340 36 16",
                  color: "from-orange-500 to-red-500",
                  link: "tel:+79213403616"
                },
                {
                  icon: <Phone className="w-8 h-8"/>,
                  title: "Отдел кадров",
                  description: "+7 921 591-65-06",
                  color: "from-green-500 to-emerald-500",
                  link: "tel:+79215916506"
                },
                {
                  icon: <Mail className="w-8 h-8"/>,
                  title: "Email",
                  description: "l-legion@bk.ru",
                  color: "from-indigo-500 to-blue-500",
                  link: "mailto:l-legion@bk.ru"
                },
                {
                  icon: <MapPin className="w-8 h-8"/>,
                  title: "Адрес",
                  description: "188992, Ленинградская обл., Выборгский район, г. Светогорск, ул. Максима Горького, д. 7",
                  color: "from-yellow-500 to-orange-500",
                  link: null
                },
                {
                  icon: <Shield className="w-8 h-8"/>,
                  title: "Реквизиты",
                  description: "ИНН 7802808155\nКПП 470401001\nОГРН 1127847628820",
                  color: "from-indigo-500 to-purple-500",
                  link: null
                },
                {
                  icon: <Users className="w-8 h-8"/>,
                  title: "Часы работы",
                  description: "Пн-Пт: 9:00 - 18:00\nСб-Вс: выходной",
                  color: "from-pink-500 to-rose-500",
                  link: null
                }
              ].map((contact, i) => (
                  <motion.div
                      key={i}
                      initial={{opacity: 0, y: 30}}
                      whileInView={{opacity: 1, y: 0}}
                      viewport={{once: true}}
                      transition={{delay: i * 0.1}}
                      className="group relative"
                  >
                    <div
                        className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"/>
                    {contact.link ? (
                        <a
                            href={contact.link}
                            className="relative block bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                        >
                          <div
                              className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${contact.color} text-white mb-4`}>
                            {contact.icon}
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                            {contact.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line text-sm">
                            {contact.description}
                          </p>
                        </a>
                    ) : (
                        <div
                            className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
                          <div
                              className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${contact.color} text-white mb-4`}>
                            {contact.icon}
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                            {contact.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line text-sm">
                            {contact.description}
                          </p>
                        </div>
                    )}
                  </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
          <div className="container mx-auto px-4">
            <motion.div
                initial={{opacity: 0, y: 50}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Как нас найти
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Наш офис находится в Ленинградской области, Выборгский район, г. Светогорск
              </p>
            </motion.div>

            <div className="max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-2xl">
              <div className="relative h-[500px] w-full">
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
                <div
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none">
                  <div className="p-8">
                    <div className="flex items-start gap-4 text-white">
                      <MapPin className="w-8 h-8 text-blue-400 flex-shrink-0 mt-1"/>
                      <div className="hidden md:block">
                        <h3 className="text-2xl font-bold mb-2">Наш офис</h3>
                        <p className="text-lg text-gray-200">188992, Ленинградская обл., Выборгский район, г.
                          Светогорск, ул. Максима Горького, д. 7</p>
                        <div className="flex gap-4 mt-3">
                          <a
                              href="https://yandex.ru/maps/-/CPUuiH9f"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-300 hover:text-blue-200 transition-colors pointer-events-auto underline"
                          >
                            Открыть в Яндекс Картах
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
          <div className="container mx-auto px-4">
            <motion.div
                initial={{opacity: 0, y: 50}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                className="text-center text-white"
            >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Готовы начать сотрудничество?
              </h2>

              <p className="text-xl opacity-90 max-w-3xl mx-auto mb-12">
                Свяжитесь с нами прямо сейчас и получите консультацию от наших экспертов.
                Мы поможем реализовать ваш проект с учетом всех требований и пожеланий.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                    href="tel:+78137840235"
                    className="group inline-flex items-center justify-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <Phone className="w-5 h-5"/>
                  <span>Позвонить нам</span>
                </a>

                <a
                    href="mailto:l-legion@bk.ru"
                    className="group inline-flex items-center justify-center gap-3 bg-transparent text-white px-8 py-4 rounded-xl font-semibold border-2 border-white hover:bg-white/10 transition-all duration-300"
                >
                  <Mail className="w-5 h-5"/>
                  <span>Написать письмо</span>
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
  );
};


// Contact Form Component
<ContactForm />

export default ContactsPage;