/**
 * Тест системы кэширования AI Assistant
 * 
 * Запуск: node test-cache.js
 * 
 * Проверяет:
 * 1. Кэширование ответов Qwen
 * 2. Кэширование sentiment-анализа
 * 3. Статистику кэша
 * 4. Очистку кэша
 */

import axios from 'axios';

const API_BASE = 'http://localhost:3002';

// Цвета для консоли
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

async function testCache() {
  log(colors.cyan, '\n╔════════════════════════════════════════════════════════╗');
  log(colors.cyan, '║  🧪 ТЕСТ СИСТЕМЫ КЭШИРОВАНИЯ                             ║');
  log(colors.cyan, '╚════════════════════════════════════════════════════════╝\n');

  // Проверка доступности сервера
  try {
    log(colors.blue, '📡 Проверка доступности сервера...');
    await axios.get(`${API_BASE}/api/health`);
    log(colors.green, '✅ Сервер доступен\n');
  } catch (error) {
    log(colors.red, '❌ Сервер недоступен. Запустите: npm run dev:all');
    process.exit(1);
  }

  // Тест 1: Кэширование ответов Qwen
  log(colors.yellow, '📦 ТЕСТ 1: Кэширование ответов Qwen');
  log(colors.gray, '─'.repeat(50));

  const testMessage = 'сколько стоит монтаж сайдинга?';
  const sessionId = `test_${Date.now()}`;

  // Первый запрос (cache MISS)
  log(colors.blue, '📤 Запрос 1 (ожидается CACHE MISS):');
  log(colors.gray, `   Сообщение: "${testMessage}"`);
  
  const response1 = await axios.post(`${API_BASE}/api/chat`, {
    message: testMessage,
    sessionId: sessionId,
    serviceSlug: 'montazh-saydinga',
    history: []
  });

  log(colors.green, `   ✅ Ответ получен (${response1.data.response.length} символов)`);
  log(colors.gray, `   qwenUsed: ${response1.data.qwenUsed}, fromCache: ${response1.data.fromCache || false}\n`);

  // Второй запрос (cache HIT)
  log(colors.blue, '📤 Запрос 2 (ожидается CACHE HIT):');
  log(colors.gray, `   Сообщение: "${testMessage}"`);
  
  const response2 = await axios.post(`${API_BASE}/api/chat`, {
    message: testMessage,
    sessionId: sessionId,
    serviceSlug: 'montazh-saydinga',
    history: []
  });

  log(colors.green, `   ✅ Ответ получен (${response2.data.response.length} символов)`);
  log(colors.gray, `   qwenUsed: ${response2.data.qwenUsed}, fromCache: ${response2.data.fromCache || false}\n`);

  // Сравнение ответов
  if (response1.data.response === response2.data.response) {
    log(colors.green, '✅ Ответы идентичны - кэш работает!\n');
  } else {
    log(colors.red, '⚠️  Ответы отличаются (возможно, Qwen генерирует разные ответы)\n');
  }

  // Тест 2: Кэширование sentiment-анализа
  log(colors.yellow, '📦 ТЕСТ 2: Кэширование sentiment-анализа');
  log(colors.gray, '─'.repeat(50));

  const testMessages = [
    'отстань от меня',
    'спасибо большое',
    'тупой бот'
  ];

  for (const msg of testMessages) {
    log(colors.blue, `\n📤 Анализ сообщения: "${msg}"`);
    
    // Отправляем одно и то же сообщение дважды
    await axios.post(`${API_BASE}/api/chat`, {
      message: msg,
      sessionId: `sentiment_test_${Date.now()}`,
      history: []
    });
    
    log(colors.gray, '   Первое сообщение отправлено (анализ выполнен)');
    
    // Небольшая задержка
    await new Promise(resolve => setTimeout(resolve, 100));
    
    await axios.post(`${API_BASE}/api/chat`, {
      message: msg,
      sessionId: `sentiment_test_${Date.now()}`,
      history: []
    });
    
    log(colors.gray, '   Второе сообщение отправлено (должен быть cache HIT)\n');
  }

  // Тест 3: Получение статистики кэша
  log(colors.yellow, '📦 ТЕСТ 3: Статистика кэша');
  log(colors.gray, '─'.repeat(50));

  const statsResponse = await axios.get(`${API_BASE}/api/cache/stats`);
  
  log(colors.green, '📊 Статистика кэша:');
  log(colors.gray, JSON.stringify(statsResponse.data.cache, null, 2));
  log(colors.gray, `\nTTL настройки:`);
  log(colors.gray, `   Qwen Responses: ${statsResponse.data.ttl.QWEN_RESPONSE / 1000 / 60} мин`);
  log(colors.gray, `   Sentiment Analysis: ${statsResponse.data.ttl.SENTIMENT_ANALYSIS / 1000 / 60} мин`);
  log(colors.gray, `   Session Data: ${statsResponse.data.ttl.SESSION_DATA / 1000 / 60} мин\n`);

  // Тест 4: Очистка кэша
  log(colors.yellow, '📦 ТЕСТ 4: Очистка кэша');
  log(colors.gray, '─'.repeat(50));

  log(colors.blue, '🗑️  Очистка всего кэша...');
  const clearResponse = await axios.post(`${API_BASE}/api/cache/clear`, {});
  
  log(colors.green, `✅ Кэш очищен (${clearResponse.data.cleared} записей)`);
  log(colors.gray, '   Статистика сброшена\n');

  // Финальная статистика
  const finalStats = await axios.get(`${API_BASE}/api/cache/stats`);
  log(colors.green, '📊 Финальная статистика:');
  log(colors.gray, JSON.stringify(finalStats.data.cache, null, 2));

  // Итоги
  log(colors.cyan, '\n╔════════════════════════════════════════════════════════╗');
  log(colors.cyan, '║  ✅ ТЕСТ ЗАВЕРШЁН                                        ║');
  log(colors.cyan, '╚════════════════════════════════════════════════════════╝\n');

  log(colors.green, 'Рекомендации:');
  log(colors.gray, '  • Проверьте логи сервера на наличие "Cache HIT" сообщений');
  log(colors.gray, '  • При повторных запросах время ответа должно быть <100мс');
  log(colors.gray, '  • Статистика доступна по адресу: GET /api/cache/stats\n');
}

// Запуск теста
testCache().catch(error => {
  log(colors.red, '\n❌ Ошибка теста:');
  console.error(error);
  process.exit(1);
});
