import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { Shield, Building2, Target, Zap, Award, Clock, Users, CheckCircle, ChevronRight, ArrowRight, Percent } from 'lucide-react';
import { Link, useSearchParams } from 'react-router';
import OptimizedImage from './OptimizedImage';
import LazyLoad from './LazyLoad';

interface Service {
  id: number;
  title: string;
  description: string;
  category: string;
  details: string[];
  imageUrl?: string;
  price?: string;
  categoryEn?: string;
}

const ServicesCatalog: React.FC = () => {
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

  // Функция для извлечения числового значения из строки цены
  const extractNumericValue = (priceStr: string) => {
    if (!priceStr) return 0;
    const numericStr = priceStr.replace(/[^\d.-]/g, '');
    return parseFloat(numericStr) || 0;
  };

  // Функция для расчета цены со скидкой
  const calculateDiscountedPrice = (priceStr: string) => {
    const numericPrice = extractNumericValue(priceStr);
    const discountAmount = numericPrice * 0.25; // 25% скидка
    const discountedPrice = numericPrice - discountAmount;

    // Извлекаем единицы измерения из строки цены (руб/м², руб/п.м., руб/т и т.д.)
    const unitMatch = priceStr.match(/(руб\/[а-яё]+|руб|р\.)/gi);
    const unit = unitMatch ? unitMatch[0] : 'руб';

    // Форматируем результат с сохранением текста
    return `${Math.round(discountedPrice).toLocaleString('ru-RU')} ${unit}`;
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Устанавливаем таймер обратного отсчета (24 часа от текущего времени)
  useEffect(() => {
    if (searchParams.get('discount') === 'true') {
      const calculateTimeLeft = () => {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0); // Устанавливаем на полночь следующего дня

        const difference = tomorrow.getTime() - now.getTime();

        if (difference <= 0) {
          return { hours: 0, minutes: 0, seconds: 0 };
        }

        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        return { hours, minutes, seconds };
      };

      const timer = setInterval(() => {
        const timeLeftObj = calculateTimeLeft();
        setTimeLeft(timeLeftObj);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [searchParams]);


  // Данные услуг на основе информации с сайта legion78.ru
  const services: Service[] = [
    {
      id: 1,
      title: "Разборка зданий и сооружений",
      description: "Демонтажные работы любой сложности с соблюдением всех норм безопасности",
      category: "Подготовительные работы",
      details: [
        "Демонтаж зданий и сооружений",
        "Удаление строительных конструкций",
        "Вывоз строительного мусора"
      ],
      imageUrl: "/img/services/img1.jpeg"
    },
    {
      id: 2,
      title: "Сборка лесов",
      description: "Монтаж инвентарных и неинвентарных наружных и внутренних лесов",
      category: "Подготовительные работы",
      details: [
        "Сборка наружных лесов",
        "Сборка внутренних лесов",
        "Безопасная эксплуатация"
      ],
      imageUrl: "/img/services/img2.jpeg"
    },
    {
      id: 3,
      title: "Подготовка строительного участка",
      description: "Комплекс мероприятий по подготовке территории к строительству",
      category: "Подготовительные работы",
      details: [
        "Очистка территории",
        "Разметка участка",
        "Подведение коммуникаций"
      ],
      imageUrl: "/img/services/img3.jpeg"
    },
    {
      id: 4,
      title: "Благоустройство территорий",
      description: "Комплекс работ по обустройству прилегающих территорий",
      category: "Подготовительные работы",
      details: [
        "Устройство дорожек",
        "Озеленение",
        "Монтаж малых архитектурных форм"
      ],
      imageUrl: "/img/services/img4.jpeg"
    },
    {
      id: 5,
      title: "Изготовление металлоконструкций",
      description: "Производство металлических конструкций любой сложности",
      category: "Монтаж металлических конструкций",
      details: [
        "Изготовление по чертежам",
        "Любая сложность",
        "Контроль качества"
      ],
      imageUrl: "/img/services/img5.jpeg"
    },
    {
      id: 6,
      title: "Монтаж технологических трубопроводов",
      description: "Установка и ремонт технологических трубопроводов",
      category: "Монтаж металлических конструкций",
      details: [
        "Монтаж трубопроводов",
        "Ремонт систем",
        "Обвязка оборудования"
      ],
      imageUrl: "/img/services/img6.jpeg"
    },
    {
      id: 7,
      title: "Монтаж технологических площадок",
      description: "Устройство площадок для обслуживания технологического оборудования",
      category: "Монтаж металлических конструкций",
      details: [
        "Разработка проектов",
        "Монтаж конструкций",
        "Обустройство безопасного доступа"
      ],
      imageUrl: "/img/services/img7.jpeg"
    },
    {
      id: 8,
      title: "Антикоррозийная защита",
      description: "Защита металлических и бетонных конструкций от коррозии",
      category: "Монтаж металлических конструкций",
      details: [
        "Обработка металла",
        "Обработка бетона",
        "Применение современных материалов"
      ],
      imageUrl: "/img/services/img8.jpeg"
    },
    {
      id: 9,
      title: "Устройство каменных конструкций",
      description: "Устройство конструкций из кирпича и строительных блоков",
      category: "Работы по устройству каменных конструкций и отделочные работы",
      details: [
        "Кладка кирпича",
        "Устройство блочных стен",
        "Армирование конструкций"
      ],
      imageUrl: "/img/services/img10.jpeg"
    },
    {
      id: 10,
      title: "Устройство фундаментов",
      description: "Устройство и ремонт фундаментов зданий, сооружений и оборудования",
      category: "Устройство монолитных и сборных бетонных и железобетонных конструкций",
      details: [
        "Монолитные фундаменты",
        "Ремонт фундаментов",
        "Фундаменты под оборудование"
      ],
      imageUrl: "/img/services/img12.jpeg"
    },
    {
      id: 11,
      title: "Монтаж сборного железобетона",
      description: "Устройство монолитных бетонных и железобетонных конструкций",
      category: "Устройство монолитных и сборных бетонных и железобетонных конструкций",
      details: [
        "Монтаж ЖБИ",
        "Монолитные работы",
        "Контроль прочности"
      ],
      imageUrl: "/img/services/img13.jpeg"
    },
    {
      id: 12,
      title: "Теплоизоляция оборудования",
      description: "Теплоизоляционные работы для технологического оборудования",
      category: "Теплоизоляционные работы",
      details: [
        "Изоляция оборудования",
        "Энергосбережение",
        "Снижение теплопотерь"
      ],
      imageUrl: "/img/services/img14.jpeg"
    },
    {
      id: 13,
      title: "Теплоизоляция трубопроводов",
      description: "Теплоизоляция технологических трубопроводов",
      category: "Теплоизоляционные работы",
      details: [
        "Изоляция трубопроводов",
        "Защита от промерзания",
        "Энергоэффективность"
      ],
      imageUrl: "/img/services/img15.jpeg"
    },
    {
      id: 14,
      title: "Земляные работы",
      description: "Земляные работы любой сложности",
      category: "Дополнительные услуги",
      details: [
        "Рытье котлованов",
        "Обратная засыпка",
        "Вывоз грунта"
      ],
      imageUrl: "/img/services/img16.jpeg"
    },
    {
      id: 15,
      title: "Строительство ангаров",
      description: "Строительство ангаров для различных целей",
      category: "Дополнительные услуги",
      details: [
        "Проектирование ангаров",
        "Строительство",
        "Оборудование внутрь"
      ],
      imageUrl: "/img/services/img17.jpeg"
    },
    {
      id: 16,
      title: "Грузоперевозки",
      description: "Транспортировка материалов и оборудования",
      category: "Дополнительные услуги",
      details: [
        "Перевозка материалов",
        "Доставка оборудования",
        "Специализированный транспорт"
      ],
      imageUrl: "/img/services/img18.jpeg"
    },
    {
      id: 17,
      title: "Огнезащита конструкций",
      description: "Огнезащита металлических и деревянных конструкций",
      category: "Дополнительные услуги",
      details: [
        "Обработка металла",
        "Обработка дерева",
        "Соблюдение норм пожарной безопасности"
      ],
      imageUrl: "/img/services/img19.jpeg"
    }
  ];

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

  const handleOrderService = (serviceName: string) => {
    // Здесь будет логика для создания заявки на услугу
    alert(`Заявка на услугу "${serviceName}" создана! Мы свяжемся с вами в ближайшее время.`);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background with parallax effect */}
        {/* Optimized background with parallax effect */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-900 via-gray-900 to-purple-900"
        >
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('/img/homesImg/services.jpeg')] bg-cover bg-center mix-blend-overlay opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-purple-600/10" />
          </div>
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
                <span className="text-sm font-medium text-white">Полный спектр услуг</span>
              </motion.div>

              {/* Main heading */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white"
              >
                <span className="block">Наши</span>
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Услуги
                </span>
                <span className="block">и решения</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-300 max-w-2xl"
              >
                Полный спектр строительно-монтажных работ любой сложности. 
                От подготовительных работ до сдачи объекта "под ключ". 
                Современные технологии и проверенные материалы.
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {[
                  { value: "17", label: "Услуг" },
                  { value: "6+", label: "Категорий" },
                  { value: "100%", label: "Качество" },
                  { value: "12+", label: "Лет опыта" },
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
                <Link
                  to="/contacts"
                  className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <span>Обсудить проект</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/proposal"
                  className="group inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <span>Оставить заявку</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Right column - Feature cards */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-6"
            >
              {[
                {
                  icon: <Shield className="w-6 h-6" />,
                  title: "Защита периметра",
                  description: "Современные системы защиты от БПЛА",
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  icon: <Building2 className="w-6 h-6" />,
                  title: "Строительство",
                  description: "Полный цикл от фундамента до отделки",
                  color: "from-purple-500 to-pink-500"
                },
                {
                  icon: <Target className="w-6 h-6" />,
                  title: "Точность работ",
                  description: "Соблюдение всех нормативов и сроков",
                  color: "from-orange-500 to-red-500"
                },
                {
                  icon: <Zap className="w-6 h-6" />,
                  title: "Скорость",
                  description: "Оперативное выполнение задач",
                  color: "from-green-500 to-emerald-500"
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  whileHover={{ x: -10 }}
                  className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color}`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Catalog Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Каталог услуг
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Выберите интересующую вас категорию услуг. Мы готовы реализовать проекты любой сложности.
            </p>
          </motion.div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
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
                  className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    {service.imageUrl ? (
                      <OptimizedImage
                        src={service.imageUrl}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        width={400}
                        height={300}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                        <Building2 className="w-12 h-12 text-white opacity-50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {service.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {service.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {service.description}
                    </p>

                    <div className="mb-4">
                      {service.price && (
                        <div className={`rounded-lg p-3 ${
                          searchParams.get('discount') === 'true' && [1, 2, 3].includes(service.id)
                            ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-sm'
                            : 'bg-white/10 backdrop-blur-sm'
                        }`}>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Цена:</span>
                            <span className="font-medium text-gray-900 dark:text-white">{service.price}</span>
                          </div>

                          {searchParams.get('discount') === 'true' && [1, 2, 3].includes(service.id) && (
                            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-green-600 dark:text-green-400">Со скидкой:</span>
                                <span className="font-bold text-green-600 dark:text-green-400">
                                  {calculateDiscountedPrice(service.price)}
                                </span>
                              </div>
                              <div className="mt-1 text-xs text-yellow-600 dark:text-yellow-400 flex items-center">
                                <Percent className="w-3 h-3 mr-1" />
                                Специальное предложение
                              </div>
                              <div className="mt-2 grid grid-cols-3 gap-1">
                                <div className="text-center bg-gradient-to-b from-white/20 to-white/5 rounded p-1.5 shadow-inner">
                                  <div className="text-sm font-bold text-white">{timeLeft.hours.toString().padStart(2, '0')}</div>
                                  <div className="text-[0.6rem] text-gray-300 uppercase tracking-wide">Ч</div>
                                </div>
                                <div className="text-center bg-gradient-to-b from-white/20 to-white/5 rounded p-1.5 shadow-inner">
                                  <div className="text-sm font-bold text-white">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                                  <div className="text-[0.6rem] text-gray-300 uppercase tracking-wide">М</div>
                                </div>
                                <div className="text-center bg-gradient-to-b from-white/20 to-white/5 rounded p-1.5 shadow-inner">
                                  <div className="text-sm font-bold text-white">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                                  <div className="text-[0.6rem] text-gray-300 uppercase tracking-wide">С</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                        Включает:
                      </h4>
                      <ul className="space-y-1">
                        {service.details.slice(0, 3).map((detail, idx) => (
                          <li key={idx} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-gray-600 dark:text-gray-400 text-sm">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-3">
                      <Link
                        to={
                          [1, 2, 3].includes(service.id)
                            ? `/service/${service.id}?discount=true&serviceId=${service.id}`
                            : `/service/${service.id}`
                        }
                        className="flex-1 text-center py-3 px-4 rounded-lg font-medium transition-all bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20"
                      >
                        Подробнее
                      </Link>

                      <button
                        onClick={() => handleOrderService(service.title)}
                        className="flex-1 py-3 px-4 rounded-lg font-medium transition-all bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
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

              <Link
                to="/proposal"
                className="group inline-flex items-center justify-center gap-3 bg-transparent text-white px-8 py-4 rounded-xl font-semibold border-2 border-white hover:bg-white/10 transition-all duration-300"
              >
                <span>Отправить заявку</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ServicesCatalog;