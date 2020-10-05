import { takeLatest, put, all, call, delay } from 'redux-saga/effects';

import {
    SIGN_IN_SUCCESS,
    SIGN_IN_FAILURE,
    SIGN_OUT_SUCCESS,
    SIGN_OUT_FAILURE,
    EMAIL_SIGN_UP_SUCCESS,
    EMAIL_SIGN_UP_FAILURE,
} from '../user/user.types';

import { ORDER_PLACED_SUCCESS, ORDER_PLACED_FAILURE } from '../orders/orders.types';

import { v4 as uuid } from 'uuid'

import { addNotice, removeNotice } from './notices.actions';

export function* signInSuccessNotice() {
    const id = uuid();
    yield put(addNotice('Sign in success', 'success', id));
    yield delay(3000);
    yield put(removeNotice(id));
}

export function* onSignInSuccess() {
    yield takeLatest(SIGN_IN_SUCCESS, signInSuccessNotice);
}

export function* signInFailureNotice() {
    const id = uuid();
    yield put(addNotice('Sign in Failure', 'danger', id));
    yield delay(3000);
    yield put(removeNotice(id));
}

export function* onSignInFailure() {
    yield takeLatest(SIGN_IN_FAILURE, signInFailureNotice);
}

export function* signOutSuccessNotice() {
    const id = uuid();
    yield put(addNotice('Sign out success', 'success', id));
    yield delay(3000);
    yield put(removeNotice(id));
}

export function* onSignOutSuccess() {
    yield takeLatest(SIGN_OUT_SUCCESS, signOutSuccessNotice);
}

export function* signOutFailureNotice() {
    const id = uuid();
    yield put(addNotice('Sign out Failure', 'danger', id));
    yield delay(3000);
    yield put(removeNotice(id));
}

export function* onSignOutFailure() {
    yield takeLatest(SIGN_OUT_FAILURE, signOutFailureNotice);
}

export function* emailSignUpSuccessNotice() {
    const id = uuid();
    yield put(addNotice('Email sign up success', 'success', id));
    yield delay(3000);
    yield put(removeNotice(id));
}

export function* onEmailSignUpSuccess() {
    yield takeLatest(EMAIL_SIGN_UP_SUCCESS, emailSignUpSuccessNotice);
}

export function* emailSignUpFailureNotice() {
    const id = uuid();
    yield put(addNotice('Email sign up Failure', 'danger', id));
    yield delay(3000);
    yield put(removeNotice(id));
}

export function* onEmailSignUpFailure() {
    yield takeLatest(EMAIL_SIGN_UP_FAILURE, emailSignUpFailureNotice);
}

export function* orderPlacedSuccessNotice() {
    const id = uuid();
    yield put(addNotice('Order placed success', 'success', id));
    yield delay(3000);
    yield put(removeNotice(id));
}

export function* onOrderPlacedSuccess() {
    yield takeLatest(ORDER_PLACED_SUCCESS, orderPlacedSuccessNotice);
}

export function* orderPlacedFailureNotice() {
    const id = uuid();
    yield put(addNotice('Order placed Failure', 'danger', id));
    yield delay(3000);
    yield put(removeNotice(id));
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