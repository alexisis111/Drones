import { useState, useCallback } from 'react';

interface CallbackFormData {
  name: string;
  phone: string;
  message: string;
}

interface UseCallbackFormReturn {
  callbackForm: CallbackFormData;
  isCallbackSubmitting: boolean;
  callbackSuccess: boolean;
  phoneError: string;
  isCallbackModalOpen: boolean;
  setIsCallbackModalOpen: (open: boolean) => void;
  handleCallbackChange: (field: string, value: string) => void;
  handlePhoneChange: (value: string) => void;
  handlePhoneBlur: (value: string) => void;
  handlePhoneFocus: () => void;
  handleCallbackSubmit: (source: string, subject?: string) => Promise<void>;
  resetForm: () => void;
}

// Функция форматирования телефона с автоподстановкой +7
const formatPhone = (value: string): string => {
  // Удаляем все нецифровые символы
  let cleaned = value.replace(/\D/g, '');

  // Если номер начинается с 8, заменяем на 7
  if (cleaned.startsWith('8')) {
    cleaned = '7' + cleaned.slice(1);
  }

  // Если цифр нет или первая цифра не 7, добавляем 7
  if (!cleaned.startsWith('7') && cleaned.length > 0) {
    cleaned = '7' + cleaned;
  }

  // Ограничиваем 11 цифрами (7 + 10 цифр номера)
  cleaned = cleaned.slice(0, 11);

  const match = cleaned.match(/^(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);
  if (match) {
    return [
      match[1] ? '+7' : '',
      match[2] ? ` (${match[2]}` : '',
      match[3] ? `) ${match[3]}` : '',
      match[4] ? `-${match[4]}` : '',
      match[5] ? `-${match[5]}` : ''
    ].filter(Boolean).join('');
  }
  return value;
};

// Валидация телефона (11 цифр с +7)
const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 11 && cleaned.startsWith('7');
};

/**
 * Хук для управления формой обратного звонка
 * @param defaultSource Источник формы по умолчанию (для отправки в Telegram)
 * @returns Объект с состоянием и методами управления формой
 */
export const useCallbackForm = (defaultSource: string = 'Сайт'): UseCallbackFormReturn => {
  const [isCallbackModalOpen, setIsCallbackModalOpen] = useState(false);
  const [callbackForm, setCallbackForm] = useState<CallbackFormData>({
    name: '',
    phone: '',
    message: ''
  });
  const [isCallbackSubmitting, setIsCallbackSubmitting] = useState(false);
  const [callbackSuccess, setCallbackSuccess] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  // Обработчик изменения полей формы
  const handleCallbackChange = useCallback((field: string, value: string) => {
    setCallbackForm(prev => ({ ...prev, [field]: value }));
    // Очищаем ошибку при изменении поля телефона
    if (field === 'phone') {
      setPhoneError('');
    }
  }, []);

  // Обработчик изменения поля телефона
  const handlePhoneChange = useCallback((value: string) => {
    const formatted = formatPhone(value);
    setCallbackForm(prev => ({ ...prev, phone: formatted }));
    setPhoneError('');
  }, []);

  // Обработчик потери фокуса поля телефона
  const handlePhoneBlur = useCallback((value: string) => {
    if (value && !isValidPhone(value)) {
      setPhoneError('Введите корректный номер (11 цифр)');
    }
  }, []);

  // Обработчик фокуса поля телефона
  const handlePhoneFocus = useCallback(() => {
    setCallbackForm(prev => ({ ...prev, phone: '+7' }));
  }, []);

  // Сброс формы
  const resetForm = useCallback(() => {
    setCallbackForm({ name: '', phone: '', message: '' });
    setCallbackSuccess(false);
    setPhoneError('');
  }, []);

  // Обработчик отправки формы обратного звонка
  const handleCallbackSubmit = useCallback(async (
    source: string = defaultSource,
    subject: string = '📞 Новое сообщение на обратный звонок'
  ) => {
    // Валидация телефона
    if (!isValidPhone(callbackForm.phone)) {
      setPhoneError('Введите корректный номер (11 цифр)');
      return;
    }

    setIsCallbackSubmitting(true);

    try {
      const response = await fetch('/api/telegram-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: callbackForm.name,
          phone: callbackForm.phone,
          message: callbackForm.message,
          subject,
          source
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при отправке');
      }

      // Успех: показываем сообщение и закрываем через 3 сек
      setCallbackSuccess(true);
      setTimeout(() => {
        setIsCallbackModalOpen(false);
        resetForm();
      }, 3000);

    } catch (error) {
      console.error('Callback submit error:', error);
      alert('Ошибка при отправке заявки. Попробуйте позже.');
    } finally {
      setIsCallbackSubmitting(false);
    }
  }, [callbackForm, defaultSource, resetForm]);

  return {
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
    handleCallbackSubmit,
    resetForm
  };
};
