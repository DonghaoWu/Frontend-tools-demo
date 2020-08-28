redux - stage management

1. single source of truth
2. state is read only
3. changes using pure functions. 

- action -> reducer -> store -> DOM changes

- flux pattern 
    - action -> dispatcher -> store -> view

- MVC
    - action -> controller -> model -> view


- Setting up redux

- install dependencies

```bash
npm i redux react-redux redux-logger
```

- files:

- 前期步骤：
    1. install dependencies
    2. Provider
    3. store and middlewares
    4. root reducer
    5. individual reducer
    6. action types
    7. initial state
    8. actions

    9. connect()
    10. mapDispatchToProps
    11. mapStateToProps
    12. 

    - ./src/redux/root-reducer.js
    ```js
    import { combineReducers } from 'redux';

    import userReducer from './user/user.reducer';

    export default combineReducers({
        user: userReducer;
    })
    ```
    - ./src/redux/user
    - ./src/redux/user/user.reducer.js - Initial state, userReducer

    ```js
    const userReducer = (state = INITIAL_STATE, action) =>{
        const {type, payload} = action;
        switch(type){
            case SET_CURRENT_USER:
                return {
                    ...state,
                    currentUser: action.payload
                };
            default:
            return state;
        }
    };

    export default userReducer;
    ```

    - ./src/redux/store.js

    ```js
    import { createStore, applyMiddleware } from 'redux';
    import logger from 'redux-logger';

    import rootReducer from './root-reducer';

    const middlewares =[logger];

    const store = createStore(rootReducer, applyMiddleware(...middlewares));

    export default store;
    ```

    - ./src/redux/user/user.actions.js
    - ./src/redux/user/user.types.js

    ```js
    const SET_CURRENT_USER = 'SET_CURRENT_USER';
    export const setCurrentUser = (user) => ({
        type: SET_CURRENT_USER,
        payload: user
    })
    ```

    - App.js
        - Provider, <react-redux>
        - Redirect

- Cart component

    - [Create cart logo component]
    - ./src/assets/shopping-bag.svg
    - ./src/Components/Cart-icon/Cart-icon.component.jsx
    - ./src/Components/Cart-icon/Cart-icon.styles.scss

    - [Create cart dropdown]
    - ./src/Components/Cart-dropdown/Cart-dropdown.component.jsx
    - ./src/Components/Cart-dropdown/Cart-dropdown.styles.scss
    - ./src/redux/cart/cart.reducer.js
    - ./src/redux/cart/cart.actions.js
    - ./src/redux/cart/cart.types.js
    - ./src/redux/root-reducer.js

    - [style button]
    - ./src/Components/Custom-button/Custom-button.styles.scss
    - ./src/Components/Custom-button/Custom-button.component.jsx
    - ./src/Components/Collection-item/Collection-item.component.jsx

    - [Add item to cart]
    - ./src/redux/cart/cart.reducer.js
    - ./src/redux/cart/cart.actions.js
    - ./src/redux/cart/cart.types.js
    - ./src/Components/Collection-preview/Collection-preview.component.jsx
    - ./src/Components/Collection-item/Collection-item.component.jsx

    - [Add mutiple items to cart.]
    - ./src/redux/cart/cart.utils.js
    ```js
    export const addItemToCart = (cartItems, cartItemToAdd)=>{
        const existingCartItem = cartItems.find(
            cartItem => cartItem.id === cartItemToAdd.id
        )

        if(existingCartItem){
            return cartItems.map(cartItem =>{
                cartItem.id === cartItemToAdd.id
                ? {...cartItem, quantity: cartItem.quantity + 1}
                : cartItem
            })
        }

        return [...cartItems, {...cartItemToAdd, quantity: 1}];
    }
    ```

    - ./src/redux/cart/cart.reducer.js
    - ./src/Pages/ShopPage/shop.data.js <replace with new data>

    - [Cart Item component]
    - ./src/Components/Cart-item/Cart-item.component.jsx
    - ./src/Components/Cart-item/Cart-item.styles.scss
    - ./src/Components/Cart-dropdown/Cart-dropdown.styles.scss

    - [Selectors in redux]
    - ./src/Components/Cart-icon/Cart-icon.component.jsx (reduce method) --> store the value instead
    - 在这里提出一个问题，就是 redux 可以储存 cart 里面的数据，但这是暂时性的，真正需要做的应该是把数据储存在 database，并连接对应用户，每次读取用户的时候把购物车的数据读出来。

    - [Memorization]
    - npm i reselect
    - ./src/redux/cart/cart.selectors.js
    ```js
    import { createSelector } from 'reselect';

    const selectCart = state => stete.cart;

    export const selectCatrItems = creatSelector(
        [selectCart],
        (cart) => cart.cartItems;
    )

    export const selectCartHidden = createSelector(
        [selectCart],
        cart => cart.hidden
    )

    export const selectCartItemCount = createSelector(
        [selectCartItems],
        (cartItems) =>{
            return cartItems.reduce(
                (accumalateQuantity, cartItem) =>{
                    return accumalateQuantity + cartItem.quantity, 
                    0
                }
            )
        }
    )
    ```
    - ./src/Components/Cart-icon/Cart-icon.component.jsx
    - ./src/Components/Cart-dropdown/Cart-dropdown.component.jsx
    - `[it's still valuable to memoize it with a selector to save us running duplicate logic to get the same output.]`
    - 对于这个有一点疑问。

    - [user selector]
    - ./src/redux/user/user.selectors.js

    ```js
    import {createSelector} from 'reselect';
    const selectUser = state => state.user;

    export const selectCurrentUser = createSelector(
        [selectUser],
        (user) => user.currentUser
    )
    ```

    - ./src/Components/Header/Header.component.jsx
    ```jsx
    import { createStructuredSelector } from 'reselect';
    import { selectCartHidden } from '../../redux/cart/cart.selectors';
    import { selectCurrentUser } from '../../redux/user/user.selectors';

    const mapStateToProps = state => {
        return {
            currentUser: selectCurrentUser(state),
            hidden: selectHidden(state)
        }
    }

    const mapStateToProps = createStructuredSelector({
            currentUser: selectCurrentUser,
            hidden: selectCartHidden
    })
    ```

    - ./src/App.jsx
    - 总的疑问是为什么要使用 reselector ？

    - [checkout page]
    - ./src/Components/Cart-dropdown.component.jsx
    ```jsx

    ```
    - ./src/Pages/Checkout.component.jsx
    ```jsx
    import React from 'react';
    import './checkout.styles.scss';

    const CheckoutPage = () => {
        return (
            <div>
                checkout page
            </div>
        )
    }

    export default ChekcoutPage;
    ```
    - ./src/Pages/Checkout.styles.scss
    - ./src/App.jsx <add a new route>
    - ./src/Components/Cart-dropdown.component.jsx
    ```jsx
    import { withRouter } from 'react-router-dom';

    <CustomButton onClick={() => history.push('/checkout')}> Go to checkout page </CustomButton>
    export default withRouter(connect(mapStateToProps)(CartDropdown));
    ```

    - [Chekcout page functionality and styles]
    - ./src/Pages/Checkout.component.jsx
    - ./src/redux/cart/cart.selectors.js
    ```js
    export const selectCartTotal = createSelector(
        [selectCartItems],
        cartItems =>
            cartItems.reduce(
                (accumulatedQuantity, cartItem) =>
                    accumulatedQuantity + cartItem.quantity * cartItem.price
            )
    )
    ```

    - [triger a hidden toggle when click the go to checkout button]

    - ./src/Components/Cart-dropdown.component.jsx
        - <一种不需要写 mapDispatchToProps 的简单写法>。

    - [checkout Item in checkout page]
    - ./src/Components/Checkout-item.component.jsx
    - ./src/Components/Checkout-item.styles.scss
    - ./src/Pages/Checkout.component.jsx

    - [remove checkout items]
    - ./src/redux/cart/cart.types.js
    - ./src/redux/cart/cart.actions.js
    - ./src/redux/cart/cart.reducer.js

    - ./src/Components/Checkout-item.component.jsx

    - [increase and decrease quantity]
    - ./src/redux/cart/cart.types.js
    - ./src/redux/cart/cart.actions.js
    - ./src/redux/cart/cart.reducer.js
    - ./src/Components/Checkout-item.component.jsx
    - ./src/redux/cart/cart.utils.js




