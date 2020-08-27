import { createSelector } from 'reselect';

const selectDisplayName = state => state.displayName;

export const selectCurrentDisplayName = createSelector(
    [selectDisplayName],
    displayName => displayName.input
);