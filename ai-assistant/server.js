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
const PORT = process.env.AI_ASSISTANT_PORT || 3002;

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

// Extract phone number from message
function extractPhoneNumber(message) {
  if (!message) return null;
  
  // Russian phone patterns: +7 (XXX) XXX-XX-XX, 8 XXX XXX-XX-XX, etc.
  const phonePatterns = [
    /(\+7|8)\s*\(?(\d{3})\)?\s*(\d{3})\s*[-]?(\d{2})\s*[-]?(\d{2})/g,
    /(\+7|8)\s*[\-\s]?\s*(\d{3})\s*[\-\s]?\s*(\d{3})\s*[\-\s]?\s*(\d{2})\s*[\-\s]?\s*(\d{2})/g,
    /(\+7|8)\s*\((\d{3})\)\s*(\d{3})\s*[-]?(\d{2})\s*[-]?(\d{2})/g,
  ];
  
  for (const pattern of phonePatterns) {
    const match = message.match(pattern);
    if (match) {
      // Clean and format phone number
      let phone = match[0].replace(/\D/g, '');
      if (phone.startsWith('8') && phone.length === 11) {
        phone = '+7' + phone.substring(1);
      } else if (phone.length === 11 && phone.startsWith('7')) {
        phone = '+' + phone;
      }
      if (phone.length >= 11) {
        return phone;
      }
    }
  }
  
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
  
  for (const pattern of namePatterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      return match[1].charAt(0).toUpperCase() + match[1].slice(1);
    }
  }
  
  // Try to get from history
  const lastUserMessage = history.filter(h => h.role === 'КЛИЕНТ').pop();
  if (lastUserMessage) {
    for (const pattern of namePatterns) {
      const match = lastUserMessage.content.match(pattern);
      if (match && match[1]) {
        return match[1].charAt(0).toUpperCase() + match[1].slice(1);
      }
    }
  }
  
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

// Send lead to Telegram
async function sendLeadToTelegram({ name, phone, message, serviceSlug, serviceName, vacancyPosition, experience }) {
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
    `.trim() : `
🔥 <b>Новая заявка из AI-чата!</b>

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
      type: isVacancyApplication ? 'vacancy' : 'service',
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
function buildPrompt(message, serviceContext, conversationHistory = [], suggestLeadForm = false) {
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
      `• ${v.position} (${v.department})`
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
4. Зарплата: "По договоренности"
`;
  }

  const conversationContext = conversationHistory.length > 0
    ? `\n[ИСТОРИЯ ДИАЛОГА]\n${conversationHistory.map(h => `${h.role}: ${h.content}`).join('\n')}`
    : '';

  const leadFormSuggestion = suggestLeadForm
    ? `\n❗ КЛИЕНТ ЗАИНТЕРЕСОВАН! Обязательно добавь в конце ответа: "или хотите, чтобы я сформировал и отправил вашу заявку руководству? Просто напишите мне тут свою заявку и контактные данные (имя и телефон) — я всё подготовлю и отправлю. Или нажмите кнопку '📋 Заполнить заявку' внизу чата."`
    : '';

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
✓ ВАЖНО: После 2-3 сообщений от клиента — в конце ответа предложи оставить заявку ТОЛЬКО если клиент спрашивает про цену, расчет стоимости или хочет заказать. НЕ предлагай если клиент просто смотрит список услуг или спрашивает общую информацию: "Хотите, чтобы я сформировал и отправил вашу заявку руководству? Просто напишите мне тут свою заявку и контактные данные (имя и телефон) — я всё подготовлю и отправлю. Или нажмите кнопку '📋 Заполнить заявку' внизу чата."${leadFormSuggestion}
✓ ВАЖНО: В КАЖДОМ ответе в конце добавляй: "Просто напишите свои контактные данные (имя и телефон) или позвоните: +7 (931) 247-08-88. 📞"

[ВАЖНОЕ ПРАВИЛО: ПРЕДСТАВЛЕНИЕ]
❌ НИКОГДА не называй себя "Алексей" или любым другим человеческим именем
✅ При первом приветствии представляйся ТОЛЬКО так: "виртуальный ИИ-помощник сайта Легион" или "ИИ-помощник" или "виртуальный помощник"
✅ Если клиент спрашивает "кто ты?" — отвечай: "Я виртуальный ИИ-помощник сайта строительной компании ЛЕГИОН"

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
    // Extract phone number and send to Telegram
    // ============================================
    const phoneNumber = extractPhoneNumber(message);

    // Extract user name for logging
    const userName = extractName(message, history) || 'Клиент';

    // Log user message to Telegram (async, non-blocking)
    logChatMessage(sessionId || 'unknown', userName, message, true).catch(err => {
      console.error('❌ [TG-LOGS] Failed to log user message:', err.message);
    });

    // If phone detected - send lead to Telegram immediately
    if (phoneNumber) {
      console.log('📞 [CHAT] Phone number detected:', phoneNumber);

      const name = userName;
      const serviceName = serviceContext?.title || null;

      // Send lead to Telegram (async, non-blocking)
      sendLeadToTelegram({
        name: name || 'Клиент из чата',
        phone: phoneNumber,
        message,
        serviceSlug,
        serviceName
      }).then(sent => {
        if (sent) {
          console.log('✅ [CHAT] Lead successfully sent to Telegram');
        }
      }).catch(err => {
        console.error('❌ [CHAT] Failed to send lead:', err.message);
      });

      // Return immediate response without calling Qwen
      console.log('📞 [CHAT] Phone detected - returning confirmation');

      res.json({
        response: name
          ? `✅ **${name}, ваша заявка отправлена!**\n\nЯ передал ваш номер **${phoneNumber}** менеджеру.\n\nОн свяжется с вами в течение 15 минут для уточнения деталей. 📞`
          : `✅ **Ваш номер сохранён!**\n\nЯ передал номер **${phoneNumber}** менеджеру.\n\nОн свяжется с вами в течение 15 минут для уточнения деталей. 📞`,
        sessionId: sessionId || Date.now().toString(),
        serviceContext: serviceContext ? {
          title: serviceContext.title,
          price: serviceContext.price,
          url: serviceContext.url
        } : null,
        qwenUsed: false,
        phoneDetected: true,
        leadSubmitted: true,
        suggestLeadForm: false
      });
      
      // Log bot response to Telegram (async, non-blocking)
      logChatMessage(sessionId || 'unknown', userName, name 
        ? `✅ **${name}, ваша заявка отправлена!**\n\nЯ передал ваш номер **${phoneNumber}** менеджеру.\n\nОн свяжется с вами в течение 15 минут для уточнения деталей. 📞`
        : `✅ **Ваш номер сохранён!**\n\nЯ передал номер **${phoneNumber}** менеджеру.\n\nОн свяжется с вами в течение 15 минут для уточнения деталей. 📞`, false).catch(err => {
        console.error('❌ [TG-LOGS] Failed to log bot response:', err.message);
      });
      
      return;
    }

    // Build prompt
    const prompt = buildPrompt(message, serviceContext, history, suggestLeadForm);

    console.log('🤖 [CHAT] Prompt (first 500 chars):', prompt.substring(0, 500) + '...');

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
      // Экранируем специальные символы для командной строки Windows
      const escapedPrompt = prompt.replace(/"/g, '\\"').replace(/\n/g, '\\n');

      // Запускаем Qwen CLI в YOLO режиме (-y) для автоматического выполнения
      // Используем -p для промпта и -y для автоматического подтверждения
      const { stdout } = await execAsync(`qwen -y -p "${escapedPrompt}"`, {
        cwd: __dirname,
        timeout: 30000, // Уменьшаем таймаут до 30 секунд
        maxBuffer: 2 * 1024 * 1024,
        env: { ...process.env, FORCE_COLOR: '0' } // Отключаем цвета для чистого вывода
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
  // Extract phone number and send to Telegram
  // ============================================
  const phoneNumber = extractPhoneNumber(message);

  if (phoneNumber) {
    console.log('📞 [FALLBACK] Phone number detected:', phoneNumber);

    const name = extractName(message, history);
    const serviceName = serviceContext?.title || null;

    // Send lead to Telegram (async, non-blocking)
    sendLeadToTelegram({
      name,
      phone: phoneNumber,
      message,
      serviceSlug: serviceContext?.slug,
      serviceName
    }).then(sent => {
      if (sent) {
        console.log('✅ [FALLBACK] Lead successfully sent to Telegram');
      }
    }).catch(err => {
      console.error('❌ [FALLBACK] Failed to send lead:', err.message);
    });
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

  // Default - с учётом контекста услуги
  if (serviceContext) {
    let response = `${serviceContext.description}\n\nХотите узнать стоимость или задать другой вопрос? 📞 ${companyInfo.phone} — проконсультируем бесплатно!`;
    if (suggestLeadForm) {
      response += `\n\n_Или напишите мне свою заявку и контактные данные (имя + телефон) — я отправлю руководству. Можно просто в чат, или нажмите кнопку "📋 Заполнить заявку" внизу._`;
    }
    return response;
  }

  let response = `Спасибо за вопрос! Для консультации позвоните: ${companyInfo.phone}. Менеджер поможет! 😊`;
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
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║  🤖 AI Assistant Server (ai-assistant/)                ║
╠════════════════════════════════════════════════════════╣
║  Port: ${PORT}                                            ║
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
