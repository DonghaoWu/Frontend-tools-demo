import {
    ADD_ITEM,
    REMOVE_ITEM,
    CLEAR_ITEM_FROM_CART,
    CLEAR_CART,
    ORDER_SUCCESS_CLEAR_CART,
    UPDATE_CART_IN_FIREBASE,
    SET_CART_FROM_FIREBASE
} from './cart.types';

export const addItem = item => ({
    type: ADD_ITEM,
    payload: item
});

export const removeItem = item => ({
    type: REMOVE_ITEM,
    payload: item
});

export const clearItemFromCart = item => ({
    type: CLEAR_ITEM_FROM_CART,
    payload: item
});

export const clearCart = () => ({
    type: CLEAR_CART
});

export const orderSuccessClearCart = () => ({
    type: ORDER_SUCCESS_CLEAR_CART
});

export const updateCartInFirebase = () => ({
    type: UPDATE_CART_IN_FIREBASE
});

export const setCartFromFirebase = cartItems => {
    return {
        type: SET_CART_FROM_FIREBASE,
        payload: cartItems
    }
};