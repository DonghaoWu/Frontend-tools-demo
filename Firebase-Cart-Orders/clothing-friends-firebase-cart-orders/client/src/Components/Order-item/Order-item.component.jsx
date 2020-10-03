import React from 'react';

import './Order-item.styles.scss';

const OrderItem = ({ item }) => {
    const { name, imageUrl, quantity } = item;

    return (
        <div className='order-item'>
            <div className='image' style={{ backgroundImage: `url(${imageUrl})` }} />
            <div className='collection-footer'>
                <span className='name'>{name}</span>
                <span className='price'>{quantity}</span>
            </div>
        </div>
    );
};

export default OrderItem;