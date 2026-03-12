import React, { createContext, useContext, useState } from 'react';

const ProfileContext = createContext(null);

const DEFAULT_AVATAR =
  'https://api.dicebear.com/7.x/avataaars/svg?seed=boardgamer&backgroundColor=2E7D32';

export const ProfileProvider = ({ children }) => {
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR);
  const [name, setName] = useState('Alex Rivera');

  return (
    <ProfileContext.Provider value={{ avatar, name, setAvatar, setName }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
};
