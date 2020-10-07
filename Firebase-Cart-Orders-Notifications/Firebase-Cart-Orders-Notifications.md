# Front end development tools (Part 14)

### `Key Words: Redux-saga, store user cart data and orders data in Firestore, Firestore data rules, notifications.`

- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/README.md)

## `Section: Firebase, Cart Orders Notifications sagas.` (Advanced)

### `Summary`: In this documentation, we learn to store user cart data and orders data in Firestore, also learn related Firestore data rules.

### `Check Dependencies & Tools:`

- redux-saga
------------------------------------------------------------

#### `本章背景：`
1. 配置 redux-saga。
2. 熟悉 redux-saga 的设置流程。
3. [Part 7: Redux-saga & configuration.](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/Redux-saga/Reudx-saga.md)
4. 其中 cart feature 新添加的功能都是在 saga 的循环里面完成的，不需要在 component 中触发。

------------------------------------------------------------

#### `Redux-saga API`
```diff

```

### <span id="14.0">`Brief Contents & codes position`</span>

- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/README.md)

- [14.1 Firebase Cart.](#14.1)
- [14.2 Firebase Orders.](#14.2)
- [14.3 Firebase Notifications.](#14.3)

------------------------------------------------------------


### <span id="14.1">`Step1: Firebase Cart.`</span>

- #### Click here: [BACK TO CONTENT](#14.0)

1. Set up types.

    __`Location:./clothing-friends-firebase-cart-orders/client/src/redux/cart/cart.types.js`__

    ```js
    export const SET_CART_FROM_FIREBASE = 'SET_CART_FROM_FIREBASE';
    ```

2. Set up actions.

    __`Location:./clothing-friends-firebase-cart-orders/client/src/redux/cart/cart.actions.js`__

    ```js
    export const setCartFromFirebase = cartItems => ({
        type: SET_CART_FROM_FIREBASE,
        payload: cartItems
    });
    ```

    __`Location:./clothing-friends-firebase-cart-orders/client/src/redux/user/user.actions.js`__

    ```js
    export const signInSuccess = user => ({
        type: SIGN_IN_SUCCESS,
        payload: user
    });
    ```

3. Set up a new firebase function to __`fetch/create`__ cart data in Firestore.

    __`Location:./clothing-friends-firebase-cart-orders/client/src/firebase/firebase.utils.js`__

    ```js
    export const getUserCartRef = async userId => {
        const cartsRef = firestore.collection('carts').where('userId', '==', userId);
        const snapShot = await cartsRef.get();

        if (snapShot.empty) {
            const cartDocRef = firestore.collection('carts').doc();
            await cartDocRef.set({ userId, cartItems: [] });
            return cartDocRef;
        } else {
            return snapShot.docs[0].ref;
        }
    };
    ```

4. Set up sagas.

    __`Location:./clothing-friends-firebase-cart-orders/client/src/redux/cart/cart.sagas.js`__

    ```js
    import { getUserCartRef } from '../../firebase/firebase.utils';

    import { SIGN_IN_SUCCESS } from '../user/user.types';
    import { ADD_ITEM, REMOVE_ITEM, CLEAR_ITEM_FROM_CART } from './cart.types';

    import { setCartFromFirebase } from './cart.actions';

    import { selectCurrentUser } from '../user/user.selectors';
    import { selectCartItems } from './cart.selectors';

    export function* checkCartFromFirebase({ payload: user }) {
        const cartRef = yield getUserCartRef(user.id);
        const cartSnapshot = yield cartRef.get();
        yield put(setCartFromFirebase(cartSnapshot.data().cartItems));
    };

    export function* onUserSignInSuccess() {
        yield takeLatest(SIGN_IN_SUCCESS, checkCartFromFirebase);
    };

    export function* updateCartInFirebase() {
        const currentUser = yield select(selectCurrentUser);
        if (currentUser) {
            try {
                const cartRef = yield getUserCartRef(currentUser.id);
                const cartItems = yield select(selectCartItems);
                yield cartRef.update({ cartItems });
            } catch (error) {
                console.log(error);
            }
        }
    };

    export function* onCartChange() {
        yield takeLatest(
            [
                ADD_ITEM,
                REMOVE_ITEM,
                CLEAR_ITEM_FROM_CART
            ],
            updateCartInFirebase
        );
    };

    export function* cartSagas() {
        yield all([call(onSignOutSuccess), call(onCartChange), call(onUserSignInSuccess)]);
    };
    ```

#### `Comment:`
1. 上面代码中跟 firebase 交流的代码：

```diff
+ const cartsRef = firestore.collection('carts').where('userId', '==', userId); // 获取

+ const cartDocRef = firestore.collection('carts').doc();
+ await cartDocRef.set({ userId, cartItems: [] }); // 新建

+ yield cartRef.update({ cartItems }); // 更新
```

2. 设计思路：

  <p align="center">
  <img src="../assets/fe-p14-01.png" width=90%>
  </p>

  -----------------------------------------------------------------

### <span id="14.2">`Step2: Firebase Orders.`</span>

- #### Click here: [BACK TO CONTENT](#14.0)

1. Related component files and scss files.

    - ./client/src/Pages/OrdersPage/OrderPage.component.jsx
    - ./client/src/Pages/OrdersPage/OrderPage.styles.scss

    - ./client/src/Components/Order-overview/Order-overview.component.jsx
    - ./client/src/Components/Order-overview/Order-overview.styles.scss

    - ./client/src/Components/Order-preview/Order-preview.component.jsx
    - ./client/src/Components/Order-preview/Order-preview.styles.scss

    - ./client/src/Components/Order-item/Order-item.component.jsx
    - ./client/src/Components/Order-item/Order-item.styles.scss

    __`Location:./client/src/Components/Order-overview/Order-overview.component.jsx`__

    ```jsx
    import React from 'react';
    import { connect } from 'react-redux';
    import { createStructuredSelector } from 'reselect';

    import OrderPreview from '../Orders-preview/Order-preview.component';

    import { selectCurrentOrders } from '../../redux/orders/orders.selectors';

    import './Orders-overview.styles.scss';

    const OrdersOverview = ({ orders }) => {
        return (
            <div className='orders-overview'>
                <h1 className='orders-title'>Orders Overview</h1>
                {
                    orders.map(({ createdAt, orderItems }) => {
                        let time = createdAt.toDate ? createdAt.toDate().toString() : createdAt.toString();
                        return (
                            <OrderPreview
                                key={createdAt}
                                orderItems={orderItems}
                                time={time} />
                        )
                    })
                }
            </div>
        )
    };

    const mapStateToProps = createStructuredSelector({
        orders: selectCurrentOrders
    });

    export default connect(mapStateToProps)(OrdersOverview);
    ```

2. Set up types.

    __`Location:./client/src/redux/orders/orders.types.js`__

    ```js
    export const SET_ORDERS_FROM_FIREBASE = 'SET_ORDERS_FROM_FIREBASE';
    export const ORDER_PLACED_START = 'ORDER_PLACED_START';
    export const ORDER_PLACED_SUCCESS = 'ORDER_PLACED_SUCCESS';
    export const ORDER_PLACED_FAILURE = 'ORDER_PLACED_FAILURE';
    ```

3. Set up actions.

    __`Location:./client/src/redux/orders/orders.actions.js`__

    ```js
    import {
        ORDER_PLACED_START,
        ORDER_PLACED_SUCCESS,
        ORDER_PLACED_FAILURE,
        SET_ORDERS_FROM_FIREBASE
    } from './orders.types';

    export const orderPlacedStart = (orderItems, history) => ({
        type: ORDER_PLACED_START,
        payload: orderItems,
        history: history
    });

    export const orderPlacedSuccess = orders => {
        return {
            type: ORDER_PLACED_SUCCESS,
            payload: orders
        }
    };

    export const orderPlacedFailure = (error) => {
        return {
            type: ORDER_PLACED_FAILURE,
            payload: error
        }
    };

    export const setOrdersFromFirebase = orders => {
        return {
            type: SET_ORDERS_FROM_FIREBASE,
            payload: orders
        }
    };
    ```

    __`Location:./client/src/redux/cart/cart.actions.js`__

    ```js

    import { ORDER_SUCCESS_CLEAR_CART } from './cart.types';
    export const orderSuccessClearCart = () => ({
        type: ORDER_SUCCESS_CLEAR_CART
    });
    ```

4. Set up reducer.

    __`Location:./client/src/redux/cart/cart.reducer.js`__

    ```diff
    + import { ORDER_SUCCESS_CLEAR_CART } from './cart.types';

    const cartReducer = (state = INITIAL_STATE, action) => {
        switch (action.type) {
            case CLEAR_CART:
    +       case ORDER_SUCCESS_CLEAR_CART:
                return {
                    ...state,
                    cartItems: []
                };
        }
    };
    ```

    __`Location:./client/src/redux/orders/orders.reducer.js`__

    ```jsx
    import { SET_ORDERS_FROM_FIREBASE, ORDER_PLACED_SUCCESS, ORDER_PLACED_FAILURE } from './orders.types';

    const INITIAL_STATE = {
        ordersList: [],
        error: null
    };

    const ordersReducer = (state = INITIAL_STATE, action) => {
        switch (action.type) {
            case SET_ORDERS_FROM_FIREBASE:
                return {
                    ...state,
                    ordersList: action.payload
                };
            case ORDER_PLACED_SUCCESS:
                return {
                    ...state,
                    ordersList: action.payload,
                    error: null
                };
            case ORDER_PLACED_FAILURE:
                return {
                    ...state,
                    error: action.payload
                }
            default:
                return state;
        }
    };

    export default ordersReducer;
    ```

    __`Location:./client/src/redux/root-reducer.js`__

    ```diff
    +   import ordersReducer from './orders/orders.reducer';

        const rootReducer = combineReducers({
            user: userReducer,
            cart: cartReducer,
            displayName: displayNameReducer,
            directory: directoryReducer,
            shop: shopReducer,
            hideCart: hideCartReducer,
    +       orders: ordersReducer,
        });
    ```

    __`Location:./client/src/redux/orders/orders.selectors.js`__

    ```js
    import { createSelector } from 'reselect';

    const selectOrders = state => state.orders;

    export const selectCurrentOrders = createSelector(
        [selectOrders],
        orders => orders.ordersList
    );
    ```

5. Set up sagas.

    __`Location:./client/src/redux/cart/cart.sagas.js`__

    ```js
    export function* onCartChange() {
        yield takeLatest(
            [
                ADD_ITEM,
                REMOVE_ITEM,
                CLEAR_ITEM_FROM_CART,
                ORDER_SUCCESS_CLEAR_CART
            ],
            updateCartInFirebase
        );
    };
    ```

    __`Location:./client/src/redux/orders/orders.sagas.js`__

    ```js
    import { all, call, takeLatest, put, select } from 'redux-saga/effects';

    import { getUserOrdersRef } from '../../firebase/firebase.utils';

    import { SIGN_IN_SUCCESS } from '../user/user.types';
    import { ORDER_PLACED_START } from '../orders/orders.types';

    import { setOrdersFromFirebase, orderPlacedSuccess, orderPlacedFailure } from './orders.actions';
    import { orderSuccessClearCart } from '../cart/cart.actions';

    import { selectCurrentUser } from '../user/user.selectors';
    import { selectCurrentOrders } from './orders.selectors';

    export function* checkOrdersFromFirebase({ payload: user }) {
        const ordersRef = yield getUserOrdersRef(user.id);
        const ordersSnapshot = yield ordersRef.get();
        yield put(setOrdersFromFirebase(ordersSnapshot.data().orders));
    };

    export function* onSignInSuccess() {
        yield takeLatest(SIGN_IN_SUCCESS, checkOrdersFromFirebase);
    };

    export function* updateOrdersInFirebase(action) {
        const orderItems = action.payload;
        const history = action.history
        const currentUser = yield select(selectCurrentUser);
        if (currentUser) {
            try {
                const ordersRef = yield getUserOrdersRef(currentUser.id);
                const orders = yield select(selectCurrentOrders);
                const newOrder = {
                    createdAt: new Date(),
                    orderItems
                };
                orders.unshift(newOrder);
                yield ordersRef.update({ orders });
                yield put(orderPlacedSuccess(orders));
                yield put(orderSuccessClearCart());
                history.push('/orders');
            } catch (error) {
                yield put(orderPlacedFailure(error));
                console.log(error);
            }
        }
    };

    export function* onOrderPlacedStart() {
        yield takeLatest(ORDER_PLACED_START, updateOrdersInFirebase);
    };

    export function* ordersSagas() {
        yield all([call(onSignInSuccess), call(onOrderPlacedStart)]);
    }
    ```

#### `Comment:`
1. Set orders from firebase when a user sign in.

  <p align="center">
  <img src="../assets/fe-p14-02.png" width=90%>
  </p>

  -----------------------------------------------------------------

2. Order placed process.
  <p align="center">
  <img src="../assets/fe-p14-03.png" width=90%>
  </p>

  -----------------------------------------------------------------

3. :gem::gem::gem:目前为止 redux-saga 最难的地方是跟踪 action，同时熟悉 saga callback function 是:gem:隐式:gem:获得参数的。
__`本章用到的全部资料：`__

- null

- #### Click here: [BACK TO CONTENT](#14.0)
- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/README.md)