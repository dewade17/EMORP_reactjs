import { useState } from 'react';
import { Button, message, Steps, theme, Modal, Row, Col, Image } from 'antd';

const steps = [
  {
    title: 'First',
    content: '',
    paragraph: 'Ayo buat dan nikmati playlist hiburan kamu',
    image: 'src/assets/images/intro1.jpg',
  },
  {
    title: 'Second',
    paragraph: 'Buat Playlistmu disini',
    content: 'Pilih genre sesuai selera kamu dan jangan lupa menambahkan description video favoritmu',
    image: 'src/assets/images/intro2.jpg',
  },
  {
    title: 'Last',
    paragraph: 'Create, Edit & Delete',
    content: 'Kamu bisa membuat playlist, mengedit dan menghapus playlist yang kamu buat',
    image: 'src/assets/images/intro3.jpg',
  },
];

const Introplaylist = () => {
  // onDone diterima sebagai props
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const [isModalIntro, setIsModalIntro] = useState(true);

  const handleOkIntro = () => {
    setIsModalIntro(false);
  };

  const handleCancelIntro = () => {
    setIsModalIntro(false);
  };

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  const contentStyle = {
    lineHeight: '20px',
    textAlign: 'center',
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };

  return (
    <>
      <Modal
        title='Welcome to the Playlist'
        open={isModalIntro}
        onOk={handleOkIntro}
        onCancel={handleCancelIntro}
        footer={null} // Menghilangkan tombol default OK/Cancel
        width={600} // Atur lebar modal jika diperlukan
      >
        <Steps
          current={current}
          items={items}
        />
        <div style={contentStyle}>
          <Row gutter={(1, 1)}>
            <Col span={24}>
              <Image
                width='50%'
                src={steps[current]?.image}
                alt={steps[current]?.title}
                style={{ borderRadius: 8, marginTop: 16 }}
              />
              <div>
                <h3 style={{ marginTop: 8 }}>{steps[current]?.paragraph}</h3>
                <p>{steps[current]?.content}</p>
              </div>
            </Col>
          </Row>
        </div>
        <div style={{ marginTop: 24 }}>
          {current < steps.length - 1 && (
            <Button
              type='primary'
              onClick={next}
            >
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button
              type='primary'
              onClick={() => {
                message.success('Processing complete!');
                setIsModalIntro(false);
              }}
            >
              Done
            </Button>
          )}
          {current > 0 && (
            <Button
              style={{ margin: '0 8px' }}
              onClick={prev}
            >
              Previous
            </Button>
          )}
        </div>
      </Modal>
    </>
  );
};

export default Introplaylist;
