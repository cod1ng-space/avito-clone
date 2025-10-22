import React from 'react';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>Омега</Navbar.Brand>
        </LinkContainer>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>Главная</Nav.Link>
            </LinkContainer>
          </Nav>
          
          {currentUser && (
            <Nav className="me-3">
              <LinkContainer to="/create-ad">
                <Button variant="success" size="sm" className="me-2">
                  Создать объявление
                </Button>
              </LinkContainer>
            </Nav>
          )}
          
          <Nav>
            {currentUser ? (
              <NavDropdown title={currentUser.username} id="user-dropdown">
                <LinkContainer to="/profile">
                  <NavDropdown.Item>Профиль</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/my-ads">
                  <NavDropdown.Item>Мои объявления</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/create-ad">
                  <NavDropdown.Item>Создать объявление</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Выход
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <LinkContainer to="/login">
                  <Nav.Link>Вход</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Nav.Link>Регистрация</Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;