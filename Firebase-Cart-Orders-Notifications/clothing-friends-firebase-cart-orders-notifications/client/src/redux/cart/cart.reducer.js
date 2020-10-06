import {
    ADD_ITEM, 
    REMOVE_ITEM,
    CLEAR_ITEM_FROM_CART,
    CLEAR_CART,
    ORDER_SUCCESS_CLEAR_CART,
    SET_CART_FROM_FIREBASE
} from './cart.types';
import { addItemToCart, removeItemFromCart } from './cart.utils';

const INITIAL_STATE = {
    hidden: true,
    cartItems: []
};

const cartReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ADD_ITEM:
            return {
                ...state,
                cartItems: addItemToCart(state.cartItems, action.payload)
            };
        case REMOVE_ITEM:
            return {
                ...state,
                cartItems: removeItemFromCart(state.cartItems, action.payload)
            };
        case CLEAR_ITEM_FROM_CART:
            return {
                ...state,
                cartItems: state.cartItems.filter(
                    cartItem => cartItem.id !== action.payload.id
                )
            };
        case CLEAR_CART:
        case ORDER_SUCCESS_CLEAR_CART:
            return {
                ...state,
                cartItems: []
            };
        case SET_CART_FROM_FIREBASE:
            return {
                ...state,
                cartItems: action.payload
            }
        default:
            return state;
    }
};

export default cartReducer;