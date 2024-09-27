import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";

const apiId = 28132051;
const apiHash = '5c93e7b80fb4bab073bc2ea9a72492b8';

const stringSession = new StringSession('');

(async () => {
  console.log('Starting Telegram Client...');

  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () => '+5551981977910', 
    phoneCode: async () => '12345', 
    password: async () => '',
    onError: (err) => console.log(err),
  });

  console.log('You are now connected!');

  const sessionString = client.session.save();
  console.log('Your session string:', sessionString);

  const result = await client.sendMessage('me', { message: 'Hello, this is a hardcoded message!' });
  
  console.log('Message sent:', result);

  await client.disconnect();
})();
