import { takeLatest, put, all, call, delay, takeEvery } from 'redux-saga/effects';

import {
    SIGN_IN_SUCCESS,
    SIGN_IN_FAILURE,
    SIGN_OUT_SUCCESS,
    SIGN_OUT_FAILURE,
    EMAIL_SIGN_UP_SUCCESS,
    EMAIL_SIGN_UP_FAILURE,
} from '../user/user.types';

import { ORDER_PLACED_SUCCESS, ORDER_PLACED_FAILURE } from '../orders/orders.types';

import { v4 as uuid } from 'uuid';
import { addNotice, removeNotice } from './notices.actions';

export function* handleNotifications({ action, msg, status }) {
    const id = uuid();
    if (action) {
        yield put(addNotice(`${msg}: ${action.payload.message}`, status, id));
    }
    else yield put(addNotice(`${msg}`, status, id));
    yield delay(2500);
    yield put(removeNotice(id));
}

export function* signInSuccessNotice() {
    yield handleNotifications({
        action: null,
        msg: 'Sign in success',
        status: 'success'
    })
}

export function* onSignInSuccess() {
    yield takeLatest(SIGN_IN_SUCCESS, signInSuccessNotice);
}

export function* signInFailureNotice(action) {
    yield handleNotifications({
        action,
        msg: 'Sign in failure',
        status: 'danger'
    })
}

export function* onSignInFailure() {
    yield takeEvery(SIGN_IN_FAILURE, signInFailureNotice);
}

export function* signOutSuccessNotice() {
    yield handleNotifications({
        action: null,
        msg: 'Sign out success',
        status: 'success'
    })
}

export function* onSignOutSuccess() {
    yield takeLatest(SIGN_OUT_SUCCESS, signOutSuccessNotice);
}

export function* signOutFailureNotice(action) {
    yield handleNotifications({
        action,
        msg: 'Sign out failure',
        status: 'danger'
    })
}

export function* onSignOutFailure() {
    yield takeLatest(SIGN_OUT_FAILURE, signOutFailureNotice);
}

export function* emailSignUpSuccessNotice() {
    yield handleNotifications({
        action: null,
        msg: 'Email sign up success',
        status: 'success'
    })
}

export function* onEmailSignUpSuccess() {
    yield takeLatest(EMAIL_SIGN_UP_SUCCESS, emailSignUpSuccessNotice);
}

export function* emailSignUpFailureNotice(action) {
    yield handleNotifications({
        action,
        msg: 'Email sign up failure',
        status: 'danger'
    })
}

export function* onEmailSignUpFailure() {
    yield takeEvery(EMAIL_SIGN_UP_FAILURE, emailSignUpFailureNotice);
}

export function* orderPlacedSuccessNotice() {
    yield handleNotifications({
        action: null,
        msg: 'Order placed success',
        status: 'success'
    })
}

export function* onOrderPlacedSuccess() {
    yield takeLatest(ORDER_PLACED_SUCCESS, orderPlacedSuccessNotice);
}

export function* orderPlacedFailureNotice(action) {
    yield handleNotifications({
        action,
        msg: 'Order placed failure',
        status: 'danger'
    })
}

export function* onOrderPlacedFailure() {
    yield takeLatest(ORDER_PLACED_FAILURE, orderPlacedFailureNotice);
}

export function* noticesSagas() {
    yield all([
        call(onSignInSuccess),
        call(onSignInFailure),
        call(onSignOutSuccess),
        call(onSignOutFailure),
        call(onOrderPlacedSuccess),
        call(onOrderPlacedFailure),
        call(onEmailSignUpSuccess),
        call(onEmailSignUpFailure)
    ]);
}