import React, {useState, useEffect, useMemo} from 'react';
import {motion} from 'framer-motion';
import {useTheme} from '../contexts/ThemeContext';
import {
    Building2,
    ArrowRight,
    CheckCircle,
    Package,
    Search
} from 'lucide-react';
import {Link, useSearchParams, useNavigate} from 'react-router';
import OptimizedImage from './OptimizedImage';
import LazyLoad from './LazyLoad';
import {ServiceSchema} from './SchemaOrg';
import ServiceOrderModal from './ServiceOrderModal';
import {services as servicesData, type Service} from '../data/services';
import Breadcrumbs, {type BreadcrumbItem} from './Breadcrumbs';
import {ServiceBriefSchema} from './ServiceSchema';
import ServiceSearch from './ServiceSearch';

interface ServicesCatalogProps {
    breadcrumbs?: BreadcrumbItem[];
}

const ServicesCatalog: React.FC<ServicesCatalogProps> = ({breadcrumbs}) => {
    const {theme} = useTheme();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [filteredServiceIds, setFilteredServiceIds] = useState<number[] | null>(null);

    // State for modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    // Обработчик фильтрации (точно как на главной)
    const handleFilterChange = useMemo(() => (filteredIds: number[]) => {
        setFilteredServiceIds(filteredIds);
    }, []);

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

    const services = servicesData;

    // Фильтруем услуги по ID из ServiceSearch (точно как на главной)
    const filteredServices = useMemo(() => {
        return services.filter(service =>
            filteredServiceIds === null || filteredServiceIds.includes(service.id)
        );
    }, [services, filteredServiceIds]);

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
            {/* Schema.org structured data - без изменений */}
            <ServiceBriefSchema
                services={servicesData}
                organizationName="ООО «ЛЕГИОН»"
                organizationUrl="https://xn--78-glchqprh.xn--p1ai/"
            />

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
            <section className={`pb-16 ${
                theme === 'dark'
                    ? 'bg-neutral-900'
                    : 'bg-white'
            }`}>
                <div className="container mx-auto px-4">
                    {/* Smart Search - без изменений */}
                    <div className="py-2 mb-12">
                        <ServiceSearch onFilterChange={handleFilterChange}/>
                    </div>

                    {/* Services Grid */}
                    {filteredServices.length === 0 ? (
                        /* No Results Message - без изменений */
                        <motion.div
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            className="text-center py-16"
                        >
                            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
                                theme === 'dark' ? 'bg-white/10' : 'bg-gray-200/50'
                            }`}>
                                <Search className={`w-10 h-10 ${
                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                }`}/>
                            </div>
                            <h3 className={`text-xl font-bold mb-2 ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                                Ничего не найдено
                            </h3>
                            <p className={`max-w-md mx-auto ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                                По вашему запросу не найдено услуг. Попробуйте изменить поисковый запрос или сбросить
                                фильтры.
                            </p>
                        </motion.div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredServices.map((service, index) => (
                                <LazyLoad
                                    key={service.id}
                                    fallback={
                                        <div
                                            className={`group relative overflow-hidden rounded-3xl shadow-xl transition-all duration-300 animate-pulse ${
                                                theme === 'dark'
                                                    ? 'bg-gradient-to-br from-gray-800 to-gray-900'
                                                    : 'bg-gradient-to-br from-white to-gray-50'
                                            }`}>
                                            <div className={`h-48 ${
                                                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                                            }`}></div>
                                            <div className="p-6">
                                                <div className={`h-6 rounded w-3/4 mb-4 ${
                                                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                                                }`}></div>
                                                <div className={`h-4 rounded w-full mb-2 ${
                                                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                                                }`}></div>
                                                <div className={`h-4 rounded w-5/6 mb-4 ${
                                                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                                                }`}></div>
                                                <div className={`h-10 rounded w-full ${
                                                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                                                }`}></div>
                                            </div>
                                        </div>
                                    }
                                >
                                    <motion.div
                                        initial={{opacity: 0, y: 30}}
                                        whileInView={{opacity: 1, y: 0}}
                                        viewport={{once: true}}
                                        transition={{delay: index * 0.1}}
                                        whileHover={{y: -10}}
                                        onClick={() => navigate(`/service/${service.slug}`)}
                                        className={`group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer ${
                                            theme === 'dark'
                                                ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700'
                                                : 'bg-gradient-to-br from-white to-gray-50 border border-gray-100'
                                        }`}
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
                                                <div
                                                    className="w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center">
                                                    <Building2 className="w-16 h-16 text-white/50"/>
                                                </div>
                                            )}
                                            {/* Overlay with gradient - адаптирован под тему */}
                                            <div className={`absolute inset-0 bg-gradient-to-t ${
                                                theme === 'dark'
                                                    ? 'from-black/80 via-black/30 to-transparent'
                                                    : 'from-black/40 via-black/10 to-transparent'
                                            }`}/>

                                            {/* Category Badge */}
                                            <div className="absolute top-4 left-4">
                      <span
                          className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                        <Package className="w-3 h-3"/>
                          {service.category}
                      </span>
                                            </div>

                                            {/* Price Badge */}
                                            {service.price && (
                                                <div className="absolute top-4 right-4">
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-lg ${
                            theme === 'dark'
                                ? 'bg-white/95 text-gray-900'
                                : 'bg-gray-900/95 text-white'
                        }`}>
                          {service.price}
                        </span>
                                                </div>
                                            )}

                                            {/* Bottom gradient info */}
                                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                                <h3 className={`text-xl font-bold line-clamp-2 transition-colors duration-300 ${
                                                    theme === 'dark' ? 'text-white' : 'text-white'
                                                }`}>
                                                    {service.title}
                                                </h3>
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="p-6 space-y-5">
                                            {/* Description */}
                                            <p className={`text-sm leading-relaxed line-clamp-2 ${
                                                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                            }`}>
                                                {service.description}
                                            </p>

                                            {/* Features List */}
                                            <div className="space-y-2">
                                                <h4 className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-2 ${
                                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                                }`}>
                                                    <span
                                                        className="w-4 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
                                                    Включено в услугу
                                                </h4>
                                                <ul className="space-y-2">
                                                    {service.details.slice(0, 3).map((detail, idx) => (
                                                        <li key={idx} className="flex items-start gap-2.5">
                                                            <CheckCircle
                                                                className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0"/>
                                                            <span className={`text-sm ${
                                                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                            }`}>{detail}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className={`flex gap-3 pt-4 border-t ${
                                                theme === 'dark' ? 'border-gray-700' : 'border-gray-100'
                                            }`}>
                                                <Link
                                                    to={`/service/${service.slug}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className={`flex-1 text-center py-3 px-4 rounded-xl font-semibold text-sm transition-all border ${
                                                        theme === 'dark'
                                                            ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-white border-gray-600 hover:from-gray-600 hover:to-gray-700'
                                                            : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-900 border-gray-200 hover:from-gray-200 hover:to-gray-100'
                                                    }`}
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
                    )}
                </div>
            </section>

            {/* Service Order Modal - без изменений */}
            <ServiceOrderModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                service={selectedService}
                onSubmit={handleModalSubmit}
            />

            {/* CTA Section - без изменений */}
            <section className={`relative py-24 overflow-hidden overflow-x-hidden ${
                theme === 'dark'
                    ? 'bg-neutral-900'
                    : 'bg-white/95'
            }`}>
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{opacity: 0, y: 50}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true}}
                        className="text-center"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Не нашли подходящую услугу?
                        </h2>

                        <p className="text-xl max-w-3xl mx-auto mb-12">
                            Мы готовы разработать индивидуальное решение под ваши потребности.
                            Свяжитесь с нами, и мы предложим оптимальный вариант для вашего проекта.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/contacts"
                                className="group inline-flex items-center justify-center gap-3  dark:bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
                            >
                                <span>Обсудить проект</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
                            </Link>

                        </div>

                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default ServicesCatalog;