import React, { useState } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import ProfileForm from '../components/forms/ProfileForm';

const Profile = () => {
  const [message, setMessage] = useState('');

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="mb-4">Профиль</h1>
          
          {message && <Alert variant="success">{message}</Alert>}
          
          <ProfileForm onSuccess={() => setMessage('Профиль успешно обновлен!')} />
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;