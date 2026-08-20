import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ?? null);
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  const signUp = async (email, password, username) => {
    // Insert a unique suffix before '@' so Firebase Auth treats each signup as
    // a distinct account, even when the user-facing email is reused.
    const [local, domain] = email.split('@');
    const uniqueEmail = `${local}+${Date.now()}@${domain}`;

    const credential = await createUserWithEmailAndPassword(auth, uniqueEmail, password);
    const { uid } = credential.user;

    await setDoc(doc(db, 'users', uid), {
      uid,
      username,
      email,
      authEmail: uniqueEmail,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${uid}&backgroundColor=2E7D32`,
      title: 'Board Game Enthusiast',
      bio: '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return credential.user;
  };

  const signIn = async (email, password) => {
    // Look up the authEmail(s) stored under this user-facing email, then try
    // each one until the password matches. Falls back to raw email for
    // accounts created before the +suffix scheme.
    const q = query(collection(db, 'users'), where('email', '==', email));
    const snap = await getDocs(q);
    const candidates = snap.docs
      .map((d) => d.data().authEmail)
      .filter(Boolean);

    if (candidates.length > 0) {
      let lastError;
      for (const authEmail of candidates) {
        try {
          return await signInWithEmailAndPassword(auth, authEmail, password);
        } catch (e) {
          lastError = e;
        }
      }
      throw lastError;
    }

    return signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = () => firebaseSignOut(auth);

  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  return (
    <AuthContext.Provider
      value={{ user, initializing, signUp, signIn, signOut, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
