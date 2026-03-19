import { useState, useMemo, useEffect } from 'react';
import { useTheme } from "../contexts/ThemeContext";
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import {
  ChevronRight,
  ArrowRight,
  Shield,
  Building2,
  Award,
  Clock,
  Users,
  CheckCircle,
  Phone,
  MapPin,
  ArrowUpRight,
  Search,
  Download,
  Target,
  Zap,
  Globe
} from 'lucide-react';
import { LocalBusinessSchema, ServiceSchema, ConstructionBusinessSchema } from "../components/SchemaOrg";
import FaqSection from "../components/FaqSection";
import OptimizedImage from "../components/OptimizedImage";
import ServiceSearch from "../components/ServiceSearch";
import { services as allServices } from '../data/services';



export function Welcome() {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [filteredServiceIds, setFilteredServiceIds] = useState<number[] | null>(null);

  const handleFilterChange = useMemo(() => (filteredIds: number[]) => {
    setFilteredServiceIds(filteredIds);
  }, []);

  useEffect(() => {
    setIsVisible(true);

    // Прокрутка к прайс-листу если в URL есть якорь #price-list
    if (window.location.hash === '#price-list') {
      setTimeout(() => {
        const element = document.getElementById('price-list');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, []);



  // Данные для схемы
  const businessData = {
    name: "Строительная компания ЛЕГИОН",
    description: "ООО «ЛЕГИОН» — надёжная строительная компания с 2012 года. Офис в г. Светогорск (Ленинградская область). Выполняем полный цикл строительных работ: от подготовительных работ до сдачи объекта под ключ. Специализируемся на строительстве зданий, монтаже металлоконструкций, теплоизоляции и комплексных решениях для промышленных и гражданских объектов. Работаем по всей России. Гарантия качества, соблюдение сроков, индивидуальный подход к каждому проекту.",
    url: "https://xn--78-glchqprh.xn--p1ai/",
    logo: "/Logo-1.png",
    address: "Ленинградская область, г. Светогорск, ул. Максима Горького, 7",
    telephone: "+79312470888",
    email: "l-legion@bk.ru",
    openingHours: ["Mo-Fr 09:00-18:00"],
    sameAs: [
      "https://vk.com/legion__78",
      "https://max.ru/join/VSfgaLaU34O8mOpcRQMbEUcHlhFA62rS5LSpmhy0K5M",
      'https://t.me/+XaGL8WXjVwQwYjVi'
    ],
    priceRange: "$$$"
  };

  const services = [
    {
      name: "Строительство зданий",
      description: "Возведение промышленных и гражданских объектов под ключ",
      serviceType: "Строительные работы"
    },
    {
      name: "Монтаж металлоконструкций",
      description: "Изготовление и монтаж металлических конструкций любой сложности",
      serviceType: "Монтажные работы"
    },
    {
      name: "Защита от БПЛА",
      description: "Современные системы защиты периметра от беспилотников",
      serviceType: "Системы безопасности"
    },
    {
      name: "Подготовительные работы",
      description: "Полный комплекс подготовительных работ для начала строительства",
      serviceType: "Подготовительные работы"
    }
  ];

  return (
      <div className="relative overflow-hidden">
        <main className="relative">
          {/* Schema.org structured data */}
          <LocalBusinessSchema {...businessData} />
          <ConstructionBusinessSchema {...businessData} />
          {services.map((service, index) => (
            <ServiceSchema
              key={index}
              name={service.name}
              description={service.description}
              serviceType={service.serviceType}
              provider={businessData}
            />
          ))}

          {/* Hero Section with Service Cards */}
          <section className="relative min-h-screen flex items-center py-16">
            {/* Content */}
            <div className="relative container mx-auto px-4 z-10">
              {/* Smart Search */}
              <ServiceSearch onFilterChange={handleFilterChange} />

              {/* Service Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 md:gap-4">
                {allServices
                  .filter(service => filteredServiceIds === null || filteredServiceIds.includes(service.id))
                  .length === 0 ? (
                  /* No Results Message */
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="col-span-full text-center py-16"
                  >
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-200/50 dark:bg-white/10 backdrop-blur-xl mb-6">
                      <Search className="w-10 h-10 text-gray-500 dark:text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold  mb-2">
                      Ничего не найдено
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                      По вашему запросу не найдено услуг. Попробуйте изменить поисковый запрос или сбросить фильтры.
                    </p>
                  </motion.div>
                ) : (
                  allServices
                    .filter(service => filteredServiceIds === null || filteredServiceIds.includes(service.id))
                    .map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ y: -4, scale: 1.03 }}
                    className="group relative"
                  >
                    <Link to={`/service/${service.slug}`} className="block h-full">
                      {/* Card */}
                      <div className={`relative h-full border rounded-xl overflow-hidden hover:border-blue-400/60 hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 ${
                        theme === 'dark'
                          ? 'bg-neutral-800 border-gray-700/50'
                          : 'bg-gray-100 border-gray-200'
                      }`}>
                        {/* Image */}
                        <div className="relative h-28 sm:h-32 overflow-hidden">
                          <OptimizedImage
                            src={service.imageUrl || '/img/services/img1.jpeg'}
                            alt={service.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            width={400}
                            height={300}
                            loading="lazy"
                          />

                          {/* Category Badge */}
                          <div className="absolute top-2 left-2 z-20">
                            <div className="bg-blue-600/90 dark:bg-white/90 backdrop-blur-sm text-white dark:text-gray-900 text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-md border border-white/20 dark:border-gray-300 shadow-lg">
                              {service.category.split(' ')[0]}
                            </div>
                          </div>

                          {/* Arrow Icon */}
                          <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:rotate-45">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                              <ArrowUpRight className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-3 sm:p-3.5 space-y-2">
                          {/* Title */}
                          <h3 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-black group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 leading-tight transition-colors">
                            {service.title}
                          </h3>

                          {/* Price */}
                          {service.price && (
                            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                              <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600 px-2 py-1 rounded-md">
                                <span className="text-[10px] sm:text-xl font-bold text-white font-mono">
                                  {service.price}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Learn More */}
                          <div className="flex items-center gap-1.5 pt-1">
                            <span className="text-[10px] sm:text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                              Подробнее
                            </span>
                            <ChevronRight className="w-3 h-3 text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>

                        {/* Hover Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-purple-600/0 to-pink-600/0 group-hover:from-blue-600/15 group-hover:via-purple-600/15 group-hover:to-pink-600/15 transition-all duration-500 pointer-events-none" />
                      </div>
                    </Link>
                  </motion.div>
                ))
              )}
              </div>

              {/* CTA Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-8 text-center"
              >
                <div className="inline-flex flex-col sm:flex-row gap-3">
                  <a
                    href="/price-list.pdf"
                    download
                    className="group inline-flex items-center justify-center gap-2 bg-white/80 dark:bg-gray-800/50 backdrop-blur-xl text-gray-900 dark:text-white px-6 py-3.5 rounded-xl text-sm font-semibold border border-gray-300 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800/70 hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-300"
                  >
                    <Download className="w-4 h-4" />
                    <span>Скачать прайс-лист</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </motion.div>
            </div>
          </section>


          {/* Why Choose Us Section */}
          <section className="relative py-8 ">
            <div className="container mx-auto px-4 relative z-10">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {[
                  {
                    icon: <Clock className="w-8 h-8" />,
                    title: "Соблюдение сроков",
                    description: "Строгое соблюдение договорных обязательств и сроков выполнения всех видов строительных работ",
                    gradient: "from-blue-500 to-cyan-500",
                    bgGradient: "from-blue-900/30 to-cyan-900/30"
                  },
                  {
                    icon: <CheckCircle className="w-8 h-8" />,
                    title: "Качество работ",
                    description: "Работаем по СНиП и ГОСТ. Только проверенные материалы и технологии строительства",
                    gradient: "from-purple-500 to-pink-500",
                    bgGradient: "from-purple-900/30 to-pink-900/30"
                  },
                  {
                    icon: <Users className="w-8 h-8" />,
                    title: "Опытная команда",
                    description: "Квалифицированные специалисты с многолетним опытом в строительной отрасли",
                    gradient: "from-orange-500 to-red-500",
                    bgGradient: "from-orange-900/30 to-red-900/30"
                  },
                  {
                    icon: <Shield className="w-8 h-8" />,
                    title: "Гарантия качества",
                    description: "Гарантия на все виды строительных и монтажных работ от 2 до 5 лет",
                    gradient: "from-green-500 to-emerald-500",
                    bgGradient: "from-green-900/30 to-emerald-900/30"
                  }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -12, scale: 1.03 }}
                    className="group relative"
                  >
                    {/* Pulsing glow effect */}
                    <div 
                      className={`absolute inset-0 rounded-[2rem] bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500 pointer-events-none`}
                      style={{
                        animation: `pulse ${2 + i * 0.5}s cubic-bezier(0.4, 0, 0.6, 1) infinite`
                      }}
                    />

                    {/* Main card */}
                    <div className={`relative overflow-hidden rounded-[2rem] p-8 h-full flex flex-col transition-all duration-500 shadow-xl hover:shadow-2xl border hover:border-transparent ${
                      theme === 'dark'
                        ? `bg-gradient-to-br ${item.bgGradient} border-gray-700/50`
                        : `bg-white border-gray-200`
                    }`}
                      style={{
                        backgroundSize: '200% 200%',
                        animation: `gradient-shift ${3 + i * 0.7}s ease infinite`
                      }}>
                      {/* Icon container */}
                      <div className="relative mb-6">
                        <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${item.gradient} shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ${
                          theme === 'dark' ? 'text-white' : 'text-black'
                        }`}>
                          {item.icon}
                        </div>
                        {/* Small decorative dots */}
                        <div className="absolute -bottom-2 -right-2 flex gap-1">
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${item.gradient} opacity-60`} />
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${item.gradient} opacity-40`} />
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className={`text-xl font-black mb-4 tracking-tight ${
                        theme === 'dark' ? 'text-white' : 'text-black'
                      }`}>
                        {item.title}
                      </h3>

                      {/* Description */}
                      <p className={`flex-grow leading-relaxed text-base ${
                        theme === 'dark' ? 'text-white' : 'text-black'
                      }`}>
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>


          {/* SEO Text Section - в стиле Why Choose Us */}
          <section className="relative py-24 ">
            <div className="container mx-auto px-4 relative z-10">
              {/* SEO текст в стиле CTA блока */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <div className={`relative overflow-hidden rounded-[2rem] p-8 md:p-10 shadow-2xl ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white' 
                    : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-black'
                }`}>
                  {/* Decorative elements */}
                  <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
                  <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />

                  <div className="relative z-10">
                    <h2 className="text-2xl md:text-3xl font-black mb-6 flex items-center gap-3">
                      <Building2 className={`w-8 h-8 ${theme === 'dark' ? 'text-white' : 'text-black'}`} />
                      Строительная компания ЛЕГИОН
                    </h2>

                    <p className={`${theme === 'dark' ? 'text-white/90' : 'text-black/90'} mb-4 text-lg`}>
                      <strong>ООО «ЛЕГИОН»</strong>
                      <p className={`${theme === 'dark' ? 'text-white/90' : 'text-black/90'} mb-6 text-base`}>Cтроительство в СПб, Ленинградской области и по всей России.  Строительная компания полного цикла, работающая с 2012 года.
                        Офис - г. Светогорск (Ленинградская область, ул. Максима Горького, 7).</p>

                    </p>

                    <p className={`${theme === 'dark' ? 'text-white/90' : 'text-black/90'} mb-6 text-base`}>
                      Мы выполняем строительные работы любой сложности для промышленных и гражданских объектов в
                      <strong> Санкт-Петербурге</strong>,
                      <strong> Ленинградской области</strong> и по всей территории
                      <strong> Российской Федерации</strong>.
                      За 12 лет работы реализовано более 100 проектов — от небольших зданий до крупных промышленных комплексов.
                    </p>

                    <div className="flex flex-wrap gap-3">
                      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                        <Award className="w-5 h-5 text-white" />
                        <span className="font-semibold text-white">12 лет на рынке</span>
                      </div>
                      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                        <CheckCircle className="w-5 h-5 text-white" />
                        <span className="font-semibold text-white">100+ проектов</span>
                      </div>
                      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                        <MapPin className="w-5 h-5 text-white" />
                        <span className="font-semibold text-white">Работаем по всей России</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Как заказать - CTA блок */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`relative overflow-hidden rounded-[2rem] p-8 md:p-10 shadow-2xl ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white' 
                    : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-black'
                }`}
              >
                {/* Decorative elements */}
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />

                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-black mb-4 flex items-center gap-3">
                    <MapPin className={`w-8 h-8 ${theme === 'dark' ? 'text-white' : 'text-black'}`} />
                    Как заказать строительные услуги
                  </h3>

                  <p className={`${theme === 'dark' ? 'text-white/90' : 'text-black/90'} mb-4 text-lg`}>
                    Офис компании: <strong>Ленинградская область, г. Светогорск, ул. Максима Горького, 7</strong>
                  </p>

                  <p className={`${theme === 'dark' ? 'text-white/90' : 'text-black/90'} mb-6 text-base`}>
                    Работаем со всеми регионами России — от Санкт-Петербурга и Ленинградской области до Дальнего Востока.
                    Предоставляем бесплатную консультацию, расчёт сметы и коммерческое предложение.
                  </p>

                  <a
                    href="tel:+79312470888"
                    className="inline-flex items-center gap-3 px-6 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                  >
                    <Phone className="w-5 h-5" />
                    +7 931 247-08-88
                  </a>
                </div>
              </motion.div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="relative">
            <FaqSection
            faqs={[
              {
                question: "Какие услуги вы предоставляете?",
                answer: "Мы предоставляем полный спектр строительно-монтажных работ: подготовительные работы, строительство зданий, монтаж металлоконструкций, теплоизоляцию, а также системы защиты периметра для промышленных объектов."
              },
              {
                question: "Какой у вас опыт работы?",
                answer: "Компания ООО «ЛЕГИОН» работает на рынке с 2012 года, за это время мы реализовали более 150 проектов в Санкт-Петербурге, Ленинградской области и других регионах России."
              },
              {
                question: "Какие гарантии вы предоставляете?",
                answer: "Мы предоставляем гарантию на все виды работ от 2 до 5 лет в зависимости от типа работ. Гарантия качества зафиксирована в договоре."
              },
              {
                question: "Работаете ли вы по всей России?",
                answer: "Да, мы работаем по всей России. Оставьте заявку или закажите обратный звонок, расскажем обо всем подробно"
              },
              {
                question: "Какие документы вы предоставляете?",
                answer: "Мы предоставляем полный пакет закрывающих документов: договор, акты выполненных работ, сертификаты качества, гарантийные обязательства и исполнительную документацию."
              }
            ]}
            title="Часто задаваемые вопросы"
            subtitle="Ответы на вопросы о строительных услугах компании ЛЕГИОН"
          />

          </section>

        </main>
      </div>
  );
}