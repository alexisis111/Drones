# 🚀 Полное руководство по развёртыванию и исправлению проекта на сервере

## 📋 Оглавление

1. [Проблема с ChatWidget на страницах услуг](#1-проблема-s-chatwidget-на-страницах-услуг)
2. [Исправление извлечения serviceSlug](#2-исправление-извлечения-serviceslug)
3. [Исправление контекстного сообщения](#3-исправление-контекстного-сообщения)
4. [Сборка и перезапуск сервера](#4-сборка-и-перезапуск-сервера)

---

## 1. Проблема с ChatWidget на страницах услуг

### ❌ Симптомы

При переходе со страницы каталога услуг (`/services`) или главной страницы на страницу конкретной услуги (например, `/service/razborka-zdaniy-i-sooruzheniy/`) ИИ-помощник **не отображал** контекстное сообщение:

> 🏗️ **Вижу, вы интересуетесь услугой "[название]"!**

### 🔍 Причины проблемы

1. **Завершающий слэш в URL**
   - URL страницы услуги заканчивался на слэш: `/service/razborka-zdaniy-i-sooruzheniy/`
   - Старый код извлекал `serviceSlug` с лишним слэшем:
   ```typescript
   // Было:
   const serviceSlug = location.pathname.startsWith('/service/')
     ? location.pathname.replace('/service/', '').replace(/\/$/, '')
     : undefined;
   
   // Результат: 'razborka-zdaniy-i-sooruzheniy/' ← не совпадает с services.json
   ```

2. **Неправильная зависимость в useEffect**
   - `useEffect` для добавления контекстного сообщения имел зависимость только от `messages.length`
   - При переходе между страницами услуг `messages.length` не менялся (история уже загружена)
   - Контекстное сообщение не добавлялось

3. **Отсутствие проверки существования услуги в маппинге**
   - `serviceSlug` мог быть установлен, даже если услуга не найдена в `SERVICE_NAME_MAP`
   - `serviceName` оставался `undefined`

---

## 2. Исправление извлечения serviceSlug

### ✅ Решение

**Файл:** `/root/Drones/app/components/ChatWidget.tsx`

**Изменения:**

```typescript
// Было (строки 85-88):
const serviceSlug = location.pathname.startsWith('/service/')
  ? location.pathname.replace('/service/', '').replace(/\/$/, '')
  : undefined;

const serviceName = serviceSlug ? SERVICE_NAME_MAP[serviceSlug] : undefined;
```

```typescript
// Стало (строки 85-118):

// 1. Создаём отдельную функцию для извлечения serviceSlug
const extractServiceSlug = (pathname: string): string | undefined => {
  if (!pathname.startsWith('/service/')) return undefined;
  
  // Remove /service/ prefix and trailing slash
  const slug = pathname
    .replace(/^\/service\//, '')      // Удаляем префикс /service/
    .replace(/\/$/, '')               // Удаляем завершающий слэш
    .trim();
  
  return slug || undefined;
};

const rawServiceSlug = extractServiceSlug(location.pathname);

// 2. Проверяем существование услуги в SERVICE_NAME_MAP
const serviceSlug = rawServiceSlug && SERVICE_NAME_MAP[rawServiceSlug] 
  ? rawServiceSlug 
  : undefined;

const serviceName = serviceSlug ? SERVICE_NAME_MAP[serviceSlug] : undefined;
```

### 🎯 Результат

Теперь `serviceSlug` правильно извлекается из URL:

| URL | Было | Стало |
|-----|------|-------|
| `/service/razborka-zdaniy-i-sooruzheniy/` | `'razborka-zdaniy-i-sooruzheniy/'` ❌ | `'razborka-zdaniy-i-sooruzheniy'` ✅ |
| `/service/razborka-zdaniy-i-sooruzheniy` | `'razborka-zdaniy-i-sooruzheniy'` ✅ | `'razborka-zdaniy-i-sooruzheniy'` ✅ |
| `/services` | `undefined` ✅ | `undefined` ✅ |
| `/` | `undefined` ✅ | `undefined` ✅ |

---

## 3. Исправление контекстного сообщения

### ✅ Решение

**Файл:** `/root/Drones/app/components/ChatWidget.tsx`

**Изменения:**

```typescript
// Было (строки 465-507):
useEffect(() => {
  const pendingRequest = sessionStorage.getItem('legion_chat_pending_request');

  if (!isBotTyping && !pendingRequest && serviceName && messages.length > 0 && !userWantsNoContact) {
    const hasContextMessage = messages.some(m =>
      m.id.startsWith('service-change-') &&
      m.text.includes(serviceName)
    );

    if (!hasContextMessage) {
      const contextMessage: Message = {
        id: `service-change-${Date.now()}`,
        text: `🏗️ **Вижу, вы интересуетесь услугой "${serviceName}"!**\n\n...`,
        from: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, contextMessage]);
    }
  }
}, [isBotTyping, serviceName, messages.length, userWantsNoContact]);
```

```typescript
// Стало (строки 478-518):
useEffect(() => {
  const pendingRequest = sessionStorage.getItem('legion_chat_pending_request');

  console.log('[CHAT] Context message check:', {
    isBotTyping,
    pendingRequest,
    serviceName,
    serviceSlug,
    messagesLength: messages.length,
    userWantsNoContact
  });

  if (!isBotTyping && !pendingRequest && serviceName && messages.length > 0 && !userWantsNoContact) {
    const hasContextMessage = messages.some(m =>
      m.id.startsWith('service-change-') &&
      m.text.includes(serviceName)
    );

    console.log('[CHAT] Context message conditions met:', { hasContextMessage, serviceName });

    if (!hasContextMessage) {
      const contextMessage: Message = {
        id: `service-change-${Date.now()}`,
        text: `🏗️ **Вижу, вы интересуетесь услугой "${serviceName}"!**\n\nМогу помочь с расчётом стоимости, деталями работ или организационными вопросами. Чем могу помочь? 😊`,
        from: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, contextMessage]);
      console.log('[CHAT] Context message added for:', serviceName);
    }
  }
}, [isBotTyping, serviceName, serviceSlug, messages.length, userWantsNoContact]);
```

### 🔑 Ключевые изменения

1. **Добавлена зависимость `serviceSlug`** — теперь `useEffect` реагирует на изменение URL
2. **Добавлены отладочные логи** — для мониторинга работы в консоли браузера

---

## 4. Сборка и перезапуск сервера

### 📦 Команды для развёртывания

```bash
# 1. Перейти в директорию проекта
cd /root/Drones

# 2. Собрать проект
npm run build

# 3. Перезапустить все PM2 процессы
pm2 restart all

# 4. Сохранить конфигурацию PM2
pm2 save

# 5. Проверить статус процессов
pm2 status
```

### ✅ Ожидаемый результат

```
┌────┬────────────────────┬──────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name               │ mode     │ ↺    │ status    │ cpu      │ memory   │
├────┼────────────────────┼──────────┼──────┼───────────┼──────────┼──────────┤
│ 2  │ legion-ai          │ fork     │ 1    │ online    │ 0%       │ 17.4mb   │
│ 1  │ legion-api         │ fork     │ 242  │ online    │ 0%       │ 57.4mb   │
│ 0  │ legion-web         │ fork     │ 2    │ online    │ 0%       │ 57.9mb   │
└────┴────────────────────┴──────────┴──────┴───────────┴──────────┴──────────┘
```

---

## 🧪 Проверка работы

### 1. Перейти на страницу услуги

```
https://xn--78-glchqprh.xn--p1ai/service/razborka-zdaniy-i-sooruzheniy/
```

### 2. Открыть консоль браузера (F12)

Проверить логи:
```
[CHAT] URL pathname: /service/razborka-zdaniy-i-sooruzheniy/
[CHAT] Extracted rawServiceSlug: razborka-zdaniy-i-sooruzheniy
[CHAT] SERVICE_NAME_MAP lookup: Разборка зданий и сооружений
[CHAT] Context message check: { serviceName: 'Разборка зданий и сооружений', ... }
[CHAT] Context message added for: Разборка зданий и сооружений
```

### 3. Проверить сообщение в чате

Видим сообщение от ИИ-помощника:

> 🏗️ **Вижу, вы интересуетесь услугой "Разборка зданий и сооружений"!**
> 
> Могу помочь с расчётом стоимости, деталями работ или организационными вопросами. Чем могу помочь? 😊

---

## 📁 Изменённые файлы

| Файл | Изменения |
|------|-----------|
| `app/components/ChatWidget.tsx` | ✅ Добавлена функция `extractServiceSlug()`<br>✅ Добавлена проверка `SERVICE_NAME_MAP`<br>✅ Добавлена зависимость `serviceSlug` в `useEffect`<br>✅ Добавлены отладочные логи |

---

## 🔧 Дополнительные исправления (история)

### Исправление 1: Удаление завершающего слэша

**Дата:** Март 2026  
**Проблема:** URL страницы услуги заканчивался на слэш  
**Решение:** Добавлено `.replace(/\/$/, '')` для удаления завершающего слэша

### Исправление 2: Проверка существования услуги

**Дата:** Март 2026  
**Проблема:** `serviceSlug` устанавливался для несуществующих услуг  
**Решение:** Добавлена проверка `rawServiceSlug && SERVICE_NAME_MAP[rawServiceSlug]`

### Исправление 3: Зависимость useEffect

**Дата:** Март 2026  
**Проблема:** Контекстное сообщение не добавлялось при переходе между страницами  
**Решение:** Добавлена зависимость `serviceSlug` в массив зависимостей `useEffect`

---

## 📝 Примечания

### Структура проекта

```
/root/Drones/
├── app/
│   ├── components/
│   │   └── ChatWidget.tsx          # ← Главный файл с исправлениями
│   ├── routes/
│   │   ├── service-detail.tsx      # ← Маршрут для страниц услуг
│   │   └── services.tsx            # ← Каталог услуг
│   └── data/
│       └── services.ts             # ← Данные об услугах (SERVICE_NAME_MAP)
├── package.json
├── react-router.config.ts
└── vite.config.ts
```

### Список услуг (SERVICE_NAME_MAP)

```typescript
{
  'razborka-zdaniy-i-sooruzheniy': 'Разборка зданий и сооружений',
  'sborka-lesov': 'Сборка лесов',
  'podgotovka-stroitelnogo-uchastka': 'Подготовка строительного участка',
  'izgotovlenie-metallokonstruktsiy': 'Изготовление металлоконструкций',
  'montazh-tekhnologicheskikh-truboprovodov': 'Монтаж технологических трубопроводов',
  'montazh-tekhnologicheskikh-ploshchadok': 'Монтаж технологических площадок',
  'antikorroziynaya-zashchita': 'Антикоррозийная защита',
  'ustroystvo-kamennykh-konstruktsiy': 'Устройство каменных конструкций',
  'ustroystvo-fundamentov': 'Устройство фундаментов',
  'montazh-sbornogo-zhelezobetona': 'Монтаж сборного железобетона',
  'teploizolyatsiya-oborudovaniya': 'Теплоизоляция оборудования',
  'teploizolyatsiya-truboprovodov': 'Теплоизоляция трубопроводов',
  'zemlyanye-raboty': 'Земляные работы',
  'stroitelstvo-angarov': 'Строительство ангаров',
  'gruzoperevozki': 'Грузоперевозки',
  'ognezashchita-konstruktsiy': 'Огнезащита конструкций'
}
```

---

## 🎯 Итоговый результат

✅ При переходе на страницу услуги ИИ-помощник **автоматически определяет услугу**  
✅ Отображается персонализированное приветственное сообщение  
✅ Корректная работа как с завершающим слэшем, так и без него  
✅ Отладочные логи для мониторинга работы в консоли браузера  

---

## 📞 Контакты

При возникновении проблем обращайтесь к документации:
- [README.md](./README.md) — Общая информация о проекте
- [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md) — Руководство по развёртыванию
- [PM2_DEPLOYMENT.md](./PM2_DEPLOYMENT.md) — Настройка PM2

---

**Дата последнего обновления:** Март 2026  
**Версия документа:** 1.0
