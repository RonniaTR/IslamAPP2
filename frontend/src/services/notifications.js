/**
 * Push Notification Manager
 * Handles FCM registration, permission requests, and notification display.
 */
import logger from './logger';

const VAPID_KEY = process.env.REACT_APP_VAPID_KEY || '';

class NotificationManager {
  constructor() {
    this.permission = Notification?.permission || 'default';
    this.subscription = null;
  }

  /** Check if push notifications are supported */
  isSupported() {
    return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
  }

  /** Request notification permission */
  async requestPermission() {
    if (!this.isSupported()) {
      logger.warn('Notifications', 'Push notifications not supported');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      this.permission = result;
      logger.info('Notifications', `Permission: ${result}`);
      return result === 'granted';
    } catch (e) {
      logger.error('Notifications', 'Permission request failed', e.message);
      return false;
    }
  }

  /** Subscribe to push notifications via Service Worker */
  async subscribe() {
    if (this.permission !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) return null;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      let sub = await registration.pushManager.getSubscription();

      if (!sub && VAPID_KEY) {
        sub = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this._urlBase64ToUint8Array(VAPID_KEY),
        });
        logger.info('Notifications', 'Subscribed to push');
      }

      this.subscription = sub;
      return sub;
    } catch (e) {
      logger.error('Notifications', 'Subscribe failed', e.message);
      return null;
    }
  }

  /** Show a local notification (not push) */
  async showLocal(title, body, options = {}) {
    if (this.permission !== 'granted') return;

    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        vibrate: [100, 50, 100],
        ...options,
      });
    } catch (e) {
      logger.error('Notifications', 'showLocal failed', e.message);
    }
  }

  /** Schedule a prayer reminder (uses setTimeout for web, not ideal but works) */
  schedulePrayerReminder(prayerName, prayerTime, minutesBefore = 10) {
    const [h, m] = prayerTime.split(':').map(Number);
    const target = new Date();
    target.setHours(h, m - minutesBefore, 0, 0);

    const delay = target.getTime() - Date.now();
    if (delay <= 0) return null; // Already passed

    const timerId = setTimeout(() => {
      this.showLocal(
        `${prayerName} Vakti Yaklaşıyor`,
        `${prayerName} namazına ${minutesBefore} dakika kaldı.`,
        { data: { url: '/' }, tag: `prayer-${prayerName}` }
      );
    }, delay);

    logger.debug('Notifications', `Scheduled ${prayerName} reminder in ${Math.round(delay / 60000)}min`);
    return timerId;
  }

  /** Get user notification preferences from localStorage */
  getPreferences() {
    try {
      return JSON.parse(localStorage.getItem('notification_prefs') || '{}');
    } catch {
      return {};
    }
  }

  /** Save notification preferences */
  setPreferences(prefs) {
    localStorage.setItem('notification_prefs', JSON.stringify(prefs));
  }

  /** Convert VAPID key */
  _urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
  }
}

const notifications = new NotificationManager();
export default notifications;
