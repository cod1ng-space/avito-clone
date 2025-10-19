import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { adsService } from '../services/ads';
import { categoriesService } from '../services/categories';
import AdCard from '../components/ui/AdCard';
import Pagination from '../components/common/Pagination';

const CategoryAds = () => {
  const { id } = useParams();
  const [ads, setAds] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadCategory();
    loadAds();
  }, [id, currentPage]);

  const loadCategory = async () => {
    try {
      const categories = await categoriesService.getAll();
      const foundCategory = categories.find(cat => cat.id === parseInt(id));
      setCategory(foundCategory);
    } catch (error) {
      console.error('Failed to load category:', error);
    }
  };

  const loadAds = async () => {
    try {
      setLoading(true);
      const data = await adsService.search('', id, currentPage);
      setAds(data.ads);
      setTotalPages(Math.ceil(data.total / data.limit));
    } catch (error) {
      console.error('Error loading ads:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Container className="text-center">Загрузка...</Container>;

  return (
    <Container>
      <h1 className="mb-4">Объявления в категории {category?.name || 'Категория'}</h1>

      {ads.length === 0 ? (
        <div className="text-center">
          <h4>В этой категории нет объявлений</h4>
        </div>
      ) : (
        <>
          <Row>
            {ads.map(ad => (
              <Col key={ad.id} md={6} lg={4} className="mb-4">
                <AdCard ad={ad} />
              </Col>
            ))}
          </Row>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </Container>
  );
};

export default CategoryAds;