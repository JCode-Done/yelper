import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

const ProfileContext = createContext(null);

const DEFAULT_AVATAR =
  'https://api.dicebear.com/7.x/avataaars/svg?seed=boardgamer&backgroundColor=2E7D32';

const STORAGE_KEY = '@gametap_profile';

async function saveLocal(uid, data) {
  try {
    await AsyncStorage.setItem(`${STORAGE_KEY}_${uid}`, JSON.stringify(data));
  } catch {}
}

async function loadLocal(uid) {
  try {
    const raw = await AsyncStorage.getItem(`${STORAGE_KEY}_${uid}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const ProfileProvider = ({ children }) => {
  const { user } = useAuth();
  const [avatar, setAvatarLocal] = useState(DEFAULT_AVATAR);
  const [username, setUsernameLocal] = useState('');
  const [title, setTitleLocal] = useState('Board Game Enthusiast');
  const [bio, setBioLocal] = useState('');
  const [loading, setLoading] = useState(true);

  const applyProfile = useCallback((data) => {
    setUsernameLocal(data.username ?? data.name ?? '');
    setAvatarLocal(data.avatar ?? DEFAULT_AVATAR);
    setTitleLocal(data.title ?? 'Board Game Enthusiast');
    setBioLocal(data.bio ?? '');
  }, []);

  useEffect(() => {
    if (!user) {
      setAvatarLocal(DEFAULT_AVATAR);
      setUsernameLocal('');
      setTitleLocal('Board Game Enthusiast');
      setBioLocal('');
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    (async () => {
      const local = await loadLocal(user.uid);
      if (cancelled) return;
      if (local) applyProfile(local);

      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (cancelled) return;
        if (snap.exists()) {
          const data = snap.data();
          applyProfile(data);
          saveLocal(user.uid, data);
        } else if (!local) {
          const fallback = {
            uid: user.uid,
            username: user.email?.split('@')[0] ?? '',
            email: user.email ?? '',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}&backgroundColor=2E7D32`,
            title: 'Board Game Enthusiast',
            bio: '',
          };
          applyProfile(fallback);
          saveLocal(user.uid, fallback);
          setDoc(doc(db, 'users', user.uid), {
            ...fallback,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }).catch(() => {});
        }
      } catch {
        // Firestore read failed — local data already applied above
      }
      if (!cancelled) setLoading(false);
    })();

    return () => { cancelled = true; };
  }, [user, applyProfile]);

  const updateProfile = useCallback(
    async (fields) => {
      if (!user) throw new Error('Not signed in');

      const updated = {
        uid: user.uid,
        email: user.email ?? '',
        username: fields.username ?? username,
        avatar: fields.avatar ?? avatar,
        title: fields.title ?? title,
        bio: fields.bio ?? bio,
      };

      if (fields.username !== undefined) setUsernameLocal(fields.username);
      if (fields.avatar !== undefined) setAvatarLocal(fields.avatar);
      if (fields.title !== undefined) setTitleLocal(fields.title);
      if (fields.bio !== undefined) setBioLocal(fields.bio);

      await saveLocal(user.uid, updated);

      setDoc(doc(db, 'users', user.uid), { ...updated, updatedAt: serverTimestamp() }, { merge: true })
        .catch(() => {});
    },
    [user, username, avatar, title, bio],
  );

  const setUsername = useCallback((v) => updateProfile({ username: v }), [updateProfile]);
  const setAvatar = useCallback((v) => updateProfile({ avatar: v }), [updateProfile]);

  return (
    <ProfileContext.Provider
      value={{
        avatar,
        username,
        title,
        bio,
        loading,
        setAvatar,
        setUsername,
        updateProfile,
        uid: user?.uid ?? null,
        email: user?.email ?? null,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
};
