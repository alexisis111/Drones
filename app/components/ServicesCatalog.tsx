import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import {
  Building2,
  ArrowRight,
  CheckCircle,
  Package
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router';
import OptimizedImage from './OptimizedImage';
import LazyLoad from './LazyLoad';
import { ServiceSchema } from './SchemaOrg';
import ServiceOrderModal from './ServiceOrderModal';
import { services as servicesData, type Service } from '../data/services';
import Breadcrumbs, { type BreadcrumbItem } from './Breadcrumbs';

interface ServicesCatalogProps {
  breadcrumbs?: BreadcrumbItem[];
}

const ServicesCatalog: React.FC<ServicesCatalogProps> = ({ breadcrumbs }) => {
  const { theme } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const [scrollY, setScrollY] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    // Получаем категорию из URL параметров
    const urlCategory = searchParams.get('category');
    return urlCategory || 'all';
  });
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Прокручиваем к заголовку каталога услуг при загрузке с фильтром
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && categoryParam !== 'all') {
      // Небольшая задержка для обеспечения загрузки компонента
      setTimeout(() => {
        const catalogHeader = document.getElementById('catalog-header');
        if (catalogHeader) {
          catalogHeader.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    }
  }, [searchParams]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = servicesData;

  // Определяем основные категории для фильтрации
  const categories = [
    'all',
    'Подготовительные работы',
    'Монтаж металлических конструкций',
    'Работы по устройству каменных конструкций и отделочные работы',
    'Устройство монолитных и сборных бетонных и железобетонных конструкций',
    'Теплоизоляционные работы',
    'Дополнительные услуги'
  ];

  // Фильтруем услуги по выбранной категории
  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter(service => {
        // Сопоставляем категории с реальными категориями из данных
        const categoryMap: Record<string, string[]> = {
          'Подготовительные работы': ['Подготовительные работы'],
          'Монтаж конструкций': ['Монтаж металлических конструкций'],
          'Отделочные работы': ['Работы по устройству каменных конструкций и отделочные работы'],
          'Бетонные работы': ['Устройство монолитных и сборных бетонных и железобетонных конструкций'],
          'Теплоизоляция': ['Теплоизоляционные работы'],
          'Дополнительные услуги': ['Дополнительные услуги']
        };

        // Если категория есть в карте, ищем услуги с соответствующей реальной категорией
        if (categoryMap[selectedCategory]) {
          return service.category === categoryMap[selectedCategory][0];
        }

        // Для общих названий, ищем частичное совпадение
        return service.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
               service.categoryEn?.toLowerCase().includes(selectedCategory.toLowerCase());
      });

  const handleOrderService = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (formData: any, serviceName: string) => {
    // Отправляем данные в тот же эндпоинт, что и форма контактов
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

    // Возвращаем результат успешной отправки
    return response.json();
  };

  // Данные для схемы
  const businessData = {
    name: "ООО «ЛЕГИОН»",
    description: "ООО «ЛЕГИОН» - профессиональные строительно-монтажные работы с 2012 года. Комплексные решения для строительства и монтажа в СПб и ЛО. Гарантия качества и соблюдение сроков.",
    url: "https://xn--80afglc.xn--p1ai/", // https://легион.рф/
    logo: "/Logo-1.png",
    address: "Ленинградская область",
    telephone: "+79312470888",
    email: "l-legion@bk.ru",
    openingHours: ["Mo-Fr 09:00-18:00"],
    sameAs: [
      "https://vk.com/legion__78",
      "https://max.ru/join/VSfgaLaU34O8mOpcRQMbEUcHlhFA62rS5LSpmhy0K5M",
      'https://t.me/+XaGL8WXjVwQwYjVi'
    ]
  };

  return (
    <div className="relative">
      {/* Schema.org structured data for services */}
      {services.map((service) => (
        <ServiceSchema
          key={service.id}
          name={service.title}
          description={service.description}
          serviceType={service.category}
          provider={businessData}
        />
      ))}

      {/* Services Catalog Section */}
      <section className="pb-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
        <div className="container mx-auto px-4">
          {/* Хлебные крошки */}
          {breadcrumbs && (
            <div className="py-4">
              <Breadcrumbs breadcrumbs={breadcrumbs} className="text-gray-600 dark:text-gray-400" />
            </div>
          )}

          {/* Category Filters - Sticky */}
          <div className="sticky top-[70px] md:top-[70px] z-30 mb-16 bg-gradient-to-b from-gray-50 via-gray-50/98 to-transparent dark:from-gray-900 dark:via-gray-900/98 dark:to-transparent backdrop-blur-sm py-4 rounded-2xl">
            {/* Desktop - обычные кнопки */}
            <div className="hidden md:flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-full font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {category === 'all' ? 'Все услуги' :
                    category === 'Подготовительные работы' ? 'Подготовительные работы' :
                    category === 'Монтаж металлических конструкций' ? 'Монтаж конструкций' :
                    category === 'Работы по устройству каменных конструкций и отделочные работы' ? 'Отделочные работы' :
                    category === 'Устройство монолитных и сборных бетонных и железобетонных конструкций' ? 'Бетонные работы' :
                    category === 'Теплоизоляционные работы' ? 'Теплоизоляция' :
                    category === 'Дополнительные услуги' ? 'Дополнительные услуги' : category}
                </button>
              ))}
            </div>

            {/* Mobile - горизонтальный скролл */}
            <div className="md:hidden overflow-x-auto pb-4 -mx-4 px-4">
              <div className="flex gap-2 min-w-max">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg flex-shrink-0'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex-shrink-0 border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {category === 'all' ? 'Все услуги' :
                      category === 'Подготовительные работы' ? 'Подготовительные' :
                      category === 'Монтаж металлических конструкций' ? 'Монтаж' :
                      category === 'Работы по устройству каменных конструкций и отделочные работы' ? 'Отделка' :
                      category === 'Устройство монолитных и сборных бетонных и железобетонных конструкций' ? 'Бетон' :
                      category === 'Теплоизоляционные работы' ? 'Теплоизоляция' :
                      category === 'Дополнительные услуги' ? 'Доп. услуги' : category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, index) => (
              <LazyLoad
                key={service.id}
                fallback={
                  <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl transition-all duration-300 animate-pulse">
                    <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                    <div className="p-6">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-4"></div>
                      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    </div>
                  </div>
                }
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  onClick={() => window.location.href = `/service/${service.slug}`}
                  className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 cursor-pointer"
                >
                  {/* Image Section */}
                  <div className="relative h-56 overflow-hidden">
                    {service.imageUrl ? (
                      <OptimizedImage
                        src={service.imageUrl}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        width={400}
                        height={300}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center">
                        <Building2 className="w-16 h-16 text-white/50" />
                      </div>
                    )}
                    {/* Overlay with gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                        <Package className="w-3 h-3" />
                        {service.category}
                      </span>
                    </div>
                    
                    {/* Price Badge */}
                    {service.price && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-white/95 backdrop-blur-sm text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                          {service.price}
                        </span>
                      </div>
                    )}
                    
                    {/* Bottom gradient info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                      <h3 className="text-xl font-bold text-white line-clamp-2">
                        {service.title}
                      </h3>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 space-y-5">
                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-2">
                      {service.description}
                    </p>

                    {/* Features List */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-4 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
                        Включено в услугу
                      </h4>
                      <ul className="space-y-2">
                        {service.details.slice(0, 3).map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300 text-sm">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <Link
                        to={`/service/${service.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 text-center py-3 px-4 rounded-xl font-semibold text-sm transition-all bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 text-gray-900 dark:text-white hover:from-gray-200 hover:to-gray-100 dark:hover:from-gray-600 dark:hover:to-gray-700 border border-gray-200 dark:border-gray-600"
                      >
                        Подробнее
                      </Link>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOrderService(service);
                        }}
                        className="flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                      >
                        Заказать
                      </button>
                    </div>
                  </div>
                </motion.div>
              </LazyLoad>
            ))}
          </div>
        </div>
      </section>

      {/* Service Order Modal */}
      <ServiceOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={selectedService}
        onSubmit={handleModalSubmit}
      />

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        {/* Top gradient overlay for smooth transition */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white dark:from-gray-950 to-transparent pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Не нашли подходящую услугу?
            </h2>

            <p className="text-xl opacity-90 max-w-3xl mx-auto mb-12">
              Мы готовы разработать индивидуальное решение под ваши потребности.
              Свяжитесь с нами, и мы предложим оптимальный вариант для вашего проекта.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contacts"
                className="group inline-flex items-center justify-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <span>Обсудить проект</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

            </div>

          </motion.div>
        </div>

        {/* Bottom Gradient Fade for smooth transition */}
        <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-b from-transparent via-purple-900/30 to-white dark:via-gray-900/50 dark:to-gray-950 pointer-events-none" />
      </section>
    </div>
  );
};

export default ServicesCatalog;