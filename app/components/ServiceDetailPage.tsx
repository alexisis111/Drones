import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { Shield, Building2, CheckCircle, ChevronRight, ArrowRight, Package, Hammer, Ruler, Percent } from 'lucide-react';
import { Link } from 'react-router';
import ServiceOrderModal from './ServiceOrderModal';

interface Service {
  id: number;
  title: string;
  description: string;
  category: string;
  details: string[];
  stages?: string[];
  benefits?: string[];
  imageUrl?: string;
}

const ServiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { theme } = useTheme();
  const [service, setService] = useState<Service | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

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
      benefits: [
        "Опыт работы более 10 лет",
        "Соблюдение всех норм безопасности",
        "Экологически чистое удаление отходов",
        "Использование современной техники"
      ],
      stages: [
        "Оценка объекта и составление плана работ",
        "Подготовка территории",
        "Демонтаж конструкций",
        "Вывоз мусора",
        "Уборка территории"
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
      benefits: [
        "Использование сертифицированных материалов",
        "Соблюдение норм охраны труда",
        "Быстрый монтаж и демонтаж",
        "Гарантия безопасности при эксплуатации"
      ],
      stages: [
        "Проектирование конструкции лесов",
        "Подготовка материалов",
        "Монтаж лесов",
        "Проверка безопасности",
        "Эксплуатация и демонтаж"
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
      benefits: [
        "Комплексный подход к подготовке",
        "Использование современной техники",
        "Соблюдение экологических норм",
        "Подготовка под любые виды строительства"
      ],
      stages: [
        "Осмотр территории",
        "Очистка от мусора и растительности",
        "Разметка участка",
        "Подведение временных коммуникаций",
        "Устройство подъездных путей"
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
      benefits: [
        "Индивидуальный подход к каждому проекту",
        "Использование качественных материалов",
        "Создание комфортной среды",
        "Эстетичный и долговечный результат"
      ],
      stages: [
        "Проектирование благоустройства",
        "Подготовка территории",
        "Укладка покрытий",
        "Озеленение",
        "Монтаж элементов благоустройства"
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
      benefits: [
        "Производство по индивидуальным проектам",
        "Высокоточное оборудование",
        "Гарантия качества и надежности",
        "Собственное производство"
      ],
      stages: [
        "Разработка конструкторской документации",
        "Подбор материалов",
        "Изготовление конструкций",
        "Контроль качества",
        "Доставка и монтаж"
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
      stages: [
        "Проектирование системы",
        "Подготовка материалов",
        "Монтаж трубопровода",
        "Обвязка оборудования",
        "Пусконаладочные работы"
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
      stages: [
        "Проектирование площадки",
        "Подготовка материалов",
        "Монтаж конструкций",
        "Обустройство ограждений",
        "Сдача в эксплуатацию"
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
      stages: [
        "Подготовка поверхности",
        "Обработка преобразователем ржавчины",
        "Грунтовка",
        "Нанесение защитного покрытия",
        "Контроль качества"
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
      stages: [
        "Подготовка раствора",
        "Выполнение кладки",
        "Армирование рядов",
        "Контроль геометрии",
        "Завершающая отделка"
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
      stages: [
        "Разметка осей фундамента",
        "Подготовка котлована",
        "Устройство подушки",
        "Монтаж опалубки и арматуры",
        "Бетонирование и уход за бетоном"
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
      stages: [
        "Разработка проекта монтажа",
        "Подготовка техники",
        "Доставка ЖБИ",
        "Монтаж конструкций",
        "Крепление и выверка"
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
      stages: [
        "Осмотр оборудования",
        "Подбор теплоизоляционных материалов",
        "Подготовка поверхностей",
        "Монтаж теплоизоляции",
        "Обшивка защитным покрытием"
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
      stages: [
        "Осмотр трубопровода",
        "Подбор теплоизоляционных материалов",
        "Подготовка поверхностей",
        "Монтаж теплоизоляции",
        "Обшивка защитным покрытием"
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
      stages: [
        "Разметка участка",
        "Рытье котлованов и траншей",
        "Обратная засыпка",
        "Вывоз грунта",
        "Выравнивание территории"
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
      stages: [
        "Проектирование конструкции",
        "Подготовка фундамента",
        "Монтаж каркаса",
        "Обшивка сэндвич-панелями",
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
      stages: [
        "Оценка объема груза",
        "Подбор транспорта",
        "Погрузка",
        "Транспортировка",
        "Разгрузка"
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
      stages: [
        "Осмотр конструкций",
        "Подготовка поверхностей",
        "Нанесение огнезащитного состава",
        "Контроль толщины покрытия",
        "Сдача актов скрытых работ"
      ],
      imageUrl: "/img/services/img19.jpeg"
    }
  ];

  useEffect(() => {
    const serviceId = parseInt(id || '0');
    const foundService = services.find(s => s.id === serviceId);
    if (foundService) {
      setService(foundService);
    } else {
      navigate('/services');
    }
  }, [id, navigate]);

  const handleOrderService = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
    // Блокируем прокрутку body при открытии модалки
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
    // Возвращаем прокрутку body
    document.body.style.overflow = 'unset';
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
        <section className="relative min-h-screen flex items-center overflow-hidden">
          {/* Background with parallax effect */}
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
                  <Package className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium text-white">{service.category}</span>
                </motion.div>

                {/* Main heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white"
                >
                  {service.title}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl text-gray-300 max-w-2xl"
                >
                  {service.description}
                </motion.p>

                {/* CTA Buttons */}
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

              {/* Right column - Feature cards */}
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

                {/* Benefits section */}
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
                {/* Service Description */}
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

                {/* Service Stages */}
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
                <span className="text-sm font-medium tracking-wider">РЕКОМЕНДУЕМ</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Похожие услуги
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Ознакомьтесь с другими услугами в этой категории
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services
                  .filter(s => s.category === service.category && s.id !== service.id)
                  .slice(0, 3)
                  .map((relatedService, index) => (
                      <motion.div
                          key={relatedService.id}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ y: -10 }}
                          className="group relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300"
                      >
                        <div className="relative h-48 overflow-hidden">
                          {relatedService.imageUrl ? (
                              <img
                                  src={relatedService.imageUrl}
                                  alt={relatedService.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                          ) : (
                              <div className="w-full h-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                                <Building2 className="w-12 h-12 text-white opacity-50" />
                              </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                          <div className="absolute top-4 right-4">
                      <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/30">
                        {relatedService.category}
                      </span>
                          </div>
                        </div>

                        <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                            {relatedService.title}
                          </h3>

                          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                            {relatedService.description}
                          </p>

                          <div className="flex justify-end items-center mt-6">
                            <Link
                                to={`/service/${relatedService.id}`}
                                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold group/link hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                            >
                              <span>Подробнее</span>
                              <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                  ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
          {/* Декоративные элементы */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center text-white"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Готовы заказать эту услугу?
              </h2>

              <p className="text-xl opacity-90 max-w-3xl mx-auto mb-12 leading-relaxed">
                Свяжитесь с нами прямо сейчас и получите консультацию от наших специалистов.
                Мы поможем реализовать ваш проект с учетом всех требований и пожеланий.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                    onClick={() => handleOrderService(service)}
                    className="group inline-flex items-center justify-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <span>Заказать услугу</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <Link
                    to="/contacts"
                    className="group inline-flex items-center justify-center gap-3 bg-transparent text-white px-8 py-4 rounded-xl font-semibold border-2 border-white hover:bg-white/10 transition-all duration-300"
                >
                  <span>Связаться с нами</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Service Order Modal - вынесен на верхний уровень */}
        <ServiceOrderModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            service={selectedService}
            onSubmit={handleModalSubmit}
        />
      </div>
  );
};

export default ServiceDetailPage;