import { takeLatest, put, all, call, delay } from 'redux-saga/effects';

import {
    SIGN_IN_SUCCESS,
    SIGN_IN_FAILURE,
    SIGN_OUT_SUCCESS,
    EMAIL_SIGN_UP_SUCCESS,
    GOOGLE_SIGN_IN_SIGN_UP_START
} from '../user/user.types';

import { v4 as uuid } from 'uuid'

import { notice, remove } from './notices.actions';

export function* setNotice() {
    const id = uuid();
    yield put(notice(id));
    yield delay(2000);
    yield put(remove(id));
}

export function* onSignInSuccess() {
    yield takeLatest(SIGN_IN_SUCCESS, setNotice);
}

export function* noticesSagas() {
    yield all([
        call(onSignInSuccess),
    ]);
}