import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import API, { setAuthToken, endpoints } from '../../configs/API';
import { MyDispatchContext } from '../../configs/Contexts';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [userType, setUserType] = useState('regular'); // default is 'regular'
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useContext(MyDispatchContext);

  const login = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);
      formData.append('client_id', 'FxnuQqvjtDzeaaetcLscMJlSDjkES73duvXDPjeM');
      formData.append('client_secret', 'RtuLpv3nsgBAVql3ahvtnfoG761aeEmlWczBahLXeSucPrXHd992zrzzUK1vSibRE2wgkdxyGYHCHkG4U1ocT0ejWbtBVfRdKuuQdU1hx6rZlWNbXnGiVFBSbVHW3VG2');
      formData.append('grant_type', 'password');

      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };

      const res = await API.post(endpoints.login, formData, config);
      const token = res.data.access_token;
      console.log('Login successful, token:', token);
      setAuthToken(token);

      const user = await API.get(endpoints.currentUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.info(user.data);

      dispatch({
        type: 'login',
        payload: user.data,
      });

      // Check if user is of the expected type
      if ((userType === 'superuser' && !user.data.is_superuser) || (userType === 'regular' && user.data.is_superuser)) {
        setError('Đăng nhập không thành công');
        return;
      }

      navigate('/');
    } catch (ex) {
      console.error('Login error', ex);
      setError('Vui lòng nhập lại username hoặc password');
    }
  };

  return (
    <div className="background">
      <div className="container-login">
        <div className="formLogin">
          <h1 className="title">ĐĂNG NHẬP</h1>
          <Form>
            <Form.Group controlId="formBasicUserType">
              <Form.Select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className={`input ${isFocused ? 'focused' : ''}`}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              >
                <option value="regular">Độc giả</option>
                <option value="superuser">Nhân viên thư viện</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="formBasicUsername">
              <Form.Control
                type="text"
                placeholder="Tên đăng nhập..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
                autoComplete="username"
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword" className="position-relative">
              <Form.Control
                type={secureTextEntry ? 'password' : 'text'}
                placeholder="Mật khẩu..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                autoComplete="current-password"
              />
              <Button
                variant="link"
                className="password-toggle"
                onClick={() => setSecureTextEntry(!secureTextEntry)}
              >
                {secureTextEntry ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </Button>
            </Form.Group>
            {error && (
              <Alert variant="danger" style={{ width: '95%', margin: '10px 20px', height: '60px' }}>
                {error}
              </Alert>
            )}
            <Button variant="success" onClick={login} className="loginBtn">
              ĐĂNG NHẬP
            </Button>

            <div className="register-contain">
              <p>Bạn chưa có tài khoản ?</p>
              <Button variant="success" onClick={() => navigate('/dangki')} className="registerBtn">
                ĐĂNG KÝ
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
