/**
 * Global Logger Service
 * Replaces console.log with structured, leveled logging.
 * In production, can forward errors to analytics.
 */

const LOG_LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };
const CURRENT_LEVEL = process.env.NODE_ENV === 'production' ? LOG_LEVELS.warn : LOG_LEVELS.debug;

const MAX_LOG_HISTORY = 200;
const logHistory = [];

function formatMessage(level, module, message, data) {
  const ts = new Date().toISOString().slice(11, 23);
  return { ts, level, module, message, data };
}

function shouldLog(level) {
  return LOG_LEVELS[level] >= CURRENT_LEVEL;
}

const logger = {
  debug(module, message, data) {
    if (!shouldLog('debug')) return;
    const entry = formatMessage('debug', module, message, data);
    logHistory.push(entry);
    if (logHistory.length > MAX_LOG_HISTORY) logHistory.shift();
    console.debug(`[${entry.ts}] 🔍 ${module}: ${message}`, data || '');
  },

  info(module, message, data) {
    if (!shouldLog('info')) return;
    const entry = formatMessage('info', module, message, data);
    logHistory.push(entry);
    if (logHistory.length > MAX_LOG_HISTORY) logHistory.shift();
    console.info(`[${entry.ts}] ℹ️ ${module}: ${message}`, data || '');
  },

  warn(module, message, data) {
    if (!shouldLog('warn')) return;
    const entry = formatMessage('warn', module, message, data);
    logHistory.push(entry);
    if (logHistory.length > MAX_LOG_HISTORY) logHistory.shift();
    console.warn(`[${entry.ts}] ⚠️ ${module}: ${message}`, data || '');
  },

  error(module, message, data) {
    const entry = formatMessage('error', module, message, data);
    logHistory.push(entry);
    if (logHistory.length > MAX_LOG_HISTORY) logHistory.shift();
    console.error(`[${entry.ts}] 🔴 ${module}: ${message}`, data || '');

    // In production, send to analytics
    if (process.env.NODE_ENV === 'production' && window.gtag) {
      try {
        window.gtag('event', 'exception', {
          description: `${module}: ${message}`,
          fatal: true,
        });
      } catch { /* analytics unavailable */ }
    }
  },

  /** Get recent log entries for debugging */
  getHistory() { return [...logHistory]; },

  /** Performance measurement helper */
  time(module, label) {
    const start = performance.now();
    return {
      end: () => {
        const duration = Math.round(performance.now() - start);
        logger.debug(module, `${label} completed in ${duration}ms`);
        return duration;
      }
    };
  }
};

export default logger;
