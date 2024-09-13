import React, { useContext, useEffect, useState } from 'react';
import { Carousel, Button } from 'react-bootstrap';
import Footer from '../../components/Footer/Footer';
import AddIcon from '@mui/icons-material/Add';
import "./Home.css";
import { authApi, endpoints } from '../../configs/API';
import MainLayout from '../Navbar/MainLayout';

const Home = () => {
  const images = [
    'https://vbs.edu.vn/wp-content/uploads/2023/05/Brown-and-Blue-Photo-Library-Birthday-Virtual-Background.png',
    'https://file.hstatic.net/200000090679/file/z5679281412660_7636cf5aa93594064a10a52aa07b23cf.jpg',
    'https://tiki.vn/blog/wp-content/uploads/2023/08/thumb-12.jpg',
  ];
  const api = authApi();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get(endpoints.sach); // Gọi API để lấy danh sách sách
        let booksData = response.data;

        // Ngẫu nhiên hóa danh sách sách
        booksData = booksData.sort(() => Math.random() - 0.5);

        setBooks(booksData); // Lưu danh sách sách vào state
      } catch (error) {
        console.error('Lỗi khi gọi API sách:', error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="container">
      <MainLayout />
      <div className="content-wrapper">
        <Carousel className="carousel">
          {images.map((image, index) => (
            <Carousel.Item key={index}>
              <img
                className="d-block img-carousel"
                src={image}
                alt={`slide-${index}`}
              />
            </Carousel.Item>
          ))}
        </Carousel>

        <h1>GIỚI THIỆU</h1>
        <div className="intro">

        </div>

        <div className="list">
          {books.length > 0 ? (
            books.map((book) => (
              <div key={book.id} className="book-item">
                <img src={book.anhSach_url} className="book-image" />
                <h3>{book.tenSach}</h3>
                <h3>Tác giả: {book.tenTacGia}</h3>
                <Button className="add">
                  <AddIcon /> Mượn sách
                </Button>
              </div>
            ))
          ) : (
            <p>Không có sách để hiển thị.</p>
          )}

        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Home;
