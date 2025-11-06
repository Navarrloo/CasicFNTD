import { useState, useEffect } from 'react';
import { TelegramWebApp, TelegramUser } from '../types';

declare global {
  interface Window {
    Telegram: {
      WebApp: TelegramWebApp;
    };
  }
}

export function useTelegram() {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const app = window.Telegram.WebApp;
      app.ready();
      setWebApp(app);
    }
  }, []);

  const user: TelegramUser | undefined = webApp?.initDataUnsafe?.user;

  return { webApp, user };
}