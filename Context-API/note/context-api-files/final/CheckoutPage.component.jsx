import React, { useContext } from 'react';

import CheckoutItem from '../../Components/Checkout-item/Checkout-item.component';
import StripeCheckoutButton from '../../Components/Stripe-button/Stripe-button.component';

import { CartContext } from '../../providers/cart/cart.provider.jsx';

import './CheckoutPage.styles.scss';

const CheckoutPage = () => {
    const { cartItems, cartTotal } = useContext(CartContext);
    return (
        <div className='checkout-page'>
            <div className='checkout-header'>
                <div className='header-block'>
                    <span>Product</span>
                </div>
                <div className='header-block'>
                    <span>Description</span>
                </div>
                <div className='header-block'>
                    <span>Quantity</span>
                </div>
                <div className='header-block'>
                    <span>Price</span>
                </div>
                <div className='header-block'>
                    <span>Remove</span>
                </div>
            </div>
            {cartItems.map(cartItem => (
                <CheckoutItem key={cartItem.id} cartItem={cartItem} />
            ))}
            <div className='total'>TOTAL: ${cartTotal}</div>
            <div className='test-warning'>
                *Please use the following test credit card for payments*
      <br />
                4242 4242 4242 4242 - Exp: 01/23 - CVV: 123
    </div>
            <StripeCheckoutButton price={cartTotal} />
        </div>
    );
}

export default CheckoutPage;