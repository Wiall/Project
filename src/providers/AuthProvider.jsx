import { createContext, useState, useEffect } from 'react';
import { api } from '../api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.post('/auth/refresh')
      .then(res => {
        return api.get('/user/me');
      })
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const me = await api.get('/user/me');
    setUser(me.data);
    return res
  };

  const loginGoogle = async () => {
    window.location.href = 'http://localhost:3000/api/auth/google'
  }

  const loginGithub = async () => {
    window.location.href = 'http://localhost:3000/api/auth/github'
  }

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
  };

  const editProfile = async (data) => {
    const res = await api.patch('/user/profile', data);
    setUser(res.data);
  }


  return (
    <AuthContext.Provider value={{ user, loading, login, logout, editProfile, loginGoogle, loginGithub }}>
      {children}
    </AuthContext.Provider>
  );
}
