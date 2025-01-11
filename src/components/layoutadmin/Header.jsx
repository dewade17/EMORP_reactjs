// /* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */

import { useEffect, useContext } from 'react';

import { Row, Col, Button } from 'antd';

import { LogoutOutlined } from '@ant-design/icons';

import { useLocation, useNavigate } from 'react-router-dom';

import { jwtStorage } from '../../utils/jwt_storage';
import { AuthContext } from '../../providers/AuthProvider';

const toggler = [
  <svg
    width='20'
    height='20'
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 448 512'
    key={0}
  >
    <path d='M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z'></path>
  </svg>,
];

function Header({ onPress }) {
  const location = useLocation();
  const pathSegments = location.pathname.split('/'); // Remove leading empty string
  pathSegments.shift(); // Remove empty string if at the root path

  useEffect(() => window.scrollTo(0, 0));

  useEffect(() => window.scrollTo(0, 0));

  const { userProfile } = useContext(AuthContext);

  const navigate = useNavigate();

  const doLogout = () => {
    jwtStorage.removeItem();
    localStorage.removeItem('user_id');
    localStorage.removeItem('userRole');
    navigate('/', { replace: true });
  };
  return (
    <>
      <Row gutter={[24, 0]}>
        <Col
          span={24}
          md={8}
        >
          <div>{userProfile?.user_logged || ''}</div>
        </Col>
        <Col
          span={24}
          md={16}
          className='header-control'
        >
          <Button
            type='link'
            className='sidebar-toggler'
            onClick={() => onPress()}
          >
            {toggler}
          </Button>
          <Button
            className='btn-sign-in'
            type='text'
            onClick={() => doLogout()}
          >
            <LogoutOutlined />
            <span>Sign Out</span>
          </Button>
        </Col>
      </Row>
    </>
  );
}

export default Header;
