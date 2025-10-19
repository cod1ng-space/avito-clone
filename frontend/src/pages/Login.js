import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import LoginForm from '../components/forms/LoginForm';

const Login = () => {
  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={6} lg={4}>
          <LoginForm />
        </Col>
      </Row>
    </Container>
  );
};

export default Login;