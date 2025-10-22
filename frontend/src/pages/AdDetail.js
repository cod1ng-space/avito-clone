import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { adsService } from '../services/ads';
import { useAuth } from '../contexts/AuthContext';
import ImageGallery from '../components/ui/ImageGallery';

const AdDetail = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPhone, setShowPhone] = useState(false);

  useEffect(() => {
    const loadAd = async () => {
      try {
        setLoading(true);
        const data = await adsService.getById(id);
        setAd(data);
      } catch (error) {
        setError('Ошибка загрузки объявления');
        console.error('Ошибка загрузки объявления:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAd();
  }, [id]);

  if (loading) return <Container className="text-center">Загрузка...</Container>;
  if (error) return <Container><Alert variant="danger">{error}</Alert></Container>;
  if (!ad) return <Container><Alert variant="warning">Объявление не найдено</Alert></Container>;

  return (
    <Container>
      <Row>
        <Col md={8}>
          <h1>{ad.title}</h1>
          <p className="text-muted">
            Категория: {ad.subcategory?.name} • 
            Размещено: {ad.user?.username} • 
            {new Date(ad.created_at).toLocaleDateString('ru-RU')}
          </p>
          
          {ad.images && ad.images.length > 0 && (
            <ImageGallery images={ad.images} />
          )}
          
          <Card className="mt-4">
            <Card.Body>
              <Card.Title>Описание</Card.Title>
              <Card.Text>{ad.description}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card>
            <Card.Header>Контактная информация</Card.Header>
            <Card.Body>
              <p><strong>Имя пользователя:</strong> {ad.user?.username}</p>
              
              {currentUser ? (
                <>
                  <p>
                    <strong>Телефон:</strong>{' '}
                    {showPhone ? (
                      ad.user?.phone
                    ) : (
                      <Button 
                        variant="link" 
                        className="p-0 text-decoration-none"
                        onClick={() => setShowPhone(true)}
                      >
                        Показать номер
                      </Button>
                    )}
                  </p>
                  
                  {ad.user?.social_network && ad.user?.social_contact && (
                    <p>
                      <strong>{ad.user.social_network}:</strong> {ad.user.social_contact}
                    </p>
                  )}
                </>
              ) : (
                <div className="text-center">
                  <Alert variant="info" className="mb-3">
                    Для просмотра контактной информации необходимо авторизоваться
                  </Alert>
                  <div className="d-grid gap-2">
                    <Button as={Link} to="/login" variant="primary">
                      Войти
                    </Button>
                    <Button as={Link} to="/register" variant="outline-primary">
                      Регистрация
                    </Button>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdDetail;