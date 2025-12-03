import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Row, Col, Card } from 'react-bootstrap';
import { adsService } from '../../services/ads';
import { getImageUrl } from '../../utils/imageUrl';
import ErrorAlert from '../ui/ErrorAlert';

const AdForm = ({ categories, onSubmit, loading, initialData, adId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [newImages, setNewImages] = useState([]); // Новые файлы для загрузки
  const [existingImages, setExistingImages] = useState([]); // Существующие изображения
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      // Ensure we store subcategory id as a string so it matches option values
      setSubcategoryId(initialData.subcategory_id ? String(initialData.subcategory_id) : '');
      setExistingImages(initialData.images || []);
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Проверка на отсутствие изменений
    if (initialData) {
      const hasChanges =
        title !== initialData.title ||
        description !== initialData.description ||
        subcategoryId !== String(initialData.subcategory_id) ||
        newImages.length > 0;

      if (!hasChanges) {
        return setError('Нет изменений для сохранения');
      }
    }

    if (!title || !description || !subcategoryId) {
      return setError('Пожалуйста, заполните все обязательные поля');
    }

    if (title.length < 3 || title.length > 100) {
      return setError('Название должно содержать от 3 до 100 символов');
    }

    if (description.length < 20 || description.length > 5000) {
      return setError('Описание должно содержать от 20 до 5000 символов');
    }
    
    setError('');

    // Если редактируем объявление и есть новые изображения, сначала загружаем их
    if (adId && newImages.length > 0) {
      const ok = await uploadNewImagesForEdit();
      // Если загрузка изображений не удалась — не продолжаем сохранение/редирект
      if (!ok) return;
    }

    onSubmit({
      title,
      description,
      subcategory_id: parseInt(subcategoryId)
    }, newImages);
  };

  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = existingImages.length + newImages.length + files.length;
    
    if (totalImages > 7) {
      setError('Можно загрузить максимум 7 изображений');
      return;
    }
    
    setNewImages(prev => [...prev, ...files]);
    setError('');
    e.target.value = ''; // Очищаем input для возможности повторного выбора
  };

  const handleRemoveNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeleteExistingImage = async (imageId) => {
    if (!adId) return; // Можно удалять только у существующих объявлений
    
    try {
      setDeleting(prev => ({...prev, [imageId]: true}));
      
      await adsService.deleteImage(imageId);
      
      // Обновляем локальный список изображений
      setExistingImages(prev => prev.filter(img => img.id !== imageId));
      
    } catch (error) {
      setError(error.response?.data?.message || 'Ошибка удаления изображения');
    } finally {
      setDeleting(prev => ({...prev, [imageId]: false}));
    }
  };

  const handleAddNewImages = async () => {
    if (!adId || newImages.length === 0) return true;

    try {
      setUploading(true);
      setError('');

      await adsService.addImages(adId, newImages);

      // Перезагружаем объявление чтобы получить обновленный список изображений
      const updatedAd = await adsService.getById(adId);
      setExistingImages(updatedAd.images || []);
      setNewImages([]); // Очищаем новые изображения

      return true;
    } catch (error) {
      setError(error.response?.data?.message || 'Ошибка загрузки изображений');
      return false;
    } finally {
      setUploading(false);
    }
  };

  // Функция для автоматической загрузки изображений при редактировании
  const uploadNewImagesForEdit = async () => {
    if (adId && newImages.length > 0) {
      return await handleAddNewImages();
    }

    return true;
  };

  const totalImages = existingImages.length + newImages.length;

  return (
    <Form onSubmit={handleSubmit}>
      <ErrorAlert error={error} onClose={() => setError('')} id="ad-form-error" />
      
      <Form.Group className="mb-3" controlId="title">
        <Form.Label>Название</Form.Label>
        <Form.Control
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </Form.Group>
      
      <Form.Group className="mb-3" controlId="description">
        <Form.Label>Описание</Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </Form.Group>
      
      <Form.Group className="mb-3" controlId="category">
        <Form.Label>Категория</Form.Label>
        <Form.Select
          value={subcategoryId}
          onChange={(e) => setSubcategoryId(e.target.value)}
          required
        >
          <option value="">Выберите категорию</option>
          {categories.map(category => (
            <optgroup key={category.id} label={category.name}>
              {category.subcategories?.map(subcategory => (
                <option key={subcategory.id} value={String(subcategory.id)}>
                  {subcategory.name}
                </option>
              ))}
            </optgroup>
          ))}
        </Form.Select>
      </Form.Group>

      {/* Блок управления изображениями */}
      <div className="mb-4">
        <h5>Изображения ({totalImages}/7)</h5>
        
        {/* Объединенный список всех изображений */}
        {(existingImages.length > 0 || newImages.length > 0) && (
          <Row className="mb-3">
            {/* Существующие изображения */}
            {existingImages.map((image) => (
              <Col key={`existing-${image.id}`} md={3} sm={4} xs={6} className="mb-3">
                <Card>
                  <div className="position-relative">
                    <Card.Img 
                      variant="top" 
                      src={getImageUrl(image.file_path)} 
                      style={{ height: '150px', objectFit: 'cover' }}
                    />
                    <div className="position-absolute top-0 start-0 bg-success text-white px-2 py-1" 
                         style={{fontSize: '0.75rem', borderRadius: '0 0 0.25rem 0'}}>
                      Сохранено
                    </div>
                  </div>
                  {adId && (
                    <Card.Body className="p-2">
                      <Button
                        variant="danger"
                        size="sm"
                        disabled={deleting[image.id]}
                        onClick={() => handleDeleteExistingImage(image.id)}
                        className="w-100"
                      >
                        {deleting[image.id] ? 'Удаление...' : 'Удалить'}
                      </Button>
                    </Card.Body>
                  )}
                </Card>
              </Col>
            ))}
            
            {/* Новые изображения для загрузки */}
            {newImages.map((file, index) => (
              <Col key={`new-${index}`} md={3} sm={4} xs={6} className="mb-3">
                <Card>
                  <div className="position-relative">
                    <Card.Img 
                      variant="top" 
                      src={URL.createObjectURL(file)}
                      style={{ height: '150px', objectFit: 'cover' }}
                    />
                    <div className="position-absolute top-0 start-0 bg-warning text-dark px-2 py-1" 
                         style={{fontSize: '0.75rem', borderRadius: '0 0 0.25rem 0'}}>
                      Новое
                    </div>
                  </div>
                  <Card.Body className="p-2">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemoveNewImage(index)}
                      className="w-100"
                    >
                      Убрать
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
        
        {/* Добавление новых изображений */}
        {totalImages < 7 && (
          <Form.Group controlId="new-images">
            <Form.Label>Добавить изображения</Form.Label>
            <Form.Control
              type="file"
              multiple
              accept="image/*"
              onChange={handleNewImageChange}
            />
            <Form.Text className="text-muted">
              Можно загрузить ещё {7 - totalImages} изображений. 
              Форматы: jpeg, jpg, png, webp. Размер файла до 10 МБ.
            </Form.Text>
          </Form.Group>
        )}
        
        {totalImages === 0 && !initialData && (
          <Alert variant="info">
            Добавьте изображения, чтобы сделать объявление более привлекательным.
          </Alert>
        )}
      </div>
      
      <Button 
        disabled={loading || uploading} 
        type="submit"
        variant="primary"
      >
        {loading || uploading ? 'Сохраняем...' : (initialData ? 'Обновить объявление' : 'Создать объявление')}
      </Button>
    </Form>
  );
};

export default AdForm;