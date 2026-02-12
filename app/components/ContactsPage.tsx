import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { Shield, Building2, Target, Zap, Award, Clock, Users, CheckCircle, ChevronRight, ArrowRight, Mail, Phone, MapPin, MessageSquare, Send } from 'lucide-react';
import { useFetcher } from 'react-router';

const ContactsPage: React.FC = () => {
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
      <section className="relative min-h-screen flex items-center overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-purple-600/10" />
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
                <span className="text-sm font-medium text-white">Свяжитесь с нами</span>
              </motion.div>

              {/* Main heading */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white"
              >
                <span className="block">Свяжитесь</span>
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  С Нами
                </span>
                <span className="block">Удобным способом</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-300 max-w-2xl"
              >
                Мы всегда на связи и готовы ответить на все ваши вопросы. 
                Обратитесь к нам любым удобным способом, и мы свяжемся с вами в ближайшее время.
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {[
                  { value: "24/7", label: "Поддержка" },
                  { value: "12+", label: "Лет опыта" },
                  { value: "100+", label: "Проектов" },
                  { value: "98%", label: "Удовлетворенность" },
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
                  href="tel:+78137840235"
                  className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <Phone className="w-5 h-5" />
                  <span>Позвонить</span>
                </a>

                <a
                  href="mailto:l-legion@bk.ru"
                  className="group inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <Mail className="w-5 h-5" />
                  <span>Написать</span>
                </a>
              </motion.div>
            </motion.div>

            {/* Right column - Contact info cards */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-6"
            >
              {[
                {
                  icon: <Phone className="w-6 h-6" />,
                  title: "Телефон/факс",
                  description: "8 (81378) 40-235",
                  color: "from-blue-500 to-cyan-500",
                  link: "tel:+78137840235"
                },
                {
                  icon: <Phone className="w-6 h-6" />,
                  title: "Генеральный директор",
                  description: "+7 931 247-08-88",
                  color: "from-purple-500 to-pink-500",
                  link: "tel:+79312470888"
                },
                {
                  icon: <Phone className="w-6 h-6" />,
                  title: "Отдел снабжения",
                  description: "+7 921 340 36 16",
                  color: "from-orange-500 to-red-500",
                  link: "tel:+79213403616"
                },
                {
                  icon: <Mail className="w-6 h-6" />,
                  title: "Email",
                  description: "l-legion@bk.ru",
                  color: "from-green-500 to-emerald-500",
                  link: "mailto:l-legion@bk.ru"
                }
              ].map((contact, i) => (
                <motion.a
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  whileHover={{ x: -10 }}
                  href={contact.link}
                  className="group block bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${contact.color}`}>
                      {contact.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{contact.title}</h3>
                      <p className="text-gray-300">{contact.description}</p>
                    </div>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Наши контактные данные
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Наши специалисты всегда готовы ответить на ваши вопросы и помочь с любыми задачами
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <MapPin className="w-8 h-8" />,
                title: "Адрес",
                description: "188992, Ленинградская обл., Выборгский район, г. Светогорск, ул. Максима Горького, д. 7",
                color: "from-blue-500 to-cyan-500",
                link: null
              },
              {
                icon: <Phone className="w-8 h-8" />,
                title: "Телефон/факс",
                description: "8 (81378) 40-235",
                color: "from-purple-500 to-pink-500",
                link: "tel:+78137840235"
              },
              {
                icon: <Phone className="w-8 h-8" />,
                title: "Генеральный директор",
                description: "+7 931 247-08-88",
                color: "from-orange-500 to-red-500",
                link: "tel:+79312470888"
              },
              {
                icon: <Phone className="w-8 h-8" />,
                title: "Отдел снабжения",
                description: "+7 921 340 36 16",
                color: "from-green-500 to-emerald-500",
                link: "tel:+79213403616"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Отдел кадров",
                description: "+7 921 591-65-06",
                color: "from-indigo-500 to-blue-500",
                link: "tel:+79215916506"
              },
              {
                icon: <Mail className="w-8 h-8" />,
                title: "Email",
                description: "l-legion@bk.ru",
                color: "from-yellow-500 to-orange-500",
                link: "mailto:l-legion@bk.ru"
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Реквизиты",
                description: "ИНН 7802808155\nКПП 470401001\nОГРН 1127847628820",
                color: "from-indigo-500 to-purple-500",
                link: null
              }
            ].map((contact, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                {contact.link ? (
                  <a
                    href={contact.link}
                    className="relative block bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                  >
                    <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white mb-6">
                      {contact.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      {contact.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                      {contact.description}
                    </p>
                  </a>
                ) : (
                  <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white mb-6">
                      {contact.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      {contact.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                      {contact.description}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Обратная связь
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Оставьте заявку, и наши специалисты свяжутся с вами в ближайшее время
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <ContactForm theme={theme} />
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
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
            <div className="relative h-96">
              <img
                src="https://images.unsplash.com/photo-1569163139394-de4e4f7bf67b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Офис компании ООО 'ЛЕГИОН'"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-center">
                <div className="text-center p-8">
                  <MapPin className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">188992, Ленинградская обл.</h3>
                  <p className="text-blue-200 mb-2">Выборгский район, г. Светогорск</p>
                  <p className="text-blue-200">ул. Максима Горького, д. 7</p>
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
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
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
                <Phone className="w-5 h-5" />
                <span>Позвонить нам</span>
              </a>

              <a
                href="mailto:l-legion@bk.ru"
                className="group inline-flex items-center justify-center gap-3 bg-transparent text-white px-8 py-4 rounded-xl font-semibold border-2 border-white hover:bg-white/10 transition-all duration-300"
              >
                <Mail className="w-5 h-5" />
                <span>Написать письмо</span>
              </a>
            </div>

            <p className="mt-8 opacity-75">
              Или посетите нас: <span className="font-bold">188992, Ленинградская обл., г. Светогорск</span>
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

// Contact Form Component
const ContactForm: React.FC<{ theme: string }> = ({ theme }) => {
  const fetcher = useFetcher();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if consent checkbox is checked
    const consentCheckbox = document.getElementById('consent') as HTMLInputElement;
    if (!consentCheckbox.checked) {
      setSubmitStatus({
        type: 'error',
        message: 'Пожалуйста, дайте согласие на обработку персональных данных'
      });
      return;
    }

    try {
      // Submit form directly to Netlify function
      const response = await fetch('/.netlify/functions/telegram-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus({
          type: 'success',
          message: result.message || 'Сообщение успешно отправлено!'
        });

        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        });

        const consentCheckbox = document.getElementById('consent') as HTMLInputElement;
        if (consentCheckbox) {
          consentCheckbox.checked = false;
        }
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.error || 'Ошибка при отправке сообщения'
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Ошибка соединения. Пожалуйста, проверьте подключение к интернету.'
      });
    }
  };

  // Handle submission status based on fetcher state
  useEffect(() => {
    if (fetcher.state === 'submitting') {
      setSubmitStatus(null); // Clear previous status when submitting
    } else if (fetcher.state === 'idle' && fetcher.data) {
      if (fetcher.data.success) {
        setSubmitStatus({
          type: 'success',
          message: fetcher.data.message || 'Сообщение успешно отправлено!'
        });

        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        });

        const consentCheckbox = document.getElementById('consent') as HTMLInputElement;
        if (consentCheckbox) {
          consentCheckbox.checked = false;
        }
      } else {
        // More detailed error reporting
        let errorMessage = 'Ошибка при отправке сообщения';

        if (fetcher.data.error) {
          errorMessage = fetcher.data.error;

          // If it's an object, try to get more specific error details
          if (typeof fetcher.data.error === 'object' && fetcher.data.error !== null) {
            if (fetcher.data.error.message) {
              errorMessage = fetcher.data.error.message;
            } else if (fetcher.data.error.error) {
              errorMessage = fetcher.data.error.error;
            }
          }
        } else if (fetcher.data.message) {
          errorMessage = fetcher.data.message;
        }

        setSubmitStatus({
          type: 'error',
          message: errorMessage
        });
      }
    } else if (fetcher.state === 'idle' && fetcher.data === undefined && fetcher.formMethod === 'POST') {
      // Handle case where there's no response data but form was submitted
      setSubmitStatus({
        type: 'error',
        message: 'Ошибка соединения. Пожалуйста, проверьте подключение к интернету.'
      });
    }
  }, [fetcher.state, fetcher.data, fetcher.formMethod]);

  return (
    <div className={`rounded-3xl overflow-hidden shadow-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="p-8 md:p-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Отправить сообщение</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className={`block mb-2 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Ваше имя
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 rounded-lg ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-white border-gray-600'
                    : 'bg-gray-50 text-gray-900 border-gray-300'
                } border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Введите ваше имя"
              />
            </div>

            <div>
              <label htmlFor="email" className={`block mb-2 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 rounded-lg ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-white border-gray-600'
                    : 'bg-gray-50 text-gray-900 border-gray-300'
                } border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Введите ваш email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className={`block mb-2 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Телефон
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg ${
                theme === 'dark'
                  ? 'bg-gray-700 text-white border-gray-600'
                  : 'bg-gray-50 text-gray-900 border-gray-300'
              } border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Введите ваш телефон"
            />
          </div>

          <div>
            <label htmlFor="message" className={`block mb-2 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Сообщение
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={4}
              className={`w-full px-4 py-3 rounded-lg ${
                theme === 'dark'
                  ? 'bg-gray-700 text-white border-gray-600'
                  : 'bg-gray-50 text-gray-900 border-gray-300'
              } border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Введите ваше сообщение"
            ></textarea>
          </div>

          <div className="flex items-start">
            <input
              type="checkbox"
              id="consent"
              className="mt-1 mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="consent" className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Я даю согласие на обработку персональных данных в соответствии с{' '}
              <a href="#" className="text-blue-600 hover:underline">политикой конфиденциальности</a>
            </label>
          </div>

          {submitStatus && (
            <div className={`p-4 rounded-lg ${
              submitStatus.type === 'success'
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
            }`}>
              {submitStatus.message}
            </div>
          )}

          <button
            type="submit"
            disabled={fetcher.state !== 'idle'}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
              fetcher.state !== 'idle'
                ? 'opacity-70 cursor-not-allowed'
                : 'hover:opacity-90 hover:shadow-lg'
            } ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
            }`}
          >
            {fetcher.state !== 'idle' ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Отправка...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Отправить сообщение
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactsPage;