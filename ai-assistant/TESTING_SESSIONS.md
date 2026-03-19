# 🧪 Тестирование долгосрочных сессий

## Быстрая проверка (2 минуты)

### 1. Откройте чат на сайте
```
http://localhost:5173
```

### 2. Откройте консоль браузера (F12)
```javascript
// Проверить sessionId
console.log('Session ID:', localStorage.getItem('legion_chat_session_id'));
```

### 3. Напишите сообщение в чат
```
сколько стоит монтаж сайдинга?
```

### 4. Проверьте API
```bash
# Получить sessionId из браузера
SESSION_ID="session_$(date +%s)_test"

# Или из localStorage (скопируйте значение)

# Запросить историю
curl http://localhost:3002/api/session/YOUR_SESSION_ID | jq .
```

### 5. Закройте браузер полностью

### 6. Откройте браузер снова, перейдите на сайт
```
http://localhost:5173
```

### 7. Откройте чат — сообщения должны восстановиться!

---

## Проверка через консоль

### Логи браузера
```javascript
// Должны увидеть:
[CHAT] Reusing existing sessionId: session_abc123
[CHAT] Loading session history for: session_abc123
[CHAT] Restoring 2 messages from session
```

### Логи сервера
```bash
# Должны увидеть:
💾 [SESSION] Messages saved to persistent storage
[CHAT] Loading session history for: session_abc123
```

### Файл сессий
```bash
# Windows
type ai-assistant\sessions\chat-history.json

# Linux/Mac
cat ai-assistant/sessions/chat-history.json
```

---

## Проверка API endpoints

### 1. Health check
```bash
curl http://localhost:3002/api/health
```

**Ожидаемый ответ:**
```json
{
  "status": "ok",
  "services": 16,
  "timestamp": "2026-03-19T17:00:00.000Z"
}
```

### 2. Получить сессию
```bash
curl http://localhost:3002/api/session/session_test123
```

**Ожидаемый ответ (новая сессия):**
```json
{
  "status": "ok",
  "sessionId": "session_test123",
  "messages": [],
  "sessionExists": false,
  "timestamp": "2026-03-19T17:00:00.000Z"
}
```

**Ожидаемый ответ (существующая сессия):**
```json
{
  "status": "ok",
  "sessionId": "session_abc123",
  "sessionExists": true,
  "messages": [
    {
      "role": "КЛИЕНТ",
      "content": "сколько стоит?",
      "timestamp": 1710857000000
    },
    {
      "role": "AI",
      "content": "от 350 руб/м²...",
      "timestamp": 1710857010000
    }
  ],
  "userName": "Клиент",
  "createdAt": 1710857000000,
  "updatedAt": 1710857100000,
  "timestamp": "2026-03-19T17:00:00.000Z"
}
```

### 3. Статистика кэша
```bash
curl http://localhost:3002/api/cache/stats | jq .cache
```

**Ожидаемый ответ:**
```json
{
  "qwen": {
    "hits": 5,
    "misses": 10,
    "hitRate": "33.3%",
    "size": 8
  },
  "sentiment": {
    "hits": 3,
    "misses": 12,
    "hitRate": "20.0%",
    "size": 10
  }
}
```

---

## Очистка сессий

### Очистить localStorage (браузер)
```javascript
localStorage.removeItem('legion_chat_session_id')
location.reload()
```

### Очистить все сессии (сервер)
```bash
# Windows
del ai-assistant\sessions\chat-history.json

# Linux/Mac
rm ai-assistant/sessions/chat-history.json
```

### Очистить кэш (API)
```bash
curl -X POST http://localhost:3002/api/cache/clear
```

---

## Проверка Telegram логов

### 1. Откройте Telegram группу

### 2. Напишите сообщение в чате на сайте

### 3. Проверьте Telegram — должна создаться тема:
```
Клиент - abc12345
├── 🆕 Новая сессия
├── 👤 Клиент (14:30): сколько стоит?
└── 🤖 AI Помощник (14:31): от 350 руб/м²...
```

### 4. Напишите ещё одно сообщение

### 5. Проверьте Telegram — сообщения должны быть в ОДНОЙ теме:
```
✅ Правильно:
Клиент - abc12345
├── Сообщение 1
├── Сообщение 2
└── Сообщение 3

❌ Неправильно:
Клиент - abc12345 (тема 1)
└── Сообщение 1

Клиент - abc12345 (тема 2)
└── Сообщение 2
```

---

## Диагностика проблем

### Проблема: Сообщения не сохраняются

**Проверка 1:** Сервер запущен?
```bash
curl http://localhost:3002/api/health
```

**Проверка 2:** Файл сессий существует?
```bash
ls -la ai-assistant/sessions/
```

**Проверка 3:** Права на запись?
```bash
# Linux/Mac
chmod 755 ai-assistant/sessions/
```

---

### Проблема: Сессия не восстанавливается

**Проверка 1:** sessionId в localStorage?
```javascript
console.log(localStorage.getItem('legion_chat_session_id'))
```

**Проверка 2:** Сессия в файле?
```bash
cat ai-assistant/sessions/chat-history.json | jq .sessions
```

**Проверка 3:** API возвращает данные?
```bash
curl http://localhost:3002/api/session/YOUR_SESSION_ID
```

---

### Проблема: Две темы в Telegram

**Проверка 1:** sessionId одинаковый?
```javascript
// До закрытия
console.log('Before:', localStorage.getItem('legion_chat_session_id'))

// После открытия
console.log('After:', localStorage.getItem('legion_chat_session_id'))
```

**Проверка 2:** Логи сервера
```bash
# Должны увидеть:
💾 [TG-LOGS] Topic cache HIT for session abc12345

# Если видите:
🆕 [TG-LOGS] Topic cache MISS - creating new topic
# Значит sessionId разный
```

---

## Чеклист успешного тестирования

- [ ] SessionId сохраняется в localStorage
- [ ] При закрытии/открытии браузера sessionId тот же
- [ ] Сообщения сохраняются в chat-history.json
- [ ] При загрузке страницы сообщения восстанавливаются
- [ ] API /api/session/:sessionId возвращает данные
- [ ] В Telegram создаётся ОДНА тема на сессию
- [ ] Авто-очистка работает (сессии >30 дней удаляются)

---

**Дата создания:** 2026-03-19  
**Обновление:** 2026-03-19T17:00:00.000Z
