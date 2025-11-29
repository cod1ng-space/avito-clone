import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import ErrorAlert from '../ui/ErrorAlert';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  // Валидация email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    
    // Проверяем валидность email при вводе
    if (emailValue && !validateEmail(emailValue)) {
      setError('Неверный формат электронной почты');
    } else {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Проверка валидности email перед отправкой
    if (!validateEmail(email)) {
      return setError('Введите корректный адрес электронной почты');
    }
    
    try {
      setError('');
      setLoading(true);
      const result = await login(email, password);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Ошибка входа в систему');
    }
    
    setLoading(false);
  };

  return (
    <Card>
      <Card.Body>
        <h2 className="text-center mb-4">Вход в систему</h2>
        <ErrorAlert error={error} onClose={() => setError('')} id="login-form-error" />
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Электронная почта</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Пароль</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          
          <Button disabled={loading} className="w-100" type="submit">
            Войти
          </Button>
        </Form>
        
        <div className="w-100 text-center mt-3">
          <Link to="/register">Нужна учетная запись? Зарегистрируйтесь</Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default LoginForm;