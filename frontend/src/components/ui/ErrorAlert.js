import React, { useEffect, useRef } from 'react';
import { Alert } from 'react-bootstrap';

// Словарь для перевода ошибок
const ERROR_TRANSLATIONS = {
  'Invalid file type': 'Недопустимый тип файла. Разрешены только jpeg, jpg, png и webp',
  'File too large': 'Файл слишком большой',
  'No image files found': 'Файлы изображений не найдены',
  'Failed to create upload directory': 'Не удалось создать папку для загрузки',
  'Failed to open file': 'Не удалось открыть файл',
  'Failed to read file': 'Не удалось прочитать файл',
  'Failed to seek file': 'Ошибка обработки файла',
  'Failed to create file': 'Не удалось создать файл',
  'Failed to save file': 'Не удалось сохранить файл',
  'Unauthorized': 'Необходима авторизация',
  'Forbidden': 'Доступ запрещен',
  'Not Found': 'Ресурс не найден',
  'Internal Server Error': 'Внутренняя ошибка сервера',
};

const translateError = (message) => {
  if (!message || typeof message !== 'string') return message;
  
  // Проверяем точное совпадение
  if (ERROR_TRANSLATIONS[message]) {
    return ERROR_TRANSLATIONS[message];
  }
  
  // Проверяем частичные совпадения для более сложных сообщений
  for (const [key, translation] of Object.entries(ERROR_TRANSLATIONS)) {
    if (message.includes(key)) {
      return translation;
    }
  }
  
  return message;
};

const getErrorMessage = (error) => {
  if (typeof error === 'string') {
    return translateError(error);
  }
  
  if (error.response) {
    const errorData = error.response.data;
    
    // Сначала проверяем структурированные ошибки
    if (errorData) {
      if (typeof errorData === 'string') {
        return translateError(errorData);
      }
      
      if (errorData.message) {
        return translateError(errorData.message);
      }
      
      if (errorData.error) {
        return translateError(errorData.error);
      }
      
      // Обработка ошибок валидации
      if (errorData.validation_errors) {
        const validationMessages = Object.values(errorData.validation_errors)
          .map(translateError)
          .join(', ');
        return validationMessages;
      }
    }
    
    // Если нет структурированной ошибки, используем статус код
    switch (error.response.status) {
      case 400:
        return 'Неверный запрос';
      case 401:
        return 'Необходима авторизация';
      case 403:
        return 'Доступ запрещен';
      case 404:
        return 'Ресурс не найден';
      case 409:
        return 'Конфликт данных';
      case 413:
        return 'Файл слишком большой';
      case 415:
        return 'Неподдерживаемый тип файла';
      case 500:
        return 'Внутренняя ошибка сервера';
      default:
        return `Ошибка ${error.response.status}`;
    }
  }
  
  if (error.message) {
    return translateError(error.message);
  }
  
  return 'Произошла неизвестная ошибка';
};

const ErrorAlert = ({ error, onClose, id = 'error-alert' }) => {
  const alertRef = useRef(null);
  
  useEffect(() => {
    if (error && alertRef.current) {
      // Прокручиваем к ошибке при её появлении
      alertRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      
      // Обновляем URL с якорем для возможности прямой ссылки на ошибку
      if (window.location.hash !== `#${id}`) {
        window.history.replaceState(null, null, `#${id}`);
      }
    }
  }, [error, id]);
  
  if (!error) return null;

  const message = getErrorMessage(error);

  return (
    <Alert 
      ref={alertRef}
      id={id}
      variant="danger" 
      onClose={onClose} 
      dismissible={!!onClose}
      className="mb-3"
    >
      {message}
    </Alert>
  );
};

export default ErrorAlert;