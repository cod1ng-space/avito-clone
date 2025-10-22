import React, { useState } from 'react';
import { Modal, Carousel } from 'react-bootstrap';
import { getImageUrl } from '../../utils/imageUrl';

const ImageGallery = ({ images }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleShow = (index) => {
    setSelectedIndex(index);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  return (
    <>
      <div className="d-flex flex-wrap gap-2 mb-3">
        {images.map((image, index) => (
          <img
            key={image.id}
            src={getImageUrl(image.file_path)}
            alt={`${index + 1}`}
            style={{ 
              width: '100px', 
              height: '100px', 
              objectFit: 'cover', 
              cursor: 'pointer' 
            }}
            onClick={() => handleShow(index)}
            className="img-thumbnail"
          />
        ))}
      </div>

      <Modal show={showModal} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Изображения объявления</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Carousel activeIndex={selectedIndex} onSelect={setSelectedIndex}>
            {images.map((image, index) => (
              <Carousel.Item key={image.id}>
                <img
                  className="d-block w-100"
                  src={getImageUrl(image.file_path)}
                  alt={`${index + 1}`}
                  style={{ maxHeight: '70vh', objectFit: 'contain' }}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ImageGallery;