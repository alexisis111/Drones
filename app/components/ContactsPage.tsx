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
  RefreshCw
} from 'lucide-react';
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"/>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-purple-600/10"/>
          </div>

          {/* Content */}
          <div className="relative container mx-auto px-4 z-10">
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
const ContactForm: React.FC<{ theme: string }> = ({ theme }) => {
  const fetcher = useFetcher();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '+7',
    message: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    consent: '',
    captcha: ''
  });
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [countdown, setCountdown] = useState(3);

  // Капча
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, operator: '+', result: 0 });
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaError, setCaptchaError] = useState('');

  // Генерация новой капчи
  const generateCaptcha = () => {
    const operators = ['+', '-'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    let num1, num2, result;

    if (operator === '+') {
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      result = num1 + num2;
    } else {
      num1 = Math.floor(Math.random() * 10) + 5;
      num2 = Math.floor(Math.random() * 5) + 1;
      result = num1 - num2;
    }

    setCaptcha({ num1, num2, operator, result });
    setCaptchaAnswer('');
    setCaptchaError('');
  };

  // Генерация капчи при монтировании компонента
  useEffect(() => {
    generateCaptcha();
  }, []);

  // Таймер для автоматического закрытия при успехе
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;

    if (submitStatus?.type === 'success') {
      // Сброс прогресса
      setProgress(0);
      setCountdown(3);

      // Обновление прогресс-бара
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + (100 / 30); // 30 шагов за 3 секунды
        });
      }, 100);

      // Таймер для сброса статуса (но не закрываем форму, просто убираем сообщение)
      timer = setTimeout(() => {
        setSubmitStatus(null);
        setProgress(0);
        setCountdown(3);
      }, 3000);

      // Обновление счетчика
      const countdownInterval = setInterval(() => {
        setCountdown(prev => Math.max(0, prev - 1));
      }, 1000);

      return () => {
        clearTimeout(timer);
        clearInterval(progressInterval);
        clearInterval(countdownInterval);
      };
    }
  }, [submitStatus]);

  // Валидация имени (только русские и английские буквы)
  const validateName = (name: string): boolean => {
    const nameRegex = /^[A-Za-zА-Яа-яЁё\s]*$/;
    return nameRegex.test(name);
  };

  // Валидация email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Валидация телефона (формат: +7XXX-XXX-XX-XX)
  const validatePhone = (phone: string): boolean => {
    // Проверяем, что поле не пустое и не равно только +7
    if (!phone || phone === '+7') return false;

    const phoneRegex = /^\+7\d{3}-\d{3}-\d{2}-\d{2}$/;
    return phoneRegex.test(phone);
  };

  // Форматирование телефона
  const formatPhone = (value: string): string => {
    let cleaned = value.replace(/[^\d+]/g, '');

    if (cleaned.startsWith('8')) {
      cleaned = '+7' + cleaned.slice(1);
    }

    if (!cleaned.startsWith('+')) {
      cleaned = '+7' + cleaned;
    }

    if (cleaned.length > 12) {
      cleaned = cleaned.slice(0, 12);
    }

    if (cleaned.length > 1) {
      let formatted = '+7';
      const numbers = cleaned.slice(2).replace(/\D/g, '');

      if (numbers.length > 0) {
        formatted += numbers.slice(0, 3);
      }
      if (numbers.length > 3) {
        formatted += '-' + numbers.slice(3, 6);
      }
      if (numbers.length > 6) {
        formatted += '-' + numbers.slice(6, 8);
      }
      if (numbers.length > 8) {
        formatted += '-' + numbers.slice(8, 10);
      }
      return formatted;
    }

    return cleaned;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;

    setErrors(prev => ({ ...prev, [id]: '' }));

    if (id === 'name') {
      if (value && !validateName(value)) {
        setErrors(prev => ({
          ...prev,
          name: 'Имя может содержать только буквы'
        }));
      }
      setFormData(prev => ({ ...prev, [id]: value }));
    }
    else if (id === 'phone') {
      const formattedPhone = formatPhone(value);
      setFormData(prev => ({ ...prev, [id]: formattedPhone }));

      // Проверяем валидность при вводе
      if (formattedPhone && formattedPhone !== '+7') {
        if (!validatePhone(formattedPhone)) {
          setErrors(prev => ({
            ...prev,
            phone: 'Неверный формат телефона. Пример: +7999-999-99-99'
          }));
        }
      }
    }
    else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleBlur = (field: string) => {
    if (field === 'name' && formData.name && !validateName(formData.name)) {
      setErrors(prev => ({
        ...prev,
        name: 'Имя может содержать только буквы'
      }));
    }

    if (field === 'email' && formData.email && !validateEmail(formData.email)) {
      setErrors(prev => ({
        ...prev,
        email: 'Введите корректный email адрес'
      }));
    }

    if (field === 'phone') {
      if (!formData.phone || formData.phone === '+7') {
        setErrors(prev => ({
          ...prev,
          phone: 'Телефон обязателен для заполнения'
        }));
      } else if (!validatePhone(formData.phone)) {
        setErrors(prev => ({
          ...prev,
          phone: 'Неверный формат телефона. Пример: +7999-999-99-99'
        }));
      }
    }
  };

  // Проверка капчи
  const validateCaptcha = (): boolean => {
    const answer = parseInt(captchaAnswer);
    if (isNaN(answer) || answer !== captcha.result) {
      setCaptchaError('Неверный ответ. Пожалуйста, решите пример правильно.');
      generateCaptcha();
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Проверка капчи
    if (!validateCaptcha()) {
      return;
    }

    // Проверка согласия на обработку данных
    const consentCheckbox = document.getElementById('consent') as HTMLInputElement;
    if (!consentCheckbox.checked) {
      setErrors(prev => ({
        ...prev,
        consent: 'Необходимо дать согласие на обработку персональных данных'
      }));
      return;
    }

    // Валидация всех полей перед отправкой
    let hasErrors = false;
    const newErrors = { name: '', email: '', phone: '', consent: '', captcha: '' };

    // Проверка имени
    if (!formData.name) {
      newErrors.name = 'Имя обязательно для заполнения';
      hasErrors = true;
    } else if (!validateName(formData.name)) {
      newErrors.name = 'Имя может содержать только буквы';
      hasErrors = true;
    }

    // Проверка email
    if (!formData.email) {
      newErrors.email = 'Email обязателен для заполнения';
      hasErrors = true;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Введите корректный email адрес';
      hasErrors = true;
    }

    // Проверка телефона (теперь обязательное поле)
    if (!formData.phone || formData.phone === '+7') {
      newErrors.phone = 'Телефон обязателен для заполнения';
      hasErrors = true;
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Неверный формат телефона. Пример: +7999-999-99-99';
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/telegram-webhook', {
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
          phone: '+7',
          message: ''
        });

        setCaptchaAnswer('');
        generateCaptcha();

        setErrors({ name: '', email: '', phone: '', consent: '', captcha: '' });

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
    } finally {
      setIsLoading(false);
    }
  };

  // Handle submission status based on fetcher state
  useEffect(() => {
    if (fetcher.state === 'submitting') {
      setIsLoading(true);
      setSubmitStatus(null);
    } else if (fetcher.state === 'idle' && fetcher.data) {
      setIsLoading(false);
      if (fetcher.data.success) {
        setSubmitStatus({
          type: 'success',
          message: fetcher.data.message || 'Сообщение успешно отправлено!'
        });

        setFormData({
          name: '',
          email: '',
          phone: '+7',
          message: ''
        });

        setCaptchaAnswer('');
        generateCaptcha();

        setErrors({ name: '', email: '', phone: '', consent: '', captcha: '' });

        const consentCheckbox = document.getElementById('consent') as HTMLInputElement;
        if (consentCheckbox) {
          consentCheckbox.checked = false;
        }
      } else {
        let errorMessage = 'Ошибка при отправке сообщения';

        if (fetcher.data.error) {
          errorMessage = fetcher.data.error;
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
      setIsLoading(false);
      setSubmitStatus({
        type: 'error',
        message: 'Ошибка соединения. Пожалуйста, проверьте подключение к интернету.'
      });
    }
  }, [fetcher.state, fetcher.data, fetcher.formMethod]);

  return (
      <div className={`rounded-2xl overflow-hidden shadow-2xl bg-gray-800/90 backdrop-blur-sm max-w-md mx-auto`}>
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white">Оставить заявку</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Поле имени */}
            <div>
              <label htmlFor="name" className="block mb-1 text-xs font-medium text-white/80">
                Ваше имя *
              </label>
              <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={() => handleBlur('name')}
                  required
                  className={`w-full px-3 py-2 text-sm rounded-lg bg-white/10 text-white border ${
                      errors.name ? 'border-red-400' : 'border-white/20'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-white/50`}
                  placeholder="Иван Иванов"
              />
              {errors.name && (
                  <p className="mt-0.5 text-xs text-red-300">{errors.name}</p>
              )}
            </div>

            {/* Поле email */}
            <div>
              <label htmlFor="email" className="block mb-1 text-xs font-medium text-white/80">
                Email *
              </label>
              <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur('email')}
                  required
                  className={`w-full px-3 py-2 text-sm rounded-lg bg-white/10 text-white border ${
                      errors.email ? 'border-red-400' : 'border-white/20'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-white/50`}
                  placeholder="ivan@example.com"
              />
              {errors.email && (
                  <p className="mt-0.5 text-xs text-red-300">{errors.email}</p>
              )}
            </div>

            {/* Поле телефона - теперь обязательное */}
            <div>
              <label htmlFor="phone" className="block mb-1 text-xs font-medium text-white/80">
                Телефон *
              </label>
              <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={() => handleBlur('phone')}
                  className={`w-full px-3 py-2 text-sm rounded-lg bg-white/10 text-white border ${
                      errors.phone ? 'border-red-400' : 'border-white/20'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-white/50`}
                  placeholder="+7 (999) 999-99-99"
              />
              {errors.phone && (
                  <p className="mt-0.5 text-xs text-red-300">{errors.phone}</p>
              )}
              <p className="mt-0.5 text-xs text-white/40">Формат: +7999-999-99-99</p>
            </div>

            {/* Поле сообщения */}
            <div>
              <label htmlFor="message" className="block mb-1 text-xs font-medium text-white/80">
                Сообщение *
              </label>
              <textarea
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-white/10 text-white border border-white/20 focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-white/50"
                  placeholder="Ваше сообщение..."
              ></textarea>
            </div>

            {/* Капча */}
            <div className="p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
              <label className="block mb-1 text-xs font-medium text-white/80">
                Проверка (защита от ботов) *
              </label>

              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 bg-white/20 backdrop-blur-sm p-2 rounded-lg text-center text-base font-bold text-white border border-white/20">
                  {captcha.num1} {captcha.operator} {captcha.num2} = ?
                </div>
                <button
                    type="button"
                    onClick={generateCaptcha}
                    className="p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors border border-white/20"
                    title="Обновить пример"
                >
                  <RefreshCw className="w-4 h-4 text-white" />
                </button>
              </div>

              <input
                  type="number"
                  value={captchaAnswer}
                  onChange={(e) => {
                    setCaptchaAnswer(e.target.value);
                    setCaptchaError('');
                  }}
                  className={`w-full px-3 py-2 text-sm rounded-lg bg-white/10 text-white border ${
                      captchaError ? 'border-red-400' : 'border-white/20'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-white/50`}
                  placeholder="Введите ответ"
              />

              {captchaError && (
                  <p className="mt-1 text-xs text-red-300">{captchaError}</p>
              )}
            </div>

            {/* Чекбокс согласия */}
            <div className="flex items-start">
              <input
                  type="checkbox"
                  id="consent"
                  className="mt-0.5 mr-2 h-3.5 w-3.5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded flex-shrink-0"
              />
              <label htmlFor="consent" className="text-xs text-white/70">
                Я даю согласие на обработку персональных данных в соответствии с{' '}
                <a href="/privacy" className="text-blue-300 hover:underline">политикой конфиденциальности</a>
              </label>
            </div>
            {errors.consent && (
                <p className="text-xs text-red-300">{errors.consent}</p>
            )}

            {/* Статус отправки с прогресс-баром */}
            {submitStatus && (
                <div className="relative overflow-hidden">
                  <div className={`p-3 rounded-lg ${
                      submitStatus.type === 'success'
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-red-500/20 text-red-300'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs">{submitStatus.message}</p>
                      {submitStatus.type === 'success' && (
                          <span className="text-xs font-medium bg-green-500/30 px-1.5 py-0.5 rounded">
                      {countdown}с
                    </span>
                      )}
                    </div>

                    {/* Progress bar */}
                    {submitStatus.type === 'success' && (
                        <div className="w-full h-1 bg-green-500/30 rounded-full overflow-hidden">
                          <div
                              className="h-full bg-green-400 transition-all duration-100 ease-linear"
                              style={{ width: `${progress}%` }}
                          />
                        </div>
                    )}
                  </div>
                </div>
            )}

            {/* Кнопка отправки */}
            <button
                type="submit"
                disabled={isLoading || submitStatus?.type === 'success'}
                className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white ${
                    isLoading || submitStatus?.type === 'success'
                        ? 'opacity-70 cursor-not-allowed'
                        : 'hover:opacity-90 hover:shadow-lg'
                }`}
            >
              {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Отправка...
                  </>
              ) : submitStatus?.type === 'success' ? (
                  <>
                    <span>✓ Отправлено</span>
                  </>
              ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Отправить заявку
                  </>
              )}
            </button>
          </form>
        </div>
      </div>
  );
};

export default ContactsPage;