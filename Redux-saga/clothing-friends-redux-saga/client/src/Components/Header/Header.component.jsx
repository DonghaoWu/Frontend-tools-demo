import React from 'react';
import { Link, withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import CartIcon from '../Cart-icon/Cart-icon.component';
import CartDropdown from '../Cart-dropdown/Cart-dropdown.component';
import { selectCurrentHiddenCart } from '../../redux/hide-cart/hide-cart.selectors';
import { selectCurrentUser } from '../../redux/user/user.selectors';

import { signOutStart } from '../../redux/user/user.actions';

import { ReactComponent as Logo } from '../../assets/crown.svg';

import './Header.styles.scss';

const Header = ({ currentUser, history, hidden, signOutStart }) => {

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
              <div className='option' onClick={() => { signOutStart(history) }}>SIGN OUT</div>
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
  currentUser: selectCurrentUser,
  hidden: selectCurrentHiddenCart
});

const mapDispatchToProps = dispatch => {
  return {
    signOutStart: (history) => dispatch(signOutStart(history))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));