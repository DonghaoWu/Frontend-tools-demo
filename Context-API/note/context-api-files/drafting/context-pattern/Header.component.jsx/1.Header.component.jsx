import React, { useContext } from 'react';
import { Link, withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { auth } from '../../firebase/firebase.utils';

import CartIcon from '../Cart-icon/Cart-icon.component';
import CartDropdown from '../Cart-dropdown/Cart-dropdown.component';
import { selectCurrentHiddenCart } from '../../redux/hide-cart/hide-cart.selectors';
import { clearCart } from '../../redux/cart/cart.actions';

import CurrentUserContext from '../../contexts/current-user/current-user.context';

import { ReactComponent as Logo } from '../../assets/crown.svg';

import './Header.styles.scss';

const Header = ({ history, hidden, clearCart }) => {

    const signOut = async () => {
        await auth.signOut();
        clearCart();
        history.push("/signin");
    }

    const currentUser = useContext(CurrentUserContext);

    return (
        <div className='header'>
            <Link className='logo-container' to='/'>
                <Logo className='logo' />
            </Link>
            <div className='options'>
                {
                    currentUser ? (
                        <span className='option'>{`Welcome, ${currentUser.displayName}`}</span>
                    ) :
                        null
                }
                <Link className='option' to='/'>HOME</Link>
                <Link className='option' to='/shop'>SHOP</Link>
                <Link className='option' to='/shop'>CONTACT</Link>
                {
                    currentUser ?
                        (
                            <div className='option' onClick={signOut}>SIGN OUT</div>
                        )
                        :
                        (
                            <Link className='option' to='/signin'>SIGN IN</Link>
                        )
                }
                <CartIcon />
            </div>
            {hidden ? null : <CartDropdown />}
        </div>
    )
};

const mapStateToProps = createStructuredSelector({
    hidden: selectCurrentHiddenCart
});

const mapDispatchToProps = dispatch => {
    return {
        clearCart: () => dispatch(clearCart())
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));