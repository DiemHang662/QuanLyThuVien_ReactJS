import React, { useState } from 'react';
import { Alert, Button, Form, InputGroup, FormControl } from 'react-bootstrap';
import { authApi } from '../../configs/API'; // Ensure correct export/import
import './Register.css';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Register = () => {
    const [first_name, setFirstname] = useState('');
    const [last_name, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState(null); // Initialize as null for file input
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [is_staff, setIsStaff] = useState(false);
    const [is_superuser, setIsSuperuser] = useState(false);
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [secureTextEntryConfirm, setSecureTextEntryConfirm] = useState(true);

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Lỗi', 'Mật khẩu không khớp');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('first_name', first_name);
            formData.append('last_name', last_name);
            formData.append('username', username);
            formData.append('phone', phone);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('is_staff', is_staff);
            formData.append('is_superuser', is_superuser);
            if (avatar) {
                formData.append('avatar', avatar);
            }

            const api = await authApi();

            const res = await api.post('/api/nguoidung/create-user/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Đăng ký thành công:', res.data);
            alert('Thành công', 'Tài khoản đã được tạo');

        } catch (error) {
            console.error('Đăng ký thất bại', error);
            alert('Xin lỗi', 'Bạn không được cấp quyền thực hiện');
        }
    };

    const handleChooseAvatar = (event) => {
        const file = event.target.files[0];
        if (file) {
            setAvatar(file);
        }
    };

    return (
        <div className="register-container">
            <div className="formContainer">
                <h1 className="title-register">ĐĂNG KÝ TÀI KHOẢN NGƯỜI DÙNG</h1>
                <Form onSubmit={handleRegister}>
                    <div className="form-rows">
                        <div className="column">
                            <Form.Group>
                                <Form.Label>Họ</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={first_name}
                                    onChange={e => setFirstname(e.target.value)}
                                    placeholder="Nhập họ"
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Tên</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={last_name}
                                    onChange={e => setLastname(e.target.value)}
                                    placeholder="Nhập tên"
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Số điện thoại</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    placeholder="Nhập số điện thoại"
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="Nhập email"
                                />
                            </Form.Group>
                        </div>
                        <div className="column">
                            <Form.Group>
                                <Form.Label>Tên tài khoản</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    placeholder="Nhập tên tài khoản"
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Avatar</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={handleChooseAvatar}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Mật khẩu</Form.Label>
                                <InputGroup>
                                    <FormControl
                                        type={secureTextEntry ? "password" : "text"}
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="Nhập mật khẩu"
                                    />
                                    <InputGroup.Text className="icon">
                                        <Button variant="link" onClick={() => setSecureTextEntry(!secureTextEntry)}>
                                            {secureTextEntry ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </Button>
                                    </InputGroup.Text>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Nhập lại mật khẩu</Form.Label>
                                <InputGroup>
                                    <FormControl
                                        type={secureTextEntryConfirm ? "password" : "text"}
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        placeholder="Nhập lại mật khẩu"
                                    />
                                    <InputGroup.Text className="icon">
                                        <Button variant="link" onClick={() => setSecureTextEntryConfirm(!secureTextEntryConfirm)}>
                                            {secureTextEntryConfirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </Button>
                                    </InputGroup.Text>
                                </InputGroup>
                            </Form.Group>
                        </div>
                    </div>
                    <Form.Group>
                        <Form.Check
                            type="checkbox"
                            label="Độc giả"
                            checked={is_staff}
                            onChange={() => setIsStaff(!is_staff)}
                        />
                
                    </Form.Group>
                    <Button className="submit" type="submit" variant="primary">
                        ĐĂNG KÝ
                    </Button>
                </Form>

            </div>
        </div>
    );
};

export default Register;