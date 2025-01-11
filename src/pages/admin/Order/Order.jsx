import { useState, useEffect } from 'react';
import { Table, Spin, Alert, Typography, Col, Row, Card } from 'antd';
import { getDataPrivate } from '../../../utils/api'; // Sesuaikan dengan jalur impor utility Anda
const { Title, Text } = Typography;
const Order = () => {
  const [layananProdukData, setLayananProdukData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const columns = [
    {
      title: 'No Pesanan',
      dataIndex: 'key',
      rowScope: 'row',
    },
    {
      title: 'Pesanan',
      dataIndex: 'Pesanan',
      key: 'Pesanan',
    },
    {
      title: 'Kode Pesanan',
      dataIndex: 'Kode_pesanan',
      key: 'Kode_pesanan',
    },
    {
      title: 'Harga',
      dataIndex: 'Harga',
      key: 'Harga',
      render: (text) => `Rp. ${text.toLocaleString('id-ID')}`,
    },
    {
      title: 'No Telepon',
      dataIndex: 'No_telepon',
      key: 'No_telepon',
    },
    {
      title: 'status',
      dataIndex: 'Status_pembayaran',
      key: 'Status_pembayaran',
    },
    {
      title: 'Tanggal',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => {
        const date = new Date(text);
        return `${date.toLocaleDateString('id-ID')} ${date.toLocaleTimeString('id-ID')}`;
      },
    },
  ];

  const fetchLayananProduk = async () => {
    setLoading(true); // Mulai loading
    setError(null); // Bersihkan error sebelumnya

    try {
      const response = await getDataPrivate('orderan'); // Sesuaikan endpoint API jika perlu
      console.log('API Response:', response); // Cek respon API

      // Pastikan response adalah array dan memiliki data yang valid
      if (response && Array.isArray(response) && response.length > 0) {
        console.log('Data Lengkap Diterima:', response); // Debugging untuk memastikan data diterima
        const dataWithKeys = response.map((item) => ({
          key: item.Id_orderan, // Menggunakan Id_orderan sebagai key
          ...item,
        }));
        setLayananProdukData(dataWithKeys); // Set data untuk ditampilkan
      } else {
        console.log('Data Kosong atau Tidak Valid'); // Debugging untuk melihat apa yang terjadi
        setError('No data found');
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      setError('Unable to fetch data');
    } finally {
      setLoading(false); // Hentikan loading
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
            <Title>Riwayat Order</Title>
            <Text style={{ fontSize: '12pt' }}>Data Orderan</Text>
          </Card>
        </Col>

        {/* Start-Tabel-Kategori */}
        <Col
          xs={22}
          className='mb-24'
        >
          <Card>
            {loading ? (
              <Spin />
            ) : error ? (
              <Alert
                message='Error'
                description={error}
                type='error'
                showIcon
              />
            ) : (
              <Table
                columns={columns}
                dataSource={layananProdukData}
                scroll={{ x: 'max-content' }}
                rowKey='key' // Pastikan setiap baris punya key yang unik
              />
            )}
          </Card>
        </Col>
        {/* End-Tabel-Kategori */}
      </Row>
    </div>
  );
};

export default Order;
