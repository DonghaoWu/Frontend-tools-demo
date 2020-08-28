import { combineReducers } from 'redux';

import userReducer from './user/user.reducer';
import cartReducer from './cart/cart.reducer';
import displayNameReducer from './display-name/display-name.reducer';

export default combineReducers({
    user: userReducer,
    cart: cartReducer,
    displayName: displayNameReducer
});
