import React from 'react';
import { Card, Button, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../utils/imageUrl';

const AdCard = ({ ad, showActions = false, onDelete }) => {
  return (
    <Card className="h-100">
      {ad.images && ad.images.length > 0 && (
        <Card.Img 
          variant="top" 
          src={getImageUrl(ad.images[0].file_path)}
          style={{ height: '200px', objectFit: 'cover' }}
        />
      )}
      
      <Card.Body className="d-flex flex-column">
        <Card.Title>{ad.title}</Card.Title>
        <Card.Text className="flex-grow-1">
          {ad.description.length > 100 
            ? `${ad.description.substring(0, 100)}...` 
            : ad.description
          }
        </Card.Text>
        
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <small className="text-muted">
              {ad.subcategory?.name} {ad.user?.username && `• ${ad.user.username}`}
            </small>
          </div>
          
          <div className="d-flex justify-content-between align-items-center">
            <Link to={`/ads/${ad.id}`}>
              <Button variant="outline-primary" size="sm">Просмотр</Button>
            </Link>
            
            {showActions && (
              <ButtonGroup size="sm">
                <Link to={`/edit-ad/${ad.id}`}>
                  <Button variant="warning">Редактировать</Button>
                </Link>
                <Button 
                  variant="danger" 
                  onClick={onDelete}
                >
                  Удалить
                </Button>
              </ButtonGroup>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default AdCard;