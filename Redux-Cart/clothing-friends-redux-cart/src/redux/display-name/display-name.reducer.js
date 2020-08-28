import { SET_DISPLAY_NAME } from './display-name.types';

const INITIAL_STATE = {
    input: null
};

const displayNameReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SET_DISPLAY_NAME:
            return {
                ...state,
                input: action.payload
            };
        default:
            return state;
    }
};

export default displayNameReducer;