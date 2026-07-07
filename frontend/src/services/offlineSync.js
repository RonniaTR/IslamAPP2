/**
 * Offline Queue + Background Sync Service
 * Queues failed API writes when offline and replays them when online.
 */
import { openDB } from 'idb';
import logger from './logger';

const DB_NAME = 'islamapp_sync';
const DB_VERSION = 1;
const STORE_NAME = 'pending_actions';

let dbPromise = null;
function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        }
      },
    });
  }
  return dbPromise;
}

/**
 * Add a failed action to the sync queue.
 * @param {string} method - HTTP method (POST, PUT, DELETE)
 * @param {string} url - API URL
 * @param {object} data - Request body
 */
export async function queueAction(method, url, data) {
  try {
    const db = await getDB();
    await db.add(STORE_NAME, {
      method,
      url,
      data,
      createdAt: Date.now(),
    });
    logger.info('OfflineSync', `Queued ${method} ${url} for background sync`);
  } catch (e) {
    logger.error('OfflineSync', 'Failed to queue action', e.message);
  }
}

/**
 * Replay all pending actions. Called when going online.
 * @param {import('axios').AxiosInstance} api - Axios instance
 */
export async function replayQueue(api) {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const actions = await store.getAll();

    if (actions.length === 0) return;
    logger.info('OfflineSync', `Replaying ${actions.length} queued actions`);

    for (const action of actions) {
      try {
        await api({ method: action.method, url: action.url, data: action.data });
        await store.delete(action.id);
        logger.info('OfflineSync', `Replayed ${action.method} ${action.url}`);
      } catch (e) {
        // Keep failed actions in queue for next retry
        logger.warn('OfflineSync', `Replay failed for ${action.url}`, e.message);
      }
    }
  } catch (e) {
    logger.error('OfflineSync', 'replayQueue error', e.message);
  }
}

/**
 * Get count of pending actions.
 */
export async function getPendingCount() {
  try {
    const db = await getDB();
    return await db.count(STORE_NAME);
  } catch {
    return 0;
  }
}

/**
 * Initialize online/offline listeners and auto-replay.
 * @param {import('axios').AxiosInstance} api
 */
export function initOfflineSync(api) {
  window.addEventListener('online', () => {
    logger.info('OfflineSync', 'Back online — replaying pending actions');
    replayQueue(api);
  });

  // Replay any pending actions on startup if online
  if (navigator.onLine) {
    replayQueue(api);
  }
}
