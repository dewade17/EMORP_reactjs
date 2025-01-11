import { Col, Row, Typography, Card, Input, Button, Spin, Form, notification, Modal } from 'antd';
import { useState, useEffect } from 'react';

import { getData, sendData } from '../../../utils/api'; // Pastikan fungsi ini diimpor dengan benar
import { useParams } from 'react-router-dom';

const { Title, Text } = Typography;

const Nonzone = () => {
  const { id } = useParams();
  const [selectedlayanan, setSelectedlayanan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState(null);
  const [layananOptions, setlayananOptions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [orderData, setOrderData] = useState(null); // Untuk menyimpan data order
  const [form] = Form.useForm();

  const priceToIDR = (price) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
  };

  const handlePaymentAndClose = async () => {
    await handlePayment(); // Tunggu proses pembayaran selesai
    handleModalClose(); // Tutup modal setelah itu
  };

  const loadSnapScript = () => {
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js'; // Ganti ke URL produksi jika live
    script.setAttribute('data-client-key', 'SB-Mid-client-1pzCWb2TFn8aLH2S'); // Client Key Sandbox
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => console.log('Snap.js Loaded');
    script.onerror = () => console.error('Failed to load Snap.js');
  };

  useEffect(() => {
    loadSnapScript();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProductData();
  }, [id]);

  const fetchProductData = async () => {
    setLoading(true);
    try {
      const response = await getData(`layanan-produk/by-produk/${id}`);
      if (response && Array.isArray(response)) {
        const mainProduct = response[0]?.produk || {};
        const layananOptions = response.map((item) => ({
          label: item.Nama_layananproduk,
          value: item.id,
          price: item.harga,
          Kode_layananproduk: item.Kode_layananproduk,
        }));

        setProductData(mainProduct);
        setlayananOptions(layananOptions);
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
      notification.error({
        message: 'Gagal Memuat Data',
        description: 'Terjadi kesalahan saat memuat data produk.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setOrderData(null);
  };

  const handleSubmit = async (values) => {
    const id_user = localStorage.getItem('user_id') || null; // Get user ID from localStorage

    if (!selectedlayanan) {
      notification.error({
        message: 'Pilih layanan',
        description: 'Harap pilih layanan sebelum melanjutkan.',
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      if (id_user !== null) {
        formData.append('id_user', id_user);
      }
      formData.append('No_telepon', values.No_telepon);
      formData.append('Kode_pesanan', selectedlayanan.Kode_layananproduk);
      formData.append('Pesanan', selectedlayanan.label);
      formData.append('Harga', selectedlayanan.price);
      formData.append('Nama_produk', productData?.Nama_produk);
      formData.append('Zone_id', values.Zone_id || 'non_zona');
      formData.append('Status_pembayaran', 'unpaid');

      // Kirim data pesanan ke server
      const response = await sendData('orderan', formData);

      // Tambahkan logging untuk melihat isi dari respons
      console.log('Response from server:', response);

      // Panggil API untuk mendapatkan pesanan terbaru yang belum dibayar
      const latestUnpaidOrder = await getData(`orderan/latest-unpaid/${response.data.Id_orderan}`);
      console.log('ID Orderan:', response.data.Id_orderan);
      setOrderData(latestUnpaidOrder); // Update dengan data terbaru

      notification.success({
        message: 'Pesanan Berhasil Dibuat',
        description: 'Pesanan Anda telah berhasil dibuat.',
      });

      form.resetFields();
      setSelectedlayanan(null);
      setIsModalVisible(true); // Tampilkan modal
    } catch (error) {
      console.error('Error submitting data:', error);
      notification.error({
        message: 'Gagal Membuat Pesanan',
        description: 'Terjadi kesalahan saat mengirim data.',
      });
    } finally {
      setLoading(false);
    }
  };

  //midtrans-method
  const handlePayment = async () => {
    try {
      // Pastikan Snap.js sudah dimuat
      if (!window.snap) {
        throw new Error('Snap.js belum dimuat. Silakan coba lagi.');
      }

      // Membuat payload untuk Midtrans Token
      const formDataMidtrans = new FormData();
      formDataMidtrans.append('order_id', `${orderData.Id_orderan}`);
      formDataMidtrans.append('gross_amount', orderData.Harga);
      formDataMidtrans.append('first_name', orderData.No_telepon);
      formDataMidtrans.append('last_name', orderData.Kode_pesanan);
      formDataMidtrans.append('email', 'tidak_ada');
      formDataMidtrans.append('phone', orderData.No_telepon);
      formDataMidtrans.append('item_id', 'a1');
      formDataMidtrans.append('item_name', orderData.Pesanan);

      // Mengambil token Snap dari backend
      const responseToken = await sendData('midtrans/token', formDataMidtrans);

      console.log('Response from backend:', responseToken); // Log full response
      const token = responseToken?.token;
      if (!token) {
        throw new Error('Token Snap tidak ditemukan. Periksa kembali respons backend.');
      }

      console.log('Snap Token:', token);

      // Memulai proses pembayaran menggunakan Snap.js
      window.snap.pay(token, {
        onSuccess: async function (result) {
          console.log('Payment success:', result);
          notification.success({
            message: 'Pembayaran Berhasil',
            description: 'Pesanan Anda telah berhasil dibayar.',
          });
          handleModalClose(); // Tutup modal setelah sukses
        },
        onPending: function (result) {
          console.log('Payment pending:', result);
          notification.info({
            message: 'Pembayaran Tertunda',
            description: 'Pembayaran Anda dalam proses. Silakan cek kembali nanti.',
          });
        },
        onError: function (error) {
          console.error('Payment error:', error);
          notification.error({
            message: 'Pembayaran Gagal',
            description: 'Terjadi kesalahan saat memproses pembayaran.',
          });
        },
        onClose: function () {
          console.log('Payment popup closed');
        },
      });
    } catch (error) {
      console.error('Payment initiation error:', error);
      notification.error({
        message: 'Kesalahan',
        description: error.message,
      });
    }
  };
  //end-midtrans-method

  return (
    <div
      className='layout-content'
      style={{ padding: '20px', position: 'relative' }}
    >
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <Spin size='large' />
        </div>
      ) : (
        <Row
          gutter={[24, 0]}
          style={{ marginTop: '20px' }}
        >
          <Col
            xs={24}
            md={12}
          >
            <Card
              bordered={false}
              style={{ textAlign: 'center' }}
            >
              <img
                src={productData?.foto_produk ? `${import.meta.env.VITE_REACT_APP_API_URL}/storage/foto_produk/${productData.foto_produk}` : ''}
                alt={productData?.Nama_produk || 'Product Image'}
                style={{
                  width: '100px',
                  marginBottom: '12px',
                  display: 'block',
                  margin: '0 auto',
                }}
              />
              <Title level={4}>{productData?.Nama_produk || 'Nama Produk'}</Title>
              <div
                style={{ textAlign: 'left' }}
                dangerouslySetInnerHTML={{
                  __html: productData?.detail_produk || 'Deskripsi produk tidak tersedia',
                }}
              />
            </Card>
          </Col>
          <Col
            xs={24}
            md={12}
          >
            <Form
              form={form}
              onFinish={handleSubmit}
              layout='vertical'
            >
              <Card bordered={false}>
                <Form.Item
                  name='No_telepon'
                  label='No Handphone / User ID'
                  rules={[{ required: true, message: 'Nomor handphone diperlukan' }]}
                >
                  <Input placeholder='Masukkan Nomor Handphone' />
                </Form.Item>
                <div style={{ marginBottom: '20px' }}>
                  <Text>Pilih layanan</Text>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '10px',
                      marginTop: '8px',
                    }}
                  >
                    {layananOptions.map((layanan) => (
                      <Button
                        key={layanan.value}
                        type={selectedlayanan?.value === layanan.value ? 'primary' : 'default'}
                        onClick={() => setSelectedlayanan(layanan)}
                      >
                        {layanan.label}
                      </Button>
                    ))}
                  </div>
                </div>
                <Form.Item>
                  <Text style={{ fontSize: '16px', fontWeight: 'bold' }}>{selectedlayanan ? `Harga: ${priceToIDR(selectedlayanan.price)}` : 'Harga'}</Text>
                </Form.Item>
                <Button
                  type='primary'
                  htmlType='submit'
                  block
                  disabled={!selectedlayanan || loading}
                >
                  {loading ? <Spin size='small' /> : 'BELI SEKARANG'}
                </Button>
              </Card>
            </Form>
          </Col>
        </Row>
      )}
      {orderData && (
        <Modal
          title='Konfirmasi Pembayaran'
          visible={isModalVisible}
          onCancel={handleModalClose}
          footer={null}
          centered
          bodyStyle={{
            padding: '20px',
            textAlign: 'center',
            backgroundColor: '#f4f6f8',
            borderRadius: '12px',
          }}
        >
          <div
            style={{
              padding: '20px',
              backgroundColor: '#fff',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div
              style={{
                backgroundColor: '#ffe58f',
                color: '#faad14',
                fontWeight: 'bold',
                fontSize: '16px',
                padding: '5px 10px',
                borderRadius: '8px',
                marginBottom: '20px',
              }}
            >
              PENDING
            </div>
            <div>
              <Text style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                <b>ID Transaksi:</b> {orderData.Id_orderan}
              </Text>
              <Text style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                <b>User ID / Nomor Handphone:</b> {orderData.No_telepon}
              </Text>
              <Text style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                <b>Produk:</b> {orderData.Pesanan}
              </Text>
              <Text style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                <b>Total Harga:</b> {priceToIDR(orderData.Harga)}
              </Text>
            </div>
            <Button
              type='primary'
              style={{
                marginTop: '20px',
                width: '100%',
                backgroundColor: '#1890ff',
                borderColor: '#1890ff',
              }}
              onClick={handlePaymentAndClose}
            >
              Pembayaran
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Nonzone;
