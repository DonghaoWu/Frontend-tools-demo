import { all, call, takeLatest, put, select } from 'redux-saga/effects';

import { getUserOrdersRef } from '../../firebase/firebase.utils';

import { SIGN_IN_SUCCESS } from '../user/user.types';
import { ORDER_PLACED_START } from '../orders/orders.types';

import { setOrdersFromFirebase, orderPlacedSuccess, orderPlacedFailure } from './orders.actions';
import { orderSuccessClearCart } from '../cart/cart.actions';

import { selectCurrentUser } from '../user/user.selectors';
import { selectCurrentOrders } from './orders.selectors';

export function* checkOrdersFromFirebase({ payload: user }) {
    const ordersRef = yield getUserOrdersRef(user.id);
    const ordersSnapshot = yield ordersRef.get();
    yield put(setOrdersFromFirebase(ordersSnapshot.data().orders));
};

export function* onSignInSuccess() {
    yield takeLatest(SIGN_IN_SUCCESS, checkOrdersFromFirebase);
};

export function* onOrderPlacedStart() {
    yield takeLatest(ORDER_PLACED_START, updateOrdersInFirebase);
};

export function* updateOrdersInFirebase(action) {
    const orderItems = action.payload;
    const history = action.history
    const currentUser = yield select(selectCurrentUser);
    if (currentUser) {
        try {
            const ordersRef = yield getUserOrdersRef(currentUser.id);
            const orders = yield select(selectCurrentOrders);
            const newOrder = {
                createdAt: new Date(),
                orderItems
            };
            orders.unshift(newOrder);
            yield ordersRef.update({ orders });
            yield put(orderPlacedSuccess(orders));
            yield put(orderSuccessClearCart());
            history.push('/orders');
        } catch (error) {
            yield put(orderPlacedFailure(error));
            console.log(error);
        }
    }
};

export function* ordersSagas() {
    yield all([call(onSignInSuccess), call(onOrderPlacedStart)]);
}