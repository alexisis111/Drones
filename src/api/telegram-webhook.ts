import express from 'express';
import axios from 'axios';

const router = express.Router();

// Telegram bot configuration
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!TELEGRAM_BOT_TOKEN) {
  console.error('Ошибка: Не установлен переменная окружения TELEGRAM_BOT_TOKEN');
}

if (!TELEGRAM_CHAT_ID) {
  console.error('Ошибка: Не установлен переменная окружения TELEGRAM_CHAT_ID');
}

router.post('/telegram-webhook', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Validate required fields
    if (!name || !message) {
      return res.status(400).json({
        success: false,
        error: 'Имя и сообщение обязательны для заполнения'
      });
    }

    // Format message for Telegram
    const telegramMessage = `
Новое сообщение с формы обратной связи:

Имя: ${name}
Email: ${email || 'Не указан'}
Телефон: ${phone || 'Не указан'}
Сообщение: ${message}

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

export default router;