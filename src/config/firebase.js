/**
 * Firebase client (Firestore + optional Realtime Database).
 *
 * Set `EXPO_PUBLIC_FIREBASE_*` in a root `.env` (see `.env.example`). The same
 * values are mirrored to `expo-constants` `extra.firebase` via `app.config.js`.
 *
 * Auth: `getAuth(app)` — enable Email/Password in Firebase Console → Authentication.
 * Realtime Database URL: `EXPO_PUBLIC_FIREBASE_DATABASE_URL` or
 * `EXPO_PUBLIC_GAMETAP_RTDB_URL`. Firestore: polls API.
 */
import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

function readExtraFirebase() {
  const fromExpo = Constants.expoConfig?.extra?.firebase;
  if (fromExpo && typeof fromExpo === 'object') return fromExpo;
  const legacy = Constants.manifest?.extra?.firebase;
  if (legacy && typeof legacy === 'object') return legacy;
  return {};
}

const extraFb = readExtraFirebase();

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || extraFb.apiKey,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || extraFb.authDomain,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || extraFb.projectId,
  storageBucket:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || extraFb.storageBucket,
  messagingSenderId:
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
    extraFb.messagingSenderId,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || extraFb.appId,
  ...(() => {
    const rtdbUrl =
      process.env.EXPO_PUBLIC_GAMETAP_RTDB_URL ||
      process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL ||
      extraFb.databaseURL;
    return rtdbUrl ? { databaseURL: rtdbUrl } : {};
  })(),
};

function hasMinimumConfig() {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.projectId &&
      firebaseConfig.appId,
  );
}

function initFirestore(app) {
  if (Platform.OS === 'web') {
    return getFirestore(app);
  }
  try {
    return initializeFirestore(app, {
      experimentalForceLongPolling: true,
    });
  } catch {
    return getFirestore(app);
  }
}

let app;
let auth;
let db;
let rtdb;

function initAuth(firebaseApp) {
  if (Platform.OS === 'web') {
    return getAuth(firebaseApp);
  }
  try {
    return initializeAuth(firebaseApp, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    return getAuth(firebaseApp);
  }
}

if (hasMinimumConfig()) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = initAuth(app);
  db = initFirestore(app);
  if (firebaseConfig.databaseURL) {
    rtdb = getDatabase(app);
  }
} else if (__DEV__) {
  console.warn(
    '[firebase] Missing EXPO_PUBLIC_FIREBASE_* (or extra.firebase). Polls use local storage until configured — see src/config/firebase.js',
  );
}

export { app, auth, db, rtdb, firebaseConfig, hasMinimumConfig };
