import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { adsService } from '../services/ads';
import { categoriesService } from '../services/categories';
import SearchBar from '../components/ui/SearchBar';
import CategorySelector from '../components/ui/CategorySelector';
import AdCard from '../components/ui/AdCard';
import Pagination from '../components/common/Pagination';

const Home = () => {
  const [ads, setAds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoriesService.getAll();
        setCategories(data);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };

    const loadAds = async () => {
        try {
            setLoading(true);
            const data = await adsService.search(
                searchQuery, 
                selectedCategory, 
                currentPage
            );
            
            setAds(data.ads);
            setTotalPages(Math.ceil(data.total / data.limit));
        } catch (error) {
            console.error('Ошибка загрузки объявлений:', error);
            setAds([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    loadCategories();
    loadAds();
  }, [currentPage, searchQuery, selectedCategory]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  return (
    <Container>
      <Row className="mb-4 align-items-end">
        <Col md={6}>
          <SearchBar onSearch={handleSearch} />
        </Col>
        <Col md={6}>
          <CategorySelector 
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </Col>
      </Row>

      {loading ? (
        <div className="text-center">Загрузка...</div>
      ) : (
        <>
          <Row>
            {ads.map(ad => (
              <Col key={ad.id} md={6} lg={4} className="mb-4">
                <AdCard ad={ad} />
              </Col>
            ))}
          </Row>

          {ads.length === 0 && (
            <div className="text-center">
              <h4>В этой категории не найдено объявлений</h4>
            </div>
          )}

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

export default Home;