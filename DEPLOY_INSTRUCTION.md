# Инструкция по деплою проекта Legion

## Быстрый деплой (одной командой)

```bash
deploy
```

Эта команда:
1. ✅ Стянет изменения из Git (main branch)
2. 📦 Установит зависимости
3. 🔨 Соберет проект
4. 🔄 Перезапустит все PM2 процессы
5. 💾 Сохранит конфигурацию PM2
6. 🔄 Перезапустит nginx

## Альтернативный способ

```bash
bash /root/Drones/deploy_drones.sh
```

## Полезные команды

### Статус процессов
```bash
pm2 status
# или
pm2status
```

### Просмотр логов
```bash
pm2 logs
# или
pm2logs

# Логи конкретного процесса
pm2 logs legion-web
pm2 logs legion-api
pm2 logs legion-ai
```

### Перезапуск процессов
```bash
# Все процессы
pm2 restart all

# Конкретный процесс
pm2 restart legion-web
pm2 restart legion-api
pm2 restart legion-ai
```

### Мониторинг
```bash
pm2 monit
```

### Остановка процессов
```bash
# Все процессы
pm2 stop all

# Конкретный процесс
pm2 stop legion-web
```

## Расположение логов

- **Web**: `/root/Drones/logs/web-out.log`
- **API**: `/root/Drones/logs/api-out.log`
- **AI**: `/root/Drones/logs/ai-out.log`

## Структура процессов PM2

| Имя | Порт | Описание |
|-----|------|----------|
| legion-web | 3000 | React Router frontend |
| legion-api | 3001 | API server (Telegram webhook) |
| legion-ai | 3002 | AI Assistant server |

## Конфигурация

Конфигурация PM2 находится в файле: `ecosystem.config.cjs`

## Обновление переменных окружения

При изменении `.env` файла:
```bash
pm2 restart all --update-env
```

## Восстановление после сбоя

Если процессы не запускаются:
```bash
# Очистить все процессы PM2
pm2 kill

# Запустить заново
pm2 start ecosystem.config.cjs

# Сохранить конфигурацию
pm2 save --force
```
