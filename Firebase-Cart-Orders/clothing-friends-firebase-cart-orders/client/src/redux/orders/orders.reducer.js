import { SET_ORDERS_FROM_FIREBASE, ORDER_PLACED_SUCCESS, ORDER_PLACED_FAILURE } from './orders.types';

const INITIAL_STATE = {
    ordersList: [],
    error: null
};

const ordersReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SET_ORDERS_FROM_FIREBASE:
            return {
                ...state,
                ordersList: action.payload
            };
        case ORDER_PLACED_SUCCESS:
            console.log('=====>',action.payload)
            return {
                ...state,
                ordersList: action.payload,
                error: null
            };
        case ORDER_PLACED_FAILURE:
            return {
                ...state,
                error: action.payload
            }
        default:
            return state;
    }
};

export default ordersReducer;