import { createSelector } from 'reselect';

const selectDisplayName = state => state.displayName;

export const selectInputDisplayName = createSelector(
    [selectDisplayName],
    displayName => displayName.input
);