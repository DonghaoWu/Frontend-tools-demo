# Front end development tools (Part 9)

### `Key Words: React hooks, useContext, Provider context pattern.`

- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/README.md)

## `Section: React Context API.` (Basic)

### `Summary`: In this documentation, we learn to use react context api.

### `Check Dependencies & Tools:`

- null
------------------------------------------------------------

#### `本章背景：`
1. 在本章中使用 React 自带的 context api 代替 redux 功能。
2. context api 的功能跟 redux 相似，都是使用一个文件保存 state 和 function，然后向对应 component 传送，好处是比较轻型，不好的地方是对复杂的 app 和多重 async actions 的管理不友好。
3. context api 的核心思想是`集中化处理 state。`

------------------------------------------------------------

#### `Context API:`
- [React Context documentation.](https://reactjs.org/docs/context.html)

### <span id="9.0">`Brief Contents & codes position`</span>

- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/README.md)

- [9.1 Regular context pattern.](#9.1)
- [9.2 Provider context pattern.](#9.2)

------------------------------------------------------------

### <span id="9.1">`Step1: Regular context pattern.`</span>

- #### Click here: [BACK TO CONTENT](#9.0)

1. __`(Collections context)`__ Set up initial data.

    __`Location:./clothing-friends-context-api/client/src/contexts/collections/collections.context.js`__

```js
import { createContext } from 'react';
import SHOP_DATA from './shop.data.js';

const CollectionsContext = createContext(SHOP_DATA);

export default CollectionsContext;
```

2. __`(Collections context)`__ Consume the data in component.

    __`Location:./clothing-friends-context-api/client/src/Components/Collection-overview/Collection-overview.component.jsx`__

```js
import React, { useContext } from 'react';

import CollectionPreview from '../Collection-preview/Collection-preview.component';

import CollectionsContext from '../../contexts/collections/collections.context';

import './Collections-overview.styles.scss';

const CollectionsOverview = () => {
    const collectionsMap = useContext(CollectionsContext);
    const collections = Object.keys(collectionsMap).map(
        key => collectionsMap[key]
    );

    return (
        <div className='collections-overview'>
            {
                collections.map(({ id, ...otherCollectionProps }) => (
                    <CollectionPreview key={id} {...otherCollectionProps} />
                ))
            }
        </div>
    );

}

export default CollectionsOverview;
```

3. __`(Directory context)`__ Set up initial data.

    __`Location:./clothing-friends-context-api/client/src/contexts/directory/directory.context.js`__

```js
import { createContext } from 'react';
import DIRECTORY_DATA from './directory.data';

const DirectoryContext = createContext(DIRECTORY_DATA);

export default DirectoryContext;
```

4. __`(Directory context)`__ Consume the data in component.

    __`Location:./clothing-friends-context-api/client/src/Components/Directory/Directory.component.jsx`__

```js
import React, { useContext } from 'react';

import DirectoryItem from '../Directory-item/Directory-item.component';

import DirectoryContext from '../../contexts/directory/directory.context';

import './Directory.styles.scss';

const Directory = () => {
  const sections = useContext(DirectoryContext);
  return (
    <div className='directory-menu'>
      {sections.map(({ id, ...otherSectionProps }) => (
        <DirectoryItem key={id} {...otherSectionProps} />
      ))}
    </div>
  );
}

export default Directory;
```

5. __`(Current user context)`__ Set up initial data.

    __`Location:./clothing-friends-context-api/client/src/contexts/current-user/current-user.context.js`__

```js
import { createContext } from 'react';

const CurrentUserContext = createContext(undefined);

export default CurrentUserContext;
```

6. __`(Current user context)`__ `Update` the data in component and passdown.

    __`Location:./clothing-friends-context-api/client/src/App.js`__

```js
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import HomePage from './Pages/HomePage/HomePage.component';
import ShopPage from './Pages/ShopPage/ShopPage.component';
import SignInAndSignUpPage from './Pages/SignInSignUpPage/SignInAndSignUpPage.component';
import CheckoutPage from './Pages/CheckoutPage/CheckoutPage.component';
import Header from './Components/Header/Header.component';

import { auth, checkDocOrCreateDocInFirestore } from './firebase/firebase.utils';

import CurrentUserContext from './contexts/current-user/current-user.context.js';
import { CartContext } from './providers/cart/cart.provider';

import './App.css';

class App extends React.Component {

    static contextType = CartContext;

    constructor() {
        super();
        this.state = {
            currentUser: null,
        }
    }

    componentDidMount() {
        this.listener = auth.onAuthStateChanged(async userAuth => {
            const { setDisplayNameFromSignUp, displayName } = this.context;
            if (userAuth) {
                try {
                    const signUpDisplayName = userAuth.displayName || displayName;
                    const userRef = await checkDocOrCreateDocInFirestore(userAuth, signUpDisplayName);
                    userRef.onSnapshot(snapShot => {
                        this.setState(
                            {
                                currentUser: {
                                    id: snapShot.id,
                                    ...snapShot.data()
                                }
                            }
                        );
                        setDisplayNameFromSignUp('');
                    });
                }
                catch (error) {
                    this.setState({ currentUser: null });
                    setDisplayNameFromSignUp('');
                    console.log('error creating user', error.message);
                }
            }
            else {
                this.setState({ currentUser: null });
                setDisplayNameFromSignUp('');
            }
        })
    }

    componentWillUnmount() {
        this.listener();
    }

    render() {
        const { currentUser } = this.state;
        return (
            <div>
                <CurrentUserContext.Provider value={currentUser}>
                    <Header />
                </CurrentUserContext.Provider>
                <Switch>
                    <Route exact path="/signin">{currentUser ? <Redirect to="/" /> : <SignInAndSignUpPage />}</Route>
                    <Route exact path='/' component={HomePage} />
                    <Route path='/shop' component={ShopPage} />
                    <Route exact path='/checkout' component={CheckoutPage} />
                </Switch>
            </div>
        );
    }
}

export default App;
```

7. __`(Current user context)`__ Consume the data in component.

    __`Location:./clothing-friends-context-api/client/src/Components/Header/Header.context.js`__

```js
import React, { useContext } from 'react';
import { Link, withRouter } from "react-router-dom";

import { auth } from '../../firebase/firebase.utils';

import CartIcon from '../Cart-icon/Cart-icon.component';
import CartDropdown from '../Cart-dropdown/Cart-dropdown.component';

import { ReactComponent as Logo } from '../../assets/crown.svg';

import CurrentUserContext from '../../contexts/current-user/current-user.context';
import { CartContext } from '../../providers/cart/cart.provider';

import './Header.styles.scss';

const Header = ({ history }) => {

    const currentUser = useContext(CurrentUserContext);
    const { hidden, clearCart } = useContext(CartContext);

    const signOut = async () => {
        await auth.signOut();
        clearCart();
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
                <Link className='option' to='/'>HOME</Link>
                <Link className='option' to='/shop'>SHOP</Link>
                <Link className='option' to='/shop'>CONTACT</Link>
                {
                    currentUser ?
                        (
                            <div className='option' onClick={signOut}>SIGN OUT</div>
                        )
                        :
                        (
                            <Link className='option' to='/signin'>SIGN IN</Link>
                        )
                }

                <CartIcon />
            </div>
            {hidden ? null : <CartDropdown />}
        </div>
    )
};

export default withRouter(Header);
```

#### `Comment:`
1. 静态数据关键语句：
```diff
/ collections.context.js /
+ import { createContext } from 'react';
+ const CollectionsContext = createContext(SHOP_DATA);

/ Collections-overview.component.jsx /
+ import React, { useContext } from 'react';
+ import CollectionsContext from '../../contexts/collections/collections.context';

+ const collectionsMap = useContext(CollectionsContext);
```

2. 动态数据关键语句：
```diff
/ current-user.context.js /
+ import { createContext } from 'react';
+ const CurrentUserContext = createContext(undefined);

/ App.js /
+ import React, { useContext } from 'react';
+ import CurrentUserContext from './contexts/current-user/current-user.context.js';

+    constructor() {
+        super();
+        this.state = {
+            currentUser: null,
+        }
+   }

+ <CurrentUserContext.Provider value={this.state.currentUser}>
+       <Header />
+ </CurrentUserContext.Provider>
```

3. :gem::gem::gem:动态数据传输需要先进行本地 state，然后必须对着 context file 里面的名字一模一样，然后在语句 `<CurrentUserContext.Provider value={this.state.currentUser}>` 实现更新 state 并向下传递。

### <span id="9.2">`Step2: Provider context pattern.`</span>

- #### Click here: [BACK TO CONTENT](#9.0)

1. :gem::gem::gem: __`(Cart context)`__ Set up initial state data and Provider component.

    __`Location:./clothing-friends-context-api/client/src/providers/cart/cart.provider.jsx`__

```jsx
import React, { createContext, useState, useEffect } from 'react';

import { addItemToCart, removeItemFromCart, filterItemFromCart, getCartItemsCount, getCartTotal } from './cart.utils'

export const CartContext = createContext({
    displayName: undefined,
    hidden: true,
    cartItems: [],
    cartItemsCount: 0,
    cartTotal: 0,
    toggleHidden: () => { },
    addItem: () => { },
    removeItem: () => { },
    clearItemFromCart: () => { }
});

const CartProvider = ({ children }) => {
    const [displayName, setDisplayName] = useState(undefined);
    const [hidden, setHidden] = useState(true);
    const [cartItems, setCartItems] = useState([]);
    const [cartItemsCount, setCartItemsCount] = useState(0);
    const [cartTotal, setCartTotal] = useState(0);

    const setDisplayNameFromSignUp = (name) => {
        return setDisplayName(name);
    }
    const toggleHidden = () => setHidden(!hidden);
    const addItem = item => {
        return setCartItems(addItemToCart(cartItems, item));
    }
    const removeItem = item => {
        return setCartItems(removeItemFromCart(cartItems, item));
    }
    const clearItemFromCart = item =>
        setCartItems(filterItemFromCart(cartItems, item));

    const clearCart = () => setCartItems([]);

    useEffect(() => {
        setCartItemsCount(getCartItemsCount(cartItems));
        setCartTotal(getCartTotal(cartItems));
    }, [cartItems]);

    return <CartContext.Provider
        value={{
            hidden,
            toggleHidden,
            cartItems,
            addItem,
            removeItem,
            clearItemFromCart,
            cartItemsCount,
            cartTotal,
            setDisplayNameFromSignUp,
            displayName,
            clearCart
        }}>
        {children}</CartContext.Provider>
}

export default CartProvider;
```

2. __`(Cart context)`__ Add a provider in index.js

    __`Location:./clothing-friends-context-api/client/src/index.js`__

```js
import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import CartProvider from './providers/cart/cart.provider.jsx';

import './index.css';
import App from './App';

ReactDOM.render(
    <React.StrictMode>
        <CartProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </CartProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

serviceWorker.unregister();
```

3. __`(Cart context)`__ Consume the data and function in a functional component.

    __`Location:./clothing-friends-context-api/client/src/Components/Cart-icon/Cart-icon.jsx`__

```js
import React, { useContext } from 'react';

import { ReactComponent as ShoppingIcon } from '../../assets/shopping-bag.svg';

import { CartContext } from '../../providers/cart/cart.provider';

import './Cart-icon.styles.scss';

const CartIcon = () => {
    const { toggleHidden, cartItemsCount } = useContext(CartContext);
    return (
        <div className='cart-icon' onClick={toggleHidden}>
            <ShoppingIcon className='shopping-icon' />
            <span className='item-count'>{cartItemsCount}</span>
        </div>
    );
}

export default CartIcon;
```

4. __`(Cart context)`__ Consume the data and function in a class component.

    __`Location:./clothing-friends-context-api/client/src/App.js`__

```js
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import HomePage from './Pages/HomePage/HomePage.component';
import ShopPage from './Pages/ShopPage/ShopPage.component';
import SignInAndSignUpPage from './Pages/SignInSignUpPage/SignInAndSignUpPage.component';
import CheckoutPage from './Pages/CheckoutPage/CheckoutPage.component';
import Header from './Components/Header/Header.component';

import { auth, checkDocOrCreateDocInFirestore } from './firebase/firebase.utils';

import CurrentUserContext from './contexts/current-user/current-user.context.js';
import { CartContext } from './providers/cart/cart.provider';

import './App.css';

class App extends React.Component {

    static contextType = CartContext;

    constructor() {
        super();
        this.state = {
            currentUser: null,
        }
    }

    componentDidMount() {
        this.listener = auth.onAuthStateChanged(async userAuth => {
            const { setDisplayNameFromSignUp, displayName } = this.context;
            if (userAuth) {
                try {
                    const signUpDisplayName = userAuth.displayName || displayName;
                    const userRef = await checkDocOrCreateDocInFirestore(userAuth, signUpDisplayName);
                    userRef.onSnapshot(snapShot => {
                        this.setState(
                            {
                                currentUser: {
                                    id: snapShot.id,
                                    ...snapShot.data()
                                }
                            }
                        );
                        setDisplayNameFromSignUp('');
                    });
                }
                catch (error) {
                    this.setState({ currentUser: null });
                    setDisplayNameFromSignUp('');
                    console.log('error creating user', error.message);
                }
            }
            else {
                this.setState({ currentUser: null });
                setDisplayNameFromSignUp('');
            }
        })
    }

    componentWillUnmount() {
        this.listener();
    }

    render() {
        const { currentUser } = this.state;
        return (
            <div>
                <CurrentUserContext.Provider value={currentUser}>
                    <Header />
                </CurrentUserContext.Provider>
                <Switch>
                    <Route exact path="/signin">{currentUser ? <Redirect to="/" /> : <SignInAndSignUpPage />}</Route>
                    <Route exact path='/' component={HomePage} />
                    <Route path='/shop' component={ShopPage} />
                    <Route exact path='/checkout' component={CheckoutPage} />
                </Switch>
            </div>
        );
    }
}

export default App;
```

#### `Comment:`
1. :gem::gem::gem: 这里最难的应该是在 class component 中应用 context api data 了，它在这里使用了不一样的语法。主要是：

```diff
+ import { CartContext } from './providers/cart/cart.provider';

+ static contextType = CartContext;

+ const { setDisplayNameFromSignUp, displayName } = this.context;
```

2. :gem::gem::gem: 另外的难点是在 provider component 中使用 `useEffect`。

-----------------------------------------------------------------

__`本章用到的全部资料：`__

- [React Context documentation.](https://reactjs.org/docs/context.html)

- #### Click here: [BACK TO CONTENT](#9.0)
- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/README.md)