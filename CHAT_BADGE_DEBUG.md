# 📦 ChatWidget - Документация реализации (2026-03-15)

## 📋 Реализованный функционал

### 1. Бейдж непрочитанных сообщений ✅
- Показывает количество непрочитанных сообщений от assistant
- Глобальный `lastReadIndex` для всех услуг
- Сбрасывается при открытии чата

### 2. Автопрокрутка при открытии ✅
- При открытии чата с историей происходит автопрокрутка к последнему сообщению

### 3. Автооткрытие чата для новых пользователей ✅
- Через 10 секунд после первого входа чат открывается автоматически
- Индикатор обратного отсчёта на кнопке (зелёный бейдж с цифрами)
- Анимация открытия с помощью framer-motion
- Не показывается при повторных визитах

### 4. Reminder сообщение на главной ✅
- При возврате на главную после посещения услуг
- Если пользователь не ответил на приветствие
- Показывается через 3 секунды после закрытия чата

### 5. Адаптивный дизайн для мобильных ✅
- Оптимизированная шапка с AI аватаром
- Уменьшенные отступы и размеры элементов
- Корректное позиционирование над нижним табом

---

## ✅ РЕШЕНО: Поле телефона в форме заявки чата (2026-03-21)

### Описание проблемы
Поле ввода телефона в форме заявки AI-чата (`app/components/ChatWidget.tsx`) работало **некорректно**:
- При вводе цифр номер формировался неправильно: `+7 (777) 777-77-79` вместо `+7 (921) 321-32-32`
- Удаление символов (Backspace/Delete) не работало
- Каждая введённая цифра интерпретировалась как `7`

### Сценарий воспроизведения (был)
1. Открыть чат
2. Нажать "📋 Заполнить заявку"
3. Начать вводить номер: `9213213232`
4. **Результат:** `+7 (777) 777-77-79` ❌
5. Нажать Backspace — не удаляется ❌

### Предпринятые попытки исправления (неудачные)

#### Попытки 1-6: Различные подходы с controlled/uncontrolled inputs
Все 6 попыток не увенчались успехом из-за проблемы с React controlled input — `e.target.value` содержал уже отформатированное значение.

---

### ✅ Решение (Попытка 7): Упрощённый controlled input с извлечением цифр

**Что сделали:**
- Добавили состояние для сырых цифр: `const [phoneDigits, setPhoneDigits] = useState('')`
- Использовали `ref={phoneInputRef}` для доступа к input
- Создали функцию форматирования `formatPhoneValue(digits)` для отображения
- В `handlePhoneChange` извлекаем цифры из `e.target.value.replace(/\D/g, '')`
- Определяем направление изменения (удаление или добавление) по длине

**Код:**
```typescript
const [phoneDigits, setPhoneDigits] = useState('');
const phoneInputRef = useRef<HTMLInputElement>(null);

const formatPhoneValue = (digits: string): string => {
  if (!digits) return '';
  let normalized = digits;
  if (digits.startsWith('8')) {
    normalized = '7' + digits.slice(1);
  }
  if (!normalized.startsWith('7') && normalized.length > 0) {
    normalized = '7' + normalized;
  }
  normalized = normalized.slice(0, 11);

  let formatted = '';
  if (normalized.length > 0) {
    formatted = '+7';
    if (normalized.length > 1) {
      const d = normalized.slice(1);
      if (d.length <= 3) {
        formatted += ` (${d}`;
      } else if (d.length <= 6) {
        formatted += ` (${d.slice(0, 3)}) ${d.slice(3)}`;
      } else if (d.length <= 8) {
        formatted += ` (${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
      } else {
        formatted += ` (${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 8)}-${d.slice(8, 10)}`;
      }
    }
  }
  return formatted;
};

const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const inputValue = e.target.value;
  const digits = inputValue.replace(/\D/g, '');
  
  // If user is deleting (backspace), allow it
  if (digits.length < phoneDigits.length) {
    setPhoneDigits(digits);
    if (formErrors.phone) {
      setFormErrors(prev => ({ ...prev, phone: undefined }));
    }
    return;
  }
  
  // If adding new digits, only accept up to 11
  const newDigits = digits.slice(0, 11);
  if (newDigits !== phoneDigits) {
    setPhoneDigits(newDigits);
    if (formErrors.phone) {
      setFormErrors(prev => ({ ...prev, phone: undefined }));
    }
  }
};
```

**Input:**
```tsx
<input
  ref={phoneInputRef}
  type="tel"
  value={formatPhoneValue(phoneDigits)}
  onChange={handlePhoneChange}
  maxLength={18}
  placeholder="+7 (___) ___-__-__"
/>
```

**Результат:** ✅ **РАБОТАЕТ!**

### Ключевое отличие от предыдущих попыток
- **Один обработчик `onChange`** вместо комбинации `onKeyDown + onInput`
- **Извлечение цифр из уже отформатированного значения** — `inputValue.replace(/\D/g, '')`
- **Определение направления изменения** по сравнению длин (`digits.length < phoneDigits.length`)
- **`maxLength={18}`** для ограничения длины отформатированного значения

### Изменённые файлы
| Файл | Изменения |
|------|-----------|
| `app/components/ChatWidget.tsx` | ~147-207 (функции форматирования и обработки) |
| `app/components/ChatWidget.tsx` | ~2307-2327 (input телефона) |

### Рабочие альтернативы
✅ В других модальных окнах (`ServiceOrderModal.tsx`, `CallbackModal.tsx`) поле телефона работает **корректно** — там используется аналогичная логика, но без проблем

---

**Дата добавления:** 2026-03-21
**Дата исправления:** 2026-03-21
**Статус:** ✅ **ИСПРАВЛЕНО**
**Приоритет:** Критический
**Влияние:** Пользователи могут отправлять заявки через форму в чате

---

## 🎨 Редизайн главной страницы: Цветовые акценты для кнопок преимуществ и FAQ (2026-03-17)

### Описание изменений
Проведён редизайн визуальных элементов главной страницы и страницы "О компании" для улучшения восприятия ключевых преимуществ компании и повышения конверсии.

### Изменённые элементы

#### 1. Кнопки преимуществ в SEO-блоке (welcome.tsx)
Добавлены индивидуальные градиенты для трёх кнопок с преимуществами компании:

| Кнопка | Градиент | Иконка |
|--------|----------|--------|
| **12 лет на рынке** | `from-amber-500 to-orange-500` (янтарно-оранжевый) | Award |
| **100+ проектов** | `from-green-500 to-emerald-500` (зелёно-изумрудный) | CheckCircle |
| **Работаем по всей России** | `from-blue-500 to-cyan-500` (сине-голубой) | MapPin |

**Дополнительные эффекты:**
- `backdrop-blur-sm` — лёгкое размытие фона
- `shadow-lg` — тень для объёма
- `hover:shadow-xl hover:scale-105` — анимация при наведении
- `transition-all duration-300` — плавная анимация
- Белый текст и иконки для контраста

**Код (app/welcome/welcome.tsx):**
```tsx
<div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
  <Award className="w-5 h-5 text-white" />
  <span className="font-semibold text-white">12 лет на рынке</span>
</div>
```

#### 2. Кнопка телефона в блоке "Как заказать" (welcome.tsx)
Добавлен яркий градиент для кнопки телефона:

| Элемент | Градиент | Иконка |
|---------|----------|--------|
| **+7 931 247-08-88** | `from-purple-500 to-pink-500` (фиолетово-розовый) | Phone |

**Дополнительные эффекты:**
- `shadow-lg` — тень
- `hover:shadow-2xl hover:scale-105` — увеличенная тень и масштаб при наведении
- `transition-all duration-300` — плавная анимация
- Белый текст

**Код (app/welcome/welcome.tsx):**
```tsx
<a
  href="tel:+79312470888"
  className="inline-flex items-center gap-3 px-6 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
>
  <Phone className="w-5 h-5" />
  +7 931 247-08-88
</a>
```

#### 3. Фон блоков FAQ в темной теме (FaqSection.tsx)
Исправлен фон блоков вопросов и ответов для гармоничного сочетания с темным фоном страницы:

**Изменения (app/components/FaqSection.tsx):**
- Было: `bg-gray-900` (сплошной темный фон)
- Стало: `bg-neutral-950/80 backdrop-blur-xl border border-neutral-800`

**Эффекты:**
- `bg-neutral-950/80` — полупрозрачный фон (80% непрозрачности) близкий к `#0a0a0a`
- `backdrop-blur-xl` — эффект матового стекла с размытием фона
- `border border-neutral-800` — тонкая рамка для контраста с градиентной обводкой

**Код:**
```tsx
<div className={`relative rounded-[2rem] overflow-hidden ${
  theme === 'dark' ? 'bg-neutral-950/80 backdrop-blur-xl border border-neutral-800' : 'bg-white'
}`}>
```

#### 4. Карточки преимуществ на странице "О компании" (CompanyShowcase.tsx)
Добавлены градиенты для статистики и карточек преимуществ с поддержкой темной темы:

**Статистика в Hero-секции:**

| Показатель | Градиент |
|------------|----------|
| **12+ лет опыта** | `from-amber-500 to-orange-500` |
| **150+ проектов** | `from-green-500 to-emerald-500` |
| **2-5 лет гарантии** | `from-blue-500 to-cyan-500` |
| **Вся Россия** | `from-purple-500 to-pink-500` |

**Карточки преимуществ (desktop + mobile):**

| Преимущество | Градиент |
|--------------|----------|
| **Ассоциация "СК ЛО"** | `from-blue-500 to-cyan-500` |
| **Ассоциация СРО "ОсноваПроект"** | `from-blue-500 to-cyan-500` |
| **Точность работ** | `from-purple-500 to-pink-500` |
| **Скорость** | `from-orange-500 to-red-500` |
| **География** | `from-green-500 to-emerald-500` |

**Эффекты:**
- `bg-gradient-to-r` — градиентный фон для статистики
- `dark:from-{color}-600 dark:to-{color}-600` — более насыщенные цвета в темной теме
- `hover:scale-1.05` / `hover:scale-1.02` — анимация при наведении
- `shadow-lg hover:shadow-xl` — тень с эффектом усиления
- `backdrop-blur-sm` — размытие фона
- `group-hover:opacity-10` — градиентная подсветка при наведении для desktop-карточек
- `group-hover:scale-110 group-hover:rotate-3` — анимация иконок

**Код (статистика):**
```tsx
<motion.div
  whileHover={{ scale: 1.05 }}
  className={`text-center p-3 md:p-4 rounded-xl bg-gradient-to-r ${stat.gradient} ${stat.darkGradient} backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300`}
>
  <div className="text-xl md:text-2xl font-bold text-white">{stat.value}</div>
  <div className="text-xs md:text-sm text-white/90">{stat.label}</div>
</motion.div>
```

**Код (desktop-карточки):**
```tsx
<motion.div
  whileHover={{ x: -10, scale: 1.02 }}
  className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
>
  {/* Градиентный фон */}
  <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} ${feature.darkGradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
  
  {/* Основной контент */}
  <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} ${feature.darkGradient} text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
      {feature.icon}
    </div>
    ...
  </div>
</motion.div>
```

**Код (мобильные карточки):**
```tsx
<motion.div
  whileHover={{ scale: 1.05 }}
  className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${feature.gradient} ${feature.darkGradient} backdrop-blur-sm p-4 shadow-lg`}
>
  <div className="inline-flex p-2 rounded-lg bg-white/20 text-white mb-2">
    {feature.icon}
  </div>
  <h3 className="text-sm font-bold text-white mb-1">{feature.title}</h3>
  <p className="text-xs text-white/90">{feature.description}</p>
</motion.div>
```

### Изменённые файлы
| Файл | Изменения |
|------|-----------|
| `app/welcome/welcome.tsx` | Градиенты для кнопок преимуществ (amber, green, blue), градиент для кнопки телефона (purple-pink) |
| `app/components/FaqSection.tsx` | Фон блоков FAQ в темной теме (neutral-950/80 + backdrop-blur) |
| `app/components/CompanyShowcase.tsx` | Градиенты для статистики (4 цвета), карточек преимуществ desktop (5 цветов) и mobile (5 цветов), поддержка темной темы |

### Результат
✅ **Кнопки преимуществ (welcome.tsx):**
- Выделяются на фоне остального контента
- Каждая кнопка имеет уникальный цвет для лучшей запоминаемости
- Анимация при наведении повышает интерактивность
- Белый текст обеспечивает высокий контраст

✅ **Кнопка телефона (welcome.tsx):**
- Яркий фиолетово-розовый градиент привлекает внимание к CTA-элементу
- Увеличенный размер (`px-6 py-4`) и шрифт (`text-lg`)
- Анимация при наведении побуждает к клику

✅ **FAQ блоки (FaqSection.tsx):**
- Гармонично сочетаются с темным фоном страницы
- Эффект стекла (`backdrop-blur`) добавляет современный вид
- Тонкая рамка (`border-neutral-800`) отделяет блоки от градиентной обводки

✅ **Карточки преимуществ (CompanyShowcase.tsx):**
- Статистика с индивидуальными градиентами для каждого показателя
- Desktop-карточки с градиентной подсветкой при наведении
- Мобильные карточки с градиентным фоном и анимацией
- Поддержка темной темы с более насыщенными цветами
- Анимация иконок (увеличение + поворот) при наведении

### Примечание
Для темной темы используется класс `.dark` на элементе `html`, который добавляется через `ThemeContext`. Градиенты адаптированы для обеих тем:
- Светлая тема: `from-{color}-500 to-{color}-500`
- Темная тема: `dark:from-{color}-600 dark:to-{color}-600` (более насыщенные цвета)

---

**Дата добавления:** 2026-03-17
**Дата обновления:** 2026-03-17 (добавлен CompanyShowcase.tsx)
**Статус:** ✅ Реализовано
**Приоритет:** Высокий
**Влияние:** Улучшена визуальная привлекательность и конверсия ключевых элементов на всех страницах

---

## ✅ Исправлено: Цвета заголовков карточек услуг на разных темах (2026-03-17)

### Описание проблемы
На темной теме заголовки карточек услуг (`<h3>`) отображались темно-синими/темно-серыми, что делало их плохо читаемыми. При попытке исправить через Tailwind классы (`text-white dark:text-gray-900` → `text-gray-900 dark:text-white`) на светлой теме заголовки становились беллыми и тоже были не видны.

### Корневая причина
В файле `app/app.css` были глобальные стили для типографики:

```css
h1 { @apply text-3xl sm:text-4xl md:text-5xl; }
h2 { @apply text-2xl sm:text-3xl; }
h3 { @apply text-xl sm:text-2xl; }
```

Эти стили не устанавливали явный цвет текста, поэтому:
- На светлой теме: цвет наследовался от браузера (обычно черный)
- На темной теме: цвет также наследовался (серый/черный), так как `.dark` не устанавливал `color`

Tailwind классы `text-gray-900 dark:text-white` перебивались глобальными стилями из-за специфики CSS или порядка загрузки.

### Решение
Добавлены явные стили для цвета заголовков в зависимости от темы в `app/app.css`:

```css
/* Цвет текста для заголовков в темной теме */
html.dark h1,
html.dark h2,
html.dark h3 {
  color: white;
}

/* Цвет текста для заголовков в светлой теме */
html:not(.dark) h1,
html:not(.dark) h2,
html:not(.dark) h3 {
  color: rgb(17 24 39); /* gray-900 */
}
```

### Изменённые файлы
| Файл | Изменения |
|------|-----------|
| `app/app.css` | Добавлены стили для `html.dark h1/h2/h3` и `html:not(.dark) h1/h2/h3` |
| `app/welcome/welcome.tsx` | Исправлены классы на карточках: `text-gray-900 dark:text-white` |

### Результат
✅ На светлой теме:
- Заголовки карточек темные (`rgb(17 24 39)` / `gray-900`)
- Цена и кнопка "Подробнее" синие (`text-blue-600`)

✅ На темной теме:
- Заголовки карточек белые (`white`)
- Цена и кнопка "Подробнее" светло-синие (`text-blue-400`)

### Примечание
Для корректной работы тем в Tailwind v4 используется класс-селектор `.dark` на элементе `html`, который добавляется через `ThemeContext`:

```typescript
useEffect(() => {
  if (!isInitialized) return;
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(theme);
}, [theme, isInitialized]);
```

---

**Дата добавления:** 2026-03-17
**Статус:** ✅ Исправлено
**Приоритет:** Высокий
**Влияние:** Улучшена читаемость карточек услуг на всех темах

---

## 🏗️ Архитектура

### Ключи sessionStorage
```javascript
const STORAGE_KEY = 'legion_chat_history';
const STORAGE_LAST_READ_KEY = 'legion_chat_last_read_global';
```

### Пример структуры sessionStorage
```javascript
{
  "legion_chat_history": "[...]",
  "legion_chat_last_read_global": "3",
  "legion_chat_autoopen_shown": "true",
  "legion_chat_reminder_time": "1710512345678"
}
```

---

## 🔧 Ключевые реализации

### 1. Трекинг непрочитанных
```typescript
useEffect(() => {
  const lastReadIndexStr = sessionStorage.getItem(STORAGE_LAST_READ_KEY);

  if (isOpen) {
    setUnreadCount(0);
    if (messages.length > 0) {
      sessionStorage.setItem(STORAGE_LAST_READ_KEY, messages.length.toString());
    }
    return;
  }

  if (messages.length > 0) {
    if (lastReadIndexStr === null) {
      const unreadCountValue = messages.filter(m => m.from === 'assistant').length;
      setUnreadCount(unreadCountValue);
    } else {
      const lastReadIndex = parseInt(lastReadIndexStr, 10);
      const unreadMessages = messages.slice(lastReadIndex);
      const unreadCountValue = unreadMessages.filter(m => m.from === 'assistant').length;
      setUnreadCount(unreadCountValue);
    }
  }
}, [messages, isOpen, serviceSlug]);
```

### 2. Автооткрытие чата
```typescript
const [countdown, setCountdown] = useState<number | null>(null);

useEffect(() => {
  const hasChatHistory = sessionStorage.getItem(STORAGE_KEY);
  const hasSeenAutoOpen = sessionStorage.getItem('legion_chat_autoopen_shown');

  if (!hasChatHistory && !hasSeenAutoOpen && !isOpen) {
    setCountdown(10);
    const countdownInterval = setInterval(() => {
      setCountdown(prev => prev === null || prev <= 1 ? null : prev - 1);
    }, 1000);

    autoOpenTimeoutRef.current = setTimeout(() => {
      setIsOpen(true);
      setCountdown(null);
      sessionStorage.setItem('legion_chat_autoopen_shown', 'true');
      
      if (messages.length === 0) {
        const autoWelcomeMessage: Message = {
          id: 'auto-welcome',
          text: serviceSlug
            ? `Здравствуйте! 👋 Я помощник по услуге "${serviceName}". Чем могу помочь?`
            : `Здравствуйте! 👋

Знаю, как вы устали искать интересующие вас услуги или информацию о них. Я с удовольствием вам помогу и расскажу о нас, о наших услугах!

Просто спросите меня, и я всё расскажу! 😊`,
          from: 'assistant',
          timestamp: new Date()
        };
        setMessages([autoWelcomeMessage]);
      }
    }, 10000);

    return () => {
      clearInterval(countdownInterval);
      if (autoOpenTimeoutRef.current) clearTimeout(autoOpenTimeoutRef.current);
    };
  }

  return () => {
    if (autoOpenTimeoutRef.current) clearTimeout(autoOpenTimeoutRef.current);
  };
}, [isOpen, messages.length, serviceSlug, serviceName]);
```

### 3. Reminder сообщение (sessionStorage подход)
```typescript
const [reminderCheckTrigger, setReminderCheckTrigger] = useState(0);

// Интервал проверки каждые 500мс
useEffect(() => {
  const reminderInterval = setInterval(() => {
    setReminderCheckTrigger(prev => prev + 1);
  }, 500);
  return () => clearInterval(reminderInterval);
}, []);

// В main useEffect с зависимостью reminderCheckTrigger
if (!serviceSlug && savedHistory && messages.length > 0) {
  const hasUserMessage = messages.some(m => m.from === 'user');
  const hasReminder = messages.some(m => m.id === 'home-reminder');
  const hasSeenAutoOpen = sessionStorage.getItem('legion_chat_autoopen_shown');
  const reminderScheduledTime = sessionStorage.getItem('legion_chat_reminder_time');
  const currentTime = Date.now();

  if (!hasUserMessage && !hasReminder && hasSeenAutoOpen && !isOpen) {
    if (!reminderScheduledTime) {
      sessionStorage.setItem('legion_chat_reminder_time', (currentTime + 3000).toString());
      return;
    }

    const showReminderAt = parseInt(reminderScheduledTime);
    if (currentTime >= showReminderAt) {
      setMessages(prev => {
        const stillHasUserMessage = prev.some(m => m.from === 'user');
        const stillHasReminder = prev.some(m => m.id === 'home-reminder');
        if (stillHasUserMessage || stillHasReminder) return prev;

        return [...prev, {
          id: 'home-reminder',
          text: `Вы так и не сказали, нужна ли вам моя помощь? 🤔\n\nЯ помогу вам в любом вопросе о нашей компании или наших услугах. Просто спросите! 😊`,
          from: 'assistant',
          timestamp: new Date()
        }];
      });
      sessionStorage.removeItem('legion_chat_reminder_time');
    }
  }
} else if (serviceSlug) {
  // Очистка при уходе со страницы
  if (sessionStorage.getItem('legion_chat_reminder_time')) {
    sessionStorage.removeItem('legion_chat_reminder_time');
  }
}
```

### 4. Отмена автооткрытия при ручном открытии
```typescript
const toggleChat = () => {
  if (!isOpen && autoOpenTimeoutRef.current) {
    clearTimeout(autoOpenTimeoutRef.current);
    autoOpenTimeoutRef.current = null;
    setCountdown(null);
    sessionStorage.setItem('legion_chat_autoopen_shown', 'true');
  }
  setIsOpen(!isOpen);
  if (isMinimized) setIsMinimized(false);
};
```

### 5. Очистка истории
```typescript
const clearChatHistory = () => {
  sessionStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(STORAGE_LAST_READ_KEY);
  sessionStorage.removeItem('legion_chat_autoopen_shown');
  sessionStorage.removeItem('legion_chat_reminder_time');
  // ... остальной код
};
```

---

## 🎯 Рабочие сценарии

| Сценарий | lastReadIndex | messages.length | unreadCount | Бейдж |
|----------|---------------|-----------------|-------------|-------|
| Первый вход (нет истории) | null | 1 (welcome) | 1 | 🔴 1 ✅ |
| Открытие чата | 1 | 1 | 0 | исчез ✅ |
| Переход на другую услугу | 1 | 1 | 0 | нет ✅ |
| Новые сообщения на другой услуге | 1 | 3 | 2 | 🔴 2 ✅ |
| Возврат на первую услугу | 3 | 3 | 0 | нет ✅ |
| Открытие чата с историей | 3 | 3 | 0 | исчез + прокрутка ✅ |
| Возврат на главную (нет ответа) | 2 | 2 | 0 | исчез + reminder ✅ |

---

## 📱 Мобильная адаптация

### CSS стили для мобильных
```css
@media (max-width: 640px) {
  .chat-widget-button {
    bottom: 5rem !important;
    right: 1.5rem !important;
    width: 3.5rem !important;
    height: 3.5rem !important;
  }
  .chat-widget-window {
    bottom: 5rem !important;
    right: 1rem !important;
    left: 1rem !important;
    width: calc(100% - 2rem) !important;
    max-height: calc(100vh - 13rem) !important;
  }
}
```

### Элементы шапки
- AI аватар с эффектом свечения
- Индикатор онлайн (зелёная точка)
- Минималистичный заголовок "AI Помощник"
- Иконка Sparkles рядом с заголовком

---

## 🔗 Связанные файлы
- `app/components/ChatWidget.tsx` - основная логика
- `app/welcome/welcome.tsx` - главная страница
- `app/components/FixedMobileTabs.tsx` - мобильный таб

---

## ✅ Решённая проблема: Форма заявки исчезает при открытии (2026-03-15)

### Описание проблемы
При нажатии на кнопку "📋 Заполнить заявку на консультацию" форма показывается, но **сразу исчезает**.

### Корневая причина
В `useEffect` при открытии чата (`if (isOpen)`) вызывался `setShowLeadForm(false)`, что приводило к мгновенному закрытию формы сразу после открытия:

```typescript
// ❌ БЫЛО (неправильно)
if (isOpen) {
  setUnreadCount(0);
  setQuestionCount(0);
  setLeadFormOffered(false);
  setShowLeadForm(false);  // ← Это закрывало форму сразу после открытия!
  setWaitingForFormConsent(false);
}
```

### Решение
Разделить логику сброса состояния:
1. **При открытии чата** — сбрасывать только счётчики, но не форму
2. **При закрытии чата** — сбрасывать форму

```typescript
// ✅ СТАЛО (правильно)
// Reset state when OPENING chat (not when closing)
if (isOpen && messages.length === 0) {
  setUnreadCount(0);
  setQuestionCount(0);
  setLeadFormOffered(false);
  setWaitingForFormConsent(false);
  // Don't reset showLeadForm here - let user control it
}

// Reset form when CLOSING chat
if (!isOpen && showLeadForm) {
  setShowLeadForm(false);
}
```

### Дополнительные исправления
1. **Увеличен timeout прокрутки** с 100ms до 200ms
2. **Изменён `block` параметр** с `'end'` на `'center'` для лучшей видимости
3. **Добавлен `padding-bottom`** (`pb-32`) к контейнеру сообщений, чтобы форма не перекрывалась Input секцией

### Результат
✅ Форма теперь:
- Остаётся открытой после нажатия на кнопку
- Корректно прокручивается к центру видимой области
- Не перекрывается Input секцией
- Закрывается только по кнопке ✕ или при закрытии чата

---

**Дата создания:** 2026-03-15
**Дата исправления:** 2026-03-16
**Статус:** ✅ Исправлено
**Приоритет:** Высокий

---

## ✅ Решённая проблема: Зависание бота после отправки телефона (2026-03-16)

### Описание проблемы
После того как клиент отправил номер телефона и бот отправил заявку в Telegram, при следующих сообщениях пользователя бот зависал — показывал иконку "печатает", но ответа не было.

**Сценарий:**
1. Клиент отправляет номер телефона → бот отправляет в Telegram → отвечает "передал номер" ✅
2. Клиент пишет "я забыл дополнить..." → бот показывает "печатает" и зависает ❌

### Корневая причина
После обнаружения телефона в сообщении бот всё равно отправлял запрос в Qwen CLI, который мог зависать на 60 секунд (таймаут).

```typescript
// ❌ БЫЛО (неправильно)
if (phoneNumber) {
  sendLeadToTelegram({...});  // Отправка в Telegram
  // Запрос в Qwen продолжался, мог зависнуть на 60с
}

const prompt = buildPrompt(...);
const { stdout } = await execAsync(`qwen -y -p "${escapedPrompt}"`, {
  timeout: 60000  // Слишком долго!
});
```

### Решение

#### 1. Немедленный ответ при обнаружении телефона (ai-assistant/server.js)
```typescript
// ✅ СТАЛО (правильно)
if (phoneNumber) {
  console.log('📞 [CHAT] Phone number detected:', phoneNumber);
  
  // Отправка в Telegram (async)
  sendLeadToTelegram({...});
  
  // Немедленный ответ без вызова Qwen
  console.log('📞 [CHAT] Phone detected - returning immediate response');
  
  res.json({
    response: `Отлично! 🎉 Я передал ваш номер **${phoneNumber}** менеджеру...`,
    phoneDetected: true,
    qwenUsed: false,
    suggestLeadForm: false
  });
  return;  // Прерываем обработку
}

// Qwen вызывается только если телефон НЕ обнаружен
const prompt = buildPrompt(...);
```

#### 2. Уменьшен таймаут Qwen CLI
```typescript
// Было: timeout: 60000 (60 секунд)
// Стало: timeout: 30000 (30 секунд)
const { stdout } = await execAsync(`qwen -y -p "${escapedPrompt}"`, {
  timeout: 30000,  // Уменьшено до 30 секунд
  maxBuffer: 2 * 1024 * 1024,
});
```

#### 3. Флаг отправленного телефона в ChatWidget (app/components/ChatWidget.tsx)
```typescript
// Новое состояние для отслеживания отправленного телефона
const [phoneSubmitted, setPhoneSubmitted] = useState(false);

// Установка флага после успешной отправки
const successMessage: Message = {
  id: `lead-success-${Date.now()}`,
  text: `Отлично! 🎉 Я передал ваш номер **${extractedPhone}** менеджеру...`,
  from: 'assistant',
  timestamp: new Date()
};
setMessages(prev => [...prev, successMessage]);
setPhoneSubmitted(true);  // ✅ Помечаем как отправленный
setIsLoading(false);
return;
```

#### 4. Пропуск проверки телефона если уже отправлен
```typescript
// Если телефон уже отправлен, не проверять повторно
if (phoneSubmitted && (wantsContact || phoneInMessage)) {
  // User already submitted phone, just continue conversation
  // Don't ask for phone again, just send to AI
} else if (wantsContact || phoneInMessage) {
  // Обычная логика обработки телефона
}
```

#### 5. Сброс флага при очистке истории
```typescript
const clearChatHistory = () => {
  sessionStorage.removeItem(STORAGE_KEY);
  // ...
  setPhoneSubmitted(false);  // Сброс флага
  // ...
};
```

### Результат
✅ После отправки телефона:
- Бот **мгновенно** отвечает (без задержки на Qwen)
- Последующие сообщения обрабатываются корректно
- Телефон не запрашивается повторно
- Qwen вызывается только для обычных сообщений
- Таймаут уменьшен с 60с до 30с

### Изменённые файлы
| Файл | Изменения |
|------|-----------|
| `ai-assistant/server.js` | Немедленный ответ при phoneDetected, таймаут 30с |
| `app/components/ChatWidget.tsx` | Состояние `phoneSubmitted`, пропуск проверки |

---

## ✅ Улучшение: Мобильная адаптация чата (2026-03-16)

### Проблема
На мобильных устройствах чат имел большой отступ сверху и не открывался на весь экран.

### Решение
Использованы произвольные значения Tailwind вместо инлайн-стилей:

```css
/* ❌ БЫЛО (инлайн стили в <style>) */
@media (max-width: 640px) {
  .chat-widget-window {
    bottom: 5rem !important;
    max-height: calc(100vh - 13rem) !important;
  }
}

/* ✅ СТАЛО (Tailwind классы) */
className={`
  fixed z-50 overflow-hidden flex flex-col
  bottom-6 right-6 w-96 max-h-[600px] rounded-2xl
  max-sm:bottom-[4.5rem] max-sm:left-[0.25rem] max-sm:right-[0.25rem]
  max-sm:w-[calc(100%-0.5rem)] max-sm:max-h-[calc(100vh-5rem)] max-sm:rounded-2xl
`}
```

### Результат
✅ На мобильных устройствах:
- Чат открывается **на весь экран** с небольшими отступами
- Отступы по бокам: `0.25rem` (px-1)
- Скругление углов: `1rem`
- Высота: `calc(100vh - 5rem)` (учитывает нижний таб)

---

**Дата добавления:** 2026-03-16
**Статус:** ✅ Исправлено и улучшено
**Приоритет:** Критичный

---

## ✅ Исправлено: Валидация формы обратного звонка (2026-03-19)

### Описание проблемы
Форма "Заказать звонок" в модальном окне не отправлялась без заполнения поля "Сообщение", хотя оно должно быть необязательным.

**Ошибка в консоли:**
```
Callback submit error: Error: Сообщение или тип объекта обязательны для заполнения
```

### Корневая причина
В трёх файлах (`api-server.js`, `server.js`, `app/routes/api/telegram-webhook.tsx`) была валидация, требующая `message` или `objectType`:

```javascript
// ❌ БЫЛО (неправильно)
if (!message && !objectType) {
  return res.status(400).json({
    success: false,
    error: 'Сообщение или тип объекта обязательны для заполнения'
  });
}
```

### Решение
Удалена обязательность сообщения, оставлено только имя:

```javascript
// ✅ СТАЛО (правравильно)
// Validate required fields - only name is required
if (!name) {
  return res.status(400).json({
    success: false,
    error: 'Имя обязательно для заполнения'
  });
}
```

### Изменённые файлы
| Файл | Изменения |
|------|-----------|
| `api-server.js` | Удалена валидация message/objectType |
| `server.js` | Удалена валидация message/objectType |
| `app/routes/api/telegram-webhook.tsx` | Обновлён комментарий о валидации |

### Результат
✅ Форма обратного звонка:
- Отправляется с заполненными **Имя** + **Телефон**
- Поле "Сообщение" необязательно
- Заявка успешно отправляется в Telegram

---

**Дата добавления:** 2026-03-19
**Статус:** ✅ Исправлено
**Приоритет:** Высокий

---

## ✅ Исправлено: Цвет текста в модальных окнах на светлой теме (2026-03-19)

### Описание проблемы
В модальных окнах (CallbackModal, ServiceOrderModal, ProjectEstimateModal) на светлой теме текст был плохо виден — использовался `text-gray-900` вместо чёрного.

### Решение
Заменены все классы цвета текста для светлой темы:

| Элемент | Было | Стало |
|---------|------|-------|
| Заголовки | `text-gray-900` | `text-black` |
| Labels полей | `text-gray-700` | `text-black` |
| Текст в input/textarea | `text-gray-900` | `text-black` |
| Placeholder'ы | `placeholder-gray-400` | `placeholder-gray-500` |
| Текст в капче | `text-gray-900` | `text-black` |
| Описание успеха | `text-gray-600` | `text-gray-700` |

### Изменённые файлы
| Файл | Изменения |
|------|-----------|
| `app/components/CallbackModal.tsx` | Все текстовые элементы |
| `app/components/ServiceOrderModal.tsx` | Заголовки, labels, input, капча |
| `app/components/ProjectEstimateModal.tsx` | Заголовки, labels, input, select, капча |

### Результат
✅ На светлой теме:
- Заголовки **чётко видны** (чёрный цвет)
- Labels полей контрастные
- Текст в полях ввода читаемый
- Placeholder'ы чуть светлее для визуальной иерархии

---

**Дата добавления:** 2026-03-19
**Статус:** ✅ Исправлено
**Приоритет:** Высокий

---

## ✅ Обновлены бейджи в Hero секциях (2026-03-19)

### Описание проблемы
Бейджи в Hero секциях на светлой теме были плохо видны — использовался `bg-blue-100` (бледный фон) и `text-blue-600` (тёмно-синий текст), что выглядело грязно.

### Страницы с бейджами:
1. **О компании** — "С 2012 года на рынке"
2. **Портфолио** — "100+ успешно завершенных проектов"
3. **Контакты** — "Свяжитесь с нами"
4. **Вакансии** — "Присоединяйтесь к нашей команде"
5. **Защита от БПЛА** — "Особенности системы"

### Решение
Сделаны красивые контрастные бейджи с явным разделением тем:

```tsx
// ✅ СТАЛО (правильно)
className={`inline-flex items-center gap-2 rounded-full px-4 py-2 ${
  theme === 'dark'
    ? 'bg-blue-900/30 text-blue-400 border border-blue-800/50'
    : 'bg-blue-50 text-blue-700 border border-blue-200'
}`}
```

| Тема | Фон | Текст | Граница |
|------|-----|-------|---------|
| **Тёмная** | `bg-blue-900/30` (полупрозрачный тёмный) | `text-blue-400` (яркий голубой) | `border-blue-800/50` |
| **Светлая** | `bg-blue-50` (светлый голубой) | `text-blue-700` (насыщенный синий) | `border-blue-200` |

### Изменённые файлы
| Файл | Изменения |
|------|-----------|
| `app/components/CompanyShowcase.tsx` | Бейдж "С 2012 года на рынке" |
| `app/components/PortfolioGallery.tsx` | Бейдж "100+ успешно завершенных проектов" |
| `app/components/ContactsPage.tsx` | Бейдж "Свяжитесь с нами" |
| `app/components/VacanciesGallery.tsx` | Бейдж "Присоединяйтесь к нашей команде" |
| `app/components/DroneDefensePage.tsx` | Бейдж "Особенности системы" |

### Результат
✅ На светлой теме:
- Бейджи **чётко видны** на белом фоне
- Насыщенный синий текст хорошо читается
- Тонкая рамка добавляет контраст

✅ На тёмной теме:
- Полупрозрачный фон с ярким голубым текстом
- Светящийся эффект в темноте

---

**Дата добавления:** 2026-03-19
**Статус:** ✅ Исправлено
**Приоритет:** Высокий

---

## ✅ Обновлён блок "Нормативные требования" (2026-03-19)

### Описание изменений
Блок "Нормативные требования" на странице "Защита от БПЛА" переработан для лучшей читаемости и визуального разделения информации.

### Новая структура

#### 1. **Красный блок** — Нормативные требования
- Иконка AlertTriangle в цветном квадрате
- Заголовок: "Нормативные требования"
- Подзаголовок: "Согласно Постановлению Правительства РФ от 05.05.2012 № 460 (в ред. от 2023 г.)"
- Вложенный блок: "Обязанности руководителей" с описанием
- Кнопка: "Получить консультацию"

#### 2. **Оранжевый блок** — Последствия несоответствия
- Иконка Target
- Заголовок: "Последствия несоответствия"
- Два пункта с цифрами в кружочках:
  1. Административные штрафы и приостановку деятельности
  2. Персональную ответственность руководителей

#### 3. **Сетка карточек** — Нормативные документы (2x2)
Каждая карточка имеет:
- **Цветную полоску слева** (разные градиенты)
- **Номер в цветном квадратике** (01, 02, 03, 04)
- **Название документа** (ПП РФ, ФЗ, СП)
- **Дату/статус**
- **Описание**

**Карточки:**
| Номер | Цвет | Документ | Описание |
|-------|------|----------|----------|
| **01** | Синий | ПП РФ №1046 | Защита объектов ТЭК от дронов |
| **02** | Фиолетовый | ПП РФ №258 | Безопасность предприятий от БПЛА |
| **03** | Оранжевый | ФЗ №390-ФЗ | Безопасность стратегических объектов |
| **04** | Зелёный | СП 542.1325800 | Проектирование защитных конструкций |

### Изменённые файлы
| Файл | Изменения |
|------|-----------|
| `app/components/DroneDefensePage.tsx` | Полная переработка блока нормативных требований |

### Результат
✅ Блок разделён на логические секции:
- Красный блок привлекает внимание к нормативке
- Оранжевый блок показывает последствия
- Карточки документов легко сканировать взглядом

✅ Анимации:
- Плавное появление при скролле
- Hover-эффекты на карточках (подъём + масштаб)

---

**Дата добавления:** 2026-03-19
**Статус:** ✅ Реализовано
**Приоритет:** Высокий

---

## ✅ Исправлено: Скроллбар в чате на светлой теме (2026-03-19)

### Описание проблемы
В чате на светлой теме полоса прокрутки была чёрной, а индикатор серым — выглядело грязно.

### Решение
Добавлены стили для скроллбара в `app/app.css`:

```css
/* Chat widget scrollbar - light track for light theme */
.chat-widget-messages::-webkit-scrollbar {
  width: 8px;
}

.chat-widget-messages::-webkit-scrollbar-track {
  @apply bg-white dark:bg-gray-800 rounded-full;
}

.chat-widget-messages::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-600 rounded-full border-2 border-white dark:border-gray-800;
}

.chat-widget-messages::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400 dark:bg-gray-500;
}
```

| Элемент | Светлая тема | Тёмная тема |
|---------|--------------|-------------|
| **Трека (фон)** | `bg-white` | `bg-gray-800` |
| **Индикатор (thumb)** | `bg-gray-300` | `bg-gray-600` |
| **При наведении** | `bg-gray-400` | `bg-gray-500` |
| **Рамка** | `border-white` | `border-gray-800` |

### Изменённые файлы
| Файл | Изменения |
|------|-----------|
| `app/app.css` | Добавлены стили для `.chat-widget-messages::-webkit-scrollbar` |
| `app/components/ChatWidget.tsx` | Фон контейнера изменён на `bg-white` для светлой темы |

### Результат
✅ На светлой теме:
- Полоса прокрутки **белая** (незаметная)
- Индикатор светло-серый (`bg-gray-300`)
- При наведении темнеет (`bg-gray-400`)

✅ На тёмной теме:
- Полоса прокрутки тёмная (`bg-gray-800`)
- Индикатор серый (`bg-gray-600`)

---

**Дата добавления:** 2026-03-19
**Статус:** ✅ Исправлено
**Приоритет:** Средний

---

## ✅ Обновлён хедер чата на светлой теме (2026-03-19)

### Описание проблемы
В ChatWidget на светлой теме хедер чата был с белым текстом на светлом фоне — заголовки и кнопки были не видны.

### Решение
Обновлены все цвета в хедере чата для светлой темы:

| Элемент | Было | Стало |
|---------|------|-------|
| **Заголовок "ИИ Ассистент"** | `text-white` | `text-black` |
| **Подзаголовок** | `text-white/60` | `text-gray-600` |
| **Текст "Печатает"** | `text-white/70` | `text-gray-700` |
| **Кнопки (иконки)** | `text-white/60` | `text-gray-500` |
| **Кнопки hover** | `hover:bg-white/10` | `hover:bg-gray-200` |
| **Иконка Sparkles** | `text-yellow-300/80` | `text-yellow-600` |
| **Фон хедера** | `from-white/5 to-white/10` | `from-gray-50 to-gray-100` |
| **Аватар (рамка)** | `border-white/20` | `border-gray-300` |

### Изменённые файлы
| Файл | Изменения |
|------|-----------|
| `app/components/ChatWidget.tsx` | Полный редизайн хедера для светлой темы |

### Результат
✅ На светлой теме:
- Заголовок **чётко виден** (чёрный текст)
- Подзаголовок читаемый (серый текст)
- Кнопки с иконками видны (серые иконки)
- Фон хедера светло-серый (контраст с белым фоном чата)

✅ На тёмной теме:
- Все цвета остались без изменений (белый текст)

---

**Дата добавления:** 2026-03-19
**Статус:** ✅ Исправлено
**Приоритет:** Высокий

---

## ✅ Обновлён блок PDF вложения в чате (2026-03-19)

### Описание проблемы
Блок с PDF файлом ("Прайс-лист ЛЕГИОН.pdf") на светлой теме был на синем фоне (`bg-blue-600/20`), что выглядело неуместно.

### Решение
Сделан тёмный фон для PDF вложения на обеих темах:

```tsx
// ✅ СТАЛО (правильно)
<div className={`mb-3 p-3 rounded-xl border ${
  theme === 'dark'
    ? 'bg-blue-900/30 border-blue-700/50'
    : 'bg-gray-900 border-gray-700'
}`}>
```

| Элемент | Светлая тема | Тёмная тема |
|---------|--------------|-------------|
| **Фон** | `bg-gray-900` (тёмный) | `bg-blue-900/30` (полупрозрачный синий) |
| **Граница** | `border-gray-700` | `border-blue-700/50` |
| **Название файла** | `text-white` | `text-white` |
| **Подпись** | `text-gray-400` | `text-blue-200` |
| **Иконка Download** | `text-gray-400` | `text-blue-300` |

### Изменённые файлы
| Файл | Изменения |
|------|-----------|
| `app/components/ChatWidget.tsx` | Стили для блока с PDF вложением |

### Результат
✅ На светлой теме:
- PDF блок **тёмный** (контраст с белым фоном чата)
- Белый текст хорошо читается
- Выглядит современно и профессионально

✅ На тёмной теме:
- Полупрозрачный синий фон
- Светло-голубой текст

---

**Дата добавления:** 2026-03-19
**Статус:** ✅ Исправлено
**Приоритет:** Средний

---

## ✅ Интеграция вакансий в AI-помощника (2026-03-19)

### Задача
Добавить возможность боту рассказывать о вакансиях компании и принимать отклики от соискателей.

### Реализованный функционал

#### 1. **База знаний по вакансиям** (`ai-assistant/knowledge-base/vacancies.json`)
Создан JSON файл с данными:
- 5 вакансий (Электрогазосварщик, Отделочник, Слесарь-монтажник, Подсобный рабочий, Специалист по пожарной безопасности)
- Требования для каждой вакансии
- Условия работы (единые для всех)
- Контакт отдела кадров: `+7 921 591-65-06`
- Общие преимущества компании

#### 2. **Руководство для бота** (`ai-assistant/knowledge-base/VACANCIES_GUIDE.md`)
Создана подробная документация:
- Описание всех вакансий
- Примеры ответов на вопросы о вакансиях
- Правила общения при отклике
- Примеры диалогов (общий вопрос, конкретная вакансия, отклик)

#### 3. **Обновление server.js** (AI сервер бота)
- Загрузка базы знаний по вакансиям при старте
- Функция `getVacanciesContext()` для получения контекста
- Обновлённый промпт с инструкциями по вакансиям:
  - Распознавание вопросов о вакансиях
  - Перечисление доступных вакансий
  - Рассказ про преимущества
  - Призыв к отклику
- Функция `sendLeadToTelegram()` поддерживает заявки на вакансии:
  - Разные сообщения для услуг и вакансий
  - Поля: vacancyPosition, experience

#### 4. **Обновление ChatWidget.tsx**
- Автоматическое определение отклика на вакансию:
  - По пути `/vacancies`
  - По ключевым словам в сообщении ("ваканс", "отклик")
- Разные сообщения успеха для вакансий и услуг
- Отправка в Telegram с пометкой типа заявки (`formType: vacancy_application`)
- Разные контакты для связи (отдел кадров для вакансий)

### Примеры ответов бота

#### Вопрос о вакансиях:
```
Да, у нас есть открытые вакансии! 🎯

Сейчас мы ищем:
• Электрогазосварщик (опыт от 2 лет)
• Отделочник
• Слесарь-монтажник
• Подсобный рабочий
• Специалист по монтажу пожарной безопасности

Все вакансии с официальным оформлением по ТК РФ, пятидневка, корпоративная связь и обучение.

Хотите узнать подробнее о какой-то вакансии или откликнуться? 📞

Отдел кадров: +7 921 591-65-06
```

#### Отклик на вакансию:
```
Отлично! 😊

Для отклика напишите:
• Ваше имя
• Телефон
• Ваш опыт работы по специальности

Или позвоните в отдел кадров: +7 921 591-65-06

Я передам вашу заявку руководству, и они свяжутся с вами для собеседования!
```

### В Telegram придёт:
```
💼 Отклик на вакансию!

👤 Имя соискателя: Иван
📞 Телефон: +79991234567
💼 Вакансия: Электрогазосварщик
📋 Опыт работы: 5 лет
💬 Сообщение: Хочу работать
```

### Изменённые файлы
| Файл | Изменения |
|------|-----------|
| `ai-assistant/knowledge-base/vacancies.json` | ✨ Создан |
| `ai-assistant/knowledge-base/VACANCIES_GUIDE.md` | ✨ Создан |
| `ai-assistant/server.js` | Загрузка вакансий, getVacanciesContext(), обновлённый промпт |
| `app/components/ChatWidget.tsx` | Определение вакансий, разные сообщения |

### Результат
✅ Бот теперь:
- Знает все вакансии компании
- Может рассказать о требованиях и условиях
- Принимает отклики и отправляет в Telegram
- Различает заявки на услуги и вакансии
- Даёт правильные контакты (отдел кадров для вакансий)

---

**Дата добавления:** 2026-03-19
**Статус:** ✅ Реализовано
**Приоритет:** Высокий
**Влияние:** Улучшена работа с соискателями, автоматизация первичного отбора

---

## 🔊 Реализация звукового оповещения о новых сообщениях (2026-03-16)

### Задача
Добавить звуковое оповещение при получении новых сообщений от ассистента в чате.

### Реализация

#### 1. Добавлен аудио-реф
```typescript
const audioRef = useRef<HTMLAudioElement | null>(null);
const prevMessagesLengthRef = useRef<number>(0);
```

#### 2. useEffect для воспроизведения звука
```typescript
useEffect(() => {
  if (messages.length === 0) return;
  if (isOpen) return; // Don't play sound when chat is open

  const lastMessage = messages[messages.length - 1];
  const prevLength = prevMessagesLengthRef.current;
  
  // Play sound ONLY if:
  // 1. Last message is from assistant
  // 2. Messages array grew (new message arrived, not loaded from history)
  // 3. Chat is closed (unread badge will appear)
  if (lastMessage.from === 'assistant' && messages.length > prevLength) {
    if (!audioRef.current) {
      audioRef.current = new Audio('/message.mp3');
      audioRef.current.preload = 'auto';
    }
    
    const playSound = async () => {
      try {
        audioRef.current.currentTime = 0;
        await audioRef.current.play();
      } catch (err) {
        console.log('Sound notification blocked:', err);
      }
    };
    
    setTimeout(playSound, 100);
  }
  
  prevMessagesLengthRef.current = messages.length;
}, [messages]);
```

#### 3. Файл звукового уведомления
- Путь: `public/message.mp3`
- Подключается через `new Audio('/message.mp3')`

---

## ⚠️ Известная проблема: Звук при возврате на главную (2026-03-16)

### Описание проблемы
При возврате на главную страницу со страницы услуги воспроизводится звук уведомления, хотя новых сообщений нет.

### Сценарий воспроизведения
1. Зайти на главную страницу → чат открывается с приветствием, звук играет ✅
2. Прочитать сообщение, перейти на страницу услуги ✅
3. Вернуться на главную → **звук играет снова, но новых сообщений нет** ❌

### Предполагаемая причина
`prevMessagesLengthRef.current` сбрасывается в 0 при ре-рендере компонента на главной странице, из-за чего условие `messages.length > prevLength` становится истинным даже для старых сообщений.

### Возможные решения (требуют проверки)

#### Вариант 1: Использование sessionStorage для хранения предыдущей длины
```typescript
const getLastMessagesLength = () => {
  return parseInt(sessionStorage.getItem('legion_chat_prev_messages_length') || '0', 10);
};

const setLastMessagesLength = (length: number) => {
  sessionStorage.setItem('legion_chat_prev_messages_length', length.toString());
};

useEffect(() => {
  const prevLength = getLastMessagesLength();
  
  if (lastMessage.from === 'assistant' && messages.length > prevLength) {
    // Play sound
  }
  
  setLastMessagesLength(messages.length);
}, [messages]);
```

#### Вариант 2: Отслеживание ID последнего прочитанного сообщения
```typescript
const [lastPlayedMessageId, setLastPlayedMessageId] = useState<string | null>(null);

useEffect(() => {
  if (isOpen) return;
  
  const lastMessage = messages[messages.length - 1];
  
  if (lastMessage.from === 'assistant' && lastMessage.id !== lastPlayedMessageId) {
    // Play sound
    setLastPlayedMessageId(lastMessage.id);
  }
}, [messages, isOpen, lastPlayedMessageId]);
```

#### Вариант 3: Проверка timestamp сообщения (только для новых сообщений)
```typescript
useEffect(() => {
  if (isOpen) return;
  
  const lastMessage = messages[messages.length - 1];
  const messageAge = Date.now() - lastMessage.timestamp.getTime();
  
  // Play sound only for messages received in last 2 seconds
  if (lastMessage.from === 'assistant' && messageAge < 2000) {
    // Play sound
  }
}, [messages, isOpen]);
```

---

**Дата добавления:** 2026-03-16
**Статус:** ⚠️ Требуется исправление
**Приоритет:** Средний
**Влияние:** Ложные срабатывания звука при навигации между страницами

---

## ✅ Реализовано: Распознавание негатива и отказ от общения (2026-03-16)

### Задача
Если клиент явно даёт понять, что не хочет общаться, бот должен:
1. Коротко подтвердить и извиниться
2. Не отправлять запросы в AI
3. Не показывать формы заявки
4. Не задавать вопросы
5. Игнорировать последующие сообщения (пока пользователь не передумает)

### Реализация

#### 1. Добавлено состояние `userWantsNoContact`
```typescript
const [userWantsNoContact, setUserWantsNoContact] = useState(false);
```

#### 2. Массив фраз отказа от общения (200+ фраз)
```typescript
const noContactPhrases = [
  // Прямые отказы от общения
  'отстань', 'отвянь', 'не пиши', 'не звони', 'не беспокой',
  'хватит писать', 'прекрати писать', 'заткнись', 'замолчи',
  'не хочу общаться', 'не желаю говорить', 'общение завершено',
  'достал', 'задолбал', 'надоел', 'тупой бот', 'бесполезный бот',
  'не рекомендую', 'буду жаловаться', 'в суд', 'обходите стороной',
  // ... и многие другие (включая ненормативную лексику)
];
```

#### 3. Массив фраз для возобновления общения
```typescript
const resumeContactPhrases = [
  'передумал', 'передумала', 'хочу продолжить', 'хочу общаться',
  'продолжи', 'возобнови', 'вернись', 'ты ещё тут', 'есть кто',
  'помогите', 'нужна помощь', 'ответь', 'расскажи', 'подскажи',
  'сколько стоит', 'хочу заказать', 'хочу купить', 'нужна услуга',
  'менеджер', 'перезвоните', 'форма', 'заявка', 'оставить заявку',
  // ... и другие рабочие фразы
];
```

#### 4. Логика обработки в `sendMessage`
```typescript
const userMessageLower = userMessage.text.toLowerCase();

// 1. Сначала проверяем желание возобновить общение
const wantsToResume = resumeContactPhrases.some(phrase => userMessageLower.includes(phrase));

if (userWantsNoContact && wantsToResume) {
  setUserWantsNoContact(false);
  // Продолжаем обычную обработку
}

// 2. Проверяем отказ от общения
const wantsNoContact = noContactPhrases.some(phrase => userMessageLower.includes(phrase));

if (wantsNoContact && !userWantsNoContact) {
  setUserWantsNoContact(true);
  
  // Короткое подтверждение без эмодзи и предложений
  const ackMessage: Message = {
    id: `no-contact-ack-${Date.now()}`,
    text: `Понял. Больше не буду беспокоить.`,
    from: 'assistant',
    timestamp: new Date()
  };
  setMessages(prev => [...prev, ackMessage]);
  setIsLoading(false);
  return; // Не отправляем в AI, не показываем формы, не задаем вопросы
}

// 3. Если уже отказался - игнорируем
if (userWantsNoContact) {
  setIsLoading(false);
  return; // Просто игнорируем, не отвечаем вообще
}

// 4. Обычная обработка...
```

#### 5. Сброс флага при очистке истории
```typescript
const clearChatHistory = () => {
  // ...
  setUserWantsNoContact(false); // Reset user no-contact flag
  // ...
};
```

### Сценарии использования

| Сценарий | Поведение бота |
|----------|---------------|
| "отстань", "заткнись" | "Понял. Больше не буду беспокоить." + игнорирование |
| "тупой бот", "бесполезно" | "Понял. Больше не буду беспокоить." + игнорирование |
| "буду жаловаться", "в суд" | "Понял. Больше не буду беспокоить." + игнорирование |
| "передумал", "хочу продолжить" | Сброс флага + обычная обработка |
| "сколько стоит", "хочу заказать" | Сброс флага + обычная обработка |
| После "отстань" → "сколько стоит" | Игнорирование (нужно "передумал" или явный запрос) |

### Особенности реализации

1. **Без эмодзи в ответе** — при отказе ответ максимально сухой
2. **Без предложений** — не предлагаем форму, помощь, вопросы
3. **Не отправляется в AI** — экономия ресурсов, мгновенный ответ
4. **Игнорирование последующих** — все сообщения игнорируются
5. **Возможность возобновления** — пользователь может "передумать"
6. **Сброс при очистке** — при `clearChatHistory` флаг сбрасывается

### Фразы-триггеры (категории)

| Категория | Примеры |
|-----------|---------|
| Прямые отказы | "отстань", "не пиши", "оставь меня" |
| Прекращение | "хватит писать", "прекрати", "всё" |
| Грубые | "заткнись", "достал", "нахуй" |
| Негатив о боте | "тупой бот", "бесполезный", "некомпетентный" |
| Эмоции | "разочарован", "в ярости", "ненавижу" |
| Угрозы | "буду жаловаться", "в суд", "разнесу в соцсетях" |
| Отказ от возврата | "больше не вернусь", "никогда не приду" |

---

**Дата добавления:** 2026-03-16
**Статус:** ✅ Реализовано
**Приоритет:** Высокий
**Влияние:** Улучшение UX для негативных сценариев общения

---

## ✅ Реализовано: Непрерывность ответа при переходе между страницами (2026-03-16)

### Задача
Сохранять состояние "бот печатает" при переходе пользователя между страницами сайта. Если пользователь задал вопрос и перешёл на другую страницу до получения ответа, бот должен:
1. Продолжить показывать индикатор "печатает"
2. Сохранить бейдж на кнопке чата
3. Отправить запрос в AI только один раз
4. Показать ответ на любой странице

### Реализация

#### 1. Добавлены состояния и ref
```typescript
const [isBotTyping, setIsBotTyping] = useState(false); // Track if bot is typing (for badge when chat closed)
const processedRequestId = useRef<string | null>(null); // Track processed request ID
```

#### 2. Ключи sessionStorage для pending request
```typescript
// Сохраняются при отправке сообщения:
sessionStorage.setItem('legion_chat_pending_request', requestId);
sessionStorage.setItem('legion_chat_loading', 'true');
sessionStorage.setItem('legion_chat_bot_typing', 'true');
sessionStorage.setItem('legion_chat_pending_message', userMessage.text);
sessionStorage.setItem('legion_chat_pending_service', serviceSlug || '');
```

#### 3. Отправка запроса с пометкой pending
```typescript
const sendMessage = async (skipQuestionCount = false) => {
  if (!inputValue.trim() || isLoading) return;

  // Check if there's a pending request from another page
  const pendingRequestId = sessionStorage.getItem('legion_chat_pending_request');
  if (pendingRequestId) {
    console.log('[CHAT] Request still pending, waiting...');
    return;
  }

  const userMessage: Message = {
    id: `msg_${Date.now()}`,
    text: inputValue.trim(),
    from: 'user',
    timestamp: new Date()
  };

  const newMessages = [...messages, userMessage];
  setMessages(newMessages);
  setInputValue('');
  setIsLoading(true);
  setIsBotTyping(true);
  
  // Save pending request ID immediately
  const requestId = `req_${Date.now()}`;
  sessionStorage.setItem('legion_chat_pending_request', requestId);
  sessionStorage.setItem('legion_chat_loading', 'true');
  sessionStorage.setItem('legion_chat_bot_typing', 'true');
  sessionStorage.setItem('legion_chat_pending_message', userMessage.text);
  sessionStorage.setItem('legion_chat_pending_service', serviceSlug || '');
  
  // Mark this request as being processed
  processedRequestId.current = requestId;
  
  // ... отправка в AI
};
```

#### 4. Восстановление pending request при инициализации
```typescript
// Generate session ID on mount and reset state
useEffect(() => {
  const savedHistory = sessionStorage.getItem(STORAGE_KEY);
  const pendingRequest = sessionStorage.getItem('legion_chat_pending_request');
  const savedBotTyping = sessionStorage.getItem('legion_chat_bot_typing');

  setSessionId(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  
  // Restore isBotTyping immediately if there's a pending request
  if (pendingRequest) {
    setIsBotTyping(true);
    sessionStorage.setItem('legion_chat_bot_typing', 'true');
    console.log('[CHAT] Restored isBotTyping on mount from pending request');
  }
  
  // ... остальная логика
}, []);
```

#### 5. Восстановление и retry после загрузки истории
```typescript
// Restore pending request state AFTER history is loaded
useEffect(() => {
  const savedHistory = sessionStorage.getItem(STORAGE_KEY);
  const pendingRequest = sessionStorage.getItem('legion_chat_pending_request');
  const pendingMessage = sessionStorage.getItem('legion_chat_pending_message');
  const pendingService = sessionStorage.getItem('legion_chat_pending_service');
  const savedBotTyping = sessionStorage.getItem('legion_chat_bot_typing');

  console.log('[CHAT] Restore check:', { 
    pendingRequest, 
    pendingMessage, 
    messagesLength: messages.length,
    savedBotTyping,
    isBotTyping
  });

  // Skip if already processed this request
  if (pendingRequest === processedRequestId.current) {
    console.log('[CHAT] Already processed, skipping');
    return;
  }

  // Skip if no pending request
  if (!pendingRequest || !pendingMessage) {
    return;
  }

  // Skip if there's already an assistant response
  const lastMessage = messages[messages.length - 1];
  const hasAssistantResponse = lastMessage &&
    lastMessage.from === 'assistant' &&
    lastMessage.id !== 'welcome' &&
    !lastMessage.id.startsWith('service-change-');

  if (hasAssistantResponse) {
    // Response already received, clear pending state
    sessionStorage.removeItem('legion_chat_pending_request');
    sessionStorage.removeItem('legion_chat_pending_message');
    sessionStorage.removeItem('legion_chat_pending_service');
    sessionStorage.removeItem('legion_chat_bot_typing');
    setIsLoading(false);
    setIsBotTyping(false);
    console.log('[CHAT] Response already received, clearing pending state');
    return;
  }

  // Restore isBotTyping and isLoading
  setIsBotTyping(true);
  setIsLoading(true);
  sessionStorage.setItem('legion_chat_bot_typing', 'true');
  console.log('[CHAT] Restored pending request:', pendingRequest, 'isBotTyping set to true');

  // Retry the request if it hasn't been answered yet
  retryPendingRequest(pendingMessage, pendingService, pendingRequest);
}, [messages.length]);
```

#### 6. Функция retryPendingRequest
```typescript
const retryPendingRequest = async (message: string, serviceSlug: string, requestId: string) => {
  // Skip if already processed
  if (processedRequestId.current === requestId) {
    console.log('[CHAT] Request already processed, skipping:', requestId);
    return;
  }
  
  // Mark as being processed
  processedRequestId.current = requestId;
  
  console.log('[CHAT] Retrying pending request:', requestId);
  
  try {
    // Get last 5 messages for context from sessionStorage
    const savedHistory = sessionStorage.getItem(STORAGE_KEY);
    let historyMessages: { role: string; content: string }[] = [];
    
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory);
      historyMessages = parsed
        .filter((m: any) => m.id !== 'welcome' && m.type !== 'lead-form-offer')
        .slice(-5)
        .map((m: any) => ({
          role: m.from === 'user' ? 'КЛИЕНТ' : 'ПОМОЩНИК',
          content: m.text
        }));
    }

    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: message,
        serviceSlug: serviceSlug,
        sessionId: sessionId,
        history: historyMessages,
        suggestLeadForm: !leadFormOffered
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    // Handle response
    if (data.clientWantsNoContact) {
      setUserWantsNoContact(true);
      const ackMessage: Message = {
        id: `no-contact-ai-${Date.now()}`,
        text: data.response,
        from: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, ackMessage]);
    } else {
      let responseText = data.response;
      if (data.phoneDetected) {
        responseText = `✅ **Ваш номер сохранён!** Менеджер перезвонит в течение 15 минут.\n\n${data.response}`;
      }
      const assistantMessage: Message = {
        id: `msg_${Date.now()}`,
        text: responseText,
        from: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    }
    
    // Clear processed request ID
    processedRequestId.current = null;
  } catch (error) {
    console.error('[CHAT] Retry failed:', error);
    // No fallback - let Qwen CLI handle all responses
  } finally {
    setIsLoading(false);
    processedRequestId.current = null;
    sessionStorage.removeItem('legion_chat_pending_request');
    sessionStorage.removeItem('legion_chat_pending_message');
    sessionStorage.removeItem('legion_chat_pending_service');
  }
};
```

#### 7. Очистка pending state
```typescript
const clearChatHistory = () => {
  sessionStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(STORAGE_LAST_READ_KEY);
  sessionStorage.removeItem('legion_chat_autoopen_shown');
  sessionStorage.removeItem('legion_chat_reminder_time');
  sessionStorage.removeItem('legion_chat_no_contact');
  sessionStorage.removeItem('legion_chat_bot_typing');
  sessionStorage.removeItem('legion_chat_loading');
  sessionStorage.removeItem('legion_chat_pending_request');
  sessionStorage.removeItem('legion_chat_pending_message');
  sessionStorage.removeItem('legion_chat_pending_service');
  processedRequestId.current = null;
  setMessages([]);
  // ...
};
```

### Индикаторы "печатает"

#### 1. Бейдж на кнопке чата (когда чат закрыт)
```typescript
{isBotTyping && !isOpen && (
  <div
    className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center shadow-lg animate-pulse"
    title="Бот печатает ответ..."
  >
    <div className="flex gap-0.5">
      <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  </div>
)}
```

#### 2. Индикатор в заголовке чата (когда чат открыт)
```typescript
{isBotTyping ? (
  <>
    <span className="flex gap-0.5">
      <span className="w-1 h-1 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-1 h-1 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-1 h-1 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </span>
    <span>Печатает...</span>
  </>
) : (
  serviceName || 'Онлайн'
)}
```

### Сценарии использования

| Сценарий | Поведение |
|----------|-----------|
| Пользователь задал вопрос → перешёл на услугу | Бейдж "печатает" на кнопке, в заголовке "Печатает..." |
| Пользователь закрыл чат → перешёл на услугу | Бейдж продолжается показываться, запрос сохраняется |
| Ответ пришёл пока пользователь на другой странице | Ответ показывается, бейдж исчезает |
| Пользователь вернулся на главную после ответа | Добавляется контекстное сообщение об услуге |
| Пользователь написал 2 вопроса подряд | Второй вопрос игнорируется пока первый не обработан |

### Особенности реализации

1. **Защита от дублирования** — `processedRequestId` предотвращает повторные вызовы
2. **История из sessionStorage** — `retryPendingRequest` использует историю из sessionStorage
3. **Контекст услуги** — добавляется только после завершения pending request
4. **Welcome сообщение** — не создаётся если есть pending request
5. **Логирование** — все этапы логируются для отладки

### Изменённые файлы

| Файл | Изменения |
|------|-----------|
| `app/components/ChatWidget.tsx` | Добавлены: `isBotTyping` state, `processedRequestId` ref, sessionStorage keys, `retryPendingRequest` функция, индикаторы "печатает" |

---

## ✅ Удалено: Автоматический запрос номера телефона (2026-03-16)

### Описание изменения
Убрана автоматическая логика запроса номера телефона у пользователя. Теперь:
- Бот **не запрашивает** номер телефона автоматически
- При обнаружении номера в сообщении — **тихая отправка** в Telegram (без подтверждения)
- Вся коммуникация через **Qwen CLI** (AI анализирует все сообщения)
- Кнопка "📋 Заполнить заявку" остаётся для явной отправки контактов

### Что удалено

#### 1. Удалён автоматический запрос телефона
```typescript
// ❌ БЫЛО (неправильно)
if (!extractedPhone && wantsContact) {
  const askPhoneMessage: Message = {
    id: `ask-phone-${Date.now()}`,
    text: `Отлично! 🎉 Для связи с менеджером, пожалуйста, укажите ваш номер телефона в формате +7 (XXX) XXX-XX-XX или напишите "мой номер +7..."`,
    from: 'assistant',
    timestamp: new Date()
  };
  setMessages(prev => [...prev, askPhoneMessage]);
  setIsLoading(false);
  return;
}
```

#### 2. Удалено подтверждение отправки телефона
```typescript
// ❌ БЫЛО (неправильно)
const successMessage: Message = {
  id: `lead-success-${Date.now()}`,
  text: `Отлично! 🎉 Я передал ваш номер **${extractedPhone}** менеджеру.\n\nОн свяжется с вами в течение 15 минут для уточнения деталей. Если номер изменится — просто напишите! 📞`,
  from: 'assistant',
  timestamp: new Date()
};
setMessages(prev => [...prev, successMessage]);
```

### Что осталось

#### 1. Тихая отправка телефона в Telegram
```typescript
// ✅ СТАЛО (правильно)
// If phone detected in message, send to Telegram silently
if (phoneInMessage) {
  const extractedPhone = phoneInMessage[0].replace(/\s|-|\(|\)/g, '');
  
  // Send to Telegram silently (no confirmation message)
  try {
    const response = await fetch('/api/telegram-webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: leadFormData.name || 'Клиент из чата',
        phone: extractedPhone,
        message: userMessage.text,
        objectType: serviceSlug || 'chat-lead',
        subject: '📞 Заявка на звонок из чата'
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send lead');
    }

    setPhoneSubmitted(true);
    setWaitingForFormConsent(false);
  } catch (error) {
    console.error('[CHAT] Failed to send lead:', error);
  }
}

// Continue to AI for response - no automatic phone requests
```

#### 2. Удалены неиспользуемые переменные
```typescript
// ❌ БЫЛО
const wantsContact = contactRequestPhrases.some(phrase => userMessage.text.toLowerCase().includes(phrase));
const previousPhoneMessage = messages.find(m => m.from === 'user' && m.text.match(phoneRegex));
const hasPreviousPhone = previousPhoneMessage ? previousPhoneMessage.text.match(phoneRegex)[0].replace(/\s|-|\(|\)/g, '') : '';

// ✅ СТАЛО
const phoneRegex = /(\+7|8)\s*\(?[0-9]{3}\)?\s*[\-]?\s*[0-9]{3}\s*[\-]?\s*[0-9]{2}\s*[\-]?\s*[0-9]{2}/g;
const phoneInMessage = userMessage.text.match(phoneRegex);
```

### Результат

✅ После изменения:
- Бот **не запрашивает** номер телефона автоматически
- При упоминании номера — **тихая отправка** в Telegram
- **Qwen CLI анализирует** все сообщения (включая контекст)
- Кнопка "📋 Заполнить заявку" работает как прежде
- Нет дублирования сообщений об отправке телефона

### Сценарии использования

| Сценарий | Поведение |
|----------|-----------|
| Пользователь пишет "перезвоните +7..." | Номер отправляется в Telegram, AI отвечает на сообщение |
| Пользователь пишет "мой номер +7..." | Номер отправляется в Telegram, AI продолжает диалог |
| Пользователь спрашивает "как заказать" | AI отвечает через Qwen CLI, без запроса телефона |
| Пользователь нажимает "📋 Заполнить заявку" | Открывается форма заявки |

---

**Дата добавления:** 2026-03-16
**Статус:** ✅ Реализовано
**Приоритет:** Высокий
**Влияние:** Улучшение непрерывности UX, удаление навязчивых запросов

---

## ✅ Реализовано: Предложение оставить заявку после 2-3 сообщений (2026-03-16)

### Задача
После 2-3 сообщений от клиента бот должен аккуратно предлагать оставить заявку:
1. Написать заявку прямо в чат (имя + телефон)
2. Или нажать кнопку "📋 Заполнить заявку" внизу чата

### Реализация

#### 1. Подсчёт сообщений пользователя в ChatWidget.tsx
```typescript
// Count user messages to determine if we should suggest lead form
// Count ONLY real user messages in newMessages (including current one)
const userMessagesCount = newMessages.filter(m => m.from === 'user').length;
const shouldSuggestForm = userMessagesCount >= 2 && !leadFormOffered;

console.log('[CHAT] Lead form suggestion check:', { 
  userMessagesCount, 
  shouldSuggestForm, 
  leadFormOffered,
  newMessagesLength: newMessages.length 
});

const response = await fetch(`${API_URL}/chat`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: userMessage.text,
    serviceSlug: serviceSlug,
    sessionId: sessionId,
    history: historyMessages,
    suggestLeadForm: shouldSuggestForm  // ← Флаг для AI
  }),
});
```

#### 2. Сохранение флага `leadFormOffered` в sessionStorage
```typescript
// Инициализация из sessionStorage
const [leadFormOffered, setLeadFormOffered] = useState(false);

useEffect(() => {
  const wasLeadFormOffered = sessionStorage.getItem('legion_chat_lead_form_offered') === 'true';
  if (wasLeadFormOffered) {
    setLeadFormOffered(true);
  }
}, []);

// Сохранение после предложения
if (data.suggestLeadForm && !leadFormOffered) {
  setLeadFormOffered(true);
  sessionStorage.setItem('legion_chat_lead_form_offered', 'true');
  console.log('[CHAT] AI suggested lead form, button will be shown');
}
```

#### 3. Обновлённый промпт в ai-assistant/server.js
```javascript
const leadFormSuggestion = suggestLeadForm
  ? `\n❗ КЛИЕНТ ЗАИНТЕРЕСОВАН! Обязательно добавь в конце ответа: "Хотите, чтобы я сформировал и отправил вашу заявку руководству? Просто напишите мне тут свою заявку и контактные данные (имя и телефон) — я всё подготовлю и отправлю. Или нажмите кнопку '📋 Заполнить заявку' внизу чата."`
  : '';

return `Ты — дружелюбный консультант строительной компании ООО «ЛЕГИОН»...

[ПРАВИЛА ОБЩЕНИЯ]
✓ Распознавай намерение клиента:
  • Приветствие → ответь вежливо, предложи помощь
  • Вопрос о цене → назови цену + предложи бесплатный замер
  • Вопрос об услуге → кратко опиши суть + преимущества
  • Показать список услуг → перечисли услуги БЕЗ предложения заявки
  • Хочу заказать → поблагодари + дай контакты + призови к действию
  • Прощание → поблагодари, пригласи обращаться снова
✓ ВАЖНО: После 2-3 сообщений от клиента — в конце ответа предложи оставить заявку 
  ТОЛЬКО если клиент спрашивает про цену, расчет стоимости или хочет заказать. 
  НЕ предлагай если клиент просто смотрит список услуг или спрашивает общую информацию: 
  "Хотите, чтобы я сформировал и отправил вашу заявку руководству? Просто напишите мне 
  тут свою заявку и контактные данные (имя и телефон) — я всё подготовлю и отправлю. 
  Или нажмите кнопку '📋 Заполнить заявку' внизу чата."${leadFormSuggestion}
...`;
```

#### 4. Автоматическая отправка заявки при обнаружении телефона
```typescript
// Если телефон найден в сообщении — отправляем заявку в Telegram
const phoneRegex = /(\+7|8)\s*\(?[0-9]{3}\)?\s*[\-]?\s*[0-9]{3}\s*[\-]?\s*[0-9]{2}\s*[\-]?\s*[0-9]{2}/g;
const phoneInMessage = userMessage.text.match(phoneRegex);

if (phoneInMessage) {
  const extractedPhone = phoneInMessage[0].replace(/\s|-|\(|\)/g, '');
  
  // Показываем спинер
  setIsSubmittingChatLead(true);

  try {
    const response = await fetch('/api/telegram-webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: leadFormData.name || 'Клиент из чата',
        phone: extractedPhone,
        message: userMessage.text,
        objectType: serviceSlug || 'chat-lead',
        subject: '📞 Заявка на звонок из чата'
      }),
    });

    if (!response.ok) throw new Error('Failed to send lead');
    setPhoneSubmitted(true);
  } catch (error) {
    console.error('[CHAT] Failed to send lead:', error);
  } finally {
    setIsSubmittingChatLead(false);
  }
}
```

#### 5. Спинер отправки заявки из чата
```typescript
// Новое состояние
const [isSubmittingChatLead, setIsSubmittingChatLead] = useState(false);

// Оверлей спинера в UI
{isSubmittingChatLead && (
  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 rounded-b-xl">
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-2">
        <div className="w-4 h-4 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-4 h-4 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-4 h-4 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <p className="text-white text-sm font-medium">Отправляю вашу заявку...</p>
    </div>
  </div>
)}
```

### Результат

✅ После 2 сообщений от клиента:
- Бот предлагает оставить заявку **только если** клиент спрашивает про цену/заказ
- **НЕ предлагает** если клиент просто смотрит список услуг
- Клиент может написать заявку прямо в чат (имя + телефон)
- Или нажать кнопку "📋 Заполнить заявку" внизу
- При отправке телефона показывается спинер
- Заявка отправляется в Telegram автоматически

### Сценарии использования

| Сценарий | Поведение бота |
|----------|---------------|
| 1-е сообщение "что продаете?" | Список услуг БЕЗ предложения заявки |
| 2-е сообщение "сколько стоит?" | Цена + предложение оставить заявку ✅ |
| 2-е сообщение "покажи список" | Список услуг БЕЗ предложения заявки |
| Клиент пишет "+7..." в чат | Спинер → отправка в Telegram ✅ |
| Клиент нажимает "📋 Заполнить заявку" | Открывается форма заявки |

---

**Дата добавления:** 2026-03-16
**Статус:** ✅ Реализовано
**Приоритет:** Высокий
**Влияние:** Увеличение конверсии заявок, улучшение UX

---

## ✅ Реализовано: Восстановление pending request при монтировании (2026-03-16)

### Проблема
При переходе между страницами во время ответа бота запрос не восстанавливался — бот "зависал" и не отвечал.

### Решение
Добавлен вызов `retryPendingRequest()` при монтировании компонента если есть pending request:

```typescript
useEffect(() => {
  const pendingRequest = sessionStorage.getItem('legion_chat_pending_request');
  const pendingMessage = sessionStorage.getItem('legion_chat_pending_message');
  
  if (pendingRequest && !showLeadForm) {
    if (leadFormOffered && !showLeadForm) {
      // Clear stale pending request
      sessionStorage.removeItem('legion_chat_pending_request');
      sessionStorage.removeItem('legion_chat_pending_message');
      sessionStorage.removeItem('legion_chat_pending_service');
    } else {
      setIsBotTyping(true);
      sessionStorage.setItem('legion_chat_bot_typing', 'true');
      
      // Retry pending request if not already being processed
      if (!processedRequestId.current) {
        console.log('[CHAT] Retrying pending request on mount');
        retryPendingRequest();  // ← Восстанавливаем запрос
      }
    }
  }
}, [isOpen, serviceName, serviceSlug, showLeadForm]);
```

### Результат
✅ При переходе между страницами:
- Запрос в AI **восстанавливается**
- Бот **продолжает** "печатать"
- Ответ приходит на **любой странице**
- Нет дублирования запросов

---

**Дата добавления:** 2026-03-16
**Статус:** ✅ Реализовано
**Приоритет:** Критичный
**Влияние:** Непрерывность UX при навигации

---

## ✅ Обновление: Напоминание только после закрытия чата (2026-03-16)

### Проблема
Напоминание "Вы так и не сказали, нужна ли вам моя помощь?" появлялось через 3 секунды после загрузки страницы, даже если пользователь не закрывал чат.

### Решение
Добавлен флаг `legion_chat_was_opened` — напоминание показывается только если:
1. Пользователь увидел приветствие (чат был открыт)
2. Закрыл чат
3. Не написал ни одного сообщения

```typescript
// Установка флага при открытии чата
const toggleChat = () => {
  setIsOpen(!isOpen);
  if (isMinimized) setIsMinimized(false);
  
  // Mark that chat was opened at least once
  if (!isOpen) {
    sessionStorage.setItem('legion_chat_was_opened', 'true');
  }
};

// Проверка в reminder useEffect
const hasChatBeenOpened = sessionStorage.getItem('legion_chat_was_opened');

if (!hasUserMessage && !hasReminder && hasChatBeenOpened === 'true' && !isOpen && !reminderShown) {
  // Show reminder after 3 seconds
  const reminderTimeout = setTimeout(() => {
    // ...
  }, 3000);
}
```

### Результат
✅ Напоминание появляется только если:
- Пользователь **открыл чат** (увидел приветствие)
- **Закрыл чат** (нажал на крестик)
- **Не написал** ни одного сообщения
- Прошло **3 секунды** после закрытия

---

**Дата добавления:** 2026-03-16
**Статус:** ✅ Реализовано
**Приоритет:** Средний
**Влияние:** Улучшение UX, снижение навязчивости

---

## ✅ Удаление: Автооткрытие чата (2026-03-16)

### Изменение
Полностью удалено автооткрытие чата через 10 секунд с countdown индикатором.

### Причина
- На страницах услуг автооткрытие не срабатывало (срабатывало только на главной)
- Бейдж непрочитанных не уменьшался
- Излишняя навязчивость

### Удалённый код
```typescript
// ❌ Удалено:
// - autoOpenTimeoutRef
// - countdown state
// - useEffect для автооткрытия
// - Индикатор countdown на кнопке чата
```

### Результат
✅ Чат теперь:
- **Не открывается** автоматически
- Бейдж показывает непрочитанные корректно
- Welcome message создаётся сразу при загрузке
- Напоминание только после закрытия чата

---

**Дата удаления:** 2026-03-16
**Статус:** ✅ Удалено
**Приоритет:** Средний
**Влияние:** Упрощение UX, снижение навязчивости

---

## ✅ Обновление: Knowledge-base услуг (2026-03-16)

### Изменение
Обновлены цены в `ai-assistant/knowledge-base/services.json` согласно `app/data/services.ts`:

| Услуга | Старая цена | Новая цена |
|--------|-------------|------------|
| Подготовка строительного участка | индивидуальный расчёт | от 12 000 ₽/сотка |
| Благоустройство территорий | индивидуальный расчёт | от 1 100 ₽/м² |
| Изготовление металлоконструкций | индивидуальный расчёт | от 80 000 ₽/т |
| Монтаж технологических трубопроводов | индивидуальный расчёт | от 450 ₽/п.м. |
| Монтаж технологических площадок | индивидуальный расчёт | от 2 500 ₽/м² |
| Антикоррозийная защита | индивидуальный расчёт | от 250 ₽/м² |
| Устройство каменных конструкций | индивидуальный расчёт | от 1 800 ₽/м² |
| Устройство фундаментов | индивидуальный расчёт | от 4 500 ₽/м³ |
| Монтаж сборного железобетона | индивидуальный расчёт | от 2 500 ₽/м³ |
| Теплоизоляция оборудования | индивидуальный расчёт | от 450 ₽/м² |
| Теплоизоляция трубопроводов | индивидуальный расчёт | от 450 ₽/м² |
| Земляные работы | индивидуальный расчёт | от 350 ₽/м³ |
| Строительство ангаров | индивидуальный расчёт | от 10 000 ₽/м² |
| Грузоперевозки | индивидуальный расчёт | от 600 ₽/час |
| Огнезащита конструкций | индивидуальный расчёт | от 450 ₽/м² |

### Результат
✅ Все 17 услуг имеют актуальные цены
✅ AI отвечает с правильными ценами
✅ Соответствие с `services.ts`

---

**Дата обновления:** 2026-03-16
**Статус:** ✅ Обновлено
**Приоритет:** Высокий
**Влияние:** Точность информации для клиентов

---

**Последнее обновление:** 2026-03-16
**Всего реализаций:** 12
**Всего исправлений:** 8

---

## ✅ Реализовано: Анимированный бордер автооткрытия чата (2026-03-16)

### Задача
При первом входе пользователя на сайт (главная или страница услуги) показывать красивую анимацию заполняющегося бордера вокруг иконки чата, и автоматически открывать чат по завершении анимации.

### Реализация

#### 1. Добавлено состояние для анимации
```typescript
const [showAutoOpenAnimation, setShowAutoOpenAnimation] = useState(false); // Show auto-open animation on home page
```

#### 2. Логика инициализации с анимацией
```typescript
useEffect(() => {
  const savedHistory = sessionStorage.getItem(STORAGE_KEY);

  // Only for first-time visitors with no history
  if (!savedHistory) {
    // Create welcome message for all pages
    const welcomeMessage: Message = {
      id: 'welcome',
      text: serviceSlug
        ? `Здравствуйте! 👋 Я помощник по услуге "${serviceName}". Чем могу помочь?`
        : `Здравствуйте! 👋

Знаю, как вы устали искать интересующие вас услуги или информацию о них...`,
      from: 'assistant',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);

    // Show auto-open animation on ALL pages (home and service pages)
    setShowAutoOpenAnimation(true);
    
    // Auto-open chat after animation completes (10 seconds)
    const autoOpenTimeout = setTimeout(() => {
      setIsOpen(true);
      setShowAutoOpenAnimation(false);
      sessionStorage.setItem('legion_chat_was_opened', 'true');
    }, 10000);
    
    return () => clearTimeout(autoOpenTimeout);
  }
}, []);
```

#### 3. SVG анимация бордера
```tsx
{showAutoOpenAnimation && !isOpen && (
  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
    {/* Background circle */}
    <circle
      cx="50"
      cy="50"
      r="44"
      fill="none"
      stroke="rgba(255,255,255,0.1)"
      strokeWidth="6"
    />
    {/* Animated progress circle */}
    <circle
      cx="50"
      cy="50"
      r="44"
      fill="none"
      stroke="url(#borderGradient)"
      strokeWidth="6"
      strokeLinecap="round"
      strokeDasharray="276"
      strokeDashoffset="276"
      className="animate-progress"
      style={{ filter: 'drop-shadow(0 0 3px rgba(139, 92, 246, 0.8))' }}
    />
    <defs>
      <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#60A5FA" />
        <stop offset="25%" stopColor="#A78BFA" />
        <stop offset="50%" stopColor="#C084FC" />
        <stop offset="75%" stopColor="#F472B6" />
        <stop offset="100%" stopColor="#FB7185" />
      </linearGradient>
    </defs>
  </svg>
)}
```

#### 4. CSS анимация
```css
@keyframes progress {
  from {
    stroke-dashoffset: 276;
  }
  to {
    stroke-dashoffset: 0;
  }
}
.animate-progress {
  animation: progress 10s linear forwards;
}
```

### Результат

✅ При первом посещении:
- **На главной** или **странице услуги** — показывается анимация
- Бордер **постепенно заполняется** за 10 секунд
- Градиентный цвет: **синий → фиолетовый → розовый**
- Толщина бордера: **6px** (жирный, хорошо виден)
- Свечение: **drop-shadow** для эффекта свечения
- По завершении: чат **автоматически открывается**

✅ При повторном посещении:
- Анимация **не показывается**
- Чат **не открывается** автоматически
- Welcome message **создаётся** (для бейджа непрочитанных)

### Сценарии использования

| Сценарий | Поведение |
|----------|-----------|
| Первый вход на главную | Анимация 10с → чат открывается ✅ |
| Первый вход на страницу услуги | Анимация 10с → чат открывается ✅ |
| Повторный вход (любая страница) | Без анимации, без автооткрытия |
| Ручное открытие до завершения | Анимация исчезает, чат открывается |

### Технические детали

| Параметр | Значение |
|----------|----------|
| Длительность анимации | 10 секунд |
| Толщина бордера | 6px |
| Градиент | 5 цветов (синий → фиолетовый → розовый) |
| Тип анимации | `stroke-dashoffset` (заполнение круга) |
| Флаг в sessionStorage | `legion_chat_was_opened` |

---

**Дата добавления:** 2026-03-16
**Статус:** ✅ Реализовано
**Приоритет:** Высокий
**Влияние:** Улучшение первого впечатления, привлечение внимания к чату

---

## ✅ Реализовано: Глобальный ChatWidget на всём приложении (2026-03-16)

### Проблема
При переходе между страницами компонент ChatWidget пересоздавался, что приводило к:
- Потере состояния "бот печатает"
- Сбросу pending request
- Потере контекста диалога
- Дублированию welcome сообщений

### Решение
Сделать ChatWidget глобальным компонентом — добавить его в корневой макет `AppWrapper`, чтобы он был один на всё приложение.

### Реализация

#### 1. Добавлен ChatWidget в AppWrapper.tsx
```typescript
import ChatWidget from './components/ChatWidget';

const AppContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <FixedMobileTabs />
      <CookieConsentBanner />
      {/* Global Chat Widget - available on all pages */}
      <ChatWidget />
    </>
  );
};
```

#### 2. Удалён ChatWidget из локальных страниц
```typescript
// ❌ БЫЛО (welcome.tsx, ServiceDetailPage.tsx)
import ChatWidget from "../components/ChatWidget";
// ...
<ChatWidget serviceSlug={service.slug} serviceName={service.title} />

// ✅ СТАЛО
// ChatWidget removed - now global in AppWrapper
```

#### 3. Извлечение serviceSlug/serviceName из URL в ChatWidget
```typescript
import { useLocation } from 'react-router';

const ChatWidget: React.FC<ChatWidgetProps> = () => {
  const { theme } = useTheme();
  const location = useLocation();
  
  // Extract serviceSlug and serviceName from URL
  const serviceSlug = location.pathname.startsWith('/service/') 
    ? location.pathname.replace('/service/', '')
    : undefined;
  
  const SERVICE_NAME_MAP: Record<string, string> = {
    'razborka-zdaniy-i-sooruzheniy': 'Разборка зданий и сооружений',
    'sborka-lesov': 'Сборка лесов',
    // ... все 17 услуг
  };
  
  const serviceName = serviceSlug ? SERVICE_NAME_MAP[serviceSlug] : undefined;
  
  // ... остальная логика
};
```

### Результат

✅ ChatWidget теперь:
- **Один на всё приложение** — не пересоздаётся при навигации
- **Сохраняет состояние** — pending request, isBotTyping, messages
- **Автоматически определяет** текущую услугу из URL
- **Доступен на всех страницах** — главная, услуги, контакты, компания и т.д.

### Изменённые файлы

| Файл | Изменения |
|------|-----------|
| `app/AppWrapper.tsx` | Добавлен импорт и рендер ChatWidget |
| `app/components/ChatWidget.tsx` | Извлечение serviceSlug/serviceName из URL, удалены props |
| `app/welcome/welcome.tsx` | Удалён локальный рендер ChatWidget |
| `app/components/ServiceDetailPage.tsx` | Удалён локальный рендер ChatWidget |

### Сценарии использования

| Сценарий | Поведение |
|----------|-----------|
| Главная страница → услуга | Чат сохраняет состояние, контекст обновляется ✅ |
| Услуга → главная | Чат сохраняет историю, контекст сбрасывается ✅ |
| Услуга → другая услуга | Чат сохраняет историю, контекст обновляется ✅ |
| Запрос в AI при закрытом чате | Ответ приходит на любой странице ✅ |

### Технические детали

| Параметр | Значение |
|----------|----------|
| Расположение | `AppWrapper.tsx` (корневой макет) |
| Количество экземпляров | 1 на всё приложение |
| Определение услуги | `useLocation()` + маппинг slug → name |
| sessionStorage | Используется для истории, pending request, lastReadIndex |

---

**Дата добавления:** 2026-03-16
**Статус:** ✅ Реализовано
**Приоритет:** Критичный
**Влияние:** Непрерывность UX при навигации, сохранение состояния чата

---

## ✅ Обновление: Запрет представления именем "Алексей" (2026-03-16)

### Проблема
Бот иногда представлялся именем "Алексей", что вводило пользователей в заблуждение.

### Решение
Добавлено жёсткое правило в промпт AI:

```javascript
[ВАЖНОЕ ПРАВИЛО: ПРЕДСТАВЛЕНИЕ]
❌ НИКОГДА не называй себя "Алексей" или любым другим человеческим именем
✅ При первом приветствии представляйся ТОЛЬКО так: 
   "виртуальный ИИ-помощник сайта Легион" или "ИИ-помощник" или "виртуальный помощник"
✅ Если клиент спрашивает "кто ты?" — отвечай: 
   "Я виртуальный ИИ-помощник сайта строительной компании ЛЕГИОН"
```

### Изменённые файлы

| Файл | Изменения |
|------|-----------|
| `ai-assistant/server.js` | Добавлено правило [ВАЖНОЕ ПРАВИЛО: ПРЕДСТАВЛЕНИЕ] |

### Примеры правильного представления

| Сценарий | Правильный ответ |
|----------|-----------------|
| Приветствие | "Здравствуйте! 👋 Я виртуальный ИИ-помощник сайта Легион..." |
| "Кто ты?" | "Я виртуальный ИИ-помощник сайта строительной компании ЛЕГИОН" |
| "Ты Алексей?" | "Нет, я виртуальный ИИ-помощник ЛЕГИОН" |

---

**Дата добавления:** 2026-03-16
**Статус:** ✅ Реализовано
**Приоритет:** Высокий
**Влияние:** Корректное позиционирование бота, избежание путаницы

---

## ✅ Добавлен AI аватар в чат (2026-03-16)

### Задача
Добавить красивую аватарку бота в шапку чата вместо иконки Bot.

### Реализация

#### 1. Конвертация изображения в WebP
```bash
node scripts/convert-to-webp.js
```

**Результат:**
- `AIAvatar.png` → `AIAvatar.webp`
- Размер: 4540 KB → 54.7 KB (-98.8%)
- Экономия: 4.41 MB

#### 2. Добавлен аватар в ChatWidget
```tsx
<div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm overflow-hidden border border-white/20 shadow-lg">
  <img 
    src="/AIAvatar.webp" 
    alt="AI Avatar" 
    className="w-full h-full object-cover"
    loading="lazy"
  />
</div>
```

### Результат

✅ В шапке чата:
- **Красивая аватарка** робота вместо иконки
- **Оптимизированный формат** WebP (быстрая загрузка)
- **Анимация** online индикатора (зелёная точка)
- **Бейдж непрочитанных** при минимизации

### Изменённые файлы

| Файл | Изменения |
|------|-----------|
| `public/AIAvatar.webp` | Сконвертирован из AIAvatar.png |
| `app/components/ChatWidget.tsx` | Добавлен <img> с аватаром |

---

**Дата добавления:** 2026-03-16
**Статус:** ✅ Реализовано
**Приоритет:** Средний
**Влияние:** Улучшение визуального восприятия, персонализация бота

---

## ✅ Обновлены карточки услуг на главной (2026-03-16)

### Изменения

| Было | Стало |
|------|-------|
| Заголовок "Наши услуги" | ❌ Убран |
| 4 колонки на desktop | **6 колонок** на XL |
| Большие карточки (h-40 image) | **Компактные** (h-28 image) |
| Gap 4-6 | **Gap 3-4** (плотнее) |
| Описание услуги | ❌ Убрано (только название + цена) |

### Новый дизайн

| Элемент | Описание |
|---------|----------|
| **Сетка** | 2 (mobile) → 3 (tablet) → 4 (lg) → 6 (xl) |
| **Изображение** | h-28 sm:h-32, hover scale-110 |
| **Категория** | Синий бейдж top-left |
| **Стрелка** | Поворот на 45° при hover |
| **Заголовок** | text-xs sm:text-sm, line-clamp-2 |
| **Цена** | Градиент blue-300 → purple-300 |
| **Hover** | y=-4, scale=1.03, border-blue-400/60 |

### Результат

✅ **Компактные** — 17 услуг в 3 ряда
✅ **Плотные** — gap-3 md:gap-4
✅ **Красивые** — градиенты, свечение, анимации
✅ **Без заголовка** — сразу карточки

---

**Дата обновления:** 2026-03-16
**Статус:** ✅ Обновлено
**Приоритет:** Высокий
**Влияние:** Улучшение конверсии, компактное представление

---

## ✅ Реализован умный поиск по услугам на главной (2026-03-17)

### Задача
Создать отдельный компонент умного поиска для фильтрации карточек услуг на главной странице:
1. Поиск по названию, описанию и категории
2. Фильтр по категориям с выпадающим списком
3. Анимированный placeholder с эффектом печатной машинки
4. Адаптивный дизайн для мобильных устройств
5. Отображение результатов поиска поверх карточек

### Реализация

#### 1. Создан новый компонент `ServiceSearch.tsx`
```typescript
// app/components/ServiceSearch.tsx
interface ServiceSearchProps {
  onFilterChange: (filteredIds: number[]) => void;
}

export default function ServiceSearch({ onFilterChange }: ServiceSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [startTyping, setStartTyping] = useState(false);
  
  // Вычисление позиции dropdown через getBoundingClientRect
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  
  // ... логика фильтрации и анимации
}
```

#### 2. Эффект печатной машинки для placeholder
```typescript
// Первые 2 секунды — статический текст
placeholder={!startTyping ? 'Ищите услуги быстро...' : displayedPlaceholder}

// Варианты для машинки (циклически)
const placeholders = [
  'Строительство ангаров...',
  'Монтаж трубопроводов...',
  'Земляные работы...',
  'Огнезащита конструкций...',
  'Грузоперевозки...',
  'Благоустройство территорий...'
];

// Логика печати/удаления
useEffect(() => {
  if (!startTyping || isFocused || searchQuery) return;
  
  const timeout = setTimeout(() => {
    if (!isDeleting) {
      // Печатаем (80мс/символ)
      if (displayedPlaceholder.length < currentPlaceholder.length) {
        setDisplayedPlaceholder(currentPlaceholder.slice(0, displayedPlaceholder.length + 1));
      } else {
        // Пауза 1.5с → удаляем (40мс/символ)
        setTimeout(() => setIsDeleting(true), 1500);
      }
    } else {
      // Удаляем → следующий вариант
      if (displayedPlaceholder.length > 0) {
        setDisplayedPlaceholder(currentPlaceholder.slice(0, displayedPlaceholder.length - 1));
      } else {
        setIsDeleting(false);
        setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
      }
    }
  }, typingSpeed);
  
  return () => clearTimeout(timeout);
}, [displayedPlaceholder, isDeleting, placeholderIndex, typingSpeed]);
```

#### 3. Фильтр по категориям с выпадающим списком
```typescript
// Dropdown с fixed позиционированием (поверх всех элементов)
{showCategoryDropdown && (
  <>
    {/* Backdrop для закрытия по клику вне */}
    <div className="fixed inset-0 z-40" onClick={() => setShowCategoryDropdown(false)} />
    
    <motion.div
      style={{
        position: 'fixed',
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
        zIndex: 9999
      }}
      className="w-72 max-h-80 overflow-y-auto bg-gray-800 ..."
    >
      {/* Список категорий */}
    </motion.div>
  </>
)}
```

#### 4. Адаптивная кнопка фильтра
```typescript
// Мобильная версия: только иконка
// Tablet: иконка + короткое название
// Desktop: иконка + полное название
<button className="... px-2 sm:px-3 ...">
  <Filter className="w-4 h-4 flex-shrink-0" />
  <span className="hidden xs:inline lg:hidden">
    {selectedCategory === 'all' ? 'Категории' : selectedCategory.split(' ')[0]}
  </span>
  <span className="hidden lg:inline">
    {selectedCategory === 'all' ? 'Все категории' : selectedCategory}
  </span>
</button>
```

#### 5. Интеграция в `welcome.tsx`
```typescript
// Состояние для отфильтрованных ID
const [filteredServiceIds, setFilteredServiceIds] = useState<number[] | null>(null);

// Мемоизированная функция обратного вызова
const handleFilterChange = useMemo(() => (filteredIds: number[]) => {
  setFilteredServiceIds(filteredIds);
}, []);

// Фильтрация карточек
{allServices
  .filter(service => filteredServiceIds === null || filteredServiceIds.includes(service.id))
  .length === 0 ? (
    /* Сообщение "Ничего не найдено" */
    <motion.div className="col-span-full text-center py-16">
      <div className="w-20 h-20 rounded-full bg-white/10 ...">
        <Search className="w-10 h-10 text-gray-400" />
      </div>
      <h3>Ничего не найдено</h3>
      <p>По вашему запросу не найдено услуг...</p>
    </motion.div>
  ) : (
    allServices
      .filter(service => filteredServiceIds === null || filteredServiceIds.includes(service.id))
      .map((service, index) => (
        /* Карточка услуги */
      ))
  )}
```

#### 6. Счётчик результатов
```typescript
{(searchQuery || selectedCategory !== 'all') && (
  <motion.div className="mt-3 text-center">
    <p className="text-sm text-gray-400">
      Найдено: <span className="text-white font-bold">{filteredServices.length}</span>
      из <span className="text-white font-bold">{services.length}</span> услуг
    </p>
  </motion.div>
)}
```

### Ключевые исправления в процессе разработки

| Проблема | Решение |
|----------|---------|
| Dropdown обрезается карточками | `position: fixed` + вычисление через `getBoundingClientRect` |
| Бесконечный цикл ререндеров | `useMemo` для `handleFilterChange`, убран `onFilterChange` из зависимостей |
| Текст фильтра выходит за пределы на мобильном | `flex-shrink-0`, `min-w-0`, адаптивные breakpoint |
| Placeholder мигает между текстами | Убран fallback текст, показывается только `displayedPlaceholder` |
| Search icon не импортирован | Добавлен `Search` в импорты `lucide-react` |

### Функционал

| Функция | Описание |
|---------|----------|
| **Поиск по тексту** | Название + описание + категория |
| **Фильтр по категориям** | 6 уникальных категорий из `services.ts` |
| **Активные фильтры** | Отображение выбранных фильтров с кнопкой сброса |
| **Счётчик результатов** | "Найдено X из Y услуг" |
| **Ничего не найдено** | Красивое сообщение с иконкой Search |
| **Печатная машинка** | Запуск через 2с, 7 вариантов, цикл |
| **Адаптивность** | 2 колонки на мобильном, текст скрыт на xs |
| **Backdrop** | Закрытие dropdown по клику вне |

### Сценарии использования

| Сценарий | Поведение |
|----------|-----------|
| Ввод "ангар" | Показывает "Строительство ангаров" |
| Ввод "труб" | Показывает монтаж трубопроводов + теплоизоляцию |
| Выбор категории "Подготовительные работы" | Фильтрует 4 услуги |
| Ввод несуществующего | "Ничего не найдено" + сообщение |
| Фокус на input | Анимация останавливается |
| Клик вне dropdown | Закрытие через backdrop |

### Изменённые файлы

| Файл | Изменения |
|------|-----------|
| `app/components/ServiceSearch.tsx` | ✅ Новый компонент (313 строк) |
| `app/welcome/welcome.tsx` | ✅ Интеграция поиска, state, фильтрация карточек |
| `app/components/ServiceSearch.tsx` | ✅ Исправление позиционирования dropdown |
| `app/components/ServiceSearch.tsx` | ✅ Адаптация для мобильных |

### Технические детали

```typescript
// Ключи sessionStorage: не используются (поиск работает в реальном времени)

// Зависимости:
- framer-motion (анимации)
- lucide-react (иконки: Search, Filter, X, ChevronDown)
- React hooks: useState, useMemo, useEffect, useRef

// Breakpoint адаптивности:
- xs (<640px): только иконка фильтра
- sm (640-1024px): иконка + 1 слово
- lg (≥1024px): иконка + полное название
```

---

**Дата добавления:** 2026-03-17
**Статус:** ✅ Реализовано
**Приоритет:** Высокий
**Влияние:** Улучшение UX, быстрый поиск среди 17 услуг, повышение конверсии

---

## ✅ Реализовано: Липкий поиск услуг при прокрутке (2026-03-17)

### Задача
Сделать так, чтобы поисковая строка услуг "прилипала" к навигационному бару при прокрутке страницы:
1. Динамическое вычисление высоты хедера
2. Поиск остаётся видимым при прокрутке Hero секции
3. Поиск скрывается, когда Hero секция заканчивается
4. Плавные анимации появления/исчезновения

### Реализация

#### 1. Создан контекст `HeaderContext.tsx`
```typescript
// app/contexts/HeaderContext.tsx
interface HeaderContextType {
  headerHeight: number;
}

const HeaderContext = createContext<HeaderContextType>({ headerHeight: 80 });

export const useHeaderHeight = () => useContext(HeaderContext);

export const HeaderProvider: React.FC<HeaderProviderProps> = ({ children }) => {
  const [headerHeight, setHeaderHeight] = useState(80);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    headerRef.current = document.querySelector('header');
    
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        setHeaderHeight(height);
      }
    };

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    
    const observer = new MutationObserver(updateHeaderHeight);
    if (headerRef.current) {
      observer.observe(headerRef.current, { 
        attributes: true, 
        childList: true, 
        subtree: true 
      });
    }

    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
      observer.disconnect();
    };
  }, []);

  return (
    <HeaderContext.Provider value={{ headerHeight }}>
      {children}
    </HeaderContext.Provider>
  );
};
```

#### 2. Добавлен `HeaderProvider` в `AppWrapper.tsx`
```typescript
import { HeaderProvider } from './contexts/HeaderContext';

const AppWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
      <ThemeProvider>
        <LoadingProvider>
          <HeaderProvider>  {/* ✅ Обёрнуто в HeaderProvider */}
            <div className="min-h-screen flex flex-col">
              <AppContent>{children}</AppContent>
            </div>
          </HeaderProvider>
        </LoadingProvider>
      </ThemeProvider>
  );
};
```

#### 3. Обновлён `ServiceSearch.tsx` — использование контекста
```typescript
import { useHeaderHeight } from '../contexts/HeaderContext';

export default function ServiceSearch({ onFilterChange }: ServiceSearchProps) {
  const { headerHeight } = useHeaderHeight(); // Получаем высоту из контекста
  const [isVisible, setIsVisible] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  
  // ...
}
```

#### 4. IntersectionObserver для отслеживания видимости секции
```typescript
useEffect(() => {
  // Находим ближайшую секцию-родителя (Hero section)
  sectionRef.current = searchContainerRef.current?.closest('section') || null;
  
  if (!sectionRef.current) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      // Показываем поиск только когда секция видима
      setIsVisible(entry.isIntersecting);
    },
    {
      threshold: 0,
      rootMargin: `-${headerHeight}px 0px 0px 0px` // Учитываем высоту хедера
    }
  );

  observer.observe(sectionRef.current);

  return () => {
    if (sectionRef.current) observer.unobserve(sectionRef.current);
  };
}, [headerHeight]);
```

#### 5. Fixed позиционирование с анимацией
```typescript
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
        {/* ... содержимое поиска ... */}
      </div>
    </div>
  </>
);
```

### Ключевые решения

| Проблема | Решение |
|----------|---------|
| `sticky` не работает вне родителя | Использовано `position: fixed` |
| Разная высота хедера на мобильных | Динамическое вычисление через `offsetHeight` |
| Поиск перекрывает контент | `IntersectionObserver` с `rootMargin` |
| Поиск виден когда не нужен | Состояние `isVisible` для анимации |
| Место в потоке документа | Пустой `div` с `h-0` и `ref` |

### Поведение

| Сценарий | Поведение поиска |
|----------|-----------------|
| Страница загружена | Поиск в потоке, виден |
| Прокрутка вниз (Hero видима) | Поиск "прилип" к хедеру, виден |
| Прокрутка вниз (Hero ушла) | Поиск плавно исчезает |
| Прокрутка вверх (Hero появилась) | Поиск плавно появляется |
| Изменение размера окна | Высота пересчитывается автоматически |
| Мобильная версия | Хедер меньше → поиск выше |

### Технические детали

```typescript
// Ключи sessionStorage: не используются

// Зависимости:
- React Context (HeaderContext)
- IntersectionObserver API
- Framer Motion (анимации внутри поиска)

// Отступы:
- headerHeight (динамически) + 16px (фиксированный отступ)
- zIndex: 30 (ниже хедера z-50, выше контента)

// Анимации:
- transition-all duration-300
- opacity-100/opacity-0
- translate-y-0/-translate-y-4
```

### Изменённые файлы

| Файл | Изменения |
|------|-----------|
| `app/contexts/HeaderContext.tsx` | ✅ Новый контекст (52 строки) |
| `app/AppWrapper.tsx` | ✅ Добавлен `HeaderProvider` |
| `app/components/ServiceSearch.tsx` | ✅ Интеграция контекста, IntersectionObserver, fixed позиционирование |

### Преимущества подхода

1. **Динамическая высота** — работает с любой высотой хедера
2. **Адаптивность** — автоматически подстраивается под мобильные устройства
3. **Производительность** — `IntersectionObserver` эффективнее `scroll` событий
4. **Плавность** — CSS transitions для анимаций
5. **Изоляция** — контекст предоставляет высоту любому компоненту

---

**Дата добавления:** 2026-03-17
**Статус:** ✅ Реализовано
**Приоритет:** Высокий
**Влияние:** Улучшение UX при прокрутке, поиск всегда под рукой

---

## ✅ Генерация PDF прайс-листа (2026-03-17)

### Задача
Создать PDF-файл с прайс-листом услуг для скачивания пользователями:
1. Все 17 услуг с названиями и ценами
2. Краткое описание каждой услуги
3. Контактная информация компании
4. Корректное отображение кириллицы
5. Профессиональный дизайн с фирменными цветами

### Реализация

#### 1. Установка зависимостей
```bash
npm install pdfkit --save-dev
```

#### 2. Скрипт генерации `scripts/generate-price-list-pdf.js`

```typescript
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';

// Данные прайс-листа с описаниями
const priceList = [
  { 
    name: "Разборка зданий и сооружений", 
    price: "от 180 ₽/м³",
    description: "Демонтаж зданий, удаление конструкций, вывоз мусора"
  },
  // ... ещё 16 услуг
];

// Использование шрифтов Arial с поддержкой кириллицы
const fontPath = 'C:/Windows/Fonts/arial.ttf';
const fontBoldPath = 'C:/Windows/Fonts/arialbd.ttf';

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 40, bottom: 40, left: 40, right: 40 }
});

doc.pipe(fs.createWriteStream('public/price-list.pdf'));
```

#### 3. Структура PDF документа

**Шапка:**
- Название компании: "ООО «ЛЕГИОН»" (жирный, синий #1e40af)
- Подзаголовок: "Строительная компания" (серый)
- Разделительная линия (синяя)

**Заголовок:**
- "ПРАЙС-ЛИСТ НА УСЛУГИ" (жирный, чёрный)
- "Актуальные цены на строительные услуги" (серый)

**Таблица (3 колонки):**
| Услуга | Описание | Цена |
|--------|----------|------|
| Разборка зданий... | Демонтаж, вывоз... | от 180 ₽/м³ |

- Заголовок таблицы: синий фон (#1e40af), белый текст
- Чередование строк: белый / светло-серый (#fafafa)
- Название услуги: чёрный жирный
- Описание: тёмно-серое (#1f2937)
- Цена: зелёный жирный (#047857)

**Подвал:**
- Разделительная линия
- "Контактная информация:" (жирный, чёрный)
- Телефон, Email, Адрес, Сайт (чёрный, слева)
- Примечание об оферте (серый, мелкий)
- Номер страницы (справа)

#### 4. Команда для генерации
```bash
node scripts/generate-price-list-pdf.js
```

#### 5. Кнопка скачивания на главной

```tsx
// app/welcome/welcome.tsx
import { Download } from 'lucide-react';

<a
  href="/price-list.pdf"
  download
  className="group inline-flex items-center justify-center gap-2 ..."
>
  <Download className="w-4 h-4" />
  <span>Скачать прайс-лист</span>
  <ArrowRight className="w-4 h-4 group-hover:translate-x-1" />
</a>
```

### Ключевые решения

| Проблема | Решение |
|----------|---------|
| Кириллица не отображалась | Использованы шрифты Arial (arial.ttf, arialbd.ttf) |
| Текст сливался с фоном | Увеличен контраст: чёрный текст на светлом фоне |
| Контакты уходили вправо | Явное указание координат: `text(..., 40, doc.y)` |
| Длинная строка контактов | Разбито на 4 строки (Телефон, Email, Адрес, Сайт) |

### Структура данных прайс-листа

```typescript
const priceList = [
  { 
    name: "Разборка зданий и сооружений",
    price: "от 180 ₽/м³",
    description: "Демонтаж зданий, удаление конструкций, вывоз мусора"
  },
  { 
    name: "Сборка лесов",
    price: "от 150 ₽/м²",
    description: "Монтаж наружных и внутренних лесов, безопасная эксплуатация"
  },
  // ... 17 услуг всего
];
```

### Изменённые файлы

| Файл | Изменения |
|------|-----------|
| `scripts/generate-price-list-pdf.js` | ✅ Новый скрипт генерации (340 строк) |
| `app/welcome/welcome.tsx` | ✅ Кнопка скачивания, импорт `Download` |
| `public/price-list.pdf` | ✅ Сгенерированный PDF файл |
| `package.json` | ✅ `pdfkit` в devDependencies |

### Технические детали

```typescript
// Шрифты
- Arial Regular (C:/Windows/Fonts/arial.ttf)
- Arial Bold (C:/Windows/Fonts/arialbd.ttf)

// Цвета
- Синий: #1e40af (шапка, заголовки)
- Чёрный: #000000 (основной текст)
- Серый: #374151, #1f2937 (описание)
- Зелёный: #047857 (цены)
- Светло-серый фон: #fafafa (чередование строк)

// Размеры
- Формат: A4
- Отступы: 40px со всех сторон
- Ширина таблицы: 515px (595px - 80px margins)
- Колонки: 280px (услуга) + 180px (описание) + 95px (цена)
```

### Результат

✅ **PDF файл** — 2 страницы, 17 услуг
✅ **Кириллица** — корректное отображение русских символов
✅ **Дизайн** — фирменные цвета, профессиональный вид
✅ **Кнопка** — скачивание по клику с главной страницы
✅ **Автоматизация** — скрипт для перегенерации при изменении цен

### Команды для обновления

```bash
# Перегенерировать PDF после изменения цен
node scripts/generate-price-list-pdf.js

# Установить pdfkit (если не установлен)
npm install pdfkit --save-dev
```

---

**Дата добавления:** 2026-03-17
**Статус:** ✅ Реализовано
**Приоритет:** Высокий
**Влияние:** Возможность скачать прайс-лист, улучшение конверсии

---

## ✅ Кликабельные телефоны в сообщениях бота (2026-03-17)

### Задача
Сделать телефонные номера в сообщениях бота кликабельными — при клике должен открываться звонок на мобильном устройстве.

### Реализация

#### 1. Обновлена функция `formatMessageText`

```typescript
// app/components/ChatWidget.tsx
const formatMessageText = (text: string): string => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    // Делаем телефоны кликабельными
    .replace(/(\+7\s*\(?[0-9]{3}\)?\s*[\-]?\s*[0-9]{3}\s*[\-]?\s*[0-9]{2}\s*[\-]?\s*[0-9]{2})/g, '<a href="tel:$1" class="text-blue-400 hover:text-blue-300 underline font-semibold">$1</a>')
    .replace(/(8\s*\(?[0-9]{3}\)?\s*[\-]?\s*[0-9]{3}\s*[\-]?\s*[0-9]{2}\s*[\-]?\s*[0-9]{2})/g, '<a href="tel:+7$1" class="text-blue-400 hover:text-blue-300 underline font-semibold">$1</a>');
};
```

#### 2. Регулярные выражения для телефонов

**Формат +7:**
```regex
(\+7\s*\(?[0-9]{3}\)?\s*[\-]?\s*[0-9]{3}\s*[\-]?\s*[0-9]{2}\s*[\-]?\s*[0-9]{2})
```

**Формат 8:**
```regex
(8\s*\(?[0-9]{3}\)?\s*[\-]?\s*[0-9]{3}\s*[\-]?\s*[0-9]{2}\s*[\-]?\s*[0-9]{2})
```

**Поддерживаемые форматы:**
- `+7 (931) 247-08-88`
- `+7 931 247-08-88`
- `+79312470888`
- `8 (931) 247-08-88`
- `8 931 247-08-88`

#### 3. Стиль кликабельных ссылок

```html
<a href="tel:+79312470888" class="text-blue-400 hover:text-blue-300 underline font-semibold">
  +7 (931) 247-08-88
</a>
```

**Стили:**
- `text-blue-400` — синий цвет
- `hover:text-blue-300` — светлее при наведении
- `underline` — подчёркивание
- `font-semibold` — полужирный

#### 4. Обновлённый промпт для AI

```javascript
// ai-assistant/server.js
✓ ВАЖНО: В КАЖДОМ ответе в конце добавляй: 
"Просто напишите свои контактные данные (имя и телефон) или позвоните: +7 (931) 247-08-88. 📞"
```

### Примеры использования

**Сообщение бота:**
```
Здравствуйте! 👋 Строительство ангаров стоит от 10 000 ₽/м². 
Просто напишите свои контактные данные (имя и телефон) или позвоните: +7 (931) 247-08-88. 📞
```

**HTML после форматирования:**
```html
Здравствуйте! 👋 Строительство ангаров стоит от 10 000 ₽/м². 
Просто напишите свои контактные данные (имя и телефон) или позвоните: 
<a href="tel:+79312470888" class="text-blue-400 hover:text-blue-300 underline font-semibold">
  +7 (931) 247-08-88
</a>. 📞
```

### Поведение на устройствах

| Устройство | Действие при клике |
|------------|-------------------|
| **Мобильный** | Открывается набор номера в телефоне |
| **Планшет** | Открывается набор номера (если есть SIM) |
| **Десктоп** | Ничего (или предложение открыть приложение) |
| **Mac** | Предложение продолжить в iPhone |

### Изменённые файлы

| Файл | Изменения |
|------|-----------|
| `app/components/ChatWidget.tsx` | ✅ Обновлена `formatMessageText`, 2 regex для телефонов |
| `ai-assistant/server.js` | ✅ Добавлено правило для промпта |

### Технические детали

```typescript
// Regex для +7:
- \+7 — начинается с +7
- \s* — пробелы (0 или более)
- \(? — открывающая скобка (опционально)
- [0-9]{3} — код города (3 цифры)
- \)? — закрывающая скобка (опционально)
- \s* — пробелы
- [\-]? — дефис (опционально)
- [0-9]{3} — первые 3 цифры номера
- [\-]? — дефис (опционально)
- [0-9]{2} — следующие 2 цифры
- [\-]? — дефис (опционально)
- [0-9]{2} — последние 2 цифры

// Замена для 8:
- 8 заменяется на +7 в href
- В тексте остаётся 8
```

### Результат

✅ **Кликабельные телефоны** — работают на всех устройствах
✅ **Поддержка форматов** — +7 и 8, со скобками и дефисами
✅ **Стильные ссылки** — синие, с подчёркиванием
✅ **Hover эффект** — светлеют при наведении
✅ **Автоматически** — AI добавляет в каждый ответ

---

**Дата добавления:** 2026-03-17
**Статус:** ✅ Реализовано
**Приоритет:** Высокий
**Влияние:** Улучшение конверсии, упрощение связи

---

## ✅ Всплывающее уведомление об ИИ-агенте (2026-03-17)

### Задача
При первом открытии чата показывать всплывающее уведомление о том, что в чате работает ИИ-агент. Уведомление расположено снизу чата и перекрывает только нижнюю часть. Можно закрыть крестиком.

### Реализация

#### 1. Добавлено состояние `showAIDisclaimer`

```typescript
// app/components/ChatWidget.tsx
const [showAIDisclaimer, setShowAIDisclaimer] = useState(false); // Show AI disclaimer on first open
```

#### 2. Проверка при открытии чата

```typescript
// Show AI disclaimer immediately when chat is opened for first time
useEffect(() => {
  if (isOpen) {
    const hasSeenDisclaimer = sessionStorage.getItem('legion_chat_ai_disclaimer_seen');
    
    // Show disclaimer if hasn't seen it before
    if (!hasSeenDisclaimer && !showAIDisclaimer) {
      setShowAIDisclaimer(true);
    }
  }
}, [isOpen]);
```

#### 3. Компонент уведомления (компактный, снизу)

```tsx
{/* AI Disclaimer Popup - compact bottom banner */}
{showAIDisclaimer && (
  <div className="absolute bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
    <div className="mx-4 mb-4 p-4 rounded-xl shadow-2xl ...">
      <div className="flex items-start gap-3">
        {/* AI Avatar */}
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 ...">
          <img src="/avatarAI.webp" alt="AI Avatar" />
        </div>

        {/* Text */}
        <div className="flex-1">
          <p className="text-sm font-semibold">
            В чате работает ИИ-помощник
          </p>
          <p className="text-xs text-gray-400">
            Закройте это сообщение, чтобы продолжить
          </p>
        </div>

        {/* Close Button */}
        <button onClick={() => {
          setShowAIDisclaimer(false);
          sessionStorage.setItem('legion_chat_ai_disclaimer_seen', 'true');
        }}>
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
)}
```

#### 4. Ключ sessionStorage

```javascript
legion_chat_ai_disclaimer_seen = 'true'  // Пользователь видел уведомление
```

### Дизайн уведомления

**Элементы:**
- 🖼️ AI аватар (`avatarAI.webp`) в синей рамке
- 📝 Заголовок: "В чате работает ИИ-помощник"
- 💬 Подсказка: "Закройте это сообщение, чтобы продолжить"
- ❌ Крестик для закрытия

**Стили:**
- `absolute bottom-0` — прижато к низу чата
- `z-50` — поверх сообщений
- `bg-gradient-to-t from-black/90` — градиентный фон
- Компактный размер (перекрывает только низ)
- Адаптивность под тёмную/светлую тему

### Поведение

| Сценарий | Действие |
|----------|----------|
| Первое открытие чата | Показывается уведомление снизу |
| Закрытие крестиком | Уведомление скрывается, ключ записывается |
| Повторное открытие чата | Уведомление НЕ показывается |
| Очистка sessionStorage | Уведомление показывается снова |

### Текст уведомления

```
┌─────────────────────────────────────┐
│ 🖼️  В чате работает ИИ-помощник    │
│     Закройте это сообщение,        │
│     чтобы продолжить         ❌     │
└─────────────────────────────────────┘
```

### Изменённые файлы

| Файл | Изменения |
|------|-----------|
| `app/components/ChatWidget.tsx` | ✅ Состояние `showAIDisclaimer`, проверка sessionStorage, компонент уведомления |

### Технические детали

```typescript
// sessionStorage ключи:
- legion_chat_ai_disclaimer_seen — видел ли пользователь уведомление

// Показ уведомления:
- При первом открытии чата (авто или вручную)
- Не показывается если ключ уже есть в sessionStorage
- Сбрасывается при очистке sessionStorage

// Позиционирование:
- absolute bottom-0 — внизу чата
- z-50 — поверх сообщений
- Не перекрывает весь чат, только нижнюю часть
```

### Результат

✅ **Информирование** — клиенты знают, что общаются с ИИ
✅ **Компактность** — перекрывает только низ чата
✅ **Закрытие** — крестик в углу
✅ **Не надоедает** — показывается только 1 раз
✅ **AI аватар** — используется реальное изображение

---

**Дата добавления:** 2026-03-17
**Статус:** ✅ Реализовано
**Приоритет:** Средний
**Влияние:** Прозрачность, управление ожиданиями клиентов

---

## ✅ Обновлённое приветствие и AI аватар (2026-03-17)

### Задача
1. Сделать приветственное сообщение кратким и цепляющим
2. Разделить текст на абзацы для лучшей читаемости
3. Использовать новый AI аватар `avatarAI.webp`

### Реализация

#### 1. Новое приветствие (с абзацами)

```typescript
const welcomeMessage: Message = {
  id: 'welcome',
  text: serviceSlug
    ? `Здравствуйте! 👋

Я ИИ-помощник по услуге "${serviceName}".

Рассчитать стоимость или рассказать подробнее?`
    : `Здравствуйте! 👋

Я ИИ-помощник строительной компании ЛЕГИОН.

Помогу подобрать услуги, рассчитаю стоимость и отвечу на вопросы!

Напишите, что вас интересует — строительство, демонтаж или другая услуга? 😊`
};
```

#### 2. Обновлённый AI аватар

```tsx
{/* В заголовке чата */}
<div className="rounded-full bg-gradient-to-br from-white/10 to-white/5 ...">
  <img
    src="/avatarAI.webp"
    alt="AI Avatar"
    className="w-full h-full object-cover"
    loading="lazy"
  />
</div>

{/* В уведомлении */}
<div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 ...">
  <img
    src="/avatarAI.webp"
    alt="AI Avatar"
    className="w-full h-full object-cover"
  />
</div>
```

#### 3. Конвертация изображений

```bash
node scripts/convert-to-webp.js
# ✅ public/avatarAI.png → public/avatarAI.webp
# 📉 5083.1 KB → 151.5 KB (-97.0%)
```

### Структура приветствия

**Для главной страницы:**
```
Здравствуйте! 👋

Я ИИ-помощник строительной компании ЛЕГИОН.

Помогу подобрать услуги, рассчитаю стоимость и отвечу на вопросы!

Напишите, что вас интересует — строительство, демонтаж или другая услуга? 😊
```

**Для страницы услуги:**
```
Здравствуйте! 👋

Я ИИ-помощник по услуге "[название услуги]".

Рассчитать стоимость или рассказать подробнее?
```

### Изменённые файлы

| Файл | Изменения |
|------|-----------|
| `app/components/ChatWidget.tsx` | ✅ Новое приветствие, AI аватар |
| `public/avatarAI.webp` | ✅ Конвертировано из avatarAI.png |

### Технические детали

```typescript
// Форматирование текста:
- \n\n — двойной перенос строки (абзац)
- Каждый абзац отделён пустой строкой
- Текст отображается с отступами между абзацами

// AI аватар:
- Файл: /avatarAI.webp
- Размер: 151.5 KB (было 5083.1 KB)
- Экономия: 97%
- Используется в заголовке и уведомлении
```

### Результат

✅ **Краткое приветствие** — 3-4 абзаца вместо длинного текста
✅ **Цепляющий текст** — мотивирует написать в чат
✅ **Читаемость** — абзацы с отступами
✅ **AI аватар** — реальное изображение человека
✅ **Оптимизация** — WebP вместо PNG (97% экономии)

---

**Дата добавления:** 2026-03-17
**Статус:** ✅ Реализовано
**Приоритет:** Высокий
**Влияние:** Улучшение первого впечатления, конверсии

---

## ✅ Интеграция ЗОК (Защита от БПЛА) в AI-бота (2026-03-19)

### Описание изменений
Интегрирована услуга "Защита от БПЛА (ЗОК)" в AI-ассистента. Бот теперь активно предлагает эту услугу и консультирует по всем вопросам, связанным с защитой от беспилотников.

### Реализованный функционал

#### 1. База знаний ЗОК (`ai-assistant/knowledge-base/zok.json`)
Создан полный файл с информацией об услуге:

```json
{
  "service": {
    "slug": "drone-defense",
    "name": "Защита от БПЛА (ЗОК)",
    "fullName": "Комплексная защита периметра от беспилотных летательных аппаратов",
    "category": "Спецработы",
    "priority": "HIGH",
    "description": "Установка антидроновых систем под ключ: ТЭК, заводы, склады и частные объекты",
    "shortDescription": "Защита периметра от дронов по СП 542.1325800.2024",
    "regulation": "СП 542.1325800.2024",
    "features": [...],
    "stages": [...],
    "applications": [...],
    "regulations": [...],
    "legalRequirements": {...},
    "faq": [...],
    "benefits": [...],
    "keywords": [...]
  }
}
```

**Включает:**
- ✅ Полное описание услуги
- ✅ 3 этапа реализации (расчёт, монтаж, сервис)
- ✅ Области применения (ТЭК, заводы, мосты, плотины и т.д.)
- ✅ Нормативные требования (4 документа: ПП РФ №1046, №258, ФЗ №390-ФЗ, СП 542.1325800)
- ✅ Последствия несоответствия (штрафы, ответственность)
- ✅ Преимущества для клиента
- ✅ FAQ (5 вопросов-ответов)
- ✅ Ключевые слова для распознавания запросов

#### 2. Обновлён AI-сервер (`ai-assistant/server.js`)

**Загрузка базы знаний:**
```javascript
let zokData = null;
try {
  const zokPath = join(__dirname, 'knowledge-base', 'zok.json');
  zokData = JSON.parse(fs.readFileSync(zokPath, 'utf-8'));
  console.log('✅ ZOK loaded:', zokData.service.name);
} catch (error) {
  console.error('❌ Failed to load knowledge base:', error.message);
}
```

**Функция получения контекста:**
```javascript
function getZokContext() {
  if (!zokData) return null;
  
  const service = zokData.service;
  
  return {
    name: service.name,
    fullName: service.fullName,
    description: service.description,
    shortDescription: service.shortDescription,
    regulation: service.regulation,
    price: service.price,
    features: service.features,
    stages: service.stages,
    applications: service.applications,
    regulations: service.regulations,
    legalRequirements: service.legalRequirements,
    benefits: service.benefits,
    keywords: service.keywords
  };
}
```

**Развёрнутый контекст в промпте:**
```javascript
let zokText = '';
if (zokContext) {
  const stagesList = zokContext.stages.map(s => `• ${s.name} (${s.price})`).join('\n');
  const featuresList = zokContext.features.join('\n');
  const regulationsList = zokContext.regulations.map(r => `• ${r.number} (${r.date}): ${r.description}`).join('\n');
  const applicationsList = zokContext.applications.map(a => `• ${a.name}: ${a.description}`).join('\n');

  zokText = `

[🔥 КЛЮЧЕВАЯ УСЛУГА: ЗОК - ЗАЩИТА ОТ БПЛА]
${zokContext.fullName}

📋 ОПИСАНИЕ: ${zokContext.description}
📜 Норматив: ${zokContext.regulation}
💰 Цена: ${zokContext.price}

🛡️ ПРЕИМУЩЕСТВА:
${featuresList}

📊 3 ЭТАПА РЕАЛИЗАЦИИ:
${stagesList}

🏭 ОБЛАСТИ ПРИМЕНЕНИЯ:
${applicationsList}

📜 НОРМАТИВНЫЕ ТРЕБОВАНИЯ:
${regulationsList}

⚠️ ВАЖНО: Согласно ПП РФ № 460, руководители объектов ТЭК, промышленности и других критически важных сфер ОБЯЗАНЫ обеспечивать их антитеррористическую защищенность!
Последствия несоответствия: административные штрафы, приостановку деятельности, персональную ответственность руководителей.

✅ ПРЕИМУЩЕСТВА ДЛЯ КЛИЕНТА:
${zokContext.benefits.join('\n')}

🎯 Если клиент спрашивает про ЗОК/защиту от дронов:
1. Расскажи про 3 уровня защиты и преимущества
2. Упомяни нормативные требования (обязанность по закону)
3. Перечисли области применения (ТЭК, заводы, склады и т.д.)
4. Предложи бесплатный расчет стоимости
5. Дай контакты: +7 931 247-08-88

`;
}
```

**Инструкции для бота:**
```
[ПРАВИЛА ОБЩЕНИЯ]
✓ Распознавай намерение клиента:
  • Приветствие → ответь вежливо, предложи помощь, упомяни ЗОК и вакансии
  • Вопрос про ЗОК/защиту от БПЛА → расскажи про 3 уровня защиты, нормативные требования, предложи бесплатный расчет

[🔥 КЛЮЧЕВАЯ УСЛУГА: ЗОК]
Защита от БПЛА — ключевая услуга компании!
Предлагай эту услугу в первую очередь при упоминании:
- ТЭК, заводы, склады, промышленные объекты
- Безопасность, защита, охрана
- БПЛА, дроны, беспилотники
- Нормативные требования, проверки
```

#### 3. Обновлён ChatWidget (`app/components/ChatWidget.tsx`)

**Приветственное сообщение:**
```typescript
const welcomeMessage: Message = {
  id: 'welcome',
  text: serviceSlug
    ? `Здравствуйте! 👋

Я ИИ-помощник по услуге "${serviceName}".

Рассчитать стоимость или рассказать подробнее?`
    : `Здравствуйте! 👋

Я ИИ-помощник строительной компании ЛЕГИОН.

Помогу подобрать услуги, рассчитаю стоимость и отвечу на вопросы!

Также у нас есть открытые вакансии — могу рассказать подробнее!

Напишите, что вас интересует — строительство, демонтаж, защита от БПЛА или другая услуга? 😊`,
  from: 'assistant',
  timestamp: new Date()
};
```

### Изменённые файлы

| Файл | Изменения |
|------|-----------|
| `ai-assistant/knowledge-base/zok.json` | ✅ Создан: полная база знаний ЗОК |
| `ai-assistant/server.js` | ✅ Загрузка zok.json, функция `getZokContext()`, контекст в промпте |
| `app/components/ChatWidget.tsx` | ✅ Упоминание ЗОК в приветствии |

### Сценарии использования

#### Сценарий 1: Приветствие
**Клиент:** "Здравствуйте"
**Бот:** 
```
Здравствуйте! 👋

Я ИИ-помощник строительной компании ЛЕГИОН.

Помогу подобрать услуги, рассчитаю стоимость и отвечу на вопросы!

Также у нас есть открытые вакансии — могу рассказать подробнее!

Напишите, что вас интересует — строительство, демонтаж, защита от БПЛА или другая услуга? 😊

Просто напишите свои контактные данные (имя и телефон) или позвоните: +7 (931) 247-08-88. 📞
```

#### Сценарий 2: Запрос про защиту
**Клиент:** "Нужна защита периметра для ТЭК"
**Бот:**
```
🔥 Отличный выбор! Защита от БПЛА — наша ключевая услуга!

Комплексная защита периметра от беспилотных летательных аппаратов по СП 542.1325800.2024.

🛡️ Преимущества:
• Полная защита от всех типов беспилотников
• Трехуровневая система защиты
• Быстрое возведение конструкций
• Гарантия до 25+ лет
• Сертифицировано ФСТЭК
• Поддержка 24/7

📊 3 этапа:
1. Расчет стоимости защиты (Бесплатно)
2. Монтаж ЗОК (До 400 кг)
3. Эксплуатация и сервис (25+ лет)

⚠️ Важно: По ПП РФ № 460 руководители ТЭК обязаны обеспечивать антитеррористическую защищенность!

Хотите бесплатный расчет стоимости?

Просто напишите свои контактные данные (имя и телефон) или позвоните: +7 (931) 247-08-88. 📞
```

#### Сценарий 3: Запрос про нормативы
**Клиент:** "Какие требования по защите от дронов?"
**Бот:**
```
📜 Нормативные требования:

• ПП РФ №1046 (от 03.08.2024): Защита объектов ТЭК от дронов
• ПП РФ №258 (от 03.03.2024): Безопасность предприятий от БПЛА
• ФЗ №390-ФЗ «О безопасности»: Безопасность стратегических объектов
• СП 542.1325800 (действующий): Проектирование защитных конструкций

⚠️ По ПП РФ № 460 руководители обязаны обеспечивать антитеррористическую защищенность!

Последствия несоответствия:
• Административные штрафы
• Приостановку деятельности
• Персональную ответственность руководителей

Хотите получить консультацию специалиста?

Просто напишите свои контактные данные (имя и телефон) или позвоните: +7 (931) 247-08-88. 📞
```

### Технические детали

**Структура контекста:**
- `name`: Краткое название услуги
- `fullName`: Полное название
- `description`: Развёрнутое описание
- `shortDescription`: Краткое описание для упоминаний
- `regulation`: Основной нормативный документ
- `price`: Диапазон цен или формат ценообразования
- `features`: Массив преимуществ
- `stages`: Массив этапов с ценами
- `applications`: Области применения
- `regulations`: Нормативные документы
- `legalRequirements`: Юридические требования и последствия
- `benefits`: Преимущества для клиента
- `keywords`: Ключевые слова для распознавания

**Форматирование в промпте:**
- Списки через `•` и `\n` для читаемости
- Эмодзи для визуального разделения блоков
- Жирный текст через `**` для акцентов
- Чёткая структура: описание → преимущества → этапы → применение → нормативы

### Результат

✅ **База знаний ЗОК** — полная информация об услуге
✅ **AI-сервер** — загрузка и интеграция контекста
✅ **Приветствие** — упоминание ЗОК в первом сообщении
✅ **Распознавание запросов** — по ключевым словам (БПЛА, дроны, защита и т.д.)
✅ **Консультации** — развёрнутые ответы про 3 уровня защиты, нормативы, области применения
✅ **Призыв к действию** — предложение бесплатного расчёта
✅ **Контакты** — в каждом ответе

### Примечание

**Важно:** В промпте для бота ЗОК указана как "ключевая услуга", но для клиента это не афишируется как "приоритетная". Бот естественно предлагает услугу при соответствующих запросах.

**Ключевые слова для распознавания:**
- ЗОК, защита от БПЛА, защита от дронов, антидрон, анти-дрон
- беспилотники, БПЛА, дроны
- защита периметра, охрана периметра
- СП 542.1325800, нормативные требования
- ТЭК, заводы, склады, промышленные объекты

**Важно:** ЗОК = Защитные Ограждающие Конструкции (физический барьер с металлической сеткой, НЕ электроника!)

---

**Дата добавления:** 2026-03-19
**Статус:** ✅ Реализовано
**Приоритет:** Высокий
**Влияние:** Увеличение конверсии по ключевой услуге, автоматизация консультаций

---

## ✅ Исправлено: Определение ЗОК (Защитные Ограждающие Конструкции) (2026-03-19)

### Описание проблемы
Бот неправильно объяснял, что такое ЗОК:
- ❌ Говорил "защита от БПЛА" вместо "Защитные Ограждающие Конструкции"
- ❌ Упоминал обнаружение дронов и радиоэлектронное подавление
- ❌ Создавал впечатление, что это электронные системы

**Пример неправильного ответа бота:**
```
ЗОК — это защита от беспилотных летательных аппаратов (БПЛА). 🛡️

Мы устанавливаем антидроновые системы под ключ с тремя уровнями защиты:
1. Обнаружение дронов
2. Радиоэлектронное подавление
3. Физическая защита периметра
```

### Корректное определение
**ЗОК = Защитные Ограждающие Конструкции**

Это **физические барьеры** с металлической сеткой в 3 уровня для защиты периметра объектов от проникновения беспилотных летательных аппаратов.

**Что МЫ делаем:**
- ✅ Физические ограждающие конструкции
- ✅ Металлический каркас с сеткой
- ✅ 3 уровня защиты (физические барьеры)
- ✅ Монтаж по СП 542.1325800.2024

**Что МЫ НЕ делаем:**
- ❌ Обнаружение дронов (радары, датчики)
- ❌ Радиоэлектронное подавление (глушилки)
- ❌ Электронные системы защиты

### Решение
Обновлён промпт для Qwen в файле `ai-assistant/server.js`:

#### 1. Изменён заголовок услуги
```javascript
[🔥 КЛЮЧЕВАЯ УСЛУГА: ЗОК - ЗАЩИТНЫЕ ОГРАЖДАЮЩИЕ КОНСТРУКЦИИ]
```

#### 2. Добавлена явная инструкция
```javascript
🎯 Если клиент спрашивает про ЗОК/защиту от дронов:
1. ЗОК = Защитные Ограждающие Конструкции (физический барьер, НЕ электроника!)
2. Расскажи про 3 уровня защиты (физические барьеры с сеткой)
3. Упомяни нормативные требования (обязанность по закону)
4. Перечисли области применения (ТЭК, заводы, склады и т.д.)
5. Предложи бесплатный расчет стоимости
6. Дай контакты: +7 931 247-08-88

❌ НЕ ГОВОРИ про:
- Обнаружение дронов
- Радиоэлектронное подавление
- Электронные системы
Это ТОЛЬКО физические ограждающие конструкции с металлической сеткой!
```

### Изменённые файлы
| Файл | Изменения |
|------|-----------|
| `ai-assistant/server.js` | ✅ Обновлено определение ЗОК, добавлены инструкции "НЕ ГОВОРИ про..." |
| `CHAT_BADGE_DEBUG.md` | ✅ Добавлено примечание о правильном определении |

### Результат
✅ **Правильное определение** — ЗОК = Защитные Ограждающие Конструкции
✅ **Физический барьер** — бот говорит про металлические конструкции с сеткой
✅ **Без электроники** — бот не упоминает обнаружение и подавление дронов
✅ **3 уровня защиты** — физические барьеры с металлической сеткой

### Пример корректного ответа бота
**Клиент:** "Что такое ЗОК?"

**Бот:**
```
ЗОК — это Защитные Ограждающие Конструкции. 🛡️

Мы устанавливаем физические барьеры с металлической сеткой в 3 уровня для защиты периметра от дронов. Это надёжная защита по СП 542.1325800.2024 для ТЭК, заводов, складов и промышленных объектов.

✅ Стальной каркас с сеткой
✅ Антикоррозийное покрытие
✅ Гарантия до 25+ лет
✅ Сертифицировано ФСТЭК

Хотите бесплатный расчёт стоимости для вашего объекта? 📋

Просто напишите свои контактные данные (имя и телефон) или позвоните: +7 (931) 247-08-88. 📞
```

---

**Дата добавления:** 2026-03-19
**Статус:** ✅ Исправлено
**Приоритет:** Критичный
**Влияние:** Точность информации о ключевой услуге, избежание ложных ожиданий клиентов

---

## ✅ Добавлена обработка ошибок и таймаутов бота (2026-03-19)

### Описание проблемы
Бот иногда "отваливался" при генерации ответа, показывая ошибку таймаута:
```
❌ [MAIN] AI Assistant Server error: timeout of 30000ms exceeded
```

Клиент не получал никакого ответа, что создавало негативный опыт.

### Решение
Добавлена обработка ошибок Qwen API с **двумя уровнями fallback**:

#### Уровень 1: **Прокси api-server.js** (таймаут 60 секунд)
Если Qwen не отвечает в течение 60 секунд, прокси возвращает ответ с контактами:

```javascript
// api-server.js
const response = await axios.post(aiAssistantUrl, {
  message,
  serviceSlug,
  sessionId,
  history
}, {
  timeout: 60000, // 60 секунд вместо 30
});

catch (error) {
  const isTimeout = error.code === 'ECONNABORTED' || error.message.includes('timeout');
  
  if (isTimeout) {
    // Специальный ответ при таймауте
    res.json({
      response: 'Простите, я не могу ответить на ваш вопрос прямо сейчас. Пожалуйста, для связи с нами заполните форму на странице **Контакты** или позвоните по телефону **+7 (931) 247-08-88**. 📞',
      fallback: true,
      timeout: true
    });
  }
}
```

#### Уровень 2: **ai-assistant/server.js** (таймаут 30 секунд)
Если Qwen не отвечает в течение 30 секунд, используется fallback:

```javascript
// ai-assistant/server.js
const { stdout } = await execAsync(`qwen -y -p "${escapedPrompt}"`, {
  cwd: __dirname,
  timeout: 30000, // 30 секунд
});

catch (qwenError) {
  const isTimeout = qwenError.message.includes('timeout') || qwenError.message.includes('ETIMEDOUT');
  
  if (isTimeout) {
    // Специальный ответ при таймауте - только контакты
    aiResponse = `Простите, я не могу ответить на ваш вопрос прямо сейчас...`;
  } else {
    // Умный fallback-ответ
    aiResponse = generateFallbackResponse(message, ...);
  }
}
```

### Изменённые файлы
| Файл | Изменения |
|------|-----------|
| `api-server.js` | ✅ Увеличен таймаут с 30с до 60с, добавлена обработка таймаута с контактами |
| `ai-assistant/server.js` | ✅ Добавлена проверка на таймаут, специальный ответ с контактами |

### Сценарии обработки ошибок

#### Сценарий 1: Таймаут прокси (>60 секунд)
**Клиент:** "сколько стоит строительство ангара?"
**Бот (таймаут прокси):**
```
Простите, я не могу ответить на ваш вопрос прямо сейчас. Пожалуйста, для связи с нами заполните форму на странице **Контакты** или позвоните по телефону **+7 (931) 247-08-88**. 📞
```

#### Сценарий 2: Таймаут Qwen (>30 секунд, но <60 секунд)
**Клиент:** "какие у вас услуги?"
**Бот (таймаут Qwen в ai-assistant):**
```
Простите, я не могу ответить на ваш вопрос прямо сейчас. Пожалуйста, для связи с нами заполните форму на странице **Контакты** или позвоните по телефону **+7 (931) 247-08-88**. 📞
```

#### Сценарий 3: Другая ошибка Qwen
**Клиент:** "привет!"
**Бот (fallback):**
```
Здравствуйте! 👋 Я виртуальный ИИ-помощник сайта строительной компании ЛЕГИОН.
[и т.д. - стандартный fallback-ответ]
```

#### Сценарий 4: Недоступен AI сервер
**Клиент:** "хочу заказать услугу"
**Прокси (503):**
```json
{
  "response": "AI-ассистент временно недоступен. Пожалуйста, позвоните нам: +7 (931) 247-08-88",
  "fallback": true
}
```

### Логирование
Все ошибки логируются с соответствующими эмодзи:
- `⏰ [MAIN] AI Assistant timeout` — таймаут прокси
- `⏰ [CHAT] Qwen timeout` — таймаут Qwen
- `❌ [CHAT] Qwen CLI error` — другая ошибка Qwen
- `🔧 [MAIN] AI Assistant unavailable` — сервер недоступен
- `📞 [FALLBACK] Phone detected` — телефон в fallback-режиме

### Результат
✅ **Клиент всегда получает ответ** — даже при ошибке бота
✅ **Контакты в таймауте** — клиент знает, куда обратиться
✅ **Два уровня защиты** — прокси (60с) + Qwen (30с)
✅ **Увеличенный таймаут** — 60 секунд вместо 30 для сложных запросов
✅ **Логирование ошибок** — легко отследить проблемы

### Примечание
**Важно:** 
- Таймаут прокси установлен в **60 секунд** для обработки сложных запросов
- Таймаут Qwen установлен в **30 секунд** для быстрой обработки ошибок
- Ответ при таймауте содержит ТОЛЬКО контакты, без дополнительной информации
- Это сделано намеренно: короткий ответ быстрее доставляется клиенту

---

**Дата добавления:** 2026-03-19
**Статус:** ✅ Реализовано
**Приоритет:** Высокий
**Влияние:** Улучшение пользовательского опыта, снижение потерь лидов

---

## ✅ Реализовано логирование чата в Telegram группу с темами (2026-03-19)

### Описание функционала
Автоматическая отправка истории переписки клиентов с AI-ботом в Telegram группу с созданием отдельных тем для каждой сессии.

### Конфигурация

#### Переменные окружения (.env)
```env
# Telegram Logs Group Configuration
TELEGRAM_LOGS_BOT_TOKEN=8564716580:AAEag1otwIvGtoGhGAkR31OKNlJaFOvbYBo
TELEGRAM_LOGS_GROUP_ID=-1003743767375
```

#### Требования
- ✅ Бот должен быть **администратором группы** с правом создания тем
- ✅ Группа должна быть **супергруппой с темами** (forum)
- ✅ Chat ID супергруппы начинается с `-100`

### Архитектура

#### Кэш сессий
```javascript
const sessionTopicCache = new Map(); // session_id -> topic_id
```

#### Функции

**1. createTopicForSession(sessionId, userName)**
- Создаёт новую тему в Telegram группе
- Формат названия: `{userName} - {последние 8 символов session_id}`
- Пример: `Клиент - uv2kxqi8n`
- Цвет иконки: Синий (0x6495ED)
- Отправляет приветственное сообщение в тему

**2. sendLogToTopic(topicId, message, parseMode)**
- Отправляет сообщение в указанную тему
- Поддерживает Markdown форматирование
- Автоматически обрезает сообщения >4000 символов

**3. getOrCreateTopicForSession(sessionId, userName)**
- Проверяет кэш
- Создаёт новую тему если не найдено в кэше
- Возвращает topic_id

**4. logChatMessage(sessionId, userName, message, isUser)**
- Логирует сообщение клиента или бота
- Формат: `{icon} **{sender}** ({timestamp}):\n\n{message}`
- Пример: `👤 **Иван** (14:35):\n\nчто такое защита от БПЛА`

### Формат сообщений

#### 🆕 Приветственное сообщение в теме
```
🆕 **Новая сессия**

👤 **Клиент:** Иван
🆔 **Session ID:** `session_123456789_abc123`
⏰ **Время:** 19.03.2026 14:35:00
```

#### 👤 Сообщение от клиента
```
👤 **Иван** (14:35):

что такое защита от БПЛА
```

#### 🤖 Ответ бота
```
🤖 **AI Помощник** (14:35):

ЗОК — это Защитные Ограждающие Конструкции. 🛡️

Мы устанавливаем физические барьеры с металлической сеткой...
```

#### 📞 Детекция телефона
```
👤 **Иван** (14:36):

мой телефон +7 931 247-08-88

🤖 **AI Помощник** (14:36):

✅ **Иван, ваша заявка отправлена!**

Я передал ваш номер **+7 931 247-08-88** менеджеру.

Он свяжется с вами в течение 15 минут для уточнения деталей. 📞
```

#### ❌ Ошибка бота
```
🤖 **AI Помощник** (14:37):

❌ **Ошибка:** timeout of 30000ms exceeded
```

### Изменённые файлы
| Файл | Изменения |
|------|-----------|
| `ai-assistant/server.js` | ✅ Добавлены функции для работы с темами, логирование чата |
| `ai-assistant/.env.example` | ✅ Добавлены переменные TELEGRAM_LOGS_* |
| `ai-assistant/TELEGRAM_LOGS.md` | ✅ Создана полная документация |
| `ai-assistant/test-telegram-logs.js` | ✅ Создан тестовый скрипт |
| `ai-assistant/TEST_LOGS_GUIDE.md` | ✅ Создана инструкция по тесту |

### Тестирование

```bash
cd ai-assistant
node test-telegram-logs.js
```

**Ожидаемый результат:**
```
🎉 All tests passed successfully!
📝 You can now use the chat logging feature.
```

### Сценарии использования

#### Сценарий 1: Новый клиент начинает диалог
1. Клиент пишет первое сообщение
2. Создаётся новая тема в Telegram группе
3. Отправляется приветственное сообщение
4. Сообщение клиента логируется в тему
5. Ответ бота логируется в ту же тему

#### Сценарий 2: Клиент продолжает диалог
1. Клиент пишет следующее сообщение
2. Тема находится в кэше по session_id
3. Сообщение логируется в существующую тему

#### Сценарий 3: Клиент оставил телефон
1. Бот детектирует номер телефона
2. Отправляет лид в Telegram (основной бот)
3. Логирует ответ в тему (logs бот)

#### Сценарий 4: Ошибка бота
1. Qwen не отвечает (таймаут)
2. Бот возвращает fallback-ответ
3. Ошибка логируется в тему

### Логирование в консоли

**Успешное создание темы:**
```
✅ [TG-LOGS] Topic created: Клиент - uv2kxqi8n (ID: 12345)
```

**Ошибка создания темы:**
```
❌ [TG-LOGS] Failed to create topic: <error message>
```

**Ошибка отправки сообщения:**
```
❌ [TG-LOGS] Failed to log user message: <error message>
```

### Результат
✅ **Полная история чата** — все сообщения сохраняются в Telegram
✅ **Разделение по сессиям** — каждая сессия в отдельной теме
✅ **Удобный поиск** — можно найти по session_id или имени клиента
✅ **Асинхронное логирование** — не влияет на работу бота
✅ **Автоматическое создание тем** — не требуется ручное вмешательство

### Примечание

**Важно:**
- Кэш **in-memory** — при перезапуске сервера кэш сбрасывается
- Для каждой новой сессии создаётся новая тема
- Сообщения обрезаются до 4000 символов (ограничение Telegram)
- Ошибки логирования не прерывают работу бота

---

**Дата добавления:** 2026-03-19
**Статус:** ✅ Реализовано
**Приоритет:** Высокий
**Влияние:** Улучшение отслеживания взаимодействий с клиентами, возможность анализа диалогов

---

## ✅ Тестирование и исправление: Перезапуск сервера для применения переменных окружения (2026-03-19)

### Описание проблемы
После добавления переменных окружения `TELEGRAM_LOGS_BOT_TOKEN` и `TELEGRAM_LOGS_GROUP_ID` в `.env` файл, логирование в Telegram группу не работало — темы не создавались, сообщения не отправлялись.

### Корневая причина
**Сервер не был перезапущен** после добавления новых переменных окружения. Node.js загружает переменные из `.env` только при старте приложения.

### Решение
Выполнен перезапуск AI-ассистент сервера:

```bash
# Остановка сервера
Ctrl+C (или завершение процесса node)

# Запуск сервера заново
npm run dev:all
# или
node ai-assistant/server.js
```

### Результат после перезапуска
✅ **Тестовый скрипт пройден:**
```
🎉 All tests passed successfully!
📝 You can now use the chat logging feature.
```

✅ **Темы создаются автоматически:**
- Формат: `Клиент - {последние 8 символов session_id}`
- Пример: `Клиент - uv2kxqi8n`

✅ **Сообщения логируются:**
- 👤 Сообщения клиентов
- 🤖 Ответы бота
- ⏰ Временные метки
- 📞 Детекция телефона

✅ **Кэш работает корректно:**
- Тема создаётся один раз для сессии
- Повторные запросы используют существующую тему

### Важное примечание

**⚠️ Всегда перезапускайте сервер после изменений в `.env`!**

Node.js загружает переменные окружения из `.env` только при старте:
```javascript
dotenv.config(); // Выполняется ОДИН раз при запуске
```

**Порядок действий при добавлении переменных:**
1. Добавить переменные в `.env`
2. **Перезапустить сервер** (обязательно!)
3. Проверить работу функционала

**Команды для перезапуска:**
```bash
# Полный перезапуск (dev + api)
npm run dev:all

# Только AI сервер
node ai-assistant/server.js

# Тестирование
cd ai-assistant && node test-telegram-logs.js
```

### Изменённые файлы
| Файл | Изменения |
|------|-----------|
| `ai-assistant/.env` | ✅ Добавлены TELEGRAM_LOGS_BOT_TOKEN и TELEGRAM_LOGS_GROUP_ID |

### Логирование в консоли после перезапуска

**Успешное создание темы:**
```
✅ [TG-LOGS] Topic created: Клиент - abc123 (ID: 7)
```

**Приветственное сообщение в теме:**
```
(отправляется в Telegram)
🆕 **Новая сессия**

👤 **Клиент:** Иван
🆔 **Session ID:** `session_123_abc123`
⏰ **Время:** 19.03.2026 15:30:00
```

**Логирование сообщений:**
```
👤 **Иван** (15:30):
привет! меня зовут Иван

🤖 **AI Помощник** (15:30):
Здравствуйте, Иван! 👋 Я виртуальный ИИ-помощник...
```

### Проверка работоспособности

**1. Тестовый скрипт:**
```bash
cd ai-assistant
node test-telegram-logs.js
```

**2. Реальный запрос:**
```bash
curl -X POST http://localhost:3002/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"тест","sessionId":"test-123"}'
```

**3. Проверка в Telegram:**
- Откройте группу "Legion Hub"
- Проверьте создание новых тем
- Проверьте логирование сообщений

### Результат
✅ **Функционал полностью работоспособен** после перезапуска сервера
✅ **Темы создаются автоматически** для новых сессий
✅ **Сообщения логируются** в соответствующие темы
✅ **Кэш работает корректно** — темы не создаются повторно

---

**Дата добавления:** 2026-03-19
**Статус:** ✅ Исправлено
**Приоритет:** Критичный
**Влияние:** Работоспособность системы логирования чата

---

## ✅ Удаление услуги "Благоустройство территорий" и исправление ID (2026-03-19)

### Описание изменений
Удалена услуга "Благоустройство территорий" из всех файлов проекта. Исправлена нумерация ID услуг, чтобы они шли по порядку от 1 до 16.

### Удалённые данные

**Услуга #4 (удалена):**
- Название: Благоустройство территорий
- Slug: `blagoustroystvo-territoriy`
- Категория: Подготовительные работы
- Цена: от 1 100 ₽/м²
- Описание: Комплексное благоустройство территорий в Санкт-Петербурге, Ленинградской области и по всей России

### Изменённые файлы

| Файл | Изменения |
|------|-----------|
| `app/data/services.ts` | ✅ Удалён объект услуги (id: 4) |
| `app/components/ChatWidget.tsx` | ✅ Удалена запись из `SERVICE_NAME_MAP` |
| `app/components/ServiceSearch.tsx` | ✅ Удален плейсхолдер из массива `placeholders` |
| `ai-assistant/knowledge-base/services.json` | ✅ Удалён объект услуги, исправлены ID (5→4, 6→5, ..., 17→16) |
| `ai-assistant/QWEN.md` | ✅ Обновлена нумерация (16 услуг вместо 17) |
| `react-router.config.ts` | ✅ Удалён URL `/service/blagoustroystvo-territoriy` из `serviceUrls` |

### Исправление ID услуг

**В файле `ai-assistant/knowledge-base/services.json`:**

| Было | Стало | Услуга |
|------|-------|--------|
| id: 5 | id: 4 | Изготовление металлоконструкций |
| id: 6 | id: 5 | Монтаж технологических трубопроводов |
| id: 7 | id: 6 | Монтаж технологических площадок |
| id: 8 | id: 7 | Антикоррозийная защита |
| id: 9 | id: 8 | Устройство каменных конструкций |
| id: 10 | id: 9 | Устройство фундаментов |
| id: 11 | id: 10 | Монтаж сборного железобетона |
| id: 12 | id: 11 | Теплоизоляция оборудования |
| id: 13 | id: 12 | Теплоизоляция трубопроводов |
| id: 14 | id: 13 | Земляные работы |
| id: 15 | id: 14 | Строительство ангаров |
| id: 16 | id: 15 | Грузоперевозки |
| id: 17 | id: 16 | Огнезащита конструкций |

**В файле `app/data/services.ts`:**
- ID уже были в правильном порядке (1-16), изменений не требуется

### Актуальный список услуг (16 услуг)

#### Подготовительные работы (3)
1. **Разборка зданий и сооружений** — от 180 ₽/м³
2. **Сборка лесов** — от 150 ₽/м²
3. **Подготовка строительного участка** — от 12 000 ₽/сотка

#### Металлоконструкции (4)
4. **Изготовление металлоконструкций** — от 80 000 ₽/т
5. **Монтаж технологических трубопроводов** — от 450 ₽/п.м.
6. **Монтаж технологических площадок** — от 2 500 ₽/м²
7. **Антикоррозийная защита** — от 250 ₽/м²

#### Общестроительные работы (3)
8. **Устройство каменных конструкций** — от 1 800 ₽/м²
9. **Устройство фундаментов** — от 4 500 ₽/м³
10. **Монтаж сборного железобетона** — от 2 500 ₽/м³

#### Теплоизоляция (2)
11. **Теплоизоляция оборудования** — от 450 ₽/м²
12. **Теплоизоляция трубопроводов** — от 450 ₽/м²

#### Дополнительные услуги (4)
13. **Земляные работы** — от 350 ₽/м³
14. **Строительство ангаров** — от 10 000 ₽/м²
15. **Грузоперевозки** — от 600 ₽/час
16. **Огнезащита конструкций** — от 450 ₽/м²

### Файлы, которые не изменялись

Следующие файлы содержат исторические данные и не были изменены:
- `CHAT_BADGE_DEBUG.md` — документация
- `original_welcome.tsx`, `welcome_7b4c3aca.tsx`, `welcome_diff.txt` — резервные файлы
- `public/yml.xml`, `public/sitemap.xml` — сгенерируются заново при сборке

### Результат

✅ **Удалена услуга** — "Благоустройство территорий" исключена из всех основных файлов
✅ **Исправлены ID** — все услуги имеют корректную нумерацию от 1 до 16
✅ **Обновлена документация** — QWEN.md содержит актуальный список услуг
✅ **Обновлён роутинг** — react-router.config.ts не содержит удалённого URL
✅ **Обновлён поиск** — ServiceSearch.tsx не содержит плейсхолдер удалённой услуги
✅ **Обновлён чат-бот** — ChatWidget.tsx не содержит маппинг для удалённой услуги

### Примечание

**Важно:** После удаления услуги рекомендуется:
1. Пересобрать проект (`npm run build`)
2. Перегенерировать sitemap.xml и yml.xml при необходимости
3. Проверить, что все ссылки на `/service/blagoustroystvo-territoriy` возвращают 404 или редирект

---

**Дата добавления:** 2026-03-19
**Статус:** ✅ Выполнено
**Приоритет:** Высокий
**Влияние:** Актуализация каталога услуг, улучшение консистентности данных

---

## ✅ Исправлено: Бот называл 17 услуг вместо 16 (2026-03-19)

### Описание проблемы
После удаления услуги "Благоустройство территорий" бот продолжал говорить клиенту, что у компании "17 строительных услуг".

**Пример ответа бота:**
```
Мы предлагаем 17 строительных услуг, включая нашу ключевую услугу — установку систем защиты от БПЛА (ЗОК)...
```

### Решение
Обновлён промпт для Qwen в файле `ai-assistant/server.js`:

#### 1. Добавлена явная инструкция о количестве услуг
```javascript
✓ ВАЖНО: У компании 16 строительных услуг (НЕ 17!) — не называй точное количество, если клиент не спрашивает напрямую
```

#### 2. Добавлено количество услуг в секцию [КОМПАНИЯ]
```javascript
[КОМПАНИЯ]
📞 ${companyInfo.phone}
⏰ 9:00-18:00
🏆 Опыт: ${companyInfo.experience}
🛡️ Гарантия: ${companyInfo.guarantee}
📋 Количество услуг: 16 (включая ЗОК)
```

### Изменённые файлы
| Файл | Изменения |
|------|-----------|
| `ai-assistant/server.js` | ✅ Добавлена инструкция "16 услуг (НЕ 17!)", добавлено количество в секцию [КОМПАНИЯ] |

### Результат
✅ **Бот называет правильное количество** — 16 услуг вместо 17
✅ **Явная инструкция** — бот не называет количество, если клиент не спрашивает напрямую
✅ **Контекст в промпте** — количество услуг указано в секции [КОМПАНИЯ]

---

**Дата добавления:** 2026-03-19
**Статус:** ✅ Исправлено
**Приоритет:** Высокий
**Влияние:** Актуальность информации для клиентов

---

## 🐛 В ПРОЦЕССЕ: Обновление заявки не отправляется в Telegram (2026-03-20 22:00)

### Описание проблемы
При обновлении номера телефона в существующей заявке бот правильно определяет что заявка уже была отправлена (находит LEAD_SENT в кэше), но **не отправляет обновление в Telegram**.

**Сценарий:**
1. Клиент: `89213213232 Антон` → 🔥 Новая заявка #1774033444981 ✅
2. Клиент: `А блин, у меня другой номер 7921432434` → 💾 [CACHE] Found existing lead: 1774033444981 ✅
3. Бот отвечает: "✅ Телефон обновлён: +7921432434" ✅
4. **В Telegram НЕ приходит обновление** ❌

### Что уже проверено
✅ LEAD_SENT сохраняется в сессию и кэш
✅ Кэш находит existingLeadId при втором сообщении
✅ extractPhoneNumber нашёл номер 7921432434 (10 цифр)
✅ Бот отвечает что номер обновлён
❌ Отправка в Telegram не происходит

### Логи
```
2026-03-20T19:04:04: 📱 [CHAT] Mobile phone detected - sending lead
2026-03-20T19:04:04: 📱 [CHAT] Sending to Telegram: { phone: '+79213213232', isUpdate: false, leadId: '1774033444981' }
2026-03-20T19:04:05: 💾 [SESSION+CACHE] LEAD_SENT saved: 1774033444981
2026-03-20T19:04:08: ✅ [CHAT] Lead successfully sent to Telegram

2026-03-20T19:04:20: 💾 [CACHE] Found existing lead: 1774033444981
# НЕТ логов "📱 [CHAT] Mobile phone detected" для второго сообщения!
# НЕТ логов "📱 [CHAT] Sending to Telegram" для обновления!
```

### Гипотезы
1. **Номер 7921432434 не определяется как mobile** - паттерн не срабатывает для 10 цифр без +7/8
2. **Бот уходит в Qwen вместо обработки телефона** - phoneType !== 'mobile'
3. **sendLeadToTelegram не вызывается** - логика обновления не срабатывает

### Предпринятые действия
1. ✅ Добавлен in-memory кэш (sessionLeadCache) для избежания race conditions
2. ✅ Добавлены паттерны для 10 цифр (9XXXXXXXXX) и 11 цифр (7XXXXXXXXXX/8XXXXXXXXXX)
3. ✅ Добавлено логирование extractPhoneNumber

### Следующие шаги
1. Проверить работает ли новый паттерн для 7921432434
2. Добавить логирование phoneType для второго сообщения
3. Проверить вызывается ли sendLeadToTelegram при isUpdate=true

---

**Дата добавления:** 2026-03-20 22:00
**Статус:** 🐛 В ПРОЦЕССЕ ДЕБАГА
**Приоритет:** Критичный



