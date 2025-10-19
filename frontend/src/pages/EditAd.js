import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { adsService } from '../services/ads';
import { categoriesService } from '../services/categories';
import AdForm from '../components/forms/AdForm';

const EditAd = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ad, setAd] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAd();
    loadCategories();
  }, [id]);

  const loadAd = async () => {
    try {
      const data = await adsService.getById(id);
      setAd(data);
    } catch (error) {
      setError('Ошибка загрузки объявления');
      console.error('Ошибка загрузки объявления:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await categoriesService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error);
    }
  };

  const handleSubmit = async (adData) => {
    try {
      setLoading(true);
      setError('');
      
      await adsService.update(id, adData);
      navigate(`/ads/${id}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Ошибка обновления объявления');
    } finally {
      setLoading(false);
    }
  };

  if (!ad) return <Container className="text-center">Загрузка...</Container>;

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="mb-4">Редактировать объявление</h1>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          <AdForm
            categories={categories}
            onSubmit={handleSubmit}
            loading={loading}
            initialData={ad}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default EditAd;