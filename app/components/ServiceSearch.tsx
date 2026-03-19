import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Filter, ChevronDown } from 'lucide-react';
import { services } from '../data/services';
import { useHeaderHeight } from '../contexts/HeaderContext';
import { useTheme } from '../contexts/ThemeContext';

interface ServiceSearchProps {
  onFilterChange: (filteredIds: number[]) => void;
}

// Получаем уникальные категории
const categories = Array.from(new Set(services.map(s => s.category)));

export default function ServiceSearch({ onFilterChange }: ServiceSearchProps) {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFocused, setIsFocused] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);
  const [startTyping, setStartTyping] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Получаем высоту хедера из контекста
  const { headerHeight } = useHeaderHeight();

  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  // Варианты плейсхолдеров для машинки
  const placeholders = [
    'Строительство ангаров...',
    'Монтаж трубопроводов...',
    'Земляные работы...',
    'Огнезащита конструкций...',
    'Грузоперевозки...'
  ];

  // Запускаем анимацию через 2 секунды после загрузки
  useEffect(() => {
    const timer = setTimeout(() => {
      setStartTyping(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Отслеживаем видимость секции для fixed позиционирования
  useEffect(() => {
    // Находим ближайшую секцию-родителя
    sectionRef.current = searchContainerRef.current?.closest('section') || null;

    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
        ([entry]) => {
          // Показываем поиск только когда секция видима
          setIsVisible(entry.isIntersecting);
        },
        {
          threshold: 0,
          rootMargin: `-${headerHeight}px 0px 0px 0px`
        }
    );

    observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, [headerHeight]);

  // Эффект печатной машинки
  useEffect(() => {
    if (!startTyping || isFocused || searchQuery) return;

    const currentPlaceholder = placeholders[placeholderIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Печатаем
        if (displayedPlaceholder.length < currentPlaceholder.length) {
          setDisplayedPlaceholder(currentPlaceholder.slice(0, displayedPlaceholder.length + 1));
          setTypingSpeed(80);
        } else {
          // Закончили печатать, ждём и начинаем удалять
          setTimeout(() => setIsDeleting(true), 1500);
          setTypingSpeed(40);
        }
      } else {
        // Удаляем
        if (displayedPlaceholder.length > 0) {
          setDisplayedPlaceholder(currentPlaceholder.slice(0, displayedPlaceholder.length - 1));
          setTypingSpeed(40);
        } else {
          // Закончили удалять, переходим к следующему
          setIsDeleting(false);
          setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
          setTypingSpeed(100);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayedPlaceholder, isDeleting, placeholderIndex, typingSpeed, startTyping, isFocused, searchQuery]);

  // Фильтрация услуг
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch = searchQuery === '' ||
          service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'all' ||
          service.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Уведомляем родительский компонент об изменениях
  useEffect(() => {
    onFilterChange(filteredServices.map(s => s.id));
  }, [filteredServices, onFilterChange]);

  // Вычисляем позицию dropdown при открытии
  useEffect(() => {
    if (showCategoryDropdown && filterButtonRef.current) {
      const buttonRect = filterButtonRef.current.getBoundingClientRect();

      setDropdownPosition({
        top: buttonRect.bottom + 8, // 8px отступа снизу кнопки
        left: buttonRect.right - 288 // 288px = w-72 (ширина dropdown)
      });
    }
  }, [showCategoryDropdown]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  const clearAll = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'all';

  return (
      <>
        {/* Пустой блок для сохранения места в потоке документа */}
        <div ref={searchContainerRef} className="mb-6 h-0" />

        {/* Fixed поисковая строка */}
        <div
            className={`transition-all duration-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
            }`}
            style={{
              position: 'fixed',
              top: `${headerHeight + 16}px`, // Высота хедера + 16px отступ
              left: 0,
              right: 0,
              zIndex: 30,
              pointerEvents: isVisible ? 'auto' : 'none'
            }}
        >
          {/* Search Bar */}
          <div className="container mx-auto px-4">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative backdrop-blur-xl border rounded-2xl overflow-visible transition-all duration-300 ${
                    theme === 'dark'
                        ? 'bg-neutral-900 border-gray-700'
                        : 'bg-white/80 border-gray-200'
                } ${
                    isFocused
                        ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                        : ''
                }`}
            >
              <div className="flex items-center gap-3 py-3 px-4">
                {/* Search Icon */}
                <div className={`flex-shrink-0 transition-colors duration-300 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                } ${isFocused ? 'text-blue-500' : ''}`}>
                  <Search className="w-5 h-5" />
                </div>

                {/* Search Input */}
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={!startTyping ? 'Ищите услуги быстро...' : displayedPlaceholder}
                    className={`flex-1 bg-transparent border-none outline-none text-sm font-medium ${
                        theme === 'dark'
                            ? 'text-white placeholder-gray-500'
                            : 'text-gray-900 placeholder-gray-400'
                    }`}
                />

                {/* Clear Search Button */}
                <AnimatePresence>
                  {searchQuery && (
                      <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          onClick={clearSearch}
                          className={`flex-shrink-0 p-1.5 rounded-lg transition-colors ${
                              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                          }`}
                      >
                        <X className={`w-4 h-4 ${
                            theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                        }`} />
                      </motion.button>
                  )}
                </AnimatePresence>

                {/* Divider */}
                <div className={`w-px h-6 flex-shrink-0 ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                }`} />

                {/* Category Filter */}
                <button
                    ref={filterButtonRef}
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 flex-shrink-0 min-w-0 ${
                        selectedCategory !== 'all'
                            ? 'bg-blue-600 text-white'
                            : theme === 'dark'
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  <Filter className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden xs:inline lg:hidden">
                  {selectedCategory === 'all' ? 'Категории' : selectedCategory.split(' ')[0]}
                </span>
                  <span className="hidden lg:inline">
                  {selectedCategory === 'all' ? 'Все категории' : selectedCategory}
                </span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 flex-shrink-0 ${
                      showCategoryDropdown ? 'rotate-180' : ''
                  }`} />
                </button>
              </div>

              {/* Active Filters Bar */}
              <AnimatePresence>
                {hasActiveFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-4 pb-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        {searchQuery && (
                            <span className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold">
                        <Search className="w-3.5 h-3.5" />
                              {searchQuery}
                      </span>
                        )}
                        {selectedCategory !== 'all' && (
                            <span className="inline-flex items-center gap-1.5 bg-purple-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold">
                        <Filter className="w-3.5 h-3.5" />
                              {selectedCategory}
                      </span>
                        )}
                      </div>
                      <button
                          onClick={clearAll}
                          className={`text-xs font-medium transition-colors ${
                              theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                          }`}
                      >
                        Сбросить фильтры
                      </button>
                    </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Category Dropdown - позиционирование под фильтром */}
            <AnimatePresence>
              {showCategoryDropdown && (
                  <>
                    {/* Backdrop to close on click outside */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowCategoryDropdown(false)}
                    />
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`absolute right-0 mt-2 w-72 max-h-80 overflow-y-auto backdrop-blur-xl border rounded-xl shadow-2xl z-50 ${
                            theme === 'dark'
                                ? 'bg-gray-800 border-gray-700'
                                : 'bg-white border-gray-200'
                        }`}
                    >
                      <div className="p-2">
                        {/* All Categories Option */}
                        <button
                            onClick={() => {
                              setSelectedCategory('all');
                              setShowCategoryDropdown(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                selectedCategory === 'all'
                                    ? 'bg-blue-600 text-white'
                                    : theme === 'dark'
                                        ? 'text-gray-300 hover:bg-gray-700'
                                        : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                          Все категории
                        </button>

                        {/* Category List */}
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => {
                                  setSelectedCategory(category);
                                  setShowCategoryDropdown(false);
                                }}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    selectedCategory === category
                                        ? 'bg-blue-600 text-white'
                                        : theme === 'dark'
                                            ? 'text-gray-300 hover:bg-gray-700'
                                            : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                              {category}
                            </button>
                        ))}
                      </div>
                    </motion.div>
                  </>
              )}
            </AnimatePresence>

            {/* Results Counter - внутри fixed контейнера */}
            <AnimatePresence>
              {(searchQuery || selectedCategory !== 'all') && (
                  <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-3 text-center"
                  >
                    <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Найдено:{' '}
                      <span className={`font-bold ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                    {filteredServices.length}
                  </span>{' '}
                      из{' '}
                      <span className={`font-bold ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>{services.length}</span>
                      {' '}услуг
                    </p>
                  </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </>
  );
}