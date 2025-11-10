import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { adsService } from '../services/ads';
import { categoriesService } from '../services/categories';
import AdForm from '../components/forms/AdForm';
import ErrorAlert from '../components/ui/ErrorAlert';

const EditAd = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ad, setAd] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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

    loadAd();
    loadCategories();
  }, [id]);

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
          
          <ErrorAlert error={error} onClose={() => setError('')} id="edit-ad-error" />
          
          <AdForm
            categories={categories}
            onSubmit={handleSubmit}
            loading={loading}
            initialData={ad}
            adId={parseInt(id)}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default EditAd;