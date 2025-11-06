// Telegram notifications utility
export class NotificationManager {
  private static webApp: any = null;

  static init() {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      this.webApp = window.Telegram.WebApp;
    }
  }

  static sendNotification(type: 'success' | 'error' | 'warning', message: string) {
    if (!this.webApp?.HapticFeedback) return;

    // Haptic feedback
    switch (type) {
      case 'success':
        this.webApp.HapticFeedback.notificationOccurred('success');
        break;
      case 'error':
        this.webApp.HapticFeedback.notificationOccurred('error');
        break;
      case 'warning':
        this.webApp.HapticFeedback.notificationOccurred('warning');
        break;
    }

    // Show alert (you can replace with custom UI)
    this.webApp.showAlert(message);
  }

  static vibrate(type: 'light' | 'medium' | 'heavy' = 'medium') {
    if (!this.webApp?.HapticFeedback) return;
    this.webApp.HapticFeedback.impactOccurred(type);
  }

  static showPopup(title: string, message: string, buttons?: { text: string; type?: string }[]) {
    if (!this.webApp?.showPopup) return;

    this.webApp.showPopup({
      title,
      message,
      buttons: buttons || [{ text: 'OK', type: 'default' }]
    });
  }
}

// Initialize on import
if (typeof window !== 'undefined') {
  NotificationManager.init();
}

