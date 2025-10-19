import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Добавляем токен авторизации в каждый запрос
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Перехватчик ответов для обработки ошибок авторизации
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Не перенаправляем на страницу входа для статических файлов
    const url = error.config?.url || '';
    const isStaticFile = url.includes('favicon.ico') || 
                        url.includes('manifest.json') || 
                        url.includes('logo') ||
                        url.endsWith('.ico') ||
                        url.endsWith('.png') ||
                        url.endsWith('.jpg') ||
                        url.endsWith('.jpeg') ||
                        url.endsWith('.svg');
    
    if (error.response?.status === 401 && !isStaticFile) {
      localStorage.removeItem('token');
      // Перенаправляем на страницу входа только если не на странице авторизации или регистрации
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;