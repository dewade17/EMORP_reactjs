import { Col, Row, Typography, Card, Button, Form, Input, Table, Space, notification, Popconfirm, Modal } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { getDataPrivate, sendDataPrivate, deleteDataPrivateJSON } from '../../../utils/api'; // Sesuaikan path dengan utils Anda

const { Title, Text } = Typography;

const Kategori = () => {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [isModal, setIsModal] = useState(false);
  const [kategoriData, setKategoriData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

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
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        console.log('Record in Action column:', record),
        (
          <Space size='middle'>
            <Button
              type='primary'
              icon={<EditOutlined />}
              size='large'
              onClick={() => handleDrawer(record.id)} // Use id instead of Id_kategori
            />
            <Popconfirm
              title='Delete the task'
              description={`Are you sure to delete "${record.name}"?`}
              okText='Yes'
              cancelText='No'
              onConfirm={() => handleDelete(record.id)} // Use id instead of Id_kategori
            >
              <Button
                type='primary'
                icon={<DeleteOutlined />}
                size='large'
              />
            </Popconfirm>
          </Space>
        )
      ),
    },
  ];

  const data = kategoriData.map((item) => ({
    key: item.Id_kategori,
    id: item.Id_kategori,
    name: item.Nama_kategori,
  }));

  const showAlert = (status, title, description) => {
    api[status]({
      message: title,
      description: description,
    });
  };

  const handleModalCancel = () => {
    setIsModal(false);
    form.resetFields();
    setEditId(null);
  };

  const fetchKategoriData = async () => {
    setLoading(true);
    try {
      const response = await getDataPrivate('kategori');
      setKategoriData(response);
    } catch {
      showAlert('error', 'Fetch Failed', 'Failed to load kategori data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKategoriData();
  }, []);

  const handleSubmit = async () => {
    const kategori = form.getFieldValue('kategori');
    if (!kategori) {
      showAlert('error', 'Submit Failed', 'Kategori is required');
      return;
    }

    console.log('Submitting for id:', editId);

    const formData = new FormData();
    formData.append('Nama_kategori', kategori);

    const url = editId !== null ? `kategori/${editId}` : 'kategori';

    try {
      await sendDataPrivate(url, formData);
      form.resetFields();
      showAlert('success', 'Success', editId !== null ? 'Kategori Updated' : 'Kategori Tersimpan');
      setEditId(null);
      setIsModal(false);
      fetchKategoriData();
    } catch {
      showAlert('error', 'Submit Failed', 'Failed to save kategori');
    }
  };

  const handleDrawer = (id) => {
    console.log('Editing id:', id);
    setEditId(id);
    const data = kategoriData.find((item) => item.Id_kategori === id);
    form.setFieldsValue({ kategori: data.Nama_kategori });
    setIsModal(true);
  };

  const handleDelete = async (id) => {
    console.log('Deleting id:', id);
    try {
      await deleteDataPrivateJSON(`kategori/${id}`);
      showAlert('success', 'Success', 'Kategori Deleted');
      fetchKategoriData();
    } catch {
      showAlert('error', 'Delete Failed', 'Failed to delete kategori');
    }
  };

  const renderModal = () => {
    return (
      <Modal
        title={editId !== null ? 'Edit Kategori' : 'Add Kategori'}
        open={isModal}
        onOk={handleSubmit}
        onCancel={handleModalCancel}
      >
        <Form
          layout='vertical'
          form={form}
        >
          <Form.Item
            label='Kategori :'
            name='kategori'
            rules={[{ required: true, message: 'Kategori is required' }]}
          >
            <Input placeholder='input kategori' />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  return (
    <div className='layout-content'>
      {contextHolder}
      {renderModal()}
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
            <Title>Kategori</Title>
            <Text style={{ fontSize: '12pt' }}>Add Kategori & List Kategori</Text>
          </Card>
        </Col>
        <Col
          xs={22}
          className='mb-24'
        >
          <Card>
            <Title>Add Kategori</Title>
            <Form
              layout='vertical'
              form={form}
            >
              <Form.Item
                label='Kategori :'
                name='kategori'
                rules={[{ required: true, message: 'Kategori is required' }]}
              >
                <Input placeholder='input kategori' />
              </Form.Item>
              <Form.Item>
                <Button
                  type='primary'
                  onClick={handleSubmit}
                  htmlType='submit'
                >
                  {editId !== null ? 'Update' : 'Submit'}
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
              dataSource={data}
              loading={loading}
              scroll={{ x: 'max-content' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Kategori;
