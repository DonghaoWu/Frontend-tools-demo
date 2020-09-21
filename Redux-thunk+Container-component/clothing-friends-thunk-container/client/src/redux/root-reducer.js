import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userReducer from './user/user.reducer';
import cartReducer from './cart/cart.reducer';
import displayNameReducer from './display-name/display-name.reducer';
import directoryReducer from './directory/directory.reducer';
import shopReducer from './shop/shop.reducer';
import hideCartReducer from './hide-cart/hide-cart.reducer';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['cart']
};

const rootReducer = combineReducers({
    user: userReducer,
    cart: cartReducer,
    displayName: displayNameReducer,
    directory: directoryReducer,
    shop: shopReducer,
    hideCart: hideCartReducer
});

export default persistReducer(persistConfig, rootReducer);