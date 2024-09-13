import React, { useContext } from 'react';
import { Navbar, Container, Nav, Button, Form, FormControl } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ClassIcon from '@mui/icons-material/Class';
import ChatIcon from '@mui/icons-material/Chat';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import BarChartIcon from '@mui/icons-material/BarChart';
import { MyUserContext } from '../../configs/Contexts';
import './MainLayout.css'; // Combined CSS for both Navbar and Sidebar

const MainLayout = ({ children, searchTerm, setSearchTerm }) => {
  const user = useContext(MyUserContext);

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      <div className="sidebar d-flex flex-column bg-dark text-primary">
        <div className="user-info p-5 text-center">
          {!user ? (
            <Nav.Link as={Link} to="/profile" className="d-flex flex-column align-items-center">
              <div>NGƯỜI DÙNG CHƯA ĐĂNG NHẬP</div>
            </Nav.Link>
          ) : (
            <Nav.Link as={Link} to="/profile" className="d-flex flex-column align-items-center">
              <img src={user.avatar_url} alt="Avatar" className="img-avatar rounded-circle" />
              <div className="mt-1">{user.first_name} {user.last_name}</div>
            </Nav.Link>
          )}
        </div>

        <Nav className="flex-column p-2">
          <Nav.Link as={Link} to="/" className="text-light">
            <HomeIcon className="me-3" /> Trang chủ
          </Nav.Link>
          <Nav.Link as={Link} to="/category" className="text-light">
            <ClassIcon className="me-3" /> Danh mục
          </Nav.Link>
          <Nav.Link as={Link} to="/chat" className="text-light">
            <ChatIcon className="me-3" /> Chat
          </Nav.Link>
          <Nav.Link as={Link} to="/chart" className="text-light">
            <BarChartIcon className="me-3" /> Báo cáo thống kê
          </Nav.Link>
        </Nav>
      </div>

      {/* Main content wrapper */}
      <div className="content-wrapper">
        {/* Top navbar */}
        <Navbar className="navbar-custom bg-white shadow-sm" expand="lg">
          <Container fluid>
            <Navbar.Brand as={Link} to="/" className="text-brand me-5">
              <AutoStoriesIcon /> LIBRARY
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <Nav className="me-auto my-5 my-lg-0">
                <Nav.Link as={Link} to="/" className="me-4">
                  Trang chủ
                </Nav.Link>
                <Nav.Link as={Link} to="/about" className="me-4">
                  Mượn trả
                </Nav.Link>
                <Nav.Link as={Link} to="/contact" className="me-4">
                  Liên hệ
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
                <Button variant="outline-dark" className="bt-search" onClick={handleSearch}>
                  <SearchIcon />
                </Button>
              </Form>
              {!user ? (
                <Button as={Link} to="/login" className="btn-login ms-3" variant="outline-dark">
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

        <div className="content-area">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
