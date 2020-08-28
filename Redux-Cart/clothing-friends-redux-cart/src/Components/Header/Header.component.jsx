import React from 'react';
import { Link, withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { auth } from '../../firebase/firebase.utils';

import CartIcon from '../Cart-icon/Cart-icon.component';
import CartDropdown from '../Cart-dropdown/Cart-dropdown.component';
import { selectCartHidden } from '../../redux/cart/cart.selectors';
import { selectCurrentUser } from '../../redux/user/user.selectors';

import { ReactComponent as Logo } from '../../assets/crown.svg';

import './Header.styles.scss';

const Header = ({ currentUser, history, hidden }) => {

  const signOut = async () => {
    await auth.signOut();
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
  hidden: selectCartHidden
});

export default withRouter(connect(mapStateToProps)(Header));