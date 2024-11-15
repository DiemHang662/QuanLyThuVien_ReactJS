import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Alert } from 'react-bootstrap';
import { authApi, endpoints } from '../../configs/API';
import MainLayout from '../../components/Navbar/MainLayout';
import Footer from '../../components/Footer/Footer';
import CheckIcon from '@mui/icons-material/Check';
import InfoIcon from '@mui/icons-material/Info';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClearIcon from '@mui/icons-material/Clear';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import './MuonTra.css';

const MuonTra = () => {
    const api = authApi();
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [chiTietPhieuMuons, setChiTietPhieuMuons] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [books, setBooks] = useState([]);
    const [users, setUsers] = useState([]);
    const [loanSlips, setLoanSlips] = useState([]);
    const [selectedChiTiet, setSelectedChiTiet] = useState(null);
    const [selectedBookId, setSelectedBookId] = useState('');
    const [selectedBookTitle, setSelectedBookTitle] = useState('');
    const [selectedUserId, setSelectedUserId] = useState('');
    const [selectedLoanSlipId, setSelectedLoanSlipId] = useState('');
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [errors, setErrors] = useState({});
    const [fetchError, setFetchError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [filterMonth, setFilterMonth] = useState('');
    const [filterYear, setFilterYear] = useState('');
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

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
                    api.get(endpoints.sach),
                    api.get(endpoints.nguoidung),
                    api.get(endpoints.phieuMuon)
                ]);
                setBooks(booksResponse.data);
                setUsers(usersResponse.data);
                setLoanSlips(loanSlipsResponse.data);
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
            phieuMuon: selectedLoanSlipId,
            sach: selectedBookId,
        };

        try {
            await api.post(endpoints.chiTietPhieuMuon, newChiTiet);
            const response = await api.get(endpoints.chiTietPhieuMuon);
            setChiTietPhieuMuons(response.data);
            resetForm();
        } catch (error) {
            handleErrors(error);
        }
    };

    const fetchBorrowedBooks = async (userId) => {
        try {
            const response = await api.get(endpoints.borrowedBooks(userId));
            setBorrowedBooks(response.data);
            setShowModal(true);
            setSelectedChiTiet(null);
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
            handleErrors(error);
        }
    };


    const filterChiTietPhieuMuons = () => {
        return chiTietPhieuMuons.filter(chiTiet => {
            const fullName = `${chiTiet.first_name || ''} ${chiTiet.last_name || ''}`.toLowerCase();
            const loanSlipId = chiTiet.phieuMuon_id?.toString() || '';
            const bookTitle = chiTiet.sach?.tenSach?.toLowerCase() || '';

            const isStatusMatch = selectedStatus === 'all' ||
                (selectedStatus === 'borrowed' && chiTiet.tinhTrang === 'borrowed') ||
                (selectedStatus === 'returned' && chiTiet.tinhTrang === 'returned') ||
                (selectedStatus === 'paid' && chiTiet.tinhTrang === 'paid') ||
                (selectedStatus === 'late' && chiTiet.tinhTrang === 'late');

            const daTraTienPhat = chiTiet.daTraTienPhat;
            const ngayMuon = new Date(chiTiet.ngayMuon);
            const ngayTraThucTe = chiTiet.ngayTraThucTe ? new Date(chiTiet.ngayTraThucTe) : null;

            const isDateMatch = (() => {
                const selectedMonth = parseInt(filterMonth, 10);  
                const selectedYear = parseInt(filterYear, 10);    

                if (!filterMonth || !filterYear) return true;

                if (chiTiet.tinhTrang === 'borrowed' && chiTiet.ngayMuon) {
                    return ngayMuon.getMonth() + 1 === selectedMonth && ngayMuon.getFullYear() === selectedYear;
                }

                if (['returned', 'late'].includes(chiTiet.tinhTrang) && ngayTraThucTe) {
                    return ngayTraThucTe.getMonth() + 1 === selectedMonth && ngayTraThucTe.getFullYear() === selectedYear;
                }

                if (chiTiet.tinhTrang === 'paid' && daTraTienPhat === true) {
                    return ngayTraThucTe.getMonth() + 1 === selectedMonth && ngayTraThucTe.getFullYear() === selectedYear;
                }

                return false;  
            })();

            return (
                (fullName.includes(searchTerm.toLowerCase()) ||
                    loanSlipId.includes(searchTerm) ||
                    bookTitle.includes(searchTerm)) &&
                isStatusMatch &&
                isDateMatch
            );
        });
    };


    const resetForm = () => {
        setSelectedUserId('');
        setSelectedBookTitle('');
        setSelectedLoanSlipId('');
        setSearchTerm(''); 
        setSelectedStatus('all'); 
    };

    const handleErrors = (error) => {
        if (error.response && error.response.data) {
            setErrors(error.response.data);
            console.error('Error:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    };

    return (
        <>
            <MainLayout />

            {fetchError && <Alert variant="danger">{fetchError}</Alert>}

            <h1 className="title-list">Danh Sách Chi Tiết Phiếu Mượn</h1>

            <div className="status-filter">
                <div className="d-flex flex-wrap align-items-center">
                    <Form.Check
                        type="radio"
                        label="Tất cả"
                        name="status"
                        value="all"
                        checked={selectedStatus === 'all'}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="me-4"
                    />
                    <Form.Check
                        type="radio"
                        label="Đang mượn"
                        name="status"
                        value="borrowed"
                        checked={selectedStatus === 'borrowed'}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="me-4"
                    />
                    <Form.Check
                        type="radio"
                        label="Đã trả"
                        name="status"
                        value="returned"
                        checked={selectedStatus === 'returned'}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="me-4"
                    />
                    <Form.Check
                        type="radio"
                        label="Quá hạn"
                        name="status"
                        value="late"
                        checked={selectedStatus === 'late'}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="me-4"
                    />

                    <Form.Check
                        type="radio"
                        label="Đã trả phạt"
                        name="status"
                        value="paid"
                        checked={selectedStatus === 'paid'}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="me-4"
                    />

                    <Form.Group className="me-1 mb-0">
                        <InsertInvitationIcon />
                    </Form.Group>

                    <Form.Group className="me-4 mb-0">
                        <Form.Control
                            id="filterMonth"
                            as="select"
                            value={filterMonth}
                            onChange={(e) => setFilterMonth(e.target.value)}
                            className="form-select"
                            required
                        >
                            <option value="">Tháng</option>
                            <option value="1">Tháng 1</option>
                            <option value="2">Tháng 2</option>
                            <option value="3">Tháng 3</option>
                            <option value="4">Tháng 4</option>
                            <option value="5">Tháng 5</option>
                            <option value="6">Tháng 6</option>
                            <option value="7">Tháng 7</option>
                            <option value="8">Tháng 8</option>
                            <option value="9">Tháng 9</option>
                            <option value="10">Tháng 10</option>
                            <option value="11">Tháng 11</option>
                            <option value="12">Tháng 12</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group className=" me-1 mb-0">
                        <InsertInvitationIcon />
                    </Form.Group>

                    <Form.Group className="mb-0">
                        <Form.Control
                            id="filterYear"
                            as="select"
                            value={filterYear}
                            onChange={(e) => setFilterYear(e.target.value)}
                            className="form-select"
                            required
                        >
                            <option value="">Năm</option>
                            <option value="2024">2024</option>
                            <option value="2024">2023</option>
                            <option value="2024">2022</option>
                            <option value="2024">2021</option>

                        </Form.Control>
                    </Form.Group>
                </div>
            </div>


            <Form.Group controlId="search">
                <Form.Control className="search-ctpm"
                    type="text"
                    placeholder="Nhập tên độc giả, mã phiếu mượn..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </Form.Group>


            {/* <div className="form1-container">
                <Form.Group controlId="borrowDropdown">
                    <Button variant="primary" onClick={toggleDropdown}>
                        {isDropdownOpen ? <ArrowDropDownIcon /> : 'Cập nhật thông tin mượn sách'}
                    </Button>
                </Form.Group>

                {isDropdownOpen && (
                    <>
                        <Form onSubmit={handleCreateChiTietPhieuMuon} >
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

                            <div className="btn-container">
                                <Button type="submit" variant="primary" className="btn-submit">Mượn sách</Button>
                            </div>
                        </Form>
                    </>
                )}
            </div> */}


            <Table bordered hover responsive className="table-chi-tiet">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Người mượn</th>
                        <th>Mã phiếu</th>
                        <th>Tên Sách</th>
                        <th>Tình Trạng</th>
                        <th>Ngày Mượn</th>
                        <th>Ngày Trả Thực Tế</th>
                        <th>Phạt</th>
                        <th>Đã trả phạt</th>
                        <th>Tác Vụ</th>
                    </tr>
                </thead>
                <tbody>
                    {filterChiTietPhieuMuons().length > 0 ? (
                        filterChiTietPhieuMuons().map(chiTiet => (
                            <tr key={chiTiet.id}>
                                <td>{chiTiet.id}</td>
                                <td>{chiTiet.first_name} {chiTiet.last_name}</td>
                                <td>{chiTiet.phieuMuon_id}</td>
                                <td>{chiTiet.tenSach}</td>
                                <td>
                                    {chiTiet.tinhTrang === 'returned' ? (
                                        <CheckIcon style={{ color: 'green' }} />
                                    ) : chiTiet.tinhTrang === 'late' ? (
                                        <span style={{ color: 'red' }}>Quá hạn</span>
                                    ) :  chiTiet.tinhTrang === 'borrowed' ? (
                                        <span style={{ color: 'dodgerblue' }}>Đang mượn</span>
                                    ) : (
                                        <span style={{ color: '#473C8B' }}>Đã trả phạt</span>
                                    )}
                                </td>
                                <td>{chiTiet.ngayMuon}</td>
                                <td>{chiTiet.ngayTraThucTe || '___'}</td>
                                <td>{chiTiet.tienPhat ? `${chiTiet.tienPhat} VNĐ` : '___'}</td>
                                <td>
                                    {chiTiet.daTraTienPhat ? (
                                        <CheckIcon style={{ color: 'green' }} />  
                                    ) : (
                                        <span>___</span>
                                    )}
                                    </td>
                                <td className="action-buttons-mt">
                                    <Button variant="primary" onClick={() => fetchBorrowedBooks(chiTiet.docGia_id)}>
                                        <InfoIcon />
                                    </Button>
                                    <Button
                                        variant="warning"
                                        onClick={() => {
                                            setSelectedChiTiet(chiTiet);
                                            setShowModal(true);
                                        }}
                                    >
                                        <EditNoteIcon />
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

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{selectedChiTiet ? 'Cập nhật tình trạng mượn sách' : 'Sách đã mượn'}</Modal.Title>
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
                                    <option value="borrowed">Đang mượn</option>
                                    <option value="returned">Đã trả</option>
                                    <option value="late">Quá hạn</option>
                                    <option value="paid">Đã trả phạt</option>
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
                                {borrowedBooks.length > 0 && (
                                    <tr>
                                        <td colSpan="6" className="info-table">
                                            <p><strong>Mã người dùng:</strong> {borrowedBooks[0].id}</p>
                                            <p><strong>Họ và tên:</strong> {borrowedBooks[0].first_name} {borrowedBooks[0].last_name}</p>
                                            <p><strong>Số điện thoại:</strong> {borrowedBooks[0].phone}</p>
                                        </td>
                                    </tr>
                                )}
                                <tr>
                                    <th>Mã Sách</th>
                                    <th>Tên Sách</th>
                                    <th>Tình Trạng</th>
                                    <th>Ngày Mượn</th>
                                    <th>Ngày Trả Thực Tế</th>
                                    <th>Tiền Phạt</th>
                                    <th>Đã trả phạt</th>
                                </tr>
                            </thead>
                            <tbody>
                                {borrowedBooks.length > 0 ? (
                                    borrowedBooks.map(book => (
                                        <tr key={book.sach_id}>
                                            <td>{book.sach_id}</td>
                                            <td>{book.tenSach}</td>
                                            <td>
                                                {book.tinhTrang === 'returned' ? (
                                                    <CheckIcon style={{ color: 'green' }} />
                                                ) : book.tinhTrang === 'late' ? (
                                                    <span style={{ color: 'red' }}>Quá hạn</span>
                                                ) :  book.tinhTrang === 'borrowed' ? (
                                                    <span style={{ color: 'dodgerblue' }}>Đang mượn</span>
                                                ) : (
                                                    <span style={{ color: '#473C8B' }}>Đã trả phạt</span>
                                                )}
                                            </td>
                                            <td>{new Date(book.ngayMuon).toLocaleDateString()}</td>
                                            <td>{book.ngayTraThucTe ? new Date(book.ngayTraThucTe).toLocaleDateString() : '___'}</td>
                                            <td>{book.tienPhat}</td>
                                            <td>
                                                {book.daTraTienPhat ? (
                                                    <CheckIcon style={{ color: 'green' }} />  
                                                ) : (
                                                    <span>___</span>
                                                )}
                                            </td>
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
                    <Button variant="danger" onClick={() => setShowModal(false)}>Đóng</Button>
                </Modal.Footer>
            </Modal>

            <Footer />
        </>
    );
};

export default MuonTra;