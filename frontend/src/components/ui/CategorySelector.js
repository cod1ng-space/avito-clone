import React from 'react';
import { Form } from 'react-bootstrap';

const CategorySelector = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <Form.Group>
      <Form.Label>Фильтр по категории</Form.Label>
      <Form.Select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="">Все категории</option>
        {categories.map(category => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

export default CategorySelector;