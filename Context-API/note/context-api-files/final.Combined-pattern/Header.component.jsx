import React, { useContext } from 'react';
import { Link, withRouter } from "react-router-dom";

import { auth } from '../../firebase/firebase.utils';

import CartIcon from '../Cart-icon/Cart-icon.component';
import CartDropdown from '../Cart-dropdown/Cart-dropdown.component';

import { ReactComponent as Logo } from '../../assets/crown.svg';

import CurrentUserContext from '../../contexts/current-user/current-user.context';
import { CartContext } from '../../providers/cart/cart.provider';

import './Header.styles.scss';

const Header = ({ history }) => {

    const currentUser = useContext(CurrentUserContext);
    const { hidden, clearCart } = useContext(CartContext);

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

export default withRouter(Header);