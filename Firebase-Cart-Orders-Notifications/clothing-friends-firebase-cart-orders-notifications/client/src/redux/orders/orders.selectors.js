import { createSelector } from 'reselect';

const selectOrders = state => state.orders;

export const selectCurrentOrders = createSelector(
    [selectOrders],
    orders => orders.ordersList
);