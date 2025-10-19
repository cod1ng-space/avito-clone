import React, { useState } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password.length < 6) {
      return setError('Пароль должен содержать не менее 6 символов');
    }
    
    if (password !== confirmPassword) {
      return setError('Пароли не совпадают');
    }
    
    try {
      setError('');
      setLoading(true);
      const result = await register(email, password);
      
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
        {error && <Alert variant="danger">{error}</Alert>}
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
          
          <Button disabled={loading} className="w-100" type="submit">
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