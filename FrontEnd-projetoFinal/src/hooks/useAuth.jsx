import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error.message);
      throw new Error(error.response?.data?.error || 'Falha no login. Verifique suas credenciais.');
    }
  };

  const register = async (formData) => {
    try {
      const response = await api.post('/auth/register', formData);
      const { token, user: userData } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Registration failed:', error.response ? error.response.data : error.message);
      throw new Error(error.response?.data?.error || 'Falha no cadastro. Tente novamente.');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
