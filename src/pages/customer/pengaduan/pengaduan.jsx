import { Form, Input, Button, Space, Upload, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { sendData } from '../../../utils/api'; // Pastikan fungsi ini diimpor dengan benar
import { useState } from 'react';

const Pengaduan = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  if (!visible) return null;

  const handleFinish = async (values) => {
    setLoading(true);

    try {
      // Buat FormData untuk mengelola data dan file
      const formData = new FormData();

      // Tambahkan semua field ke FormData
      formData.append('id_pesanan', values.id_pesanan);
      formData.append('tujuan', values.tujuan);
      formData.append('pesanan', values.pesanan);
      formData.append('harga', values.harga);
      formData.append('no_telepon', values.no_telepon);
      formData.append('deskripsi', values.deskripsi);

      // Tangani file upload jika ada
      if (values.upload && values.upload[0]?.originFileObj) {
        formData.append('foto_pengaduan', values.upload[0].originFileObj);
      }

      // Kirim data ke server
      await sendData('pengaduan', formData);

      // Tampilkan notifikasi sukses
      notification.success({
        message: 'Berhasil',
        description: 'Pengaduan Anda berhasil dikirim.',
        placement: 'topRight',
      });

      // Reset form dan tutup drawer
      form.resetFields();
      onClose();
    } catch (error) {
      // Tampilkan notifikasi error
      notification.error({
        message: 'Gagal',
        description: error.response?.data?.message || 'Terjadi kesalahan saat mengirim pengaduan.',
        placement: 'topRight',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Drawer Content */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '85%',
          maxWidth: '350px',
          maxHeight: '90vh',
          backgroundColor: '#051c82',
          color: 'black',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          borderRadius: '12px',
          zIndex: 1100,
          padding: '24px',
          overflowY: 'auto',
        }}
      >
        <h3 style={{ textAlign: 'center', color: 'white' }}>Customer Service</h3>
        <Form
          layout='vertical'
          form={form}
          onFinish={handleFinish}
        >
          <Form.Item
            label={<span style={{ color: 'white' }}>ID Pesanan</span>}
            name='id_pesanan'
            rules={[{ required: true, message: 'Mohon isi ID Pesanan Anda' }]}
          >
            <Input
              placeholder='Masukkan ID Pesanan Anda'
              style={{ backgroundColor: '#f0f0f0', color: 'black' }}
            />
          </Form.Item>
          <Form.Item
            label={<span style={{ color: 'white' }}>ID User / No Telepon</span>}
            name='tujuan'
            rules={[{ required: true, message: 'Mohon isi ID User/No Telepon Anda' }]}
          >
            <Input
              placeholder='Masukkan ID User/No Telepon Anda'
              style={{ backgroundColor: '#f0f0f0', color: 'black' }}
            />
          </Form.Item>
          <Form.Item
            label={<span style={{ color: 'white' }}>Pesanan</span>}
            name='pesanan'
            rules={[{ required: true, message: 'Mohon isi Nama Pesanan Anda' }]}
          >
            <Input
              placeholder='Masukkan Nama Pesanan Anda'
              style={{ backgroundColor: '#f0f0f0', color: 'black' }}
            />
          </Form.Item>
          <Form.Item
            label={<span style={{ color: 'white' }}>Harga</span>}
            name='harga'
            rules={[{ required: true, message: 'Mohon isi Harga Pesanan Anda' }]}
          >
            <Input
              placeholder='Masukkan Harga Pesanan Anda'
              style={{ backgroundColor: '#f0f0f0', color: 'black' }}
            />
          </Form.Item>
          <Form.Item
            label={<span style={{ color: 'white' }}>No Whatsapp Aktif</span>}
            name='no_telepon'
            rules={[{ required: true, message: 'Mohon isi No Whatsapp Aktif' }]}
          >
            <Input
              placeholder='Masukkan ID User/No Telepon Anda'
              style={{ backgroundColor: '#f0f0f0', color: 'black' }}
            />
          </Form.Item>
          <Form.Item
            label={<span style={{ color: 'white' }}>Deskripsi</span>}
            name='deskripsi'
          >
            <Input.TextArea
              placeholder='Tulis pesan Anda...'
              rows={4}
              style={{ backgroundColor: '#f0f0f0', color: 'black' }}
            />
          </Form.Item>
          <Form.Item
            label='Upload foto_pengaduan'
            name='upload'
            valuePropName='fileList'
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          >
            <Upload
              listType='picture-card'
              beforeUpload={() => false}
              onPreview={(file) => {
                window.open(URL.createObjectURL(file.originFileObj));
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
                <div
                  style={{
                    marginTop: 8,
                  }}
                >
                  Upload foto
                </div>
              </button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Space style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                type='primary'
                htmlType='submit'
                style={{
                  backgroundColor: '#1890ff',
                  borderColor: '#1890ff',
                  color: 'white',
                }}
                loading={loading}
              >
                Kirim
              </Button>
              <Button
                onClick={onClose}
                type='default'
                style={{
                  color: 'white',
                  borderColor: '#1890ff',
                  backgroundColor: '#1890ff',
                }}
              >
                Batal
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>

      {/* Overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
        }}
        onClick={onClose}
      />
    </>
  );
};

export default Pengaduan;
