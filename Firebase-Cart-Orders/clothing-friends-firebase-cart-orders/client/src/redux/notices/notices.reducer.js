import { ADD_NOTICE, REMOVE_NOTICE } from './notices.types';
const initialState = [];

export default function (state = initialState, action) {
    const { payload, type } = action;
    switch (type) {
        case ADD_NOTICE:
            return [...state, payload];
        case REMOVE_NOTICE:
            return state.filter(notice => notice.id !== payload);
        default:
            return state;
    }
}