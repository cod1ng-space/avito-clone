import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import ErrorAlert from '../ui/ErrorAlert';

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  // Валидация номера телефона
  const validatePhone = (phoneNumber) => {
    const phoneRegex = /^(\+7|8)?[\s-]?\(?[0-9]{3}\)?[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/;
    return phoneRegex.test(phoneNumber);
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
    
    if (password.length < 6) {
      return setError('Пароль должен содержать не менее 6 символов');
    }
    
    if (password !== confirmPassword) {
      return setError('Пароли не совпадают');
    }

    if (!validatePhone(phone)) {
      return setError('Введите корректный номер телефона');
    }
    
    try {
      setError('');
      setLoading(true);
      const result = await register(email, password, username, phone);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Ошибка создания аккаунта');
    }
    
    setLoading(false);
  };

  return (
    <Card>
      <Card.Body>
        <h2 className="text-center mb-4">Регистрация</h2>
        <ErrorAlert error={error} onClose={() => setError('')} id="register-form-error" />
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Электронная почта</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Имя пользователя</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              maxLength={100}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="phone">
            <Form.Label>Номер телефона</Form.Label>
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
          
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Пароль (минимум 6 символов)</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>Подтвердите пароль</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </Form.Group>
          
          <Button disabled={loading || !!phoneError} className="w-100" type="submit">
            Зарегистрироваться
          </Button>
        </Form>
        
        <div className="w-100 text-center mt-3">
          <Link to="/login">Уже есть аккаунт? Войдите</Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default RegisterForm;