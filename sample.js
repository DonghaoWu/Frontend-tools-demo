const obj = {
    title: 'Hats',
    items: [
        {
            id: 1,
            name: 'Brown Brim',
            imageUrl: 'https://i.ibb.co/ZYW3VTp/brown-brim.png',
            price: 25
        }
    ]
}

import React from 'react';

import { SpinnerContainer, SpinnerOverlay } from './with-spinner.styles.scss';

const WithSpinner = (WrappedComponent) => {
    const Spinner = ({ isLoading, ...otherProps }) => {
        isLoadig ? (
            <SpinnerOverlay>
                <SPinnerContainer />
            </SpinnerOverlay>
        ) : (
                <WrappedComponent {...otherProps} />
            )
    }
    return Spinner;
}

// <Route exact path="/signin">{currentUser ? <Redirect to="/" /> : <SignInAndSignUpPage />}</Route>

// <Route exact path="/signin" component={SignInAndSignUpPage} />

export function* onEmailSignInStart() {
    yield takeLatest(EMAIL_SIGN_IN_START, signInWithEmail);
}

export function* signInWithEmail(action) {
    const { payload } = action;
    const { email, passowrd } = payload;
    try {
        const res = yield auth.signInWithEmailAndPassword(email, password);
        const userAuth = res.user;
        yield getSnapshotFromUserAuth(getUserFromFirestoreForUserSaga, userAuth);
    } catch (error) {
        yield put(signInFailure(error));
    }
}