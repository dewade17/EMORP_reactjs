import { useEffect, useState } from 'react';
import { Card, Typography, Spin, message } from 'antd';
import logo from '../../../assets/images/logogame.png';
import { MailOutlined, PhoneOutlined, ExclamationOutlined } from '@ant-design/icons';
import { getData } from '../../../utils/api'; // Pastikan fungsi ini diimpor dengan benar
import { useLocation } from 'react-router-dom';

const { Title, Text } = Typography;

const Invoice = () => {
  const location = useLocation(); // Menggunakan useLocation untuk menangkap query string
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Menangkap query string order_id dan status_pembayaran
  const params = new URLSearchParams(location.search);
  const order_id = params.get('order_id');
  const status_pembayaran = params.get('transaction_status'); // Default ke 'paid'

  // Ambil data pesanan dengan ID dan status pembayaran dari query string
  useEffect(() => {
    if (!order_id) {
      message.error('Order ID tidak ditemukan.');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await getData(
          `orders/filter?order_id=${order_id}&status_pembayaran=${status_pembayaran}` // URL API baru
        );

        if (response.status === 'success') {
          console.log(response.data); // Debug respons API
          setOrderData(response.data);
        } else {
          message.error(response.message || 'Gagal mengambil data pesanan');
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        message.error('Gagal mengambil data pesanan');
        setLoading(false);
      }
    };

    fetchData();
  }, [order_id, status_pembayaran]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size='large' />
      </div>
    );
  }

  if (orderData.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <Text type='secondary'>Tidak ada data pesanan yang ditemukan.</Text>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8f8f8',
        padding: '20px',
      }}
    >
      {orderData.map((order, index) => (
        <Card
          key={index}
          style={{
            width: 400,
            textAlign: 'center',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            marginBottom: '20px',
          }}
        >
          {/* Logo */}
          <img
            src={logo}
            alt='Shop Logo'
            style={{ width: '80px', marginBottom: '10px' }}
          />

          {/* Shop Name and Subtitle */}
          <Title
            level={4}
            style={{ marginBottom: 0 }}
          >
            E-Morp
          </Title>
          <Text
            type='secondary'
            style={{ fontSize: '12pt', display: 'block', marginBottom: '20px' }}
          >
            Cepat aman Top Up Sekarang!
          </Text>

          {/* Order Details */}
          <div style={{ textAlign: 'left', marginBottom: '20px' }}>
            {[
              { label: 'ID Pesanan', value: order.Id_orderan },
              { label: 'Order', value: order.Pesanan },
              { label: 'Harga', value: order.Harga },
              { label: 'Tujuan', value: order.No_telepon },
              { label: 'Pembayaran', value: order.Status_pembayaran },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '6px',
                }}
              >
                <Text style={{ color: '#888' }}>{item.label}:</Text>
                <Text style={{ fontWeight: 'bold' }}>{item.value}</Text>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div
            style={{
              textAlign: 'center',
              borderTop: '1px solid #f0f0f0',
              paddingTop: '10px',
            }}
          >
            <Text>
              <ExclamationOutlined style={{ marginRight: '8px' }} />
              <b>Jangan Lupa Screenshot Pesanan Anda !</b>
            </Text>
            <br />
            <Text>
              <MailOutlined style={{ marginRight: '8px' }} />
              @E-MORP-SHOP
            </Text>
            <br />
            <Text>
              <PhoneOutlined style={{ marginRight: '8px' }} />
              +62085173321510
            </Text>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default Invoice;
