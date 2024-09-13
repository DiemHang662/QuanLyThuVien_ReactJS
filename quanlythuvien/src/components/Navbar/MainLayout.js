import React, { useContext, useEffect, useState } from 'react';
import { Navbar, Container, Nav, Button, Form, FormControl } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import ClassIcon from '@mui/icons-material/Class';
import ChatIcon from '@mui/icons-material/Chat';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import BarChartIcon from '@mui/icons-material/BarChart';
import BookIcon from '@mui/icons-material/Book';
import { MyUserContext } from '../../configs/Contexts';
import { authApi, endpoints } from '../../configs/API';
import './MainLayout.css'; // Combined CSS for both Navbar and Sidebar

const MainLayout = ({ children, searchTerm, setSearchTerm }) => {
  const api = authApi();
  const user = useContext(MyUserContext);
  const [categories, setCategories] = useState([]);

  // Hàm gọi API lấy danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get(endpoints.danhmuc); // Gọi API
        setCategories(response.data); // Giả sử API trả về danh sách danh mục
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      }
    };

    fetchCategories(); // Gọi hàm
  }, []);

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      {/* Sidebar */}
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

        {/* Hiển thị danh sách danh mục */}
        <Nav className="flex-column p-2">
          <Nav.Link as={Link} to="/" className="text-light">
            <HomeIcon className="me-3" /> Trang chủ
          </Nav.Link>
          {categories.length > 0 ? (
            categories.map(category => (
              <Nav.Link as={Link} to={`/category/${category.id}`} key={category.id} className="text-light">
                <ClassIcon className="me-3" /> {category.tenDanhMuc}
              </Nav.Link>
            ))
          ) : (
            <p className="text-light">Không có danh mục nào.</p>
          )}

        </Nav>
      </div>

      {/* Main content */}
      <div className="content-wrapper">
        {/* Top Navbar */}
        <Navbar className="navbar-custom bg-white shadow-sm" expand="lg">
          <Container fluid>
            <Navbar.Brand as={Link} to="/" className="text-brand me-4">
              <AutoStoriesIcon /> LIBRARY
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <Nav className="me-auto my-5 my-lg-0">
                <Nav.Link as={Link} to="/" className="me-3">
                  <HomeIcon/> Trang chủ
                </Nav.Link>
                <Nav.Link as={Link} to="/about" className="me-3">
                 <BookIcon/> Mượn trả
                </Nav.Link>
                <Nav.Link as={Link} to="/chat" className="me-3">
                  <ChatIcon  /> Chat
                </Nav.Link>
                <Nav.Link as={Link} to="/chart" className="me-3">
                  <BarChartIcon /> Báo cáo thống kê
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
