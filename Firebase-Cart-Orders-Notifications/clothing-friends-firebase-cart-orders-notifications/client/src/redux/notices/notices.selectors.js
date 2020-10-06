import { createSelector } from 'reselect';

const selectNotices = state => state.notices;

export const selectCurrentNotices = createSelector(
    [selectNotices],
    notices => notices
);