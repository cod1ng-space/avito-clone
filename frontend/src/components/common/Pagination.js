import React from 'react';
import { Pagination as BSPagination } from 'react-bootstrap';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPaginationItems = () => {
    const items = [];
    const maxVisible = 5; // Максимум 5 страниц подряд
    
    // Вычисляем диапазон страниц для отображения
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    // Корректируем начальную страницу если достигли конца
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    // Отображаем страницы
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <BSPagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => onPageChange(i)}
        >
          {i}
        </BSPagination.Item>
      );
    }
    
    return items;
  };

  if (totalPages <= 1) return null;

  return (
    <BSPagination className="justify-content-center mt-4">
      <BSPagination.First
        disabled={currentPage === 1}
        onClick={() => onPageChange(1)}
      />
      <BSPagination.Prev
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      />
      {getPaginationItems()}
      <BSPagination.Next
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      />
      <BSPagination.Last
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(totalPages)}
      />
    </BSPagination>
  );
};

export default Pagination;