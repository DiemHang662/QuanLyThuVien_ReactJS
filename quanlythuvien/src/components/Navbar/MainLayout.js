import React, { useContext, useEffect, useState } from 'react';
import { Navbar, Container, Nav, Button, Form, FormControl, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SpeedIcon from '@mui/icons-material/Speed';
import PersonIcon from '@mui/icons-material/Person';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import TelegramIcon from '@mui/icons-material/Telegram';
import { MyUserContext, MyDispatchContext } from '../../configs/Contexts';
import { useNavigate } from 'react-router-dom';
import { authApi, endpoints } from '../../configs/API';
import './MainLayout.css';

const MainLayout = ({ children, searchTerm, setSearchTerm, onSearch }) => {
  const api = authApi();
  const navigate = useNavigate();
  const user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext);
  const [categories, setCategories] = useState([]);
  const [showCategories, setShowCategories] = useState(false);

  const toggleCategories = () => setShowCategories(prev => !prev);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get(endpoints.danhmuc);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value); // Call the search function passed from Home
  };

  const handleLogout = () => {
    dispatch({ type: 'logout' });
    navigate('/login');
  };

  return (
    <div>

      <div className="content">
        <Navbar className="navbar-custom bg-white shadow-sm" expand="lg">
          <Container fluid>
            <Navbar.Brand as={Link} to="/" className="brand text-brand me-4">
            <img
                    src="/images/logo.PNG" // Đường dẫn tới logo
                    alt="Logo"
                    width="70"
                    height="40" // Kích thước logo
                    
                /> VNLIBRARY
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <Nav className="me-auto">
                {user && user.is_superuser && (
                  <>
                    <Nav.Link as={Link} to="/tongquan"><SpeedIcon /> Tổng quan</Nav.Link>
                    <Nav.Link as={Link} to="/"><HomeIcon /> Trang chủ</Nav.Link>
                    <Nav.Link as={Link} to="/tintuc"><NewspaperIcon /> Tin tức</Nav.Link>
                    <Nav.Link as={Link} to="/lienhe"><TelegramIcon /> Liên hệ</Nav.Link>
                  </>
                )}
                {user && !user.is_superuser && (
                  <>
                    <Nav.Link as={Link} to="/"><HomeIcon /> Trang chủ</Nav.Link>
                    <Nav.Link as={Link} to="/tintuc"><NewspaperIcon /> Tin tức</Nav.Link>
                    <Nav.Link as={Link} to="/lienhe"><TelegramIcon /> Liên hệ</Nav.Link>
                  </>
                )}
              </Nav>

              {!user ? (
                <Button as={Link} to="/login" className="btn-login ms-3" variant="outline-dark">
                  <AccountCircleIcon />
                </Button>
              ) : (
                <>    
                 <Nav.Link>Chào, {user.first_name} {user.last_name}</Nav.Link>      
                  <Dropdown align="end" className="ms-3">
                    <Dropdown.Toggle variant="light" className="d-flex align-items-center">
                      <img src={user.avatar_url} alt="Avatar" className="img-avatar rounded-circle" />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item as={Link} to="/profile">Xem thông tin</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={handleLogout}>Đăng xuất</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              )}
            </Navbar.Collapse>
          </Container>
        </Navbar>

          {children}

      </div>
    </div>
  );
};

export default MainLayout;
