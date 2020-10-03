import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';

import { orderPlacedStart } from '../../redux/orders/orders.actions';

const StripeCheckoutButton = ({ price, orderItems, orderPlacedStart, history }) => {
    const priceForStripe = price * 100;
    const publishableKey = 'pk_test_51HLupsCbpGGT0rI7hrSbq3oI4boGToq9OnsqjO6mwc3SKlApYWFZU2KkOlMwl1gSJmhxT20PUsfWXrM2XIuHEuJ50085O63Qvj';

    const onToken = token => {
        axios({
            url: 'payment',
            method: 'post',
            data: {
                amount: priceForStripe,
                token: token
            }
        })
            .then(response => {
                console.log('here is StripeCheckoutButton', response);
                orderPlacedStart(orderItems, history);
            })
            .then(response => {
                // alert('succesful payment');
            })
            .catch(error => {
                console.log('Payment Error: ', error);
                alert(
                    'There was an issue with your payment! Please make sure you use the provided credit card.'
                );
            });
    };

    return (
        <StripeCheckout
            label='Pay Now'
            name='Clothing Friends.'
            billingAddress
            shippingAddress
            image='https://svgshare.com/i/CUz.svg'
            description={`Your total is $${price}`}
            amount={priceForStripe}
            panelLabel='Pay Now'
            token={onToken}
            stripeKey={publishableKey}
        />
    );
};

const mapDispatchToProps = dispatch => ({
    orderPlacedStart: (orderItems, history) => dispatch(orderPlacedStart(orderItems,history))
});

export default withRouter(connect(null, mapDispatchToProps)(StripeCheckoutButton));