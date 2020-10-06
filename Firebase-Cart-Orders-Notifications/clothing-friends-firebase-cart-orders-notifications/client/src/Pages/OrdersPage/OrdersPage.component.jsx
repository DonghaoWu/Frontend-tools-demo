import React from 'react';

import OrdersOverview from '../../Components/Order-overview/Order-overview.component'

import './OrdersPage.styles.scss';

const OrdersPage = () => {
  return (
    <div className='orders-container'>
      <OrdersOverview />
    </div>
  )
};

export default OrdersPage;