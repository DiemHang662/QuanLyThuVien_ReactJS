import React, { useContext } from 'react';
import { Navbar, Container, Nav, Button, Form, FormControl } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import './Navbar.css';
import { MyUserContext } from '../../configs/Contexts';

const NavbarComponent = ({ searchTerm, setSearchTerm }) => {
  const user = useContext(MyUserContext);

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Navbar className="navbar-custom bg-white shadow-sm" expand="lg">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="text-dark">
          Acme Inc
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0">
            <Nav.Link as={Link} to="/" className="text-dark">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/about" className="text-dark">
              About
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" className="text-dark">
              Contact
            </Nav.Link>
          </Nav>
          <Form className="d-flex">
            <FormControl
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              value={searchTerm}
              onChange={handleChange}
            />
            <Button variant="outline-dark" onClick={handleSearch}>
              <SearchIcon />
            </Button>
          </Form>
          {!user ? (
            <Button as={Link} to="/login" className="btn-login ms-3" variant="outline-light">
              <AccountCircleIcon />
            </Button>
          ) : (
            <Nav.Link as={Link} to="/profile" className="d-flex align-items-center ms-3">
              <img src={user.avatar_url} alt="Avatar" className="img-avatar rounded-circle" />
            </Nav.Link>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
