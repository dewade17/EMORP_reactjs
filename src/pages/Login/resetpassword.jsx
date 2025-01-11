import { notification, Layout, Button, Typography, Form, Input } from 'antd';
import logogame from '../../assets/images/logogame2.png';
import cardBackground from '../../assets/images/card.png';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendData } from '../../utils/api';

const { Title, Link } = Typography;
const { Content } = Layout;

const Resetpassword = () => {
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();

  const [email, setEmail] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [timer, setTimer] = useState(0);

  const showAlert = (status, title, description) => {
    console.log('Alert parameters:', { status, title, description });
    api[status]({
      message: title,
      description: description || 'An unexpected error occurred. Please try again.',
    });
  };

  const handleresetPassword = async (values) => {
    const formData = new FormData();
    formData.append('reset_token', values.token);
    formData.append('password', values.password);
    formData.append('password_confirmation', values.password_confirmation);

    try {
      const response = await sendData('password/reset', formData);

      // Adjust the condition based on the actual response structure
      if (response.status === 'success' || response.message === 'Password reset successfully') {
        showAlert('success', 'Password Reset Successful', 'Your password has been reset successfully!');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        showAlert('error', 'Password Reset Failed', response.message || 'An error occurred during password reset.');
      }
    } catch (error) {
      handleError(error, 'Password Reset Failed');
    }
  };

  const handleGetToken = async (values) => {
    const formData = new FormData();
    formData.append('email', values.email);

    try {
      const response = await sendData('password/reset/request', formData);

      // Assuming a successful response might not contain 'status' as 'success'
      if (response.message === 'Reset token sent to your email') {
        showAlert('success', 'Reset Token Sent', response.message);
        setIsButtonDisabled(true);
        setTimer(30); // Set timer for 30 seconds
      } else {
        showAlert('error', 'Error Sending Token', response.message || 'An error occurred while sending the token.');
      }
    } catch (error) {
      handleError(error, 'Error Sending Token');
    }
  };

  const handleError = (error, defaultTitle) => {
    let errorMessage;

    if (error.response) {
      // Server error
      errorMessage = error.response?.data?.message || 'Server error. Please try again later.';
    } else if (error.request) {
      // Network error
      errorMessage = 'Network error. Please check your connection and try again.';
    } else {
      // Other errors
      errorMessage = error.message || 'An unexpected error occurred.';
    }

    showAlert('error', defaultTitle, errorMessage);
  };

  useEffect(() => {
    if (isButtonDisabled && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else if (timer === 0 && isButtonDisabled) {
      setIsButtonDisabled(false);
    }
  }, [isButtonDisabled, timer]);

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
      {contextHolder}
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
            <Title style={{ textAlign: 'center', marginBottom: '20px' }}>Forgot Password</Title>
            <Title
              level={5}
              style={{ textAlign: 'center', marginBottom: '20px' }}
            >
              We'll send you a verification token to your email
            </Title>
            <Form
              onFinish={handleGetToken}
              layout='vertical'
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <Form.Item
                label='Email'
                name='email'
                rules={[
                  {
                    required: true,
                    message: 'Please input your email!',
                  },
                  {
                    type: 'email',
                    message: 'Please enter a valid email address!',
                  },
                ]}
              >
                <Input
                  placeholder='Email'
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type='primary'
                  htmlType='submit'
                  style={{ width: '100%' }}
                  disabled={isButtonDisabled}
                >
                  {isButtonDisabled ? `Retry in ${timer}s` : 'Send Verification Email'}
                </Button>
              </Form.Item>
            </Form>
            <Form
              onFinish={handleresetPassword}
              layout='vertical'
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <Form.Item
                label='Token'
                name='token'
                rules={[{ required: true, message: 'Please input your token!' }]}
              >
                <Input placeholder='126738' />
              </Form.Item>
              <Form.Item
                label='New Password'
                name='password'
                rules={[{ required: true, message: 'Please input your new password!' }]}
              >
                <Input.Password placeholder='New Password' />
              </Form.Item>
              <Form.Item
                label='Confirm Password'
                name='password_confirmation'
                rules={[{ required: true, message: 'Please input your new password again!' }]}
              >
                <Input.Password placeholder='Confirm Password' />
              </Form.Item>
              <Form.Item>
                <Button
                  type='primary'
                  htmlType='submit'
                  style={{ width: '100%' }}
                >
                  Reset Password
                </Button>
              </Form.Item>
            </Form>
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <Link
                onClick={() => navigate('/login')}
                style={{ color: '#ADD8E6' }}
              >
                Back to Login
              </Link>
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

export default Resetpassword;
