import { useState, useEffect } from 'react';
import { Table, Typography, Card, Row, Tag } from 'antd';
import cardImage from '../../../assets/images/card.png';
import { getDataPrivate } from '../../../utils/api'; // Adjust the import path as needed

const { Title } = Typography;

const RiwayatTransaksi = () => {
  const [layananProdukData, setLayananProdukData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRiwayatOrderan = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getDataPrivate('orderan');
      console.log('API Response:', response);

      if (response && Array.isArray(response) && response.length > 0) {
        // Get user_id from local storage
        const userId = localStorage.getItem('user_id');

        // Filter data by id_user
        const filteredData = response.filter((item) => item.id_user === Number(userId));
        console.log('Filtered Data:', filteredData);

        const dataWithKeys = filteredData.map((item) => ({
          key: item.Id_orderan, // Use Id_orderan as key
          idOrderan: item.Id_orderan,
          statusPembayaran: item.Status_pembayaran,
          noPesanan: item.Pesanan,
          zoneId: item.zone_id || 'non_zone',
          kodePesanan: item.Kode_pesanan,
          harga: `Rp. ${item.Harga.toLocaleString()}`,
          noTelepon: item.No_telepon,
          tanggal: new Date(item.created_at).toLocaleString(),
        }));
        setLayananProdukData(dataWithKeys);
      } else {
        setError('No data found');
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      setError('Unable to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiwayatOrderan();
  }, []);

  const columns = [
    {
      title: 'No.',
      key: 'no',
      render: (text, record, index) => index + 1,
      width: '5%',
    },
    {
      title: 'ID Orderan',
      dataIndex: 'idOrderan',
      key: 'idOrderan',
      width: '10%',
    },
    {
      title: 'Status Pembayaran',
      dataIndex: 'statusPembayaran',
      key: 'statusPembayaran',
      render: (status) => <Tag color={status === 'paid' ? 'green' : 'red'}>{status}</Tag>,
      width: '15%',
    },
    {
      title: 'Pesanan',
      dataIndex: 'noPesanan',
      key: 'noPesanan',
      width: '15%',
    },
    {
      title: 'Kode Pesanan',
      dataIndex: 'kodePesanan',
      key: 'kodePesanan',
      sorter: (a, b) => a.kodePesanan.localeCompare(b.kodePesanan),
      width: '10%',
    },
    {
      title: 'Harga',
      dataIndex: 'harga',
      key: 'harga',
      sorter: (a, b) => a.harga.localeCompare(b.harga),
      width: '10%',
    },
    {
      title: 'No. Telepon',
      dataIndex: 'noTelepon',
      key: 'noTelepon',
      sorter: (a, b) => a.noTelepon.localeCompare(b.noTelepon),
      width: '10%',
    },
    {
      title: 'Zone ID',
      dataIndex: 'zoneId',
      key: 'zoneId',
      width: '10%',
    },
    {
      title: 'Tanggal',
      dataIndex: 'tanggal',
      key: 'tanggal',
      sorter: (a, b) => new Date(a.tanggal) - new Date(b.tanggal),
      width: '15%',
    },
  ];

  return (
    <div
      className='layout-content'
      style={{ padding: '20px' }}
    >
      <style>
        {`
          .table-row-even {
            background-color: #e6e6fa;
          }
          .table-row-odd {
            background-color: #ffffff;
          }
          .ant-table-thead > tr > th {
            background-color: #003366 !important;
            color: white !important;
          }
          .ant-table-tbody > tr:hover {
            background-color: #d3d3f3;
          }
        `}
      </style>
      <Row gutter={[24, 0]}>
        <Card
          bordered={false}
          style={{
            borderRadius: '8px',
            width: '100%',
            backgroundImage: `url(${cardImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <Title level={3}>Riwayat Transaksi</Title>
          <div
            style={{
              marginBottom: '16px',
              padding: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '8px',
              color: '#555',
            }}
          >
            <Table
              columns={columns}
              dataSource={layananProdukData}
              pagination={{ pageSize: 5 }}
              rowKey='key'
              loading={loading}
              style={{ borderRadius: '8px', overflow: 'hidden', width: '100%' }}
              bordered={true}
              rowClassName={(record, index) => (index % 2 === 0 ? 'table-row-even' : 'table-row-odd')}
            />
            {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
          </div>
        </Card>
      </Row>
    </div>
  );
};

export default RiwayatTransaksi;
