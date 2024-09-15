import React, { useEffect, useState } from 'react';
import { Carousel, Button } from 'react-bootstrap';
import Footer from '../../components/Footer/Footer';
import AddIcon from '@mui/icons-material/Add';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import './Home.css';
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
  const [likedBooks, setLikedBooks] = useState(new Set()); // Use Set to track liked book IDs

  // Fetch books on component mount
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get(endpoints.sach);
        const booksData = response.data;
        setBooks(booksData); // Remove sorting to keep books in their original order
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };
    fetchBooks();
  }, [api]);

  // Handle Like/Unlike action
  const handleLike = async (bookId) => {
    try {
      const isLiked = likedBooks.has(bookId);
      const response = await api.post(endpoints.toggle_like(bookId));
      if (response.status === 201 || response.status === 204) {
        // Toggle like status
        setLikedBooks((prevLikes) => {
          const newLikes = new Set(prevLikes);
          if (isLiked) {
            newLikes.delete(bookId);
          } else {
            newLikes.add(bookId);
          }
          return newLikes;
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const getButtonColor = (bookId) => {
    return likedBooks.has(bookId) ? '#1c74e2' : '#606770'; // Blue if liked, gray if not
  };

  // Check if the book is liked
  const isBookLiked = (bookId) => likedBooks.has(bookId);

  return (
    <div className="container">
      <MainLayout />
      <div className="content-wrapper">
        {/* Carousel */}
        <Carousel className="carousel">
          {images.map((image, index) => (
            <Carousel.Item key={index}>
              <img className="d-block img-carousel" src={image} alt={`slide-${index}`} />
            </Carousel.Item>
          ))}
        </Carousel>

        <h1>GIỚI THIỆU</h1>
        <div className="intro">
          {/* Add introduction content here */}
        </div>

        <div className="list">
          {books.length > 0 ? (
            books.map((book) => (
              <div key={book.id} className="book-item">
                <img src={book.anhSach_url} className="book-image" alt={book.tenSach} />
                <h3>{book.tenSach}</h3>
                <h4>
                  <strong>Tác giả: </strong> {book.tenTacGia}
                </h4>

                <Button className="add">
                  <AddIcon /> Mượn sách
                </Button>

                {/* Like/Unlike button with dynamic style */}
                <div className="action-buttons mt-3">
                  <Button
                    variant="link"
                    className="action-btn"
                    onClick={() => handleLike(book.id)}
                    style={{ color: getButtonColor(book.id) }}
                  >
                    {isBookLiked(book.id) ? (
                      <ThumbUpIcon className="action-icon" />
                    ) : (
                      <ThumbUpOffAltIcon className="action-icon" />
                    )}
                    Thích
                  </Button>

                  <Button variant="link" className="action-btn">
                    <CommentIcon className="action-icon" /> Bình luận
                  </Button>
                  <Button variant="link" className="action-btn">
                    <ShareIcon className="action-icon" /> Chia sẻ
                  </Button>
                </div>
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
