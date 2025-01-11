import { Col, Row, Typography, Card, Button, Form, Input, Table, Space, Select, notification, Modal, Popconfirm, FloatButton, Upload, Image } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, Bold, Essentials, Heading, Indent, IndentBlock, Italic, Link as CkLink, List, MediaEmbed, Paragraph, Table as CkTable, Undo } from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import { useState, useEffect } from 'react';

import { getDataPrivate, sendDataPrivate, deleteDataPrivateJSON } from '../../../utils/api';

const { Title, Text } = Typography;

const Produk = () => {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [isModal, setIsModal] = useState(false);
  const [produkData, setProdukData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editorData, setEditorData] = useState('');
  const [kategoriData, setKategoriData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchProdukData();
    fetchKategoriData();
  }, []);

  const fetchProdukData = async () => {
    try {
      const response = await getDataPrivate('produk');
      setProdukData(response);
    } catch {
      showAlert('error', 'Fetch Failed', 'Failed to load Produk data');
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

  const handleModal = (id) => {
    setEditId(id);
    if (id !== null) {
      const selectedData = produkData.find((item) => item.Id_produk === id);
      form.setFieldsValue({
        namaProduk: selectedData.Nama_produk,
        kategori: selectedData.Id_kategori,
        detailProduk: selectedData.detail_produk,
        standarisasi: selectedData.standar,
      });
      setEditorData(selectedData.detail_produk);
    } else {
      form.resetFields();
      setEditorData('');
    }
    setIsModal(true);
  };

  const handleModalCancel = () => {
    setIsModal(false);
    form.resetFields();
    setEditorData('');
    setEditIndex(null);
  };

  const handleSubmitModal = async () => {
    form.validateFields().then(async (values) => {
      const url = editId !== null ? `produk/${editId}` : 'produk';

      const formData = new FormData();
      formData.append('Nama_produk', values.namaProduk);
      formData.append('Id_kategori', values.kategori);
      formData.append('detail_produk', values.detailProduk);
      formData.append('standar', values.standarisasi);

      const file = values.upload?.[0]?.originFileObj; // Get the raw file object
      console.log('Uploaded file:', file);

      if (file) {
        // Add the file to FormData if a new file is uploaded
        formData.append('foto_produk', file);
      } else if (editId === null) {
        // For a new product without an uploaded file, handle this case as an error or warning
        console.warn('No file uploaded for a new product.');
      }

      // Log all key-value pairs in FormData
      for (let [key, value] of formData.entries()) {
        if (key === 'foto_produk') {
          console.log(`${key}:`, value instanceof File ? value.name : value); // Show file name if it's a File object
        } else {
          console.log(`${key}:`, value);
        }
      }

      try {
        const response = await sendDataPrivate(url, formData);
        console.log('API Response:', response);
        showAlert('success', 'Success', `Produk ${editId !== null ? 'Updated' : 'Added'}`);
        fetchProdukData();
        setIsModal(false);
        form.resetFields();
        setEditId(null);
      } catch (error) {
        console.error('API Error:', error);
        showAlert('error', 'Failed', `Failed to ${editId !== null ? 'update' : 'add'} Produk`);
      }
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteDataPrivateJSON(`produk/${id}`);
      showAlert('success', 'Success', 'Produk Deleted');
      fetchProdukData();
    } catch {
      showAlert('error', 'Failed', 'Failed to delete Produk');
    }
  };
  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
  };

  const filteredData = produkData.filter((item) => item?.Nama_produk.toLowerCase().includes(searchText) || item?.detail_produk.toLowerCase().includes(searchText));

  const renderModal = () => (
    <Modal
      title={editIndex !== null ? 'Edit Produk' : 'Add Produk'}
      open={isModal}
      onOk={handleSubmitModal}
      onCancel={handleModalCancel}
    >
      <Form
        layout='vertical'
        form={form}
      >
        <Form.Item
          label='Nama Produk :'
          name='namaProduk'
          rules={[{ required: true, message: 'Nama Produk is required' }]}
        >
          <Input placeholder='Input Produk' />
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
          label='Detail Produk :'
          name='detailProduk'
          rules={[{ required: true, message: 'Detail Produk is required' }]}
        >
          <CKEditor
            editor={ClassicEditor}
            config={{
              toolbar: ['undo', 'redo', '|', 'heading', '|', 'bold', 'italic', '|', 'link', 'insertTable', 'mediaEmbed', '|', 'bulletedList', 'numberedList', 'indent', 'outdent'],
              plugins: [Bold, Essentials, Heading, Indent, IndentBlock, Italic, CkLink, List, MediaEmbed, Paragraph, CkTable, Undo],
            }}
            data={editorData}
            onChange={(event, editor) => {
              const data = editor.getData();
              setEditorData(data);
              form.setFieldsValue({ detailProduk: data });
            }}
          />
        </Form.Item>
        <Form.Item
          label='Select Standarisasi'
          name='standarisasi'
          rules={[{ required: true, message: 'Standarisasi is required' }]}
        >
          <Select placeholder='Pilih Satu!'>
            <Select.Option value='zona'>Zona</Select.Option>
            <Select.Option value='non_zona'>Non Zona</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label='Upload Foto Produk'
          name='upload'
          valuePropName='fileList'
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e?.fileList;
          }}
        >
          {editId !== null && produkData.find((item) => item.Id_produk === editId)?.foto_produk && !form.getFieldValue('upload')?.length && (
            <Image
              width={100}
              style={{ marginBottom: 16 }}
              src={`${import.meta.env.VITE_REACT_APP_API_URL}/storage/foto_produk/${produkData.find((item) => item.Id_produk === editId)?.foto_produk}`}
              alt='Foto Produk'
            />
          )}
          <Upload
            listType='picture-card'
            beforeUpload={(file) => {
              const isValidType = ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type);
              if (!isValidType) {
                notification.error({
                  message: 'Invalid File Type',
                  description: 'Only JPG, PNG, and JPEG file types are allowed.',
                });
              }
              return isValidType || Upload.LIST_IGNORE; // Ignore files with invalid types
            }}
            maxCount={1}
            onChange={(info) => {
              const fileList = info.fileList;
              form.setFieldsValue({ upload: fileList });
            }}
            onRemove={() => {
              form.setFieldsValue({ upload: null });
            }}
            onPreview={(file) => {
              window.open(URL.createObjectURL(file.originFileObj));
            }}
          >
            <button
              type='button'
              style={{
                border: 0,
                background: 'none',
              }}
            >
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload Foto</div>
            </button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );

  const columns = [
    {
      title: 'No',
      dataIndex: 'key',
      rowScope: 'row',
    },
    {
      title: 'Name',
      dataIndex: 'Nama_produk',
      key: 'Nama_produk',
    },
    {
      title: 'Kategori',
      dataIndex: ['kategori', 'Nama_kategori'],
      key: 'kategori',
    },
    {
      title: 'Detail produk',
      dataIndex: 'detail_produk',
      key: 'detail_produk',
      render: (text) => <div dangerouslySetInnerHTML={{ __html: text }} />,
    },
    {
      title: 'Standarisasi',
      dataIndex: 'standar',
      key: 'standar',
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
            onClick={() => handleModal(record.Id_produk)}
          />
          <Popconfirm
            title={`Are you sure to delete "${record.Nama_produk}"?`}
            okText='Yes'
            cancelText='No'
            onConfirm={() => handleDelete(record.Id_produk)}
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

  const tableData = filteredData.map((item) => ({
    key: item.Id_produk, // Use Id_produk as the key
    ...item,
  }));

  const showAlert = (status, title, description) => {
    api[status]({
      message: title,
      description,
    });
  };

  return (
    <div className='layout-content'>
      <Row gutter={[24, 0]}>
        <Col
          xs={22}
          className='mb-24'
        >
          <Card
            bordered={false}
            className='circlebox h-full w-full'
          >
            <Title>Produk</Title>
            <Text style={{ fontSize: '12pt' }}>Add Produk & List Produk</Text>
          </Card>
        </Col>
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
        <Col
          xs={22}
          className='mb-24'
        >
          <Card>
            <Title>List Produk</Title>
            <Table
              columns={columns}
              dataSource={tableData}
              scroll={{ x: 'max-content' }}
            />
          </Card>
        </Col>
        {contextHolder}
        {renderModal()}
      </Row>
      <FloatButton
        tooltip={<div>Add Produk</div>}
        onClick={() => handleModal(null)}
      />
    </div>
  );
};

export default Produk;
