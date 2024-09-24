import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { authApi, endpoints } from '../../configs/API';

const SachByDanhMuc = ({ categories }) => {
  const { id } = useParams(); // Get the category ID from the URL
  const api = authApi();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch books for the selected category when the component mounts or when the category ID changes
  React.useEffect(() => {
    const fetchBooks = async () => {
      if (id) {
        setLoading(true);
        setError(null);

        try {
          const response = await api.get(endpoints.sachbydanhmuc, {
            params: { danhmuc: id },
          });
          setBooks(response.data);
        } catch (err) {
          setError('Lỗi khi tải sách.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBooks();
  }, [id]);

  return (
    <div>
      <h2>Sách thuộc danh mục ID: {id}</h2>
      {loading && <p>Đang tải sách...</p>}
      {error && <p>{error}</p>}
      {!loading && books.length > 0 && (
        <div>
          <h3>Sách trong danh mục:</h3>
          <ul>
            {books.map(book => (
              <li key={book.id}>
                <h4>{book.tenSach}</h4>
                <p>Tác giả: {book.tenTacGia}</p>
                <p>NXB: {book.nXB}</p>
                <p>Năm xuất bản: {book.namXB}</p>
                <p>Số lượng: {book.soLuong}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      {!loading && books.length === 0 && <p>Không có sách nào trong danh mục này.</p>}
    </div>
  );
};

export default SachByDanhMuc;
