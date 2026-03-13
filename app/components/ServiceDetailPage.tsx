import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import {
  Shield,
  CheckCircle,
  ChevronRight,
  ArrowRight,
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
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Загрузка...
            </p>
          </div>
        </div>
    );
  }

  return (
      <div className="relative overflow-hidden">
        <ServiceOrderModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            service={selectedService}
            onSubmit={handleModalSubmit}
        />

        {/* Hero Section - Full Screen Image with Parallax */}
        <section className="relative min-h-[500px] sm:min-h-[600px] flex items-center justify-center overflow-hidden pb-12 sm:pb-20">
          {/* Background Image with Parallax */}
          <motion.div 
            className="absolute inset-0"
            style={{ scale }}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ 
                backgroundImage: `url(${service.imageUrl || '/img/homesImg/services.jpeg'})`,
                transform: 'translateZ(-1px) scale(1.1)',
              }}
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
            {/* Animated Grid Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
                  `,
                  backgroundSize: '60px 60px',
                }}
              />
            </div>
          </motion.div>

          {/* Content */}
          <div className="relative container mx-auto px-4 z-30">
            {/* Хлебные крошки */}
            {breadcrumbs && (
              <motion.div
                className="py-2 sm:py-4 mb-4 sm:mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Breadcrumbs breadcrumbs={breadcrumbs} className="text-white/80" />
              </motion.div>
            )}

            {/* Main Content */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="space-y-6"
              >
                {/* Category Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full px-5 py-2.5 shadow-lg shadow-blue-500/30"
                >
                  <Package className="w-4 h-4" />
                  <span className="text-sm font-bold">{service.category}</span>
                </motion.div>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black leading-tight text-white"
                >
                  {service.title}
                </motion.h1>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="text-base sm:text-lg md:text-xl text-gray-300 max-w-xl leading-relaxed mb-3 sm:mb-4"
                >
                  {service.description}
                </motion.p>

                {/* Price */}
                {service.price && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.75 }}
                    className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl sm:rounded-2xl px-4 py-2 sm:px-5 sm:py-3 shadow-lg shadow-green-500/30 mb-3 sm:mb-4"
                  >
                    <Tag className="w-4 h-4 sm:w-5 sm:h-5" />
                    <div>
                      <span className="text-[10px] sm:text-xs text-green-100">Цена:</span>
                      <span className="text-base sm:text-lg font-bold ml-1 sm:ml-2">{service.price}</span>
                    </div>
                  </motion.div>
                )}

                {/* Stats Row */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex flex-nowrap gap-2 sm:gap-6 pt-0 sm:pt-4 mb-0 sm:mb-6"
                >
                  <div className="flex items-center gap-1.5 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-2 sm:px-5 py-1.5 sm:py-3 border border-white/10 flex-shrink-0">
                    <div className="p-1 sm:p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500">
                      <Clock className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-[10px] sm:text-sm text-gray-400 whitespace-nowrap">Сроки</div>
                      <div className="text-[10px] sm:text-sm font-bold text-white">от 7 дней</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-2 sm:px-5 py-1.5 sm:py-3 border border-white/10 flex-shrink-0">
                    <div className="p-1 sm:p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                      <Star className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-[10px] sm:text-sm text-gray-400 whitespace-nowrap">Качество</div>
                      <div className="text-[10px] sm:text-sm font-bold text-white">100%</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-2 sm:px-5 py-1.5 sm:py-3 border border-white/10 flex-shrink-0">
                    <div className="p-1 sm:p-2 rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
                      <Shield className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-[10px] sm:text-sm text-gray-400 whitespace-nowrap">Гарантия</div>
                      <div className="text-[10px] sm:text-sm font-bold text-white">до 5 лет</div>
                    </div>
                  </div>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 w-full sm:w-auto"
                >
                  <button
                    onClick={() => handleOrderService(service)}
                    className="w-full sm:w-auto group inline-flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300"
                  >
                    <span>Заказать услугу</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <Link
                    to="/contacts"
                    className="w-full sm:w-auto group inline-flex items-center justify-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm text-white px-4 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base border border-white/30 hover:bg-white/20 transition-all duration-300"
                  >
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Проконсультироваться</span>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Right Side - Feature Cards */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="hidden lg:grid grid-cols-1 gap-4"
              >
                {service.details.slice(0, 4).map((detail, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    whileHover={{ x: -5, scale: 1.02 }}
                    className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white group-hover:scale-110 transition-transform">
                        <Hammer className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{detail}</p>
                      </div>
                      <CheckCircle className="w-6 h-6 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </motion.div>
                ))}

                {service.benefits && service.benefits.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 }}
                    className="group bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-green-500/30 rounded-2xl p-5"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                        <Shield className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Преимущества</h3>
                    </div>
                    <ul className="space-y-2">
                      {service.benefits.slice(0, 3).map((benefit, index) => (
                        <li key={index} className="flex items-start text-gray-300 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>

          {/* Wave Divider */}
          <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none -mb-4">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
              <path
                d="M0 0C48 0 144 0 288 12C432 24 576 48 720 56C864 64 1008 56 1152 48C1296 40 1392 24 1440 12V120H0V0Z"
                className="fill-gray-50 dark:fill-gray-900"
              />
            </svg>
          </div>
        </section>

        {/* Service Details Section */}
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              {/* Section Header */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full px-6 py-2.5 mb-4 shadow-lg shadow-blue-500/30">
                  <Building2 className="w-5 h-5" />
                  <span className="text-sm font-bold">Описание услуги</span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                  Подробная информация
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Всё, что нужно знать о данной услуге
                </p>
              </motion.div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Description Card */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="group"
                >
                  <div className="relative h-full rounded-3xl p-8 shadow-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 overflow-hidden">
                    {/* Decorative Element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700" />
                    
                    <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500">
                        <Package className="w-6 h-6 text-white" />
                      </div>
                      Что входит в услугу
                    </h3>

                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
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
                          className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        >
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-gray-700 dark:text-gray-300 font-medium">{detail}</span>
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
                  className="group"
                >
                  <div className="relative h-full rounded-3xl p-8 shadow-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 overflow-hidden">
                    {/* Decorative Element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-full blur-2xl -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700" />
                    
                    <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
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
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-sm flex items-center justify-center shadow-lg z-10">
                              {index + 1}
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors">
                              <p className="text-gray-700 dark:text-gray-300 font-medium">{stage}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
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
        <section className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-black">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full px-6 py-2.5 mb-4 shadow-lg shadow-blue-500/30">
                <Building2 className="w-5 h-5" />
                <span className="text-sm font-bold">Другие услуги</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Вам также может быть интересно
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
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
                    whileHover={{ y: -10 }}
                    className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700"
                  >
                    {/* Gradient Border Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm" />
                    
                    <div className="relative h-48 overflow-hidden">
                      <OptimizedImage
                        src={relatedService.imageUrl}
                        alt={relatedService.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        width={400}
                        height={200}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                          {relatedService.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {relatedService.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                        {relatedService.description}
                      </p>

                      <Link
                        to={`/service/${relatedService.slug}`}
                        className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold hover:gap-3 transition-all"
                      >
                        <span>Подробнее</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
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
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300"
              >
                <span>Посмотреть все услуги</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px',
              }}
            />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center text-white"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6"
              >
                <Phone className="w-6 h-6" />
                <span className="font-semibold">Готовы начать проект?</span>
              </motion.div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
                Остались вопросы?
              </h2>

              <p className="text-xl opacity-90 max-w-3xl mx-auto mb-12">
                Свяжитесь с нами, и мы предоставим подробную консультацию по всем услугам.
                Рассчитаем стоимость и сроки выполнения работ.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/contacts"
                  className="group inline-flex items-center justify-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <Mail className="w-5 h-5" />
                  <span>Связаться с нами</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <a
                  href="tel:+79312470888"
                  className="group inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold border-2 border-white/30 hover:bg-white/20 transition-all duration-300"
                >
                  <Phone className="w-5 h-5" />
                  <span>+7 (931) 247-08-88</span>
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
  );
};

export default ServiceDetailPage;
