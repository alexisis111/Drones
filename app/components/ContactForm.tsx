// components/common/ContactForm.tsx
import React, { useState, useEffect } from 'react';
import { useFetcher } from 'react-router';
import { MessageSquare, Send, RefreshCw } from 'lucide-react';

export interface ContactFormData {
    name: string;
    phone: string;
    message: string;
}

export interface ContactFormProps {
    /** Тема оформления */
    theme?: string;
    /** Заголовок формы */
    title?: string;
    /** Показывать ли заголовок */
    showTitle?: boolean;
    /** Класс для контейнера */
    className?: string;
    /** Обработчик успешной отправки */
    onSuccess?: (data: ContactFormData) => void;
    /** Обработчик ошибки */
    onError?: (error: string) => void;
    /** Дополнительные поля */
    additionalFields?: React.ReactNode;
    /** Начальные данные формы */
    initialData?: Partial<ContactFormData>;
    /** URL для отправки формы */
    submitUrl?: string;
    /** Показывать ли поле сообщения */
    showMessageField?: boolean;
    /** Обязательность поля телефона */
    phoneRequired?: boolean;
    /** Плейсхолдер для поля имени */
    namePlaceholder?: string;
    /** Плейсхолдер для поля телефона */
    phonePlaceholder?: string;
    /** Плейсхолдер для поля сообщения */
    messagePlaceholder?: string;
    /** Текст кнопки отправки */
    submitButtonText?: string;
    /** Вариант оформления */
    variant?: 'default' | 'minimal' | 'card';
}

const ContactForm: React.FC<ContactFormProps> = ({
                                                     theme = 'dark',
                                                     title = 'Оставить заявку',
                                                     showTitle = true,
                                                     className = '',
                                                     onSuccess,
                                                     onError,
                                                     additionalFields,
                                                     initialData = {},
                                                     submitUrl = '/api/telegram-webhook',
                                                     showMessageField = true,
                                                     phoneRequired = true,
                                                     namePlaceholder = 'Иван Иванов',
                                                     phonePlaceholder = '+7 (999) 999-99-99',
                                                     messagePlaceholder = 'Ваше сообщение...',
                                                     submitButtonText = 'Отправить заявку',
                                                     variant = 'default'
                                                 }) => {
    const fetcher = useFetcher();
    const [formData, setFormData] = useState<ContactFormData>({
        name: initialData.name || '',
        phone: initialData.phone || '+7',
        message: initialData.message || ''
    });

    const [errors, setErrors] = useState({
        name: '',
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
            num1 = Math.floor(Math.random() * 10) + 1;
            num2 = Math.floor(Math.random() * 10) + 1;
            result = num1 + num2;
        } else {
            num1 = Math.floor(Math.random() * 10) + 5;
            num2 = Math.floor(Math.random() * 5) + 1;
            result = num1 - num2;
        }

        setCaptcha({ num1, num2, operator, result });
        setCaptchaAnswer('');
        setCaptchaError('');
    };

    // Генерация капчи при монтировании компонента
    useEffect(() => {
        generateCaptcha();
    }, []);

    // Таймер для автоматического закрытия при успехе
    useEffect(() => {
        let timer: NodeJS.Timeout;
        let progressInterval: NodeJS.Timeout;

        if (submitStatus?.type === 'success') {
            setProgress(0);
            setCountdown(3);

            progressInterval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(progressInterval);
                        return 100;
                    }
                    return prev + (100 / 30);
                });
            }, 100);

            timer = setTimeout(() => {
                setSubmitStatus(null);
                setProgress(0);
                setCountdown(3);
            }, 3000);

            const countdownInterval = setInterval(() => {
                setCountdown(prev => Math.max(0, prev - 1));
            }, 1000);

            return () => {
                clearTimeout(timer);
                clearInterval(progressInterval);
                clearInterval(countdownInterval);
            };
        }
    }, [submitStatus]);

    // Валидация имени (только русские и английские буквы)
    const validateName = (name: string): boolean => {
        const nameRegex = /^[A-Za-zА-Яа-яЁё\s]*$/;
        return nameRegex.test(name);
    };

    // Валидация телефона (формат: +7XXX-XXX-XX-XX)
    const validatePhone = (phone: string): boolean => {
        if (!phoneRequired) return true;
        if (!phone || phone === '+7') return false;
        const phoneRegex = /^\+7\d{3}-\d{3}-\d{2}-\d{2}$/;
        return phoneRegex.test(phone);
    };

    // Форматирование телефона
    const formatPhone = (value: string): string => {
        let cleaned = value.replace(/[^\d+]/g, '');

        if (cleaned.startsWith('8')) {
            cleaned = '+7' + cleaned.slice(1);
        }

        if (!cleaned.startsWith('+')) {
            cleaned = '+7' + cleaned;
        }

        if (cleaned.length > 12) {
            cleaned = cleaned.slice(0, 12);
        }

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

        setErrors(prev => ({ ...prev, [id]: '' }));

        if (id === 'name') {
            if (value && !validateName(value)) {
                setErrors(prev => ({
                    ...prev,
                    name: 'Имя может содержать только буквы'
                }));
            }
            setFormData(prev => ({ ...prev, [id]: value }));
        }
        else if (id === 'phone') {
            const formattedPhone = formatPhone(value);
            setFormData(prev => ({ ...prev, [id]: formattedPhone }));

            if (phoneRequired && formattedPhone && formattedPhone !== '+7') {
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

        if (field === 'phone' && phoneRequired) {
            if (!formData.phone || formData.phone === '+7') {
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
            generateCaptcha();
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateCaptcha()) {
            return;
        }

        const consentCheckbox = document.getElementById('consent') as HTMLInputElement;
        if (!consentCheckbox.checked) {
            setErrors(prev => ({
                ...prev,
                consent: 'Необходимо дать согласие на обработку персональных данных'
            }));
            return;
        }

        let hasErrors = false;
        const newErrors = { name: '', phone: '', consent: '', captcha: '' };

        if (!formData.name) {
            newErrors.name = 'Имя обязательно для заполнения';
            hasErrors = true;
        } else if (!validateName(formData.name)) {
            newErrors.name = 'Имя может содержать только буквы';
            hasErrors = true;
        }

        if (phoneRequired) {
            if (!formData.phone || formData.phone === '+7') {
                newErrors.phone = 'Телефон обязателен для заполнения';
                hasErrors = true;
            } else if (!validatePhone(formData.phone)) {
                newErrors.phone = 'Неверный формат телефона. Пример: +7999-999-99-99';
                hasErrors = true;
            }
        }

        if (hasErrors) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(submitUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setSubmitStatus({
                    type: 'success',
                    message: result.message || 'Сообщение успешно отправлено!'
                });

                onSuccess?.(formData);

                setFormData({
                    name: '',
                    phone: '+7',
                    message: ''
                });

                setCaptchaAnswer('');
                generateCaptcha();
                setErrors({ name: '', phone: '', consent: '', captcha: '' });

                const consentCheckbox = document.getElementById('consent') as HTMLInputElement;
                if (consentCheckbox) {
                    consentCheckbox.checked = false;
                }
            } else {
                const errorMessage = result.error || 'Ошибка при отправке сообщения';
                setSubmitStatus({
                    type: 'error',
                    message: errorMessage
                });
                onError?.(errorMessage);
            }
        } catch (error) {
            const errorMessage = 'Ошибка соединения. Пожалуйста, проверьте подключение к интернету.';
            setSubmitStatus({
                type: 'error',
                message: errorMessage
            });
            onError?.(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Стили в зависимости от варианта и темы
    const getContainerStyles = () => {
        const baseStyles = 'rounded-2xl shadow-2xl transition-all duration-500';
        
        switch (variant) {
            case 'minimal':
                return `${baseStyles} ${
                    theme === 'dark'
                        ? 'bg-white/5 backdrop-blur-sm border border-white/10'
                        : 'bg-gray-50 border border-gray-200'
                }`;
            case 'card':
                return `${baseStyles} ${
                    theme === 'dark'
                        ? 'bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700'
                        : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'
                }`;
            default:
                return `${baseStyles} ${
                    theme === 'dark'
                        ? 'bg-neutral-800/90 backdrop-blur-sm border border-gray-700/50'
                        : 'bg-white border border-gray-200'
                }`;
        }
    };

    const getInputStyles = (hasError: boolean) => {
        return `w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
            theme === 'dark'
                ? `bg-gray-700/50 text-white placeholder-gray-400 border-gray-600 ${hasError ? 'border-red-400' : ''}`
                : `bg-gray-50 text-gray-900 placeholder-gray-500 border-gray-300 ${hasError ? 'border-red-400' : ''}`
        }`;
    };

    const getLabelStyles = () => {
        return `block mb-1 text-xs font-medium ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`;
    };

    const getErrorStyles = () => {
        return `mt-0.5 text-xs ${
            theme === 'dark' ? 'text-red-400' : 'text-red-500'
        }`;
    };

    const getHintStyles = () => {
        return `mt-0.5 text-xs ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`;
    };

    return (
        <div className={`${getContainerStyles()} max-w-md mx-auto ${className}`}>
            <div className="p-6 md:p-8">
                {/* Header */}
                {showTitle && (
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                            <MessageSquare className="w-5 h-5" />
                        </div>
                        <h3 className={`text-xl font-bold ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>{title}</h3>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Поле имени */}
                    <div>
                        <label htmlFor="name" className={getLabelStyles()}>
                            Ваше имя *
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            onBlur={() => handleBlur('name')}
                            required
                            className={getInputStyles(!!errors.name)}
                            placeholder={namePlaceholder}
                        />
                        {errors.name && (
                            <p className={getErrorStyles()}>{errors.name}</p>
                        )}
                    </div>

                    {/* Поле телефона */}
                    <div>
                        <label htmlFor="phone" className={getLabelStyles()}>
                            Телефон {phoneRequired && '*'}
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            onBlur={() => handleBlur('phone')}
                            className={getInputStyles(!!errors.phone)}
                            placeholder={phonePlaceholder}
                        />
                        {errors.phone && (
                            <p className={getErrorStyles()}>{errors.phone}</p>
                        )}
                        <p className={getHintStyles()}>Формат: +7999-999-99-99</p>
                    </div>

                    {/* Поле сообщения */}
                    {showMessageField && (
                        <div>
                            <label htmlFor="message" className={getLabelStyles()}>
                                Сообщение *
                            </label>
                            <textarea
                                id="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows={3}
                                className={getInputStyles(false)}
                                placeholder={messagePlaceholder}
                            ></textarea>
                        </div>
                    )}

                    {/* Дополнительные поля */}
                    {additionalFields}

                    {/* Капча */}
                    <div className={`p-3 rounded-lg ${
                        theme === 'dark'
                            ? 'bg-gray-700/50 backdrop-blur-sm border border-gray-600'
                            : 'bg-gray-100 border border-gray-200'
                    }`}>
                        <label className={getLabelStyles()}>
                            Проверка (защита от ботов) *
                        </label>

                        <div className="flex items-center gap-2 mb-1">
                            <div className={`flex-1 p-2 rounded-lg text-center text-base font-bold border ${
                                theme === 'dark'
                                    ? 'bg-gray-600 text-white border-gray-500'
                                    : 'bg-white text-gray-900 border-gray-300'
                            }`}>
                                {captcha.num1} {captcha.operator} {captcha.num2} = ?
                            </div>
                            <button
                                type="button"
                                onClick={generateCaptcha}
                                className={`p-2 rounded-lg transition-colors border ${
                                    theme === 'dark'
                                        ? 'bg-gray-600 hover:bg-gray-500 text-white border-gray-500'
                                        : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
                                }`}
                                title="Обновить пример"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>
                        </div>

                        <input
                            type="number"
                            value={captchaAnswer}
                            onChange={(e) => {
                                setCaptchaAnswer(e.target.value);
                                setCaptchaError('');
                            }}
                            className={getInputStyles(!!captchaError)}
                            placeholder="Введите ответ"
                        />

                        {captchaError && (
                            <p className={getErrorStyles()}>{captchaError}</p>
                        )}
                    </div>

                    {/* Чекбокс согласия */}
                    <div className="flex items-start">
                        <input
                            type="checkbox"
                            id="consent"
                            className="mt-0.5 mr-2 h-3.5 w-3.5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded flex-shrink-0"
                        />
                        <label htmlFor="consent" className={`text-xs ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                            Я даю согласие на обработку персональных данных в соответствии с{' '}
                            <a href="/privacy" className="text-blue-400 hover:underline">политикой конфиденциальности</a>
                        </label>
                    </div>
                    {errors.consent && (
                        <p className={getErrorStyles()}>{errors.consent}</p>
                    )}

                    {/* Статус отправки с прогресс-баром */}
                    {submitStatus && (
                        <div className="relative overflow-hidden">
                            <div className={`p-3 rounded-lg ${
                                submitStatus.type === 'success'
                                    ? theme === 'dark'
                                        ? 'bg-green-500/20 text-green-400'
                                        : 'bg-green-100 text-green-700'
                                    : theme === 'dark'
                                        ? 'bg-red-500/20 text-red-400'
                                        : 'bg-red-100 text-red-700'
                            }`}>
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-xs">{submitStatus.message}</p>
                                    {submitStatus.type === 'success' && (
                                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                                            theme === 'dark'
                                                ? 'bg-green-500/30 text-green-400'
                                                : 'bg-green-200 text-green-700'
                                        }`}>
                                            {countdown}с
                                        </span>
                                    )}
                                </div>

                                {submitStatus.type === 'success' && (
                                    <div className={`w-full h-1 rounded-full overflow-hidden ${
                                        theme === 'dark'
                                            ? 'bg-green-500/30'
                                            : 'bg-green-200'
                                    }`}>
                                        <div
                                            className="h-full bg-green-500 transition-all duration-100 ease-linear"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Кнопка отправки */}
                    <button
                        type="submit"
                        disabled={isLoading || submitStatus?.type === 'success'}
                        className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white ${
                            isLoading || submitStatus?.type === 'success'
                                ? 'opacity-70 cursor-not-allowed'
                                : 'hover:opacity-90 hover:shadow-lg'
                        }`}
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Отправка...
                            </>
                        ) : submitStatus?.type === 'success' ? (
                            <>
                                <span>✓ Отправлено</span>
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                {submitButtonText}
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContactForm;