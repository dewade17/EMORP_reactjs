import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Drawer, Button, notification, Modal, Form, Input, Upload, Image } from 'antd';
import { NavLink } from 'react-router-dom';
import { PieChartOutlined, IdcardOutlined, AppstoreOutlined, PlusOutlined } from '@ant-design/icons';
import profileImage from '../../assets/images/profile.jpg';
import { getDataPrivate, sendDataPrivate } from '../../utils/api';
import { jwtStorage } from '../../utils/jwt_storage';
import logoGame from '../../assets/images/logogame2.png';

function Sidenav({ color, isMobile, toggleSidenav, sidenavVisible }) {
  const [selectedKey, setSelectedKey] = useState('1');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [isModal, setIsModal] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Function to show notifications
  const showAlert = (type, title, message) => {
    api[type]({
      message: title,
      description: message,
    });
  };

  const fetchProfileData = async () => {
    setLoading(true);
    const id_user = localStorage.getItem('user_id');
    try {
      const response = await getDataPrivate(`profiles/user/${id_user}`);
      if (response && response.length > 0) {
        const profile = response[0];
        setProfileData(profile); // Set profile data in state
      } else {
        setProfileData(null); // No profile data found
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      showAlert('error', 'Fetch Failed', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkLogin = async () => {
      const token = await jwtStorage.retrieveToken();
      if (token) {
        setIsLoggedIn(true);
        fetchProfileData(); // Fetch profile data if logged in
      } else {
        setIsLoggedIn(false);
      }
    };
    checkLogin();
  }, []);

  const doLogout = () => {
    jwtStorage.removeItem();
    localStorage.removeItem('user_id');
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    navigate('/', { replace: true });
  };

  const handleMenuKey = ({ key }) => {
    setSelectedKey(key);
  };

  const menuItems = [
    {
      key: '/dashboard-customer',
      label: (
        <NavLink to='/dashboard-customer'>
          <span
            className='icon'
            style={{ marginRight: '20px' }}
          >
            <PieChartOutlined style={{ color: 'yellow' }} />
          </span>
          <span className='label'>Halaman Utama</span>
        </NavLink>
      ),
    },
    {
      key: '/riwayat-transaksi',
      label: (
        <NavLink to='/riwayat-transaksi'>
          <span
            className='icon'
            style={{ marginRight: '20px' }}
          >
            <AppstoreOutlined style={{ color: 'yellow' }} />
          </span>
          <span className='label'>Riwayat Transaksi</span>
        </NavLink>
      ),
    },
    {
      key: '/profile',
      label: (
        <NavLink to='/profile'>
          <span
            className='icon'
            style={{ marginRight: '20px' }}
          >
            <IdcardOutlined style={{ color: 'yellow' }} />
          </span>
          <span className='label'>Profile</span>
        </NavLink>
      ),
    },
  ];

  const formatJoinDate = (date) => {
    const joinDate = new Date(date);
    return joinDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const handleSubmit = async () => {
    const values = form.getFieldsValue();
    const id_user = localStorage.getItem('user_id'); // Get user ID from localStorage

    if (!id_user) {
      showAlert('error', 'Submit Failed', 'User ID is missing');
      return;
    }

    if (!values.nama_user) {
      showAlert('error', 'Submit Failed', 'Nama user is required');
      return;
    }

    const formData = new FormData();
    formData.append('id_user', id_user); // Add the id_user from localStorage
    formData.append('nama_user', values.nama_user);

    // Check if a file is being uploaded, then add it to the formData
    if (values.gambar_profile) {
      const file = values.gambar_profile?.[0]?.originFileObj;

      if (file) {
        // Check if the file size exceeds 2MB (2048 KB)
        if (file.size > 2048 * 1024) {
          showAlert('error', 'Validation Error', 'The gambar profile must not be greater than 2048 kilobytes.');
          return;
        }
        formData.append('gambar_profile', file);
      }
    }

    const url = 'profiles'; // Define URL for both cases

    try {
      // Send the data to the backend
      await sendDataPrivate(url, formData);
      const successMessage = profileData ? 'Profile updated successfully' : 'Profile created successfully';
      showAlert('success', 'Success', successMessage);

      setIsModal(false);
      fetchProfileData(); // Refresh data after operation
    } catch (error) {
      console.error('Error submitting profile:', error);
      showAlert('error', 'Submit Failed', 'Failed to submit profile');
    }
  };

  const renderModal = () => {
    return (
      <Modal
        title='Create New Profile'
        open={isModal}
        onOk={handleSubmit}
        onCancel={() => setIsModal(false)}
      >
        <Form
          layout='vertical'
          form={form}
        >
          <Form.Item
            label='Nama User'
            name='nama_user'
            initialValue={profileData?.nama_user}
          >
            <Input placeholder='Masukkan nama user' />
          </Form.Item>
          <Form.Item
            label='Upload Gambar Profile'
            name='gambar_profile'
            valuePropName='fileList'
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          >
            {profileData?.gambar_profile && (
              <Image
                width={100}
                style={{ marginBottom: 16 }}
                src={`${import.meta.env.VITE_REACT_APP_API_URL}/storage/profile_images/${profileData.gambar_profile}`}
                alt='Profile Image'
              />
            )}
            <Upload
              listType='picture-card'
              beforeUpload={() => false} // Prevent auto upload
              onPreview={(file) => {
                window.open(URL.createObjectURL(file.originFileObj)); // Preview local image
              }}
            >
              <button
                style={{
                  border: 0,
                  background: 'none',
                }}
                type='button'
              >
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload Gambar</div>
              </button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  return (
    <Drawer
      title='Menu'
      placement='left'
      onClose={toggleSidenav}
      open={sidenavVisible}
      style={{
        padding: 0,
        overflow: 'hidden',
        background: '#051c82',
        color: 'white',
      }}
      width={isMobile ? '85%' : '25%'}
      closeIcon={<span style={{ color: 'yellow' }}>X</span>}
    >
      {contextHolder}
      {isLoggedIn ? (
        <>
          {/* Profile Section */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px',
              background: '#051c82',
              color: 'white',
            }}
          >
            <img
              src={profileData?.gambar_profile ? `${import.meta.env.VITE_REACT_APP_API_URL}/storage/profile_images/${profileData.gambar_profile.replace(/^profile_images\//, '')}` : profileImage}
              alt='Profile'
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                marginRight: '10px',
              }}
            />
            <div style={{ flexGrow: 1 }}>
              <h3
                style={{
                  margin: '0',
                  fontSize: '16px',
                  color: 'yellow',
                }}
              >
                {profileData?.nama_user || 'User'}
              </h3>
              <p
                style={{
                  margin: '0',
                  fontSize: '12px',
                  color: '#ccc',
                }}
              >
                Telah tergabung {profileData?.created_at ? formatJoinDate(profileData.created_at) : 'Profile tidak lengkap'}
              </p>
            </div>
          </div>

          {/* Create Profile Button (If profile is null) */}
          {!profileData && (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Button
                type='primary'
                style={{ width: '90%' }}
                onClick={() => setIsModal(true)}
              >
                Create New Profile
              </Button>
            </div>
          )}

          {/* Menu Section */}
          <Menu
            mode='inline'
            theme='light'
            style={{
              height: 'calc(100% - 100px)',
              borderRight: 0,
              background: '#051c82',
            }}
            items={menuItems.map((item) => ({
              ...item,
              style: {
                background: '#051c82',
                color: 'white',
                fontSize: '16px',
                padding: '1px 16px 8px',
                borderBottom: '1px solid #3a4a93',
                marginBottom: '16px',
              },
            }))}
            defaultSelectedKeys={[selectedKey]}
            onSelect={handleMenuKey}
          />

          {/* Logout Button */}
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              width: '90%',
              left: '5%',
              textAlign: 'center',
            }}
          >
            <img
              src={logoGame}
              alt='Logo'
              style={{
                width: '100px',
                height: 'auto',
                marginBottom: '16px',
              }}
            />
            <Button
              type='primary'
              danger
              style={{
                width: '90%',
                fontSize: '14px',
              }}
              onClick={() => doLogout()}
            >
              Logout
            </Button>
          </div>
        </>
      ) : (
        <div
          style={{
            padding: '16px',
            textAlign: 'center',
            color: 'white',
          }}
        >
          <h3 style={{ margin: '0', fontSize: '16px', color: 'yellow' }}>Daftar E-MORPH sekarang!</h3>
          <p style={{ margin: '0', fontSize: '12px', color: '#ccc' }}>Jadilah yang pertama mengetahui promo dan penawaran eksklusif!</p>
          <Button
            type='primary'
            style={{ margin: '8px 0', width: '90%' }}
            onClick={() => navigate('/register', { replace: true })}
          >
            Daftar sekarang, gratis
          </Button>
          <Button
            type='default'
            style={{ margin: '8px 0', width: '90%' }}
            onClick={() => navigate('/login', { replace: true })}
          >
            Masuk
          </Button>
        </div>
      )}

      {renderModal()}
    </Drawer>
  );
}

export default Sidenav;
