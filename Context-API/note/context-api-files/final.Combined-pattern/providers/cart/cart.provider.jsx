import React, { createContext, useState, useEffect } from 'react';

import { addItemToCart, removeItemFromCart, filterItemFromCart, getCartItemsCount, getCartTotal } from './cart.utils'

export const CartContext = createContext({
    displayName: undefined,
    hidden: true,
    cartItems: [],
    cartItemsCount: 0,
    cartTotal: 0,
    toggleHidden: () => { },
    addItem: () => { },
    removeItem: () => { },
    clearItemFromCart: () => { }
});

const CartProvider = ({ children }) => {
    const [displayName, setDisplayName] = useState(undefined);
    const [hidden, setHidden] = useState(true);
    const [cartItems, setCartItems] = useState([]);
    const [cartItemsCount, setCartItemsCount] = useState(0);
    const [cartTotal, setCartTotal] = useState(0);

    const setDisplayNameFromSignUp = (name) => {
        return setDisplayName(name);
    }
    const toggleHidden = () => setHidden(!hidden);
    const addItem = item => {
        return setCartItems(addItemToCart(cartItems, item));
    }
    const removeItem = item => {
        return setCartItems(removeItemFromCart(cartItems, item));
    }
    const clearItemFromCart = item =>
        setCartItems(filterItemFromCart(cartItems, item));

    const clearCart = () => setCartItems([]);

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
            clearItemFromCart,
            cartItemsCount,
            cartTotal,
            setDisplayNameFromSignUp,
            displayName,
            clearCart
        }}>
        {children}</CartContext.Provider>
}

export default CartProvider;