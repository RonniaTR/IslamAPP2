import api from '../api';

const QUEUE_KEY = 'analytics_queue';
let queue = [];

try {
  queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
} catch { queue = []; }

function persist() {
  try { localStorage.setItem(QUEUE_KEY, JSON.stringify(queue.slice(-100))); } catch {}
}

export function trackEvent(eventName, eventData = {}, userId = null) {
  const event = { event_name: eventName, event_data: { ...eventData, ts: Date.now() }, user_id: userId };

  // Firebase Analytics
  if (window.gtag) {
    window.gtag('event', eventName, eventData);
  }

  // Send to backend
  api.post('/analytics/event', event).catch(() => {
    queue.push(event);
    persist();
  });
}

export function flushQueue() {
  if (!queue.length) return;
  const batch = [...queue];
  queue = [];
  persist();
  batch.forEach(e => api.post('/analytics/event', e).catch(() => {
    queue.push(e);
    persist();
  }));
}

// Auto-flush on reconnect
window.addEventListener('online', flushQueue);

// Track page views
export function trackPageView(path) {
  trackEvent('page_view', { path });
}

// Track feature usage
export function trackFeature(feature, action = 'use') {
  trackEvent('feature_use', { feature, action });
}

export default { trackEvent, trackPageView, trackFeature, flushQueue };
