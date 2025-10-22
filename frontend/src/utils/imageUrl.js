// Функция для получения полного URL изображения
export const getImageUrl = (filePath) => {
  if (!filePath) return null;
  
  // Получаем базовый URL API из переменной окружения или используем значение по умолчанию
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
  
  // Формируем полный URL для изображения
  return `${API_BASE_URL}/images/${filePath}`;
};