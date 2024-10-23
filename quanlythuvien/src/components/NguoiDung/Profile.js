import React, { useContext, useEffect, useState, useRef } from 'react';
import { Card, Row, Col, Alert, Button, Modal, Image, Form } from 'react-bootstrap';
import { authApi, endpoints } from '../../configs/API';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import { MyUserContext, MyDispatchContext } from '../../configs/Contexts';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/Navbar/MainLayout';
import Footer from '../../components/Footer/Footer';
import CheckIcon from '@mui/icons-material/Check';
import PaymentIcon from '@mui/icons-material/Payment';
import LockIcon from '@mui/icons-material/Lock';
import LogoutIcon from '@mui/icons-material/Logout';
import './Profile.css';

const Profile = () => {
    const api = authApi();
    const navigate = useNavigate();
    const user = useContext(MyUserContext);
    const dispatch = useContext(MyDispatchContext);
    const [currentUser, setCurrentUser] = useState(null);
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [fetchError, setFetchError] = useState('');
    const [updateSuccess, setUpdateSuccess] = useState('');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [error, setError] = useState('');
    const [paymentStatus, setPaymentStatus] = useState({});
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

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
            const currentDate = new Date().toISOString().split('T')[0];
            const data = { ngayTraThucTe: currentDate };

            await api.patch(endpoints.updateChiTietPhieuMuon(bookId), data);
            setUpdateSuccess(`Đã trả sách thành công `);
            setTimeout(() => {
                setUpdateSuccess(''); // Clear the success message
            }, 5000);
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

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            await api.post(endpoints.changePassword, { old_password: oldPassword, new_password: newPassword });
            alert('Đã thay đổi mật khẩu thành công.');
            navigate('/login');
        } catch (error) {
            setError('Có lỗi xảy ra khi thay đổi mật khẩu.');
            console.error('Error changing password:', error.response?.data || error.message);
        }
    };

    const openChangePasswordModal = () => {
        setShowChangePasswordModal(true);
    };

    const closeChangePasswordModal = () => {
        setShowChangePasswordModal(false);
        setOldPassword('');
        setNewPassword('');
        setError('');
    };


    const handleThanhToanMomo = async (item) => {
        try {
            const api = await authApi();
            const requestBody = createMomoRequestBody(item);

            console.log('Request Body:', JSON.stringify(requestBody));

            const response = await axios.post('/v2/gateway/api/create', requestBody, {
                headers: { 'Content-Type': 'application/json' }
            });

            console.log('Momo payment response:', response.data);
            handlePaymentResponse(response.data, item, api);
        } catch (error) {
            console.error('Error during Momo payment request:', error.response?.data || error.message);
            window.alert('Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại sau!');
        }
    };

    const createMomoRequestBody = (item) => {
        const partnerCode = "MOMO";
        const accessKey = "F8BBA842ECF85";
        const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
        const requestId = `${partnerCode}${Date.now()}`;
        const orderId = `MM${Date.now()}`;
        const orderInfo = "Thanh toán hóa đơn";
        const redirectUrl = "https://momo.vn/return";
        const ipnUrl = "https://callback.url/notify";
        const amount = item.tienPhat;
        const requestType = "payWithATM";
        const extraData = "";

        const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
        const signature = CryptoJS.HmacSHA256(rawSignature, secretKey).toString(CryptoJS.enc.Hex);

        return {
            partnerCode,
            accessKey,
            requestId,
            amount,
            orderId,
            orderInfo,
            redirectUrl,
            ipnUrl,
            extraData,
            requestType,
            signature,
            lang: "vi"
        };
    };

    const handlePaymentResponse = async (data, item, api) => {
        if (data && data.payUrl) {
            const payUrl = data.payUrl.trim();
            console.log('Trimmed PayUrl:', payUrl);
            window.open(payUrl, '_blank');
        }
    };

    const openPaymentModal = (book) => {
        setSelectedBook(book);
        setShowPaymentModal(true);
    };

    const handleCloseModal = () => {
        setShowPaymentModal(false);
        setSelectedBook(null);
    };

    const handlePaymentSuccess = (bookId) => {
        setTimeout(() => {
            setPaymentStatus((prevStatus) => ({
                ...prevStatus,
                [bookId]: true,
            }));
        }, 10000);
    };

    const handleLogout = () => {
        dispatch({ type: 'logout' });
        navigate('/login');
    };

    const handleThanhToanZalopay = async (item) => {
        try {
            const response = await api.post(endpoints.zalo, {
                amount: item.tienPhat,
                app_user: currentUser.id // Pass the current user's ID or any other relevant info
            });
            if (response.data && response.data.order_url) {
                window.open(response.data.order_url, '_blank'); // Open the ZaloPay payment page
            } else {
                alert('Có lỗi xảy ra khi tạo đơn hàng Zalo. Vui lòng thử lại sau!');
            }
        } catch (error) {
            console.error('Error handling Zalo payment:', error);
            alert('Có lỗi xảy ra khi tạo đơn hàng Zalo. Vui lòng thử lại sau!');
        }
    };

    return (
        <>
            <MainLayout />
            <div>
                <h1 className="title-profile">THÔNG TIN NGƯỜI DÙNG</h1>

                {currentUser && (
                    <Row>
                        <Col xs={7} md={4} className=" justify-content-center user-profile">
                            {currentUser.avatar_url && (
                                <Image src={currentUser.avatar_url} className="avatar-currentUser" />
                            )}
                        </Col>
                        <Col xs={7} md={6} className="currentUser">
                            <h2 className="hello-user"><strong>XIN CHÀO, {currentUser.first_name} {currentUser.last_name}</strong></h2>
                            <p className="about"><strong>Mã người dùng: </strong> {currentUser.id}</p>
                            <p className="about"><strong>Họ người dùng: </strong> {currentUser.first_name}</p>
                            <p className="about"><strong>Tên người dùng: </strong> {currentUser.last_name}</p>
                            <p className="about"><strong>Năm sinh: </strong> {currentUser.nam_sinh}</p>
                            <p className="about"><strong>Email: </strong> {currentUser.email}</p>
                            <p className="about"><strong>Số điện thoại: </strong> {currentUser.phone}</p>
                            <p className="about">
                                <strong>Vai trò: </strong>
                                {currentUser.chucVu === 'doc_gia' ? 'Độc giả' :
                                    currentUser.chucVu === 'nhan_vien' ? 'Nhân viên' :
                                        'Chưa xác định'}
                            </p>

                            {/* <p><strong>Số lần mượn sách: </strong> {currentUser.soLuongMuon}</p>
                            <p><strong>Số lần trả sách: </strong> {currentUser.soLuongTra}</p>
                            <p><strong>Số lần quá hạn mượn sách: </strong> {currentUser.soLuongQuaHan}</p> */}
                            <Button variant="primary" className="mb-2 change-password" onClick={openChangePasswordModal}><LockIcon /> Đổi mật khẩu</Button>
                            <Button variant="danger" className="mb-2" onClick={handleLogout}><LogoutIcon /> Đăng xuất</Button>
                        </Col>
                    </Row>
                )}

                <h2 className="history-book">LỊCH SỬ CÁC SÁCH ĐÃ MƯỢN</h2>

                {fetchError && <Alert variant="danger">{fetchError}</Alert>}
                {updateSuccess && <Alert variant="success">{updateSuccess}</Alert>}

                <div class="table-responsive">
                    <table class="table table-hover table-history">
                        <thead>
                            <tr>
                                <th>Ảnh Sách</th>
                                <th>Tên Sách</th>
                                <th>Ngày Mượn</th>
                                <th>Hạn Trả</th>
                                <th>Trạng Thái</th>
                                <th>Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {borrowedBooks.length > 0 ? (
                                borrowedBooks.map((book) => (
                                    <tr key={book.id}>
                                        <td>
                                            {book.anhSach_url && (
                                                <img src={book.anhSach_url} alt={book.tenSach} className="book-img" />
                                            )}
                                        </td>
                                        <td className="tenSach">{book.tenSach}</td>
                                        <td>{book.ngayMuon}</td>
                                        <td>{book.ngayTraDuKien}</td>
                                        <td>
                                            {book.ngayTraThucTe ? (
                                                <p className="text-success">
                                                    <CheckIcon /> Đã trả ({book.ngayTraThucTe})
                                                </p>
                                            ) : (
                                                <>
                                                    {book.tinhTrang === 'late' && (
                                                        <p className="text-danger">Đã quá hạn mượn sách!</p>
                                                    )}
                                                </>
                                            )}
                                        </td>
                                        <td>
                                            {book.ngayTraThucTe ? (
                                                book.tinhTrang !== 'returned' && book.tienPhat > 0 && (
                                                    <>
                                                        {paymentStatus[book.id] ? (
                                                            <p className="text-success">
                                                                <i className="bi bi-check"></i> Đã trả tiền phạt: {book.tienPhat} VNĐ
                                                            </p>
                                                        ) : (
                                                            <>
                                                                <p className="bg-warning text-light">
                                                                    Phí phạt: {book.tienPhat} VND
                                                                </p>
                                                                <button
                                                                    className="btn btn-success btn-thanhtoan"
                                                                    onClick={() => {
                                                                        openPaymentModal(book);
                                                                        handlePaymentSuccess(book.id);
                                                                    }}
                                                                >
                                                                    Thanh toán tiền phạt
                                                                </button>
                                                            </>
                                                        )}
                                                    </>
                                                )
                                            ) : (
                                                <button
                                                    className="btn btn-warning btn-thanhtoan"
                                                    onClick={() => returnBook(book.id)}
                                                >
                                                    Trả sách
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6">Không có sách đã mượn.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Modal show={showPaymentModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Chọn phương thức thanh toán</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Button className="payment-button momo" onClick={() => handleThanhToanMomo(selectedBook)}>
                            <img src="images/momo.png" alt="Momo" />
                            Thanh toán Momo
                        </Button>
                        <Button className="payment-button zalo" onClick={() => handleThanhToanZalopay(selectedBook)}>
                            <img src="images/zalopay.png" alt="Zalopay" />
                            Thanh toán Zalopay
                        </Button>
                        <Button className="payment-button money" onClick={() => navigate('/profile')}>
                            <img src="images/tienmat.png" alt="Tienmat" />
                            Thanh toán tiền mặt
                        </Button>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={handleCloseModal}>
                            Đóng
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showChangePasswordModal} onHide={closeChangePasswordModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Đổi Mật Khẩu</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleChangePassword}>
                            <Form.Group controlId="formOldPassword">
                                <Form.Label>Mật khẩu cũ</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Nhập mật khẩu cũ"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formNewPassword">
                                <Form.Label>Mật khẩu mới</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Nhập mật khẩu mới"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit">Đổi mật khẩu</Button>
                        </Form>
                    </Modal.Body>
                </Modal>

            </div>
            <Footer />
        </>
    );
};

export default Profile;
