import { get, onValue, ref } from 'firebase/database';
import { rtdb, firebaseConfig, hasMinimumConfig } from '../config/firebase';

/** Path under GameTap Realtime Database (no leading slash). */
export const GAMETAP_RTDB_FETCH_PATH = 'boardGameIndex/hZOqGTFTgMNji7awDpK7';

export function getGameTapRtdbHost() {
  const url = firebaseConfig.databaseURL;
  if (!url || typeof url !== 'string') return null;
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
}

export function isGameTapRealtimeDatabaseAvailable() {
  return Boolean(
    hasMinimumConfig() && rtdb && firebaseConfig.databaseURL,
  );
}

/**
 * Read data from GameTap Realtime Database using `firebaseConfig.databaseURL`.
 */
export async function retrieveFromGameTapRtdb() {
  if (!hasMinimumConfig()) {
    return {
      data: null,
      error:
        'Firebase is not configured. Add EXPO_PUBLIC_FIREBASE_* to `.env`.',
    };
  }
  if (!firebaseConfig.databaseURL) {
    return {
      data: null,
      error:
        'GameTap Realtime Database URL missing. Set EXPO_PUBLIC_FIREBASE_DATABASE_URL or EXPO_PUBLIC_GAMETAP_RTDB_URL in `.env`, then restart Expo.',
    };
  }
  if (!rtdb) {
    return {
      data: null,
      error: 'Realtime Database did not initialize. Check your database URL.',
    };
  }

  try {
    const nodeRef = ref(rtdb, GAMETAP_RTDB_FETCH_PATH);
    const snap = await get(nodeRef);
    if (!snap.exists()) {
      return { data: null, error: null };
    }
    return { data: snap.val(), error: null };
  } catch (e) {
    return {
      data: null,
      error: e.message || 'Failed to read GameTap Realtime Database.',
    };
  }
}

/**
 * Live connection: subscribe to the node; callback receives `null` if missing.
 * @returns {() => void} unsubscribe
 */
export function subscribeGameTapRtdbNode(onData, onError) {
  if (!hasMinimumConfig()) {
    setTimeout(() =>
      onError?.(new Error('Firebase is not configured. Add EXPO_PUBLIC_FIREBASE_* to `.env`.')),
    0);
    return () => {};
  }
  if (!firebaseConfig.databaseURL || !rtdb) {
    setTimeout(() =>
      onError?.(
        new Error(
          'Realtime Database URL missing or not initialized. Set EXPO_PUBLIC_FIREBASE_DATABASE_URL (or EXPO_PUBLIC_GAMETAP_RTDB_URL), restart Expo.',
        ),
      ),
    0);
    return () => {};
  }

  const nodeRef = ref(rtdb, GAMETAP_RTDB_FETCH_PATH);
  return onValue(
    nodeRef,
    (snap) => {
      onData(snap.exists() ? snap.val() : null);
    },
    (err) => {
      onError?.(err instanceof Error ? err : new Error(String(err)));
    },
  );
}
