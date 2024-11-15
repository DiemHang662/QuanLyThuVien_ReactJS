import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Table, ButtonGroup, Image, Modal } from 'react-bootstrap';
import MainLayout from '../../components/Navbar/MainLayout';
import Footer from '../../components/Footer/Footer';
import { authApi, endpoints } from '../../configs/API';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import './NguoiDungList.css';

const NguoiDungList = () => {
    const api = authApi();
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all'); // 'all', 'docgia', or 'superuser'
    const [editUser, setEditUser] = useState(null); // User being edited
    const [showEditModal, setShowEditModal] = useState(false); // Modal visibility
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get(endpoints.nguoidung);
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error.response?.data || error.message);
            }
        };

        fetchUsers();
    }, []);

    // Filter users based on search term and selected role
    const filteredUsers = users
        .filter(user =>
            (user.first_name + ' ' + user.last_name).toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter(user => {
            if (filterRole === 'superuser') return user.is_superuser;
            if (filterRole === 'docgia') return !user.is_superuser;
            return true;
        });

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa người này không?')) {
            try {
                await api.delete(endpoints.deleteUser(id));
                setUsers(users.filter(user => user.id !== id));
            } catch (error) {
                console.error('Error deleting user:', error.response?.data || error.message);
            }
        }
    };

    const handleLock = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn khóa tài khoản này không?')) {
            try {
                await api.post(endpoints.lockAccount(id));
                const response = await api.get(endpoints.nguoidung);
                setUsers(response.data);
            } catch (error) {
                console.error('Error locking user:', error);
            }
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (editUser) {
            try {
                const formData = new FormData();
                formData.append('first_name', editUser.first_name);
                formData.append('last_name', editUser.last_name);
                formData.append('username', editUser.username);
                formData.append('nam_sinh', editUser.nam_sinh);
                formData.append('phone', editUser.phone || '');
                formData.append('email', editUser.email || '');
                if (editUser.avatar) {
                    formData.append('avatar', editUser.avatar);
                }

                if (editUser.id) {
                    await api.patch(endpoints.updateUser(editUser.id), formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                } else {
                    await api.post(endpoints.createUser, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                }
                const response = await api.get(endpoints.nguoidung);
                setUsers(response.data);
                setShowEditModal(false);
                setEditUser(null);
            } catch (error) {
                console.error('Error saving user:', error.response?.data || error.message);
            }
        }
    };


    return (
        <>
            <MainLayout />

            <h1 className="title-list">DANH SÁCH NGƯỜI DÙNG</h1>

            <div className="container1">
                <Form className="filter-form1">
                    <Form.Group>
                        <Form.Control
                            type="text"
                            placeholder="Tìm kiếm người dùng"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '550px', marginLeft: '30px' }}
                        />
                    </Form.Group>
                    <Button
                        className="add-user-button"
                        onClick={() => navigate('/dangki')}
                        variant="success"
                    >
                        <AddIcon /> Thêm
                    </Button>
                </Form>

                {/* Filter Buttons for Role */}
                <ButtonGroup className="filter-role-buttons" style={{ marginTop: '20px' }}>
                    <Button
                        variant={filterRole === 'all' ? 'primary' : 'outline-primary'}
                        onClick={() => setFilterRole('all')}
                    >
                        Tất cả
                    </Button>
                    <Button
                        variant={filterRole === 'docgia' ? 'primary' : 'outline-primary'}
                        onClick={() => setFilterRole('docgia')}
                    >
                        Độc giả
                    </Button>
                    <Button
                        variant={filterRole === 'superuser' ? 'primary' : 'outline-primary'}
                        onClick={() => setFilterRole('superuser')}
                    >
                        Nhân viên
                    </Button>
                </ButtonGroup>

                <Table bordered hover responsive>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Ảnh đại diện</th>
                            <th>Họ và tên</th>
                            <th>Năm sinh</th>
                            <th>Tên tài khoản</th>
                            <th>Số điện thoại</th>
                            <th>Email</th>
                            <th>Vai trò</th>
                            <th>Tác vụ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>
                                    {user.avatar_url && <Image src={user.avatar_url} className="avatar-user" />}
                                </td>
                                <td>{user.first_name} {user.last_name}</td>
                                <td>{user.nam_sinh}</td>
                                <td>{user.username}</td>
                                <td>{user.phone || 'Chưa cập nhật'}</td>
                                <td>{user.email}</td>
                                <td>{user.is_superuser ? 'Nhân viên' : 'Độc giả'}</td>
                                <td className="action-buttons">
                                    {/* <Button
                                        variant="primary"
                                        className="user-button-primary"
                                        onClick={() => navigate(`/nguoidung/${user.id}`)}
                                    >
                                        <KeyboardDoubleArrowRightIcon />
                                    </Button> */}
                                    <Button
                                        variant="danger"
                                        className="user-button-danger"
                                        onClick={() => handleDelete(user.id)}
                                    >
                                        <DeleteIcon />
                                    </Button>
                                    <Button
                                        variant="warning"
                                        className="user-button-warning"
                                        onClick={() => {
                                            setEditUser(user);
                                            setShowEditModal(true);
                                        }}
                                    >
                                        <EditIcon />
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        className="user-button-secondary"
                                        onClick={() => handleLock(user.id)}
                                    >
                                        <LockIcon />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                {/* Edit User Modal */}
                <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>{editUser?.id ? 'Chỉnh sửa người dùng' : 'Thêm người dùng'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleEditSubmit}>
                            <div className="row">
                                <Form.Group controlId="first_name" className="col-md-6">
                                    <Form.Label>Họ</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={editUser?.first_name || ''}
                                        onChange={(e) => setEditUser({ ...editUser, first_name: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="last_name" className="col-md-6">
                                    <Form.Label>Tên</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={editUser?.last_name || ''}
                                        onChange={(e) => setEditUser({ ...editUser, last_name: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </div>
                            <div className="row">
                                <Form.Group controlId="nam_sinh" className="col-md-6">
                                    <Form.Label>Năm sinh</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={editUser?.nam_sinh || ''}
                                        onChange={(e) => setEditUser({ ...editUser, nam_sinh: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="username" className="col-md-6">
                                    <Form.Label>Tên tài khoản</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={editUser?.username || ''}
                                        onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </div>
                            <div className="row">
                                <Form.Group controlId="phone" className="col-md-6">
                                    <Form.Label>Số điện thoại</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={editUser?.phone || ''}
                                        onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group controlId="email" className="col-md-6">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={editUser?.email || ''}
                                        onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </div>
                            <div className="row">
                                <Form.Group controlId="avatar" className="col-md-6">
                                    <Form.Label>Ảnh đại diện</Form.Label>
                                    <Form.Control
                                        type="file"
                                        onChange={(e) => setEditUser({ ...editUser, avatar: e.target.files[0] })}
                                        accept="image/*"
                                    />
                                    {editUser?.avatar_url && (
                                        <div>
                                            <Image src={editUser.avatar_url} className="avatar-preview avt" thumbnail />
                                        </div>
                                    )}
                                </Form.Group>
                                <Form.Group controlId="is_superuser" className="col-md-6">
                                    <Form.Check
                                        type="checkbox"
                                        label="Quản trị viên"
                                        checked={editUser?.is_superuser || false}
                                        onChange={(e) => setEditUser({ ...editUser, is_superuser: e.target.checked })}
                                    />
                                </Form.Group>
                            </div>
                            <Button type="submit" variant="primary">
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

export default NguoiDungList;
