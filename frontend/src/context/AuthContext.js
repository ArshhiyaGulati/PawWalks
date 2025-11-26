import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { request } from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUser = await AsyncStorage.getItem('user');
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.warn('Auth bootstrap error', err);
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  const login = async (email, password) => {
    const data = await request('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    setUser(data.user);
    setToken(data.token);
    await AsyncStorage.multiSet([
      ['token', data.token],
      ['user', JSON.stringify(data.user)],
    ]);
  };

  const signup = async (payload) => {
    const data = await request('/auth/signup', {
      method: 'POST',
      body: payload,
    });
    setUser(data.user);
    setToken(data.token);
    await AsyncStorage.multiSet([
      ['token', data.token],
      ['user', JSON.stringify(data.user)],
    ]);
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.multiRemove(['token', 'user']);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

