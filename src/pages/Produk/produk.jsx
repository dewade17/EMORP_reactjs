import { Col, Row, Typography, Card, Button, Form, Input, Table, Space, Select, notification, Modal, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, Bold, Essentials, Heading, Indent, IndentBlock, Italic, Link as CkLink, List, MediaEmbed, Paragraph, Table as CkTable, Undo } from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import { useState } from 'react';

const { Title, Text } = Typography;

const Produk = () => {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [isModal, setIsModal] = useState(false);
  const [produkData, setProdukData] = useState(() => {
    const storedData = JSON.parse(localStorage.getItem('produk'));
    return Array.isArray(storedData) ? storedData : [];
  });
  const [editIndex, setEditIndex] = useState(null);
  const [tempDetailProduk, setTempDetailProduk] = useState(''); // State sementara untuk menyimpan detailProduk yang ingin diedit
  const [editorData, setEditorData] = useState(''); // State khusus untuk data CKEditor

  const handleModal = (index) => {
    setEditIndex(index);
    const selectedData = produkData[index];
    form.setFieldsValue(selectedData);
    setTempDetailProduk(selectedData.detailProduk); // Set data asli ke state sementara
    setEditorData(selectedData.detailProduk); // Set data CKEditor ke editorData
    form.setFieldsValue({ detailProduk: tempDetailProduk });
    setIsModal(true);
  };

  const handleModalCancel = () => {
    setIsModal(false);
    form.resetFields(); // Reset form fields
    setTempDetailProduk(''); // Kosongkan state sementara
    setEditorData(''); // Kosongkan data editor
  };

  const handleSubmitModal = () => {
    form.validateFields().then((values) => {
      const updatedData = [...produkData];
      updatedData[editIndex] = {
        namaProduk: values.namaProduk,
        kategori: values.kategori,
        detailProduk: values.detailProduk,
        standarisasi: values.standarisasi,
      };
      saveProdukData(updatedData);
      setIsModal(false);
      form.resetFields();
      showAlert('success', 'Success', 'Produk Updated');
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
            <Select.Option value='Pulsa & PPOB'>Pulsa & PPOB</Select.Option>
            <Select.Option value='Game & Streaming'>Game & Streaming</Select.Option>
            <Select.Option value='Sosmed'>Sosmed</Select.Option>
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
            data={editorData} // Set initial data from editorData state
            onReady={(editor) => {
              editor.setData(editorData || '<p>Isi Detail Produk!</p>');
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              setEditorData(data); // Update editorData state
              form.setFieldsValue({ detailProduk: data }); // Update form with new data
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
      dataIndex: 'namaProduk',
      key: 'namaProduk',
    },
    {
      title: 'Kategori',
      dataIndex: 'kategori',
      key: 'kategori',
    },
    {
      title: 'Detail produk',
      dataIndex: 'detailProduk',
      key: 'detailProduk',
      render: (text) => <div dangerouslySetInnerHTML={{ __html: text }} />,
    },
    {
      title: 'Standarisasi',
      dataIndex: 'standarisasi',
      key: 'standarisasi',
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
            title={`Are you sure to delete "${record.namaProduk}"?`}
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

  const data = produkData.map((item, index) => ({
    key: index + 1,
    ...item,
  }));

  const showAlert = (status, title, description) => {
    api[status]({
      message: title,
      description,
    });
  };

  const saveProdukData = (data) => {
    localStorage.setItem('produk', JSON.stringify(data));
    setProdukData(data);
  };

  const handleSubmit = () => {
    const namaProduk = form.getFieldValue('namaProduk');
    const kategori = form.getFieldValue('kategori');
    const detailProduk = form.getFieldValue('detailProduk');
    const standarisasi = form.getFieldValue('standarisasi');

    if (!namaProduk || !kategori || !detailProduk || !standarisasi) {
      showAlert('error', 'Submit Failed', 'Please fill all required fields');
      return;
    }

    let formData = new FormData();
    formData.append('namaProduk', namaProduk);
    formData.append('kategori', kategori);
    formData.append('detailProduk', detailProduk);
    formData.append('standarisasi', standarisasi);

    const updatedData = [...produkData, { namaProduk, kategori, detailProduk, standarisasi }];
    saveProdukData(updatedData);
    form.resetFields();
    showAlert('success', 'Success', 'Produk Tersimpan');
  };

  const handleDelete = (index) => {
    const updatedData = produkData.filter((_, i) => i !== index);
    saveProdukData(updatedData);
    showAlert('success', 'Success', 'Produk Deleted');
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
        <Col
          xs={22}
          className='mb-24'
        >
          <Card>
            <Title>Add Produk</Title>
            <Form
              layout='vertical'
              form={form}
            >
              <Form.Item
                label='Nama Produk :'
                name='namaProduk'
                required
              >
                <Input placeholder='Input Produk' />
              </Form.Item>
              <Form.Item
                label='Select Kategori'
                name='kategori'
                required
              >
                <Select placeholder='Pilih Satu!'>
                  <Select.Option value='Pulsa & PPOB'>Pulsa & PPOB</Select.Option>
                  <Select.Option value='Game & Streaming'>Game & Streaming</Select.Option>
                  <Select.Option value='Sosmed'>Sosmed</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name='detailProduk'
                label='Detail Produk :'
                required
              >
                <CKEditor
                  editor={ClassicEditor}
                  config={{
                    toolbar: ['undo', 'redo', '|', 'heading', '|', 'bold', 'italic', '|', 'link', 'insertTable', 'mediaEmbed', '|', 'bulletedList', 'numberedList', 'indent', 'outdent'],
                    plugins: [Bold, Essentials, Heading, Indent, IndentBlock, Italic, CkLink, List, MediaEmbed, Paragraph, CkTable, Undo],
                    initialData: '<p>Isi Detail Produk!</p>',
                  }}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    form.setFieldsValue({ detailProduk: data });
                  }}
                />
              </Form.Item>
              <Form.Item
                label='Select Standarisasi'
                name='standarisasi'
                required
              >
                <Select placeholder='Pilih Satu!'>
                  <Select.Option value='zona'>Zona</Select.Option>
                  <Select.Option value='non_zona'>Non Zona</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button
                  type='primary'
                  onClick={handleSubmit}
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
            <Title>List Produk</Title>
            <Table
              columns={columns}
              dataSource={data}
              scroll={{ x: 'max-content' }}
            />
          </Card>
        </Col>
        {contextHolder}
        {renderModal()}
      </Row>
    </div>
  );
};

export default Produk;
