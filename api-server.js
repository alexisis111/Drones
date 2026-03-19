import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import dotenv from 'dotenv';
import { exec } from 'child_process';
import { promisify } from 'util';

// Load environment variables from .env file
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const execAsync = promisify(exec);

// Create Express server
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Telegram bot configuration
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!TELEGRAM_BOT_TOKEN) {
  console.warn('⚠️  TELEGRAM_BOT_TOKEN not set');
}

if (!TELEGRAM_CHAT_ID) {
  console.warn('⚠️  TELEGRAM_CHAT_ID not set');
}

// ============================================
// AI Assistant Proxy - просто проксируем на ai-assistant/server.js
// ============================================

app.post('/api/assistant/chat', async (req, res) => {
  try {
    const { message, serviceSlug, sessionId, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('🤖 [MAIN] Proxying chat request to AI Assistant (port 3002):', {
      message,
      serviceSlug,
      sessionId,
      historyLength: history.length
    });

    // Проксируем запрос на AI Assistant Server (порт 3002)
    const aiAssistantUrl = 'http://localhost:3002/api/chat';

    // Увеличиваем таймаут до 60 секунд (Qwen может работать долго)
    const response = await axios.post(aiAssistantUrl, {
      message,
      serviceSlug,
      sessionId,
      history
    }, {
      timeout: 60000, // 60 секунд вместо 30
      timeoutErrorMessage: 'AI Assistant timeout - Qwen is taking too long'
    });

    console.log('🤖 [MAIN] Response received from AI Assistant');

    res.json(response.data);

  } catch (error) {
    console.error('❌ [MAIN] AI Assistant Server error:', error.message);
    
    // Проверяем, был ли это таймаут
    const isTimeout = error.code === 'ECONNABORTED' || error.message.includes('timeout');
    
    if (isTimeout) {
      console.log('⏰ [MAIN] AI Assistant timeout - returning contact fallback');
      // Специальный ответ при таймауте
      res.json({
        response: 'Простите, я не могу ответить на ваш вопрос прямо сейчас. Пожалуйста, для связи с нами заполните форму на странице **Контакты** или позвоните по телефону **+7 (931) 247-08-88**. 📞',
        fallback: true,
        timeout: true
      });
    } else {
      // Fallback если AI сервер недоступен
      console.log('🔧 [MAIN] AI Assistant unavailable - returning fallback');
      res.status(503).json({
        response: 'AI-ассистент временно недоступен. Пожалуйста, позвоните нам: +7 (931) 247-08-88',
        fallback: true
      });
    }
  }
});

// Health check endpoint для AI
app.get('/api/assistant/health', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:3002/api/health', {
      timeout: 5000
    });
    res.json(response.data);
  } catch (error) {
    res.json({
      status: 'degraded',
      aiAssistantAvailable: false,
      error: error.message
    });
  }
});

// ============================================
// Telegram Webhook
// ============================================

app.post('/api/telegram-webhook', async (req, res) => {
  try {
    const { name, phone, message, objectType, subject } = req.body;

    // Validate required fields - only name is required
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Имя обязательно для заполнения'
      });
    }

    // Format message for Telegram
    let telegramMessage = `
${subject ? subject : 'Новое сообщение с формы обратной связи'}

Имя: ${name}
Телефон: ${phone || 'Не указан'}
${objectType ? `Тип объекта: ${objectType}` : ''}
${message ? `Сообщение: ${message}` : ''}

Время получения: ${new Date().toLocaleString('ru-RU')}
    `.trim();

    // Send message to Telegram bot
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

      await axios.post(telegramApiUrl, {
        chat_id: TELEGRAM_CHAT_ID,
        text: telegramMessage,
        parse_mode: 'HTML'
      });

      res.json({
        success: true,
        message: 'Сообщение успешно отправлено!'
      });
    } else {
      console.error('Telegram credentials are not set');
      console.log('Message that would have been sent:', telegramMessage);

      res.status(500).json({
        success: false,
        error: 'Ошибка настройки Telegram бота'
      });
    }
  } catch (error) {
    console.error('Ошибка при отправке сообщения в Telegram:', error);

    res.status(500).json({
      success: false,
      error: 'Ошибка при отправке сообщения'
    });
  }
});

// ============================================
// Service Order
// ============================================

app.post('/api/order-service', async (req, res) => {
  try {
    const { name, phone, company, message, serviceName, serviceId } = req.body;

    // Validate required fields
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Имя и телефон обязательны для заполнения'
      });
    }

    // Format message for Telegram
    const telegramMessage = `
Новый заказ услуги:

Имя: ${name}
Телефон: ${phone}
Компания: ${company || 'Не указана'}
Сообщение: ${message || 'Не указано'}

Услуга: ${serviceName}
ID услуги: ${serviceId || 'Не указан'}

Время получения: ${new Date().toLocaleString('ru-RU')}
    `.trim();

    // Send message to Telegram bot
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

      await axios.post(telegramApiUrl, {
        chat_id: TELEGRAM_CHAT_ID,
        text: telegramMessage,
        parse_mode: 'HTML'
      });

      res.json({
        success: true,
        message: 'Заявка на услугу успешно отправлена! Мы свяжемся с вами в ближайшее время.'
      });
    } else {
      console.error('Telegram credentials are not set');
      console.log('Message that would have been sent:', telegramMessage);

      res.status(500).json({
        success: false,
        message: 'Ошибка настройки Telegram бота'
      });
    }
  } catch (error) {
    console.error('Ошибка при отправке заказа услуги в Telegram:', error);

    res.status(500).json({
      success: false,
      message: 'Ошибка при отправке заявки'
    });
  }
});

// ============================================
// Start AI Assistant Server from ai-assistant/
// ============================================

function startAiAssistantServer() {
  const aiAssistantPath = path.join(__dirname, 'ai-assistant', 'server.js');

  console.log('🤖 [MAIN] Starting AI Assistant Server from:', aiAssistantPath);
  console.log('🤖 [MAIN] AI Assistant will run on port 3002');

  // Запускаем ai-assistant/server.js как отдельный процесс
  const aiProcess = exec(`node "${aiAssistantPath}"`, {
    cwd: path.join(__dirname, 'ai-assistant'),
    env: { ...process.env, AI_ASSISTANT_PORT: '3002' }
  });

  aiProcess.stdout.on('data', (data) => {
    console.log(`🤖 [AI-SERVER] ${data.toString().trim()}`);
  });

  aiProcess.stderr.on('data', (data) => {
    console.error(`❌ [AI-SERVER] ${data.toString().trim()}`);
  });

  aiProcess.on('error', (error) => {
    console.error('❌ [MAIN] Failed to start AI Assistant Server:', error.message);
  });

  aiProcess.on('exit', (code) => {
    console.log(`🤖 [MAIN] AI Assistant Server exited with code ${code}`);
  });

  return aiProcess;
}

// ============================================
// Start Main API Server
// ============================================

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║  🤖 LEGION API Server + AI Assistant                   ║
╠════════════════════════════════════════════════════════╣
║  Main API Port: ${PORT}                                    ║
║  AI Assistant Port: 3002 (ai-assistant/)               ║
╠════════════════════════════════════════════════════════╣
║  Endpoints:                                            ║
║  • Telegram Webhook: ✅ /api/telegram-webhook          ║
║  • Service Orders: ✅ /api/order-service               ║
║  • AI Chat (proxy): 🤖 /api/assistant/chat → :3002     ║
║  • AI Health: 📊 /api/assistant/health                 ║
╚════════════════════════════════════════════════════════╝
  `);

  // Запускаем AI Assistant сервер из папки ai-assistant/
  startAiAssistantServer();
});
