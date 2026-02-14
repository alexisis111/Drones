import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ServiceOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  onSubmit: (formData: any, serviceName: string) => void;
}

const ServiceOrderModal: React.FC<ServiceOrderModalProps> = ({ 
  isOpen, 
  onClose, 
  serviceName, 
  onSubmit 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    message: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Clear submit message when user starts correcting form
    if (submitMessage) {
      setSubmitMessage(null);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Имя обязательно';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Телефон обязателен';
    } else {
      // Basic phone validation
      const phoneRegex = /^(\+7|8)[\s-]?\(?[\d\s-]{10,13}\)?$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Некорректный формат телефона';
      }
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен';
    } else {
      // Email validation if provided
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Некорректный email';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitMessage(null); // Clear previous message
    
    try {
      const result = await onSubmit(formData, serviceName);
      // Show success message instead of closing modal
      setSubmitMessage({ type: 'success', text: result.message || `Заявка на услугу "${serviceName}" успешно отправлена! Мы свяжемся с вами в ближайшее время.` });
      // Optionally reset form after successful submission
      // setFormData({ name: '', phone: '', email: '', company: '', message: '' });
    } catch (error: any) {
      setSubmitMessage({ type: 'error', text: error.message || 'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Modal header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
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
        
        {/* Modal body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {serviceName}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Заполните форму, и мы свяжемся с вами для обсуждения деталей
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Поля, отмеченные * обязательны к заполнению
            </p>
          </div>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Имя *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                errors.name 
                  ? 'border-red-500 focus:ring-red-200 dark:focus:ring-red-800' 
                  : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500 dark:border-gray-600 dark:focus:ring-blue-800 dark:focus:border-blue-500'
              } dark:bg-gray-700 dark:text-white`}
              placeholder="Ваше имя"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Телефон *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                errors.phone 
                  ? 'border-red-500 focus:ring-red-200 dark:focus:ring-red-800' 
                  : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500 dark:border-gray-600 dark:focus:ring-blue-800 dark:focus:border-blue-500'
              } dark:bg-gray-700 dark:text-white`}
              placeholder="+7 (XXX) XXX-XX-XX"
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                errors.email 
                  ? 'border-red-500 focus:ring-red-200 dark:focus:ring-red-800' 
                  : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500 dark:border-gray-600 dark:focus:ring-blue-800 dark:focus:border-blue-500'
              } dark:bg-gray-700 dark:text-white`}
              placeholder="your@email.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
          </div>
          
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Компания
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-800 dark:focus:border-blue-500"
              placeholder="Название вашей компании"
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Сообщение
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-800 dark:focus:border-blue-500"
              placeholder="Дополнительная информация о проекте..."
            ></textarea>
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-70"
            >
              {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
            </button>
            
            {submitMessage && (
              <div className={`mt-4 p-3 rounded-lg text-center ${
                submitMessage.type === 'success' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {submitMessage.text}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceOrderModal;