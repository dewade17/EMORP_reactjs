/*!
  =========================================================
  * Muse Ant Design Dashboard - v1.0.0
  =========================================================
  * Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
  * Copyright 2021 Creative Tim (https://www.creative-tim.com)
  * Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
  * Coded by Creative Tim
  =========================================================
  * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { Layout, Row, Col } from 'antd';

function Footer() {
  const { Footer: AntFooter } = Layout;

  return (
    <AntFooter style={{ background: '#fafafa' }}>
      <Row
        className=''
        style={{ justifyContent: 'center' }}
      >
        <Col
          xs={24}
          md={12}
          lg={12}
        >
          <div className='copyright'>
            © 2024, by
            <a
              href='#pablo'
              className='font-weight-bold'
              target='_blank'
            >
              E-Morp.com
            </a>
            Cepat, Aman, Top Up Sekarang!
          </div>
        </Col>
      </Row>
    </AntFooter>
  );
}

export default Footer;
