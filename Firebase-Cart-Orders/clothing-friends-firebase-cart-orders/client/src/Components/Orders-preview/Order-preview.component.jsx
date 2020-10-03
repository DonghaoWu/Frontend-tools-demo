import React from 'react';

import './Order-preview.styles.scss';
import OrderItem from '../Order-item/Order-item.component'

const OrderPreview = ({ time, orderItems }) => {
    return (
        <div className='order-preview'>
            <h1 className='title'>{time}</h1>
            <div className='preview'>
                {
                    orderItems.map(item => (
                        <OrderItem key={item.id} item={item} />
                    ))
                }
            </div>
        </div>
    )
};

export default OrderPreview;