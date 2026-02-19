import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useRouteLoaderData } from 'react-router';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { Shield, CheckCircle, ChevronRight, ArrowRight, Package, Hammer, Building2 } from 'lucide-react';
import ServiceOrderModal from './ServiceOrderModal';
import { services, type Service } from '../data/services';

interface LoaderData {
  title: string;
  slug: string;
  service: Service | null;
}

const ServiceDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const data = useRouteLoaderData('routes/service-detail') as LoaderData | null;
  
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

  const service = data?.service;

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

        {/* Back button */}
        <div className="container mx-auto px-4 py-6 z-20 relative">
          <Link
              to="/services"
              className={`inline-flex items-center gap-2 text-sm font-medium transition-colors ${
                  theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
              }`}
          >
            ← Назад к услугам
          </Link>
        </div>

        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center overflow-hidden">
          <motion.div
              className="absolute inset-0 bg-gradient-to-br from-blue-900 via-gray-900 to-purple-900"
          >
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-20"
                   style={{ backgroundImage: `url(${service.imageUrl})` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-purple-600/10" />
            </div>
          </motion.div>

          <div className="relative container mx-auto px-4 z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center py-4">
              <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-8"
              >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20"
                >
                  <Package className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium text-white">{service.category}</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white"
                >
                  {service.title}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl text-gray-300 max-w-2xl"
                >
                  {service.description}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-wrap gap-4"
                >
                  <button
                      onClick={() => handleOrderService(service)}
                      className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    <span>Заказать услугу</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <Link
                      to="/contacts"
                      className="group inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300"
                  >
                    <span>Проконсультироваться</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="space-y-6"
              >
                {service.details.slice(0, 4).map((detail, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        whileHover={{ x: -10 }}
                        className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                          <Hammer className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">Включено в услугу</h3>
                          <p className="text-gray-300">{detail}</p>
                        </div>
                      </div>
                    </motion.div>
                ))}

                {service.benefits && service.benefits.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                        className="group bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6 hover:bg-green-500/20 transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                          <Shield className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">Преимущества</h3>
                          <ul className="space-y-2">
                            {service.benefits.map((benefit, index) => (
                                <li key={index} className="flex items-start text-gray-300">
                                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                                  <span>{benefit}</span>
                                </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Service Details Section */}
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                    Описание услуги
                  </h2>

                  <div className="rounded-2xl p-8 shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <p className="text-lg mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                      {service.description}
                    </p>

                    <h3 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400">
                      Что входит в услугу:
                    </h3>

                    <ul className="space-y-3">
                      {service.details.map((detail, index) => (
                          <li
                              key={index}
                              className="flex items-start text-gray-700 dark:text-gray-300"
                          >
                            <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                            <span>{detail}</span>
                          </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                    Этапы выполнения
                  </h2>

                  <div className="rounded-2xl p-8 shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <ol className="relative border-l-2 border-blue-200 dark:border-blue-800 space-y-6 ml-4">
                      {service.stages?.map((stage, index) => (
                          <li key={index} className="ml-6">
                        <span className="absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-sm shadow-lg">
                          {index + 1}
                        </span>
                            <p className="text-gray-700 dark:text-gray-300 pl-2">
                              {stage}
                            </p>
                          </li>
                      ))}
                    </ol>
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
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full px-6 py-2 mb-4 shadow-lg">
                <Building2 className="w-4 h-4" />
                <span className="text-sm font-medium">Другие услуги</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Вам также может быть интересно
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Ознакомьтесь с другими нашими услугами
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
                          className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl hover:shadow-2xl transition-all duration-300"
                      >
                        <div className="relative h-48 overflow-hidden">
                          <img
                              src={relatedService.imageUrl}
                              alt={relatedService.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-4 left-4">
                            <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
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
                              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium hover:gap-3 transition-all"
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
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <span>Посмотреть все услуги</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
  );
};

export default ServiceDetailPage;
