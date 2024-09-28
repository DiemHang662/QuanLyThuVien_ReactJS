import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Alert, Button } from 'react-bootstrap';
import { authApi, endpoints } from '../../configs/API';
import MainLayout from '../../components/Navbar/MainLayout';
import Footer from '../../components/Footer/Footer';
import CheckIcon from '@mui/icons-material/Check';
import './Profile.css';

const Profile = () => {
    const api = authApi();
    const [currentUser, setCurrentUser] = useState(null);
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [fetchError, setFetchError] = useState('');
    const [updateSuccess, setUpdateSuccess] = useState(''); // State for showing success message
    const [returnedBooks, setReturnedBooks] = useState(new Set()); // Track returned books

    const fetchCurrentUser = async () => {
        try {
            const response = await api.get(endpoints.currentUser);
            setCurrentUser(response.data);
            fetchBorrowedBooks(response.data.id);
        } catch (error) {
            console.error('Error fetching current user:', error);
        }
    };

    const fetchBorrowedBooks = async (userId) => {
        try {
            const response = await api.get(endpoints.borrowedBooks(userId));
            setBorrowedBooks(response.data);
        } catch (error) {
            setFetchError('Error fetching borrowed books.');
            console.error('Error fetching borrowed books:', error.response?.data || error.message);
        }
    };

    const returnBook = async (bookId) => {
        try {
            const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in 'YYYY-MM-DD' format
            const data = { ngayTraThucTe: currentDate };

            await api.patch(endpoints.updateChiTietPhieuMuon(bookId), data); // Update the return date
            setUpdateSuccess(`Đã trả sách thành công cho sách ID: ${bookId}`);

            // Add the bookId to the set of returned books
            setReturnedBooks((prev) => new Set(prev).add(bookId));

            // Refresh the list of borrowed books
            if (currentUser) {
                fetchBorrowedBooks(currentUser.id);
            }
        } catch (error) {
            console.error('Error returning book:', error);
            setFetchError('Error updating the book return date.');
        }
    };

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    return (
        <>
            <MainLayout />
            <div>
                <h1 className="title-profile">THÔNG TIN NGƯỜI DÙNG</h1>
                <h2 className="history-book">LỊCH SỬ CÁC SÁCH ĐÃ MƯỢN</h2>

                {fetchError && <Alert variant="danger">{fetchError}</Alert>}
                {updateSuccess && <Alert variant="success">{updateSuccess}</Alert>}

                <Row className="mt-4">
                    {borrowedBooks.length > 0 ? (
                        borrowedBooks.map((book) => (
                            <Col key={book.id} sm={6} md={4} lg={3} className="mb-4">
                                <Card>
                                    {book.anhSach_url && (
                                        <Card.Img variant="top" src={book.anhSach_url} alt={book.tenSach} />
                                    )}
                                    <Card.Body>
                                        <Card.Title>{book.tenSach}</Card.Title>
                                        <Card.Text><strong>Ngày mượn: </strong> {book.ngayMuon}</Card.Text>
                                        <Card.Text><strong>Hạn trả: </strong> {book.ngayTraDuKien}</Card.Text>

                                        {book.tinhTrang === 'borrowed' || book.tinhTrang === 'late' ? (
                                            <>
                                                {book.tinhTrang === 'late' && (
                                                    <p style={{ color: 'red' }}>Đã quá hạn trả sách!</p>
                                                )}
                                                {/* Display the "Trả sách" button if the book has not been returned */}
                                                {!returnedBooks.has(book.id) ? ( // Check if the book has been returned
                                                    <Button
                                                        variant="warning"
                                                        onClick={() => returnBook(book.id)}
                                                    >
                                                        Trả sách
                                                    </Button>
                                                ) : null}
                                            </>
                                        ) : (
                                            <p style={{ color: 'green' }}>
                                                <CheckIcon /> Đã trả sách ({book.ngayTraThucTe})
                                            </p>
                                        )}

                                        {/* Show payment button after returning the book */}
                                        {returnedBooks.has(book.id) && (
                                            <>
                                                <p><strong>Phí phạt: </strong>{book.tienPhat} VND</p>
                                                <Button variant="success">Thanh toán tiền phạt</Button>
                                            </>
                                        )}
                                    </Card.Body>

                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col>
                            <p>Không có sách đã mượn.</p>
                        </Col>
                    )}
                </Row>
            </div>
            <Footer />
        </>
    );
};

export default Profile;
