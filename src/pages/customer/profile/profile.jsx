import { useEffect, useState } from 'react';
import { Card, Typography, Avatar, Modal, Input, Form, notification, Upload, Image, Button } from 'antd';
import { getDataPrivate, sendDataPrivate } from '../../../utils/api'; // Sesuaikan path dengan utils Anda
import profileImagePlaceholder from '../../../assets/images/pubg.png'; // Placeholder untuk gambar
import cardBackground from '../../../assets/images/card.png';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
const { Title, Text } = Typography;

const ProfilePage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [isModal, setIsModal] = useState(false);
  const [profileData, setProfileData] = useState(null); // State untuk data profil
  const [loading, setLoading] = useState(false);

  // Fungsi untuk menampilkan notifikasi
  const showAlert = (type, title, message) => {
    api[type]({
      message: title,
      description: message,
    });
  };

  // Fungsi untuk mendapatkan data profil
  const fetchProfileData = async () => {
    setLoading(true);
    const id_user = localStorage.getItem('user_id');
    try {
      const response = await getDataPrivate(`profiles/user/${id_user}`);
      // Mengambil objek pertama dari array
      if (response && response.length > 0) {
        const profile = response[0]; // Mengakses profil pertama dari array
        setProfileData(profile); // Menyimpan profil dalam state
      } else {
        setProfileData(null); // Jika tidak ada data profil
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      showAlert('error', 'Fetch Failed', 'Failed to load profile data');
      setProfileData(null); // Jika gagal memuat profil
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const values = form.getFieldsValue();

    if (!values.nama_user) {
      showAlert('error', 'Submit Failed', 'Nama user is required');
      return;
    }

    const formData = new FormData();
    formData.append('nama_user', values.nama_user);
    formData.append('email', values.email);

    // Cek jika gambar baru diupload
    const file = values.gambar_profile?.[0]?.originFileObj;

    if (file) {
      console.log('File yang akan di-upload:', file);

      // Pastikan file valid
      if (file.size > 2048 * 1024) {
        showAlert('error', 'Validation Error', 'The gambar profile must not be greater than 2048 kilobytes.');
        return;
      }

      if (!file.type.startsWith('image/') || !['image/jpeg', 'image/png'].includes(file.type)) {
        showAlert('error', 'Invalid File Type', 'The gambar profile must be a file of type: jpg, png.');
        return;
      }

      // Menambahkan file gambar baru ke FormData
      formData.append('gambar_profile', file);
      console.log('Form Data yang akan dikirim:', formData);
    } else if (profileData?.gambar_profile) {
      console.log('Tidak ada gambar yang dipilih, menggunakan gambar lama.');
      // Jika tidak ada file baru, gunakan gambar profil yang lama
      formData.append('existing_photo', profileData.gambar_profile);
    }

    // URL endpoint untuk update profil
    const url = `profiles/${profileData.id_profile}`;

    try {
      const response = await sendDataPrivate(url, formData); // Mengirim data ke API
      console.log('Response dari API:', response);
      showAlert('success', 'Success', 'Profile updated successfully');
      setIsModal(false);
      fetchProfileData(); // Refresh data profil setelah update
    } catch (error) {
      console.error('Error submitting profile:', error);
      showAlert('error', 'Submit Failed', 'Failed to submit profile');
    }
  };

  // Modal untuk Edit Profil
  const renderModal = () => {
    return (
      <Modal
        title='Edit Profile'
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
            label='Email'
            name='email'
            initialValue={profileData?.email}
          >
            <Input placeholder='Masukkan email' />
          </Form.Item>
          <Form.Item
            label='Upload Gambar Profile'
            name='gambar_profile'
            valuePropName='fileList'
            getValueFromEvent={(e) => {
              const fileList = Array.isArray(e) ? e : e?.fileList;
              console.log('FileList yang diterima:', fileList); // Menambahkan log
              return fileList;
            }}
          >
            {/* Menampilkan gambar profil lama jika tersedia */}
            {profileData?.gambar_profile && !form.getFieldValue('gambar_profile')?.length && (
              <Image
                width={100}
                style={{ marginBottom: 16 }}
                src={`${import.meta.env.VITE_REACT_APP_API_URL}/storage/profile_images/${profileData.gambar_profile.replace(/^profile_images\//, '')}`}
                alt='Profile Image'
              />
            )}

            <Upload
              listType='picture-card'
              beforeUpload={(file) => {
                // Validasi file sebelum upload
                const isImage = file.type.startsWith('image/');
                const isCorrectType = ['image/jpeg', 'image/png'].includes(file.type);

                if (!isImage) {
                  showAlert('error', 'Invalid File Type', 'The gambar profile must be an image.');
                  return false; // Stop upload if not an image
                }

                if (!isCorrectType) {
                  showAlert('error', 'Invalid Image Format', 'The gambar profile must be a file of type: jpg, png.');
                  return false; // Stop upload if file type is incorrect
                }

                return true; // Allow upload if file is valid
              }}
              onChange={(info) => {
                // Menangani perubahan pada daftar file
                const fileList = info.fileList;
                form.setFieldsValue({ gambar_profile: fileList }); // Set field value dengan daftar file
              }}
              onRemove={() => {
                // Menghapus gambar dari form jika file dihapus
                form.setFieldsValue({ gambar_profile: [] });
              }}
              onPreview={(file) => {
                window.open(URL.createObjectURL(file.originFileObj)); // Pratinjau gambar lokal
              }}
              showUploadList={{ showRemoveIcon: true }} // Menampilkan icon hapus untuk gambar
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

  // Fetch data profil saat pertama kali komponen dimuat
  useEffect(() => {
    fetchProfileData();
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        padding: '20px',
      }}
    >
      {contextHolder}
      <Card
        style={{
          width: 600,
          textAlign: 'center',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          backgroundImage: `url(${cardBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Jika profileData kosong, tampilkan pesan */}
        {profileData === null ? (
          <Text style={{ fontSize: '16pt', color: 'red', marginTop: '20px' }}>Harap lengkapi profil terlebih dahulu</Text>
        ) : (
          <>
            {/* Foto Profil */}
            <Avatar
              src={profileData?.gambar_profile ? `${import.meta.env.VITE_REACT_APP_API_URL}/storage/profile_images/${profileData.gambar_profile.replace(/^profile_images\//, '')}` : profileImagePlaceholder}
              size={100}
              style={{ marginBottom: '15px', border: '3px solid white' }}
            />

            {/* Nama dan Email Pengguna */}
            <Title
              level={4}
              style={{ marginBottom: 0, color: 'blue' }}
            >
              {profileData?.nama_user || 'Nama User'}
            </Title>
            <Text
              type='secondary'
              style={{ fontSize: '12pt', display: 'block', marginBottom: '20px', color: '#E0E0E0' }}
            >
              {profileData?.email || 'Email belum tersedia'}
            </Text>

            {/* Menu Pengaturan */}
            <Button
              type='primary'
              style={{ width: '90%' }}
              onClick={() => {
                setIsModal(true);
                form.setFieldsValue({ nama_user: profileData?.nama_user });
              }}
            >
              Update Profile
            </Button>
            <Button
              type='primary'
              style={{ width: '90%', marginTop: '10px' }}
              onClick={() => navigate('/reset-password')}
            >
              Change Password
            </Button>
          </>
        )}

        {/* Modal untuk Edit Profile */}
        {renderModal()}
      </Card>
    </div>
  );
};

export default ProfilePage;
