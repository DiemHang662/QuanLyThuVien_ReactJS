import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Table, Modal } from 'react-bootstrap';
import MainLayout from '../../components/Navbar/MainLayout';
import Footer from '../../components/Footer/Footer';
import { authApi, endpoints } from '../../configs/API'; 
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './PhieuMuonList.css'; 
const PhieuMuonList = () => {
    const api = authApi();
    const navigate = useNavigate();

    const [phieuMuons, setPhieuMuons] = useState([]); 
    const [docGias, setDocGias] = useState([]); 
    const [searchTerm, setSearchTerm] = useState('');
    const [editPhieuMuon, setEditPhieuMuon] = useState(null); 
    const [showEditModal, setShowEditModal] = useState(false); 
    const [errors, setErrors] = useState({}); 

    useEffect(() => {
        const fetchPhieuMuons = async () => {
            try {
                const response = await api.get(endpoints.phieuMuon);
                console.log(response.data); // Add this line to inspect the response
                setPhieuMuons(response.data);
            } catch (error) {
                console.error('Error fetching loan slips:', error.response?.data || error.message);
            }
        };
    
        fetchPhieuMuons();
    }, []);
    
    const filteredPhieuMuons = phieuMuons.filter((phieuMuon) => {
        const readerName = `${phieuMuon.first_name} ${phieuMuon.last_name}`.toLowerCase();
        return readerName.includes(searchTerm.toLowerCase());
    });
   
    useEffect(() => {
        const fetchDocGias = async () => {
            try {
                const response = await api.get(endpoints.nguoidung); // Adjust API endpoint accordingly
                setDocGias(response.data);
            } catch (error) {
                console.error('Error fetching readers:', error.response?.data || error.message);
            }
        };

        fetchDocGias();
    }, []);

    

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa phiếu mượn này không?')) {
            try {
                await api.delete(endpoints.deletePhieuMuon(id));
                setPhieuMuons(phieuMuons.filter(phieuMuon => phieuMuon.id !== id));
            } catch (error) {
                console.error('Error deleting loan slip:', error.response?.data || error.message);
            }
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // Reset errors

        if (editPhieuMuon) {
            try {
                const formData = {
                    docGia: editPhieuMuon.docGia,
                    ngayMuon: editPhieuMuon.ngayMuon,
                    ngayTraDuKien: editPhieuMuon.ngayTraDuKien,
                };

                let response;
                if (editPhieuMuon.id) {
                    response = await api.patch(endpoints.updatePhieuMuon(editPhieuMuon.id), formData);
                } else {
                    response = await api.post(endpoints.createPhieuMuon, formData);
                }

                // Refresh loan slips list
                const phieuMuonsResponse = await api.get(endpoints.phieuMuon);
                setPhieuMuons(phieuMuonsResponse.data);

                // Close the modal and reset editPhieuMuon
                setShowEditModal(false);
                setEditPhieuMuon(null);
            } catch (error) {
                if (error.response && error.response.data) {
                    setErrors(error.response.data);
                    console.error('Error saving loan slip:', error.response.data);
                } else {
                    console.error('Error saving loan slip:', error.message);
                }
            }
        }
    };

    const handleAddPhieuMuon = () => {
        setEditPhieuMuon({
            docGia: '',
            ngayMuon: '',
            ngayTraDuKien: '',
        });
        setShowEditModal(true);
    };

    return (
        <>
            <MainLayout />
            <h1 className="title-list">DANH SÁCH PHIẾU MƯỢN</h1>

            <div className="container1">
                <Form className="filter-form1">
                    <Form.Group>
                        <Form.Control
                            type="text"
                            placeholder=" Tìm kiếm độc giả..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '550px', marginLeft: '30px' }}
                        />
                    </Form.Group>
                    <Button
                        className="add-pm-button"
                        onClick={handleAddPhieuMuon}
                        variant="success"
                    >
                        <AddIcon /> Thêm
                    </Button>
                </Form>

                <Table bordered hover responsive className="table-pm">
                    <thead>
                        <tr>
                            <th>Độc giả</th>
                            <th>Ngày mượn</th>
                            <th>Ngày trả dự kiến</th>
                            <th>Tác vụ</th>
                        </tr>
                    </thead>
                    <tbody>
                    {filteredPhieuMuons.length > 0 ? (
                            filteredPhieuMuons.map(phieuMuon => (
                                <tr key={phieuMuon.id}>
                                    <td>{phieuMuon.first_name} {phieuMuon.last_name}</td>
                                    <td>{phieuMuon.ngayMuon}</td>
                                    <td>{phieuMuon.ngayTraDuKien}</td>
                                    <td className="action-buttons-pm">
                                        <Button
                                            variant="warning"
                                            className="pm-button-warning"
                                            onClick={() => {
                                                setEditPhieuMuon(phieuMuon);
                                                setShowEditModal(true);
                                            }}
                                        >
                                            <EditIcon />
                                        </Button>
                                        <Button
                                            variant="danger"
                                            className="pm-button-danger"
                                            onClick={() => handleDelete(phieuMuon.id)}
                                        >
                                            <DeleteIcon />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center">Không có phiếu mượn nào</td>
                            </tr>
                        )}
                    </tbody>
                </Table>

                {/* Edit Loan Slip Modal */}
                <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editPhieuMuon?.id ? 'Chỉnh sửa phiếu mượn' : 'Thêm phiếu mượn'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleEditSubmit}>
                            <Form.Group controlId="docGia">
                                <Form.Label>Độc giả</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={editPhieuMuon?.docGia || ''}
                                    onChange={(e) => setEditPhieuMuon({ ...editPhieuMuon, docGia: e.target.value })}
                                    isInvalid={!!errors.docGia}
                                    required
                                >
                                    <option value="">Chọn độc giả</option>
                                    {docGias.map((docGia) => (
                                        <option key={docGia.id} value={docGia.id}>
                                            {docGia.first_name} {docGia.last_name} (ID: {docGia.id})
                                        </option>
                                    ))}
                                </Form.Control>
                                <Form.Control.Feedback type="invalid">
                                    {errors.docGia && errors.docGia.join(', ')}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="ngayMuon">
                                <Form.Label>Ngày mượn</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={editPhieuMuon?.ngayMuon || ''}
                                    onChange={(e) => setEditPhieuMuon({ ...editPhieuMuon, ngayMuon: e.target.value })}
                                    isInvalid={!!errors.ngayMuon}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.ngayMuon && errors.ngayMuon.join(', ')}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="ngayTraDuKien">
                                <Form.Label>Ngày trả dự kiến</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={editPhieuMuon?.ngayTraDuKien || ''}
                                    onChange={(e) => setEditPhieuMuon({ ...editPhieuMuon, ngayTraDuKien: e.target.value })}
                                    isInvalid={!!errors.ngayTraDuKien}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.ngayTraDuKien && errors.ngayTraDuKien.join(', ')}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Button type="submit" variant="primary">
                                {editPhieuMuon?.id ? 'Lưu thay đổi' : 'Thêm phiếu mượn'}
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </div>

            <Footer />
        </>
    );
};

export default PhieuMuonList;
