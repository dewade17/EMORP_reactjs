import { Col, Row, Typography, Card, Button, Form, Input, Table, Space, Select, notification, Modal, Popconfirm, FloatButton } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { getDataPrivate, sendDataPrivate, deleteDataPrivateJSON } from '../../../utils/api'; // Sesuaikan path dengan utils Anda

const { Title, Text } = Typography;

const Layananproduk = () => {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [isModal, setIsModal] = useState(false);
  const [layananProdukData, setLayananProdukData] = useState([]);
  const [produkData, setProdukData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [kategoriData, setKategoriData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [editId, setEditId] = useState(null); // Ganti dari editIndex ke editId

  // eslint-disable-next-line no-unused-vars
  const formatRupiah = (angka, prefix) => {
    const rupiah = parseInt(angka).toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR',
    });
    return rupiah;
  };

  useEffect(() => {
    fetchLayananProduk();
    fetchProdukData();
    fetchKategoriData();
  }, []);

  const fetchLayananProduk = async () => {
    try {
      const response = await getDataPrivate('layanan-produk');
      setLayananProdukData(response);
    } catch {
      showAlert('error', 'Fetch Error', 'Unable to fetch data from server');
    }
  };

  const fetchProdukData = async () => {
    try {
      const response = await getDataPrivate('produk');
      setProdukData(response);
    } catch {
      showAlert('error', 'Fetch Failed', 'Failed to load Produk data');
    }
  };

  const handleModalCancel = () => {
    setIsModal(false);
    form.resetFields();
    setEditIndex(null);
  };

  const handleModal = (id) => {
    setEditId(id); // Set editId instead of editIndex
    const data = layananProdukData.find((item) => item.Id_layananproduk === id);
    if (data) {
      form.setFieldsValue({
        name: data.Nama_layananproduk || '',
        kategori: data.Id_kategori || '',
        produk: data.Id_produk || '',
        kode_layanan: data.Kode_layananproduk || '',
        harga: data.harga || '',
      });
    }
    setIsModal(true);
  };

  const showAlert = (status, title, description) => {
    api[status]({
      message: title,
      description,
    });
  };

  const columns = [
    {
      title: 'No',
      dataIndex: 'key',
      rowScope: 'row',
    },
    {
      title: 'Name',
      dataIndex: 'Nama_layananproduk',
      key: 'name',
    },
    {
      title: 'Kategori',
      dataIndex: ['kategori', 'Nama_kategori'], // Correctly maps to the category name
      key: 'kategori',
    },

    {
      title: 'Produk',
      dataIndex: ['produk', 'Nama_produk'],
      key: 'produk',
    },
    {
      title: 'Kode Layanan',
      dataIndex: 'Kode_layananproduk',
      key: 'kode_layanan',
    },
    {
      title: 'Harga',
      dataIndex: 'harga',
      key: 'harga',
      render: (harga) => <Text>{formatRupiah(harga)}</Text>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size='middle'>
          <Button
            type='primary'
            icon={<EditOutlined />}
            size='large'
            onClick={() => handleModal(record.Id_layananproduk)}
          />
          <Popconfirm
            title={`Are you sure to delete "${record.Nama_layananproduk}"?`}
            okText='Yes'
            cancelText='No'
            onConfirm={() => handleDelete(record.Id_layananproduk)}
          >
            <Button
              type='primary'
              icon={<DeleteOutlined />}
              size='large'
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleDelete = async (id) => {
    try {
      await deleteDataPrivateJSON(`/layanan-produk/${id}`);
      showAlert('success', 'Deleted', 'Product has been deleted');
      fetchLayananProduk();
    } catch {
      showAlert('error', 'Delete Error', 'Unable to delete product');
    }
  };

  const fetchKategoriData = async () => {
    try {
      const response = await getDataPrivate('kategori');
      setKategoriData(response);
    } catch {
      showAlert('error', 'Fetch Failed', 'Failed to load kategori data');
    }
  };

  const handleSubmitModal = () => {
    form.validateFields().then(async (values) => {
      const formData = new FormData();
      formData.append('Nama_layananproduk', values.name);
      formData.append('Id_kategori', values.kategori);
      formData.append('Id_produk', values.produk);
      formData.append('Kode_layananproduk', values.kode_layanan);
      formData.append('harga', values.harga);

      const url = editId !== null ? `layanan-produk/${editId}` : 'layanan-produk'; // Gunakan editId
      try {
        if (editId !== null) {
          await sendDataPrivate(url, formData, 'POST');
          showAlert('success', 'Updated', 'Layana product information has been updated');
        } else {
          await sendDataPrivate(url, formData, 'POST');
          showAlert('success', 'Added', 'New layanan product has been added');
        }
        fetchLayananProduk();
        handleModalCancel();
      } catch {
        showAlert('error', 'Save Error', 'Unable to save product information');
      }
    });
  };

  const renderModal = () => (
    <Modal
      title={editIndex !== null ? 'Edit Layanan Produk' : 'Add Layanan Produk'}
      open={isModal}
      onOk={handleSubmitModal}
      onCancel={handleModalCancel}
    >
      <Form
        layout='vertical'
        form={form}
      >
        <Form.Item
          name='name'
          label='Nama Layanan :'
          rules={[{ required: true }]}
        >
          <Input placeholder='Input layanan' />
        </Form.Item>
        <Form.Item
          label='Select Kategori'
          name='kategori'
          rules={[{ required: true, message: 'Kategori is required' }]}
        >
          <Select placeholder='Pilih Satu!'>
            {kategoriData.map((item) => (
              <Select.Option
                key={item.Id_kategori}
                value={item.Id_kategori}
              >
                {item.Nama_kategori}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name='produk'
          label='Select Produk'
          rules={[{ required: true }]}
        >
          <Select placeholder='Pilih Satu !'>
            {produkData.map((item) => (
              <Select.Option
                key={item.Id_produk}
                value={item.Id_produk}
              >
                {item.Nama_produk}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name='kode_layanan'
          label='Kode Layanan :'
          rules={[{ required: true }]}
        >
          <Input placeholder='Input kode layanan' />
        </Form.Item>
        <Form.Item
          name='harga'
          label='Harga :'
          rules={[{ required: true, message: 'Harga is required' }]}
        >
          <Input placeholder='Input Harga :' />
        </Form.Item>
      </Form>
    </Modal>
  );

  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
  };

  const filteredData = layananProdukData.filter((item) => {
    return item.Nama_layananproduk.toLowerCase().includes(searchText) || (item.produk && item.produk.Nama_produk.toLowerCase().includes(searchText));
  });

  const tableData = filteredData.map((item) => ({
    key: item.Id_layananproduk, // Gunakan Id_layananproduk sebagai key unik
    ...item,
  }));

  return (
    <div className='layout-content'>
      <Row
        gutter={[24, 0]}
        style={{ justifyContent: 'center' }}
      >
        <Col
          xs={22}
          className='mb-24'
        >
          <Card
            bordered={false}
            className='criclebox h-full w-full'
          >
            <Title>Layanan Produk</Title>
            <Text style={{ fontSize: '12pt' }}>Add & List layanan produk</Text>
          </Card>
        </Col>
        <Col
          xs={22}
          className='mb-24'
        >
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
          <Card>
            <Title>List Layanan Produk</Title>
            <Table
              columns={columns}
              dataSource={tableData}
              scroll={{ x: 'max-content' }}
            />
          </Card>
        </Col>
        {contextHolder}
        {renderModal()}
        <FloatButton
          tooltip={<div>Add Produk</div>}
          onClick={() => handleModal(null)}
        />
      </Row>
    </div>
  );
};

export default Layananproduk;
