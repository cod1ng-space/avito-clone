import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { adsService } from '../services/ads';
import { categoriesService } from '../services/categories';
import AdForm from '../components/forms/AdForm';
import ErrorAlert from '../components/ui/ErrorAlert';

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
      
      let newAd;
      
      // Используем новый API если есть изображения, иначе старый
      if (images && images.length > 0) {
        newAd = await adsService.createWithImages(adData, images);
      } else {
        newAd = await adsService.create(adData);
      }
      
      navigate(`/ads/${newAd.id}`);
    } catch (error) {
      console.error('Ошибка создания объявления:', error);
      
      // Улучшенная обработка ошибок
      let errorMessage = 'Ошибка создания объявления';
      
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
          if (error.response.data.error) {
            errorMessage += `: ${error.response.data.error}`;
          }
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
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
          
          <ErrorAlert error={error} onClose={() => setError('')} id="create-ad-error" />
          
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