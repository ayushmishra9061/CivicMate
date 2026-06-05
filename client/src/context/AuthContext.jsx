import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('civicmate_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('civicmate_access_token')) return;
    api.get('/auth/me').then(({ data }) => setUser(data.user)).catch(() => logout());
  }, []);

  const persistSession = (data) => {
    localStorage.setItem('civicmate_access_token', data.accessToken);
    localStorage.setItem('civicmate_refresh_token', data.refreshToken);
    localStorage.setItem('civicmate_user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const login = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', payload);
      persistSession(data);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', payload);
      persistSession(data);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (localStorage.getItem('civicmate_access_token')) await api.post('/auth/logout');
    } catch {
      // Local logout still clears stale sessions.
    }
    localStorage.removeItem('civicmate_access_token');
    localStorage.removeItem('civicmate_refresh_token');
    localStorage.removeItem('civicmate_user');
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
