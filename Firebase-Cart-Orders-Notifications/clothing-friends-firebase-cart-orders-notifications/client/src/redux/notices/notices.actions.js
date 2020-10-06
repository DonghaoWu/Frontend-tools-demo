import {
    ADD_NOTICE,
    REMOVE_NOTICE
} from './notices.types';

export const addNotice = (msg, noticeType, id) => {
    return {
        type: ADD_NOTICE,
        payload: {
            msg: msg,
            noticeType: noticeType,
            id: id
        }
    }
}

export const removeNotice = (id) => {
    return {
        type: REMOVE_NOTICE,
        payload: id
    }
};