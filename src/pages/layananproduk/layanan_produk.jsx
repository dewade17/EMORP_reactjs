import { Col, Row, Typography, Card, Button, Form, Input, Table, Space, Select, notification, Modal, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';
const { Title, Text } = Typography;

const Layananproduk = () => {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [isModal, setIsModal] = useState(false);
  const [layananProdukData, setLayananProdukData] = useState(() => {
    const storedData = JSON.parse(localStorage.getItem('layananProduk'));
    return Array.isArray(storedData) ? storedData : [];
  });
  const [editIndex, setEditIndex] = useState(null);

  const handleModalCancel = () => {
    setIsModal(false);
    form.resetFields();
  };

  const handleModal = (index) => {
    setEditIndex(index);
    form.setFieldsValue(layananProdukData[index]);
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
      dataIndex: 'name',
      key: 'name',
      render: (text) => <p>{text}</p>,
    },
    {
      title: 'Produk',
      dataIndex: 'produk',
      key: 'produk',
      render: (text) => <p>{text}</p>,
    },
    {
      title: 'Kode_layanan',
      dataIndex: 'kode_layanan',
      key: 'kode_layanan',
      render: (text) => <p>{text}</p>,
    },
    {
      title: 'Harga',
      dataIndex: 'harga',
      key: 'harga',
      render: (text) => <p>{text}</p>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record, index) => (
        <Space size='middle'>
          <Button
            type='primary'
            icon={<EditOutlined />}
            size='large'
            onClick={() => handleModal(index)}
          />
          <Popconfirm
            title={`Are you sure to delete "${record.name}"?`}
            okText='Yes'
            cancelText='No'
            onConfirm={() => handleDelete(index)}
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

  const handleDelete = (index) => {
    const updatedData = [...layananProdukData];
    updatedData.splice(index, 1);
    setLayananProdukData(updatedData);
    localStorage.setItem('layananProduk', JSON.stringify(updatedData));
    showAlert('success', 'Deleted', 'Product has been deleted');
  };

  const handleSubmitModal = () => {
    form.validateFields().then((values) => {
      const updatedData = [...layananProdukData];
      if (editIndex !== null) {
        updatedData[editIndex] = values;
        setEditIndex(null);
      } else {
        updatedData.push(values);
      }
      setLayananProdukData(updatedData);
      localStorage.setItem('layananProduk', JSON.stringify(updatedData));
      handleModalCancel();
      showAlert('success', 'Saved', 'Product information has been saved');
    });
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('produk', values.produk);
      formData.append('kode_layanan', values.kode_layanan);
      formData.append('harga', values.harga);

      const updatedData = [...layananProdukData, values];
      setLayananProdukData(updatedData);
      localStorage.setItem('layananProduk', JSON.stringify(updatedData));
      form.resetFields();
      showAlert('success', 'Added', 'New product has been added');
    });
  };

  const renderModal = () => (
    <Modal
      title='Edit Produk'
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
          label='Nama layanan :'
          rules={[{ required: true }]}
        >
          <Input placeholder='input layanan' />
        </Form.Item>
        <Form.Item
          name='produk'
          label='Select Produk'
          rules={[{ required: true }]}
        >
          <Select placeholder='Pilih Satu !'>
            <Select.Option value='Mobile Legend'>Mobile Legend</Select.Option>
            <Select.Option value='Telkomsel'>Telkomsel</Select.Option>
            <Select.Option value='PUBM'>PUBM</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name='kode_layanan'
          label='Kode layanan :'
          rules={[{ required: true }]}
        >
          <Input placeholder='input kode layanan' />
        </Form.Item>
        <Form.Item
          name='harga'
          label='Harga :'
          rules={[{ required: true }]}
        >
          <Input placeholder='input Harga' />
        </Form.Item>
      </Form>
    </Modal>
  );

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
        {/* start-Form */}
        <Col
          xs={22}
          className='mb-24'
        >
          <Card>
            <Title>Add Layanan Produk</Title>
            <Form
              layout='vertical'
              form={form}
              onFinish={handleSubmit}
            >
              <Form.Item
                name='name'
                label='Nama layanan :'
                rules={[{ required: true }]}
              >
                <Input placeholder='input layanan' />
              </Form.Item>
              <Form.Item
                name='produk'
                label='Select Produk'
                rules={[{ required: true }]}
              >
                <Select placeholder='Pilih Satu !'>
                  <Select.Option value='Mobile Legend'>Mobile Legend</Select.Option>
                  <Select.Option value='Telkomsel'>Telkomsel</Select.Option>
                  <Select.Option value='PUBM'>PUBM</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name='kode_layanan'
                label='Kode layanan :'
                rules={[{ required: true }]}
              >
                <Input placeholder='input kode layanan' />
              </Form.Item>
              <Form.Item
                name='harga'
                label='Harga :'
                rules={[{ required: true }]}
              >
                <Input placeholder='input Harga' />
              </Form.Item>
              <Form.Item>
                <Button
                  type='primary'
                  htmlType='submit'
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col
          xs={22}
          className='mb-24'
        >
          <Card>
            <Title>List Kategori</Title>
            <Table
              columns={columns}
              dataSource={layananProdukData.map((item, index) => ({ ...item, key: index + 1 }))}
              scroll={{ x: 'max-content' }}
            />
          </Card>
        </Col>
        {/* end-Form */}
        {contextHolder}
        {renderModal()}
      </Row>
    </div>
  );
};

export default Layananproduk;
