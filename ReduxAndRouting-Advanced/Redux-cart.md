# Front end development tools (Part 2)

### `Key Word: Redux, Cart, reselect.`

- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/README.md)

## `Section: Redux.` (Basic)

### `Summary`: In this documentation, we learn to utilize Redux to manage state in the application.

### `Check Dependencies & Tools:`

- redux
- react-redux
- redux-logger
- reselect

------------------------------------------------------------

#### `本章背景：`
1. 本章主要学习使用 Redux 去合并管理 React state。

2. 本章从 front end 角度建立一个 shopping cart。
3. 本章引入 selector 的概念。
4. 本章还是用到了一些新的 redux 语法。

------------------------------------------------------------
- Redux 设置步骤:

    - 设置
    ```diff
    + 1. Install redux react-redux redux-logger reselect
    + 2. Add Provider
    + 3. Add store and middlewares
    + 4. Add root-reducer
    + 5. Set up individual reducer
    + 6. Set up types
    + 7. Set up actions
    + 8. Set up selectors
    ```

    - 应用
    ```diff
    + 1. { connect }
    + 2. mapStateToProps
    + 3. mapDispatchToProps
    ```

------------------------------------------------------------

### <span id="2.0">`Brief Contents & codes position`</span>

- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/README.md)

- [2.1 Set up Redux.](#2.1)
- [2.2 Why use reselect?](#2.2)
- [2.3 Connect component and Redux state.](#2.3)
- [2.4 displayName reudcer.](#2.4)

------------------------------------------------------------

### <span id="2.1">`Step1: Set up Redux.`</span>

- #### Click here: [BACK TO CONTENT](#2.0)

1. Install dependencies:

    ```bash
    $ npm i redux react-redux redux-logger reselect
    ```
  -----------------------------------------------------------------

2. Provider

    __`Location:./clothing-friends-redux-cart/src/index.js`__

    ```jsx
    import React from 'react';
    import ReactDOM from 'react-dom';
    import * as serviceWorker from './serviceWorker';
    import { BrowserRouter } from 'react-router-dom';
    import { Provider } from 'react-redux';

    import store from './redux/store';

    import './index.css';
    import App from './App';

    ReactDOM.render(
        <React.StrictMode>
            <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
            </Provider>
        </React.StrictMode>,
        document.getElementById('root')
    );

    serviceWorker.unregister();
    ```
  -----------------------------------------------------------------

3. Store and middlewares.

    __`Location:./clothing-friends-redux-cart/src/redux/store.js`__

    ```js
    import { createStore, applyMiddleware } from 'redux';
    import logger from 'redux-logger';

    import rootReducer from './root-reducer';

    const middlewares = [logger];

    const store = createStore(rootReducer, applyMiddleware(...middlewares));

    export default store;
    ```

    - 注意多个 middlewares 的格式。

4. Root reducer 

    __`Location:./clothing-friends-redux-cart/src/redux/root-reducer.js`__

    ```js
    import { combineReducers } from 'redux';

    import userReducer from './user/user.reducer';
    import cartReducer from './cart/cart.reducer';
    import displayNameReducer from './display-name/display-name.reducer';

    export default combineReducers({
        user: userReducer,
        cart: cartReducer,
        displayName: displayNameReducer
    });
    ```

    - 这里建立的对应表在进行连接的时候起到查询作用。

5. Individual reducer

    __`Location:./clothing-friends-redux-cart/src/redux/cart/cart.reducer.js`__

    ```js
    import { TOGGLE_CART_HIDDEN, ADD_ITEM, REMOVE_ITEM, CLEAR_ITEM_FROM_CART } from './cart.types';
    import { addItemToCart, removeItemFromCart } from './cart.utils';

    const INITIAL_STATE = {
        hidden: true,
        cartItems: []
    };

    const cartReducer = (state = INITIAL_STATE, action) => {
        switch (action.type) {
            case TOGGLE_CART_HIDDEN:
                return {
                    ...state,
                    hidden: !state.hidden
                };
            case ADD_ITEM:
                return {
                    ...state,
                    cartItems: addItemToCart(state.cartItems, action.payload)
                };
            case REMOVE_ITEM:
                return {
                    ...state,
                    cartItems: removeItemFromCart(state.cartItems, action.payload)
                };
            case CLEAR_ITEM_FROM_CART:
                return {
                    ...state,
                    cartItems: state.cartItems.filter(
                        cartItem => cartItem.id !== action.payload.id
                    )
                };
            default:
                return state;
        }
    };

    export default cartReducer;
    ```

6. Utils reducer methods. 

    __`Location:./clothing-friends-redux-cart/src/redux/cart/cart.utils.js`__

    ```js
    export const addItemToCart = (cartItems, cartItemToAdd) => {
        const existingCartItem = cartItems.find(
            cartItem => cartItem.id === cartItemToAdd.id
        );

        if (existingCartItem) {
            return cartItems.map(cartItem =>
                cartItem.id === cartItemToAdd.id
                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                    : cartItem
            );
        }

        return [...cartItems, { ...cartItemToAdd, quantity: 1 }];
    };

    export const removeItemFromCart = (cartItems, cartItemToRemove) => {
        const existingCartItem = cartItems.find(
            cartItem => cartItem.id === cartItemToRemove.id
        );

        if (existingCartItem.quantity === 1) {
            return cartItems.filter(cartItem => cartItem.id !== cartItemToRemove.id);
        }

        return cartItems.map(cartItem =>
            cartItem.id === cartItemToRemove.id
                ? { ...cartItem, quantity: cartItem.quantity - 1 }
                : cartItem
        );
    };
    ```

    - 这些 methods 只会使用在 reducer 之中，建立 utils 的原因是把 reducer 的代码简化，其实这些 function 可以放在 cart.reducer 中，这样做是可以更好移植和美观。

7. Types. 

    __`Location:./clothing-friends-redux-cart/src/redux/cart/cart.types.js`__

    ```js
    export const TOGGLE_CART_HIDDEN = 'TOGGLE_CART_HIDDEN';
    export const ADD_ITEM = 'ADD_ITEM';
    export const REMOVE_ITEM = 'REMOVE_ITEM';
    export const CLEAR_ITEM_FROM_CART = 'CLEAR_ITEM_FROM_CART';
    ```

8. Actions. 

    __`Location:./clothing-friends-redux-cart/src/redux/cart/cart.actions.js`__

    ```js
    import { TOGGLE_CART_HIDDEN, ADD_ITEM, REMOVE_ITEM, CLEAR_ITEM_FROM_CART } from './cart.types';

    export const toggleCartHidden = () => ({
        type: TOGGLE_CART_HIDDEN
    });

    export const addItem = item => ({
        type: ADD_ITEM,
        payload: item
    });

    export const removeItem = item => ({
        type: REMOVE_ITEM,
        payload: item
    });

    export const clearItemFromCart = item => ({
        type: CLEAR_ITEM_FROM_CART,
        payload: item
    });
    ```

    - 这些 function 将会在 component 中使用，配合 dispatch 引发 reducer 的启动并改变对应的 state 变化。

9. Selectors. 

    __`Location:./clothing-friends-redux-cart/src/redux/cart/cart.selectors.js`__

    ```js
    import { createSelector } from 'reselect';

    const selectCart = state => state.cart;

    export const selectCartItems = createSelector(
        [selectCart],
        cart => cart.cartItems
    );

    export const selectCartHidden = createSelector(
        [selectCart],
        cart => cart.hidden
    );

    export const selectCartItemsCount = createSelector(
        [selectCartItems],
        cartItems =>
            cartItems.reduce(
                (accumalatedQuantity, cartItem) =>
                    accumalatedQuantity + cartItem.quantity,
                0
            )
    );

    export const selectCartTotal = createSelector(
        [selectCartItems],
        cartItems =>
            cartItems.reduce(
                (accumalatedQuantity, cartItem) =>
                    accumalatedQuantity + cartItem.quantity * cartItem.price,
                0
            )
    );
    ```

    - :gem::gem: selector 的作用估计是对 state 进行一个 middleware 之类的处理，然后从这里往 component 输送 methods，在 component 的 mapStateToProps 中调用这些 method 从而得到对应的 state 数据。


#### `Comment:`
1. 

### <span id="2.2">`Step2: Why use reselect?`</span>

- #### Click here: [BACK TO CONTENT](#2.0)

1. [推荐文章：关于react, redux, react-redux和reselect的一些思考
](https://zhuanlan.zhihu.com/p/33985606)

2. 个人理解：假如一个 reducer 里面有 5 个 key，其中一个改变的时候，出了当前跟 key 相关的 component 会出现 re-render 之外，其他 4 个不相关的而且没有发生改变的 key 对应的 component 都会发生 re-render。这是一种很耗费资源的方式。

3. 加入了 reselect 之后，对应的 key 值会先经过 selector，这时候 selector 会比较这次的值跟上一次有什么不一样，如果结果一样的话就不往对应的 component 传送。

4. 除了直接判断 state 键值的差异以外，也可以在 reselect 中设计一些 state 的运算，运算的结果缓存，然后对照结果输出。

5. reselect 语法：

    - root-reducer
    ```js
    cart: cartReducer
    ```

    - individual reducer
    ```js
    const INITIAL_STATE = {
        hidden: true,
        cartItems: []
    };
    ```

    - selector
    ```js
    import { createSelector } from 'reselect';

    const selectCart = state => state.cart; /* 对应 root-reducer */

    /* 输出 state 键值 */
    export const selectCartItems = createSelector(
        [selectCart],
        cart => cart.cartItems; /* 对应 individual reducer*/
    );

    /* 另一种写法 */
    export const selectCartHidden = createSelector(
        [selectCart],
        (cart) => {
            return cart.hidden;
        }
    );

    /* 输出 state 键值运算结果，这里看出它是使用之前的对照键值缓存 `selectCartItems` 为计算结果的 */
    export const selectCartItemsCount = createSelector(
        [selectCartItems],
        cartItems =>
            cartItems.reduce(
                (accumalatedQuantity, cartItem) =>
                    accumalatedQuantity + cartItem.quantity,
                0
            )
    );

    /* 另一种写法 */
    export const selectCartTotal = createSelector(
        [selectCartItems],
        (cartItems) => {
            return cartItems.reduce(function (accumalatedQuantity, cartItem) {
                return accumalatedQuantity + cartItem.quantity * cartItem.price;
            },0)
        }
    );
    ```

    - 在 Component 中引用 selector state。

    ```jsx
    import { createStructuredSelector } from 'reselect';
    import { selectCartItems, selectCartTotal } from '../../redux/cart/cart.selectors';

    /* 第一种写法 */
    const mapStateToProps = createStructuredSelector({
        cartItems: selectCartItems,
        total: selectCartTotal
    });

    /* 第二种写法 */
    const mapStateToProps = state => ({
        cartItems: selectCartItems(state),
        total: selectCartTotal(state)
    });
    ```

#### `Comment:`
1. :gem::gem::gem: 注意 reselect 里面的缓存值是互相缓存的关系，比如上面例子中的运算函数使用 state 键值缓存。

### <span id="2.3">`Step3: Connect component and Redux state.`</span>

- #### Click here: [BACK TO CONTENT](#2.0)

1. Cart-dropdown:

    __`Location:./clothing-friends-redux-cart/src/Components/Cart-dropdown/Cart-dropdown.component.jsx`__

```jsx
import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import CustomButton from '../Custom-button/Custom-button.component';
import CartItem from '../Cart-item/Cart-item.component';
import { selectCartItems } from '../../redux/cart/cart.selectors';
import { toggleCartHidden } from '../../redux/cart/cart.actions.js';

import './Cart-dropdown.styles.scss';

const CartDropdown = ({ cartItems, history, dispatch }) => (
    <div className='cart-dropdown'>
        <div className='cart-items'>
            {cartItems.length ? (
                cartItems.map(cartItem => (
                    <CartItem key={cartItem.id} item={cartItem} />
                ))
            ) : (
                    <span className='empty-message'>Your cart is empty</span>
                )}
        </div>
        <CustomButton
            onClick={() => {
                history.push('/checkout');
                dispatch(toggleCartHidden());
            }}
        >
            GO TO CHECKOUT
    </CustomButton>
    </div>
);

const mapStateToProps = createStructuredSelector({
    cartItems: selectCartItems
});

export default withRouter(connect(mapStateToProps)(CartDropdown));
```

2. Cart-icon:

    __`Location:./clothing-friends-redux-cart/src/Components/Cart-icon/Cart-icon.component.jsx`__

```jsx
import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { toggleCartHidden } from '../../redux/cart/cart.actions';
import { selectCartItemsCount } from '../../redux/cart/cart.selectors';

import { ReactComponent as ShoppingIcon } from '../../assets/shopping-bag.svg';

import './Cart-icon.styles.scss';

const CartIcon = ({ toggleCartHidden, itemCount }) => (
    <div className='cart-icon' onClick={toggleCartHidden}>
        <ShoppingIcon className='shopping-icon' />
        <span className='item-count'>{itemCount}</span>
    </div>
);

const mapDispatchToProps = dispatch => ({
    toggleCartHidden: () => dispatch(toggleCartHidden())
});

const mapStateToProps = createStructuredSelector({
    itemCount: selectCartItemsCount
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CartIcon);
```

3. Header:

    __`Location:./clothing-friends-redux-cart/src/Components/Header/Header.component.jsx`__

```jsx
import React from 'react';
import { Link, withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { auth } from '../../firebase/firebase.utils';

import CartIcon from '../Cart-icon/Cart-icon.component';
import CartDropdown from '../Cart-dropdown/Cart-dropdown.component';
import { selectCartHidden } from '../../redux/cart/cart.selectors';
import { selectCurrentUser } from '../../redux/user/user.selectors';

import { ReactComponent as Logo } from '../../assets/crown.svg';

import './Header.styles.scss';

const Header = ({ currentUser, history, hidden }) => {

  const signOut = async () => {
    await auth.signOut();
    history.push("/signin");
  }

  return (
    <div className='header'>
      <Link className='logo-container' to='/'>
        <Logo className='logo' />
      </Link>
      <div className='options'>
        {
          currentUser ? (
            <span className='option'>{`Welcome, ${currentUser.displayName}`}</span>
          ) :
            null
        }
        <Link className='option' to='/shop'>
          SHOP
      </Link>
        <Link className='option' to='/shop'>
          CONTACT
      </Link>
        {currentUser ? (
          <Link to='/signin'>
            <div className='option' onClick={() => signOut()}>
              SIGN OUT
        </div>
          </Link>
        ) : (
            <Link className='option' to='/signin'>
              SIGN IN
        </Link>
          )}
        <CartIcon />
      </div>
      {hidden ? null : <CartDropdown />}
    </div>
  )
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  hidden: selectCartHidden
});

export default withRouter(connect(mapStateToProps)(Header));
```

4. CheckoutPage:

    __`Location:./clothing-friends-redux-cart/src/Components/CheckoutPage/CheckoutPage.component.jsx`__

```jsx
import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import CheckoutItem from '../../Components/Checkout-item/Checkout-item.component';

import { selectCartItems, selectCartTotal } from '../../redux/cart/cart.selectors';

import './ChekcoutPage.styles.scss';

const CheckoutPage = ({ cartItems, total }) => (
    <div className='checkout-page'>
        <div className='checkout-header'>
            <div className='header-block'>
                <span>Product</span>
            </div>
            <div className='header-block'>
                <span>Description</span>
            </div>
            <div className='header-block'>
                <span>Quantity</span>
            </div>
            <div className='header-block'>
                <span>Price</span>
            </div>
            <div className='header-block'>
                <span>Remove</span>
            </div>
        </div>
        {cartItems.map(cartItem => (
            <CheckoutItem key={cartItem.id} cartItem={cartItem} />
        ))}
        <div className='total'>TOTAL: ${total}</div>
    </div>
);

const mapStateToProps = createStructuredSelector({
    cartItems: selectCartItems,
    total: selectCartTotal
});

export default connect(mapStateToProps)(CheckoutPage);
```

#### `Comment:`
1. 

### <span id="2.4">`Step4: displayName reudcer.`</span>

- #### Click here: [BACK TO CONTENT](#2.0)

1. `/clothing-friends-redux-cart/src/redux/root-reducer.js`
2. `/clothing-friends-redux-cart/src/redux/display-name/display-name.types.js`
3. `/clothing-friends-redux-cart/src/redux/display-name/display-name.actions.js`
4. `/clothing-friends-redux-cart/src/redux/display-name/display-name.reducer.js`
5. `/clothing-friends-redux-cart/src/redux/display-name/display-name.selectors.js`
6. `/clothing-friends-redux-cart/src/App.js`
7. `/clothing-friends-redux-cart/Components/Sign-up/Sign-up.component.jsx`

#### `Comment:`
1. 开发心得，增加 reselect 之后，新增的几个 selector 和变量的命名需要订立一个规则防止名称混淆。

------------------------------------------------------------

__`本章用到的全部资料：`__

- null

- #### Click here: [BACK TO CONTENT](#2.0)
- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/README.md)