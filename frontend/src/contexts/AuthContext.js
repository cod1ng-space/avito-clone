import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/auth';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authService.verifyToken(token)
        .then(user => {
          setCurrentUser(user);
        })
        .catch(() => {
          // Удаляем недействительный токен
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const { token } = await authService.login(email, password);
      localStorage.setItem('token', token);
      
      // Получаем данные пользователя после успешного логина
      try {
        const user = await authService.verifyToken(token);
        setCurrentUser(user);
      } catch (verifyError) {
        console.error('Ошибка проверки токена после входа:', verifyError);
        localStorage.removeItem('token');
        throw verifyError;
      }
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Ошибка входа в систему' 
      };
    }
  };

  const register = async (email, password, username, phone) => {
    try {
      await authService.register(email, password, username, phone);
      // После успешной регистрации автоматически выполняем вход
      return await login(email, password);
    } catch (error) {
      const message = error.response?.data?.message || 
                    error.response?.data?.error ||
                    error.message ||
                    'Ошибка регистрации';
      return { 
        success: false, 
        message 
      };
    }
  };


  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const updateUserEmail = (newEmail) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, email: newEmail });
    }
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    updateUserEmail,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};