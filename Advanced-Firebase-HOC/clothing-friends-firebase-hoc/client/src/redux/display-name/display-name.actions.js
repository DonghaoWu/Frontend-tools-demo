import { SET_DISPLAY_NAME } from './display-name.types';

export const setDisplayName = displayName => {
    return {
        type: SET_DISPLAY_NAME,
        payload: displayName
    }
};