import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Table, ButtonGroup, Image, Modal } from 'react-bootstrap';
import MainLayout from '../../components/Navbar/MainLayout';
import Footer from '../../components/Footer/Footer';
import { authApi, endpoints } from '../../configs/API';  
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import './SachList.css';

const SachList = () => {
    const api = authApi();
    const navigate = useNavigate();
    const [stats, setStats] = useState({});
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editBook, setEditBook] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await api.get(endpoints.sach);
                setBooks(response.data);

                const statsPromises = response.data.map(book =>
                    api.get(endpoints.soLanMuonTraQuaHan(book.id))
                        .then(statResponse => ({
                            id: book.id,
                            ...statResponse.data,
                        }))
                        .catch(error => ({
                            id: book.id,
                            borrowed_count: 0,
                            returned_count: 0,
                            late_count: 0,
                        }))
                );

                const statsResults = await Promise.all(statsPromises);
                const statsMap = statsResults.reduce((acc, stat) => {
                    acc[stat.id] = stat;
                    return acc;
                }, {});
                setStats(statsMap);
            } catch (error) {
                console.error('Error fetching books:', error.response?.data || error.message);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await api.get(endpoints.danhmuc);
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error.response?.data || error.message);
            }
        };

        fetchBooks();
        fetchCategories();
    }, []);

    const filteredBooks = books.filter(book =>
        book.tenSach.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.tenTacGia.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sách này không?')) {
            try {
                await api.delete(endpoints.deleteSach(id));
                setBooks(books.filter(book => book.id !== id));
                const newStats = { ...stats };
                delete newStats[id];
                setStats(newStats);
            } catch (error) {
                console.error('Error deleting book:', error.response?.data || error.message);
            }
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        if (editBook) {
            try {
                const formData = new FormData();
                formData.append('tenSach', editBook.tenSach);
                formData.append('tenTacGia', editBook.tenTacGia);
                formData.append('nXB', editBook.nXB);
                formData.append('namXB', editBook.namXB);
                formData.append('soLuong', editBook.soLuong);
                formData.append('danhMuc', editBook.danhMuc);
                if (editBook.anhSach) {
                    formData.append('anhSach', editBook.anhSach);
                }

                let response;
                if (editBook.id) {
                    response = await api.patch(endpoints.updateSach(editBook.id), formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                } else {
                    response = await api.post(endpoints.createSach, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                }

                const booksResponse = await api.get(endpoints.sach);
                setBooks(booksResponse.data);
                setShowEditModal(false);
                setEditBook(null);
            } catch (error) {
                if (error.response && error.response.data) {
                    setErrors(error.response.data);
                    console.error('Error saving book:', error.response.data);
                } else {
                    console.error('Error saving book:', error.message);
                }
            }
        }
    };

    const handleAddBook = () => {
        setEditBook({
            tenSach: '',
            tenTacGia: '',
            nXB: '',
            namXB: '',
            soLuong: 0,
            danhMuc: '',
            anhSach: null,
        });
        setShowEditModal(true);
    };

    return (
        <>
            <MainLayout />
            <h1 className="title-list">DANH SÁCH SÁCH</h1>

            <div className="container1">
                <Form className="filter-form1">
                    <Form.Group>
                        <Form.Control
                            type="text"
                            placeholder="Tìm kiếm sách"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '550px', marginLeft: '30px' }}
                        />
                    </Form.Group>
                    <Button
                        className="add-book-button"
                        onClick={handleAddBook}
                        variant="success"
                    >
                        <AddIcon /> Thêm
                    </Button>
                </Form>

                <Table bordered hover responsive className="table-book">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Ảnh bìa</th>
                            <th>Tên sách</th>
                            <th>Tác giả</th>
                            <th>Nhà xuất bản</th>
                            <th>Năm xuất bản</th>
                            <th>Danh mục</th>
                            <th>Còn lại</th>
                            <th>Đang mượn</th>
                            <th>Tổng mượn - trả - quá hạn</th>
                            <th>Tác vụ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBooks.map(book => (
                            <tr key={book.id}>
                                <td>{book.id}</td>
                                <td>
                                    {book.anhSach_url && <Image src={book.anhSach_url} className="book-img" />}
                                </td>
                                <td>{book.tenSach}</td>
                                <td>{book.tenTacGia}</td>
                                <td>{book.nXB}</td>
                                <td>{book.namXB}</td>
                                <td>{book.tenDanhMuc}</td>
                                <td>{book.soLuong}</td>
                                <td>{book.soSachDangMuon}</td>
                                <td>{stats[book.id]?.borrowed_count ?? 0}  {stats[book.id]?.returned_count ?? 0}  {stats[book.id]?.late_count ?? 0}</td>
                                <td className="action-buttons-book">
                                    <Button
                                        variant="warning"
                                        className="book-button-warning"
                                        onClick={() => {
                                            setEditBook(book);
                                            setShowEditModal(true);
                                        }}
                                    >
                                        <EditIcon />
                                    </Button>
                                    <Button
                                        variant="danger"
                                        className="book-button-danger"
                                        onClick={() => handleDelete(book.id)}
                                    >
                                        <DeleteIcon />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>{editBook?.id ? 'Chỉnh sửa sách' : 'Thêm sách'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleEditSubmit} encType="multipart/form-data">
                            <div className="row">
                                <div className="col-md-6">
                                    <Form.Group controlId="tenSach">
                                        <Form.Label>Tên sách</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={editBook?.tenSach || ''}
                                            onChange={(e) => setEditBook({ ...editBook, tenSach: e.target.value })}
                                            isInvalid={!!errors.tenSach}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.tenSach && errors.tenSach.join(', ')}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">
                                    <Form.Group controlId="tenTacGia">
                                        <Form.Label>Tác giả</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={editBook?.tenTacGia || ''}
                                            onChange={(e) => setEditBook({ ...editBook, tenTacGia: e.target.value })}
                                            isInvalid={!!errors.tenTacGia}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.tenTacGia && errors.tenTacGia.join(', ')}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <Form.Group controlId="nXB">
                                        <Form.Label>Nhà xuất bản</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={editBook?.nXB || ''}
                                            onChange={(e) => setEditBook({ ...editBook, nXB: e.target.value })}
                                            isInvalid={!!errors.nXB}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.nXB && errors.nXB.join(', ')}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">
                                    <Form.Group controlId="namXB">
                                        <Form.Label>Năm xuất bản</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={editBook?.namXB || ''}
                                            onChange={(e) => setEditBook({ ...editBook, namXB: e.target.value })}
                                            isInvalid={!!errors.namXB}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.namXB && errors.namXB.join(', ')}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <Form.Group controlId="soLuong">
                                        <Form.Label>Số lượng</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={editBook?.soLuong || ''}
                                            onChange={(e) => setEditBook({ ...editBook, soLuong: e.target.value })}
                                            isInvalid={!!errors.soLuong}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.soLuong && errors.soLuong.join(', ')}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">
                                    <Form.Group controlId="danhMuc">
                                        <Form.Label>Danh mục</Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={editBook?.danhMuc || ''}
                                            onChange={(e) => setEditBook({ ...editBook, danhMuc: e.target.value })}
                                            isInvalid={!!errors.danhMuc}
                                            required
                                        >
                                            <option value="">Chọn danh mục</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.tenDanhMuc}</option>
                                            ))}
                                        </Form.Control>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.danhMuc && errors.danhMuc.join(', ')}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </div>
                            </div>
                            <Form.Group controlId="anhSach">
                                <Form.Label>Ảnh bìa</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setEditBook({ ...editBook, anhSach: e.target.files[0] })}
                                />
                                {editBook?.anhSach_url && (
                                    <Image src={editBook.anhSach_url} className="book-image-up" />
                                )}
                                {errors.anhSach && (
                                    <div className="invalid-feedback d-block">
                                        {errors.anhSach.join(', ')}
                                    </div>
                                )}
                            </Form.Group>
                            <Button type="submit" variant="primary" className="text-center mt-3">
                                Lưu
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </div>
            <Footer />
        </>
    );
};

export default SachList;
