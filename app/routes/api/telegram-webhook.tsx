import type { ActionFunctionArgs } from "@react-router/node";
import { json } from "@react-router/node";
import axios from 'axios';

// Telegram bot configuration
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!TELEGRAM_BOT_TOKEN) {
  console.error('Ошибка: Не установлен переменная окружения TELEGRAM_BOT_TOKEN');
}

if (!TELEGRAM_CHAT_ID) {
  console.error('Ошибка: Не установлен переменная окружения TELEGRAM_CHAT_ID');
}

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const formData = await request.json();
    const { name, email, phone, message, objectType, subject } = formData;

    // Validate required fields - name is required for all forms
    // For contact forms: message is required
    // For estimate forms: objectType is required (message is optional)
    if (!name) {
      return json({
        success: false,
        error: 'Имя обязательно для заполнения'
      }, { status: 400 });
    }

    // Format message for Telegram based on form type
    const isEstimateForm = !!objectType;
    const telegramMessage = `
${subject ? `<b>${subject}</b>\n\n` : ''}${isEstimateForm ? '<b>Заявка на бесплатный расчет защиты от БПЛА</b>\n\n' : '<b>Новое сообщение с формы обратной связи:</b>\n\n'}
Имя: ${name}
Email: ${email || 'Не указан'}
Телефон: ${phone || 'Не указан'}
${isEstimateForm ? `Тип объекта: ${objectType}\n` : ''}Сообщение: ${message || 'Не указано'}

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

      return json({
        success: true,
        message: 'Сообщение успешно отправлено!'
      });
    } else {
      // If Telegram credentials are not set, return error but also log the message
      console.error('Telegram credentials are not set');
      console.log('Message that would have been sent:', telegramMessage);

      return json({
        success: false,
        error: 'Ошибка настройки Telegram бота'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Ошибка при отправке сообщения в Telegram:', error);

    return json({
      success: false,
      error: 'Ошибка при отправки сообщения'
    }, { status: 500 });
  }
};

// Экспортируем пустой loader, чтобы избежать ошибки
export const loader = async () => {
  return json({ message: "Telegram webhook endpoint" });
};