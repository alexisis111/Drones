import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import OptimizedImage from './OptimizedImage';
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
    AlertTriangle,
    Maximize2,
    Trophy,
    Phone,
    MessageSquare,
    ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router';
import FullscreenModal from './FullscreenModal';
import FaqSection from './FaqSection';
import ProjectEstimateModal from './ProjectEstimateModal';
import Breadcrumbs, { type BreadcrumbItem } from './Breadcrumbs';
import { useCallbackForm } from '../hooks/useCallbackForm';
import { CallbackModal } from './CallbackModal';

interface DroneDefensePageProps {
    breadcrumbs?: BreadcrumbItem[];
}

const DroneDefensePage: React.FC<DroneDefensePageProps> = ({ breadcrumbs }) => {
    const { theme } = useTheme();
    const [scrollY, setScrollY] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEstimateModalOpen, setIsEstimateModalOpen] = useState(false);

    // ----модалка для заказа звонка -----
    const {
        callbackForm,
        isCallbackSubmitting,
        callbackSuccess,
        phoneError,
        isCallbackModalOpen,
        setIsCallbackModalOpen,
        handleCallbackChange,
        handlePhoneChange,
        handlePhoneBlur,
        handlePhoneFocus,
        handleCallbackSubmit
    } = useCallbackForm('DroneDefensePage - обратный звонок');

    const onCallbackSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleCallbackSubmit(
            'DroneDefensePage - обратный звонок',
            '📞 Новое сообщение на обратный звонок'
        );
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleEstimateSubmit = async (formData: any) => {
        console.log('Submitting estimate form:', formData);
        try {
            const response = await fetch('/api/telegram-webhook', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            console.log('Submit result:', result);
            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Ошибка при отправке заявки');
            }
            return result;
        } catch (error) {
            console.error('Submit error:', error);
            throw error;
        }
    };

    // Данные для карточек в стиле портфолио
    const protectionLevels = [
        {
            id: 1,
            stage: "01",
            title: "Расчет стоимости защиты",
            description: "Индивидуальное комплексное решение для вашего объекта",
            features: [
                "Расчет стоимости системы защиты",
                "Индивидуальный подход к объекту",
                "Проект с учётом климатических условий",
                "Оптимальное решение по цене"
            ],
            tags: ["Порты", "Аэропорты", "ТЭЦ", "ЦОД"],
            gradient: "from-purple-500 to-pink-500",
            bgGradient: "from-purple-900/30 to-pink-900/30",
            price: "Бесплатно",
            icon: <Award className="w-5 h-5" />
        },
        {
            id: 2,
            stage: "02",
            title: "Монтаж ЗОК",
            description: "Быстровозводимые конструкции с трёхуровневой защитой",
            features: [
                "Стальной каркас с сеткой",
                "Монтаж на опоры-колонны",
                "Индивидуальный расчёт фундамента",
                "Антикоррозийное покрытие"
            ],
            tags: ["Нефтебазы", "Заводы", "Мосты", "Плотины"],
            gradient: "from-red-500 to-orange-500",
            bgGradient: "from-red-900/30 to-orange-900/30",
            price: "До 400 кг",
            icon: <Shield className="w-5 h-5" />
        },
        {
            id: 3,
            stage: "03",
            title: "Эксплуатация и сервис",
            description: "Минимальные затраты на всём жизненном цикле",
            features: [
                "Проектирование под минимальные затраты",
                "Бесперебойная эксплуатация",
                "Быстрое восстановление после атак",
                "Полный цикл: от идеи до сервиса"
            ],
            tags: ["Проектирование", "Изготовление", "Монтаж", "Сервис"],
            gradient: "from-green-500 to-emerald-500",
            bgGradient: "from-green-900/30 to-emerald-900/30",
            price: "25+ лет",
            icon: <CheckCircle className="w-5 h-5" />
        }
    ];

    const features = [
        {
            icon: <Shield className="w-5 h-5" />,
            title: "Полная защита",
            description: "Комплексная система защиты периметра от всех типов беспилотников",
            gradient: "from-blue-500 to-cyan-500"
        },
        {
            icon: <Target className="w-5 h-5" />,
            title: "Трехуровневая защита",
            description: "Несколько уровней защиты для максимальной безопасности",
            gradient: "from-purple-500 to-pink-500"
        },
        {
            icon: <Zap className="w-5 h-5" />,
            title: "Быстрое возведение",
            description: "Работаем быстро и качественно",
            gradient: "from-orange-500 to-red-500"
        },
        {
            icon: <Clock className="w-5 h-5" />,
            title: "Гарантия качества",
            description: "Надежное качество конструкции гарантирует долговечность",
            gradient: "from-green-500 to-emerald-500"
        },
        {
            icon: <Award className="w-5 h-5" />,
            title: "Сертифицировано",
            description: "Все компоненты имеют сертификаты соответствия",
            gradient: "from-blue-500 to-purple-500"
        },
        {
            icon: <Users className="w-5 h-5" />,
            title: "Поддержка 24/7",
            description: "Всегда на связи и готовы помочь в любой ситуации",
            gradient: "from-pink-500 to-rose-500"
        }
    ];

    const applications = [
        {
            icon: <Building2 className="w-5 h-5" />,
            title: "Промышленные объекты",
            description: "Защита производственных площадок и складов",
            imageUrl: "https://thumbs.dreamstime.com/b/%D0%BF%D1%80%D0%BE%D0%BC%D1%8B%D1%88%D0%BB%D0%B5%D0%BD%D0%BD%D1%8B%D0%B9-%D0%BE%D0%B1%D1%8A%D0%B5%D0%BA%D1%82-%D0%BD%D0%B5%D1%84%D1%82%D1%8F%D0%BD%D0%BE%D0%B9-%D0%BF%D1%80%D0%BE%D0%BC%D1%8B%D1%88%D0%BB%D0%B5%D0%BD%D0%BD%D0%BE%D1%81%D1%82%D0%B8-%D1%82%D0%B0%D0%BD%D0%BA%D0%B8-%D1%82%D1%80%D1%83%D0%B1%D0%BE%D0%BF%D1%80%D0%BE%D0%B2%D0%BE%D0%B4%D0%BE%D0%B2-201992006.jpg"
        },
        {
            icon: <Users className="w-5 h-5" />,
            title: "Госучреждения",
            description: "Объекты с особым режимом безопасности",
            imageUrl: "https://1sn.ru/storage/posts/138736.jpeg"
        },
        {
            icon: <Shield className="w-5 h-5" />,
            title: "Частный бизнес",
            description: "Объекты с ограниченным доступом",
            imageUrl: "https://bzplan.ru/wp-content/uploads/2016/06/Biznes-plan-mini-zavoda-po-proizvodstvu-tsementa.jpg"
        },
        {
            icon: <Target className="w-5 h-5" />,
            title: "Критическая инфраструктура",
            description: "Энергетические и транспортные объекты",
            imageUrl: "https://storge-bk.ru/wp-content/uploads/2020/12/transformatori.jpg"
        }
    ];

    const regulations = [
        {
            number: "01",
            title: "ПП РФ №1046",
            date: "от 03.08.2024",
            description: "Защита объектов ТЭК от дронов",
            color: "from-blue-500 to-cyan-500"
        },
        {
            number: "02",
            title: "ПП РФ №258",
            date: "от 03.03.2024",
            description: "Безопасность предприятий от БПЛА",
            color: "from-purple-500 to-pink-500"
        },
        {
            number: "03",
            title: "ФЗ №390-ФЗ",
            date: "«О безопасности»",
            description: "Безопасность стратегических объектов",
            color: "from-orange-500 to-red-500"
        },
        {
            number: "04",
            title: "СП 542.1325800",
            date: "действующий",
            description: "Проектирование защитных конструкций",
            color: "from-green-500 to-emerald-500"
        }
    ];

    return (
        <div className="relative overflow-hidden">
            {/* Hero Section - Portfolio Style */}
            <section className="relative flex items-center">
                <div className="relative container mx-auto px-4 z-10">
                    {breadcrumbs && (
                        <div className="py-4">
                            <Breadcrumbs breadcrumbs={breadcrumbs} className={
                                theme === 'dark' ? 'text-white/80' : 'text-gray-600'
                            } />
                        </div>
                    )}

                    <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
                        {/* Left column - Main content */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6 md:space-y-8"
                        >
                            {/* Badges */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex flex-wrap gap-2"
                            >
                                <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 backdrop-blur-sm border ${
                                    theme === 'dark'
                                        ? 'bg-blue-900/30 text-blue-400 border-blue-800/30'
                                        : 'bg-blue-100 text-blue-600 border-blue-200'
                                }`}>
                                    <Shield className="w-4 h-4" />
                                    <span className="text-sm font-medium">Системы защиты периметра</span>
                                </div>
                                <div className={`inline-flex items-center gap-2 backdrop-blur-sm rounded-full px-4 py-2 border ${
                                    theme === 'dark'
                                        ? 'bg-blue-600/20 border-blue-400/30'
                                        : 'bg-blue-600/10 border-blue-300/30'
                                }`}>
                                    <Trophy className="w-4 h-4 text-yellow-400" />
                                    <span className={`text-sm font-bold ${
                                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                                    }`}>№1 в России по ЗОК</span>
                                </div>
                            </motion.div>

                            {/* Main heading */}
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight ${
                                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}
                            >
                                <span className="block">Комплексная защита</span>
                                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  от БПЛА
                </span>
                                <span className={`block text-base md:text-lg mt-2 font-normal ${
                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                  по <Link
                                    href="https://protect.gost.ru/v.aspx?control=8&baseC=101&page=4&month=-1&year=-1&search=&RegNum=54&DocOnPageCount=100&id=253478"
                                    className={`inline-flex items-center gap-1 hover:underline ${
                                        theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                                    }`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                    СП 542.1325800.2024
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </span>
                            </motion.h1>

                            {/* Subtitle */}
                            <motion.p
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className={`text-sm md:text-lg max-w-2xl ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                }`}
                            >
                                Установка антидроновых систем под ключ: ТЭК, заводы, склады и частные объекты.
                                Решения для крупных, средних и малых предприятий.
                            </motion.p>

                            {/* CTA Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="flex flex-col sm:flex-row gap-3"
                            >
                                <a
                                    href="tel:+79312470888"
                                    className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25 inline-flex items-center justify-center gap-2 text-sm"
                                >
                                    <Phone className="w-4 h-4" />
                                    Позвонить
                                </a>
                                <button
                                    onClick={() => setIsCallbackModalOpen(true)}
                                    className={`px-6 py-3.5 font-semibold rounded-xl border transition-all inline-flex items-center justify-center gap-2 text-sm ${
                                        theme === 'dark'
                                            ? 'bg-gray-800/50 text-white border-gray-700 hover:bg-gray-800/70'
                                            : 'bg-white/80 text-gray-900 border-gray-300 hover:bg-white'
                                    }`}
                                >
                                    <MessageSquare className="w-4 h-4" />
                                    Обратный звонок
                                </button>
                            </motion.div>

                            {/* Trust badges */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                                className={`flex flex-wrap gap-3 pt-3 border-t ${
                                    theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                                }`}
                            >
                                {[
                                    "Сертифицировано ФСТЭК",
                                    "Монтаж по всей РФ",
                                    "Сопровождение на всех этапах"
                                ].map((item, i) => (
                                    <div key={i} className={`flex items-center gap-2 text-xs ${
                                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                        <CheckCircle className="w-3 h-3 text-green-500" />
                                        {item}
                                    </div>
                                ))}
                            </motion.div>
                        </motion.div>

                        {/* Right column - Regulatory Cards */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="space-y-3"
                        >
                            {/* Header - Regulation Title */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className={`rounded-2xl p-5 shadow-xl border ${
                                    theme === 'dark'
                                        ? 'bg-red-900/30 border-red-800/50'
                                        : 'bg-red-50 border-red-200'
                                }`}
                            >
                                <div className="flex items-start gap-3 mb-3">
                                    <div className={`p-2 rounded-lg ${
                                        theme === 'dark' ? 'bg-red-800/50' : 'bg-red-200'
                                    }`}>
                                        <AlertTriangle className={`w-5 h-5 ${
                                            theme === 'dark' ? 'text-red-400' : 'text-red-600'
                                        }`} />
                                    </div>
                                    <div>
                                        <h3 className={`text-base font-bold mb-1 ${
                                            theme === 'dark' ? 'text-red-400' : 'text-red-700'
                                        }`}>Нормативные требования</h3>
                                        <p className={`text-xs ${
                                            theme === 'dark' ? 'text-red-300' : 'text-red-600'
                                        }`}>
                                            Согласно Постановлению Правительства РФ от 05.05.2012 № 460 (в ред. от 2023 г.)
                                        </p>
                                    </div>
                                </div>
                                
                                <div className={`p-4 rounded-xl mb-4 ${
                                    theme === 'dark' ? 'bg-red-800/30' : 'bg-white/70'
                                }`}>
                                    <h4 className={`text-sm font-bold mb-2 ${
                                        theme === 'dark' ? 'text-red-300' : 'text-red-700'
                                    }`}>Обязанности руководителей</h4>
                                    <p className={`text-xs ${
                                        theme === 'dark' ? 'text-red-200' : 'text-gray-700'
                                    }`}>
                                        Руководители объектов ТЭК, промышленности и других критически важных сфер обязаны обеспечивать их антитеррористическую защищенность
                                    </p>
                                </div>
                                
                                <Link
                                    to="/contacts"
                                    className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 text-xs ${
                                        theme === 'dark'
                                            ? 'bg-red-400 text-red-900 hover:bg-red-300'
                                            : 'bg-red-600 text-white hover:bg-red-700'
                                    }`}
                                >
                                    <span>Получить консультацию</span>
                                    <ChevronRight className="w-3 h-3" />
                                </Link>
                            </motion.div>

                            {/* Consequences Block */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className={`rounded-2xl p-5 shadow-xl border ${
                                    theme === 'dark'
                                        ? 'bg-orange-900/30 border-orange-800/50'
                                        : 'bg-orange-50 border-orange-200'
                                }`}
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <div className={`p-2 rounded-lg ${
                                        theme === 'dark' ? 'bg-orange-800/50' : 'bg-orange-200'
                                    }`}>
                                        <Target className={`w-5 h-5 ${
                                            theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
                                        }`} />
                                    </div>
                                    <h3 className={`text-base font-bold ${
                                        theme === 'dark' ? 'text-orange-400' : 'text-orange-700'
                                    }`}>Последствия несоответствия</h3>
                                </div>
                                
                                <div className="space-y-3">
                                    <div className={`flex items-start gap-3 p-3 rounded-xl ${
                                        theme === 'dark' ? 'bg-orange-800/30' : 'bg-white/70'
                                    }`}>
                                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                            theme === 'dark' ? 'bg-orange-700 text-orange-300' : 'bg-orange-200 text-orange-700'
                                        }`}>
                                            1
                                        </div>
                                        <p className={`text-sm ${
                                            theme === 'dark' ? 'text-orange-200' : 'text-gray-700'
                                        }`}>
                                            Административные штрафы и приостановку деятельности
                                        </p>
                                    </div>
                                    
                                    <div className={`flex items-start gap-3 p-3 rounded-xl ${
                                        theme === 'dark' ? 'bg-orange-800/30' : 'bg-white/70'
                                    }`}>
                                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                            theme === 'dark' ? 'bg-orange-700 text-orange-300' : 'bg-orange-200 text-orange-700'
                                        }`}>
                                            2
                                        </div>
                                        <p className={`text-sm ${
                                            theme === 'dark' ? 'text-orange-200' : 'text-gray-700'
                                        }`}>
                                            Персональную ответственность руководителей
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Regulation Cards Grid */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                                className="grid grid-cols-2 gap-3"
                            >
                                {[
                                    {
                                        number: "01",
                                        title: "ПП РФ №1046",
                                        date: "от 03.08.2024",
                                        description: "Защита объектов ТЭК от дронов",
                                        color: "from-blue-500 to-cyan-500"
                                    },
                                    {
                                        number: "02",
                                        title: "ПП РФ №258",
                                        date: "от 03.03.2024",
                                        description: "Безопасность предприятий от БПЛА",
                                        color: "from-purple-500 to-pink-500"
                                    },
                                    {
                                        number: "03",
                                        title: "ФЗ №390-ФЗ",
                                        date: "«О безопасности»",
                                        description: "Безопасность стратегических объектов",
                                        color: "from-orange-500 to-red-500"
                                    },
                                    {
                                        number: "04",
                                        title: "СП 542.1325800",
                                        date: "действующий",
                                        description: "Проектирование защитных конструкций",
                                        color: "from-green-500 to-emerald-500"
                                    }
                                ].map((regulation, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.8 + i * 0.1 }}
                                        whileHover={{ y: -4, scale: 1.02 }}
                                        className={`group relative rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border ${
                                            theme === 'dark'
                                                ? 'bg-gray-800 border-gray-700'
                                                : 'bg-white border-gray-200'
                                        }`}
                                    >
                                        {/* Gradient stripe on left */}
                                        <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${regulation.color}`} />
                                        
                                        <div className="flex items-start gap-2 pl-2">
                                            {/* Number badge */}
                                            <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shadow-lg bg-gradient-to-br ${regulation.color}`}>
                                                {regulation.number}
                                            </div>
                                            
                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-xs font-bold truncate ${
                                                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                                                }`}>
                                                    {regulation.title}
                                                </p>
                                                <p className={`text-[10px] ${
                                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                                }`}>
                                                    {regulation.date}
                                                </p>
                                                <p className={`text-[10px] mt-1 line-clamp-2 ${
                                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                                }`}>
                                                    {regulation.description}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Protection Levels Section - Portfolio Card Style */}
            <section className={`relative py-12 overflow-hidden ${
                theme === 'dark'
                    ? 'bg-neutral-900'
                    : 'bg-white '
            }`}>
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <div className={`inline-block px-4 py-2 rounded-full backdrop-blur-sm border text-sm mb-4 ${
                            theme === 'dark'
                                ? 'bg-neutral-900 border-white'
                                : 'bg-white border-gray-200'
                        }`}>
                            • ТРИ УРОВНЯ ЗАЩИТЫ •
                        </div>
                        <h2 className={`text-3xl md:text-4xl lg:text-5xl font-black mb-4 ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                            3 стадии реализации проекта
                        </h2>
                        <p className={`text-base md:text-lg max-w-2xl mx-auto ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                            От идеи до полноценной защиты — комплексный подход к безопасности
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                        {protectionLevels.map((level, index) => (
                            <motion.div
                                key={level.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -12, scale: 1.03 }}
                                className="group relative"
                            >
                                {/* Pulsing glow effect */}
                                <div
                                    className={`absolute inset-0 rounded-[2rem] bg-gradient-to-r ${level.gradient} opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500 pointer-events-none`}
                                    style={{
                                        animation: `pulse ${2 + index * 0.5}s cubic-bezier(0.4, 0, 0.6, 1) infinite`
                                    }}
                                />

                                {/* Main card */}
                                <div className={`relative overflow-hidden rounded-[2rem] p-8 h-full flex flex-col transition-all duration-500 shadow-xl hover:shadow-2xl border hover:border-transparent ${
                                    theme === 'dark'
                                        ? `bg-gradient-to-br ${level.bgGradient} border-gray-700/50`
                                        : `bg-white border-gray-200`
                                }`}
                                    style={{
                                        backgroundSize: '200% 200%',
                                        animation: `gradient-shift ${3 + index * 0.7}s ease infinite`
                                    }}>
                                    {/* Header with stage badge */}
                                    <div className="relative mb-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm border ${
                                                theme === 'dark'
                                                    ? 'bg-white/10 text-white border-white/20'
                                                    : 'bg-white/80 text-gray-900 border-gray-300'
                                            }`}>
                                                {level.icon}
                                                <span>СТАДИЯ {level.stage}</span>
                                            </div>
                                            <span className={`text-sm font-black bg-gradient-to-r ${level.gradient} bg-clip-text text-transparent`}>
                                                {level.price}
                                            </span>
                                        </div>
                                        
                                        {/* Icon container */}
                                        <div className="relative">
                                            <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${level.gradient} shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ${
                                                theme === 'dark' ? 'text-white' : 'text-black'
                                            }`}>
                                                {level.icon}
                                            </div>
                                            {/* Small decorative dots */}
                                            <div className="absolute -bottom-2 -right-2 flex gap-1">
                                                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${level.gradient} opacity-60`} />
                                                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${level.gradient} opacity-40`} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className={`text-xl font-black mb-4 tracking-tight ${
                                        theme === 'dark' ? 'text-white' : 'text-black'
                                    }`}>
                                        {level.title}
                                    </h3>

                                    {/* Description */}
                                    <p className={`text-sm mb-4 ${
                                        theme === 'dark' ? 'text-white/90' : 'text-gray-600'
                                    }`}>
                                        {level.description}
                                    </p>

                                    {/* Features */}
                                    <div className="flex-grow space-y-2 mb-6">
                                        {level.features.map((feature, i) => (
                                            <div key={i} className="flex items-start gap-2">
                                                <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                                                    theme === 'dark' ? 'text-green-400' : 'text-green-500'
                                                }`} />
                                                <span className={`text-xs ${
                                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                                }`}>
                                                    {feature}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Tags */}
                                    <div className={`pt-4 border-t ${
                                        theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200'
                                    }`}>
                                        <p className={`text-[10px] mb-2 ${
                                            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                                        }`}>ПОДХОДИТ ДЛЯ:</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {level.tags.map((tag, i) => (
                                                <span
                                                    key={i}
                                                    className={`text-[10px] px-2.5 py-1 rounded-full border ${
                                                        theme === 'dark'
                                                            ? 'bg-gray-700/50 text-gray-300 border-gray-600'
                                                            : 'bg-gray-100 text-gray-600 border-gray-200'
                                                    }`}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* CTA Button */}
                                    {index === 0 && (
                                        <button
                                            type="button"
                                            onClick={(e) => { e.preventDefault(); setIsEstimateModalOpen(true); }}
                                            className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 bg-gradient-to-r ${level.gradient} text-white hover:shadow-lg hover:scale-105 mt-4`}
                                        >
                                            Получить бесплатный расчет
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Visualization Section - Portfolio Style */}
            <section className={`relative py-12 ${
                theme === 'dark'
                    ? 'bg-neutral-900'
                    : 'bg-white'
            }`}>
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                            Демонстрация работы системы
                        </h2>
                        <p className={`text-base md:text-lg max-w-2xl mx-auto ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                            Интерактивная визуализация системы защиты периметра от БПЛА
                        </p>
                    </motion.div>

                    <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl relative border border-gray-200 dark:border-gray-700">
                        <OptimizedImage
                            src="/ZOK.gif"
                            alt="3D визуализация защитной конструкции"
                            width={1200}
                            height={675}
                            className="w-full h-auto"
                        />
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className={`absolute top-4 right-4 z-10 p-3 rounded-xl backdrop-blur-sm transition-all shadow-lg ${
                                theme === 'dark'
                                    ? 'bg-gray-800/80 text-white hover:bg-gray-700'
                                    : 'bg-white/80 text-gray-800 hover:bg-white'
                            }`}
                            aria-label="Открыть в полноэкранном режиме"
                        >
                            <Maximize2 className="w-5 h-5" />
                        </button>
                    </div>

                    <FullscreenModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                        <OptimizedImage
                            src="/ZOK.gif"
                            alt="3D визуализация защитной конструкции"
                            width={1200}
                            height={675}
                            className="w-full h-auto"
                            priority
                        />
                    </FullscreenModal>
                </div>
            </section>

            {/* Features Section */}
            <section className={`relative py-16 overflow-hidden ${
                theme === 'dark'
                    ? 'bg-neutral-900'
                    : 'bg-white'
            }`}>
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 mb-4 backdrop-blur-sm ${
                            theme === 'dark'
                                ? 'bg-blue-900/30 text-blue-400 border border-blue-800/50'
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                            <Shield className="w-4 h-4" />
                            <span className="text-sm font-medium">Особенности системы</span>
                        </div>
                        <h2 className={`text-3xl md:text-4xl lg:text-5xl font-black mb-6 ${
                            theme === 'dark' ? 'text-white' : 'text-black'
                        }`}>
                            Преимущества защиты
                        </h2>
                        <p className={`text-lg md:text-xl max-w-3xl mx-auto ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                            Современные технологии для обеспечения безопасности вашего объекта
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {features.map((feature, i) => (
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
                                    className={`absolute inset-0 rounded-[2rem] bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500 pointer-events-none`}
                                    style={{
                                        animation: `pulse ${2 + i * 0.5}s cubic-bezier(0.4, 0, 0.6, 1) infinite`
                                    }}
                                />

                                {/* Main card */}
                                <div className={`relative overflow-hidden rounded-[2rem] p-8 h-full flex flex-col transition-all duration-500 shadow-xl hover:shadow-2xl border hover:border-transparent ${
                                    theme === 'dark'
                                        ? 'bg-neutral-900'
                                        : 'bg-white border-gray-200'
                                }`}
                                    style={{
                                        backgroundSize: '200% 200%',
                                        animation: `gradient-shift ${3 + i * 0.7}s ease infinite`
                                    }}>
                                    {/* Icon container */}
                                    <div className="relative mb-6">
                                        <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ${
                                            theme === 'dark' ? 'text-white' : 'text-black'
                                        }`}>
                                            {feature.icon}
                                        </div>
                                        {/* Small decorative dots */}
                                        <div className="absolute -bottom-2 -right-2 flex gap-1">
                                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.gradient} opacity-60`} />
                                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.gradient} opacity-40`} />
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className={`text-xl font-black mb-4 tracking-tight ${
                                        theme === 'dark' ? 'text-white' : 'text-black'
                                    }`}>
                                        {feature.title}
                                    </h3>

                                    {/* Description */}
                                    <p className={`flex-grow leading-relaxed text-base ${
                                        theme === 'dark' ? 'text-white' : 'text-black'
                                    }`}>
                                        {feature.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Applications Section */}
            <section className={`relative py-16 overflow-hidden ${
                theme === 'dark'
                    ? 'bg-neutral-900'
                    : 'bg-white'
            }`}>
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 mb-4 backdrop-blur-sm ${
                            theme === 'dark'
                                ? 'bg-purple-900/30 text-purple-400 border border-purple-800/30'
                                : 'bg-purple-100 text-purple-600 border border-purple-200'
                        }`}>
                            <Building2 className="w-4 h-4" />
                            <span className="text-sm font-medium">Области применения</span>
                        </div>
                        <h2 className={`text-3xl md:text-4xl lg:text-5xl font-black mb-6 ${
                            theme === 'dark' ? 'text-white' : 'text-black'
                        }`}>
                            Где применяется защита
                        </h2>
                        <p className={`text-lg md:text-xl max-w-3xl mx-auto ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                            Система защиты периметра от БПЛА для различных типов объектов
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {applications.map((application, i) => (
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
                                    className={`absolute inset-0 rounded-[2rem] bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500 pointer-events-none`}
                                    style={{
                                        animation: `pulse ${2 + i * 0.5}s cubic-bezier(0.4, 0, 0.6, 1) infinite`
                                    }}
                                />

                                {/* Main card */}
                                <div className={`relative overflow-hidden rounded-[2rem] p-6 h-full flex flex-col transition-all duration-500 shadow-xl hover:shadow-2xl border hover:border-transparent ${
                                    theme === 'dark'
                                        ? 'bg-neutral-900 border-gray-700/50'
                                        : 'bg-white border-gray-200'
                                }`}
                                    style={{
                                        backgroundSize: '200% 200%',
                                        animation: `gradient-shift ${3 + i * 0.7}s ease infinite`
                                    }}>
                                    {/* Image */}
                                    <div className="relative h-32 mb-4 rounded-xl overflow-hidden">
                                        <OptimizedImage
                                            src={application.imageUrl}
                                            alt={application.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            width={400}
                                            height={160}
                                        />
                                    </div>

                                    {/* Icon container */}
                                    <div className="relative mb-4">
                                        <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 `}>
                                            {application.icon}
                                        </div>
                                        {/* Small decorative dots */}
                                        <div className="absolute -bottom-2 -right-2 flex gap-1">
                                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-60" />
                                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-40" />
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className={`text-lg font-black mb-2 tracking-tight ${
                                        theme === 'dark' ? 'text-white' : 'text-black'
                                    }`}>
                                        {application.title}
                                    </h3>

                                    {/* Description */}
                                    <p className={`flex-grow leading-relaxed text-sm ${
                                        theme === 'dark' ? 'text-white' : 'text-black'
                                    }`}>
                                        {application.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section - Portfolio Style */}
            <section className={`relative py-16 overflow-hidden ${
                theme === 'dark'
                    ? 'bg-neutral-900'
                    : 'bg-white'
            }`}>
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <div className={`inline-flex items-center gap-2 backdrop-blur-sm rounded-full px-4 py-2 mb-4 border ${
                            theme === 'dark'
                                ? 'bg-white/20 border-white/30'
                                : 'bg-black/10 border-black/20'
                        }`}>
                            <Shield className={`w-4 h-4 ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}/>
                            <span className={`text-sm font-medium ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>Защита объекта</span>
                        </div>

                        <h2 className={`text-3xl md:text-4xl font-black mb-6 ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                            Готовы защитить свой объект?
                        </h2>

                        <p className={`text-lg md:text-xl max-w-2xl mx-auto mb-10 ${
                            theme === 'dark' ? 'text-white/90' : 'text-gray-900'
                        }`}>
                            Обратитесь к нашим специалистам и получите индивидуальное решение
                            для защиты вашего объекта от беспилотных летательных аппаратов.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/contacts"
                                className={`group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 ${
                                    theme === 'dark'
                                        ? 'bg-white text-gray-900'
                                        : 'bg-gray-900 text-white'
                                }`}
                            >
                                <span className={theme === 'dark' ? 'text-gray-900' : 'text-white'}>Заказать систему</span>
                                <ArrowRight className="w-5 h-5"/>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className={`relative ${
                theme === 'dark'
                    ? 'bg-neutral-900'
                    : 'bg-white'
            }`}>
                <FaqSection
                    faqs={[
                        {
                            question: "Что такое система защиты периметра от БПЛА?",
                            answer: "Система защиты периметра от беспилотных летательных аппаратов (БПЛА) - это комплекс технических средств, предназначенных для обнаружения, идентификации и нейтрализации беспилотников."
                        },
                        {
                            question: "Как работает система защиты?",
                            answer: "Наша система использует многоуровневый подход: физические барьеры в виде прочных металлических конструкций с металлической сеткой в 3 уровня."
                        },
                        {
                            question: "Какие объекты можно защитить?",
                            answer: "Мы обеспечиваем защиту промышленных объектов, государственных учреждений, объектов критической инфраструктуры и частного бизнеса."
                        },
                        {
                            question: "Какова эффективность системы?",
                            answer: "Наша система обеспечивает 99.9% эффективности в защите охраняемой территории при правильной установке и настройке."
                        },
                        {
                            question: "Какие гарантии вы предоставляете?",
                            answer: "Мы предоставляем 10 лет гарантии на наши системы защиты периметра от БПЛА, включая обслуживание и техническую поддержку."
                        }
                    ]}
                    title="Часто задаваемые вопросы"
                    subtitle="Ответы на вопросы о системах защиты от дронов"
                />
            </section>

            {/* Callback Modal */}
            <CallbackModal
                isOpen={isCallbackModalOpen}
                onClose={() => setIsCallbackModalOpen(false)}
                callbackForm={callbackForm}
                isCallbackSubmitting={isCallbackSubmitting}
                callbackSuccess={callbackSuccess}
                phoneError={phoneError}
                handleCallbackChange={handleCallbackChange}
                handlePhoneChange={handlePhoneChange}
                handlePhoneBlur={handlePhoneBlur}
                handlePhoneFocus={handlePhoneFocus}
                handleSubmit={onCallbackSubmit}
            />

            {/* Project Estimate Modal */}
            <ProjectEstimateModal
                isOpen={isEstimateModalOpen}
                onClose={() => setIsEstimateModalOpen(false)}
                onSubmit={handleEstimateSubmit}
            />
        </div>
    );
};

export default DroneDefensePage;