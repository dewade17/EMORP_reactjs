import { useState, useEffect } from 'react';
import { Col, Row, Typography, Card, List, message, Input } from 'antd';
import { ellipsisGenerator } from '../../../utils/ui';
import { CheckCircleTwoTone } from '@ant-design/icons';
import { getData, deleteData } from '../../../utils/api';
import { SearchOutlined } from '@ant-design/icons';
const { Title, Text } = Typography;

const Layananpengaduan = () => {
  const { Meta } = Card;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState(''); // Tambahkan state untuk searchText

  // Fetch data from API
  const fetchPengaduanData = async () => {
    setLoading(true);
    try {
      const response = await getData('pengaduan'); // Sesuaikan endpoint jika berbeda
      setData(response.data);
    } catch {
      message.error('Gagal mengambil data pengaduan.');
    } finally {
      setLoading(false);
    }
  };

  // Delete pengaduan by id
  const handleDelete = async (id_pengaduan) => {
    try {
      // Make sure to send a DELETE request to the correct endpoint
      const response = await deleteData(`pengaduan/${id_pengaduan}`);

      if (response && response.status === 200) {
        message.success('Pengaduan berhasil dihapus.');
        fetchPengaduanData(); // Refresh data after deletion
      } else {
        // Handle error if any specific message is returned from back-end
        message.error(response?.error || 'Gagal menghapus pengaduan.');
      }
    } catch (error) {
      console.error('Error deleting pengaduan:', error);
      message.error('Gagal menghapus pengaduan.');
    }
  };

  useEffect(() => {
    fetchPengaduanData();
  }, []);

  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
  };

  const filteredData = data.filter((item) => item.id_pesanan.toLowerCase().includes(searchText) || item.pesanan.toLowerCase().includes(searchText));

  return (
    <div className='layout-content'>
      <Row gutter={[24, 0]}>
        <Col
          xs={22}
          className='mb-24'
        >
          <Card
            bordered={false}
            className='criclebox h-full w-full'
          >
            <Title>List Layanan Pengaduan</Title>
            <Text style={{ fontSize: '12pt' }}>Layanan Pengaduan Customer</Text>
          </Card>
        </Col>
      </Row>
      <Row gutter={(12, 0)}>
        <Col>
          <Input
            prefix={<SearchOutlined />}
            placeholder='Search Produk'
            className='header-search'
            allowClear
            size='large'
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: '100%', marginLeft: '40px' }}
          />
        </Col>
      </Row>
      <List
        grid={{ gutter: 12, column: 3 }}
        dataSource={filteredData}
        loading={loading}
        renderItem={(item) => (
          <List.Item>
            <Row gutter={[24, 0]}>
              <Col xs={22}>
                <Card
                  hoverable
                  style={{ width: 280 }}
                  cover={
                    <img
                      alt='Bukti Pengaduan'
                      src={`${import.meta.env.VITE_REACT_APP_API_URL}/storage/${item.foto_pengaduan}`}
                      style={{
                        height: 200,
                        width: 200,
                        margin: 'auto',
                        marginTop: 10,
                      }}
                    />
                  }
                  actions={[
                    <CheckCircleTwoTone
                      key={item.id_pengaduan}
                      onClick={() => handleDelete(item.id_pengaduan)}
                    />,
                  ]}
                >
                  <Meta />
                  <Text>
                    <p>ID Pesanan : {item.id_pesanan}</p>
                  </Text>
                  <Text>
                    <p>ID User / No Telepon : {item.tujuan}</p>
                  </Text>
                  <Text style={{ marginTop: 10 }}>
                    <p>Pesanan : {item.pesanan}</p>
                  </Text>
                  <Text>
                    <p>Harga : {item.harga}</p>
                  </Text>
                  <Text ellipsis={ellipsisGenerator(item.deskripsi)}>Description : {item.deskripsi}</Text>
                </Card>
              </Col>
            </Row>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Layananpengaduan;
