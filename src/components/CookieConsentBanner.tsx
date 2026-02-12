import React, { useState, useEffect } from 'react';
import { Cookie, X, Check, Settings, Shield, BarChart, Megaphone, Palette, ChevronDown, ChevronUp } from 'lucide-react';

type CookieType = 'essential' | 'analytics' | 'marketing' | 'functional';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

const CookieConsentBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMobileDetails, setShowMobileDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
    functional: false,
  });

  useEffect(() => {
    const savedConsent = localStorage.getItem('cookieConsent');
    const savedPrefs = localStorage.getItem('cookiePreferences');

    if (!savedConsent) {
      // Небольшая задержка для лучшего UX
      const timer = setTimeout(() => setIsVisible(true), 800);
      return () => clearTimeout(timer);
    } else if (savedPrefs) {
      setPreferences(JSON.parse(savedPrefs));
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
      functional: true,
    };

    savePreferences(allAccepted);
  };

  const handleSavePreferences = () => {
    savePreferences(preferences);
  };

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookieConsent', 'true');
    localStorage.setItem('cookiePreferences', JSON.stringify(prefs));

    // Применяем настройки на практике
    applyCookieSettings(prefs);

    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      setShowSettings(false);
      setShowMobileDetails(false);
    }, 300);
  };

  const applyCookieSettings = (prefs: CookiePreferences) => {
    console.log('Применены настройки cookies:', prefs);
    // Здесь реализуется логика включения/выключения сервисов
  };

  const togglePreference = (type: CookieType) => {
    if (type === 'essential') return;

    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const cookieTypes = [
    {
      id: 'essential',
      title: 'Обязательные',
      description: 'Необходимы для работы сайта. Без них сайт не будет функционировать правильно.',
      icon: Shield,
      required: true,
      color: 'bg-green-100 dark:bg-green-900/30',
      textColor: 'text-green-800 dark:text-green-300',
    },
    {
      id: 'functional',
      title: 'Функциональные',
      description: 'Запоминают ваши настройки (язык, тема, регион) для удобства использования.',
      icon: Palette,
      required: false,
      color: 'bg-blue-100 dark:bg-blue-900/30',
      textColor: 'text-blue-800 dark:text-blue-300',
    },
    {
      id: 'analytics',
      title: 'Аналитические',
      description: 'Помогают понять, как пользователи взаимодействуют с сайтом.',
      icon: BarChart,
      required: false,
      color: 'bg-purple-100 dark:bg-purple-900/30',
      textColor: 'text-purple-800 dark:text-purple-300',
    },
    {
      id: 'marketing',
      title: 'Маркетинговые',
      description: 'Используются для показа релевантной рекламы и измерения эффективности кампаний.',
      icon: Megaphone,
      required: false,
      color: 'bg-amber-100 dark:bg-amber-900/30',
      textColor: 'text-amber-800 dark:text-amber-300',
    },
  ];

  if (!isVisible) {
    return null;
  }

  return (
      <>
        {/* Затемнение фона при открытых настройках */}
        {showSettings && (
            <div
                className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
                onClick={() => setShowSettings(false)}
            />
        )}

        {/* Основной баннер - фиксированно снизу на всю ширину */}
        <div className={`fixed bottom-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out ${
            isClosing ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
        }`}>

          {/* Мобильный вид - компактный баннер */}
          <div className="lg:hidden">
            {!showSettings ? (
                <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-[0_-4px_25px_rgba(0,0,0,0.1)]">
                  <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-md" />
                          <div className="relative bg-gradient-to-br from-amber-400 to-amber-500 p-2 rounded-xl">
                            <Cookie className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white text-sm">
                      Настройки cookies
                    </span>
                      </div>

                      <button
                          onClick={() => setShowMobileDetails(!showMobileDetails)}
                          className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        {showMobileDetails ? (
                            <ChevronDown className="w-5 h-5" />
                        ) : (
                            <ChevronUp className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    {/* Раскрывающиеся детали на мобильном */}
                    {showMobileDetails && (
                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 space-y-3 animate-in slide-in-from-bottom duration-200">
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Мы используем cookies для улучшения работы сайта. Вы можете настроить свои предпочтения.
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {cookieTypes.map(type => (
                                <span
                                    key={type.id}
                                    className={`px-2 py-1 rounded-lg text-xs font-medium ${type.color} ${type.textColor}`}
                                >
                          {type.title}
                        </span>
                            ))}
                          </div>

                          <div className="flex gap-2 pt-2">
                            <button
                                onClick={() => setShowSettings(true)}
                                className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              Настроить
                            </button>
                            <button
                                onClick={handleAcceptAll}
                                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2 rounded-lg text-sm font-medium transition-all shadow-lg"
                            >
                              Принять все
                            </button>
                          </div>
                        </div>
                    )}

                    {/* Кнопки действий (всегда видны) */}
                    {!showMobileDetails && (
                        <div className="flex gap-2 mt-3">
                          <button
                              onClick={() => savePreferences(preferences)}
                              className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            Отклонить
                          </button>
                          <button
                              onClick={handleAcceptAll}
                              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2 rounded-lg text-sm font-medium transition-all shadow-lg"
                          >
                            Принять все
                          </button>
                        </div>
                    )}
                  </div>
                </div>
            ) : (
                /* Мобильные настройки */
                <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-[0_-4px_25px_rgba(0,0,0,0.1)] max-h-[80vh] overflow-y-auto">
                  <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      Настройки cookies
                    </h3>
                    <button
                        onClick={() => setShowSettings(false)}
                        className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-4 space-y-4">
                    {cookieTypes.map(type => {
                      const Icon = type.icon;
                      return (
                          <div key={type.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${type.color}`}>
                                <Icon className={`w-4 h-4 ${type.textColor}`} />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 dark:text-white text-sm">
                              {type.title}
                            </span>
                                  {type.required && (
                                      <span className="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full">
                                Всегда
                              </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                  {type.description}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center">
                              <button
                                  onClick={() => togglePreference(type.id as CookieType)}
                                  disabled={type.required}
                                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                      preferences[type.id as CookieType]
                                          ? 'bg-green-500'
                                          : 'bg-gray-300 dark:bg-gray-700'
                                  } ${type.required ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                              >
                          <span
                              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                  preferences[type.id as CookieType]
                                      ? 'translate-x-5'
                                      : 'translate-x-1'
                              }`}
                          />
                              </button>
                            </div>
                          </div>
                      );
                    })}

                    <div className="sticky bottom-0 bg-white dark:bg-gray-900 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex gap-2">
                        <button
                            onClick={() => setShowSettings(false)}
                            className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 py-3 rounded-xl text-sm font-medium transition-colors"
                        >
                          Назад
                        </button>
                        <button
                            onClick={handleSavePreferences}
                            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl text-sm font-medium transition-all shadow-lg"
                        >
                          Сохранить выбор
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
            )}
          </div>

          {/* Десктопный вид */}
          <div className="hidden lg:block">
            <div className="w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-[0_-4px_25px_rgba(0,0,0,0.1)]">
              <div className="max-w-7xl mx-auto">
                {!showSettings ? (
                    <div className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="relative">
                            <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-lg" />
                            <div className="relative bg-gradient-to-br from-amber-400 to-amber-500 p-3 rounded-2xl shadow-lg">
                              <Cookie className="w-6 h-6 text-white" />
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                Ваша конфиденциальность
                              </h3>
                              <div className="flex gap-2">
                                {cookieTypes.map(type => (
                                    <span
                                        key={type.id}
                                        className={`px-2 py-1 rounded-lg text-xs font-medium ${type.color} ${type.textColor}`}
                                    >
                                {type.title}
                              </span>
                                ))}
                              </div>
                            </div>

                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Мы используем cookies для улучшения работы сайта, персонализации контента и анализа трафика.
                              Подробнее в нашей{' '}
                              <a
                                  href="/privacy"
                                  className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                              >
                                Политике конфиденциальности
                              </a>.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 ml-6">
                          <button
                              onClick={() => setShowSettings(true)}
                              className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2.5 rounded-xl font-medium transition-colors"
                          >
                            <Settings className="w-4 h-4" />
                            Настроить
                          </button>

                          <button
                              onClick={() => savePreferences(preferences)}
                              className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-medium transition-colors"
                          >
                            Отклонить
                          </button>

                          <button
                              onClick={handleAcceptAll}
                              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
                          >
                            <Check className="w-4 h-4" />
                            Принять все
                          </button>

                          <button
                              onClick={() => savePreferences(preferences)}
                              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                              aria-label="Закрыть"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                ) : (
                    /* Десктопные настройки */
                    <div className="px-6 py-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            Расширенные настройки cookies
                          </h3>
                        </div>
                        <button
                            onClick={() => setShowSettings(false)}
                            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {cookieTypes.map(type => {
                          const Icon = type.icon;
                          return (
                              <div key={type.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-lg ${type.color}`}>
                                    <Icon className={`w-5 h-5 ${type.textColor}`} />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-gray-900 dark:text-white">
                                  {type.title}
                                </span>
                                      {type.required && (
                                          <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full">
                                    Обязательные
                                  </span>
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {type.description}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center">
                                  <button
                                      onClick={() => togglePreference(type.id as CookieType)}
                                      disabled={type.required}
                                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                          preferences[type.id as CookieType]
                                              ? 'bg-green-500'
                                              : 'bg-gray-300 dark:bg-gray-700'
                                      } ${type.required ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                  >
                              <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                      preferences[type.id as CookieType]
                                          ? 'translate-x-6'
                                          : 'translate-x-1'
                                  }`}
                              />
                                  </button>
                                </div>
                              </div>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Ваши предпочтения будут сохранены для будущих посещений.
                        </p>

                        <div className="flex gap-3">
                          <button
                              onClick={() => setShowSettings(false)}
                              className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-medium transition-colors"
                          >
                            Назад
                          </button>
                          <button
                              onClick={handleSavePreferences}
                              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
                          >
                            <Check className="w-4 h-4" />
                            Сохранить настройки
                          </button>
                        </div>
                      </div>
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
  );
};

export default CookieConsentBanner;