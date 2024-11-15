import { Col, Row, Typography, Card, Table } from 'antd';
import { useLocation } from 'react-router-dom';

const { Title, Text } = Typography;

const Order = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];

  const annualOrdersData = [
    {
      key: '1',
      produk: 'Qetela',
      qty: 32,
      price: 'Rp. 1.000',
    },
    {
      key: '2',
      produk: 'Lays',
      qty: 42,
      price: 'Rp. 2.000',
    },
  ];

  const monthlyOrdersData = [
    {
      key: '1',
      produk: 'UltraMilk',
      qty: 50,
      price: 'Rp. 8.000',
    },
    {
      key: '2',
      produk: 'Milo',
      qty: 22,
      price: 'Rp. 5.000',
    },
  ];

  const columns = [
    {
      title: 'Produk',
      dataIndex: 'produk',
      key: 'produk',
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
  ];

  return (
    <div className="layout-content">
      <Row gutter={[24, 0]}>
        <Col xs={22} className="mb-24">
          <Card bordered={false} className="criclebox h-full w-full">
            <Title>Blank Page {lastSegment}</Title>
            <Text style={{ fontSize: '12pt' }}>Add content here</Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 0]}>
        <Col xs={24} lg={12} className="mb-24">
          <Card bordered={false} className="criclebox h-full w-full">
            <Title level={4}>Annual Orders</Title>
            <p>Data Orders in Annuals</p>
            <Table dataSource={annualOrdersData} columns={columns} pagination={false} />
          </Card>
        </Col>

        <Col xs={24} lg={12} className="mb-24">
          <Card bordered={false} className="criclebox h-full w-full">
            <Title level={4}>Monthly Orders</Title>
            <p>Data Orders for this month</p>
            <Table dataSource={monthlyOrdersData} columns={columns} pagination={false} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Order;
