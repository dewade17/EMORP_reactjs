import { notification, Layout, Button, Typography, Form, Input } from 'antd';
import logogame from '../../assets/images/logogame2.png';
import cardBackground from '../../assets/images/card.png';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendData } from '../../utils/api';

const { Title, Link } = Typography;
const { Content } = Layout;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const showAlert = (status, title, description) => {
    api[status]({
      message: title,
      description: description,
    });
  };

  const handleRegister = async () => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);

    try {
      const response = await sendData('register', formData);

      // Adjust the success check based on your actual response structure
      if (response.user) {
        // Assuming 'user' indicates a successful registration
        showAlert('success', 'Register Successful', response.message || 'Your account has been created successfully!');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        showAlert('error', 'Registration Failed', response.message || 'An error occurred during registration.');
      }
    } catch (error) {
      let errorMessage;

      if (error.response) {
        errorMessage = error.response?.data?.message || 'Server error. Please try again later.';
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else {
        errorMessage = error.message || 'An unexpected error occurred.';
      }

      showAlert('error', 'Registration Failed', errorMessage);
    }
  };

  return (
    <Layout
      style={{
        backgroundColor: '#051c82',
        height: '150vh',
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
          {contextHolder}
          <div style={{ flex: 1, paddingRight: '20px' }}>
            <Title style={{ textAlign: 'center', marginBottom: '20px' }}>Register</Title>
            <Title
              level={5}
              style={{ textAlign: 'center', marginBottom: '20px' }}
            >
              Enter your details to create an account
            </Title>
            <Form
              onFinish={handleRegister}
              layout='vertical'
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <Form.Item
                label='Username'
                name='name'
                rules={[
                  {
                    required: true,
                    message: 'Please input your name!',
                  },
                ]}
              >
                <Input
                  placeholder='Username'
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Item>

              <Form.Item
                label='Email'
                name='email'
                rules={[
                  {
                    required: true,
                    message: 'Please input your email!',
                  },
                ]}
              >
                <Input
                  placeholder='Email'
                  onChange={(e) => setEmail(e.target.value)}
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

              <Form.Item>
                <Button
                  type='primary'
                  htmlType='submit'
                  style={{ width: '100%' }}
                  disabled={!username || !email || !password}
                >
                  REGISTER
                </Button>
              </Form.Item>
            </Form>
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <Typography.Text>
                Already have an account?{' '}
                <Link
                  onClick={() => navigate('/login')}
                  style={{ color: '#ADD8E6' }}
                >
                  Login here
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

export default RegisterPage;
