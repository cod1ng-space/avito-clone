import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-light mt-5 py-3">
      <Container>
        <p className="text-center mb-0">Омега &copy; {new Date().getFullYear()}</p>
      </Container>
    </footer>
  );
};

export default Footer;