# Front end development tools (Part 14)

### `Key Words: Redux-saga, store user cart data and orders data in Firestore, Firestore data rules.`

- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/README.md)

## `Section: Firebase Cart Orders.` (Advanced)

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

1. 

-----------------------------------------------------------------

__`本章用到的全部资料：`__

- null

- #### Click here: [BACK TO CONTENT](#14.0)
- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/README.md)