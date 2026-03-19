# 🧪 Тестирование Telegram Logs

## Запуск теста

```bash
cd ai-assistant
node test-telegram-logs.js
```

## Ожидаемый результат

Если всё настроено правильно, вы увидите:

```
🔍 Testing Telegram Logs Configuration...


📋 Test 1: Getting chat info...
✅ Chat found:
   Title: Chat Logs
   Type: supergroup
   Is Forum: true
   Members: 2

📋 Test 2: Creating test topic...
✅ Topic created: ID 12345

📋 Test 3: Sending message to topic...
✅ Message sent successfully

📋 Test 4: Closing test topic...
✅ Topic closed

🎉 All tests passed successfully!
📝 You can now use the chat logging feature.
```

## Возможные ошибки

### ❌ TELEGRAM_LOGS_BOT_TOKEN not set
**Решение:** Добавьте в `.env`:
```env
TELEGRAM_LOGS_BOT_TOKEN=ваш_токен
```

### ❌ TELEGRAM_LOGS_GROUP_ID not set
**Решение:** Добавьте в `.env`:
```env
TELEGRAM_LOGS_GROUP_ID=-1003743767375
```

### ❌ Failed to get chat info: 401 Unauthorized
**Причина:** Неверный токен бота
**Решение:** Проверьте токен в `.env`

### ❌ Failed to get chat info: 403 Forbidden
**Причина:** Бот не в группе
**Решение:** Добавьте бота в группу

### ⚠️ WARNING: Group is not a forum
**Причина:** Группа не поддерживает темы
**Решение:** 
1. Откройте настройки группы
2. Включите "Темы" (Topics)
3. Группа автоматически конвертируется в супергруппу

### ❌ Test failed: 400 Bad Request: message thread not found
**Причина:** Бот не имеет прав на создание тем
**Решение:**
1. Откройте настройки группы
2. Найдите бота в списке участников
3. Дайте права администратора с правом "Создавать темы"

## Что проверяет тест

1. **Доступность переменных окружения** - токена и ID группы
2. **Доступ к группе** - бот может получить информацию о группе
3. **Поддержка тем** - группа является форумом
4. **Создание тем** - бот может создавать новые темы
5. **Отправка сообщений** - бот может отправлять сообщения в темы
6. **Управление темами** - бот может закрывать темы

## После успешного теста

Теперь AI-бот будет автоматически:
- Создавать тему для каждой новой сессии
- Логировать сообщения клиентов
- Логировать ответы бота
- Логировать ошибки

Все логи будут появляться в Telegram группе в соответствующих темах!

---

**Дата создания:** 2026-03-19
**Статус:** ✅ Готово к использованию
