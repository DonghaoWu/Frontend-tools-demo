import { all, call, takeLatest, put, select } from 'redux-saga/effects';

import { getUserOrdersRef } from '../../firebase/firebase.utils';

import { SIGN_IN_SUCCESS } from '../user/user.types';
import { ORDER_PLACED_START } from '../orders/orders.types';

import { setOrdersFromFirebase, orderPlacedSuccess, orderPlacedFailure } from './orders.actions';
import { orderSuccessClearCart } from '../cart/cart.actions';

import { selectCurrentUser } from '../user/user.selectors';
import { selectCurrentOrders } from './orders.selectors';

// import { addNewOrder } from './orders.utils';

export function* checkOrdersFromFirebase({ payload: user }) {
    // console.log('checkOrdersFromFirebase working ===========>');
    const ordersRef = yield getUserOrdersRef(user.id);
    const ordersSnapshot = yield ordersRef.get();
    // console.log('in function check order', ordersSnapshot.data())
    yield put(setOrdersFromFirebase(ordersSnapshot.data().orders));
};

export function* onSignInSuccess() {
    // yield console.log('sign in success working ===========>');
    yield takeLatest(SIGN_IN_SUCCESS, checkOrdersFromFirebase);
};

export function* onOrderPlacedStart() {
    yield takeLatest(ORDER_PLACED_START, updateOrdersInFirebase);
};

export function* updateOrdersInFirebase(action) {
    const orderItems = action.payload;
    const history = action.history
    // console.log('updateOrdersInFirebase ========>', action);
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