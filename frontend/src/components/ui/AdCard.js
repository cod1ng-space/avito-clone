import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AdCard = ({ ad }) => {
  return (
    <Card className="h-100">
      {ad.images && ad.images.length > 0 && (
        <Card.Img 
          variant="top" 
          src={`/images/${ad.images[0].file_path}`}
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
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              {ad.subcategory?.name} • {ad.user?.username}
            </small>
            <Link to={`/ads/${ad.id}`}>
              <Button variant="primary" size="sm">Просмотр</Button>
            </Link>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default AdCard;