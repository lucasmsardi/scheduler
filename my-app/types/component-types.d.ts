declare module 'node-telegram-bot-api' {
    import { EventEmitter } from 'events';
  
    class TelegramBot extends EventEmitter {
      constructor(token: string, options?: TelegramBotOptions);
  
      onText(regexp: RegExp, callback: (msg: TelegramBotMessage, match: RegExpExecArray | null) => void): void;
      on(event: string, listener: Function): void;
      sendMessage(chatId: number | string, text: string, options?: SendMessageOptions): Promise<TelegramBotMessage>;
    }
  
    interface TelegramBotOptions {
      polling?: boolean;
    }
  
    interface TelegramBotMessage {
      message_id: number;
      chat: {
        id: number;
        first_name?: string;
        last_name?: string;
        username?: string;
        type: string;
      };
      date: number;
      text?: string;
      from?: {
        id: number;
        first_name?: string;
        last_name?: string;
        username?: string;
      };
    }
  
    interface SendMessageOptions {
      parse_mode?: string;
      disable_web_page_preview?: boolean;
      disable_notification?: boolean;
      reply_to_message_id?: number;
    }
  
    export = TelegramBot;
  }
  