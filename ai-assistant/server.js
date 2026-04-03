import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import axios from 'axios';
import crypto from 'crypto';
import { getSession, saveSession, addMessageToSession, getSessionMessages, getSessionMeta } from './session-storage.js';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const execAsync = promisify(exec);

const app = express();

// Hardcoded port to avoid conflicts with .env and PM2
const AI_PORT = 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Telegram configuration
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Telegram Logs Group configuration (for chat history with topics)
const TELEGRAM_LOGS_BOT_TOKEN = process.env.TELEGRAM_LOGS_BOT_TOKEN;
const TELEGRAM_LOGS_GROUP_ID = process.env.TELEGRAM_LOGS_GROUP_ID;

// Cache for session -> topic mapping (in-memory)
const sessionTopicCache = new Map();

// Pending topic creation promises (to avoid duplicate topic creation)
const pendingTopicCreations = new Map();

// ============================================
// CACHE SYSTEM CONFIGURATION
// ============================================

// TTL (время жизни кэша)
const CACHE_TTL = {
  QWEN_RESPONSE: 3600000,      // 1 час для ответов Qwen
  SENTIMENT_ANALYSIS: 1800000, // 30 минут для sentiment-анализа
  SESSION_DATA: 7200000        // 2 часа для сессионных данных
};

// Структуры кэша
const qwenResponseCache = new Map();      // Кэш ответов Qwen
const sentimentCache = new Map();         // Кэш sentiment-анализа
const sessionCache = new Map();           // Расширенный кэш сессий

// Статистика кэша
const cacheStats = {
  qwen: { hits: 0, misses: 0 },
  sentiment: { hits: 0, misses: 0 },
  session: { hits: 0, misses: 0 }
};

// ============================================
// CACHE HELPER FUNCTIONS
// ============================================

/**
 * Generate cache key from message and context
 */
function getQwenCacheKey(message, serviceSlug, conversationHistoryLength) {
  const normalizedMessage = message.toLowerCase().trim();
  const historyContext = conversationHistoryLength > 0 ? `:history:${conversationHistoryLength}` : '';
  const key = `${normalizedMessage}:${serviceSlug || 'none'}${historyContext}`;
  return crypto.createHash('md5').update(key).digest('hex');
}

/**
 * Generate cache key for sentiment analysis
 */
function getSentimentCacheKey(message, conversationHistoryLength) {
  const normalizedMessage = message.toLowerCase().trim();
  const historyContext = conversationHistoryLength > 0 ? `:history:${conversationHistoryLength}` : '';
  const key = `${normalizedMessage}${historyContext}`;
  return crypto.createHash('md5').update(key).digest('hex');
}

/**
 * Get item from cache with TTL check
 */
function getFromCache(cache, key, statsKey) {
  const item = cache.get(key);
  if (!item) {
    if (statsKey) cacheStats[statsKey].misses++;
    return null;
  }
  
  // Check TTL
  if (Date.now() > item.expiresAt) {
    cache.delete(key);
    if (statsKey) cacheStats[statsKey].misses++;
    return null;
  }
  
  if (statsKey) cacheStats[statsKey].hits++;
  return item.data;
}

/**
 * Set item in cache with TTL
 */
function setToCache(cache, key, data, ttl) {
  cache.set(key, {
    data,
    expiresAt: Date.now() + ttl,
    createdAt: Date.now()
  });
}

/**
 * Clear expired entries from cache
 */
function clearExpiredCache(cache, cacheName) {
  const now = Date.now();
  let cleared = 0;
  
  for (const [key, item] of cache.entries()) {
    if (now > item.expiresAt) {
      cache.delete(key);
      cleared++;
    }
  }
  
  if (cleared > 0) {
    console.log(`🧹 [CACHE] Cleared ${cleared} expired entries from ${cacheName}`);
  }
  
  return cleared;
}

/**
 * Get cache statistics
 */
function getCacheStats() {
  const totalQwen = cacheStats.qwen.hits + cacheStats.qwen.misses;
  const totalSentiment = cacheStats.sentiment.hits + cacheStats.sentiment.misses;
  
  return {
    qwen: {
      ...cacheStats.qwen,
      hitRate: totalQwen > 0 ? ((cacheStats.qwen.hits / totalQwen) * 100).toFixed(1) + '%' : '0%',
      size: qwenResponseCache.size
    },
    sentiment: {
      ...cacheStats.sentiment,
      hitRate: totalSentiment > 0 ? ((cacheStats.sentiment.hits / totalSentiment) * 100).toFixed(1) + '%' : '0%',
      size: sentimentCache.size
    },
    session: {
      ...cacheStats.session,
      size: sessionCache.size
    }
  };
}

// Auto-clear expired caches every 10 minutes
const cacheCleanupInterval = setInterval(() => {
  clearExpiredCache(qwenResponseCache, 'qwenResponseCache');
  clearExpiredCache(sentimentCache, 'sentimentCache');
  clearExpiredCache(sessionCache, 'sessionCache');
  
  // Log stats every hour
  const stats = getCacheStats();
  console.log('📊 [CACHE STATS]', JSON.stringify(stats, null, 2));
}, 600000); // 10 минут

// Graceful shutdown - clear intervals
process.on('SIGINT', () => {
  clearInterval(cacheCleanupInterval);
  console.log('🧹 Cache cleanup interval cleared');
  process.exit(0);
});

// Load knowledge base
let knowledgeBase = null;
let vacanciesData = null;
let zokData = null;
try {
  const kbPath = join(__dirname, 'knowledge-base', 'services.json');
  knowledgeBase = JSON.parse(fs.readFileSync(kbPath, 'utf-8'));
  console.log('✅ Knowledge base loaded:', knowledgeBase.services.length, 'services');

  // Load vacancies
  const vacanciesPath = join(__dirname, 'knowledge-base', 'vacancies.json');
  vacanciesData = JSON.parse(fs.readFileSync(vacanciesPath, 'utf-8'));
  console.log('✅ Vacancies loaded:', vacanciesData.vacancies.length, 'vacancies');

  // Load ZOK (Drone Defense)
  const zokPath = join(__dirname, 'knowledge-base', 'zok.json');
  zokData = JSON.parse(fs.readFileSync(zokPath, 'utf-8'));
  console.log('✅ ZOK loaded:', zokData.service.name);
} catch (error) {
  console.error('❌ Failed to load knowledge base:', error.message);
}

// ============================================
// Helper Functions
// ============================================

// Analyze message sentiment and intent using Qwen (with caching)
async function analyzeMessageSentiment(message, conversationHistory = []) {
  // Generate cache key
  const cacheKey = getSentimentCacheKey(message, conversationHistory.length);
  
  // Try to get from cache first
  const cachedResult = getFromCache(sentimentCache, cacheKey, 'sentiment');
  if (cachedResult) {
    console.log('💾 [SENTIMENT] Cache HIT');
    return cachedResult;
  }
  
  console.log('🔍 [SENTIMENT] Cache MISS - analyzing...');
  
  try {
    const historyContext = conversationHistory.length > 0
      ? `\n[ИСТОРИЯ ДИАЛОГА]:\n${conversationHistory.map(h => `${h.role}: ${h.content}`).join('\n')}`
      : '';

    const sentimentPrompt = `Ты — анализатор тональности сообщений в чате поддержки.

[ЗАДАЧА]
Проанализируй сообщение клиента и определи:
1. Есть ли негатив, раздражение, агрессия
2. Хочет ли клиент прекратить общение
3. Нужно ли игнорировать клиента в дальнейшем

[ПРАВИЛА]
- "ignore": true если клиент явно просит отстать, не писать, не беспокоить
- "negative": true если есть негатив, раздражение, грубость
- "reason": краткая причина решения (1 предложение)

[ПРИМЕРЫ]
"отстань", "не пиши", "заткнись" → {"ignore": true, "negative": true, "reason": "Клиент просит не беспокоить"}
"тупой бот", "бесполезно" → {"ignore": false, "negative": true, "reason": "Клиент раздражён но не просит прекратить"}
"дай сайт посмотреть", "покажи услуги" → {"ignore": false, "negative": false, "reason": "Нейтральный запрос информации"}
"спасибо", "отлично" → {"ignore": false, "negative": false, "reason": "Позитивное сообщение"}

[СООБЩЕНИЕ КЛИЕНТА]: ${message}${historyContext}

[АНАЛИЗ] (только JSON без пояснений):`;

    const escapedPrompt = sentimentPrompt.replace(/"/g, '\\"').replace(/\n/g, '\\n');

    const { stdout } = await execAsync(`qwen -y -p "${escapedPrompt}"`, {
      cwd: __dirname,
      timeout: 20000,
      maxBuffer: 2 * 1024 * 1024,
      env: { ...process.env, FORCE_COLOR: '0' }
    });

    // Parse JSON response
    const jsonMatch = stdout.match(/\{[^}]*\}/);
    if (jsonMatch) {
      const analysis = JSON.parse(jsonMatch[0]);
      console.log('🔍 [SENTIMENT] Analysis:', analysis);
      
      // Cache the result
      setToCache(sentimentCache, cacheKey, analysis, CACHE_TTL.SENTIMENT_ANALYSIS);
      
      return analysis;
    }

    const defaultResult = { ignore: false, negative: false, reason: 'Не удалось проанализировать' };
    setToCache(sentimentCache, cacheKey, defaultResult, CACHE_TTL.SENTIMENT_ANALYSIS);
    return defaultResult;
  } catch (error) {
    console.error('🔍 [SENTIMENT] Analysis error:', error.message);
    const errorResult = { ignore: false, negative: false, reason: 'Ошибка анализа' };
    setToCache(sentimentCache, cacheKey, errorResult, CACHE_TTL.SENTIMENT_ANALYSIS);
    return errorResult;
  }
}

/**
 * Проверка, является ли номер мобильным (российским)
 * @param {string} phone - Номер телефона в формате +7XXXXXXXXXX
 * @returns {boolean}
 */
function isMobilePhone(phone) {
  if (!phone) return false;
  
  // Очищаем номер от лишних символов
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Российские мобильные номера: 11 цифр, начинаются на 7 или 8, после кода страны идут коды мобильных операторов
  if (cleanPhone.length !== 11) return false;
  
  // Коды мобильных операторов России (основные)
  const mobileCodes = [
    '900', '901', '902', '903', '904', '905', '906', '907', '908', '909',
    '910', '911', '912', '913', '914', '915', '916', '917', '918', '919',
    '920', '921', '922', '923', '924', '925', '926', '927', '928', '929',
    '930', '931', '932', '933', '934', '935', '936', '937', '938', '939',
    '940', '941', '942', '943', '944', '945', '946', '947', '948', '949',
    '950', '951', '952', '953', '954', '955', '956', '957', '958', '959',
    '960', '961', '962', '963', '964', '965', '966', '967', '968', '969',
    '970', '971', '972', '973', '974', '975', '976', '977', '978', '979',
    '980', '981', '982', '983', '984', '985', '986', '987', '988', '989',
    '990', '991', '992', '993', '994', '995', '996', '997', '998', '999'
  ];
  
  // Проверяем формат: 7 или 8 в начале
  if (!cleanPhone.startsWith('7') && !cleanPhone.startsWith('8')) return false;
  
  // Получаем код оператора (первые 3 цифры после 7/8)
  const operatorCode = cleanPhone.substring(1, 4);
  
  return mobileCodes.includes(operatorCode);
}

/**
 * Извлечь номер телефона из сообщения
 * @param {string} message - Сообщение пользователя
 * @returns {object|null} - { number: string, type: 'mobile' | 'city' | 'incomplete', raw: string }
 */
function extractPhoneNumber(message) {
  if (!message) return null;

  console.log('📞 [PHONE EXTRACT] Input:', message.substring(0, 100));

  // Паттерны для российских номеров: +7 (XXX) XXX-XX-XX, 8 XXX XXX-XX-XX, 7XXXXXXXXXX, XXXXXXXXXXX и т.д.
  const phonePatterns = [
    /(\+7|8)\s*\(?(\d{3})\)?\s*(\d{3})\s*[-]?(\d{2})\s*[-]?(\d{2})/g,
    /(\+7|8)\s*[\-\s]?\s*(\d{3})\s*[\-\s]?\s*(\d{3})\s*[\-\s]?\s*(\d{2})\s*[\-\s]?\s*(\d{2})/g,
    /(\+7|8)\s*\((\d{3})\)\s*(\d{3})\s*[-]?(\d{2})\s*[-]?(\d{2})/g,
    // Pattern for 10 digits starting with 9 (mobile without +7/8): 9XXXXXXXXX
    /(^|\s)(9\d{9})(\s|$)/g,
    // Pattern for 11 digits starting with 7 or 8 (without +): 7XXXXXXXXXX or 8XXXXXXXXXX
    /(^|\s)([78]\d{10})(\s|$)/g,
    // Pattern for 10 digits starting with 79 (mobile without +7): 79XXXXXXXX
    /(^|\s)(79\d{8})(\s|$)/g,
  ];

  for (const pattern of phonePatterns) {
    const match = message.match(pattern);
    if (match) {
      let rawPhone = match[0].trim();
      console.log('📞 [PHONE EXTRACT] Pattern matched, raw:', rawPhone);
      
      // Очищаем номер от лишних символов
      let phone = rawPhone.replace(/\D/g, '');
      console.log('📞 [PHONE EXTRACT] Cleaned:', phone, 'length:', phone.length);

      // Нормализуем формат
      if (phone.length === 10 && phone.startsWith('9')) {
        phone = '+7' + phone;
        console.log('📞 [PHONE EXTRACT] Normalized 9X→+79X:', phone);
      } else if (phone.length === 11 && phone.startsWith('8')) {
        phone = '+7' + phone.substring(1);
        console.log('📞 [PHONE EXTRACT] Normalized 8X→+7X:', phone);
      } else if (phone.length === 11 && phone.startsWith('7')) {
        phone = '+' + phone;
        console.log('📞 [PHONE EXTRACT] Normalized 7X→+7X:', phone);
      } else if (phone.length === 10 && phone.startsWith('79')) {
        phone = '+7' + phone.substring(1);
        console.log('📞 [PHONE EXTRACT] Normalized 79X→+79X:', phone);
      }

      console.log('📞 [PHONE EXTRACT] Final:', phone, 'length:', phone.length);

      // Определяем тип номера
      if (phone.length >= 11 && phone.startsWith('+7')) {
        const type = isMobilePhone(phone) ? 'mobile' : 'city';
        console.log('📞 [PHONE EXTRACT] Type:', type);
        return {
          number: phone,
          type: type,
          raw: rawPhone
        };
      }

      // Если номер неполный (меньше 11 цифр)
      if (phone.length >= 5 && phone.length < 11) {
        console.log('📞 [PHONE EXTRACT] Incomplete');
        return {
          number: phone,
          type: 'incomplete',
          raw: rawPhone
        };
      }
    }
  }

  console.log('📞 [PHONE EXTRACT] No match');
  return null;
}

// Extract name from message (simple heuristic)
function extractName(message, history = []) {
  if (!message) return null;

  // Look for patterns like "меня зовут X", "я X", "мое имя X"
  const namePatterns = [
    /меня\s+зовут\s+([А-ЯЁ][а-яё]+)/i,
    /я\s+([А-ЯЁ][а-яё]+)/i,
    /мое\s+имя\s+([А-ЯЁ][а-яё]+)/i,
    /звоните\s+([А-ЯЁ][а-яё]+)/i,
  ];

  // First try to find name in current message
  for (const pattern of namePatterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      const name = match[1].charAt(0).toUpperCase() + match[1].slice(1);
      console.log('📝 [EXTRACT NAME] Found in pattern:', name);
      return name;
    }
  }
  
  // Try to find name at the beginning of message followed by common separators
  const startNamePattern = /^([А-ЯЁ][а-яё]{2,})[,\s:!-]/i;
  const startMatch = message.match(startNamePattern);
  if (startMatch && startMatch[1]) {
    const notNameWords = [
      'хочу', 'буду', 'будет', 'спасибо', 'привет', 'здравствуйте', 'пока', 
      'да', 'нет', 'ой', 'ах', 'другой', 'новая', 'новый', 'старый', 'первый',
      'последний', 'какой', 'какая', 'какое', 'какие', 'где', 'когда', 'почему',
      'зачем', 'как', 'кто', 'что', 'куда', 'откуда', 'сколько', 'алло', 'блин'
    ];
    if (!notNameWords.includes(startMatch[1].toLowerCase())) {
      const name = startMatch[1].charAt(0).toUpperCase() + startMatch[1].slice(1);
      console.log('📝 [EXTRACT NAME] Found at start:', name);
      return name;
    }
  }
  
  // Try to find name at the END of message (after phone number)
  // Pattern: phone number followed by name
  const endNamePattern = /(\d{10,11})\s+([А-ЯЁ][а-яё]+)(?:\s|$)/i;
  const endMatch = message.match(endNamePattern);
  if (endMatch && endMatch[2]) {
    const notNameWords = [
      'хочу', 'буду', 'будет', 'спасибо', 'привет', 'здравствуйте', 'пока', 
      'да', 'нет', 'ой', 'ах', 'другой', 'новая', 'новый', 'старый', 'первый',
      'последний', 'какой', 'какая', 'какое', 'какие', 'где', 'когда', 'почему',
      'зачем', 'как', 'кто', 'что', 'куда', 'откуда', 'сколько', 'алло', 'блин'
    ];
    if (!notNameWords.includes(endMatch[2].toLowerCase())) {
      const name = endMatch[2].charAt(0).toUpperCase() + endMatch[2].slice(1);
      console.log('📝 [EXTRACT NAME] Found at end (after phone):', name);
      return name;
    }
  }

  // Don't search in history - use name from current message only
  return null;
}

// Get vacancies context
function getVacanciesContext() {
  if (!vacanciesData) return null;

  return {
    vacancies: vacanciesData.vacancies,
    generalInfo: vacanciesData.generalInfo
  };
}

// Get ZOK (Drone Defense) context
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

// ============================================
// Telegram Logs Functions (send chat history to group with topics)
// ============================================

/**
 * Create a new topic in the Telegram logs group for a session
 */
async function createTopicForSession(sessionId, userName = 'Клиент') {
  if (!TELEGRAM_LOGS_BOT_TOKEN || !TELEGRAM_LOGS_GROUP_ID) {
    console.warn('⚠️  Telegram Logs credentials not set, skipping topic creation');
    return null;
  }

  try {
    const topicName = `${userName} - ${sessionId.slice(-8)}`; // e.g., "Клиент - uv2kxqi8n"
    
    const url = `https://api.telegram.org/bot${TELEGRAM_LOGS_BOT_TOKEN}/createForumTopic`;
    
    const response = await axios.post(url, {
      chat_id: TELEGRAM_LOGS_GROUP_ID,
      name: topicName,
      icon_color: 0x6495ED // Blue color for topic icon
    });

    const topicId = response.data.result.message_thread_id;

    // Cache the topic ID
    sessionTopicCache.set(sessionId, topicId);

    console.log(`✅ [TG-LOGS] Topic created: ${topicName} (ID: ${topicId})`);

    // Send welcome message to the topic
    await sendLogToTopic(topicId, `🆕 **Новая сессия**\n\n👤 **Клиент:** ${userName}\n🆔 **Session ID:** \`${sessionId}\`\n⏰ **Время:** ${new Date().toLocaleString('ru-RU')}`);

    return topicId;
  } catch (error) {
    console.error('❌ [TG-LOGS] Failed to create topic:', error.message);
    return null;
  }
}

/**
 * Send a message to a specific topic in the logs group
 */
async function sendLogToTopic(topicId, message, parseMode = 'Markdown') {
  if (!TELEGRAM_LOGS_BOT_TOKEN || !TELEGRAM_LOGS_GROUP_ID) {
    return false;
  }

  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_LOGS_BOT_TOKEN}/sendMessage`;
    
    await axios.post(url, {
      chat_id: TELEGRAM_LOGS_GROUP_ID,
      message_thread_id: topicId,
      text: message,
      parse_mode: parseMode
    });
    
    return true;
  } catch (error) {
    console.error('❌ [TG-LOGS] Failed to send message to topic:', error.message);
    return false;
  }
}

/**
 * Get or create topic for session (with deduplication)
 */
async function getOrCreateTopicForSession(sessionId, userName = 'Клиент') {
  // Check cache first
  const cachedTopicId = sessionTopicCache.get(sessionId);
  if (cachedTopicId) {
    console.log(`💾 [TG-LOGS] Topic cache HIT for session ${sessionId.slice(-8)} (topic ID: ${cachedTopicId})`);
    return cachedTopicId;
  }

  // Check if topic creation is already in progress
  const pendingCreation = pendingTopicCreations.get(sessionId);
  if (pendingCreation) {
    console.log(`⏳ [TG-LOGS] Waiting for pending topic creation for session ${sessionId.slice(-8)}...`);
    return pendingCreation;
  }

  console.log(`🆕 [TG-LOGS] Topic cache MISS for session ${sessionId.slice(-8)} - creating new topic...`);
  
  // Create new topic (with promise tracking)
  const createPromise = createTopicForSession(sessionId, userName)
    .then(topicId => {
      // Remove from pending
      pendingTopicCreations.delete(sessionId);
      return topicId;
    })
    .catch(error => {
      // Remove from pending on error
      pendingTopicCreations.delete(sessionId);
      throw error;
    });
  
  // Store pending promise
  pendingTopicCreations.set(sessionId, createPromise);
  
  return createPromise;
}

/**
 * Log chat message to Telegram group
 */
async function logChatMessage(sessionId, userName, message, isUser = true) {
  const topicId = await getOrCreateTopicForSession(sessionId, userName);
  if (!topicId) return;
  
  const timestamp = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const icon = isUser ? '👤' : '🤖';
  const sender = isUser ? userName : 'AI Помощник';
  
  // Truncate long messages
  const truncatedMessage = message.length > 4000 ? message.slice(0, 4000) + '...' : message;
  
  await sendLogToTopic(topicId, `${icon} **${sender}** (${timestamp}):\n\n${truncatedMessage}`);
}

// Session -> lead ID cache (in-memory to avoid race conditions)
const sessionLeadCache = new Map();

// Send lead to Telegram
async function sendLeadToTelegram({ name, phone, message, serviceSlug, serviceName, vacancyPosition, experience, leadId = null, isUpdate = false }) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('⚠️  Telegram credentials not set, skipping lead notification');
    return false;
  }

  try {
    // Check if it's a vacancy application
    const isVacancyApplication = !!vacancyPosition;

    const telegramMessage = isVacancyApplication ? `
💼 <b>Отклик на вакансию!</b>

👤 <b>Имя соискателя:</b> ${name || 'Не указано'}
📞 <b>Телефон:</b> ${phone || 'Не указан'}
💼 <b>Вакансия:</b> ${vacancyPosition}
📋 <b>Опыт работы:</b> ${experience || 'Не указан'}
💬 <b>Сообщение:</b> ${message || 'Не указано'}

⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU')}
    `.trim() : isUpdate ? `
🔄 <b>ОБНОВЛЕНИЕ ЗАЯВКИ #${leadId}!</b>

👤 <b>Имя:</b> ${name || 'Не указано'}
📞 <b>Телефон:</b> ${phone || 'Не указан'}
💬 <b>Уточнение:</b> ${message || 'Не указано'}
🏗️ <b>Услуга:</b> ${serviceName || serviceSlug || 'Не указана'}

⏰ <b>Время обновления:</b> ${new Date().toLocaleString('ru-RU')}
    `.trim() : `
🔥 <b>Новая заявка из AI-чата! #${leadId}</b>

👤 <b>Имя:</b> ${name || 'Не указано'}
📞 <b>Телефон:</b> ${phone || 'Не указан'}
💬 <b>Сообщение:</b> ${message || 'Не указано'}
🏗️ <b>Услуга:</b> ${serviceName || serviceSlug || 'Не указана'}

⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU')}
    `.trim();

    const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    await axios.post(telegramApiUrl, {
      chat_id: TELEGRAM_CHAT_ID,
      text: telegramMessage,
      parse_mode: 'HTML'
    });

    console.log('✅ Lead sent to Telegram:', {
      type: isVacancyApplication ? 'vacancy' : isUpdate ? 'update' : 'service',
      leadId,
      name,
      phone,
      serviceSlug,
      vacancyPosition
    });
    return true;
  } catch (error) {
    console.error('❌ Failed to send lead to Telegram:', error.message);
    return false;
  }
}

// Helper function to get service context by slug
function getServiceContext(slug) {
  if (!knowledgeBase) return null;
  return knowledgeBase.services.find(s => s.slug === slug) || null;
}

// Helper function to build prompt for Qwen
function buildPrompt(message, serviceContext, conversationHistory = [], suggestLeadForm = false, phoneData = null, sessionId = null) {
  const companyInfo = knowledgeBase?.company || {};
  const vacanciesContext = getVacanciesContext();
  const zokContext = getZokContext();

  let contextText = '';
  if (serviceContext) {
    contextText = `
[УСЛУГА]
• Название: ${serviceContext.title}
• Категория: ${serviceContext.category}
• Описание: ${serviceContext.description}
• Цена: ${serviceContext.price}
• Детали: ${serviceContext.details.join(', ')}
• Преимущества: ${serviceContext.benefits?.join(', ') || 'Не указаны'}
• Этапы: ${serviceContext.stages?.join(' → ') || 'Не указаны'}
`;
  }

  // Add ZOK (Drone Defense) context - PRIORITY SERVICE
  let zokText = '';
  if (zokContext) {
    const stagesList = zokContext.stages.map(s => `• ${s.name} (${s.price})`).join('\n');
    const featuresList = zokContext.features.join('\n');
    const regulationsList = zokContext.regulations.map(r => `• ${r.number} (${r.date}): ${r.description}`).join('\n');
    const applicationsList = zokContext.applications.map(a => `• ${a.name}: ${a.description}`).join('\n');

    zokText = `

[🔥 КЛЮЧЕВАЯ УСЛУГА: ЗОК - ЗАЩИТНЫЕ ОГРАЖДАЮЩИЕ КОНСТРУКЦИИ]
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

`;
  }

  // Add vacancies context
  let vacanciesText = '';
  if (vacanciesContext) {
    const vacanciesList = vacanciesContext.vacancies.map(v =>
      `• ${v.position} (${v.department})${v.salary ? ` — Зарплата: ${v.salary}` : ''}`
    ).join('\n');

    vacanciesText = `
[ВАКАНСИИ]
У нас есть открытые вакансии:
${vacanciesList}

Общие условия для всех вакансий:
${vacanciesContext.generalInfo.benefits.join('\n')}

Контакт отдела кадров: ${vacanciesContext.generalInfo.contactPhone}

Если клиент спрашивает про вакансии:
1. Перечисли доступные вакансии
2. Расскажи про преимущества (официальное оформление, пятидневка, обучение)
3. Предложи откликнуться — позвонить или оставить заявку
4. Указывай зарплату из списка вакансий (если указана)
`;
  }

  const conversationContext = conversationHistory.length > 0
    ? `\n[ИСТОРИЯ ДИАЛОГА]\n${conversationHistory.map(h => `${h.role}: ${h.content}`).join('\n')}`
    : '';

  // Check if lead was already sent in this session (check BOTH history and full session)
  let leadAlreadySent = conversationHistory.some(h => h.role === 'SYSTEM' && h.content.startsWith('LEAD_SENT:'));
  
  // Also check full session if sessionId provided (history may be truncated to 5 messages)
  if (!leadAlreadySent && sessionId) {
    try {
      const session = getSession(sessionId);
      if (session && session.messages) {
        leadAlreadySent = session.messages.some(m => m.role === 'SYSTEM' && m.content.startsWith('LEAD_SENT:'));
      }
    } catch (e) {
      // Ignore session check errors
    }
  }

  const leadFormSuggestion = suggestLeadForm
    ? `\n❗ КЛИЕНТ ЗАИНТЕРЕСОВАН! Обязательно добавь в конце ответа: "или хотите, чтобы я сформировал и отправил вашу заявку руководству? Просто напишите мне тут свою заявку и контактные данные (имя и телефон) — я всё подготовлю и отправлю. Или нажмите кнопку '📋 Заполнить заявку' внизу чата."`
    : '';

  // Contact string - STRICTLY only add if lead was NOT already sent
  const contactString = leadAlreadySent
    ? '\n❗ ЗАПРЕЩЕНО: Клиент УЖЕ оставил контакты/заявку — НЕ добавляй контактную строку, НЕ проси контакты повторно!'
    : '\n✓ ВАЖНО: В КАЖДОМ ответе в конце добавляй: "Или просто напишите свои контактные данные (имя и телефон) или позвоните: +7 (931) 247-08-88. 📞"';

  // Phone validation instructions
  let phoneValidationText = '';
  if (phoneData) {
    if (phoneData.type === 'incomplete') {
      phoneValidationText = `\n\n[⚠️ ВАЖНО: НЕПОЛНЫЙ НОМЕР]
Клиент указал номер: ${phoneData.raw} (только ${phoneData.number.length} цифр)
❌ Это неполный номер! В российском мобильном номере должно быть 11 цифр.
✅ ТВОЯ ЗАДАЧА: Вежливо попроси клиента перепроверить и указать полный номер телефона (11 цифр).
Пример: "Вижу, что номер указан не полностью. Пожалуйста, перепроверьте и напишите полный номер телефона (11 цифр)."`;
    } else if (phoneData.type === 'city') {
      phoneValidationText = `\n\n[🏙️ ВАЖНО: ГОРОДСКОЙ НОМЕР]
Клиент указал городской номер: ${phoneData.number}
✅ ТВОЯ ЗАДАЧА: Вежливо уточни, может ли клиент дать мобильный номер для более оперативной связи.
Если клиент НЕ может дать мобильный — прими городской номер и подтверди заявку.
Пример: "Спасибо! Вижу, это городской номер. Для более оперативной связи, могли бы вы также указать ваш мобильный номер? Если нет возможности — оставим городской, менеджер всё равно свяжется."`;
    }
  }

  return `Ты — дружелюбный консультант строительной компании ООО «ЛЕГИОН». Общайся как живой человек, вежливо и естественно.

[ПРАВИЛА ОБЩЕНИЯ]
✓ Распознавай намерение клиента:
  • Приветствие (здравствуйте, привет, добрый день) → ответь вежливо, предложи помощь, упомяни ЗОК и вакансии
  • Вопрос о цене → назови цену + предложи бесплатный замер
  • Вопрос об услуге → кратко опиши суть + преимущества
  • Показать список услуг → перечисли услуги БЕЗ предложения заявки
  • Хочу заказать → поблагодари + дай контакты + призови к действию
  • Прощание → поблагодари, пригласи обращаться снова
  • Вопрос о вакансиях → перечисли вакансии, расскажи про условия, предложи откликнуться
  • Вопрос про ЗОК/защиту от БПЛА → расскажи про 3 уровня защиты, нормативные требования, предложи бесплатный расчет
✓ ВАЖНО: В первом ответе на приветствие упомяни, что у компании есть открытые вакансии и ты можешь рассказать о них
✓ ВАЖНО: В первом ответе на приветствие упомяни, что компания занимается установкой систем защиты от БПЛА (ЗОК) по СП 542.1325800.2024
✓ ВАЖНО: У компании 16 строительных услуг (НЕ 17!) — не называй точное количество, если клиент не спрашивает напрямую
✓ Отвечай кратко (1-3 предложения), но не сухо
✓ Используй эмодзи умеренно (1-2 на сообщение)
✓ Задавай уточняющие вопросы если нужно
✓ Ссылайся на историю диалога если это уместно
✓ Избегай шаблонных фраз вроде "Понял", "Готов отвечать"
✓ ВАЖНО: После 2-3 сообщений от клиента — в конце ответа предложи оставить заявку ТОЛЬКО если клиент спрашивает про цену, расчет стоимости или хочет заказать. НЕ предлагай если клиент просто смотрит список услуг или спрашивает общую информацию: "Хотите, чтобы я сформировал и отправил вашу заявку руководству? Просто напишите мне тут свою заявку и контактные данные (имя и телефон) — я всё подготовлю и отправлю. Или нажмите кнопку '📋 Заполнить заявку' внизу чата."${leadFormSuggestion}${contactString}

[ВАЖНОЕ ПРАВИЛО: ПРЕДСТАВЛЕНИЕ]
❌ НИКОГДА не называй себя "Алексей" или любым другим человеческим именем
✅ При первом приветствии представляйся ТОЛЬКО так: "виртуальный ИИ-помощник сайта Легион" или "ИИ-помощник" или "виртуальный помощник"
✅ Если клиент спрашивает "кто ты?" — отвечай: "Я виртуальный ИИ-помощник сайта строительной компании ЛЕГИОН"

[📞 ВАЛИДАЦИЯ НОМЕРА ТЕЛЕФОНА]
- Если клиент указал неполный номер (меньше 11 цифр) — вежливо попроси перепроверить и указать полный номер
- Если клиент указал городской номер — уточни, может ли дать мобильный для оперативной связи
- Если клиент не может дать мобильный — прими городской номер и подтверди заявку
- Мобильный номер: 11 цифр, начинается на +7/8, код оператора (9XX)

[🔄 ОБНОВЛЕНИЕ ЗАЯВКИ]
Если заявка уже была отправлена (в истории есть SYSTEM: LEAD_SENT) и клиент пишет снова:
- Клиент указал новое имя → подтверди обновление: "✅ Имя обновлено: [новое имя]"
- Клиент указал новый номер → подтверди обновление: "✅ Телефон обновлён: [новый номер]"
- Клиент добавил уточнение → подтверди: "✅ Уточнение принято: [текст]"
- НЕ добавляй контактную строку в конце, если заявка уже отправлена${phoneValidationText}

[🔥 КЛЮЧЕВАЯ УСЛУГА: ЗОК]
Защита от БПЛА — ключевая услуга компании!
Предлагай эту услугу в первую очередь при упоминании:
- ТЭК, заводы, склады, промышленные объекты
- Безопасность, защита, охрана
- БПЛА, дроны, беспилотники
- Нормативные требования, проверки

[КОМПАНИЯ]
📞 ${companyInfo.phone}
⏰ 9:00-18:00
🏆 Опыт: ${companyInfo.experience}
🛡️ Гарантия: ${companyInfo.guarantee}
📋 Количество услуг: 16 (включая ЗОК)

${zokText}${contextText}${vacanciesText}${conversationContext}

[СООБЩЕНИЕ КЛИЕНТА]: ${message}

[ТВОЙ ОТВЕТ]:`;
}

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, serviceSlug, sessionId, history = [], suggestLeadForm = false } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('🤖 [CHAT] Request:', {
      message,
      serviceSlug,
      sessionId,
      historyLength: history.length,
      suggestLeadForm
    });

    // Get service context
    const serviceContext = getServiceContext(serviceSlug);

    console.log('🤖 [CHAT] Service context:', serviceContext ? serviceContext.title : 'No service');

    // ============================================
    // ============================================
    // Analyze sentiment BEFORE processing
    // ============================================
    const sentimentAnalysis = await analyzeMessageSentiment(message, history);

    console.log('🔍 [SENTIMENT] Result:', sentimentAnalysis);

    // If client wants to be left alone - return acknowledgment
    if (sentimentAnalysis.ignore) {
      console.log('⚠️ [CHAT] Client wants no contact - returning acknowledgment');

      res.json({
        response: `Понял. Больше не буду беспокоить.`,
        sessionId: sessionId || Date.now().toString(),
        serviceContext: null,
        qwenUsed: false,
        phoneDetected: false,
        suggestLeadForm: false,
        clientWantsNoContact: true
      });
      return;
    }

    // ============================================
    // Extract phone number and validate
    // ============================================
    const phoneData = extractPhoneNumber(message);
    const phoneNumber = phoneData?.number || null;
    const phoneType = phoneData?.type || null;

    // Extract user name for logging
    const userName = extractName(message, history) || 'Клиент';
    
    // ============================================
    // Check for existing lead in session (not just history)
    // ============================================
    const session = getSession(sessionId);
    let leadAlreadySent = false;
    let existingLeadId = null;
    
    // First check in-memory cache (fastest, no race conditions)
    if (sessionLeadCache.has(sessionId)) {
      leadAlreadySent = true;
      existingLeadId = sessionLeadCache.get(sessionId);
      console.log('💾 [CACHE] Found existing lead:', existingLeadId);
    }
    
    // Then check session file
    if (!leadAlreadySent && session && session.messages) {
      const leadSentMessage = session.messages.findLast(m => m.role === 'SYSTEM' && m.content.startsWith('LEAD_SENT:'));
      if (leadSentMessage) {
        leadAlreadySent = true;
        existingLeadId = leadSentMessage.content.split(':')[1];
        sessionLeadCache.set(sessionId, existingLeadId); // Update cache
        console.log('💾 [SESSION] Found existing lead:', existingLeadId);
      }
    }

    // Also check history (for backward compatibility)
    if (!leadAlreadySent && history.some(h => h.role === 'SYSTEM' && h.content.startsWith('LEAD_SENT:'))) {
      const leadSentMessage = history.findLast(h => h.role === 'SYSTEM' && h.content.startsWith('LEAD_SENT:'));
      if (leadSentMessage) {
        leadAlreadySent = true;
        existingLeadId = leadSentMessage.content.split(':')[1];
        sessionLeadCache.set(sessionId, existingLeadId); // Update cache
        console.log('📜 [HISTORY] Found existing lead:', existingLeadId);
      }
    }

    // Log user message to Telegram (async, non-blocking)
    logChatMessage(sessionId || 'unknown', userName, message, true).catch(err => {
      console.error('❌ [TG-LOGS] Failed to log user message:', err.message);
    });

    // If phone detected - check type and handle accordingly
    if (phoneNumber) {
      console.log('📞 [CHAT] Phone number detected:', {
        number: phoneNumber,
        type: phoneType,
        raw: phoneData?.raw
      });

      const name = userName;
      const serviceName = serviceContext?.title || null;

      // Handle incomplete phone numbers
      if (phoneType === 'incomplete') {
        console.log('⚠️ [CHAT] Incomplete phone number - asking to verify');
        // Will pass to Qwen with special instruction via phoneData
      }
      // Handle city phone numbers - ask for mobile
      else if (phoneType === 'city') {
        console.log('🏙️ [CHAT] City phone detected - asking for mobile');
        // Will pass to Qwen with special instruction via phoneData
      }
      // Handle mobile numbers - send lead immediately
      else if (phoneType === 'mobile') {
        console.log('📱 [CHAT] Mobile phone detected - sending lead');
        console.log('📱 [CHAT] leadAlreadySent:', leadAlreadySent, 'existingLeadId:', existingLeadId);

        // Use existing lead ID or generate new one
        let leadId = existingLeadId;

        if (!leadId) {
          // Generate new lead ID from timestamp
          leadId = Date.now().toString();
          console.log('🆕 [CHAT] New lead - generated ID:', leadId);
        } else {
          console.log('📝 [CHAT] Lead update - using existing ID:', leadId);
        }

        const isUpdate = leadAlreadySent;
        const currentName = name || 'Клиент';
        const currentPhone = phoneNumber;

        console.log('📱 [CHAT] Sending to Telegram:', { name: currentName, phone: currentPhone, isUpdate, leadId });

        // Send lead to Telegram (async, non-blocking)
        sendLeadToTelegram({
          name: currentName,
          phone: currentPhone,
          message: isUpdate ? 'Обновление номера' : message,
          serviceSlug,
          serviceName,
          leadId,
          isUpdate
        }).then(sent => {
          if (sent) {
            console.log('✅ [CHAT] Lead successfully sent to Telegram');
          } else {
            console.error('❌ [CHAT] sendLeadToTelegram returned false');
          }
        }).catch(err => {
          console.error('❌ [CHAT] Failed to send lead:', err.message);
        });

        // Return immediate response without calling Qwen
        console.log('📞 [CHAT] Mobile detected - returning confirmation');

        // Save leadSent flag with lead ID to session (sync style - save BEFORE returning)
        try {
          addMessageToSession(sessionId, {
            role: 'SYSTEM',
            content: `LEAD_SENT:${leadId}`,
            timestamp: Date.now()
          });
          sessionLeadCache.set(sessionId, leadId); // Update in-memory cache
          console.log('💾 [SESSION+CACHE] LEAD_SENT saved:', leadId);
        } catch (e) {
          console.error('❌ [SESSION] Failed to save LEAD_SENT:', e.message);
        }

        const responseText = isUpdate
          ? `✅ **Номер обновлён!**\n\nЯ обновил ваш номер на **${currentPhone}**. Менеджер свяжется с вами в течение 15 минут. 📞`
          : (name
              ? `✅ **${name}, ваша заявка отправлена!**\n\nЯ передал ваш номер **${currentPhone}** менеджеру.\n\nОн свяжется с вами в течение 15 минут для уточнения деталей. 📞`
              : `✅ **Ваш номер сохранён!**\n\nЯ передал номер **${currentPhone}** менеджеру.\n\nОн свяжется с вами в течение 15 минут для уточнения деталей. 📞`);

        res.json({
          response: responseText,
          sessionId: sessionId || Date.now().toString(),
          serviceContext: serviceContext ? {
            title: serviceContext.title,
            price: serviceContext.price,
            url: serviceContext.url
          } : null,
          qwenUsed: false,
          phoneDetected: true,
          leadSubmitted: true,
          suggestLeadForm: false,
          leadId
        });

        // Log bot response to Telegram (async, non-blocking)
        logChatMessage(sessionId || 'unknown', userName, responseText, false).catch(err => {
          console.error('❌ [TG-LOGS] Failed to log bot response:', err.message);
        });

        return;
      }
      // Unknown type - treat as city phone
      else {
        console.log('❓ [CHAT] Unknown phone type - treating as city');
        // Pass to Qwen to handle
      }
    }

    // Build prompt (pass phoneData and sessionId for lead tracking)
    const prompt = buildPrompt(message, serviceContext, history, suggestLeadForm, phoneData, sessionId);

    console.log('🤖 [CHAT] Prompt (first 500 chars):', prompt.substring(0, 500) + '...');

    // ============================================
    // Check for "срочно" (urgent) request - resend lead
    // ============================================
    const msgLower = message.toLowerCase();
    const isUrgentRequest = msgLower.includes('срочно') || 
                            msgLower.includes('продублируй') || 
                            msgLower.includes('продублируйте') || 
                            msgLower.includes('ещё раз') || 
                            msgLower.includes('еще раз') || 
                            msgLower.includes('повтори') ||
                            msgLower.includes('отправь ещё') ||
                            msgLower.includes('отправьте ещё') ||
                            msgLower.includes('отправь еще') ||
                            msgLower.includes('отправьте еще');
    
    if (isUrgentRequest && leadAlreadySent && existingLeadId) {
      console.log('🚨 [CHAT] Urgent lead resend requested - ID:', existingLeadId);

      // Get current name and phone from session
      let currentName = 'Клиент';
      let currentPhone = null;

      if (session && session.messages) {
        // Find last mobile phone
        for (let i = session.messages.length - 1; i >= 0; i--) {
          const msg = session.messages[i];
          if (msg.role === 'КЛИЕНТ') {
            const phoneInMsg = extractPhoneNumber(msg.content);
            if (phoneInMsg && phoneInMsg.type === 'mobile') {
              currentPhone = phoneInMsg.number;
              break;
            }
          }
        }

        // Find last name
        for (let i = session.messages.length - 1; i >= 0; i--) {
          const msg = session.messages[i];
          if (msg.role === 'КЛИЕНТ') {
            const nameInMsg = extractName(msg.content);
            if (nameInMsg) {
              currentName = nameInMsg;
              break;
            }
          }
        }
      }

      if (currentPhone) {
        // Send urgent lead to Telegram
        sendLeadToTelegram({
          name: currentName,
          phone: currentPhone,
          message: '🚨 СРОЧНО! Клиент запросил повторную отправку заявки!',
          serviceSlug,
          serviceName,
          leadId: existingLeadId,
          isUpdate: true
        }).then(sent => {
          if (sent) {
            console.log('✅ [CHAT] Urgent lead sent to Telegram');
          }
        }).catch(err => {
          console.error('❌ [CHAT] Failed to send urgent lead:', err.message);
        });
      }
    }

    // ============================================
    // Check for lead update with new information (text only, no phone)
    // ============================================
    if (!phoneNumber && leadAlreadySent && existingLeadId) {
      console.log('🔍 [CHAT] Checking for text update:', { leadAlreadySent, existingLeadId, hasSession: !!session, hasMessages: !!session?.messages });

      if (session && session.messages) {
        // Check if message contains meaningful information (not just "спасибо", "ок", etc.)
        const skipWords = ['спасибо', 'ок', 'окей', 'хорошо', 'ладно', 'понятно', 'ясно', 'привет', 'здравствуйте', 'пока', 'до свидания'];
        const msgLowerTrimmed = message.toLowerCase().trim();
        const isSkipMessage = skipWords.some(word => msgLowerTrimmed === word || msgLowerTrimmed.startsWith(word + '!') || msgLowerTrimmed.startsWith(word + '?'));

        // Check if message contains service-related keywords
        const serviceKeywords = ['зок', 'защита', 'бпла', 'дрон', 'расчет', 'стоимость', 'цена', 'услуг', 'монтаж', 'объект', 'площадь', 'кв', 'метр', 'адрес', 'интересует', 'хочу', 'буду', 'нужно', 'требуется', 'важно', 'учти', 'добавь', 'забудь', 'не так', 'другой', 'измени', 'поменять', 'обновить', 'дополнить', 'забыл', 'забыла'];
        const hasServiceInfo = serviceKeywords.some(keyword => msgLowerTrimmed.includes(keyword));

        console.log('🔍 [CHAT] Text update check:', { isSkipMessage, hasServiceInfo, msgLowerTrimmed });

        if (!isSkipMessage && hasServiceInfo) {
          console.log('📝 [CHAT] Lead update with text info detected - sending to Telegram');

          // Get current name and phone from session
          let currentName = 'Клиент';
          let currentPhone = null;

          // Find last mobile phone
          for (let i = session.messages.length - 1; i >= 0; i--) {
            const msg = session.messages[i];
            if (msg.role === 'КЛИЕНТ') {
              const phoneInMsg = extractPhoneNumber(msg.content);
              if (phoneInMsg && phoneInMsg.type === 'mobile') {
                currentPhone = phoneInMsg.number;
                console.log('📞 [CHAT] Found phone in session:', currentPhone);
                break;
              }
            }
          }

          // Find last name
          for (let i = session.messages.length - 1; i >= 0; i--) {
            const msg = session.messages[i];
            if (msg.role === 'КЛИЕНТ') {
              const nameInMsg = extractName(msg.content);
              if (nameInMsg) {
                currentName = nameInMsg;
                console.log('📝 [CHAT] Found name in session:', currentName);
                break;
              }
            }
          }

          if (currentPhone) {
            // Send update to Telegram
            sendLeadToTelegram({
              name: currentName,
              phone: currentPhone,
              message: `💬 ${message}`,
              serviceSlug,
              serviceName,
              leadId: existingLeadId,
              isUpdate: true
            }).then(sent => {
              if (sent) {
                console.log('✅ [CHAT] Text update sent to Telegram');
              }
            }).catch(err => {
              console.error('❌ [CHAT] Failed to send text update:', err.message);
            });
          } else {
            console.log('⚠️ [CHAT] No phone in session for text update');
          }
        }
      }
    }

    // ============================================
    // TRY TO GET CACHED QWEN RESPONSE
    // ============================================
    const cacheKey = getQwenCacheKey(message, serviceSlug, history.length);
    const cachedResponse = getFromCache(qwenResponseCache, cacheKey, 'qwen');
    
    if (cachedResponse) {
      console.log('💾 [CHAT] Cache HIT - using cached Qwen response');
      
      res.json({
        response: cachedResponse,
        sessionId: sessionId || Date.now().toString(),
        serviceContext: serviceContext ? {
          title: serviceContext.title,
          price: serviceContext.price,
          url: serviceContext.url
        } : null,
        qwenUsed: false, // false because we used cache, not Qwen
        phoneDetected: !!phoneNumber,
        suggestLeadForm: suggestLeadForm && !phoneNumber,
        fromCache: true
      });
      
      // Log bot response to Telegram (async, non-blocking)
      logChatMessage(sessionId || 'unknown', userName, cachedResponse, false).catch(err => {
        console.error('❌ [TG-LOGS] Failed to log bot response:', err.message);
      });
      
      return;
    }
    
    console.log('💾 [CHAT] Cache MISS - calling Qwen...');

    // Call Qwen CLI from ai-assistant directory (isolated context)
    let aiResponse;
    let qwenUsed = false;

    try {
      // Используем stdin для передачи промпта вместо аргумента командной строки
      // Это надёжнее и избегает проблем с экранированием специальных символов
      const { stdout } = await execAsync(`echo "${Buffer.from(prompt).toString('base64')}" | base64 -d | qwen -y -p`, {
        cwd: __dirname,
        timeout: 30000,
        maxBuffer: 2 * 1024 * 1024,
        env: { ...process.env, FORCE_COLOR: '0' }
      });
      aiResponse = stdout.trim();
      qwenUsed = true;
      console.log('🤖 [CHAT] ✅ Qwen response received:', aiResponse.substring(0, 100));

      // Cache the response
      setToCache(qwenResponseCache, cacheKey, aiResponse, CACHE_TTL.QWEN_RESPONSE);
      console.log('💾 [CHAT] Response cached for 1 hour');
    } catch (qwenError) {
      console.error('🤖 [CHAT] ❌ Qwen CLI error:', qwenError.message);

      // Проверяем, был ли это таймаут
      const isTimeout = qwenError.message.includes('timeout') || qwenError.message.includes('ETIMEDOUT');

      if (isTimeout) {
        console.log('🤖 [CHAT] ⏰ Qwen timeout - using contact fallback response');
        // Специальный ответ при таймауте - только контакты
        aiResponse = `Простите, я не могу ответить на ваш вопрос прямо сейчас. Пожалуйста, для связи с нами заполните форму на странице **Контакты** или позвоните по телефону **+7 (931) 247-08-88**. 📞`;
      } else {
        console.log('🤖 [CHAT] Using fallback response instead');
        // Fallback to simple response if Qwen fails for other reasons
        aiResponse = generateFallbackResponse(message, serviceContext, knowledgeBase?.company || {}, history, suggestLeadForm);
      }
      qwenUsed = false;
    }

    console.log('🤖 [CHAT] Response sent:', { qwenUsed, responseLength: aiResponse.length });

    res.json({
      response: aiResponse,
      sessionId: sessionId || Date.now().toString(),
      serviceContext: serviceContext ? {
        title: serviceContext.title,
        price: serviceContext.price,
        url: serviceContext.url
      } : null,
      qwenUsed,
      phoneDetected: !!phoneNumber,
      suggestLeadForm: suggestLeadForm && !phoneNumber
    });

    // Log bot response to Telegram (async, non-blocking)
    logChatMessage(sessionId || 'unknown', userName, aiResponse, false).catch(err => {
      console.error('❌ [TG-LOGS] Failed to log bot response:', err.message);
    });

    // ============================================
    // Save messages to persistent session storage
    // ============================================

    // Save user message
    addMessageToSession(sessionId, {
      role: 'КЛИЕНТ',
      content: message,
      timestamp: Date.now()
    });

    // Save bot response
    addMessageToSession(sessionId, {
      role: 'AI',
      content: aiResponse,
      timestamp: Date.now()
    });

    // Save LEAD_SENT marker with lead ID if phone was detected
    if (phoneType === 'mobile') {
      // Get lead ID from existing marker or use the one we generated
      let saveLeadId = leadId;
      if (!saveLeadId) {
        const existingLeadSent = history.findLast(h => h.role === 'SYSTEM' && h.content.startsWith('LEAD_SENT:'));
        if (existingLeadSent) {
          saveLeadId = existingLeadSent.content.split(':')[1];
        }
      }
      
      if (saveLeadId) {
        addMessageToSession(sessionId, {
          role: 'SYSTEM',
          content: `LEAD_SENT:${saveLeadId}`,
          timestamp: Date.now()
        });
      }
    }

    console.log('💾 [SESSION] Messages saved to persistent storage');

  } catch (error) {
    console.error('❌ [CHAT] Error:', error.message);

    // Log error to Telegram (async, non-blocking)
    logChatMessage(sessionId || 'unknown', userName, `❌ **Ошибка:** ${error.message}`, false).catch(err => {
      console.error('❌ [TG-LOGS] Failed to log error:', err.message);
    });

    res.status(500).json({
      error: 'Failed to process message',
      response: 'Извините, произошла ошибка. Пожалуйста, позвоните нам: +7 (931) 247-08-88'
    });
  }
});

// Fallback response generator (when Qwen is not available)
function generateFallbackResponse(message, serviceContext, companyInfo, history = [], suggestLeadForm = false) {
  const msg = message.toLowerCase();
  const isFirstMessage = history.length === 0;

  // ============================================
  // Extract phone number and validate type
  // ============================================
  const phoneData = extractPhoneNumber(message);
  const phoneNumber = phoneData?.number || null;
  const phoneType = phoneData?.type || null;

  // Handle phone number based on type
  if (phoneNumber) {
    console.log('📞 [FALLBACK] Phone number detected:', {
      number: phoneNumber,
      type: phoneType,
      raw: phoneData?.raw
    });

    const name = extractName(message, history);

    // Handle incomplete phone numbers - ask to verify
    if (phoneType === 'incomplete') {
      console.log('⚠️ [FALLBACK] Incomplete phone - asking to verify');
      return `Вижу, что номер указан не полностью (${phoneData.raw}). Пожалуйста, перепроверьте и напишите полный номер телефона (11 цифр для мобильного или городской с кодом города). 📞`;
    }

    // Handle city phone numbers - ask for mobile
    if (phoneType === 'city') {
      console.log('🏙️ [FALLBACK] City phone - asking for mobile');
      return `Спасибо! Вижу, это городской номер. Для более оперативной связи, могли бы вы также указать ваш мобильный номер? Если нет возможности — оставим городской, менеджер всё равно свяжется. 📞`;
    }

    // Handle mobile numbers - should be caught by main logic, but just in case
    if (phoneType === 'mobile') {
      console.log('📱 [FALLBACK] Mobile phone - this should be handled by main logic');
      // This case should not happen - mobile numbers are handled before Qwen
    }
  }

  // Greetings - только если это первое сообщение
  if (isFirstMessage && (msg.includes('здравствуй') || msg.includes('привет') || msg.includes('добрый день') || msg.includes('доброе утро'))) {
    return serviceContext
      ? `Здравствуйте! 👋 Рад помочь вам с услугой "${serviceContext.title}". Что вас интересует в первую очередь?`
      : `Здравствуйте! 👋 Спасибо, что обратились в ЛЕГИОН. Чем могу помочь?`;
  }

  // Price-related - самый частый запрос
  if (msg.includes('сколько стоит') || msg.includes('цена') || msg.includes('стоимость') || msg.includes('работа') || msg.includes('стоить') || msg.includes('₽') || msg.includes('руб') || msg.match(/\d+\s*(кв\.?\s*м|м²|куб\.?\s*м|м³)/)) {
    if (serviceContext) {
      // Если уже говорили о цене, не повторяем
      if (history.some(h => h.content.toLowerCase().includes('цена') || h.content.toLowerCase().includes('стоимость'))) {
        let response = `Для точного расчёта нужен выезд специалиста — это бесплатно! 📏 Когда вам удобно? Звоните: ${companyInfo.phone}`;
        if (suggestLeadForm) {
          response += `\n\n_Или напишите мне свою заявку и контактные данные (имя + телефон) — я отправлю руководству. Можно просто в чат, или нажмите кнопку "📋 Заполнить заявку" внизу._`;
        }
        return response;
      }
      let response = `Цена: ${serviceContext.price}. Точная стоимость зависит от объёма — поэтому замер бесплатный! 📏 Хотите вызвать специалиста? 📞 ${companyInfo.phone}`;
      if (suggestLeadForm) {
        response += `\n\n_Или напишите мне свою заявку и контактные данные (имя + телефон) — я отправлю руководству. Можно просто в чат, или нажмите кнопку "📋 Заполнить заявку" внизу._`;
      }
      return response;
    }
    let response = `Цены зависят от объёма и условий. Оставьте заявку — составим бесплатную смету за 15 минут! 📞 ${companyInfo.phone}`;
    if (suggestLeadForm) {
      response += `\n\n_Или напишите мне свою заявку и контактные данные (имя + телефон) — я отправлю руководству. Можно просто в чат, или нажмите кнопку "📋 Заполнить заявку" внизу._`;
    }
    return response;
  }

  // Service details
  if ((msg.includes('расскажи') || msg.includes('опиши') || msg.includes('что такое') || msg.includes('подробнее') || msg.includes('как')) && serviceContext) {
    let response = `${serviceContext.description}\n\nОсновные моменты: ${serviceContext.details.slice(0, 3).join(', ')}.\n\nХотите узнать стоимость? 📞 ${companyInfo.phone}`;
    if (suggestLeadForm) {
      response += `\n\n_Или напишите мне свою заявку и контактные данные (имя + телефон) — я отправлю руководству. Можно просто в чат, или нажмите кнопку "📋 Заполнить заявку" внизу._`;
    }
    return response;
  }

  // Contact-related
  if (msg.includes('телефон') || msg.includes('позвонить') || msg.includes('связаться') || msg.includes('контакт') || msg.includes('адрес') || msg.includes('почта') || msg.includes('email')) {
    return `Наши контакты:\n📞 ${companyInfo.phone}\n✉️ ${companyInfo.email}\n📍 ${companyInfo.address}\n\nЗвоните с 9:00 до 18:00! ⏰`;
  }

  // Guarantee
  if (msg.includes('гаранти') || msg.includes('срок')) {
    return `Гарантия ${companyInfo.guarantee}, всё по договору. За ${companyInfo.experience} — более 100 успешных проектов! 🏆`;
  }

  // Order / want to buy
  if (msg.includes('заказать') || msg.includes('хочу') || msg.includes('оставить') || msg.includes('купить') || msg.includes('нужно') || msg.includes('надо') || msg.includes('сделать') || msg.includes('заказ')) {
    return `Отлично! 🎉 Позвоните: ${companyInfo.phone}, или оставьте заявку на сайте. Менеджер перезвонит через 15 минут. Выезд специалиста — бесплатно! 📏`;
  }

  // Calculation / estimate
  if (msg.includes('посчит') || msg.includes('расчет') || msg.includes('смет') || msg.includes('100') || msg.includes('50') || msg.includes('200') || msg.match(/\d+\s*(кв|м|куб)/)) {
    if (serviceContext) {
      let response = `Для ${serviceContext.title} цена от ${serviceContext.price}. Для точного расчёта на 100 кв.м нужен замер — это бесплатно! 📏 Когда удобно принять специалиста? 📞 ${companyInfo.phone}`;
      if (suggestLeadForm) {
        response += `\n\n_Или напишите мне свою заявку и контактные данные (имя + телефон) — я отправлю руководству. Можно просто в чат, или нажмите кнопку "📋 Заполнить заявку" внизу._`;
      }
      return response;
    }
    let response = `Для точного расчёта нужен замер — бесплатно! 📏 Позвоните: ${companyInfo.phone}, менеджер задаст уточняющие вопросы.`;
    if (suggestLeadForm) {
      response += `\n\n_Или напишите мне свою заявку и контактные данные (имя + телефон) — я отправлю руководству. Можно просто в чат, или нажмите кнопку "📋 Заполнить заявку" внизу._`;
    }
    return response;
  }

  // Farewell
  if (msg.includes('пока') || msg.includes('до свидания') || msg.includes('спасибо') || msg.includes('благодар')) {
    return `Всегда рады помочь! 🤝 Обращайтесь ещё!`;
  }

  // Check if client is asking about mobile phone (after being asked for city number)
  if (msg.includes('мобильн') && (msg.includes('дам') || msg.includes('дать') || msg.includes('указать') || msg.includes('написать'))) {
    return `Да, конечно! 📱 Напишите ваш мобильный номер (11 цифр), и я передам его менеджеру. Он свяжется с вами в течение 15 минут!`;
  }

  // Check if client is confused or asking for clarification
  if (msg.includes('непонял') || msg.includes('не понимаю') || msg.includes('что?') || msg.includes('почему')) {
    return `Извините, если запутал вас! 😊 Я ИИ-помощник компании ЛЕГИОН. Могу помочь с:\n• Расчётом стоимости работ\n• Информацией об услугах\n• Консультацией по ЗОК (защита от БПЛА)\n• Вопросами по вакансиям\n\nПросто напишите, что вас интересует, или позвоните: ${companyInfo.phone}. 📞`;
  }

  // Default - с учётом контекста услуги
  if (serviceContext) {
    let response = `${serviceContext.description}\n\nХотите узнать стоимость или задать другой вопрос? 📞 ${companyInfo.phone} — проконсультируем бесплатно!`;
    if (suggestLeadForm) {
      response += `\n\n_Или напишите мне свою заявку и контактные данные (имя + телефон) — я отправлю руководству. Можно просто в чат, или нажмите кнопку "📋 Заполнить заявку" внизу._`;
    }
    return response;
  }

  // Default response with more context awareness
  let response = `Спасибо за вопрос! 🤝\n\nДля быстрой консультации позвоните: ${companyInfo.phone} (с 9:00 до 18:00).\n\nИли опишите подробнее, что вас интересует — строительство, демонтаж, защита от БПЛА или другая услуга? Могу рассчитать стоимость или ответить на вопросы! 😊`;
  if (suggestLeadForm) {
    response += `\n\n_Или напишите мне свою заявку и контактные данные (имя + телефон) — я отправлю руководству. Можно просто в чат, или нажмите кнопку "📋 Заполнить заявку" внизу._`;
  }
  return response;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    services: knowledgeBase?.services.length || 0,
    timestamp: new Date().toISOString()
  });
});

// Get all services endpoint
app.get('/api/services', (req, res) => {
  res.json({
    services: knowledgeBase?.services || []
  });
});

// Cache statistics endpoint
app.get('/api/cache/stats', (req, res) => {
  res.json({
    status: 'ok',
    cache: getCacheStats(),
    ttl: CACHE_TTL,
    timestamp: new Date().toISOString()
  });
});

// Get session history endpoint
app.get('/api/session/:sessionId', (req, res) => {
  const { sessionId } = req.params;

  const session = getSession(sessionId);
  const messages = getSessionMessages(sessionId);

  if (!session) {
    return res.json({
      status: 'ok',
      sessionId,
      messages: [],
      sessionExists: false,
      timestamp: new Date().toISOString()
    });
  }

  res.json({
    status: 'ok',
    sessionId,
    messages,
    sessionExists: true,
    userName: session.userName,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
    timestamp: new Date().toISOString()
  });
});

// Get session history endpoint
app.get('/api/session/:sessionId', (req, res) => {
  const { sessionId } = req.params;

  const session = getSession(sessionId);
  const messages = getSessionMessages(sessionId);

  if (!session) {
    return res.json({
      status: 'ok',
      sessionId,
      messages: [],
      sessionExists: false,
      timestamp: new Date().toISOString()
    });
  }

  res.json({
    status: 'ok',
    sessionId,
    messages,
    sessionExists: true,
    userName: session.userName,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
    timestamp: new Date().toISOString()
  });
});

// Clear cache endpoint (for debugging)
app.post('/api/cache/clear', (req, res) => {
  const { type } = req.body;
  
  let cleared = 0;
  
  if (!type || type === 'qwen') {
    cleared += qwenResponseCache.size;
    qwenResponseCache.clear();
  }
  
  if (!type || type === 'sentiment') {
    cleared += sentimentCache.size;
    sentimentCache.clear();
  }
  
  if (!type || type === 'session') {
    cleared += sessionCache.size;
    sessionCache.clear();
  }
  
  // Reset stats
  if (!type) {
    cacheStats.qwen.hits = 0;
    cacheStats.qwen.misses = 0;
    cacheStats.sentiment.hits = 0;
    cacheStats.sentiment.misses = 0;
    cacheStats.session.hits = 0;
    cacheStats.session.misses = 0;
  }
  
  console.log(`🧹 [CACHE] Cleared ${cleared} entries${type ? ` (${type})` : ' (all)'}`);
  
  res.json({
    status: 'ok',
    cleared,
    type: type || 'all',
    stats: getCacheStats(),
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(AI_PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║  🤖 AI Assistant Server (ai-assistant/)                ║
╠════════════════════════════════════════════════════════╣
║  Port: ${AI_PORT}                                            ║
║  Services: ${knowledgeBase?.services.length || 0}                                  ║
║  Knowledge Base: ✅ Loaded                               ║
║  Qwen CLI: 🤖 Available                                 ║
╠════════════════════════════════════════════════════════╣
║  💾 CACHE SYSTEM: ✅ Enabled                            ║
║  • Qwen Responses: 1 hour TTL                           ║
║  • Sentiment Analysis: 30 min TTL                       ║
║  • Session Data: 2 hours TTL                            ║
║  • Auto-cleanup: Every 10 minutes                       ║
╠════════════════════════════════════════════════════════╣
║  Telegram Integration:                                  ║
║  • Lead Capture: ✅ Auto-detect phone numbers           ║
║  • Notifications: ✅ /api/telegram-webhook              ║
║  • Bot Token: ${TELEGRAM_BOT_TOKEN ? '✅ Set' : '❌ Not set'}                        ║
║  • Chat ID: ${TELEGRAM_CHAT_ID ? '✅ Set' : '❌ Not set'}                              ║
╠════════════════════════════════════════════════════════╣
║  API Endpoints:                                         ║
║  • GET  /api/health       - Health check                ║
║  • GET  /api/services     - Get all services            ║
║  • GET  /api/cache/stats  - Cache statistics            ║
║  • POST /api/cache/clear  - Clear cache                 ║
╚════════════════════════════════════════════════════════╝
  `);
});
