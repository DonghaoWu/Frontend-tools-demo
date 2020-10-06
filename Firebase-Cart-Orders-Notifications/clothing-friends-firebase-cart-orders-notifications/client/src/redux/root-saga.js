import { all, call } from 'redux-saga/effects';

import { shopSagas } from './shop/shop.sagas';
import { userSagas } from './user/user.sagas';
import { cartSagas } from './cart/cart.sagas';
import { ordersSagas } from './orders/orders.sagas';
import { noticesSagas } from './notices/notices.sagas';

export default function* rootSaga() {
  yield all([
    call(shopSagas),
    call(userSagas),
    call(cartSagas),
    call(ordersSagas),
    call(noticesSagas)
  ]);
}