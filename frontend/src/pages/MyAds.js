import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { adsService } from '../services/ads';
import AdCard from '../components/ui/AdCard';
import Pagination from '../components/common/Pagination';

const MyAds = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadAds = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adsService.getUserAds(currentPage);
      setAds(data.ads);
      setTotalPages(Math.ceil(data.total / data.limit));
    } catch (error) {
      setError('Ошибка загрузки ваших объявлений');
      console.error('Ошибка загрузки объявлений:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    loadAds();
  }, [loadAds]);

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить это объявление?')) {
      try {
        await adsService.delete(id);
        loadAds(); // Перезагружаем объявления после удаления
      } catch (error) {
        setError('Ошибка удаления объявления');
        console.error('Ошибка удаления объявления:', error);
      }
    }
  };

  if (loading) return <Container className="text-center">Загрузка...</Container>;

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Мои объявления</h1>
        <Link to="/create-ad">
          <Button variant="primary">Создать новое объявление</Button>
        </Link>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {ads.length === 0 ? (
        <div className="text-center">
          <h4>У вас пока нет объявлений</h4>
          <Link to="/create-ad">
            <Button variant="primary" className="mt-3">Создать первое объявление</Button>
          </Link>
        </div>
      ) : (
        <>
          <Row>
            {ads.map(ad => (
              <Col key={ad.id} md={6} lg={4} className="mb-4">
                <AdCard ad={ad} showActions onDelete={() => handleDelete(ad.id)} />
              </Col>
            ))}
          </Row>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </Container>
  );
};

export default MyAds;