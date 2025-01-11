import { useEffect, useState } from 'react';
import { Col, Row, Typography, Card, Divider, message } from 'antd';
import { UnorderedListOutlined, InboxOutlined, FileExclamationOutlined, DeliveredProcedureOutlined } from '@ant-design/icons';
import { getDataPrivate } from '../../../utils/api'; // Sesuaikan path dengan utils Anda

const { Title, Text } = Typography;

function Dashboardadmin() {
  const [kategoriData, setKategoriData] = useState(null);
  const [produkData, setProdukData] = useState(null);
  const [layananProdukData, setLayananProdukData] = useState(null);
  const [pengaduanData, setPengaduanData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [kategoriRes, produkRes, layananRes, pengaduanRes] = await Promise.all([
        getDataPrivate('kategori/count'),
        getDataPrivate('produk/sum'),
        getDataPrivate('layananproduk/jumlah'),
        getDataPrivate('layananpengaduan/jumlah'), // Sesuaikan endpoint jika berbeda
      ]);

      setKategoriData(kategoriRes);
      setProdukData(produkRes);
      setLayananProdukData(layananRes);
      setPengaduanData(pengaduanRes);
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Gagal memuat data, periksa koneksi Anda.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const cardDashboard = (icon, label, value) => {
    return (
      <div>
        <Row style={{ justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ marginRight: '15px' }}>{icon}</div>
          <Row style={{ alignContent: 'center', alignItems: 'center' }}>
            <div>
              <Col>
                <Title
                  level={1}
                  type={'primary'}
                  style={{ marginBottom: 0 }}
                >
                  {value}
                </Title>
              </Col>
              <Col>
                <Text type='secondary'>{label}</Text>
              </Col>
            </div>
          </Row>
        </Row>
      </div>
    );
  };

  return (
    <div className='layout-content'>
      <Row
        gutter={[24, 0]}
        style={{ justifyContent: 'center' }}
      >
        <Col
          xs={24}
          md={12}
          sm={24}
          lg={12}
          xl={12}
          className='mb-24'
        >
          <Card
            bordered={false}
            className='criclebox h-full'
            loading={loading}
          >
            <Row justify='space-around'>
              {cardDashboard(<UnorderedListOutlined style={{ fontSize: '64px', color: '#47c363' }} />, 'Total Categories', kategoriData?.total_categories || 0)}
              {cardDashboard(<InboxOutlined style={{ fontSize: '64px', color: '#fc544b' }} />, 'Jumlah Produk', produkData?.jumlah_produk || 0)}
            </Row>

            <Divider />

            <Row justify='space-around'>
              {cardDashboard(<DeliveredProcedureOutlined style={{ fontSize: '64px', color: '#6777ef' }} />, 'Jumlah Layanan Produk', layananProdukData?.jumlah_layananproduk || 0)}
              {cardDashboard(<FileExclamationOutlined style={{ fontSize: '64px', color: '#ffa426' }} />, 'Jumlah Layanan Pengaduan', pengaduanData?.jumlah_layananpengaduan || 0)}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboardadmin;
