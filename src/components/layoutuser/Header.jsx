import { useState, useEffect } from 'react';
import { Button, Typography, Avatar } from 'antd';
import { LoginOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import logogame from '../../assets/images/logogame.png';
import { jwtStorage } from '../../utils/jwt_storage';

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;

  .logo-section {
    display: flex;
    align-items: center;

    .logo-image {
      width: 40px;
      height: 40px;
      margin-right: 10px;
    }

    .welcome-text {
      font-size: 18px;
      font-weight: bold;
      margin: 0;
      color: #fff;
    }
  }

  .header-control {
    position: absolute;
    top: 10px;
    right: 20px;
    display: flex;
    gap: 10px;

    .btn-register {
      background-color: transparent;
      color: #1890ff;
      border: 2px solid #1890ff;
      border-radius: 5px;
      padding: 10px 20px;
      cursor: pointer;
      font-weight: bold;

      &:hover {
        background-color: #e6f7ff;
        color: #1890ff;
      }
    }

    .btn-login {
      background-color: #1890ff;
      color: white;
      border: none;
      border-radius: 5px;
      padding: 10px 20px;
      cursor: pointer;
      font-weight: bold;

      &:hover {
        background-color: #40a9ff;
      }
    }
  }

  .avatar {
    cursor: pointer;
  }

  @media (max-width: 768px) {
    .header-control {
      right: 15px;
    }
  }
`;

function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State untuk status login

  useEffect(() => {
    const checkLogin = async () => {
      const token = await jwtStorage.retrieveToken();
      if (token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };
    checkLogin();
  }, []);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleAvatarClick = () => {
    navigate('/profile'); // Arahkan ke halaman profil pengguna
  };

  const handleHome = () => {
    // Navigate to a different route (example: '/home')
    navigate('/');
  };

  return (
    <HeaderContainer>
      <div className='logo-section'>
        <img
          src={logogame}
          alt='Logo Game'
          className='logo-image'
          onClick={handleHome}
        />
        <Typography.Text
          className='welcome-text'
          onClick={handleHome}
        >
          E-MORP SHOP
        </Typography.Text>
      </div>

      <div className='header-control'>
        {isLoggedIn ? (
          <Avatar
            className='avatar'
            size='large'
            icon={<UserOutlined />}
            onClick={handleAvatarClick}
          />
        ) : (
          <>
            <Button
              className='btn-register'
              icon={<UserAddOutlined />}
              onClick={handleRegisterClick}
            >
              Daftar
            </Button>
            <Button
              className='btn-login'
              icon={<LoginOutlined />}
              onClick={handleLoginClick}
            >
              Masuk
            </Button>
          </>
        )}
      </div>
    </HeaderContainer>
  );
}

export default Header;
