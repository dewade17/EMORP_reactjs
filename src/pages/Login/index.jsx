import { notification, Layout, Button, Typography, Form, Input } from 'antd';
import logogame from '../../assets/images/logogame2.png';
import cardBackground from '../../assets/images/card.png';
import { useContext, useState } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { sendData } from '../../utils/api';

const { Title, Link } = Typography;
const { Content } = Layout;

const LoginPage = () => {
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { login, isLoggedIn } = useContext(AuthContext);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  const showAlert = (status, title, description) => {
    api[status]({
      message: title,
      description: description,
    });
  };

  const handleLogin = async () => {
    let formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    try {
      const resp = await sendData('login', formData);
      if (resp?.access_token) {
        login(resp?.access_token);
        localStorage.setItem('user_id', resp.user.id);
        showAlert('success', 'Login Successful', 'You have logged in successfully.');
        // setTimeout(() => navigate('/dashboard-customer'), 2000); // Redirect to a dashboard or other protected route
      } else if (resp?.error) {
        setIsUnauthorized(true);
        showAlert('error', 'Login Failed', resp.error || 'Invalid username or password.');
      } else {
        setIsUnauthorized(true);
        showAlert('error', 'Login Failed', 'Unexpected response from the server.');
      }
    } catch (err) {
      console.error('Error during login:', err);
      setIsUnauthorized(true);
      showAlert('error', 'Login Failed', 'An error occurred during login. Please try again.');
    }
  };

  return (
    <Layout
      style={{
        backgroundColor: '#051c82',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Content
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            backgroundImage: `url(${cardBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '10px',
            padding: '40px',
            maxWidth: '800px',
            width: '100%',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          }}
        >
          <div style={{ flex: 1, paddingRight: '20px' }}>
            <Title style={{ textAlign: 'center', marginBottom: '20px' }}>Login</Title>
            <Title
              level={5}
              style={{ textAlign: 'center', marginBottom: '20px' }}
            >
              Enter your email and password to Login
            </Title>
            <Form
              onFinish={handleLogin}
              layout='vertical'
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <Form.Item
                label='Username'
                name='email'
                rules={[
                  {
                    required: true,
                    message: 'Please input your Username!',
                  },
                ]}
              >
                <Input
                  placeholder='Username'
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Item>

              <Form.Item
                label='Password'
                name='password'
                rules={[
                  {
                    required: true,
                    message: 'Please input your password!',
                  },
                ]}
              >
                <Input.Password
                  placeholder='Password'
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Item>
              {contextHolder}
              <Form.Item>
                <Button
                  type='primary'
                  htmlType='submit'
                  style={{ width: '100%' }}
                  disabled={!username || !password}
                >
                  LOGIN
                </Button>
              </Form.Item>
            </Form>
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <Typography.Text>
                Don't have an account?{' '}
                <Link
                  onClick={() => navigate('/register')}
                  style={{ color: '#ADD8E6' }}
                >
                  Register here
                </Link>
              </Typography.Text>
            </div>
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <Typography.Text>
                Forgot your password?{' '}
                <Link
                  onClick={() => navigate('/reset-password')}
                  style={{ color: '#ADD8E6' }}
                >
                  Click here
                </Link>
              </Typography.Text>
            </div>
          </div>
          <div
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <img
              src={logogame}
              alt='Game Logo'
              style={{ width: '80%', height: 'auto' }}
            />
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default LoginPage;
