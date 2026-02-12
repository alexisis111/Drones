import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { Shield, Building2, Target, Zap, Award, Clock, Users, CheckCircle, ChevronRight, ArrowRight, Briefcase, Phone, Mail, MapPin, Calendar } from 'lucide-react';
import { Link } from 'react-router';

interface Vacancy {
  id: number;
  position: string;
  department: string;
  requirements: string[];
  conditions: string[];
  contact: string;
  salary?: string;
  imageUrl: string;
}

const VacanciesGallery: React.FC = () => {
  const { theme } = useTheme();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  // Данные вакансий на основе информации с сайта
  const vacancies: Vacancy[] = [
    {
      id: 1,
      position: "Электрогазосварщик",
      department: "Производственный отдел",
      requirements: [
        "Опыт работы от двух лет",
        "Наличие документов, подтверждающих квалификацию",
        "Комплект документов для оформления по ТК РФ"
      ],
      conditions: [
        "Пятидневная рабочая неделя, полная занятость",
        "Официальное оформление по ТК РФ",
        "Корпоративная связь",
        "Обучение и развитие",
        "Своевременная выплата заработной платы"
      ],
      contact: "+7 921 591-65-06, +7 931 006-34-46",
      salary: "По договоренности",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF2dQoGPqJys_HOrf2zHnUae5ZRTvoPEccyw&s"
    },
    {
      id: 2,
      position: "Отделочник",
      department: "Производственный отдел",
      requirements: [
        "Наличие документов, подтверждающих квалификацию",
        "Комплект документов для оформления по ТК РФ"
      ],
      conditions: [
        "Пятидневная рабочая неделя, полная занятость",
        "Официальное оформление по ТК РФ",
        "Корпоративная связь",
        "Обучение и развитие",
        "Своевременная выплата заработной платы"
      ],
      contact: "+7 921 591-65-06, +7 931 006-34-46",
      salary: "По договоренности",
      imageUrl: "https://www.cmlt.ru/getUserImage?id=9791040"
    },
    {
      id: 3,
      position: "Слесарь-монтажник",
      department: "Производственный отдел",
      requirements: [
        "Наличие документов, подтверждающих квалификацию",
        "Комплект документов для оформления по ТК РФ"
      ],
      conditions: [
        "Пятидневная рабочая неделя, полная занятость",
        "Официальное оформление по ТК РФ",
        "Корпоративная связь",
        "Обучение и развитие",
        "Своевременная выплата заработной платы"
      ],
      contact: "+7 921 591-65-06, +7 931 006-34-46",
      salary: "По договоренности",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgl3iTD6zUxTJysq3RIiYiZFApNA2cferybw&s"
    },
    {
      id: 4,
      position: "Подсобный рабочий",
      department: "Производственный отдел",
      requirements: [
        "Комплект документов для оформления по ТК РФ"
      ],
      conditions: [
        "Пятидневная рабочая неделя, полная занятость",
        "Официальное оформление по ТК РФ",
        "Корпоративная связь",
        "Обучение и развитие",
        "Своевременная выплата заработной платы"
      ],
      contact: "+7 921 591-65-06, +7 931 006-34-46",
      salary: "По договоренности",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEL00FCWMEg334Au6Lr2o-1qXzvd53959SaQ&s"
    },
    {
      id: 5,
      position: "Специалист по монтажу пожарной безопасности",
      department: "Производственный отдел",
      requirements: [
        "Опыт работы",
        "Наличие документов, подтверждающих квалификацию",
        "Комплект документов для оформления по ТК РФ"
      ],
      conditions: [
        "Пятидневная рабочая неделя, полная занятость",
        "Официальное оформление по ТК РФ",
        "Корпоративная связь",
        "Обучение и развитие",
        "Своевременная выплата заработной платы"
      ],
      contact: "+7 921 591-65-06, +7 931 006-34-46",
      salary: "По договоренности",
      imageUrl: "https://akkma.ru/upload/medialibrary/3bc/3bcc605faf8df7347f1d1bc04ce15f76.jpg"
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Optimized background with parallax effect */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-900 via-gray-900 to-purple-900"
        >
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('/img/homesImg/vacancy.jpeg')] bg-cover bg-center mix-blend-overlay opacity-20" />
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
                <Briefcase className="w-4 h-4" />
                <span className="text-sm font-medium text-white">Присоединяйтесь к нашей команде</span>
              </motion.div>

              {/* Main heading */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white"
              >
                <span className="block">Открытые</span>
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Вакансии
                </span>
                <span className="block">в нашей компании</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-300 max-w-2xl"
              >
                Мы всегда рады новым талантливым специалистам. Присоединяйтесь к нашей команде 
                профессионалов и развивайтесь вместе с нами.
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {[
                  { value: "50+", label: "Сотрудников" },
                  { value: "12+", label: "Лет опыта" },
                  { value: "100+", label: "Проектов" },
                  { value: "5", label: "Отделов" },
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
                  <span>Связаться с нами</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <a
                  href="tel:+79215916506"
                  className="group inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <Briefcase className="w-5 h-5" />
                  <span>+7 921 591-65-06</span>
                </a>
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
                  title: "Официальное трудоустройство",
                  description: "Оформление по ТК РФ",
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  icon: <Clock className="w-6 h-6" />,
                  title: "График работы",
                  description: "Пятидневная рабочая неделя",
                  color: "from-purple-500 to-pink-500"
                },
                {
                  icon: <Award className="w-6 h-6" />,
                  title: "Развитие",
                  description: "Обучение и карьерный рост",
                  color: "from-orange-500 to-red-500"
                },
                {
                  icon: <Zap className="w-6 h-6" />,
                  title: "Стабильность",
                  description: "Своевременная зарплата",
                  color: "from-green-500 to-emerald-500"
                }
              ].map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  whileHover={{ x: -10 }}
                  className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${benefit.color}`}>
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                      <p className="text-gray-400">{benefit.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vacancies Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Доступные вакансии
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Узнайте о текущих возможностях трудоустройства в нашей компании
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vacancies.map((vacancy, index) => (
              <motion.div
                key={vacancy.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={vacancy.imageUrl}
                    alt={`Работа ${vacancy.position}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Активная вакансия
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {vacancy.position}
                      </h3>
                      <p className="text-sm text-blue-600 dark:text-blue-400">
                        {vacancy.department}
                      </p>
                    </div>
                    {vacancy.salary && (
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm font-medium px-3 py-1 rounded-full">
                        {vacancy.salary}
                      </span>
                    )}
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                      Требования:
                    </h4>
                    <ul className="space-y-1">
                      {vacancy.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-400 text-sm">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                      Условия:
                    </h4>
                    <ul className="space-y-1">
                      {vacancy.conditions.map((cond, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-400 text-sm">{cond}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Briefcase className="w-4 h-4 mr-2" />
                      <span>{vacancy.contact}</span>
                    </div>
                    <Link
                      to="/contacts"
                      className="w-full text-center py-3 px-4 rounded-lg font-medium transition-all bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                    >
                      Откликнуться
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Почему стоит работать у нас?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Мы создаем комфортные условия для работы и развития каждого сотрудника
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Официальное трудоустройство",
                description: "Оформление по ТК РФ с первого дня"
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: "Гибкий график",
                description: "Пятидневная рабочая неделя"
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: "Развитие",
                description: "Обучение и карьерный рост"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Команда",
                description: "Дружный коллектив профессионалов"
              }
            ].map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative text-center"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300">
                  <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white mb-6">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center rounded-3xl p-12 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700"
            >
              <Briefcase className="w-16 h-16 text-blue-600 mx-auto mb-6" />
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Не нашли подходящую вакансию?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Отправьте нам свое резюме, и мы обязательно с вами свяжемся, 
                если появится подходящая должность.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contacts"
                  className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <span>Отправить резюме</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="mailto:l-legion@bk.ru"
                  className="group inline-flex items-center justify-center gap-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-4 rounded-xl font-semibold border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
                >
                  <Mail className="w-5 h-5" />
                  <span>l-legion@bk.ru</span>
                </a>
              </div>
            </motion.div>
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
              Готовы присоединиться к нашей команде?
            </h2>

            <p className="text-xl opacity-90 max-w-3xl mx-auto mb-12">
              Свяжитесь с нами прямо сейчас и сделайте первый шаг к новой карьере. 
              Мы всегда рады новым талантливым специалистам.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contacts"
                className="group inline-flex items-center justify-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <span>Связаться с нами</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="tel:+79215916506"
                className="group inline-flex items-center justify-center gap-3 bg-transparent text-white px-8 py-4 rounded-xl font-semibold border-2 border-white hover:bg-white/10 transition-all duration-300"
              >
                <Briefcase className="w-5 h-5" />
                <span>+7 921 591-65-06</span>
              </a>
            </div>

            <p className="mt-8 opacity-75">
              Обращайтесь в будни с 09:00 до 18:00 в отдел кадров
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default VacanciesGallery;