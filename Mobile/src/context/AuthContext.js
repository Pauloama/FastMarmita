import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const data = await authService.getStoredData();
        if (data.token) setToken(data.token);
        if (data.user) setUser(data.user);
      } catch (e) {
        console.error('Erro ao carregar dados do storage', e);
      } finally {
        setLoading(false);
      }
    };

    loadStorageData();
  }, []);

  const login = async (email, senha) => {
    try {
      const data = await authService.login(email, senha);
      setToken(data.token);
      setUser(data);
      return data;
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      setToken(data.token);
      setUser(data);
      return data;
    } catch (error) {
      console.error('Registration failed', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setToken(null);
      setUser(null);
    } catch (e) {
      console.error('Erro ao fazer logout', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
