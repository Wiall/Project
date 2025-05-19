import { createContext, useState, useEffect } from 'react';
import { api } from '../api';
import { API_URL } from '../constants';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.post('/api/auth/refresh')
      .then(res => {
        return api.get('/api/user/me');
      })
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    const me = await api.get('/api/user/me');
    setUser(me.data);
    return res
  };

  const loginGoogle = async () => {
    window.location.href = `${API_URL}/api/auth/google` 
  }

  const loginGithub = async () => {
    window.location.href = `${API_URL}/api/auth/github` 
  }

  const logout = async () => {
    await api.post('/api/auth/logout');
    setUser(null);
  };

  const editProfile = async (data) => {
    const res = await api.patch('/api/user/profile', data);
    setUser(res.data);
  }


  return (
    <AuthContext.Provider value={{ user, loading, login, logout, editProfile, loginGoogle, loginGithub }}>
      {children}
    </AuthContext.Provider>
  );
}
