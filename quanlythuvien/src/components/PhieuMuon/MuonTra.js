import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Alert, Image } from 'react-bootstrap';
import { authApi, endpoints } from '../../configs/API';
import MainLayout from '../../components/Navbar/MainLayout';
import Footer from '../../components/Footer/Footer';
import CheckIcon from '@mui/icons-material/Check';
import InfoIcon from '@mui/icons-material/Info';
import './MuonTra.css';

const MuonTra = () => {
    const api = authApi();

    const [chiTietPhieuMuons, setChiTietPhieuMuons] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [books, setBooks] = useState([]);
    const [users, setUsers] = useState([]);
    const [loanSlips, setLoanSlips] = useState([]);
    const [selectedChiTiet, setSelectedChiTiet] = useState(null);
    const [selectedBookId, setSelectedBookId] = useState('');
    const [selectedUserId, setSelectedUserId] = useState('');
    const [selectedLoanSlipId, setSelectedLoanSlipId] = useState('');
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [errors, setErrors] = useState({});
    const [fetchError, setFetchError] = useState('');

    useEffect(() => {
        const fetchChiTietPhieuMuons = async () => {
            try {
                const response = await api.get(endpoints.chiTietPhieuMuon);
                setChiTietPhieuMuons(response.data);
            } catch (error) {
                setFetchError('Error fetching loan slip details.');
                console.error('Error fetching loan slip details:', error.response?.data || error.message);
            }
        };
        fetchChiTietPhieuMuons();
    }, []);

    useEffect(() => {
        const fetchBooksAndUsers = async () => {
            try {
                const [booksResponse, usersResponse, loanSlipsResponse] = await Promise.all([
                    api.get(endpoints.sach), // Fetch books
                    api.get(endpoints.nguoidung), // Fetch users
                    api.get(endpoints.phieuMuon) // Fetch loan slips
                ]);
                setBooks(booksResponse.data);
                setUsers(usersResponse.data);
                setLoanSlips(loanSlipsResponse.data); // Set loan slips
            } catch (error) {
                console.error('Error fetching books, users, or loan slips:', error.response?.data || error.message);
            }
        };
        fetchBooksAndUsers();
    }, []);

    const handleCreateChiTietPhieuMuon = async (e) => {
        e.preventDefault();
        setErrors({});

        const newChiTiet = {
            phieuMuon: selectedLoanSlipId, // Use the selected loan slip
            sach: selectedBookId,
        };

        try {
            await api.post(endpoints.chiTietPhieuMuon, newChiTiet);
            const response = await api.get(endpoints.chiTietPhieuMuon);
            setChiTietPhieuMuons(response.data);
            setSelectedUserId('');
            setSelectedBookId('');
            setSelectedLoanSlipId(''); // Clear selected loan slip after creation
        } catch (error) {
            if (error.response && error.response.data) {
                setErrors(error.response.data);
                console.error('Error creating loan slip detail:', error.response.data);
            } else {
                console.error('Error creating loan slip detail:', error.message);
            }
        }
    };

    const fetchBorrowedBooks = async (userId) => {
        try {
            const response = await api.get(endpoints.borrowedBooks(userId));
            setBorrowedBooks(response.data);
            setShowModal(true);
            setSelectedChiTiet(null); // Clear selectedChiTiet to show borrowed books
        } catch (error) {
            setFetchError('Error fetching borrowed books.');
            console.error('Error fetching borrowed books:', error.response?.data || error.message);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        try {
            if (selectedChiTiet?.id) {
                await api.patch(endpoints.updateChiTietPhieuMuon(selectedChiTiet.id), selectedChiTiet);
            }

            const response = await api.get(endpoints.chiTietPhieuMuon);
            setChiTietPhieuMuons(response.data);
            setShowModal(false);
        } catch (error) {
            if (error.response && error.response.data) {
                setErrors(error.response.data);
                console.error('Error updating loan slip detail:', error.response.data);
            } else {
                console.error('Error updating loan slip detail:', error.message);
            }
        }
    };

    return (
        <>
            <MainLayout />
            <h1 className="title-list">Danh Sách Chi Tiết Phiếu Mượn</h1>

            {fetchError && <Alert variant="danger">{fetchError}</Alert>}

            <Form onSubmit={handleCreateChiTietPhieuMuon} className="create-ctpm-form">
                <div className="form-row">
                    <Form.Group controlId="phiếuMuốn">
                        <Form.Label>Phiếu Mượn</Form.Label>
                        <Form.Control
                            as="select"
                            value={selectedLoanSlipId}
                            onChange={(e) => setSelectedLoanSlipId(e.target.value)}
                            required
                        >
                            <option value="">Chọn phiếu mượn</option>
                            {loanSlips.map(loanSlip => (
                                <option key={loanSlip.id} value={loanSlip.id}>
                                    {loanSlip.id} - {loanSlip.first_name} {loanSlip.last_name} - {loanSlip.ngayMuon} - {loanSlip.ngayTraDuKien}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="docGia">
                        <Form.Label>Người Mượn</Form.Label>
                        <Form.Control
                            as="select"
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            required
                        >
                            <option value="">Chọn người mượn</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.first_name} {user.last_name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </div>

                <Form.Group controlId="sach">
                    <Form.Label>Sách</Form.Label>
                    <Form.Control
                        as="select"
                        value={selectedBookId}
                        onChange={(e) => setSelectedBookId(e.target.value)}
                        required
                    >
                        <option value="">Chọn sách</option>
                        {books.map(book => (
                            <option key={book.id} value={book.id}>
                                {book.tenSach}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>

                <Button type="submit" variant="primary" className="btn-submit">Mượn sách</Button>
            </Form>


            <Table bordered hover responsive className="table-chi-tiet">
                <thead>
                    <tr>
                        <th>Mã</th>
                        <th>Người mượn</th>
                        <th>Mã phiếu</th>
                        <th>Mã sách</th>
                        <th>Tên Sách</th>
                        <th>Tình Trạng</th>
                        <th>Ngày Mượn</th>
                        <th>Ngày Trả Thực Tế</th>
                        <th>Tiền Phạt</th>
                        <th>Tác Vụ</th>
                    </tr>
                </thead>
                <tbody>
                    {chiTietPhieuMuons.length > 0 ? (
                        chiTietPhieuMuons.map(chiTiet => (
                            <tr key={chiTiet.id}>
                                <td>{chiTiet.docGia_id}</td>
                                <td>{chiTiet.first_name} {chiTiet.last_name}</td>
                                <td>{chiTiet.phieuMuon_id}</td>
                                <td>{chiTiet.sach_id}</td>
                                <td>{chiTiet.tenSach}</td>
                                <td>
                                    {chiTiet.tinhTrang === 'returned' ? (
                                        <CheckIcon style={{ color: 'green' }} />
                                    ) : chiTiet.tinhTrang === 'late' ? (
                                        <span style={{ color: 'red' }}>Quá hạn trả</span>
                                    ) : (
                                        <span style={{ color: 'dodgerblue' }}>Đang mượn</span>
                                    )}
                                </td>
                                <td>{chiTiet.ngayMuon}</td>
                                <td>{chiTiet.ngayTraThucTe ? chiTiet.ngayTraThucTe : 'Chưa trả'}</td>
                                <td>{chiTiet.tienPhat ? `${chiTiet.tienPhat} VNĐ` : '___'}</td>
                                <td className="action-buttons-mt">
                                    <Button variant="primary" className="detail-mt" onClick={() => fetchBorrowedBooks(chiTiet.docGia_id)}>
                                        <InfoIcon />
                                    </Button>

                                    <Button
                                        variant="warning"
                                        onClick={() => {
                                            setSelectedChiTiet(chiTiet);
                                            setShowModal(true);
                                        }}
                                    >
                                        Sửa
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="10" className="text-center">Không có chi tiết phiếu mượn nào</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Modal for Editing Loan Slip Details or Viewing Borrowed Books */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedChiTiet ? 'Chỉnh sửa chi tiết phiếu mượn' : 'Sách đã mượn'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {Object.keys(errors).length > 0 && (
                        <Alert variant="danger">
                            {Object.values(errors).map((error, index) => (
                                <div key={index}>{error}</div>
                            ))}
                        </Alert>
                    )}
                    {selectedChiTiet ? (
                        <Form onSubmit={handleEditSubmit}>
                            <Form.Group controlId="tinhTrang">
                                <Form.Label>Tình Trạng</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={selectedChiTiet.tinhTrang}
                                    onChange={(e) => setSelectedChiTiet({ ...selectedChiTiet, tinhTrang: e.target.value })}
                                    required
                                >
                                    <option value="not returned">Chưa trả</option>
                                    <option value="returned">Đã trả</option>
                                    <option value="late">Quá hạn</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="ngayTraThucTe">
                                <Form.Label>Ngày Trả Thực Tế</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={selectedChiTiet.ngayTraThucTe?.split('T')[0] || ''}
                                    onChange={(e) => setSelectedChiTiet({ ...selectedChiTiet, ngayTraThucTe: e.target.value })}
                                />
                            </Form.Group>

                            <Button type="submit" variant="primary">Cập nhật</Button>
                        </Form>
                    ) : (
                        <Table bordered>
                            <thead>
                                <tr>
                                    <th>Mã Sách</th>
                                    <th>Tên Sách</th>
                                    <th>Tình Trạng</th>
                                    <th>Ngày Mượn</th>
                                    <th>Ngày Trả Thực Tế</th>
                                    <th>Tiền Phạt</th>
                                </tr>
                            </thead>
                            <tbody>
                                {borrowedBooks.length > 0 ? (
                                    borrowedBooks.map(book => (
                                        <tr key={book.sach_id}>
                                            <td>{book.sach_id}</td>
                                            <td>{book.tenSach}</td>
                                            <td>{book.tinhTrang}</td>
                                            <td>{book.ngayMuon}</td>
                                            <td>{book.ngayTraThucTe}</td>
                                            <td>{book.tienPhat}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center">Chưa mượn sách nào</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Đóng</Button>
                </Modal.Footer>
            </Modal>

            <Footer />
        </>
    );
};

export default MuonTra;
