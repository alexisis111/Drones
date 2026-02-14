import React, { useState, useEffect } from 'react';
import { X, RefreshCw } from 'lucide-react';

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

interface ServiceOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
  onSubmit: (formData: any, serviceName: string) => Promise<any>;
}

const ServiceOrderModal: React.FC<ServiceOrderModalProps> = ({
                                                               isOpen,
                                                               onClose,
                                                               service,
                                                               onSubmit
                                                             }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '+7',
    message: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    consent: '',
    captcha: ''
  });
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [countdown, setCountdown] = useState(3);

  // Капча
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, operator: '+', result: 0 });
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaError, setCaptchaError] = useState('');

  // Генерация новой капчи
  const generateCaptcha = () => {
    const operators = ['+', '-'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    let num1, num2, result;

    if (operator === '+') {
      num1 = Math.floor(Math.random() * 10) + 1; // 1-10
      num2 = Math.floor(Math.random() * 10) + 1; // 1-10
      result = num1 + num2;
    } else {
      num1 = Math.floor(Math.random() * 10) + 5; // 5-15
      num2 = Math.floor(Math.random() * 5) + 1;  // 1-5
      result = num1 - num2;
    }

    setCaptcha({ num1, num2, operator, result });
    setCaptchaAnswer('');
    setCaptchaError('');
  };

  // Сброс состояния при открытии модалки
  useEffect(() => {
    if (isOpen) {
      generateCaptcha();
      setProgress(0);
      setCountdown(3);
    }
  }, [isOpen]);

  // Таймер для автоматического закрытия при успехе
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;

    if (submitStatus?.type === 'success') {
      // Сброс прогресса
      setProgress(0);
      setCountdown(3);

      // Обновление прогресс-бара
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + (100 / 30); // 30 шагов за 3 секунды
        });
      }, 100);

      // Таймер для закрытия
      timer = setTimeout(() => {
        onClose();
        setSubmitStatus(null);
        setProgress(0);
        setCountdown(3);
      }, 3000);

      // Обновление счетчика
      const countdownInterval = setInterval(() => {
        setCountdown(prev => Math.max(0, prev - 1));
      }, 1000);

      return () => {
        clearTimeout(timer);
        clearInterval(progressInterval);
        clearInterval(countdownInterval);
      };
    }
  }, [submitStatus, onClose]);

  if (!isOpen || !service) return null;

  // Валидация имени (только русские и английские буквы)
  const validateName = (name: string): boolean => {
    const nameRegex = /^[A-Za-zА-Яа-яЁё\s]*$/;
    return nameRegex.test(name);
  };

  // Валидация email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Валидация телефона (формат: +7XXX-XXX-XX-XX)
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\+7\d{3}-\d{3}-\d{2}-\d{2}$/;
    return phoneRegex.test(phone);
  };

  // Форматирование телефона
  const formatPhone = (value: string): string => {
    // Удаляем все нецифровые символы, кроме +
    let cleaned = value.replace(/[^\d+]/g, '');

    // Если начинается с 8, заменяем на +7
    if (cleaned.startsWith('8')) {
      cleaned = '+7' + cleaned.slice(1);
    }

    // Если нет + в начале, добавляем
    if (!cleaned.startsWith('+')) {
      cleaned = '+7' + cleaned;
    }

    // Ограничиваем длину (код страны + 10 цифр)
    if (cleaned.length > 12) {
      cleaned = cleaned.slice(0, 12);
    }

    // Форматируем: +7XXX-XXX-XX-XX
    if (cleaned.length > 1) {
      let formatted = '+7';
      const numbers = cleaned.slice(2).replace(/\D/g, '');

      if (numbers.length > 0) {
        formatted += numbers.slice(0, 3);
      }
      if (numbers.length > 3) {
        formatted += '-' + numbers.slice(3, 6);
      }
      if (numbers.length > 6) {
        formatted += '-' + numbers.slice(6, 8);
      }
      if (numbers.length > 8) {
        formatted += '-' + numbers.slice(8, 10);
      }
      return formatted;
    }

    return cleaned;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;

    // Очищаем ошибку для текущего поля
    setErrors(prev => ({ ...prev, [id]: '' }));

    if (id === 'name') {
      // Проверяем имя на валидность при вводе
      if (value && !validateName(value)) {
        setErrors(prev => ({
          ...prev,
          name: 'Имя может содержать только буквы'
        }));
      }
      setFormData(prev => ({ ...prev, [id]: value }));
    }
    else if (id === 'phone') {
      // Применяем форматирование для телефона
      const formattedPhone = formatPhone(value);
      setFormData(prev => ({ ...prev, [id]: formattedPhone }));

      // Проверяем валидность при вводе
      if (formattedPhone && formattedPhone !== '+7') {
        if (!validatePhone(formattedPhone)) {
          setErrors(prev => ({
            ...prev,
            phone: 'Неверный формат телефона. Пример: +7999-999-99-99'
          }));
        }
      }
    }
    else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleBlur = (field: string) => {
    if (field === 'name' && formData.name && !validateName(formData.name)) {
      setErrors(prev => ({
        ...prev,
        name: 'Имя может содержать только буквы'
      }));
    }

    if (field === 'email' && formData.email && !validateEmail(formData.email)) {
      setErrors(prev => ({
        ...prev,
        email: 'Введите корректный email адрес'
      }));
    }

    if (field === 'phone' && formData.phone) {
      if (formData.phone === '+7') {
        setErrors(prev => ({
          ...prev,
          phone: 'Телефон обязателен для заполнения'
        }));
      } else if (!validatePhone(formData.phone)) {
        setErrors(prev => ({
          ...prev,
          phone: 'Неверный формат телефона. Пример: +7999-999-99-99'
        }));
      }
    }
  };

  // Проверка капчи
  const validateCaptcha = (): boolean => {
    const answer = parseInt(captchaAnswer);
    if (isNaN(answer) || answer !== captcha.result) {
      setCaptchaError('Неверный ответ. Пожалуйста, решите пример правильно.');
      generateCaptcha(); // Генерируем новый пример
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Проверка капчи
    if (!validateCaptcha()) {
      return;
    }

    // Проверка согласия на обработку данных
    const consentCheckbox = document.getElementById('consent') as HTMLInputElement;
    if (!consentCheckbox.checked) {
      setErrors(prev => ({
        ...prev,
        consent: 'Необходимо дать согласие на обработку персональных данных'
      }));
      return;
    }

    // Валидация всех полей перед отправкой
    let hasErrors = false;
    const newErrors = { name: '', email: '', phone: '', consent: '', captcha: '' };

    // Проверка имени
    if (!formData.name) {
      newErrors.name = 'Имя обязательно для заполнения';
      hasErrors = true;
    } else if (!validateName(formData.name)) {
      newErrors.name = 'Имя может содержать только буквы';
      hasErrors = true;
    }

    // Проверка email
    if (!formData.email) {
      newErrors.email = 'Email обязателен для заполнения';
      hasErrors = true;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Введите корректный email адрес';
      hasErrors = true;
    }

    // Проверка телефона (обязательное поле)
    if (!formData.phone || formData.phone === '+7') {
      newErrors.phone = 'Телефон обязателен для заполнения';
      hasErrors = true;
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Неверный формат телефона. Пример: +7999-999-99-99';
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      if (!service) {
        throw new Error('Услуга не выбрана');
      }

      // Отправляем форму
      const response = await onSubmit({
        ...formData,
        message: formData.message
      }, service.title);

      setSubmitStatus({
        type: 'success',
        message: response.message || 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.'
      });

      // Сброс формы
      setFormData({
        name: '',
        email: '',
        phone: '+7',
        message: ''
      });

      setErrors({ name: '', email: '', phone: '', consent: '', captcha: '' });
      setCaptchaAnswer('');

      const consentCheckbox = document.getElementById('consent') as HTMLInputElement;
      if (consentCheckbox) {
        consentCheckbox.checked = false;
      }
    } catch (error: any) {
      setSubmitStatus({
        type: 'error',
        message: error.message || 'Ошибка при отправке заявки'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Заказать услугу
            </h3>
            <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Service Info */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {service?.title || 'Услуга'}
            </h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {service?.description || 'Выбранная вами услуга'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ваше имя *
                </label>
                <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={() => handleBlur('name')}
                    className={`w-full px-4 py-3 rounded-lg ${
                        errors.name
                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                            : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
                    } border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                    placeholder="Введите ваше имя"
                />
                {errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email *
                </label>
                <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur('email')}
                    className={`w-full px-4 py-3 rounded-lg ${
                        errors.email
                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                            : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
                    } border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                    placeholder="Введите ваш email"
                />
                {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Телефон *
                </label>
                <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={() => handleBlur('phone')}
                    className={`w-full px-4 py-3 rounded-lg ${
                        errors.phone
                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                            : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
                    } border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                    placeholder="+7 (___) ___-__-__"
                />
                {errors.phone && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Сообщение
                </label>
                <textarea
                    id="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 text-gray-900 border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Дополнительная информация"
                ></textarea>
              </div>

              {/* Капча */}
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Проверка (защита от ботов) *
                </label>

                <div className="flex items-center gap-3 mb-2">
                  <div className="flex-1 bg-white dark:bg-gray-800 p-3 rounded-lg text-center text-xl font-bold text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600">
                    {captcha.num1} {captcha.operator} {captcha.num2} = ?
                  </div>
                  <button
                      type="button"
                      onClick={generateCaptcha}
                      className="p-3 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                      title="Обновить пример"
                  >
                    <RefreshCw className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </button>
                </div>

                <input
                    type="number"
                    value={captchaAnswer}
                    onChange={(e) => {
                      setCaptchaAnswer(e.target.value);
                      setCaptchaError('');
                    }}
                    className={`w-full px-4 py-3 rounded-lg ${
                        captchaError
                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                    } border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                    placeholder="Введите ответ"
                />

                {captchaError && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{captchaError}</p>
                )}
              </div>

              <div className="flex items-start">
                <input
                    type="checkbox"
                    id="consent"
                    className="mt-1 mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="consent" className="text-sm text-gray-600 dark:text-gray-400">
                  Я даю согласие на обработку персональных данных в соответствии с{' '}
                  <a href="/privacy" className="text-blue-600 hover:underline">политикой конфиденциальности</a>
                </label>
              </div>
              {errors.consent && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.consent}</p>
              )}

              {submitStatus && (
                  <div className="relative overflow-hidden">
                    <div className={`p-4 rounded-lg ${
                        submitStatus.type === 'success'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span>{submitStatus.message}</span>
                        {submitStatus.type === 'success' && (
                            <span className="text-sm font-medium bg-green-200 dark:bg-green-800 px-2 py-1 rounded">
                        {countdown}с
                      </span>
                        )}
                      </div>

                      {/* Progress bar */}
                      {submitStatus.type === 'success' && (
                          <div className="w-full h-1 bg-green-200 dark:bg-green-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-green-600 dark:bg-green-400 transition-all duration-100 ease-linear"
                                style={{ width: `${progress}%` }}
                            />
                          </div>
                      )}
                    </div>
                  </div>
              )}

              <button
                  type="submit"
                  disabled={isLoading || submitStatus?.type === 'success'}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all ${
                      isLoading || submitStatus?.type === 'success'
                          ? 'opacity-70 cursor-not-allowed'
                          : 'hover:opacity-90 hover:shadow-lg'
                  } bg-gradient-to-r from-blue-600 to-purple-600 text-white`}
              >
                {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Отправка...
                    </div>
                ) : submitStatus?.type === 'success' ? (
                    <div className="flex items-center justify-center">
                      <span>✓ Отправлено</span>
                    </div>
                ) : (
                    'Отправить заявку'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default ServiceOrderModal;