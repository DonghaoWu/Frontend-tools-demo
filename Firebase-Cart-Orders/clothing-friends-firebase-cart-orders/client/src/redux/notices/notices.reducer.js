import { ADD_NOTICE, REMOVE_NOTICE } from './notices.types';
const initialState = [];

export default function (state = initialState, action) {
    console.log('inside notices reducer');
    const { payload, type } = action;
    switch (type) {
        case ADD_NOTICE:
            console.log('in this case');
            return [...state, payload];
        case REMOVE_NOTICE:
            return state.filter(notice => notice.id !== payload);
        default:
            return state;
    }
}