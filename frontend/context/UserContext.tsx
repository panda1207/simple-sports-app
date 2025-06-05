import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUser } from '../utils/api';
import { User } from '../types/types';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    getUser().then(setUser);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);