import { all, call, takeLatest, put, select } from 'redux-saga/effects';

import { getUserCartRef } from '../../firebase/firebase.utils';

import { SIGN_OUT_SUCCESS, SIGN_IN_SUCCESS } from '../user/user.types';
import { ADD_ITEM, REMOVE_ITEM, CLEAR_ITEM_FROM_CART, ORDER_SUCCESS_CLEAR_CART } from './cart.types';

import { clearCart, setCartFromFirebase } from './cart.actions';

import { selectCurrentUser } from '../user/user.selectors';
import { selectCartItems } from './cart.selectors';

export function* clearCartOnSignOut() {
    yield put(clearCart());
};

export function* onSignOutSuccess() {
    yield takeLatest(SIGN_OUT_SUCCESS, clearCartOnSignOut)
};

export function* checkCartFromFirebase({ payload: user }) {
    const cartRef = yield getUserCartRef(user.id);
    const cartSnapshot = yield cartRef.get();
    yield put(setCartFromFirebase(cartSnapshot.data().cartItems));
};

export function* onUserSignInSuccess() {
    yield takeLatest(SIGN_IN_SUCCESS, checkCartFromFirebase);
};

export function* updateCartInFirebase() {
    const currentUser = yield select(selectCurrentUser);
    if (currentUser) {
        try {
            const cartRef = yield getUserCartRef(currentUser.id);
            const cartItems = yield select(selectCartItems);
            yield cartRef.update({ cartItems });
        } catch (error) {
            console.log(error);
        }
    }
};

export function* onCartChange() {
    yield takeLatest(
        [
            ADD_ITEM,
            REMOVE_ITEM,
            CLEAR_ITEM_FROM_CART,
            ORDER_SUCCESS_CLEAR_CART
        ],
        updateCartInFirebase
    );
};

export function* cartSagas() {
    yield all([call(onSignOutSuccess), call(onCartChange), call(onUserSignInSuccess)]);
}