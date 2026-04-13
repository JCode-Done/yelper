import React, { createContext, useContext, useEffect, useState } from 'react';
import { getOrCreateVoterId } from '../utils/voterId';

const ProfileContext = createContext(null);

const DEFAULT_AVATAR =
  'https://api.dicebear.com/7.x/avataaars/svg?seed=boardgamer&backgroundColor=2E7D32';

export const ProfileProvider = ({ children }) => {
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR);
  const [name, setName] = useState('Alex Rivera');
  const [voterId, setVoterId] = useState(null);

  useEffect(() => {
    getOrCreateVoterId().then(setVoterId);
  }, []);

  return (
    <ProfileContext.Provider
      value={{ avatar, name, setAvatar, setName, voterId }}
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
