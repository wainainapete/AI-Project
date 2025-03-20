import React from 'react';
import { Badge, Typography, Space } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';

const CartIcon = ({ count }) => {
  return (
    <Space align="center">
      <Badge count={count} style={{ backgroundColor: 'orange', color: 'white' }}>
        <ShoppingCartOutlined style={{ fontSize: '24px' }} />
      </Badge>
      <Typography.Text>Cart</Typography.Text>
    </Space>
  );
};

export default CartIcon;