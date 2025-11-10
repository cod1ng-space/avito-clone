import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const CategorySelector = ({ 
  categories, 
  selectedCategory, 
  selectedSubcategory,
  onCategoryChange,
  onSubcategoryChange 
}) => {
  const selectedCategoryData = categories.find(cat => cat.id === parseInt(selectedCategory));

  return (
    <Row>
      <Col md={6}>
        <Form.Group className="mb-0">
          <Form.Label>Категория</Form.Label>
          <Form.Select
            value={selectedCategory}
            onChange={(e) => {
              onCategoryChange(e.target.value);
              onSubcategoryChange(''); // Сбрасываем подкатегорию при смене категории
            }}
          >
            <option value="">Все категории</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group className="mb-0">
          <Form.Label>Подкатегория</Form.Label>
          <Form.Select
            value={selectedSubcategory}
            onChange={(e) => onSubcategoryChange(e.target.value)}
            disabled={!selectedCategory}
          >
            <option value="">
              {selectedCategory ? 'Все подкатегории' : 'Выберите категорию'}
            </option>
            {selectedCategoryData?.subcategories?.map(subcategory => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Col>
    </Row>
  );
};

export default CategorySelector;