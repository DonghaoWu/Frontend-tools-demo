import { takeLatest, put, all, call } from 'redux-saga/effects';

import {
    GOOGLE_SIGN_IN_SIGN_UP_START,
    EMAIL_SIGN_IN_START,
    CHECK_USER_SESSION,
    SIGN_OUT_START,
    EMAIL_SIGN_UP_START,
    EMAIL_SIGN_UP_SUCCESS
} from './user.types'

import {
    signInSuccess,
    signInFailure,
    signOutSuccess,
    signOutFailure,
    emailSignUpSuccess,
    emailSignUpFailure
} from './user.actions';

import {
    auth,
    googleProvider,
    getUserFromFirestoreForUserSaga,
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
        const res = yield auth.signInWithPopup(googleProvider);
        const userAuth = res.user;
        yield getSnapshotFromUserAuth(googleSignInOrSignUpForUserSaga, userAuth, userAuth.displayName);
    } catch (error) {
        yield put(signInFailure(error));
    }
}

export function* signInWithEmail(action) {
    const { payload } = action;
    const { email, password } = payload;
    try {
        const res = yield auth.signInWithEmailAndPassword(email, password);
        const userAuth = res.user;
        yield getSnapshotFromUserAuth(getUserFromFirestoreForUserSaga, userAuth);
    } catch (error) {
        yield put(signInFailure(error));
    }
}

export function* isUserAuthenticated() {
    try {
        const userAuth = yield getCurrentUser();
        if (!userAuth) return;
        yield getSnapshotFromUserAuth(getUserFromFirestoreForUserSaga, userAuth);
    } catch (error) {
        yield put(signInFailure(error));
    }
}

export function* signOut(action) {
    const history = action.payload;
    try {
        yield auth.signOut();
        yield put(signOutSuccess());
        history.push('/signin');
    } catch (error) {
        yield put(signOutFailure(error));
    }
}

export function* signUpWithEmail(action) {
    const { payload } = action;
    const { email, password, displayName } = payload;
    try {
        const res = yield auth.createUserWithEmailAndPassword(email, password);
        const userAuth = res.user;
        yield put(emailSignUpSuccess({ userAuth, displayName }));
    } catch (error) {
        yield put(emailSignUpFailure(error));
    }
}

export function* signInAfterSignUp(action) {
    const { payload } = action;
    const { userAuth, displayName } = payload;
    yield getSnapshotFromUserAuth(createUserInFirestoreForUserSaga, userAuth, displayName);
}

export function* onGoogleSignInOrSignUpStart() {
    yield takeLatest(GOOGLE_SIGN_IN_SIGN_UP_START, signInOrSignUpWithGoogle);
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

export function* onEmailSignUpStart() {
    yield takeLatest(EMAIL_SIGN_UP_START, signUpWithEmail)
}

export function* onEmailSignUpSuccess() {
    yield takeLatest(EMAIL_SIGN_UP_SUCCESS, signInAfterSignUp);
}

export function* userSagas() {
    yield all([
        call(onGoogleSignInOrSignUpStart),
        call(onEmailSignInStart),
        call(onCheckUserSession),
        call(onSignOutStart),
        call(onEmailSignUpStart),
        call(onEmailSignUpSuccess)
    ]);
}