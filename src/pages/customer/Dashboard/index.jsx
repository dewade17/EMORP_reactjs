import { useState, useEffect } from 'react';
import { Row, Card, Button, Carousel, notification } from 'antd';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
// Import komponen PengaduanDrawer
import { getData } from '../../../utils/api'; // Fungsi fetch data API
import { CustomerServiceOutlined } from '@ant-design/icons';

// Gambar untuk carousel
import carousel1 from '../../../assets/images/1.png';
import carousel2 from '../../../assets/images/2.png';
import carousel3 from '../../../assets/images/3.png';
import Pengaduan from '../pengaduan/pengaduan';

const Dashboardcustomer = () => {
  const [categories, setCategories] = useState([]); // Untuk kategori dinamis
  const [activeCategory, setActiveCategory] = useState('');
  const [cardsData, setCardsData] = useState({});
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [drawerVisible, setDrawerVisible] = useState(false);

  const showDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  const navigate = useNavigate(); // Inisialisasi useNavigate
  // Fetch data saat komponen di-mount
  useEffect(() => {
    fetchData();
  }, []);

  // Fungsi fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getData('produk');
      if (response && Array.isArray(response)) {
        const categorizedData = response.reduce((acc, item) => {
          if (!acc[item.kategori.Id_kategori]) acc[item.kategori.Id_kategori] = [];
          acc[item.kategori.Id_kategori].push(item);
          return acc;
        }, {});

        setCardsData(categorizedData);

        // Membuat array kategori
        const categories = response.map((item) => ({
          name: item.kategori.Nama_kategori,
          key: item.kategori.Id_kategori,
        }));
        const uniqueCategories = [...new Set(categories.map(JSON.stringify))].map(JSON.parse);
        setCategories(uniqueCategories);
        setActiveCategory(uniqueCategories[0].key);
      } else {
        showNotification('error', 'Fetch Failed', 'Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      showNotification('error', 'Fetch Failed', 'Could not fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk menampilkan notifikasi
  const showNotification = (type, message, description) => {
    api[type]({
      message,
      description,
    });
  };

  const carouselData = [
    { src: carousel1, alt: 'Promo 1' },
    { src: carousel2, alt: 'Promo 2' },
    { src: carousel3, alt: 'Promo 3' },
  ];

  const handleCardClick = (item) => {
    // Menghapus non_zona_game, hanya ada zona dan nonzona
    const path = `/detail/${item.standar === 'zona' ? 'zona' : 'nonzona'}/${item.Id_produk}`;

    // Mengarahkan pengguna ke halaman detail produk
    navigate(path);
  };
  return (
    <div
      className='layout-content'
      style={{ padding: '20px' }}
    >
      {contextHolder}

      {/* Carousel */}
      <Carousel
        autoplay
        autoplaySpeed={1500}
      >
        {carouselData.map((item, index) => (
          <div key={index}>
            <img
              src={item.src}
              alt={item.alt}
              style={{
                width: '100%',
                height: '500px',
                objectFit: 'cover',
                borderRadius: '12px',
              }}
            />
          </div>
        ))}
      </Carousel>

      {/* Kategori */}
      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        {categories.map((category) => (
          <Button
            key={category.key}
            type={activeCategory === category.key ? 'primary' : 'default'}
            style={{
              margin: '0 8px',
              borderRadius: '8px',
            }}
            onClick={() => setActiveCategory(category.key)}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Cards */}
      <div style={{ marginTop: '24px' }}>
        {loading ? (
          <div style={{ textAlign: 'center' }}>Loading...</div>
        ) : (
          <Row
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'start',
              gap: '16px',
            }}
          >
            {(cardsData[activeCategory] || []).map((item, index) => (
              <div
                key={index}
                style={{
                  width: 'calc(20% - 16px)',
                  minWidth: '200px',
                }}
                onClick={() => handleCardClick(item)} // Menggunakan fungsi handleCardClick
              >
                <Card
                  bordered={false}
                  style={{
                    overflow: 'hidden',
                    cursor: 'pointer',
                    borderRadius: '12px',
                  }}
                  bodyStyle={{
                    padding: 0,
                  }}
                >
                  <img
                    src={`${import.meta.env.VITE_REACT_APP_API_URL}/storage/foto_produk/${item.foto_produk}`} // Default gambar
                    alt={item.foto_produk || 'Product'}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Card>
              </div>
            ))}
          </Row>
        )}
      </div>
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
        }}
      >
        <Button
          type='primary'
          shape='round'
          size='large'
          icon={<CustomerServiceOutlined />}
          onClick={showDrawer}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#1890ff',
            borderColor: '#1890ff',
          }}
        >
          Customer Service
        </Button>
      </div>

      {/* Drawer Customer Service */}
      <Pengaduan
        visible={drawerVisible}
        onClose={closeDrawer}
      />
    </div>
  );
};

export default Dashboardcustomer;
