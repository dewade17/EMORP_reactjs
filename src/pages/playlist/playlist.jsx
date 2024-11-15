import { Col, Row, Typography, Card, FloatButton, Form, notification, Modal, Input, List, Popconfirm, Select, Tooltip } from 'antd';
import { CustomerServiceOutlined, EditOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { ellipsisGenerator } from '../../utils/ui';
import { useEffect, useState } from 'react';
import { getData, sendData, deleteData } from '../../utils/api';
import Introplaylist from './intro';

const { Title, Text } = Typography;

const Playlist = () => {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [isModal, setIsModal] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [idSelected, setIdSelected] = useState(null);
  const [isModalIntro, setIsModalIntro] = useState(false);
  useEffect(() => {
    getDataPlaylist();
  }, []);

  const handleQuestion = () => {
    setIsModalIntro(true);
  };

  const handleModalCancel = () => {
    setIsModal(false);
    form.resetFields();
  };

  const handleModal = () => {
    setIsModal(true);
    setIsEdit(false);
  };

  const showAlert = (status, title, description) => {
    api[status]({
      message: title,
      description,
    });
  };

  const getDataPlaylist = async () => {
    try {
      const resp = await getData('/api/playlist/9');
      if (resp && resp.datas && Array.isArray(resp.datas)) {
        setDataSource(resp.datas);
      } else {
        setDataSource([]);
        console.error('Expected an array in "datas" property but received:', resp);
      }
    } catch (err) {
      console.error('Error fetching playlist data:', err);
    }
  };

  const renderModal = () => {
    return (
      <Modal
        title={isEdit ? 'Edit Playlist' : 'Add Playlist'}
        open={isModal}
        onOk={handleSubmit}
        onCancel={handleModalCancel}
      >
        <Form
          layout='vertical'
          form={form}
        >
          <Form.Item
            label='Title Video'
            name='play_name'
            rules={[{ required: true, message: 'Title Video is required' }]}
          >
            <Input placeholder='Please Input Title Video' />
          </Form.Item>
          <Form.Item
            label='Genre Video'
            name='play_genre'
            rules={[{ required: true, message: 'Genre Video is required' }]}
          >
            <Select placeholder='Pilih Genre'>
              <Select.Option value='1'>Music</Select.Option>
              <Select.Option value='2'>Song</Select.Option>
              <Select.Option value='3'>Movie</Select.Option>
              <Select.Option value='4'>Education</Select.Option>
              <Select.Option value='5'>others</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label='Url Video'
            name='play_url'
            rules={[{ required: true, message: 'Url Video is required' }]}
          >
            <Input.TextArea
              rows={3}
              placeholder='Copy Video address'
            />
          </Form.Item>
          <Form.Item
            label='Description Video'
            name='play_description'
            rules={[{ required: true, message: 'Description Video is required' }]}
          >
            <Input.TextArea
              rows={3}
              placeholder='Please Input Description'
            />
          </Form.Item>
          <Form.Item
            label='Thumbnail Video'
            name='play_thumbnail'
            rules={[{ required: true, message: 'Thumbnail Video is required' }]}
          >
            <Input.TextArea
              rows={3}
              placeholder='Copy image address'
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  const handleModalEdit = (record) => {
    setIsModal(true);
    setIsEdit(true);
    setIdSelected(record?.id_play);

    form.setFieldValue('play_name', record?.play_name);
    form.setFieldValue('play_genre', record?.play_genre);
    form.setFieldValue('play_url', record?.play_url);
    form.setFieldValue('play_description', record?.play_description);
    form.setFieldValue('play_thumbnail', record?.play_thumbnail);
  };
  const handleSubmit = () => {
    form.validateFields().then(() => {
      const playName = form.getFieldValue('play_name');
      const genre = form.getFieldValue('play_genre');
      const urlVideo = form.getFieldValue('play_url');
      const playDescription = form.getFieldValue('play_description');
      const playThumbnail = form.getFieldValue('play_thumbnail');

      const playData = new FormData();
      playData.append('play_name', playName);
      playData.append('play_genre', genre);
      playData.append('play_url', urlVideo);
      playData.append('play_description', playDescription);
      playData.append('play_thumbnail', playThumbnail);

      let url = isEdit ? `/api/playlist/update/${idSelected}` : `/api/playlist/${9}`;

      sendData(url, playData)
        .then((resp) => {
          if (resp?.datas) {
            getDataPlaylist();
            form.resetFields();
            handleModalCancel();
            showAlert('success', 'Success', 'Data Submitted');
          } else {
            showAlert('error', 'Submit Failed', 'Data Not Submitted');
          }
        })
        .catch((err) => {
          console.log(err);
          showAlert('error', 'Submit Failed', 'Something went wrong');
        });
    });
  };

  const confirmDelete = (record_id) => {
    deleteData(`/api/playlist/${record_id}`)
      .then((resp) => {
        if (resp?.status === 200) {
          showAlert('success', 'Delete Data', 'Data berhasil terhapus');
          getDataPlaylist();
        } else {
          showAlert('error', 'Delete Data', 'Data gagal terhapus');
        }
      })
      .catch((err) => {
        console.log(err);
        showAlert('error', 'Delete Data', 'Something went wrong');
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
            className='criclebox h-full w-full'
          >
            <Title>Play List UTS</Title>
            <Text style={{ fontSize: '12pt' }}>Add & Edit PlayList</Text>
          </Card>
        </Col>
      </Row>
      <List
        grid={{ gutter: 16, xs: 1, xl: 3, sm: 1, md: 3, lg: 3 }}
        dataSource={dataSource}
        renderItem={(item) => (
          <List.Item>
            <Row
              gutter={(24, 0)}
              style={{ margin: 'auto', justifyContent: 'center' }}
            >
              <Col xs={22}>
                <Card
                  hoverable
                  style={{ width: 260 }}
                  cover={
                    <img
                      alt='data-playlist'
                      src={item?.play_thumbnail}
                    />
                  }
                  actions={[
                    <EditOutlined
                      key={item?.id_play}
                      onClick={() => handleModalEdit(item)}
                    />,
                    <Popconfirm
                      key={item?.id}
                      title='Delete the task'
                      description={`Are you sure to delete ${item?.play_description} ?`}
                      okText='Yes'
                      cancelText='No'
                      onConfirm={() => confirmDelete(item?.id_play)}
                    >
                      <DeleteOutlined key={item?.id} />
                    </Popconfirm>,
                  ]}
                >
                  <Card.Meta
                    title={<Text>{item?.play_name}</Text>}
                    description={<Text>{item?.play_genre}</Text>}
                  />
                  <a
                    href={item?.play_url}
                    target='_blank'
                  >
                    {item?.play_url}
                  </a>
                  <Text ellipsis={ellipsisGenerator(item?.play_description)}>{item?.play_description}</Text>
                  <p></p>
                </Card>
              </Col>
            </Row>
          </List.Item> // Correct closing tag for List.Item
        )}
      />
      <Tooltip title='Tambah Playlist'>
        <FloatButton
          shape='square'
          type='primary'
          style={{ insetInlineEnd: 24 }}
          icon={<CustomerServiceOutlined />}
          onClick={handleModal}
        />
      </Tooltip>
      <Tooltip title='Help'>
        <FloatButton
          icon={<QuestionCircleOutlined />}
          type='default'
          style={{ insetInlineEnd: 94 }}
          onClick={handleQuestion}
        />
      </Tooltip>
      {contextHolder}
      {renderModal()}
      {isModalIntro && <Introplaylist />}
      <Introplaylist></Introplaylist>
    </div>
  );
};

export default Playlist;
