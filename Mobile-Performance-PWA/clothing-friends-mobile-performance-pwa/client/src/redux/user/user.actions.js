import {
    GOOGLE_SIGN_IN_SIGN_UP_START,
    EMAIL_SIGN_IN_START,
    SIGN_IN_SUCCESS,
    SIGN_IN_FAILURE,
    CHECK_USER_SESSION,
    SIGN_OUT_START,
    SIGN_OUT_SUCCESS,
    SIGN_OUT_FAILURE,
    EMAIL_SIGN_UP_START,
    EMAIL_SIGN_UP_FAILURE,
    EMAIL_SIGN_UP_SUCCESS,
} from './user.types'

export const googleSignInOrSignUpStart = () => ({
    type: GOOGLE_SIGN_IN_SIGN_UP_START
});

export const emailSignInStart = emailAndPassword => ({
    type: EMAIL_SIGN_IN_START,
    payload: emailAndPassword
});

export const signInSuccess = user => ({
    type: SIGN_IN_SUCCESS,
    payload: user
});

export const signInFailure = error => {
    return {
        type: SIGN_IN_FAILURE,
        payload: error
    }
};

export const checkUserSession = () => ({
    type: CHECK_USER_SESSION
});

export const signOutStart = (history) => ({
    type: SIGN_OUT_START,
    payload: history
});

export const signOutSuccess = () => ({
    type: SIGN_OUT_SUCCESS
});

export const signOutFailure = error => ({
    type: SIGN_OUT_FAILURE,
    payload: error
});

export const emailSignUpStart = (userCredentials) => {
    return {
        type: EMAIL_SIGN_UP_START,
        payload: userCredentials
    }
}

export const emailSignUpSuccess = ({ userAuth, displayName }) => {
    return {
        type: EMAIL_SIGN_UP_SUCCESS,
        payload: { userAuth, displayName }
    }
}

export const emailSignUpFailure = (error) => {
    return {
        type: EMAIL_SIGN_UP_FAILURE,
        payload: error
    }
}