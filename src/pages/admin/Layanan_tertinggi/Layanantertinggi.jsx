import { Col, Row, Typography, Card, Table, Spin, Alert } from 'antd';
import { useState, useEffect } from 'react';
import { getDataPrivate } from '../../../utils/api'; // Adjust the import path for your utility

const { Title, Text } = Typography;

const Layanantertinggi = () => {
  const [layananProdukData, setLayananProdukData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const columns = [
    {
      title: 'No',
      dataIndex: 'key',
      rowScope: 'row',
    },
    {
      title: 'Nama',
      dataIndex: 'Nama_produk',
      key: 'Nama_produk',
    },
    {
      title: 'Total',
      dataIndex: 'total_orders',
      key: 'total_orders',
    },
  ];

  const fetchLayananProduk = async () => {
    setLoading(true); // Start loading
    setError(null); // Clear any previous errors

    try {
      const response = await getDataPrivate('most-ordered-products'); // Adjust API endpoint if needed
      if (response.status === 'success') {
        const dataWithKeys = response.data.map((item, index) => ({
          key: index + 1, // Adding index as key
          ...item,
        }));
        setLayananProdukData(dataWithKeys);
      } else {
        setError('No data found');
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      setError('Unable to fetch data');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchLayananProduk();
  }, []);

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
            <Title>Rangking Produk</Title>
            <Text style={{ fontSize: '12pt' }}>Dibawah Ini Merupakan Top Layanan Dengan Total Pemesanan Tertinggi.</Text>
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[24, 0]}>
        <Col xs={22}>
          <Card>
            {loading ? (
              <Spin size='large' />
            ) : error ? (
              <Alert
                message={error}
                type='error'
                showIcon
              />
            ) : (
              <Table
                columns={columns}
                dataSource={layananProdukData}
                scroll={{ x: 'max-content' }}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Layanantertinggi;
