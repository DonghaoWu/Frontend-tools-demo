import { SET_NOTICE, REMOVE_NOTICE } from './notices.types';

import { v4 as uuid } from "uuid";

// export const setNotice = (msg, noticeType) => dispatch => {
//     console.log('setNotice is working now.======>')
//     const id = uuid.v4();
//     dispatch({
//         type: SET_NOTICE,
//         payload: {
//             msg: msg,
//             noticeType: noticeType,
//             id: id
//         }
//     });

//     setTimeout(() => dispatch({
//         type: REMOVE_NOTICE,
//         payload: id,
//     }), 3000);
// }
// export const setNotice = () => {
//     console.log('hello here =======>')
//     // const id = uuid();
//     return {
//         type: SET_NOTICE,
//         payload: {
//             msg: 'success',
//             noticeType: 'success',
//             // id: id
//         }
//     }
// };

export const notice = (id) => ({
    type: SET_NOTICE,
    payload: {
        msg: 'Login success',
        noticeType: 'success',
        id: id
    }
});

export const remove = (id) => ({
    type: REMOVE_NOTICE,
    payload: id
});