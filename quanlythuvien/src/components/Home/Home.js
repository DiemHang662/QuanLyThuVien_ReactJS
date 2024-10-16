import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-scroll';
import { Carousel, Button, Form, ListGroup, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
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
    'https://tieuhoctranquoctoan.edu.vn/uploads/news/2023_03/sbia.jpg',
    'https://thanhdo.edu.vn/wp-content/uploads/2022/09/thu20vien20tdd.jpg',
    'https://hoinhabaobacgiang.vn/Includes/NewsImg/3_2024/30193_3.jpg',
  ];

  const danhmuc = [
    {
      id: 1,
      tenDanhMuc: "Tiểu thuyết",
      iconUrl: "/images/TieuThuyet.PNG"
    },
    {
      id: 2,
      tenDanhMuc: "Truyện tranh",
      iconUrl: "/images/TruyenTranh.PNG"
    },
    {
      id: 3,
      tenDanhMuc: "Tâm lý",
      iconUrl: "/images/TamLy.PNG"
    },
    {
      id: 4,
      tenDanhMuc: "Giáo trình",
      iconUrl: "/images/GiaoTrinh.PNG"
    },
    {
      id: 5,
      tenDanhMuc: "Y học",
      iconUrl: "/images/YTe.PNG"
    },
    {
      id: 6,
      tenDanhMuc: "Lịch sử",
      iconUrl: "/images/LichSu.PNG"
    },
    {
      id: 7,
      tenDanhMuc: "Khoa học",
      iconUrl: "/images/KhoaHoc.PNG"
    },
    {
      id: 8,
      tenDanhMuc: "Lập trình",
      iconUrl: "/images/MayTinh.PNG"
    },
  ];

  const api = authApi();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [recentBooks, setRecentBooks] = useState([]);
  const [likedBooks, setLikedBooks] = useState(new Set());
  const [comments, setComments] = useState({});
  const [commentInput, setCommentInput] = useState({});
  const [visibleComments, setVisibleComments] = useState({});
  const [expandedBooks, setExpandedBooks] = useState(new Set());
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [likeCounts, setLikeCounts] = useState({});
  const [mostLikedBooks, setMostLikedBooks] = useState([]);
  const bookListRef = useRef(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get(endpoints.sach);
        setAllBooks(response.data);
        setBooks(response.data);

        // Fetch like counts concurrently for all books
        const likeCountsData = await Promise.all(
          response.data.map(async (book) => {
            const likeResponse = await api.get(endpoints.likeCount(book.id));
            return { bookId: book.id, likeCount: likeResponse.data.like_count }; // Use 'like_count'
          })
        );

        // Transform the results into a { bookId: likeCount } object
        const likeCountsMap = likeCountsData.reduce((acc, curr) => {
          acc[curr.bookId] = curr.likeCount;
          return acc;
        }, {});

        setLikeCounts(likeCountsMap);
      } catch (error) {
        console.error('Lỗi khi gọi API sách:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await api.get(endpoints.danhmuc);
        setCategories(response.data);
      } catch (error) {
        console.error('Lỗi khi gọi API danh mục:', error);
      }
    };

    const fetchRecentBooks = async () => {
      try {
        const response = await api.get(endpoints.sachMoiCapNhat); // Fetch recent books
        setRecentBooks(response.data);
      } catch (error) {
        console.error('Error fetching recent books:', error);
      }
    };

    const fetchMostLikedBooks = async () => {
      try {
        const response = await api.get(endpoints.mostLiked);
        setMostLikedBooks(response.data); // Giả sử dữ liệu trả về là mảng sách
      } catch (error) {
        console.error('Error fetching most liked books:', error);
      }
    };

    fetchBooks();
    fetchCategories();
    fetchRecentBooks();
    fetchMostLikedBooks();
  }, []);


  const fetchComments = useCallback(async (bookId) => {
    try {
      const response = await api.get(endpoints.binhluan(bookId));
      setComments((prev) => ({ ...prev, [bookId]: response.data }));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }, []);

  const toggleComments = useCallback((bookId) => {
    setVisibleComments((prev) => {
      const isVisible = prev[bookId];
      if (!isVisible) {
        fetchComments(bookId);
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
  }, []);

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

  const handleCommentChange = (bookId, text) => {
    setCommentInput((prev) => ({ ...prev, [bookId]: text }));
  };

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

  const handleCategoryChange = async (categoryId) => {
    setSelectedCategory(categoryId);
    try {
      const response = await api.get(endpoints.sachByDanhMuc(categoryId));
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books by category:', error);
    }
  };

  const handleSearch = (searchQuery) => {
    setSearchTerm(searchQuery); // Cập nhật trạng thái searchTerm

    if (searchQuery) {
      const filteredBooks = allBooks.filter(book =>
        book.tenSach.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setBooks(filteredBooks); // Cập nhật danh sách sách theo tìm kiếm

      // Cuộn xuống phần sách trong thư viện
      if (bookListRef.current && filteredBooks.length > 0) {
        setTimeout(() => {
          bookListRef.current.scrollIntoView({ behavior: 'smooth' });
        }, 1000); // Thêm delay để đảm bảo cuộn xảy ra sau khi cập nhật
      }
    } else {
      setBooks(allBooks); // Nếu không có từ khóa, hiển thị tất cả sách
    }
  };

  const handleShare = async (bookId, userMessage) => {
    const book = books.find(b => b.id === bookId);
    if (book) {
      const shareUrl = `http://localhost:3000/sach/${book.id}`;
      const message = userMessage || `Đã chia sẻ sách: ${book.tenSach} by ${book.tenTacGia}`;
      try {
        const response = await api.post(endpoints.share(book.id), { message });
        if (response.status === 201) {
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(message)}`, '_blank');
        } else {
          console.error('Failed to share the book.');
        }
      } catch (error) {
        console.error('Error sharing the book:', error);
      }
    }
  };

  return (
    <div className="body-home">
      <div className="container-home">
        <MainLayout onCategoryChange={handleCategoryChange} />
        <div className="content-wrapper">
          <div className="sidebar">
            <h4 className="title-sidebar">Thể loại</h4>
            <ListGroup>
              {categories.map((category) => (
                <ListGroup.Item
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className="list-group-item" // Ensure this class is applied
                >
                  {category.tenDanhMuc}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>

          <div className="book-list">

            <Carousel className="carousel">
              {images.map((image, index) => (
                <Carousel.Item key={index}>
                  <img className="d-block img-carousel" src={image} alt={`slide-${index}`} />
                </Carousel.Item>
              ))}
            </Carousel>
            <div>
              <Form.Group controlId="search">
                <Form.Control
                  className="search-ctpm"
                  type="text"
                  placeholder="Nhập tên sách..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)} // Gọi hàm tìm kiếm ngay khi thay đổi
                />
              </Form.Group>
            </div>
            <div>

              <div className="category-container" onClick={() => {
                const element = document.getElementById("bookList");
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}>
                <div className="category-list">
                  {danhmuc.map((category) => (
                    <div
                      key={category.id}
                      className="category-item"
                      onClick={() => handleCategoryChange(category.id)}
                    >
                      <img src={category.iconUrl} alt={category.tenDanhMuc} className="category-icon" />
                      <p>{category.tenDanhMuc}</p>
                    </div>
                  ))}
                </div>
              </div>


              <div className="title-border">
                <div className="title-recent">
                  <p>SÁCH MỚI CẬP NHẬT</p>
                </div>
              </div>

              <div className="list" >
                {recentBooks.length > 0 ? (
                  recentBooks.map((book) => (
                    <div key={book.id} className="book-item1" onClick={() => navigate(`/sach/${book.id}`)}>
                      <span className="new-badge">Mới cập nhật</span>
                      <img src={book.anhSach_url} className="book-image1" alt="Book" />
                      <h3>{book.tenSach}</h3>
                      <h4><strong>Tác giả: </strong> {book.tenTacGia}</h4>
                    </div>
                  ))
                ) : (
                  <p>Không có sách mới nào.</p>
                )}
              </div>
            </div>


            <div className="title-border">
              <div className="title-recent">
                <p>SÁCH THÍCH NHẤT</p>
              </div>
            </div>

            <div className="list">
              {mostLikedBooks.length > 0 ? (
                mostLikedBooks.map((book) => (
                  <div key={book.id} className="book-item1" onClick={() => navigate(`/sach/${book.id}`)}>
                    <span className="new-badge">Thích nhất</span>
                    <img src={book.anhSach_url} className="book-image1" alt="Book" />
                    <h3>{book.tenSach}</h3>
                    <h4><strong>Tác giả: </strong> {book.tenTacGia}</h4>
                  </div>
                ))
              ) : (
                <p>Không có sách được thích nào.</p>
              )}
            </div>

            <div className="title-border">
              <div className="title-recent">
                <p>SÁCH TRONG THƯ VIỆN</p>
              </div>
            </div>

            <div id="bookList" className="list" ref={bookListRef}>
              {books.length > 0 ? (
                books.map((book) => (
                  <div key={book.id} className={`book-item ${expandedBooks.has(book.id) ? 'expanded' : ''}`}>
                    <img src={book.anhSach_url} className="book-image" alt="Book" />
                    <h3>{book.tenSach}</h3>
                    <h4><strong>Tác giả: </strong> {book.tenTacGia}</h4>
                    <Button className="add" onClick={() => navigate(`/sach/${book.id}`)}>
                      <AddIcon /> Mượn sách
                    </Button>
                    <div className="action-buttons mt-3">
                      <Button variant="link" className="action-btn" onClick={() => handleLike(book.id)} style={{ color: getButtonColor(book.id) }}>
                        {isBookLiked(book.id) ? <ThumbUpIcon className="action-icon" /> : <ThumbUpOffAltIcon className="action-icon" />}
                        Thích
                        <span className="like-count"> ({likeCounts[book.id] || 0})</span>
                      </Button>
                      <Button variant="link" className="action-btn" onClick={() => toggleComments(book.id)}>
                        <CommentIcon className="action-icon" /> Bình luận
                      </Button>
                      <Button variant="link" className="action-btn" onClick={() => handleShare(book.id)}><ShareIcon className="action-icon" /> Chia sẻ</Button>
                    </div>
                    {visibleComments[book.id] && (
                      <div className="comment-section">
                        <ListGroup>
                          {Array.isArray(comments[book.id]) && comments[book.id].length > 0 ? (
                            comments[book.id].map((comment) => (
                              <ListGroup.Item key={comment.id}>
                                <img src={comment.user.avatar_url} alt="Avatar" className="avatar" />
                                <span className="cmt">{comment.content}</span>
                              </ListGroup.Item>
                            ))
                          ) : (
                            <ListGroup.Item className="text-center">Chưa có bình luận nào.</ListGroup.Item>
                          )}
                        </ListGroup>
                        <Form onSubmit={(e) => { e.preventDefault(); handleCommentSubmit(book.id); }}>
                          <Form.Control
                            type="text"
                            placeholder="Nhập bình luận..." className="cmt-text"
                            value={commentInput[book.id] || ''}
                            onChange={(e) => handleCommentChange(book.id, e.target.value)}
                          />
                          <Button type="submit" className="mt-2"><SendIcon /> Gửi</Button>
                        </Form>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p>Không có sách nào.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
