#!/bin/bash
# Скрипт для перезапуска серверов после изменений

echo "Остановка текущих процессов..."
pkill -f "node server.js" || true
pkill -f "node api-server.js" || true

sleep 2

echo "Запуск основного сервера на порту 3000..."
cd /root/Drones
nohup node server.js > server.log 2>&1 &

sleep 2

echo "Запуск API сервера на порту 3001..."
nohup node api-server.js > api-server.log 2>&1 &

echo "Серверы перезапущены."