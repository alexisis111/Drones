import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { Shield, Building2, Target, Zap, Award, Clock, Users, CheckCircle, ChevronRight, ArrowRight, Timer, Percent, Gift, Star } from 'lucide-react';
import { Link } from 'react-router';

const ProposalPage: React.FC = () => {
  const { theme } = useTheme();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isExpired, setIsExpired] = useState(false);

  // Устанавливаем таймер обратного отсчета (24 часа от текущего времени)
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0); // Устанавливаем на полночь следующего дня

      const difference = tomorrow.getTime() - now.getTime();

      if (difference <= 0) {
        setIsExpired(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds };
    };

    const timer = setInterval(() => {
      const timeLeftObj = calculateTimeLeft();
      setTimeLeft(timeLeftObj);

      if (timeLeftObj.days === 0 && timeLeftObj.hours === 0 && timeLeftObj.minutes === 0 && timeLeftObj.seconds === 0) {
        setIsExpired(true);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Используем реальные данные из ServicesCatalog
  const allServices = [
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
      price: "от 1500 руб/м²",
      stages: [
        "Оценка объекта и составление плана работ",
        "Подготовка территории",
        "Демонтаж конструкций",
        "Вывоз мусора",
        "Уборка территории"
      ],
      imageUrl: "https://sst52.ru/images/demontazh-zdanij2.jpg"
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
      price: "от 120 руб/м²",
      stages: [
        "Проектирование конструкции лесов",
        "Подготовка материалов",
        "Монтаж лесов",
        "Проверка безопасности",
        "Эксплуатация и демонтаж"
      ],
      imageUrl: "https://lesavyshki.ru/photos/2/Montazh-stroitelnyh-lesov.jpg"
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
      price: "от 500 руб/м²",
      stages: [
        "Осмотр территории",
        "Очистка от мусора и растительности",
        "Разметка участка",
        "Подведение временных коммуникаций",
        "Устройство подъездных путей"
      ],
      imageUrl: "https://masheka.by/uploads/posts/2024-03/podgotovka.jpg"
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
      price: "от 2000 руб/м²",
      stages: [
        "Проектирование благоустройства",
        "Подготовка территории",
        "Укладка покрытий",
        "Озеленение",
        "Монтаж элементов благоустройства"
      ],
      imageUrl: "https://субз.рф/assets/template/images/STROITELSTVO/blagoustrojstvo.jpg"
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
      price: "от 30000 руб",
      stages: [
        "Разработка конструкторской документации",
        "Подбор материалов",
        "Изготовление конструкций",
        "Контроль качества",
        "Доставка и монтаж"
      ],
      imageUrl: "https://st31.stpulscen.ru/images/product/299/103/931_original.jpg"
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
      price: "от 1500 руб/п.м.",
      stages: [
        "Проектирование системы",
        "Подготовка материалов",
        "Монтаж трубопровода",
        "Обвязка оборудования",
        "Пусконаладочные работы"
      ],
      imageUrl: "https://ngirf.ru/f/services/2017/07/_595b913aef5d33.jpg"
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
      price: "от 50000 руб",
      stages: [
        "Проектирование площадки",
        "Подготовка материалов",
        "Монтаж конструкций",
        "Обустройство ограждений",
        "Сдача в эксплуатацию"
      ],
      imageUrl: "https://engineering-experts.ru/upload/iblock/47b/ihhttwmxdslmwb9jzwy11u23o3z028uw.jpg"
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
      price: "от 500 руб/м²",
      stages: [
        "Подготовка поверхности",
        "Обработка преобразователем ржавчины",
        "Грунтовка",
        "Нанесение защитного покрытия",
        "Контроль качества"
      ],
      imageUrl: "https://www.kzit.ru/images/antikorrozionnaya-zashchita-metallokonstrukcij.jpg"
    },
    {
      id: 9,
      title: "Облицовочные работы",
      description: "Виды отделочных работ: облицовочные, штукатурные, малярные",
      category: "Работы по устройству каменных конструкций и отделочные работы",
      details: [
        "Облицовка плиткой",
        "Керамогранит",
        "Искусственный и натуральный камень"
      ],
      price: "от 1200 руб/м²",
      stages: [
        "Подготовка основания",
        "Разметка и выравнивание",
        "Укладка облицовочного материала",
        "Затирка швов",
        "Финальная уборка"
      ],
      imageUrl: "https://simterem.ru/wp-content/uploads/2025/03/otdelochnye-raboty-pod-klyuch-1.jpg"
    },
    {
      id: 10,
      title: "Устройство каменных конструкций",
      description: "Устройство конструкций из кирпича и строительных блоков",
      category: "Работы по устройству каменных конструкций и отделочные работы",
      details: [
        "Кладка кирпича",
        "Устройство блочных стен",
        "Армирование конструкций"
      ],
      price: "от 2000 руб/м³",
      stages: [
        "Подготовка раствора",
        "Выполнение кладки",
        "Армирование рядов",
        "Контроль геометрии",
        "Завершающая отделка"
      ],
      imageUrl: "https://gabioni.ru/Gabiones1-750x250.jpg"
    },
    {
      id: 11,
      title: "Опалубочные и арматурные работы",
      description: "Устройство и монтаж опалубки и арматурных каркасов",
      category: "Устройство монолитных и сборных бетонных и железобетонных конструкций",
      details: [
        "Изготовление опалубки",
        "Монтаж арматуры",
        "Контроль качества"
      ],
      price: "от 2500 руб/м³",
      stages: [
        "Проектирование опалубки",
        "Изготовление элементов опалубки",
        "Монтаж арматурного каркаса",
        "Установка опалубки",
        "Проверка перед бетонированием"
      ],
      imageUrl: "https://psk-monolit.com/images/steelworkers-1029665-1280.jpg"
    },
    {
      id: 12,
      title: "Устройство фундаментов",
      description: "Устройство и ремонт фундаментов зданий, сооружений и оборудования",
      category: "Устройство монолитных и сборных бетонных и железобетонных конструкций",
      details: [
        "Монолитные фундаменты",
        "Ремонт фундаментов",
        "Фундаменты под оборудование"
      ],
      price: "от 5000 руб/м³",
      stages: [
        "Разметка осей фундамента",
        "Подготовка котлована",
        "Устройство подушки",
        "Монтаж опалубки и арматуры",
        "Бетонирование и уход за бетоном"
      ],
      imageUrl: "https://lh4.googleusercontent.com/proxy/RFwPbhGjbt5GETwWR11rA6FBfBahPENl0xk27I1eBs83JpG9A2iyzSWDgo8DnGIMEySSudr1mUy0J1O4jsRHF2Dx_DnaRUE_jh2hypNv"
    },
    {
      id: 13,
      title: "Монтаж сборного железобетона",
      description: "Устройство монолитных бетонных и железобетонных конструкций",
      category: "Устройство монолитных и сборных бетонных и железобетонных конструкций",
      details: [
        "Монтаж ЖБИ",
        "Монолитные работы",
        "Контроль прочности"
      ],
      price: "от 3000 руб/т",
      stages: [
        "Разработка проекта монтажа",
        "Подготовка техники",
        "Доставка ЖБИ",
        "Монтаж конструкций",
        "Крепление и выверка"
      ],
      imageUrl: "https://mostopora.ru/site/images/1/montazh-zhelezobetonnyh-balok.jpg"
    },
    {
      id: 14,
      title: "Теплоизоляция оборудования",
      description: "Теплоизоляционные работы для технологического оборудования",
      category: "Теплоизоляционные работы",
      details: [
        "Изоляция оборудования",
        "Энергосбережение",
        "Снижение теплопотерь"
      ],
      price: "от 1000 руб/м²",
      stages: [
        "Осмотр оборудования",
        "Подбор теплоизоляционных материалов",
        "Подготовка поверхностей",
        "Монтаж теплоизоляции",
        "Обшивка защитным покрытием"
      ],
      imageUrl: "https://paritet-energo.ru/picture/slider-2017-12.png"
    },
    {
      id: 15,
      title: "Теплоизоляция трубопроводов",
      description: "Теплоизоляция технологических трубопроводов",
      category: "Теплоизоляционные работы",
      details: [
        "Изоляция трубопроводов",
        "Защита от промерзания",
        "Энергоэффективность"
      ],
      price: "от 800 руб/п.м.",
      stages: [
        "Осмотр трубопровода",
        "Подбор теплоизоляционных материалов",
        "Подготовка поверхностей",
        "Монтаж теплоизоляции",
        "Обшивка защитным покрытием"
      ],
      imageUrl: "https://millennium-official.ru/upload/iblock/00e/vh6mpzi5w06qa15h8r0fp78hz750jn7m.jpg"
    },
    {
      id: 16,
      title: "Земляные работы",
      description: "Земляные работы любой сложности",
      category: "Дополнительные услуги",
      details: [
        "Рытье котлованов",
        "Обратная засыпка",
        "Вывоз грунта"
      ],
      price: "от 1000 руб/м³",
      stages: [
        "Разметка участка",
        "Рытье котлованов и траншей",
        "Обратная засыпка",
        "Вывоз грунта",
        "Выравнивание территории"
      ],
      imageUrl: "https://arenda-ekskovatora-pogruzchika24.ru/wp-content/uploads/2018/03/razrabotka-kotlovana-1024x630.jpg"
    },
    {
      id: 17,
      title: "Строительство ангаров",
      description: "Строительство ангаров для различных целей",
      category: "Дополнительные услуги",
      details: [
        "Проектирование ангаров",
        "Строительство",
        "Оборудование внутрь"
      ],
      price: "от 1000000 руб",
      stages: [
        "Проектирование конструкции",
        "Подготовка фундамента",
        "Монтаж каркаса",
        "Обшивка сэндвич-панелями",
        "Оборудование внутрь"
      ],
      imageUrl: "https://iconstr.ru/assets/components/webpgenerator/cache/images/uslugi/stroitelistvo-angarov-pw.webp"
    },
    {
      id: 18,
      title: "Грузоперевозки",
      description: "Транспортировка материалов и оборудования",
      category: "Дополнительные услуги",
      details: [
        "Перевозка материалов",
        "Доставка оборудования",
        "Специализированный транспорт"
      ],
      price: "от 1000 руб/час",
      stages: [
        "Оценка объема груза",
        "Подбор транспорта",
        "Погрузка",
        "Транспортировка",
        "Разгрузка"
      ],
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrMRxioeNzhHfPhhgv_epmzWKq4uCPr4zKbA&s"
    },
    {
      id: 19,
      title: "Огнезащита конструкций",
      description: "Огнезащита металлических и деревянных конструкций",
      category: "Дополнительные услуги",
      details: [
        "Обработка металла",
        "Обработка дерева",
        "Соблюдение норм пожарной безопасности"
      ],
      price: "от 600 руб/м²",
      stages: [
        "Осмотр конструкций",
        "Подготовка поверхностей",
        "Нанесение огнезащитного состава",
        "Контроль толщины покрытия",
        "Сдача актов скрытых работ"
      ],
      imageUrl: "https://promalp-ural.ru/wp-content/uploads/2019/12/ognezashita-metallicheskih-konstrykciy.jpg"
    }
  ];

  // Выбираем услуги со скидкой (например, первые 3)
  const servicesWithDiscount = allServices.slice(0, 3);

  // Функция для форматирования цены
  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU') + ' ₽';
  };

  // Функция для извлечения числового значения из строки цены
  const extractNumericValue = (priceStr: string) => {
    if (!priceStr) return 0;
    const numericStr = priceStr.replace(/[^\d.-]/g, '');
    return parseFloat(numericStr) || 0;
  };

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-gray-900 to-purple-900">
          {/* Decorative elements */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('https://cdn.textstudio.com/text-effect/678/77902/%D0%90%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9%20%D0%BF%D0%BE%D0%B2%D1%82%D0%BE%D1%80%20%D0%BF%D0%B0%D1%82%D1%82%D0%B5%D1%80%D0%BD%20%D0%BF%D0%BE%D0%B2%D0%B5%D1%80%D1%85%20%D0%B3%D1%80%D0%B0%D0%B4%D0%B8%D0%B5%D0%BD%D1%82%D0%B0.webp')] bg-cover bg-center mix-blend-overlay opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-purple-600/10" />
          </div>

          {/* Floating elements */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
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
                className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-full px-4 py-2 shadow-lg"
              >
                <Gift className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">Ограниченное предложение</span>
              </motion.div>

              {/* Main heading */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white"
              >
                <span className="block">Специальное</span>
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Предложение
                </span>
                <span className="block">на 24 часа</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-300 max-w-2xl"
              >
                Только в течение 24 часов получите скидку 25% на выбранные услуги.
                Не упустите возможность сэкономить на строительных и монтажных работах.
              </motion.p>

              {/* Countdown Timer */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Timer className="w-5 h-5 text-red-400" />
                  <span className="text-white font-semibold">Осталось времени:</span>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <div className="text-center bg-gradient-to-b from-white/20 to-white/5 rounded-xl p-4 shadow-inner">
                    <div className="text-3xl font-bold text-white mb-1">{timeLeft.days.toString().padStart(2, '0')}</div>
                    <div className="text-xs text-gray-300 uppercase tracking-wide">Дней</div>
                  </div>
                  <div className="text-center bg-gradient-to-b from-white/20 to-white/5 rounded-xl p-4 shadow-inner">
                    <div className="text-3xl font-bold text-white mb-1">{timeLeft.hours.toString().padStart(2, '0')}</div>
                    <div className="text-xs text-gray-300 uppercase tracking-wide">Часов</div>
                  </div>
                  <div className="text-center bg-gradient-to-b from-white/20 to-white/5 rounded-xl p-4 shadow-inner">
                    <div className="text-3xl font-bold text-white mb-1">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                    <div className="text-xs text-gray-300 uppercase tracking-wide">Минут</div>
                  </div>
                  <div className="text-center bg-gradient-to-b from-white/20 to-white/5 rounded-xl p-4 shadow-inner">
                    <div className="text-3xl font-bold text-white mb-1">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                    <div className="text-xs text-gray-300 uppercase tracking-wide">Секунд</div>
                  </div>
                </div>

                {isExpired && (
                  <div className="mt-4 text-center text-red-400 font-bold bg-red-500/20 py-2 rounded-lg">
                    Время истекло! Скидка больше не действует.
                  </div>
                )}
              </motion.div>
              
              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Link to="/contacts" className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                  Получить скидку <ArrowRight className="inline ml-2 w-5 h-5" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Right column - Discount info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-8 border border-red-500/30 shadow-xl"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-lg">
                    <Percent className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Специальная скидка</h3>
                </div>

                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-white mb-2">25%</div>
                  <div className="text-gray-300">на выбранные услуги</div>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>Только 24 часа</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>Ограниченное количество</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>Без предоплаты</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>Гарантия качества</span>
                  </li>
                </ul>
                
                <div className="mt-6 pt-4 border-t border-white/20">
                  <div className="flex items-center justify-center gap-2 text-yellow-300">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="font-medium">Более 10 лет на рынке</span>
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services with Discounts Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Услуги по специальной цене
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Выберите одну из представленных услуг и получите скидку 25% в течение 24 часов
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesWithDiscount.map((service, index) => {
              // Рассчитываем скидку на основе цены услуги
              const numericPrice = extractNumericValue(service.price || "0");
              const discountAmount = numericPrice * 0.25; // 25% скидка
              const discountedPrice = numericPrice - discountAmount;

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl hover:shadow-2xl transition-all duration-300 ${
                    isExpired ? 'opacity-70' : ''
                  }`}
                >
                  <div className="relative h-48 overflow-hidden">
                    {service.imageUrl ? (
                      <img
                        src={service.imageUrl}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
                    
                    {/* Discount badge */}
                    {!isExpired && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          -25%
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                          {service.title}
                        </h3>
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          {service.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {formatPrice(discountedPrice)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 line-through">
                          {service.price}
                        </div>
                      </div>
                    </div>

                    <ul className="space-y-2 mb-4">
                      {service.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{detail}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Этапы работ
                          </span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                      
                      <div className="mt-3 space-y-1 max-h-24 overflow-y-auto">
                        {service.stages.slice(0, 3).map((stage, idx) => (
                          <div key={idx} className="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                            <span>{stage}</span>
                          </div>
                        ))}
                        {service.stages.length > 3 && (
                          <div className="text-xs text-blue-500 font-medium mt-1">
                            +{service.stages.length - 3} этапов...
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Link
                        to={`/service/${service.id}?discount=true&serviceId=${service.id}`}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium py-2.5 px-4 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        Подробнее <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </motion.div>
              );
            })}
          </div>
          
          {/* View All Services Button */}
          <div className="text-center mt-16">
            <Link to="/services" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              Посмотреть все услуги <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Готовы воспользоваться специальным предложением?
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              Свяжитесь с нами прямо сейчас и получите скидку 25% на выбранные услуги
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/contact" className="bg-white text-blue-600 font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                Связаться с нами
              </Link>
              <Link to="/calculator" className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-xl hover:bg-white/10 transition-colors duration-300">
                Рассчитать стоимость
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ProposalPage;