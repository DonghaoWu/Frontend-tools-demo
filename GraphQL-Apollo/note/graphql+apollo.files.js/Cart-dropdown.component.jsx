import React from 'react';
import { withRouter } from 'react-router-dom';

import CustomButton from '../Custom-button/Custom-button.component';
import CartItem from '../Cart-item/Cart-item.component';

import './Cart-dropdown.styles.scss';

const CartDropdown = ({ cartItems, history, toggleCartHidden }) => (
    <div className='cart-dropdown'>
        <div className='cart-items'>
            {cartItems.length ? (
                cartItems.map(cartItem => (
                    <CartItem key={cartItem.id} item={cartItem} />
                ))
            ) : (
                    <span className='empty-message'>Your cart is empty</span>
                )}
        </div>
        <CustomButton
            onClick={() => {
                history.push('/checkout');
                toggleCartHidden();
            }}
        >
            GO TO CHECKOUT
    </CustomButton>
    </div>
);

export default withRouter(CartDropdown);