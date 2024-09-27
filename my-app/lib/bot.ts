import TelegramBot from 'node-telegram-bot-api';

// Your bot token from BotFather
const token: string = 'YOUR_BOT_TOKEN';

// Create a bot that uses polling to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Listen for `/start` command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from?.first_name || "User";

  // Send a welcome message
  bot.sendMessage(chatId, `Hello, ${firstName}! Welcome to my bot.`);
});

// Listen for any kind of message
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text || "";

  // Echo the received message
  bot.sendMessage(chatId, `You said: ${text}`);
});
