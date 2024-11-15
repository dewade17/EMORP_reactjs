import { Col, Row, Typography, Card, Button, Form, Input, Table, Space, Drawer, notification, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Title, Text } = Typography;

const Kategori = () => {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [isDrawer, setIsDrawer] = useState(false);
  const [kategoriData, setKategoriData] = useState(() => {
    const storedData = JSON.parse(localStorage.getItem('kategori'));
    return Array.isArray(storedData) ? storedData : [];
  });
  const [editIndex, setEditIndex] = useState(null);

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
      render: (_, record, index) => (
        <Space size='middle'>
          <Button
            type='primary'
            icon={<EditOutlined />}
            size='large'
            onClick={() => handleDrawer(index)}
          />
          <Popconfirm
            key={index}
            title='Delete the task'
            description={`Are you sure to delete "${record.name}"?`}
            okText='Yes'
            cancelText='No'
            onConfirm={() => handleDelete(index)}
          >
            <Button
              key={index}
              type='primary'
              icon={<DeleteOutlined />}
              size='large'
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const data = kategoriData.map((item, index) => ({
    key: index + 1,
    name: item,
  }));

  const showAlert = (status, title, description) => {
    api[status]({
      message: title,
      description: description,
    });
  };

  // start-savekategori
  const saveKategoriData = (data) => {
    localStorage.setItem('kategori', JSON.stringify(data));
    setKategoriData(data);
  };
  // end-savekategori

  // start-handlesubmit
  const handleSubmit = () => {
    const kategori = form.getFieldValue('kategori');
    if (!kategori) {
      showAlert('error', 'Submit Failed', 'Kategori is required');
      return;
    }
    const updatedData = [...kategoriData, kategori];
    saveKategoriData(updatedData);
    form.resetFields();
    showAlert('success', 'Success', 'Kategori Tersimpan');
  };
  // end-handlesumbit

  // start-handledrawer
  const onCloseDrawer = () => {
    setIsDrawer(false);
  };
  const handleDrawer = (index) => {
    setEditIndex(index);
    form.setFieldsValue({ updatekategori: kategoriData[index] });
    setIsDrawer(true);
    setIsDrawer(true);
  };

  const handleSubmitEdit = () => {
    const updatedKategori = form.getFieldValue('updatekategori');
    if (!updatedKategori) {
      showAlert('error', 'Submit Failed', 'Kategori is required');
      return;
    }
    const updatedData = kategoriData.map((item, index) => (index === editIndex ? updatedKategori : item));

    saveKategoriData(updatedData);
    setIsDrawer(false);
    form.resetFields();
    showAlert('success', 'Success', 'Kategori Updated');
  };

  const renderDrawer = () => {
    return (
      <Drawer
        title='Update Kategori'
        onClose={onCloseDrawer}
        open={isDrawer}
        extra={
          <>
            <Button
              type='primary'
              onClick={() => handleSubmitEdit()}
              htmlType='submit'
            >
              Submit
            </Button>
          </>
        }
      >
        <Form
          layout='vertical'
          form={form}
        >
          <Form.Item
            label='Kategori :'
            name='updatekategori'
            required
          >
            <Input placeholder='input kategori' />
          </Form.Item>
        </Form>
      </Drawer>
    );
  };
  // End-handledrawer

  // start-handledelete
  const handleDelete = (index) => {
    const updatedData = kategoriData.filter((_, i) => i !== index);
    saveKategoriData(updatedData);
    showAlert('success', 'Success', 'Kategori Deleted');
  };
  // end-handledelete

  return (
    <div className='layout-content'>
      {/* Start-drawer */}
      {contextHolder}
      {renderDrawer()}
      {/* End-drawer */}
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
                required
              >
                <Input placeholder='input kategori' />
              </Form.Item>
              <Form.Item>
                <Button
                  type='primary'
                  onClick={() => handleSubmit()}
                  htmlType='submit'
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        {/* Start-Tabel-Kategori */}
        <Col
          xs={22}
          className='mb-24'
        >
          <Card>
            <Title>List Kategori</Title>
            <Table
              columns={columns}
              dataSource={data}
              scroll={{ x: 'max-content' }}
            />
          </Card>
        </Col>
        {/* End-Tabel-Kategori */}
      </Row>
    </div>
  );
};

export default Kategori;
