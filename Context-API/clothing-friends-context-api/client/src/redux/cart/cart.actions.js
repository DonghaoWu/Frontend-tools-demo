import { ADD_ITEM, REMOVE_ITEM, CLEAR_ITEM_FROM_CART, CLEAR_CART } from './cart.types';

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
    type: CLEAR_CART,
});