import React, { useContext } from 'react';
import { Navbar, Container, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChatIcon from '@mui/icons-material/Chat';
import './Navbar.css';
import { MyUserContext, MyDispatchContext } from '../../configs/Contexts';

const NavbarComponent = ({ searchTerm, setSearchTerm }) => {
  const user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext);

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLogout = () => {
    dispatch({ type: 'logout' });
  };

  return (
    <Navbar className="navbar-custom navbar-expand-lg bg-primary">
      <Container fluid>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/"><HomeIcon /> Trang chủ</Nav.Link>
            {user && user.is_superuser && (
                 <Nav.Link as ={Link} to ="/resident">Cư dân</Nav.Link>
              )}
            <Nav.Link as={Link} to="/bill"><ReceiptIcon /> Hóa đơn</Nav.Link>
            <Nav.Link as={Link} to="/product"><ShoppingCartIcon /> Mua hàng</Nav.Link>
            <Nav.Link as={Link} to="/chat"><ChatIcon /> Trò chuyện</Nav.Link> 
            <NavDropdown title="Khác" id="basic-nav-dropdown" align="end">
              <NavDropdown.Item as={Link} to="/survey">Khảo sát</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/payment">Thanh toán</NavDropdown.Item>
              {user && user.is_superuser && (
                <>
                  <NavDropdown.Item as={Link} to="/register">Cấp tài khoản</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/statistics">Thống kê báo cáo</NavDropdown.Item>
                </>
              )}
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/" onClick={handleLogout}>Đăng xuất</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Form className="searchInput" role="search">
            <FormControl
              type="search"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleChange}
              aria-label="Search"
            />
            <Button className="bt-search" variant="primary" onClick={handleSearch}>
              <SearchIcon />
            </Button>
          </Form>
          {!user ? (
            <Button as={Link} to="/login" className="btn-login" variant="primary"><AccountCircleIcon /></Button>
          ) : (
            <Nav.Link as={Link} to="/profile" className="user-info">
              <img src={user.avatar_url} alt="Avatar" className="img-avatar" />
            </Nav.Link>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;