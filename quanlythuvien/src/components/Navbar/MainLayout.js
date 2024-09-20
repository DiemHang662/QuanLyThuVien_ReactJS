import React, { useContext, useEffect, useState } from 'react';
import { Navbar, Container, Nav, Button, Form, FormControl, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ChatIcon from '@mui/icons-material/Chat';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import BarChartIcon from '@mui/icons-material/BarChart';
import BookIcon from '@mui/icons-material/Book';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import { MyUserContext } from '../../configs/Contexts';
import { authApi, endpoints } from '../../configs/API';
import './MainLayout.css'; // Combined CSS for both Navbar and Sidebar

const MainLayout = ({ children, searchTerm, setSearchTerm }) => {
  const api = authApi();
  const user = useContext(MyUserContext);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate(); // For navigating to login or logout

  // Fetch categories for the sidebar
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

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div>
      <div className="sidebar d-flex flex-column bg-dark text-primary">
        <div className="user-info p-3 mt-5 text-center">
          {!user ? (
            <Nav.Link as={Link} to="/login" className="d-flex flex-column align-items-center">
              <div>NGƯỜI DÙNG CHƯA ĐĂNG NHẬP</div>
            </Nav.Link>
          ) : (
            <Nav.Link as={Link} to="/profile" className="d-flex flex-column align-items-center">
              <img src={user.avatar_url} alt="Avatar" className="img-avatar rounded-circle" />
              <div className="mt-1">{user.first_name} {user.last_name}</div>
            </Nav.Link>
          )}
        </div>

        {/* Categories in the sidebar */}
        <Nav className="flex-column p-2">
          <Nav.Link as={Link} to="/" className="text-light">
            <HomeIcon className="me-3" /> Trang chủ
          </Nav.Link>
          {categories.length > 0 ? (
            categories.map(category => (
              <Nav.Link as={Link} to={`/category/${category.id}`} key={category.id} className="text-light">
                <MenuBookIcon className="me-3" /> {category.tenDanhMuc}
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
              <AutoStoriesIcon /> VNLIBRARY
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <Nav className="me-auto my-5 my-lg-0">
                <Nav.Link as={Link} to="/" className="me-3">
                  <HomeIcon /> Trang chủ
                </Nav.Link>
                <Nav.Link as={Link} to="/about" className="me-3">
                  <BookIcon /> Mượn trả
                </Nav.Link>
                <Nav.Link as={Link} to="/chat" className="me-3">
                  <ChatIcon /> Chat
                </Nav.Link>
                {/* Dropdown for additional options */}
                <Dropdown>
                  <Dropdown.Toggle variant="light" id="dropdown-basic">
                    Khác
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/docgia">Độc giả</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/sach">Sách</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/dangki">Đăng ký</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/chart">Báo cáo thống kê</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
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
                <>
                 <Nav.Link as={Link} to="/profile" className="d-flex flex-column align-items-center ms-4">
                    <LibraryAddIcon />
                </Nav.Link>

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

        <div className="content-area">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
