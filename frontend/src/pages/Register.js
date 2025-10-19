import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import RegisterForm from '../components/forms/RegisterForm';

const Register = () => {
  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={6} lg={4}>
          <RegisterForm />
        </Col>
      </Row>
    </Container>
  );
};

export default Register;