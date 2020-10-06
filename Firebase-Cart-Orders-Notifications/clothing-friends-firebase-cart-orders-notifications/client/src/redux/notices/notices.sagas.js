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

import { v4 as uuid } from 'uuid'

import { addNotice, removeNotice } from './notices.actions';

import { setErrorMessage } from './notices.utils';

export function* signInSuccessNotice() {
    const id = uuid();
    yield put(addNotice('Sign in success', 'success', id));
    yield delay(2500);
    yield put(removeNotice(id));
}

export function* onSignInSuccess() {
    yield takeLatest(SIGN_IN_SUCCESS, signInSuccessNotice);
}

export function* signInFailureNotice(action) {
    const id = uuid();
    yield put(addNotice(`Sign in failure:  ${setErrorMessage(action.payload.code)}`, 'danger', id));
    yield delay(2500);
    yield put(removeNotice(id));
}

export function* onSignInFailure() {
    yield takeEvery(SIGN_IN_FAILURE, signInFailureNotice);
}

export function* signOutSuccessNotice() {
    const id = uuid();
    yield put(addNotice('Sign out success', 'success', id));
    yield delay(2500);
    yield put(removeNotice(id));
}

export function* onSignOutSuccess() {
    yield takeLatest(SIGN_OUT_SUCCESS, signOutSuccessNotice);
}

export function* signOutFailureNotice(action) {
    const id = uuid();
    yield put(addNotice(`Sign out failure: ${setErrorMessage(action.payload.code)}`, id));
    yield delay(2500);
    yield put(removeNotice(id));
}

export function* onSignOutFailure() {
    yield takeLatest(SIGN_OUT_FAILURE, signOutFailureNotice);
}

export function* emailSignUpSuccessNotice() {
    const id = uuid();
    yield put(addNotice('Email sign up success', 'success', id));
    yield delay(2500);
    yield put(removeNotice(id));
}

export function* onEmailSignUpSuccess() {
    yield takeLatest(EMAIL_SIGN_UP_SUCCESS, emailSignUpSuccessNotice);
}

export function* emailSignUpFailureNotice(action) {
    const id = uuid();
    yield put(addNotice(`Email sign up failure: ${setErrorMessage(action.payload.code)}`, 'danger', id));
    yield delay(2500);
    yield put(removeNotice(id));
}

export function* onEmailSignUpFailure() {
    yield takeEvery(EMAIL_SIGN_UP_FAILURE, emailSignUpFailureNotice);
}

export function* orderPlacedSuccessNotice() {
    const id = uuid();
    yield put(addNotice('Order placed success', 'success', id));
    yield delay(2500);
    yield put(removeNotice(id));
}

export function* onOrderPlacedSuccess() {
    yield takeLatest(ORDER_PLACED_SUCCESS, orderPlacedSuccessNotice);
}

export function* orderPlacedFailureNotice(action) {
    const id = uuid();
    yield put(addNotice(`Order placed failure: ${setErrorMessage(action.payload.code)}`, 'danger', id));
    yield delay(2500);
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