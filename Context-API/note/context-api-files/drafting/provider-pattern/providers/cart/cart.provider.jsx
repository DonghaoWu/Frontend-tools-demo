import React, { createContext, useState, useEffect } from 'react';

import { addItemToCart, removeItemFromCart, filterItemFromCart, getCartItemsCount, getCartTotal } from './cart.utils'

export const CartContext = createContext({
    hidden: true,
    cartItems: [],
    cartItemsCount: 0,
    cartTotal: 0,
    toggleHidden: () => { },
    addItem: () => { },
    removeItem: () => { },
    clearItemFormCart: () => { },
});

const CartProvider = ({ children }) => {
    const [hidden, setHidden] = useState(true);
    const [cartItems, setCartItems] = useState([]);
    const [cartItemsCount, setCartItemsCount] = useState(0);

    const toggleHidden = () => setHidden(!hidden);
    const addItem = item => {
        return setCartItems(addItemToCart(cartItems, item));
    }
    const removeItem = item => {
        return setCartItems(removeItemFromCart(cartItems, item));
    }
    const clearItemFromCart = item =>
        setCartItems(filterItemFromCart(cartItems, item));

    useEffect(() => {
        setCartItemsCount(getCartItemsCount(cartItems));
        setCartTotal(getCartTotal(cartItems));
    }, [cartItems]);

    return <CartContext.Provider
        value={{
            hidden,
            toggleHidden,
            cartItems,
            addItem,
            removeItem,
            clearItemFormCart,
            cartItemsCount,
            cartTotal
        }
        }>{children}</CartContext.Provider>
}

export default CartProvider;