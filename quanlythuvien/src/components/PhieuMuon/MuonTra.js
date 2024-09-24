import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import { authApi, endpoints } from '../../configs/API';
import MainLayout from '../../components/Navbar/MainLayout';
import Footer from '../../components/Footer/Footer';
import CheckIcon from '@mui/icons-material/Check';
import './MuonTra.css';

const MuonTra = () => {
    const api = authApi();

    const [chiTietPhieuMuons, setChiTietPhieuMuons] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedChiTiet, setSelectedChiTiet] = useState(null);
    const [errors, setErrors] = useState({}); // For validation errors

    useEffect(() => {
        const fetchChiTietPhieuMuons = async () => {
            try {
                const response = await api.get(endpoints.chiTietPhieuMuon); // Fetch all loan slip details
                console.log(response.data);  // Check the fetched data
                setChiTietPhieuMuons(response.data);
            } catch (error) {
                console.error('Error fetching loan slip details:', error.response?.data || error.message);
            }
        };
        fetchChiTietPhieuMuons();
    }, []); // Ensure the effect runs only once

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // Reset errors

        try {
            if (selectedChiTiet.id) {
                await api.patch(endpoints.updateChiTietPhieuMuon(selectedChiTiet.id), selectedChiTiet);
            }

            // Refresh loan slip details
            const response = await api.get(endpoints.chiTietPhieuMuon);
            setChiTietPhieuMuons(response.data);

            setShowModal(false); // Close the modal
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

            <Table bordered hover responsive className="table-chi-tiet">
                <thead>
                    <tr>
                        <th>Mã người mượn</th>
                        <th>Người mượn</th>
                        <th>Mã phiếu</th>
                        <th>Mã sách</th>
                        <th>Tên Sách</th>
                        <th>Tình Trạng</th>
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
                                        'Quá hạn trả'
                                    ) : (
                                        'Đang mượn'
                                    )}
                                </td>
                                <td>{chiTiet.ngayTraThucTe ? chiTiet.ngayTraThucTe : 'Chưa trả'}</td>
                                <td>{chiTiet.tienPhat ? `${chiTiet.tienPhat} VNĐ` : '___'}</td>
                                <td>
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
                            <td colSpan="5" className="text-center">Không có chi tiết phiếu mượn nào</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Modal for Editing Loan Slip Details */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Chỉnh sửa chi tiết phiếu mượn</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEditSubmit}>
                        <Form.Group controlId="tinhTrang">
                            <Form.Label>Tình Trạng</Form.Label>
                            <Form.Control
                                as="select"
                                value={selectedChiTiet?.tinhTrang || ''}
                                onChange={(e) => setSelectedChiTiet({ ...selectedChiTiet, tinhTrang: e.target.value })}
                                required
                            >
                                <option value="borrowed">Đang mượn</option>
                                <option value="returned">Đã trả</option>
                                <option value="late">Trễ hạn</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="ngayTraThucTe">
                            <Form.Label>Ngày Trả Thực Tế</Form.Label>
                            <Form.Control
                                type="date"
                                value={selectedChiTiet?.ngayTraThucTe || ''}
                                onChange={(e) => setSelectedChiTiet({ ...selectedChiTiet, ngayTraThucTe: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group controlId="tienPhat">
                            <Form.Label>Tiền Phạt</Form.Label>
                            <Form.Control
                                type="number"
                                value={selectedChiTiet?.tienPhat || ''}
                                onChange={(e) => setSelectedChiTiet({ ...selectedChiTiet, tienPhat: e.target.value })}
                            />
                        </Form.Group>

                        <Button type="submit" variant="primary">Lưu thay đổi</Button>
                    </Form>
                </Modal.Body>
            </Modal>
            <Footer />
        </>
    );
};

export default MuonTra;
