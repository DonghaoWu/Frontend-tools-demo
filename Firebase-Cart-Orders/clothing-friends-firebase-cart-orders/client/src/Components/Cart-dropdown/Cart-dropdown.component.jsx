import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import CustomButton from '../Custom-button/Custom-button.component';
import CartItem from '../Cart-item/Cart-item.component';

import { selectCartItems } from '../../redux/cart/cart.selectors';
import { selectCurrentHiddenCart } from '../../redux/hide-cart/hide-cart.selectors';
import { toggleCartHidden } from '../../redux/hide-cart/hide-cart.actions';

import './Cart-dropdown.styles.scss';

class CartDropdown extends React.Component {

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside, false);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside, false);
    }

    handleClickOutside = (event) => {
        const { cartHidden, toggleCartHidden } = this.props;
        if (event.target.className === 'cart-icon' ||
            event.target.className === 'item-count' ||
            event.target.className === 'shopping-icon' ||
            event.target.tagName === 'svg' ||
            event.target.tagName === 'path') {
            return;
        }
        else if (this.node.contains(event.target)) return;
        else if (!cartHidden) toggleCartHidden();
    }

    render() {
        const { toggleCartHidden, cartItems, history } = this.props;
        return (
            <div ref={node => this.node = node} className='cart-dropdown'>
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
        )
    }
};

const mapStateToProps = createStructuredSelector({
    cartItems: selectCartItems,
    cartHidden: selectCurrentHiddenCart
});

const mapDispatchToProps = dispatch => {
    return {
        toggleCartHidden: () => dispatch(toggleCartHidden())
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CartDropdown));
