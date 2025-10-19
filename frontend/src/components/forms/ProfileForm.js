import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/auth';

const ProfileForm = ({ onSuccess }) => {
  const { currentUser } = useAuth();
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [socialNetwork, setSocialNetwork] = useState('');
  const [socialContact, setSocialContact] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username || '');
      setPhone(currentUser.phone || '');
      setSocialNetwork(currentUser.social_network || '');
      setSocialContact(currentUser.social_contact || '');
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      
      await authService.updateProfile({
        username,
        phone,
        social_network: socialNetwork,
        social_contact: socialContact
      });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      setError(error.response?.data?.message || 'Ошибка обновления профиля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      
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
          onChange={(e) => setPhone(e.target.value)}
          required
        />
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
          <option value="Viber">Viber</option>
          <option value="Instagram">Instagram</option>
          <option value="Facebook">Facebook</option>
          <option value="VK">ВКонтакте</option>
        </Form.Select>
      </Form.Group>
      
      <Form.Group className="mb-3" controlId="socialContact">
        <Form.Label>Контакт в соц. сети</Form.Label>
        <Form.Control
          type="text"
          value={socialContact}
          onChange={(e) => setSocialContact(e.target.value)}
          placeholder="Имя пользователя или номер телефона"
        />
      </Form.Group>
      
      <Button disabled={loading} type="submit">
        Обновить профиль
      </Button>
    </Form>
  );
};

export default ProfileForm;