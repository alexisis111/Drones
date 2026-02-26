import express from 'express';
import { createRequestListener } from '@react-router/node';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create Express server
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Telegram bot configuration
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!TELEGRAM_BOT_TOKEN) {
  console.error('Ошибка: Не установлен переменная окружения TELEGRAM_BOT_TOKEN');
}

if (!TELEGRAM_CHAT_ID) {
  console.error('Ошибка: Не установлен переменная окружения TELEGRAM_CHAT_ID');
}

// Create a route for the Telegram webhook BEFORE React Router handles all routes
app.post('/api/telegram-webhook', async (req, res) => {
  try {
    const { name, email, phone, message, objectType, subject } = req.body;

    // Validate required fields - name is always required, and either message or objectType
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Имя обязательно для заполнения'
      });
    }

    if (!message && !objectType) {
      return res.status(400).json({
        success: false,
        error: 'Сообщение или тип объекта обязательны для заполнения'
      });
    }

    // Format message for Telegram
    let telegramMessage = `
${subject ? subject : 'Новое сообщение с формы обратной связи'}

Имя: ${name}
Email: ${email || 'Не указан'}
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
      // If Telegram credentials are not set, return error but also log the message
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

// Serve static files from the build/client directory
app.use(express.static(path.join(__dirname, 'build', 'client')));

// Serve YML feed for Yandex Direct
app.get('/yml.xml', (req, res) => {
  res.setHeader('Content-Type', 'application/xml');
  res.sendFile(path.join(__dirname, 'public', 'yml.xml'));
});

// Redirect old domain to new domain
app.use((req, res, next) => {
  if (req.headers.host.includes('xn--80affa3aj.xn--p1ai')) {
    const newPath = req.protocol + '://' + 'xn--80afglc.xn--p1ai' + req.originalUrl;
    res.redirect(301, newPath);
  } else {
    next();
  }
});

// Handle all other routes with React Router
app.all(
  '*',
  createRequestListener({
    build: await import('./build/server/index.js'),
  })
);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});