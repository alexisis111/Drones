# 🚀 Production Deployment Guide

**Дата:** 2026-03-19  
**Статус:** ✅ Готово к продакшену

---

## 📋 Требования

### Сервер

- **OS:** Windows Server / Linux
- **Node.js:** v20.18+ 
- **RAM:** 2GB+ (рекомендуется 4GB)
- **CPU:** 2+ ядра
- **Диск:** 10GB+ (для сессий и логов)

### Зависимости

```bash
# Проверить Node.js
node --version  # v20.18+

# Проверить Qwen CLI
qwen --version

# Установить зависимости проекта
npm install --production
```

---

## 🔧 Сборка

### 1. Сборка frontend

```bash
npm run build
```

**Результат:**
- `build/client/` — статические файлы (HTML, CSS, JS)
- `build/server/` — SSR сервер

---

### 2. Проверка переменных окружения

Создайте `.env` на сервере:

```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id

# Telegram Logs Group Configuration
TELEGRAM_LOGS_BOT_TOKEN=your_logs_bot_token
TELEGRAM_LOGS_GROUP_ID=your_logs_group_id

# Server Ports
PORT=3001
AI_ASSISTANT_PORT=3002
```

---

## ▶️ Запуск в продакшене

### Вариант 1: Все сервисы вместе (для тестирования)

```bash
npm run start:all
```

Запускает:
- Web сервер (порт 3000)
- API сервер (порт 3001)
- AI Assistant (порт 3002)

⚠️ **Не рекомендуется для продакшена** — все процессы в одном терминале.

---

### Вариант 2: Отдельные сервисы (рекомендуется)

```bash
# Web сервер
npm run start:web

# API сервер (в другом терминале)
npm run start:api

# AI Assistant (в третьем терминале)
npm run start:ai
```

---

### Вариант 3: PM2 (продакшен)

**Установка PM2:**
```bash
npm install -g pm2
```

**Запуск:**
```bash
# Web сервер
pm2 start server.js --name legion-web

# API сервер
pm2 start api-server.js --name legion-api

# AI Assistant
pm2 start ai-assistant/server.js --name legion-ai

# Сохранить конфигурацию
pm2 save

# Автозапуск при загрузке
pm2 startup
```

**Команды управления:**
```bash
# Статус
pm2 status

# Логи
pm2 logs legion-web

# Перезапуск
pm2 restart legion-ai

# Остановить
pm2 stop legion-api

# Удалить
pm2 delete legion-web
```

---

### Вариант 4: Docker (продакшен)

**Dockerfile уже существует** — используйте его:

```bash
# Сборка образа
docker build -t legion-site .

# Запуск
docker run -d \
  -p 3000:3000 \
  -p 3001:3001 \
  -p 3002:3002 \
  --env-file .env \
  --name legion-site \
  legion-site
```

---

## 📁 Хранение данных

### Сессии (JSON-файлы)

**Путь:** `ai-assistant/sessions/chat-history.json`

**Проблемы продакшена:**
- Файл растёт бесконечно
- Нет синхронизации между серверами
- Может затереться при деплое

**Решение (будущее):**
- MongoDB для сессий
- Redis для кэша
- S3 для истории

**Сейчас:**
- Авто-очистка каждые 30 дней ✅
- Резервное копирование файла ⚠️

---

### Логи Telegram

**Путь:** `ai-assistant/sessions/`

Хранятся:
- `chat-history.json` — история сообщений
- `operator-modes.json` — режимы операторов (удалено)
- `topic-mapping.json` — маппинг тем (удалено)

---

## 🔍 Мониторинг

### Проверка здоровья

```bash
# Web сервер
curl http://localhost:3000/api/health

# API сервер
curl http://localhost:3001/api/health

# AI Assistant
curl http://localhost:3002/api/health
```

**Ответ:**
```json
{
  "status": "ok",
  "services": 16,
  "timestamp": "2026-03-19T21:00:00.000Z"
}
```

---

### Логи

```bash
# PM2
pm2 logs legion-web

# Docker
docker logs legion-site

# Node.js (если не PM2)
# Логи выводятся в stdout/stderr
```

---

### Статистика кэша

```bash
curl http://localhost:3002/api/cache/stats
```

**Ответ:**
```json
{
  "status": "ok",
  "cache": {
    "qwen": {
      "hits": 150,
      "misses": 50,
      "hitRate": "75.0%",
      "size": 45
    },
    "sentiment": {
      "hits": 80,
      "misses": 70,
      "hitRate": "53.3%",
      "size": 60
    }
  }
}
```

---

## ⚠️ Критичные моменты

### 1. **Qwen CLI должен быть доступен**

AI Assistant использует `qwen` команду:

```bash
# Проверить
qwen --version

# Если нет — установить
# Windows: скачать с https://github.com/QwenLM/Qwen
# Linux: npm install -g @qwen/cli
```

---

### 2. **localStorage работает также**

ChatWidget использует localStorage:

```javascript
localStorage.setItem('legion_chat_session_id', sessionId);
```

✅ **Работает идентично dev-режиму** — браузер клиента не зависит от сборки.

---

### 3. **Порты должны быть открыты**

```
3000 — Web сервер (frontend)
3001 — API сервер (Telegram webhook)
3002 — AI Assistant (Qwen CLI)
```

**Firewall:**
```bash
# Windows Firewall
netsh advfirewall firewall add rule name="Legion Web" dir=in action=allow protocol=TCP localport=3000
netsh advfirewall firewall add rule name="Legion API" dir=in action=allow protocol=TCP localport=3001
netsh advfirewall firewall add rule name="Legion AI" dir=in action=allow protocol=TCP localport=3002
```

---

## 🧪 Тестирование продакшена

### 1. Проверка сессий

```javascript
// Консоль браузера
console.log(localStorage.getItem('legion_chat_session_id'));
// session_abc123

// Закрыть браузер, открыть снова
console.log(localStorage.getItem('legion_chat_session_id'));
// session_abc123 (тот же!)
```

---

### 2. Проверка API

```bash
# Получить историю сессии
curl http://localhost:3002/api/session/session_abc123
```

---

### 3. Проверка Telegram

1. Отправить сообщение в чате
2. Проверить Telegram — должно появиться в теме
3. Проверить логи — `✅ [TG-LOGS] Topic created`

---

## 📊 Производительность

### Ожидаемые метрики

| Метрика | Значение |
|---------|----------|
| Время ответа (кэш) | <100 мс |
| Время ответа (Qwen) | 5-30 сек |
| Hit rate кэша | >50% |
| Размер сессии (10 сообщений) | ~1 KB |
| 1000 сессий | ~1 MB |

---

## 🐛 Диагностика

### Проблема: AI Assistant не запускается

**Проверка:**
```bash
# Порт занят?
netstat -ano | findstr :3002

# Qwen установлен?
qwen --version

# .env существует?
type .env
```

---

### Проблема: Сессии не сохраняются

**Проверка:**
```bash
# Папка существует?
dir ai-assistant\sessions

# Права на запись?
icacls ai-assistant\sessions
```

---

### Проблема: Telegram не отправляет уведомления

**Проверка:**
```bash
# Токен правильный?
curl "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getMe"

# Chat ID существует?
curl "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getChat?chat_id=$TELEGRAM_CHAT_ID"
```

---

## 📝 Changelog

### 2026-03-19 — Initial Production Release

- ✅ Долгосрочные сессии (localStorage + JSON)
- ✅ Кэширование Qwen (1 час / 30 мин)
- ✅ Telegram логи (1 сессия = 1 тема)
- ✅ Авто-очистка сессий (30 дней)
- ✅ PM2 конфигурация
- ✅ Docker поддержка

---

## 📞 Поддержка

**Вопросы по деплою:** @LeadDeveloper

**Документация:**
- [Cache System](./ai-assistant/CACHE_SYSTEM.md)
- [Long-term Sessions](./ai-assistant/LONG_TERM_SESSIONS.md)
- [Testing Sessions](./ai-assistant/TESTING_SESSIONS.md)

---

**Дата создания:** 2026-03-19  
**Последнее обновление:** 2026-03-19T21:30:00.000Z  
**Версия:** 1.0.0
