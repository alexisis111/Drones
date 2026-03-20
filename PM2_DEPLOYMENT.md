# 🚀 Production Deployment с PM2

**Дата:** 2026-03-19
**Статус:** ✅ Развёрнуто и работает

---

## 📋 Архитектура

```
┌─────────────────────────────────────────────────────────┐
│                      Nginx (443/80)                      │
│  ┌──────────────────────────────────────────────────┐   │
│  │ location /api/ → proxy_pass http://localhost:3001│   │
│  │ location /     → proxy_pass http://localhost:3000│   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
         │                    │
         ▼                    ▼
┌─────────────────┐  ┌─────────────────┐
│  legion-web     │  │  legion-api     │
│  (port 3000)    │  │  (port 3001)    │
│  React Router   │  │  Express API    │
│  SSR Server     │  │  + Telegram     │
└─────────────────┘  └─────────────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │  legion-ai      │
                     │  (port 3002)    │
                     │  AI Assistant   │
                     │  + Qwen CLI     │
                     └─────────────────┘
```

---

## 🔧 Компоненты

### 1. Nginx

**Конфигурация:** `/etc/nginx/sites-available/drones`

- **Порт 443 (HTTPS)** — основной трафик
- **Порт 80** — редирект на HTTPS
- **`location /api/`** — прокси на API сервер (порт 3001)
- **`location /`** — прокси на Web сервер (порт 3000)

### 2. PM2 Processes

| Name | Port | Script | Description |
|------|------|--------|-------------|
| `legion-web` | 3000 | `./server.js` | Web сервер (React Router SSR) |
| `legion-api` | 3001 | `./api-server.js` | API сервер (Telegram webhook, AI proxy) |
| `legion-ai` | 3002 | `./ai-assistant/server.js` | AI ассистент (Qwen CLI) |

---

## 📁 Файлы

### PM2 Configuration

**Файл:** `ecosystem.config.cjs`

```javascript
module.exports = {
  apps: [
    {
      name: 'legion-web',
      script: './server.js',
      exec_mode: 'fork',
      max_memory_restart: '1G',
      env: { NODE_ENV: 'production', PORT: 3000 }
    },
    {
      name: 'legion-api',
      script: './api-server.js',
      exec_mode: 'fork',
      max_memory_restart: '512M',
      env: { NODE_ENV: 'production', PORT: 3001 }
    },
    {
      name: 'legion-ai',
      script: './server.js',
      cwd: './ai-assistant',
      exec_mode: 'fork',
      max_memory_restart: '512M',
      env: { NODE_ENV: 'production', AI_ASSISTANT_PORT: 3002 }
    }
  ]
};
```

### Deployment Script

**Файл:** `deploy_drones.sh`

```bash
./deploy_drones.sh
```

**Что делает:**
1. Git pull
2. npm install
3. npm run build
4. PM2 stop/delete
5. PM2 start
6. PM2 save
7. Nginx reload

---

## 🚀 Команды управления

### PM2 Commands

```bash
# Статус всех процессов
pm2 status

# Логи
pm2 logs                    # Все логи
pm2 logs legion-web         # Только web
pm2 logs legion-api         # Только API
pm2 logs legion-ai          # Только AI

# Перезапуск
pm2 restart all             # Все процессы
pm2 restart legion-web      # Только web

# Остановка
pm2 stop all
pm2 stop legion-api

# Удаление
pm2 delete all

# Мониторинг
pm2 monit

# Сохранение (автозапуск при reboot)
pm2 save --force
pm2 startup
```

### Nginx Commands

```bash
# Проверка конфигурации
nginx -t

# Перезапуск
systemctl reload nginx

# Рестарт
systemctl restart nginx

# Статус
systemctl status nginx
```

---

## 🧪 Тестирование

### Проверка здоровья

```bash
# Web сервер (через nginx)
curl -k https://xn--78-glchqprh.xn--p1ai/

# API сервер (напрямую)
curl http://localhost:3001/api/telegram-webhook -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"Test"}'

# AI сервер (напрямую)
curl http://localhost:3002/api/health

# AI API (через nginx)
curl -k https://xn--78-glchqprh.xn--p1ai/api/assistant/chat \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"message":"Привет","sessionId":"test"}'
```

### Ожидаемые ответы

**Web сервер:** HTML страница (200 OK)

**API сервер:**
```json
{"success":true,"message":"Сообщение успешно отправлено!"}
```

**AI сервер:**
```json
{"status":"ok","services":16,"timestamp":"2026-03-19T19:00:00.000Z"}
```

**AI Chat:**
```json
{
  "response": "Здравствуйте! 👋 Я виртуальный ИИ-помощник...",
  "sessionId": "test",
  "qwenUsed": true,
  "phoneDetected": false
}
```

---

## 📊 Логи

### PM2 Logs

**Директория:** `/root/Drones/logs/`

- `web-out.log` — Web сервер stdout
- `web-error.log` — Web сервер stderr
- `api-out.log` — API сервер stdout
- `api-error.log` — API сервер stderr
- `ai-out.log` — AI сервер stdout
- `ai-error.log` — AI сервер stderr

### Nginx Logs

**Директория:** `/var/log/nginx/`

- `access.log` — все запросы
- `error.log` — ошибки nginx

---

## 🔍 Диагностика

### Проблема: AI не отвечает

**Проверка:**
```bash
# 1. Статус процесса
pm2 status legion-ai

# 2. Логи
pm2 logs legion-ai --lines 50

# 3. Проверка Qwen CLI
qwen --version

# 4. Проверка endpoint
curl http://localhost:3002/api/health
```

**Решение:**
```bash
pm2 restart legion-ai
```

---

### Проблема: API 404

**Причина:** Nginx не проксирует на порт 3001

**Проверка:**
```bash
# 1. Проверка конфига nginx
nginx -T | grep -A 10 "location /api"

# 2. Проверка API напрямую
curl http://localhost:3001/api/assistant/chat -X POST \
  -H "Content-Type: application/json" \
  -d '{"message":"test","sessionId":"test"}'

# 3. Проверка через nginx
curl -k https://xn--78-glchqprh.xn--p1ai/api/assistant/chat \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"message":"test","sessionId":"test"}'
```

**Решение:**
```bash
# Обновить конфиг nginx
# location /api/ { proxy_pass http://localhost:3001; }
nginx -t && systemctl reload nginx
```

---

### Проблема: Порт занят

**Симптомы:** `EADDRINUSE: address already in use :::3001`

**Проверка:**
```bash
netstat -tulpn | grep :3001
```

**Решение:**
```bash
# Найти PID
lsof -i :3001

# Убить процесс
kill -9 <PID>

# Перезапустить PM2
pm2 restart legion-api
```

---

## 📈 Мониторинг

### PM2 Dashboard

```bash
pm2 monit
```

Показывает:
- CPU usage
- Memory usage
- I/O operations

### Health Check Script

```bash
#!/bin/bash
echo "=== Web Server ==="
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/
echo ""
echo "=== API Server ==="
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/health
echo ""
echo "=== AI Server ==="
curl -s -o /dev/null -w "%{http_code}" http://localhost:3002/api/health
echo ""
pm2 status
```

---

## 🔐 Безопасность

### Переменные окружения

**Файл:** `/root/Drones/.env`

```env
TELEGRAM_BOT_TOKEN=xxx
TELEGRAM_CHAT_ID=xxx
TELEGRAM_LOGS_BOT_TOKEN=xxx
TELEGRAM_LOGS_GROUP_ID=xxx
PORT=3001
AI_ASSISTANT_PORT=3002
```

⚠️ **НЕ коммитить `.env` в git!**

### Firewall

```bash
# Открыть порты (если нужно)
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
```

---

## 📝 Changelog

### 2026-03-19 — Initial PM2 Deployment

- ✅ Настроена PM2 конфигурация (`ecosystem.config.cjs`)
- ✅ Обновлён скрипт деплоя (`deploy_drones.sh`)
- ✅ Настроен Nginx для проксирования API
- ✅ Запущены все 3 сервиса (web, api, ai)
- ✅ Протестирована работа AI ассистента
- ✅ Настроено логирование

---

## 📞 Поддержка

**Вопросы по деплою:** @LeadDeveloper

**Документация:**
- [PRODUCTION_DEPLOY.md](./PRODUCTION_DEPLOY.md)
- [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)
- [ENV_SETUP.md](./ENV_SETUP.md)

---

**Дата создания:** 2026-03-19
**Последнее обновление:** 2026-03-19T19:20:00.000Z
**Версия:** 1.0.0
