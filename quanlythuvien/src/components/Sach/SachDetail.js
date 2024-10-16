import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authApi, endpoints } from '../../configs/API';
import MainLayout from '../../components/Navbar/MainLayout';
import Footer from '../../components/Footer/Footer';
import { Button, Modal } from 'react-bootstrap';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import './SachDetail.css';

const SachDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [borrowSuccess, setBorrowSuccess] = useState(false);
    const [isBorrowed, setIsBorrowed] = useState(false);
    const [error, setError] = useState('');
    const [loanSlips, setLoanSlips] = useState([]);
    const [selectedLoanSlipId, setSelectedLoanSlipId] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedLoanSlip, setSelectedLoanSlip] = useState(null);
    const [relatedBooks, setRelatedBooks] = useState([]);
    // const [stats, setStats] = useState({ borrowed_count: 0, returned_count: 0, late_count: 0 });


    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const response = await authApi().get(endpoints.sachChiTiet(id));
                setBook(response.data);
            } catch (error) {
                console.error('Error fetching book details:', error);
            }
        };

        const fetchCurrentUser = async () => {
            try {
                const response = await authApi().get(endpoints.currentUser);
                setCurrentUser(response.data);
            } catch (error) {
                console.error('Error fetching current user:', error);
            }
        };

        // const fetchStats = async () => {
        //     try {
        //         const response = await authApi().get(endpoints.soLanMuonTraQuaHan(id));
        //         console.log('Statistics response:', response.data); // Kiểm tra dữ liệu trả về
        //         setStats(response.data);
        //     } catch (error) {
        //         console.error('Error fetching book stats:', error);
        //     }
        // };

        fetchBookDetails();
        fetchCurrentUser();
        // fetchStats();
    }, [id]);

    useEffect(() => {
        const fetchLoanSlips = async () => {
            try {
                const loanSlipsResponse = await authApi().get(endpoints.phieuMuon);
                setLoanSlips(loanSlipsResponse.data);
            } catch (error) {
                console.error('Error fetching loan slips:', error.response?.data || error.message);
            }
        };
        fetchLoanSlips();
    }, []);

    useEffect(() => {
        const fetchRelatedBooks = async () => {
            try {
                const response = await authApi().get(endpoints.sach);
                setRelatedBooks(response.data);
            } catch (error) {
                console.error('Error fetching related books:', error);
            }
        };

        fetchRelatedBooks();
    }, []);

    // Kiểm tra trạng thái mượn sách của người dùng
    useEffect(() => {
        const borrowedStatus = localStorage.getItem(`isBorrowed_${id}`);
        if (borrowedStatus === 'true') {
            setIsBorrowed(true);
        }

        // Kiểm tra xem người dùng có phiếu mượn cho sách hiện tại không
        if (currentUser && loanSlips.length > 0) {
            const hasBorrowed = loanSlips.some(slip => 
                slip.sach === id && slip.userId === currentUser.id
            );
            setIsBorrowed(hasBorrowed);
        }
    }, [id, currentUser, loanSlips]);

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedLoanSlipId('');
        setSelectedLoanSlip(null);
        setError('');
    };

    const handleCreateChiTietPhieuMuon = async (e) => {
        e.preventDefault();

        const newChiTiet = {
            phieuMuon: selectedLoanSlipId,
            sach: id,
        };

        try {
            await authApi().post(endpoints.chiTietPhieuMuon, newChiTiet);
            setBorrowSuccess(true);
            setIsBorrowed(true);
            localStorage.setItem(`isBorrowed_${id}`, 'true'); // Lưu trạng thái vào local storage
            handleCloseModal();
        } catch (error) {
            setError('Error creating loan slip detail.');
            console.error('Error creating loan slip detail:', error.response?.data || error.message);
        }
    };

    const handleLoanSlipChange = (e) => {
        const loanSlipId = e.target.value;
        setSelectedLoanSlipId(loanSlipId);
        const slip = loanSlips.find((slip) => slip.id === loanSlipId);
        setSelectedLoanSlip(slip);
    };

    const handleReturnBook = async () => {
        try {
            await authApi().post(endpoints.tranTraSach, { sach: id, userId: currentUser.id });
            setIsBorrowed(false);
            localStorage.removeItem(`isBorrowed_${id}`); // Xóa trạng thái khỏi local storage
            alert('Trả sách thành công!');
        } catch (error) {
            setError('Error returning the book.');
            console.error('Error returning the book:', error.response?.data || error.message);
        }
    };

    if (!book || !currentUser) {
        return <p>Loading...</p>;
    }

    const filteredLoanSlips = loanSlips.filter(slip => new Date(slip.ngayTraDuKien) > new Date());

    return (
        <>
            <MainLayout />
            <div className="sach-detail-container">
                <div className="book-imageSach">
                    <img src={book.anhSach_url} alt={book.tenSach} />
                </div>
                <div className="book-info">
                    <h1 className="title-tenSach">{book.tenSach}</h1>
                    <div className="book-info-1">
                        <p><strong>Tác giả: </strong> {book.tenTacGia}</p>
                        <p><strong>Nhà xuất bản:  </strong> {book.nXB}</p>
                        <p><strong>Năm xuất bản: </strong> {book.namXB}</p>
                        <p><strong>Thể loại: </strong> {book.tenDanhMuc}</p>
                        <p><strong>Số lượng còn lại: </strong> {book.soLuong}</p>
                        {/* <p><strong>Tổng lần mượn: </strong> {stats.borrowed_count}</p>
                        <p><strong>Tổng lần trả: </strong> {stats.returned_count}</p>
                        <p><strong>Tổng quá hạn: </strong> {stats.late_count}</p> */}
                    </div>
                    <div className="left-right">
                        <div className="left" onClick={() => navigate('/')}><KeyboardBackspaceIcon /></div>
                    </div>
                    {book.soLuong > 0 ? (
                        isBorrowed ? (
                            <Button className="add-to-cart bg-secondary" onClick={handleReturnBook}>Đã mượn sách</Button>
                        ) : (
                            <Button className="add-to-cart" onClick={handleOpenModal}>Mượn sách</Button>
                        )
                    ) : (
                        <p className="text"></p> 
                    )}
                </div>
            </div>

            <div className="related-books-section">
                <h2 className="title-related">MỘT SỐ SÁCH KHÁC CHO BẠN</h2>
                <div className="related-books-list">
                    {relatedBooks.slice(0, 12).map((relatedBook) => (
                        <div key={relatedBook.id} className="related-book-item">
                            <img src={relatedBook.anhSach_url} alt={relatedBook.tenSach} className="related-book-image" />
                            <p className="related-book-title">{relatedBook.tenSach}</p>
                            <p className="related-book-tacgia"><strong>Tác giả:</strong> {relatedBook.tenTacGia}</p>
                            <Button
                                variant="warning" className="detail-book"
                                onClick={() => navigate(`/sach/${relatedBook.id}`)}
                            >
                                Xem chi tiết
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            <Modal show={showModal} onHide={handleCloseModal} className="sach-detail-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Chọn phiếu mượn</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h3 className="title-user-book">Thông tin mượn sách</h3>
                    <div className="loan-slip-info">
                        <img src={book.anhSach_url} alt={book.tenSach} className="book-image-xacnhan" />
                        <p><strong>Sách: </strong> {book.tenSach}</p>
                        <p><strong>Tác giả: </strong> {book.tenTacGia}</p>
                        <p><strong>Nhà xuất bản: </strong> {book.nXB}</p>
                        <p><strong>Người mượn: </strong> {currentUser.first_name} {currentUser.last_name}</p>
                    </div>

                    <form onSubmit={handleCreateChiTietPhieuMuon}>
                        <select
                            value={selectedLoanSlipId}
                            onChange={handleLoanSlipChange}
                            className="loan-slip-select" >
                            <option value="">Chọn phiếu mượn</option>
                            {filteredLoanSlips.map((slip) => (
                                <option key={slip.id} value={slip.id}>
                                    {slip.first_name} {slip.last_name} - {slip.ngayMuon} - {slip.ngayTraDuKien}
                                </option>
                            ))}
                        </select>

                        {borrowSuccess ? (
                            <p style={{ color: 'green' }}>Bạn đã mượn sách thành công!</p>
                        ) : (
                            <Button className="add-to-cart" type="submit">Xác nhận mượn sách</Button>
                        )}

                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </form>
                </Modal.Body>
            </Modal>

            <Footer />
        </>
    );
};

export default SachDetail;