import React, { useState } from 'react';
import { Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { adsService } from '../../services/ads';
import { getImageUrl } from '../../utils/imageUrl';
import ErrorAlert from './ErrorAlert';

const ImageManager = ({ adId, images, onImagesUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState({});
  const [error, setError] = useState('');

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    if (images.length + files.length > 7) {
      setError('Можно загрузить максимум 7 изображений');
      return;
    }

    try {
      setUploading(true);
      setError('');
      
      await adsService.addImages(adId, files);
      
      // Перезагружаем объявление чтобы получить обновленный список изображений
      const updatedAd = await adsService.getById(adId);
      onImagesUpdate(updatedAd.images);
      
      // Очищаем инпут
      e.target.value = '';
      
    } catch (error) {
      setError(error.response?.data?.message || 'Ошибка загрузки изображений');
    } finally {
      setUploading(false);
    }
  };

  const handleImageDelete = async (imageId) => {
    try {
      setDeleting(prev => ({...prev, [imageId]: true}));
      
      await adsService.deleteImage(imageId);
      
      // Обновляем локальный список изображений
      const updatedImages = images.filter(img => img.id !== imageId);
      onImagesUpdate(updatedImages);
      
    } catch (error) {
      setError(error.response?.data?.message || 'Ошибка удаления изображения');
    } finally {
      setDeleting(prev => ({...prev, [imageId]: false}));
    }
  };

  return (
    <div className="mb-4">
      <h5>Изображения</h5>
      
      <ErrorAlert error={error} onClose={() => setError('')} id="image-manager-error" />
      
      {/* Существующие изображения */}
      {images.length > 0 && (
        <Row className="mb-3">
          {images.map((image) => (
            <Col key={image.id} md={3} sm={4} xs={6} className="mb-3">
              <Card>
                <Card.Img 
                  variant="top" 
                  src={getImageUrl(image.file_path)} 
                  style={{ height: '150px', objectFit: 'cover' }}
                />
                <Card.Body className="p-2">
                  <Button
                    variant="danger"
                    size="sm"
                    disabled={deleting[image.id]}
                    onClick={() => handleImageDelete(image.id)}
                    className="w-100"
                  >
                    {deleting[image.id] ? 'Удаление...' : 'Удалить'}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      
      {/* Загрузка новых изображений */}
      {images.length < 7 && (
        <Form.Group>
          <Form.Label>Добавить изображения</Form.Label>
          <Form.Control
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
          />
          <Form.Text className="text-muted">
            Можно загрузить ещё {7 - images.length} изображений. 
            Форматы: jpeg, jpg, png, webp. Размер файла до 10 МБ.
          </Form.Text>
          {uploading && (
            <div className="mt-2">
              <small className="text-primary">Загружаем изображения...</small>
            </div>
          )}
        </Form.Group>
      )}
      
      {images.length === 0 && (
        <Alert variant="info">
          У этого объявления пока нет изображений. Добавьте их, чтобы сделать объявление более привлекательным.
        </Alert>
      )}
    </div>
  );
};

export default ImageManager;