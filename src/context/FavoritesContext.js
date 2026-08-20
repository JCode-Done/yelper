import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoritesContext = createContext(null);

const STORAGE_KEY = '@gametap_favorites';

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const hydrated = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          try { setFavorites(JSON.parse(raw)); } catch {}
        }
      })
      .finally(() => { hydrated.current = true; });
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favorites)).catch(() => {});
  }, [favorites]);

  const addFavorite = useCallback((game) => {
    if (!game) return;
    const key = game.id ?? game.name;
    if (!key) return;
    setFavorites((prev) => {
      if (prev.some((f) => (f.id ?? f.name) === key)) return prev;
      return [...prev, { ...game }];
    });
  }, []);

  const removeFavorite = useCallback((gameId) => {
    setFavorites((prev) => prev.filter((f) => (f.id ?? f.name) !== gameId));
  }, []);

  const toggleFavorite = useCallback((game) => {
    const key = game.id ?? game.name;
    setFavorites((prev) => {
      const exists = prev.some((f) => (f.id ?? f.name) === key);
      if (exists) return prev.filter((f) => (f.id ?? f.name) !== key);
      return [...prev, { ...game }];
    });
  }, []);

  const isFavorite = useCallback(
    (gameId) => favorites.some((f) => (f.id ?? f.name) === gameId),
    [favorites]
  );

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
};
