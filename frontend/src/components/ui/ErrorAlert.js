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
      return message;
    }
  }
  
  return message;
};

const getErrorDetails = (error) => {
  let title = 'Ошибка';
  let message = '';
  let statusCode = null;
  
  if (typeof error === 'string') {
    message = translateError(error);
  } else if (error.response) {
    statusCode = error.response.status;
    const errorData = error.response.data;
    
    // Определяем заголовок по статусу
    switch (statusCode) {
      case 400:
        title = 'Неверный запрос';
        break;
      case 401:
        title = 'Необходима авторизация';
        break;
      case 403:
        title = 'Доступ запрещен';
        break;
      case 404:
        title = 'Не найдено';
        break;
      case 409:
        title = 'Конфликт данных';
        break;
      case 413:
        title = 'Файл слишком большой';
        break;
      case 415:
        title = 'Неподдерживаемый тип файла';
        break;
      case 500:
        title = 'Ошибка сервера';
        break;
      default:
        title = `Ошибка ${statusCode}`;
    }
    
    if (typeof errorData === 'string') {
      message = translateError(errorData);
    } else if (errorData) {
      // Обрабатываем структурированные ошибки
      if (errorData.message) {
        message = translateError(errorData.message);
      } else if (errorData.error) {
        message = translateError(errorData.error);
      }
      
      // Специальная обработка для ошибок валидации
      if (errorData.validation_errors) {
        const validationMessages = Object.values(errorData.validation_errors)
          .map(translateError)
          .join(', ');
        message = validationMessages;
      }
    }
  } else if (error.message) {
    message = translateError(error.message);
  }
  
  return { title, message, statusCode };
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

  const { title, message } = getErrorDetails(error);

  return (
    <Alert 
      ref={alertRef}
      id={id}
      variant="danger" 
      onClose={onClose} 
      dismissible={!!onClose}
      className="mb-3"
    >
      <Alert.Heading>{title}</Alert.Heading>
      {message && <p className="mb-0">{message}</p>}
    </Alert>
  );
};

export default ErrorAlert;