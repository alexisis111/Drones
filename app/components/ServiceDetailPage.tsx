import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import {
  Shield,
  CheckCircle,
  ChevronRight,
  ArrowRight,
  ArrowUpRight,
  Package,
  Hammer,
  Building2,
  Clock,
  Star,
  TrendingUp,
  Phone,
  Mail,
  Tag
} from 'lucide-react';
import ServiceOrderModal from './ServiceOrderModal';
import { services, type Service } from '../data/services';
import Breadcrumbs, { type BreadcrumbItem } from './Breadcrumbs';
import OptimizedImage from './OptimizedImage';
import ServiceSchema from './ServiceSchema';
// ChatWidget removed - now global in AppWrapper

interface ServiceDetailPageProps {
  breadcrumbs?: BreadcrumbItem[];
  service?: Service | null;
}

const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ breadcrumbs, service: propService }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const [scrollY, setScrollY] = useState(0);

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const service = propService;

  useEffect(() => {
    if (!service) {
      navigate('/services');
    }
  }, [service, navigate]);

  const handleOrderService = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
    document.body.style.overflow = 'unset';
  };

  const handleModalSubmit = async (formData: any, serviceName: string) => {
    const response = await fetch('/api/telegram-webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        message: `${formData.message}${formData.message ? '\n\n' : ''}Заявка на услугу: ${serviceName}`
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.message || 'Ошибка при отправке заявки');
    }

    return response.json();
  };

  if (!service) {
    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="max-w-7xl mx-auto px-4 py-16">
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-white'}>
              Загрузка...
            </p>
          </div>
        </div>
    );
  }

  return (
      <div className="relative overflow-hidden">
        {/* Service Schema.org Microdata */}
        <ServiceSchema
          service={service}
          organizationName="ООО «ЛЕГИОН»"
          organizationDescription="Строительная компания с 2012 года. Выполняем полный цикл строительных работ: от проектирования до сдачи объекта под ключ."
          organizationUrl="https://xn--78-glchqprh.xn--p1ai/"
          organizationLogo="/Logo-1.png"
          organizationAddress="Ленинградская область, г. Светогорск, ул. Максима Горького, 7"
          organizationTelephone="+79312470888"
          organizationEmail="l-legion@bk.ru"
          areaServed={["Санкт-Петербург", "Ленинградская область", "Россия"]}
        />

        <ServiceOrderModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            service={selectedService}
            onSubmit={handleModalSubmit}
        />

        {/* Hero Section */}
        <section className={`relative py-12 overflow-hidden ${
          theme === 'dark'
            ? 'bg-neutral-900'
            : 'bg-white'
        }`}>
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <OptimizedImage
              src={service.imageUrl || '/img/homesImg/services.jpeg'}
              alt={service.title}
              className="w-full h-full object-cover"
              width={1920}
              height={1080}
              priority
            />
            {/* Dark overlay on image */}
            <div className="absolute inset-0 bg-black/70" />
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-gradient" />
          </div>

          {/* Content */}
          <div className="relative container mx-auto px-4 z-10">
            {/* Хлебные крошки */}
            {breadcrumbs && (
              <motion.div
                className="py-2 mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Breadcrumbs breadcrumbs={breadcrumbs} className="text-white/80" />
              </motion.div>
            )}

            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Left column - Main content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-4 md:space-y-6"
              >
                {/* Category Badge with glow */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full px-4 py-2 md:px-5 md:py-2.5 shadow-2xl shadow-blue-500/50"
                >
                  <Package className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span className="text-xs md:text-sm font-bold tracking-wide">{service.category}</span>
                </motion.div>

                {/* Title with gradient */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight"
                >
                  <span className="block">{service.title}</span>
                </motion.h1>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed"
                >
                  {service.description}
                </motion.p>

                {/* Price and Trust Badges */}
                <div className="flex flex-wrap items-center gap-3 md:gap-4">
                  {service.price && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      className="inline-flex items-center gap-2 md:gap-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl md:rounded-2xl px-4 py-2 md:px-6 md:py-4 shadow-2xl shadow-green-500/50"
                    >
                      <Tag className="w-4 h-4 md:w-6 md:h-6" />
                      <div>
                        <span className="text-[10px] md:text-xs text-green-100 block">Стоимость:</span>
                        <span className="text-base md:text-xl font-black">{service.price}</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Trust indicators */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 md:px-4 md:py-3 border border-white/20"
                  >
                    <div className="flex -space-x-1.5 md:-space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-white/20 flex items-center justify-center text-white text-[10px] md:text-xs font-bold">
                          ✓
                        </div>
                      ))}
                    </div>
                    <div className="text-white">
                      <div className="text-[10px] md:text-xs font-bold">150+</div>
                      <div className="text-[9px] md:text-[10px] text-white/70">проектов</div>
                    </div>
                  </motion.div>
                </div>

                {/* CTA Buttons with urgency */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex flex-col gap-3"
                >
                  <button
                    onClick={() => handleOrderService(service)}
                    className="group relative inline-flex items-center justify-center gap-2 md:gap-3 px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-bold text-sm md:text-lg transition-all duration-300 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 overflow-hidden w-full"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10">Заказать сейчас</span>
                    <ArrowRight className="relative z-10 w-4 h-4 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform" />
                  </button>

                  <Link
                    to="/contacts"
                    className="group inline-flex items-center justify-center gap-2 md:gap-3 px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-bold text-sm md:text-lg border-2 border-white/30 transition-all duration-300 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:border-white/50 w-full"
                  >
                    <Phone className="w-4 h-4 md:w-6 md:h-6" />
                    <span>Бесплатная консультация</span>
                  </Link>
                </motion.div>

                {/* Urgency message */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center gap-1.5 md:gap-2 text-white/80 text-xs md:text-sm"
                >
                  <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span>Ответим в течение 15 минут</span>
                </motion.div>
              </motion.div>

              {/* Right column - Feature cards with premium design */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-6"
              >
                {service.details.slice(0, 4).map((detail, i) => {
                  const gradients = [
                    "from-blue-500 to-cyan-500",
                    "from-purple-500 to-pink-500",
                    "from-orange-500 to-red-500",
                    "from-green-500 to-emerald-500"
                  ];
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      whileHover={{ scale: 1.03 }}
                      className="group relative"
                    >
                      {/* Pulsing glow effect */}
                      <div
                        className={`absolute inset-0 rounded-xl bg-gradient-to-r ${gradients[i]} blur-lg pointer-events-none`}
                        style={{
                          opacity: 0.3,
                          animation: `pulse-fade ${5 + i * 1.5}s ease-in-out infinite`,
                          animationDelay: `${i * 0.7}s`
                        }}
                      />

                      <div className={`relative overflow-hidden rounded-xl p-3 md:p-4 transition-all duration-500 shadow-lg border ${
                        theme === 'dark'
                          ? 'bg-gradient-to-br from-gray-800/90 to-gray-900/90 border-white/20'
                          : 'bg-white/70 backdrop-blur-sm border-white/40'
                      }`}>
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className={`flex-shrink-0 p-2 md:p-3 rounded-lg md:rounded-xl bg-gradient-to-br ${gradients[i]} shadow-lg`}>
                            <Hammer className="w-4 h-4 md:w-5 md:h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs md:text-sm font-bold truncate ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>{detail}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Desktop Feature cards */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="hidden lg:block space-y-4"
              >
                {service.details.slice(0, 4).map((detail, i) => {
                  const gradients = [
                    "from-blue-500 to-cyan-500",
                    "from-purple-500 to-pink-500",
                    "from-orange-500 to-red-500",
                    "from-green-500 to-emerald-500"
                  ];
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      whileHover={{ x: -10, scale: 1.03 }}
                      className="group relative"
                    >
                      {/* Animated border gradient */}
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${gradients[i]} opacity-0 group-hover:opacity-100 blur transition-all duration-500 -z-10`} />
                      
                      {/* Pulsing glow effect */}
                      <div
                        className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${gradients[i]} blur-xl pointer-events-none`}
                        style={{
                          opacity: 0.3,
                          animation: `pulse-fade ${5 + i * 1.5}s ease-in-out infinite`,
                          animationDelay: `${i * 0.7}s`
                        }}
                      />

                      <div className={`relative overflow-hidden rounded-2xl p-5 transition-all duration-500 shadow-xl hover:shadow-2xl border ${
                        theme === 'dark'
                          ? 'bg-gradient-to-br from-gray-800/90 to-gray-900/90 border-white/20'
                          : 'bg-white/70 backdrop-blur-sm border-white/40'
                      }`}
                        style={{
                          backgroundSize: '200% 200%',
                          animation: `gradient-shift ${8 + i * 2}s ease infinite`,
                          animationDelay: `${i * 0.5}s`
                        }}>
                        <div className="flex items-center gap-4">
                          <div className={`flex-shrink-0 p-4 rounded-xl bg-gradient-to-br ${gradients[i]} shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                            <Hammer className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm font-bold ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>{detail}</p>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-2">
                            <ArrowRight className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {service.benefits && service.benefits.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    whileHover={{ y: -8, scale: 1.03 }}
                    className="group relative"
                  >
                    {/* Animated border gradient */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 blur transition-all duration-500 -z-10" />
                    
                    {/* Pulsing glow effect */}
                    <div
                      className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 blur-xl pointer-events-none"
                      style={{
                        opacity: 0.3,
                        animation: 'pulse-fade 8s ease-in-out infinite'
                      }}
                    />

                    <div className={`relative overflow-hidden rounded-2xl p-6 transition-all duration-500 shadow-xl hover:shadow-2xl border ${
                      theme === 'dark'
                        ? 'bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-white/20'
                        : 'bg-white/70 backdrop-blur-sm border-white/40'
                    }`}
                      style={{
                        backgroundSize: '200% 200%',
                        animation: 'gradient-shift 10s ease infinite'
                      }}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                          <Shield className="w-6 h-6 text-white" />
                        </div>
                        <h3 className={`text-lg font-black ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>Преимущества работы с нами</h3>
                      </div>
                      <ul className="space-y-3">
                        {service.benefits.slice(0, 3).map((benefit, index) => (
                          <motion.li 
                            key={index} 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.9 + index * 0.1 }}
                            className={`flex items-start gap-3 text-sm ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}
                          >
                            <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-400" />
                            <span className="font-medium">{benefit}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Service Details Section */}
        <section className={`relative py-16 overflow-hidden ${
          theme === 'dark'
            ? 'bg-neutral-900'
            : 'bg-gradient-to-b from-white via-gray-50 to-white'
        }`}>
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              {/* Section Header */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 mb-4 backdrop-blur-sm ${
                  theme === 'dark'
                    ? 'bg-neutral-900 border border-white'
                    : 'bg-white border border-gray-800'
                }`}>
                  <Building2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Описание услуги</span>
                </div>
              </motion.div>

              <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Description Card */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="group relative"
                >
                  {/* Pulsing glow effect */}
                  <div
                    className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500 pointer-events-none"
                    style={{
                      animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                    }}
                  />

                  <div className={`relative overflow-hidden rounded-[2rem] p-8 h-full transition-all duration-500 shadow-xl hover:shadow-2xl border hover:border-transparent ${
                    theme === 'dark'
                      ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700/50'
                      : 'bg-white border-gray-200'
                  }`}
                    style={{
                      backgroundSize: '200% 200%',
                      animation: 'gradient-shift 6s ease infinite'
                    }}>
                    {/* Icon container */}
                    <div className="relative mb-6">
                      <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <Package className="w-8 h-8" />
                      </div>
                      {/* Small decorative dots */}
                      <div className="absolute -bottom-2 -right-2 flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-60" />
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-40" />
                      </div>
                    </div>

                    <h3 className={`text-2xl font-black mb-6 tracking-tight ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      Что входит в услугу
                    </h3>

                    <p className={`text-lg leading-relaxed mb-8 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {service.description}
                    </p>

                    <ul className="space-y-4">
                      {service.details.map((detail, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          className={`flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 ${
                            theme === 'dark'
                              ? 'bg-gray-700/50 hover:bg-blue-900/20'
                              : 'bg-gray-50 hover:bg-blue-50'
                          }`}
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                            <CheckCircle className="w-6 h-6" />
                          </div>
                          <span className={`text-base font-medium ${
                            theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                          }`}>{detail}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>

                {/* Stages Card */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="group relative"
                >
                  {/* Pulsing glow effect */}
                  <div
                    className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500 pointer-events-none"
                    style={{
                      animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                    }}
                  />

                  <div className={`relative overflow-hidden rounded-[2rem] p-8 h-full transition-all duration-500 shadow-xl hover:shadow-2xl border hover:border-transparent ${
                    theme === 'dark'
                      ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700/50'
                      : 'bg-white border-gray-200'
                  }`}
                    style={{
                      backgroundSize: '200% 200%',
                      animation: 'gradient-shift 6s ease infinite'
                    }}>
                    {/* Icon container */}
                    <div className="relative mb-6">
                      <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <TrendingUp className="w-8 h-8" />
                      </div>
                      {/* Small decorative dots */}
                      <div className="absolute -bottom-2 -right-2 flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 opacity-60" />
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 opacity-40" />
                      </div>
                    </div>

                    <h3 className={`text-2xl font-black mb-6 tracking-tight ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      Этапы выполнения
                    </h3>

                    {service.stages && service.stages.length > 0 ? (
                      <div className="space-y-6">
                        {service.stages.map((stage, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="relative flex gap-4 pl-8"
                          >
                            {/* Timeline Line */}
                            {index !== service.stages.length - 1 && (
                              <div className="absolute left-[15px] top-10 w-0.5 h-[calc(100%-20px)] bg-gradient-to-b from-blue-500 to-purple-500" />
                            )}

                            {/* Number Badge */}
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-sm flex items-center justify-center shadow-lg z-10">
                              {index + 1}
                            </div>

                            {/* Content */}
                            <div className={`flex-1 p-4 rounded-2xl transition-all duration-300 ${
                              theme === 'dark'
                                ? 'bg-gray-700/50 hover:bg-orange-900/20'
                                : 'bg-gray-50 hover:bg-orange-50'
                            }`}>
                              <p className={`text-base font-medium ${
                                theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                              }`}>{stage}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className={`flex items-center justify-center h-64 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        <p>Этапы выполнения уточняются</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Services Section */}
        <section className={`relative py-16 overflow-hidden ${
          theme === 'dark'
            ? 'bg-neutral-900'
            : 'bg-gradient-to-b from-white via-gray-50 to-white'
        }`}>
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 mb-4 backdrop-blur-sm ${
                theme === 'dark'
                  ? 'bg-blue-900/30 text-blue-400 border border-blue-800/30'
                  : 'bg-blue-100 text-blue-600 border border-blue-200'
              }`}>
                <Building2 className="w-4 h-4" />
                <span className="text-sm font-medium">Другие услуги</span>
              </div>
              <h2 className={`text-3xl md:text-4xl lg:text-5xl font-black mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Вам также может быть интересно
              </h2>
              <p className={`text-lg md:text-xl max-w-3xl mx-auto ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Ознакомьтесь с другими нашими услугами
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {services
                .filter(s => s.id !== service.id)
                .slice(0, 3)
                .map((relatedService, i) => (
                  <motion.div
                    key={relatedService.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -12, scale: 1.02 }}
                    className="group relative"
                  >
                    {/* Pulsing glow effect */}
                    <div
                      className={`absolute inset-0 rounded-[2rem] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500 pointer-events-none`}
                      style={{
                        animation: `pulse ${3 + i * 0.5}s cubic-bezier(0.4, 0, 0.6, 1) infinite`
                      }}
                    />

                    {/* Animated gradient border */}
                    <div className={`absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10`}>
                      <div className={`absolute inset-0 rounded-[2rem] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-sm`}
                        style={{
                          backgroundSize: '200% 200%',
                          animation: `gradient-shift ${4 + i}s ease infinite`
                        }}
                      />
                    </div>

                    <div className={`relative overflow-hidden rounded-[2rem] h-full transition-all duration-500 shadow-xl hover:shadow-2xl ${
                      theme === 'dark'
                        ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 border border-gray-700/50'
                        : 'bg-gradient-to-br from-white via-gray-50 to-white border border-gray-200'
                    }`}
                      style={{
                        backgroundSize: '200% 200%',
                        animation: `gradient-shift ${6 + i}s ease infinite`
                      }}>
                      {/* Image with overlay */}
                      <div className="relative h-48 overflow-hidden">
                        <OptimizedImage
                          src={relatedService.imageUrl}
                          alt={relatedService.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          width={400}
                          height={200}
                          loading="lazy"
                        />
                        {/* Gradient overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-t ${
                          theme === 'dark'
                            ? 'from-gray-900 via-gray-900/60 to-transparent'
                            : 'from-white via-white/60 to-transparent'
                        }`} />

                        {/* Animated shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                        {/* Category Badge with animation */}
                        <div className="absolute top-4 left-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:scale-105 ${
                            theme === 'dark'
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          }`}>
                            <Package className="w-3 h-3" />
                            {relatedService.category}
                          </span>
                        </div>

                        {/* Arrow icon on hover */}
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-1">
                          <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm">
                            <ArrowUpRight className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className={`text-xl font-black mb-2 line-clamp-2 transition-colors duration-300 ${
                          theme === 'dark' 
                            ? 'text-white group-hover:text-blue-400' 
                            : 'text-gray-900 group-hover:text-blue-600'
                        }`}>
                          {relatedService.title}
                        </h3>
                        <p className={`text-sm mb-4 line-clamp-2 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {relatedService.description}
                        </p>

                        {/* Price badge if available */}
                        {relatedService.price && (
                          <div className="mb-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${
                              theme === 'dark'
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : 'bg-green-100 text-green-700 border border-green-200'
                            }`}>
                              <Tag className="w-3 h-3" />
                              {relatedService.price}
                            </span>
                          </div>
                        )}

                        {/* Learn more link with animation */}
                        <Link
                          to={`/service/${relatedService.slug}`}
                          className={`inline-flex items-center gap-2 font-bold transition-all duration-300 group/link ${
                            theme === 'dark'
                              ? 'text-blue-400 hover:text-blue-300'
                              : 'text-blue-600 hover:text-blue-700'
                          }`}
                        >
                          <span>Подробнее</span>
                          <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-2" />
                        </Link>
                      </div>

                      {/* Decorative corner elements */}
                      <div className={`absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}>
                        <div className={`absolute top-0 right-0 w-full h-full bg-gradient-to-bl ${
                          theme === 'dark'
                            ? 'from-blue-500/10 to-transparent'
                            : 'from-blue-500/5 to-transparent'
                        } rounded-tr-[2rem]`} />
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link
                to="/services"
                className={`inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-xl hover:shadow-blue-500/50 hover:scale-105'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl hover:shadow-blue-500/50 hover:scale-105'
                }`}
              >
                <span>Посмотреть все услуги</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={`relative py-24 overflow-hidden ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600'
            : 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500'
        }`}>
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-20 w-60 h-60 rounded-full bg-white/10 blur-3xl animate-blob" />
            <div className="absolute bottom-20 right-20 w-60 h-60 rounded-full bg-white/10 blur-3xl animate-blob animation-delay-2000" />
            <div className="absolute top-1/2 left-1/2 w-60 h-60 rounded-full bg-white/10 blur-3xl animate-blob animation-delay-4000" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className={`inline-flex items-center gap-3 rounded-full px-6 py-3 mb-6 backdrop-blur-sm ${
                theme === 'dark'
                  ? 'bg-white/20 border border-white/30'
                  : 'bg-black/10 border border-black/20'
              }`}>
                <Phone className={`w-6 h-6 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`} />
                <span className={`font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Готовы начать проект?</span>
              </div>

              <h2 className={`text-4xl md:text-5xl lg:text-6xl font-black mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Остались вопросы?
              </h2>

              <p className={`text-xl max-w-3xl mx-auto mb-12 ${
                theme === 'dark' ? 'text-white/90' : 'text-gray-900'
              }`}>
                Свяжитесь с нами, и мы предоставим подробную консультацию по всем услугам.
                Рассчитаем стоимость и сроки выполнения работ.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/contacts"
                  className={`group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold transition-all duration-300 ${
                    theme === 'dark'
                      ? 'bg-white text-gray-900 hover:shadow-2xl hover:scale-105'
                      : 'bg-gray-900 text-white hover:shadow-2xl hover:scale-105'
                  }`}
                >
                  <Mail className="w-5 h-5" />
                  <span className={theme === 'dark' ? 'text-gray-900' : 'text-white'}>Связаться с нами</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <a
                  href="tel:+79312470888"
                  className={`group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold border-2 transition-all duration-300 ${
                    theme === 'dark'
                      ? 'bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20'
                      : 'bg-transparent text-gray-900 border-gray-900 hover:bg-gray-900/10'
                  }`}
                >
                  <Phone className="w-5 h-5" />
                  <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>+7 (931) 247-08-88</span>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ChatWidget removed - now global in AppWrapper */}
      </div>
  );
};

export default ServiceDetailPage;
