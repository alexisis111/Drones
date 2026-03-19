# 🤖 AI Помощник для сайта ЛЕГИОН

## 📋 Описание

Виртуальный помощник для консультаций клиентов по строительным услугам компании ООО «ЛЕГИОН».

## 🚀 Запуск

### Локальная разработка

```bash
# Запуск основного сайта + AI сервера
npm run dev:all

# ИЛИ запуск по отдельности:
# Сайт:
npm run dev

# AI сервер:
npm run api
```

### Production

```bash
# Запуск основного сайта + AI сервера
npm run start:all

# ИЛИ по отдельности:
# Сайт:
npm run start

# AI сервер:
npm run api
```

## 📡 API Endpoints

### Chat Endpoint
```
POST /api/assistant/chat
Content-Type: application/json

Body:
{
  "message": "Сколько стоит разборка здания?",
  "serviceSlug": "razborka-zdaniy-i-sooruzheniy",
  "sessionId": "unique-session-id",
  "history": [
    {"role": "КЛИЕНТ", "content": "Предыдущий вопрос"},
    {"role": "ПОМОЩНИК", "content": "Предыдущий ответ"}
  ]
}

Response:
{
  "response": "Ответ ИИ",
  "sessionId": "unique-session-id",
  "serviceContext": {
    "title": "Разборка зданий и сооружений",
    "price": "от 180 ₽/м³",
    "url": "/service/razborka-zdaniy-i-sooruzheniy"
  }
}
```

### Health Check
```
GET /api/assistant/health

Response:
{
  "status": "ok",
  "services": 17,
  "qwenAvailable": true,
  "timestamp": "2026-03-15T12:00:00.000Z"
}
```

### Get All Services
```
GET /api/assistant/services

Response:
{
  "services": [
    {
      "id": 1,
      "slug": "razborka-zdaniy-i-sooruzheniy",
      "title": "Разборка зданий и сооружений",
      ...
    },
    ...
  ]
}
```

## 🧠 Как это работает

### 1. **Запрос от клиента**
Клиент пишет вопрос в чат на странице услуги.

### 2. **Определение контекста**
Система автоматически определяет:
- Какая услуга открыта (по URL)
- Загружает информацию об услуге из базы знаний

### 3. **Формирование промпта**
Создаётся промпт для Qwen включающий:
- Информацию о компании
- Контекст текущей услуги
- Историю диалога
- Вопрос клиента

### 4. **Ответ от ИИ**
Qwen генерирует ответ на основе промпта и возвращает клиенту.

### 5. **Fallback режим**
Если Qwen недоступен, используется простой генератор ответов на основе ключевых слов.

## 📁 Структура

```
ai-assistant/
├── knowledge-base/
│   └── services.json       # База знаний (17 услуг + FAQ + компания)
├── QWEN.md                 # Инструкции для ИИ
├── package.json            # Зависимости
└── server.js               # Сервер (если запускается отдельно)

app/
└── components/
    └── ChatWidget.tsx      # Компонент чата для сайта
```

## ⚙️ Настройка

### Переменные окружения (.env)

```bash
# Telegram (для заявок)
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id

# Qwen API (опционально, если используется облачная версия)
QWEN_API_KEY=your_api_key
```

## 🎯 Интеграция с сайтом

### На странице услуги

```tsx
import ChatWidget from './ChatWidget';

function ServicePage({ service }) {
  return (
    <div>
      {/* Контент страницы */}
      
      <ChatWidget 
        serviceSlug={service.slug}
        serviceName={service.title}
      />
    </div>
  );
}
```

## 🧪 Тестирование

### 1. Запустить сервер
```bash
npm run api
```

### 2. Проверить health
```bash
curl http://localhost:3001/api/assistant/health
```

### 3. Отправить тестовое сообщение
```bash
curl -X POST http://localhost:3001/api/assistant/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Сколько стоит разборка здания?",
    "serviceSlug": "razborka-zdaniy-i-sooruzheniy"
  }'
```

## 🚀 Деплой

### На сервере с PM2

```bash
# Установка зависимостей
cd ai-assistant
npm install

# Запуск в PM2
pm2 start server.js --name legion-ai

# ИЛИ запуск через api-server.js в корне
pm2 start api-server.js --name legion-api

# Сохранить конфигурацию
pm2 save
```

## 📊 Метрики

- **Время ответа**: < 3 секунд
- **Точность ответов**: > 90%
- **Конверсия в заявку**: целевой показатель 15-20%

## 🔧 Расширение

### Добавление новой услуги

1. Откройте `ai-assistant/knowledge-base/services.json`
2. Добавьте новый объект в массив `services`:
```json
{
  "id": 18,
  "slug": "novaya-usluga",
  "title": "Название услуги",
  "category": "Категория",
  "description": "Описание",
  "price": "от XXX ₽",
  "details": [...],
  "benefits": [...],
  "stages": [...],
  "url": "/service/novaya-usluga"
}
```
3. Сохраните файл
4. Перезапустите сервер

## 📞 Поддержка

По вопросам работы AI-помощника обращайтесь к разработчику.
