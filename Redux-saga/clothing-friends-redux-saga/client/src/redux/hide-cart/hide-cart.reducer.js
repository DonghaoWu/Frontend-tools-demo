import { TOGGLE_CART_HIDDEN } from './hide-cart.types';

const INITIAL_STATE = {
    hidden: true,
};

const hiddenCartReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case TOGGLE_CART_HIDDEN:
            return {
                ...state,
                hidden: !state.hidden
            };
        default:
            return state;
    }
};

export default hiddenCartReducer;