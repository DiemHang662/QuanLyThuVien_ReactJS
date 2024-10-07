import React, { useState, useEffect } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import MainLayout from '../../components/Navbar/MainLayout';
import Footer from '../../components/Footer/Footer';
import { authApi, endpoints } from '../../configs/API';
import './PhieuMuon.css';

const PhieuMuon = () => {
    const api = authApi();
    const [phieuMuons, setPhieuMuons] = useState([]);
    const [docGias, setDocGias] = useState([]);
    const [editPhieuMuon, setEditPhieuMuon] = useState({
        docGia: '',
        ngayMuon: new Date().toISOString().split('T')[0], // Today's date
        ngayTraDuKien: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0] // 14 days from today
    });
    const [errors, setErrors] = useState({});
    const [showAlert, setShowAlert] = useState(false); // State for alert visibility

    useEffect(() => {
        const fetchPhieuMuons = async () => {
            try {
                const response = await api.get(endpoints.phieuMuon);
                setPhieuMuons(response.data);
            } catch (error) {
                console.error('Error fetching loan slips:', error.response?.data || error.message);
            }
        };

        fetchPhieuMuons();
    }, []);

    useEffect(() => {
        const fetchDocGias = async () => {
            try {
                const response = await api.get(endpoints.nguoidung);
                setDocGias(response.data);
            } catch (error) {
                console.error('Error fetching readers:', error.response?.data || error.message);
            }
        };

        fetchDocGias();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post(endpoints.createPhieuMuon, editPhieuMuon);
            console.log('Response:', response); // Log the complete response object
            
            // Check if the response is a successful creation
            if (response.status === 201) {
                const newPhieuMuon = response.data; // Ensure this is where your created record is returned
                setPhieuMuons((prev) => [...prev, newPhieuMuon]); // Update state immediately
                setEditPhieuMuon({
                    docGia: '',
                    ngayMuon: new Date().toISOString().split('T')[0],
                    ngayTraDuKien: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0]
                });
                setShowAlert('Đã tạo thành công!'); // Show success alert
                setTimeout(() => setShowAlert(false), 3000); // Hide alert after 3 seconds
            } else {
                console.error('Error creating borrowing record:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error creating borrowing record:', error); // Handle network errors
        }
    };
    

    return (
        <>
            <MainLayout />
            <h1 className="title-list">ĐĂNG KÝ THÔNG TIN MƯỢN SÁCH</h1>
            <div className="container2">
                <Form className="add-pm-form" onSubmit={handleSubmit}>
                    <Form.Group controlId="docGia">
                        <Form.Label>Mã người dùng</Form.Label>
                        <Form.Control
                            type="text"
                            value={editPhieuMuon?.docGia || ''}
                            onChange={(e) => setEditPhieuMuon({ ...editPhieuMuon, docGia: e.target.value })}
                            required
                        />
                        {errors.docGia && <small className="text-danger">{errors.docGia}</small>}
                    </Form.Group>

                    <Form.Group controlId="ngayMuon">
                        <Form.Label>Ngày Mượn</Form.Label>
                        <Form.Control
                            type="date"
                            value={editPhieuMuon?.ngayMuon || ''}
                            onChange={(e) => setEditPhieuMuon({ ...editPhieuMuon, ngayMuon: e.target.value })}
                            required
                        />
                        {errors.ngayMuon && <small className="text-danger">{errors.ngayMuon}</small>}
                    </Form.Group>
                    <Form.Group controlId="ngayTraDuKien">
                        <Form.Label>Ngày Trả Dự Kiến</Form.Label>
                        <Form.Control
                            type="date"
                            value={editPhieuMuon?.ngayTraDuKien || ''}
                            onChange={(e) => setEditPhieuMuon({ ...editPhieuMuon, ngayTraDuKien: e.target.value })}
                            required
                        />
                        {errors.ngayTraDuKien && <small className="text-danger">{errors.ngayTraDuKien}</small>}
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Lưu Phiếu Mượn
                    </Button>
                </Form>

                {/* Display List of Loan Slips */}
                <div className="phieu-muon-list">
                    <h2 className="title-list">THÔNG TIN CÁC PHIẾU ĐÃ ĐĂNG KÝ</h2>
                    {phieuMuons.length === 0 ? (
                        <p>Chưa có phiếu mượn nào.</p>
                    ) : (
                        <ul>
                            {phieuMuons.map((pm, index) => (
                                <li key={index}>
                                    <p><strong>Mã độc Giả:</strong> {pm.docGia}</p>
                                    <p><strong>Ngày Mượn:</strong> {pm.ngayMuon}</p>
                                    <p><strong>Ngày Trả Dự Kiến:</strong> {pm.ngayTraDuKien}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
};

export default PhieuMuon;
