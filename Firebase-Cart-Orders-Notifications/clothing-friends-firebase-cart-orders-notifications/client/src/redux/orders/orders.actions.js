import {
    ORDER_PLACED_START,
    ORDER_PLACED_SUCCESS,
    ORDER_PLACED_FAILURE,
    SET_ORDERS_FROM_FIREBASE
} from './orders.types';

export const orderPlacedStart = (orderItems, history) => ({
    type: ORDER_PLACED_START,
    payload: orderItems,
    history: history
});

export const orderPlacedSuccess = orders => {
    return {
        type: ORDER_PLACED_SUCCESS,
        payload: orders
    }
};

export const orderPlacedFailure = (error) => {
    return {
        type: ORDER_PLACED_FAILURE,
        payload: error
    }
};

export const setOrdersFromFirebase = orders => {
    return {
        type: SET_ORDERS_FROM_FIREBASE,
        payload: orders
    }
};