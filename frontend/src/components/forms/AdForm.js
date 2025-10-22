import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

const AdForm = ({ categories, onSubmit, loading, initialData }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      // Ensure we store subcategory id as a string so it matches option values
      setSubcategoryId(initialData.subcategory_id ? String(initialData.subcategory_id) : '');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title || !description || !subcategoryId) {
      return setError('Пожалуйста, заполните все обязательные поля');
    }

    if (title.length < 3) {
      return setError('Название должно содержать минимум 3 символа');
    }

    if (description.length < 5) {
      return setError('Описание должно содержать минимум 5 символов');
    }
    
    setError('');
    
    onSubmit({
      title,
      description,
      subcategory_id: parseInt(subcategoryId)
    }, images);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 7) {
      setError('Можно загрузить максимум 7 изображений');
      return;
    }
    
    setImages(files);
    setError('');
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      
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
      
      {!initialData && (
        <Form.Group className="mb-3" controlId="images">
          <Form.Label>Изображения (до 7 штук)</Form.Label>
          <Form.Control
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
          <Form.Text className="text-muted">
            Можно выбрать несколько изображений (максимум 7)
          </Form.Text>
        </Form.Group>
      )}
      
      <Button disabled={loading} type="submit">
        {initialData ? 'Обновить объявление' : 'Создать объявление'}
      </Button>
    </Form>
  );
};

export default AdForm;