import { createSelector } from 'reselect';

const selectHiddenCart = state => state.hideCart;

export const selectCurrentHiddenCart = createSelector(
    [selectHiddenCart],
    hideCart => hideCart.hidden
);