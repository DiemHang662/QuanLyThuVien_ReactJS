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

        fetchBookDetails();
        fetchCurrentUser();
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

    // Load borrowing status from local storage
    useEffect(() => {
        const borrowedStatus = localStorage.getItem(`isBorrowed_${id}`);
        if (borrowedStatus === 'true') {
            setIsBorrowed(true);
        }
    }, [id]);

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
            localStorage.setItem(`isBorrowed_${id}`, 'true'); // Save status in local storage
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
            localStorage.removeItem(`isBorrowed_${id}`); // Remove status from local storage
            alert('Trả sách thành công!');
        } catch (error) {
            setError('Error returning the book.');
            console.error('Error returning the book:', error.response?.data || error.message);
        }
    };

    if (!book || !currentUser) {
        return <p>Loading...</p>;
    }

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
                    </div>
                    <div className="left-right">
                        <div className="left" onClick={() => navigate('/')}><KeyboardBackspaceIcon /></div>
                    </div>
                    {isBorrowed ? (
                        <Button className="add-to-cart bg-secondary">Đã mượn sách</Button>
                    ) : (
                        <Button className="add-to-cart" onClick={handleOpenModal}>Mượn sách</Button>
                    )}
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
                            className="loan-slip-select"
                        >
                            <option value="">Chọn phiếu mượn</option>
                            {loanSlips.map((slip) => (
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