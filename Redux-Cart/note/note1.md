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
