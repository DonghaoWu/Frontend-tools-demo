import { takeLatest, put, all, call } from 'redux-saga/effects';

import {
    GOOGLE_SIGN_IN_START,
    EMAIL_SIGN_IN_START,
    CHECK_USER_SESSION,
    SIGN_OUT_START,
    SIGN_UP_START,
    SIGN_UP_SUCCESS
} from './user.types'

import {
    signInSuccess,
    signInFailure,
    signOutSuccess,
    signOutFailure,
    signUpSuccess,
    signUpFailure
} from './user.actions';

import {
    auth,
    googleProvider,
    getUserInFirestoreForUserSaga,
    createUserInFirestoreForUserSaga,
    googleSignInOrSignUpForUserSaga,
    getCurrentUser
} from '../../firebase/firebase.utils';

export function* getSnapshotFromUserAuth(authMethod, userAuth, additionalData) {
    try {
        const userRef = yield call(
            authMethod,
            userAuth,
            additionalData
        );
        const userSnapshot = yield userRef.get();
        yield put(signInSuccess({ id: userSnapshot.id, ...userSnapshot.data() }));
    } catch (error) {
        yield put(signInFailure(error));
    }
}

export function* signInOrSignUpWithGoogle() {
    try {
        const { userAuth } = yield auth.signInWithPopup(googleProvider);
        yield getSnapshotFromUserAuth(googleSignInOrSignUpForUserSaga, userAuth, userAuth.displayName);
    } catch (error) {
        yield put(signInFailure(error));
    }
}

export function* signInWithEmail({ payload: { email, password } }) {
    try {
        const { userAuth } = yield auth.signInWithEmailAndPassword(email, password);
        if (!userAuth) return;
        yield getSnapshotFromUserAuth(getUserInFirestoreForUserSaga, userAuth);
    } catch (error) {
        yield put(signInFailure(error));
    }
}

export function* isUserAuthenticated() {
    try {
        const userAuth = yield getCurrentUser();
        if (!userAuth) return;
        yield getSnapshotFromUserAuth(getUserInFirestoreForUserSaga, userAuth);
    } catch (error) {
        yield put(signInFailure(error));
    }
}

export function* signOut() {
    try {
        yield auth.signOut();
        yield put(signOutSuccess());
    } catch (error) {
        yield put(signOutFailure(error));
    }
}

export function* signUp(userCredentials) {
    const { payload } = userCredentials;
    const { email, password, displayName } = payload;

    try {
        const { user } = yield auth.createUserWithEmailAndPassword(email, password);
        yield put(signUpSuccess({ user, displayName }));
    } catch (error) {
        yield put(signUpFailure(error));
    }
}

export function* signInAfterSignUp(info) {
    const { payload } = info;
    const { user, displayName } = payload;
    yield getSnapshotFromUserAuth(createUserInFirestoreForUserSaga, user, displayName);
}

export function* onGoogleSignInOrSignUpStart() {
    yield takeLatest(GOOGLE_SIGN_IN_START, signInOrSignUpWithGoogle);
}

export function* onEmailSignInStart() {
    yield takeLatest(EMAIL_SIGN_IN_START, signInWithEmail);
}

export function* onCheckUserSession() {
    yield takeLatest(CHECK_USER_SESSION, isUserAuthenticated);
}

export function* onSignOutStart() {
    yield takeLatest(SIGN_OUT_START, signOut);
}

export function* onSignUpStart() {
    yield takeLatest(SIGN_UP_START, signUp)
}

export function* onSignUpSuccess() {
    yield takeLatest(SIGN_UP_SUCCESS, signInAfterSignUp);
}

export function* userSagas() {
    yield all([
        call(onGoogleSignInOrSignUpStart),
        call(onEmailSignInStart),
        call(onCheckUserSession),
        call(onSignOutStart),
        call(onSignUpStart),
        call(onSignUpSuccess)
    ]);
}