/* eslint-disable react/prop-types */
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

// import { useState } from "react";
import { Menu } from 'antd';
import { NavLink } from 'react-router-dom';

import { useState } from 'react';
import { DollarOutlined, FundOutlined, PieChartOutlined, ProductOutlined, UnorderedListOutlined, DeliveredProcedureOutlined, SoundOutlined } from '@ant-design/icons';

function Sidenav({ color }) {
  const [selectedKey, setSelectedKey] = useState('1');

  const dashboard = [
    <svg
      width='20'
      height='20'
      viewBox='0 0 20 20'
      xmlns='http://www.w3.org/2000/svg'
      key={0}
    >
      <path
        d='M3 4C3 3.44772 3.44772 3 4 3H16C16.5523 3 17 3.44772 17 4V6C17 6.55228 16.5523 7 16 7H4C3.44772 7 3 6.55228 3 6V4Z'
        fill={color}
      ></path>
      <path
        d='M3 10C3 9.44771 3.44772 9 4 9H10C10.5523 9 11 9.44771 11 10V16C11 16.5523 10.5523 17 10 17H4C3.44772 17 3 16.5523 3 16V10Z'
        fill={color}
      ></path>
      <path
        d='M14 9C13.4477 9 13 9.44771 13 10V16C13 16.5523 13.4477 17 14 17H16C16.5523 17 17 16.5523 17 16V10C17 9.44771 16.5523 9 16 9H14Z'
        fill={color}
      ></path>
    </svg>,
  ];

  const menuItems = [
    {
      key: '/dashboard-admin',
      label: (
        <NavLink to='/dashboard-admin'>
          <span
            className='icon'
            style={{
              backgroundColor: selectedKey === 'dashboard' ? '#f0f2f5' : '',
            }}
          >
            {dashboard}
          </span>
          <span className='label'>Dashboard</span>
        </NavLink>
      ),
    },
    {
      key: '4',
      label: 'Store',
      className: 'menu-item-header',
    },
    {
      key: '/categories',
      label: (
        <NavLink to='/Categories'>
          <span
            className='icon'
            style={{
              backgroundColor: selectedKey === 'categories' ? '#f0f2f5' : '',
            }}
          >
            <UnorderedListOutlined />
          </span>
          <span className='label'>Categories</span>
        </NavLink>
      ),
    },
    {
      key: '/produk',
      label: (
        <NavLink to='/produk'>
          <span
            className='icon'
            style={{
              backgroundColor: selectedKey === 'produk' ? '#f0f2f5' : '',
            }}
          >
            <ProductOutlined />
          </span>
          <span className='label'>Produk</span>
        </NavLink>
      ),
    },
    {
      key: '/layanan-produk',
      label: (
        <NavLink to='/layanan-produk'>
          <span
            className='icon'
            style={{
              backgroundColor: selectedKey === 'products' ? '#f0f2f5' : '',
            }}
          >
            <DeliveredProcedureOutlined />
          </span>
          <span className='label'>Layanan Produk</span>
        </NavLink>
      ),
    },
    {
      key: '5',
      label: 'Reports',
      className: 'menu-item-header',
    },
    {
      key: '/order',
      label: (
        <NavLink to='/order'>
          <span
            className='icon'
            style={{
              backgroundColor: selectedKey === 'summary' ? '#f0f2f5' : '',
            }}
          >
            <PieChartOutlined />
          </span>
          <span className='label'>Order</span>
        </NavLink>
      ),
    },
    {
      key: '/layanan-tertinggi',
      label: (
        <NavLink to='/layanan-tertinggi'>
          <span
            className='icon'
            style={{
              backgroundColor: selectedKey === 'product-sales-report' ? '#f0f2f5' : '',
            }}
          >
            <DollarOutlined />
          </span>
          <span className='label'>Rangking Produk</span>
        </NavLink>
      ),
    },
    {
      key: '/layanan-pengaduan',
      label: (
        <NavLink to='/layanan-pengaduan'>
          <span
            className='icon'
            style={{
              backgroundColor: selectedKey === 'report-orders' ? '#f0f2f5' : '',
            }}
          >
            <FundOutlined />
          </span>
          <span className='label'>Layanan Pengaduan</span>
        </NavLink>
      ),
    },
  ];

  const handleMenuKey = (key) => {
    setSelectedKey(key);
  };

  return (
    <>
      <div className='brand'>
        <span>Ganeshop.com</span>
      </div>
      <hr />
      <Menu
        theme='dark'
        mode='inline'
        items={menuItems}
        defaultSelectedKeys={[selectedKey]} // Set default selected keys
        onSelect={handleMenuKey}
      />
    </>
  );
}

export default Sidenav;
