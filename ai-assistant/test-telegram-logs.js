import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config();

const TELEGRAM_LOGS_BOT_TOKEN = process.env.TELEGRAM_LOGS_BOT_TOKEN;
const TELEGRAM_LOGS_GROUP_ID = process.env.TELEGRAM_LOGS_GROUP_ID;

console.log('🔍 Testing Telegram Logs Configuration...\n');

if (!TELEGRAM_LOGS_BOT_TOKEN) {
  console.error('❌ TELEGRAM_LOGS_BOT_TOKEN not set in .env');
  process.exit(1);
}

if (!TELEGRAM_LOGS_GROUP_ID) {
  console.error('❌ TELEGRAM_LOGS_GROUP_ID not set in .env');
  process.exit(1);
}

console.log('✅ Environment variables loaded');
console.log(`   Token: ${TELEGRAM_LOGS_BOT_TOKEN.substring(0, 20)}...`);
console.log(`   Group ID: ${TELEGRAM_LOGS_GROUP_ID}\n`);

// Test 1: Get chat info
console.log('📋 Test 1: Getting chat info...');
try {
  const chatResponse = await axios.get(
    `https://api.telegram.org/bot${TELEGRAM_LOGS_BOT_TOKEN}/getChat`,
    { params: { chat_id: TELEGRAM_LOGS_GROUP_ID } }
  );
  
  const chat = chatResponse.data.result;
  console.log('✅ Chat found:');
  console.log(`   Title: ${chat.title}`);
  console.log(`   Type: ${chat.type}`);
  console.log(`   Is Forum: ${chat.is_forum || false}`);
  console.log(`   Members: ${chat.members_count || 'N/A'}\n`);
  
  if (!chat.is_forum) {
    console.warn('⚠️  WARNING: Group is not a forum! Topics cannot be created.');
    console.warn('   Please convert the group to a supergroup with topics enabled.\n');
  }
} catch (error) {
  console.error(`❌ Failed to get chat info: ${error.message}\n`);
  process.exit(1);
}

// Test 2: Create test topic
console.log('📋 Test 2: Creating test topic...');
try {
  const topicResponse = await axios.post(
    `https://api.telegram.org/bot${TELEGRAM_LOGS_BOT_TOKEN}/createForumTopic`,
    {
      chat_id: TELEGRAM_LOGS_GROUP_ID,
      name: '🧪 Тестовая тема',
      icon_color: 0x6495ED
    }
  );
  
  const topicId = topicResponse.data.result.message_thread_id;
  console.log(`✅ Topic created: ID ${topicId}\n`);
  
  // Test 3: Send message to topic
  console.log('📋 Test 3: Sending message to topic...');
  await axios.post(
    `https://api.telegram.org/bot${TELEGRAM_LOGS_BOT_TOKEN}/sendMessage`,
    {
      chat_id: TELEGRAM_LOGS_GROUP_ID,
      message_thread_id: topicId,
      text: '🧪 **Тестовое сообщение**\n\nЭто тестовая проверка системы логирования чата.\n\n✅ Всё работает корректно!',
      parse_mode: 'Markdown'
    }
  );
  console.log('✅ Message sent successfully\n');
  
  // Test 4: Close test topic
  console.log('📋 Test 4: Closing test topic...');
  await axios.post(
    `https://api.telegram.org/bot${TELEGRAM_LOGS_BOT_TOKEN}/closeForumTopic`,
    {
      chat_id: TELEGRAM_LOGS_GROUP_ID,
      message_thread_id: topicId
    }
  );
  console.log('✅ Topic closed\n');
  
  console.log('🎉 All tests passed successfully!');
  console.log('📝 You can now use the chat logging feature.\n');
  
} catch (error) {
  console.error(`❌ Test failed: ${error.message}`);
  if (error.response?.data) {
    console.error('   Response:', JSON.stringify(error.response.data, null, 2));
  }
  console.log('\n💡 Troubleshooting:');
  console.log('   1. Make sure the bot is an administrator of the group');
  console.log('   2. Make sure the group has topics enabled (is a forum)');
  console.log('   3. Check that the bot token and group ID are correct\n');
  process.exit(1);
}
