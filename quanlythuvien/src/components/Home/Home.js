import React, { useEffect, useState, useCallback } from 'react';
import { Carousel, Button, Form, ListGroup } from 'react-bootstrap';
import Footer from '../../components/Footer/Footer';
import AddIcon from '@mui/icons-material/Add';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import ShareIcon from '@mui/icons-material/Share';
import SendIcon from '@mui/icons-material/Send';
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
  const [likedBooks, setLikedBooks] = useState(new Set());
  const [comments, setComments] = useState({});
  const [commentInput, setCommentInput] = useState({});
  const [visibleComments, setVisibleComments] = useState({});
  const [expandedBooks, setExpandedBooks] = useState(new Set());

  // Fetch books on component mount
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get(endpoints.sach);
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };
    fetchBooks();
  });

  const fetchComments = useCallback(async (bookId) => {
    console.log(`Fetching comments for bookId: ${bookId}`);
    try {
      const response = await api.get(endpoints.binhluan(bookId));
      console.log('Comments response:', response.data); // Log response
      setComments((prev) => ({ ...prev, [bookId]: response.data }));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }, [api, endpoints]);
  

  const toggleComments = useCallback((bookId) => {
    setVisibleComments((prev) => {
      const isVisible = prev[bookId];
      if (!isVisible) {
        fetchComments(bookId); // Fetch comments if not already fetched
      }
      return { ...prev, [bookId]: !isVisible };
    });
    setExpandedBooks((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(bookId)) {
        newExpanded.delete(bookId);
      } else {
        newExpanded.add(bookId);
      }
      return newExpanded;
    });
  }, [fetchComments]);
  

  // Handle book like/unlike
  const handleLike = async (bookId) => {
    try {
      const isLiked = likedBooks.has(bookId);
      const response = await api.post(endpoints.toggle_like(bookId));
      if (response.status === 201 || response.status === 204) {
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

  const getButtonColor = (bookId) => likedBooks.has(bookId) ? '#1c74e2' : '#606770';
  const isBookLiked = (bookId) => likedBooks.has(bookId);

  // Handle comment input change
  const handleCommentChange = (bookId, text) => {
    setCommentInput((prev) => ({ ...prev, [bookId]: text }));
  };

  // Handle submitting a comment
  const handleCommentSubmit = async (bookId) => {
    try {
      const response = await api.post(endpoints.create_comment(bookId), {
        content: commentInput[bookId],
      });
      if (response.status === 201) {
        setCommentInput((prev) => ({ ...prev, [bookId]: '' }));
        fetchComments(bookId);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

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
              <div key={book.id} className={`book-item ${expandedBooks.has(book.id) ? 'expanded' : ''}`}>
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

                  <Button
                    variant="link"
                    className="action-btn"
                    onClick={() => toggleComments(book.id)}
                  >
                    <CommentIcon className="action-icon" /> Bình luận
                  </Button>

                  <Button variant="link" className="action-btn">
                    <ShareIcon className="action-icon" /> Chia sẻ
                  </Button>
                </div>

                {visibleComments[book.id] && (
                  <div className="comment-section">
                    <ListGroup>
                      {Array.isArray(comments[book.id]) && comments[book.id].length > 0 ? (
                        comments[book.id].map((comment) => (
                          <ListGroup.Item key={comment.id}>
                            {comment.user.first_name} {comment.user.last_name}: {comment.content}
                          </ListGroup.Item>
                        ))
                      ) : (
                        <p>Chưa có bình luận nào.</p>
                      )}
                    </ListGroup>

                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={commentInput[book.id] || ''}
                      onChange={(e) => handleCommentChange(book.id, e.target.value)}
                      placeholder="Viết bình luận..."
                    />
                    <Button className="bt-comment" onClick={() => handleCommentSubmit(book.id)}><SendIcon /> Gửi</Button>
                  </div>
                )}
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
