import React from 'react';
import { Link, withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { auth } from '../../firebase/firebase.utils';

import CartIcon from '../Cart-icon/Cart-icon.component';
import CartDropdown from '../Cart-dropdown/Cart-dropdown.component';
import { selectCurrentHiddenCart } from '../../redux/hide-cart/hide-cart.selectors';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { clearCart } from '../../redux/cart/cart.actions'

import { ReactComponent as Logo } from '../../assets/crown.svg';

import './Header.styles.scss';

const Header = ({ currentUser, history, hidden, clearCart }) => {

  const signOut = async () => {
    await auth.signOut();
    clearCart();
    history.push("/signin");
  }

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
        <Link className='option' to='/'>
          HOME
      </Link>
        <Link className='option' to='/shop'>
          SHOP
      </Link>
        <Link className='option' to='/shop'>
          CONTACT
      </Link>
        {currentUser ? (
          <Link to='/signin'>
            <div className='option' onClick={() => signOut()}>
              SIGN OUT
        </div>
          </Link>
        ) : (
            <Link className='option' to='/signin'>
              SIGN IN
        </Link>
          )}
        <CartIcon />
      </div>
      {hidden ? null : <CartDropdown />}
    </div>
  )
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  hidden: selectCurrentHiddenCart
});

const mapDispatchToProps = dispatch => {
  return {
    clearCart: () => dispatch(clearCart())
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));