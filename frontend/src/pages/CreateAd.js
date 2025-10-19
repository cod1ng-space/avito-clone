import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { adsService } from '../services/ads';
import { categoriesService } from '../services/categories';
import AdForm from '../components/forms/AdForm';

const CreateAd = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoriesService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error);
    }
  };

  const handleSubmit = async (adData, images) => {
    try {
      setLoading(true);
      setError('');
      
      // Сначала создаем объявление
      const newAd = await adsService.create(adData);
      
      // Затем загружаем изображения, если есть
      if (images && images.length > 0) {
        const formData = new FormData();
        images.forEach(image => {
          formData.append('images', image);
        });
        
        await adsService.addImages(newAd.id, formData);
      }
      
      navigate(`/ads/${newAd.id}`);
    } catch (error) {
      console.error('Ошибка создания объявления:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.message || 
                          'Ошибка создания объявления';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="mb-4">Создание нового объявления</h1>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          <AdForm
            categories={categories}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default CreateAd;