import React, { useContext } from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ChatIcon from '@mui/icons-material/Chat';
import './Sidebar.css'; // Import the custom CSS for styling
import { MyUserContext } from '../../configs/Contexts';

const SidebarComponent = () => {
  const user = useContext(MyUserContext); // Make sure you have context provider in your app

  return (
    <div className="sidebar d-flex flex-column bg-dark text-primary">
      <div className="user-info p-3 text-center">
        {!user ? (
          <Nav.Link as={Link} to="/profile" className="d-flex flex-column align-items-center">
            <div>NGƯỜI DÙNG CHƯA ĐĂNG NHẬP</div>
          </Nav.Link>
        ) : (
          <Nav.Link as={Link} to="/profile" className="d-flex flex-column align-items-center">
            <img src={user.avatar_url} alt="Avatar" className="img-avatar rounded-circle" />
            <div className="mt-2">{user.first_name} {user.last_name}</div>
          </Nav.Link>
        )}
      </div>

      <Nav className="flex-column p-3">
        <Nav.Link as={Link} to="/" className="text-light">
          <HomeIcon className="me-2" /> Trang chủ
        </Nav.Link>
        <Nav.Link as={Link} to="/bill" className="text-light">
          <ReceiptIcon className="me-2" /> Billing
        </Nav.Link>
        <Nav.Link as={Link} to="/product" className="text-light">
          <ShoppingCartIcon className="me-2" /> Shop
        </Nav.Link>
        <Nav.Link as={Link} to="/chat" className="text-light">
          <ChatIcon className="me-2" /> Chat
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default SidebarComponent;
