import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import OrderPreview from '../Orders-preview/Order-preview.component';

import { selectCurrentOrders } from '../../redux/orders/orders.selectors';

import './Orders-overview.styles.scss';

const OrdersOverview = ({ orders }) => {
    return (
        <div className='orders-overview'>
            <h1 className='orders-title'>Orders Overview</h1>
            {
                orders.map(({ createdAt, orderItems }) => {
                    let time = createdAt.toDate ? createdAt.toDate().toString() : createdAt.toString();
                    return (
                        <OrderPreview
                            key={createdAt}
                            orderItems={orderItems}
                            time={time} />
                    )
                })
            }
        </div>
    )
};

const mapStateToProps = createStructuredSelector({
    orders: selectCurrentOrders
});

export default connect(mapStateToProps)(OrdersOverview);