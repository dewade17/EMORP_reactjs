import { Col, Row, Typography, Card, Flex } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import { RightOutlined, UnorderedListOutlined, InboxOutlined, FileExclamationOutlined, DeliveredProcedureOutlined } from '@ant-design/icons';
import { Divider } from 'antd/lib';

const { Title, Text } = Typography;

function Dashboard() {
  const cardDashboard = (icon, label, value) => {
    return (
      <div>
        <Row style={{ justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ marginRight: '15px' }}>{icon}</div>
          <Row style={{ alignContent: 'center', alignItems: 'center' }}>
            <div>
              <Col>
                <Title
                  level={1}
                  type={'primary'}
                  style={{ marginBottom: 0 }}
                >
                  {value}
                </Title>
              </Col>
              <Col>
                <Text type='secondary'>{label}</Text>
              </Col>
            </div>
          </Row>
        </Row>
      </div>
    );
  };
  return (
    <div className='layout-content '>
      <Row
        gutter={[24, 0]}
        style={{ justifyContent: 'center' }}
      >
        <Col
          xs={24}
          md={12}
          sm={24}
          lg={12}
          xl={12}
          className='mb-24'
        >
          <Card
            bordered={false}
            className='criclebox h-full'
          >
            <Flex
              justify='justify-between'
              style={{ justifyContent: 'space-around' }}
            >
              {cardDashboard(<UnorderedListOutlined style={{ fontSize: '64px', color: '#47c363' }} />, 'Categories', 123)}
              <div style={{ marginRight: '150px' }}></div>
              {cardDashboard(<InboxOutlined style={{ fontSize: '64px', color: '#fc544b' }} />, 'Products', 24)}
            </Flex>

            <Divider />
            <Flex
              justify='center'
              style={{ justifyContent: 'space-around' }}
            >
              {cardDashboard(<DeliveredProcedureOutlined style={{ fontSize: '64px', color: '#6777ef' }} />, 'Layanan Products', 120)}
              <div style={{ marginRight: '150px' }}></div>
              {cardDashboard(<FileExclamationOutlined style={{ fontSize: '64px', color: '#ffa426' }} />, 'Layanan Customer', 120)}
            </Flex>
            <Divider />
            <div className='h-full col-content p-20'>
              <div className='ant-muse'>
                <Text>Built by KasirBali dev. teams</Text>
                <Title level={5}>Content Management POS Systems by WebfmSI.com</Title>
                <Paragraph className='lastweek mb-36'>See the progress graph from your store.</Paragraph>
              </div>
              <div className='card-footer'>
                <a
                  className='icon-move-right'
                  href='/finance'
                  target='_blank'
                >
                  Also you able to see the Finance Reporting
                  {<RightOutlined />}
                </a>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
