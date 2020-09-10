// import { SET_CURRENT_USER } from './user.types';

// export const setCurrentUser = user => {
//     return {
//         type: SET_CURRENT_USER,
//         payload: user
//     }
// };

import {
    GOOGLE_SIGN_IN_START,
    EMAIL_SIGN_IN_START,
    SIGN_IN_SUCCESS,
    SIGN_IN_FAILURE,
    CHECK_USER_SESSION,
    SIGN_OUT_START,
    SIGN_OUT_SUCCESS,
    SIGN_OUT_FAILURE,
    SIGN_UP_START,
    SIGN_UP_FAILURE,
    SIGN_UP_SUCCESS,
} from './user.types'

export const googleSignInOrSignUpStart = () => ({
    type: GOOGLE_SIGN_IN_START
});

export const emailSignInStart = emailAndPassword => ({
    type: EMAIL_SIGN_IN_START,
    payload: emailAndPassword
});

export const signInSuccess = user => ({
    type: SIGN_IN_SUCCESS,
    payload: user
});

export const signInFailure = error => ({
    type: SIGN_IN_FAILURE,
    payload: error
});

export const checkUserSession = () => ({
    type: CHECK_USER_SESSION
});

export const signOutStart = () => ({
    type: SIGN_OUT_START
});

export const signOutSuccess = () => ({
    type: SIGN_OUT_SUCCESS
});

export const signOutFailure = error => ({
    type: SIGN_OUT_FAILURE,
    payload: error
});

export const signUpStart = (userCredentials) => {
    return {
        type: SIGN_UP_START,
        payload: userCredentials
    }
}

export const signUpSuccess = ({ user, displayName }) => {
    return {
        type: SIGN_UP_SUCCESS,
        payload: { user, displayName }
    }
}

export const signUpFailure = (error) => {
    console.log(error)
    return {
        type: SIGN_UP_FAILURE,
        payload: error
    }
}