import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/auth';
import ErrorAlert from '../ui/ErrorAlert';

const ProfileForm = ({ onSuccess }) => {
  const { currentUser, updateUserEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [socialNetwork, setSocialNetwork] = useState('');
  const [socialContact, setSocialContact] = useState('');
  const [error, setError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setEmail(currentUser.email || '');
      setUsername(currentUser.username || '');
      setPhone(currentUser.phone || '');
      setSocialNetwork(currentUser.social_network || '');
      setSocialContact(currentUser.social_contact || '');
    }
  }, [currentUser]);

  // Валидация номера телефона
  const validatePhone = (phoneNumber) => {
    const phoneRegex = /^(\+7|8)?[\s-]?\(?[0-9]{3}\)?[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/;
    return phoneRegex.test(phoneNumber);
  };

  // Валидация email
  const validateEmail = (emailValue) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    
    if (emailValue && !validateEmail(emailValue)) {
      setEmailError('Неверный формат email');
    } else {
      setEmailError('');
    }
  };

  const handlePhoneChange = (e) => {
    const phoneValue = e.target.value;
    setPhone(phoneValue);
    
    if (phoneValue && !validatePhone(phoneValue)) {
      setPhoneError('Неверный формат номера телефона (пример: +7 (900) 123-45-67)');
    } else {
      setPhoneError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email && !validateEmail(email)) {
      setError('Введите корректный email');
      return;
    }

    if (phone && !validatePhone(phone)) {
      setError('Введите корректный номер телефона');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      await authService.updateProfile({
        email,
        username,
        phone,
        social_network: socialNetwork,
        social_contact: socialContact
      });
      
      // Обновляем email в контексте, если он изменился
      if (email !== currentUser.email) {
        updateUserEmail(email);
      }
      
      if (onSuccess) onSuccess();
    } catch (error) {
      setError(error.response?.data?.message || 'Ошибка обновления профиля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <ErrorAlert error={error} onClose={() => setError('')} id="profile-form-error" />
      
      <Form.Group className="mb-3" controlId="email">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="example@mail.com"
          required
          isInvalid={!!emailError}
        />
        <Form.Control.Feedback type="invalid">
          {emailError}
        </Form.Control.Feedback>
      </Form.Group>
      
      <Form.Group className="mb-3" controlId="username">
        <Form.Label>Имя пользователя</Form.Label>
        <Form.Control
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </Form.Group>
      
      <Form.Group className="mb-3" controlId="phone">
        <Form.Label>Телефон</Form.Label>
        <Form.Control
          type="tel"
          value={phone}
          onChange={handlePhoneChange}
          placeholder="+7 (900) 123-45-67"
          required
          isInvalid={!!phoneError}
        />
        <Form.Control.Feedback type="invalid">
          {phoneError}
        </Form.Control.Feedback>
        <Form.Text className="text-muted">
          Формат: +7 (900) 123-45-67 или 8 900 123 45 67
        </Form.Text>
      </Form.Group>
      
      <Form.Group className="mb-3" controlId="socialNetwork">
        <Form.Label>Социальная сеть</Form.Label>
        <Form.Select
          value={socialNetwork}
          onChange={(e) => setSocialNetwork(e.target.value)}
        >
          <option value="">Выберите социальную сеть</option>
          <option value="Telegram">Telegram</option>
          <option value="WhatsApp">WhatsApp</option>
          <option value="VK">ВКонтакте</option>
          <option value="Other">Другое</option>
        </Form.Select>
      </Form.Group>
      
      <Form.Group className="mb-3" controlId="socialContact">
        <Form.Label>Контакт в соц. сети</Form.Label>
        <Form.Control
          type="text"
          value={socialContact}
          onChange={(e) => setSocialContact(e.target.value)}
          placeholder="Имя пользователя"
        />
      </Form.Group>
      
      <Button disabled={loading || !!phoneError || !!emailError} type="submit">
        Обновить профиль
      </Button>
    </Form>
  );
};

export default ProfileForm;