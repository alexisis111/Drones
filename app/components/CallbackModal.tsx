import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';

interface CallbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  callbackForm: {
    name: string;
    phone: string;
    message: string;
  };
  isCallbackSubmitting: boolean;
  callbackSuccess: boolean;
  phoneError: string;
  handleCallbackChange: (field: string, value: string) => void;
  handlePhoneChange: (value: string) => void;
  handlePhoneBlur: (value: string) => void;
  handlePhoneFocus: () => void;
  handleSubmit: (e: React.FormEvent) => void;
}

/**
 * Компонент модального окна обратного звонка
 * Используется вместе с хуком useCallbackForm
 */
export const CallbackModal: React.FC<CallbackModalProps> = ({
  isOpen,
  onClose,
  callbackForm,
  isCallbackSubmitting,
  callbackSuccess,
  phoneError,
  handleCallbackChange,
  handlePhoneChange,
  handlePhoneBlur,
  handlePhoneFocus,
  handleSubmit
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={() => !isCallbackSubmitting && onClose()}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-2xl border border-white/10"
        >
          {/* Close Button */}
          {!isCallbackSubmitting && !callbackSuccess && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
              aria-label="Закрыть"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Success State */}
          {callbackSuccess ? (
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center"
              >
                <CheckCircle className="w-8 h-8 text-green-400" />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-2">Заявка отправлена!</h3>
              <p className="text-gray-400">Мы перезвоним вам в ближайшее время</p>
            </div>
          ) : (
            <>
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                Заказать обратный звонок
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ваше имя *
                  </label>
                  <input
                    type="text"
                    required
                    value={callbackForm.name}
                    onChange={(e) => handleCallbackChange('name', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Иван Иванов"
                    disabled={isCallbackSubmitting}
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    required
                    value={callbackForm.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    onBlur={(e) => handlePhoneBlur(e.target.value)}
                    onFocus={handlePhoneFocus}
                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${phoneError ? 'border-red-500' : 'border-white/10'} text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                    placeholder="+7 (___) ___-__-__"
                    disabled={isCallbackSubmitting}
                  />
                  {phoneError && (
                    <p className="mt-1 text-sm text-red-400">{phoneError}</p>
                  )}
                </div>

                {/* Message Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Дополнительная информация
                  </label>
                  <textarea
                    value={callbackForm.message}
                    onChange={(e) => handleCallbackChange('message', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Расскажите подробнее о вашем объекте..."
                    disabled={isCallbackSubmitting}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isCallbackSubmitting}
                  className="w-full py-4 px-6 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isCallbackSubmitting ? (
                    <>
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Отправка...
                    </>
                  ) : (
                    'Оставить заявку'
                  )}
                </button>
              </form>

              <p className="text-xs text-gray-500 text-center mt-4">
                Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
              </p>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
