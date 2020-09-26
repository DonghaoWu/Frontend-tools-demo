# Front end development tools (Part 12)

### `Key Words: GraphQL frontend, Apollo, local dynamic.`

- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/README.md)

## `Section: GraphQl frontend Apollo.` (Advanced)

### `Summary`: In this documentation, we prctice to convert all rest component from redux to apollo graphql.

### `Check Dependencies & Tools:`

- null
------------------------------------------------------------

#### `本章背景：`
1. 本小结主要是把上一章剩下的代码全部转换成 apollo graphql。
------------------------------------------------------------

- 本章节涉及到的文件：

    1. index.js
    2. resolvers.js
    3. cart.utils.js
    4. CheckoutPage.container.jsx
    5. CheckoutPage.component.jsx
    6. App.js

    7. Checkout-item.container.jsx
    8. Checkout-item.component.jsx
    9. CheckoutPage.component.jsx

    10. Directory.data.js
    11. Directory.component.jsx

    12. App.js
    13. App.container.jsx
    14. index.js
    15. Header.container.jsx
    16. Header.component.jsx
    17. resolvers.js

    18. index.js
    19. resolvers.js
    20. App.container.jsx
    21. App.component.js
    22. Sign-up.container.jsx
    23. Sign-up.component.js
    24. SignInAndSignUppage.component.js

------------------------------------------------------------

- 关于 container 接受的参数：
    1. :gem:`cartTotal ===> CheckoutPage.container`
    2. :gem:`removeItemFromCart ===> Checkout-item.container`
    3. :gem:`clearItemFromCart ===> Checkout-item.container`
    4. :gem:`currentUser ===> App.container, Header.container`
    5. :gem:`setCurrentUser ===> App.container`
    6. :gem:`clearCart ===> Header.container`
    7. :gem:`displayName ===> App.container`
    8. :gem:`setDisplayName ===> App.container, Header.container`
------------------------------------------------------------

#### `Apollo:`
- [https://www.apollographql.com/docs/](https://www.apollographql.com/docs/)

### <span id="12.0">`Brief Contents & codes position`</span>

- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/README.md)

- [12.1 Local cartTotal value.](#12.1)
- [12.2 Local removeItemFromCart and clearItemFromCart mutation functions.](#12.2)
- [12.3 Directory data without redux.](#12.3)
- [12.4 Local currentUser value and setCurrentUser mutation function.](#12.4)
- [12.5 Local sign up displayName value and setDisplayName mutation function.](#12.5)
- [12.6 Local cache set up data flow.](#12.5)

------------------------------------------------------------

### <span id="12.1">`Step1: Local cartTotal value.`</span>

- #### Click here: [BACK TO CONTENT](#12.0)

- :gem:`cartTotal ===> CheckoutPage.container`

1. Create a new data stored in local client. __`'cartTotal'`__

    __`Location:./clothing-friends-graplql-apollo/client/src/index.js`__

    ```diff
    client.writeData({
        data: {
            cartHidden: true,
            cartItems: [],
            itemCount: 0,
    +       cartTotal: 0,
        }
    });
    ```

2. Pass __`'cartTotal'`__ to CheckoutPage container component. 

    __`Location:./clothing-friends-graplql-apollo/client/src/Components/CheckoutPage/CheckoutPage.container.jsx`__

    ```jsx
    import React from 'react';
    import { Query } from 'react-apollo';
    import { gql } from 'apollo-boost';

    import CheckoutPage from './CheckoutPage.component';

    const GET_CART_ITEMS_AND_TOTAL = gql`
        {
            cartItems @client
            cartTotal @client
        }
    `;

    const CheckoutPageContainer = () => (
        <Query query={GET_CART_ITEMS_AND_TOTAL}>
            {({ data: { cartItems, cartTotal } }) => (
                <CheckoutPage cartItems={cartItems} total={cartTotal} />
            )}
        </Query>
    );

    export default CheckoutPageContainer;
    ```

3. Remove all redux code in CheckoutPage component.

    __`Location:./clothing-friends-graplql-apollo/client/src/Components/CheckoutPage/CheckoutPage.component.jsx`__

    ```jsx
    import React from 'react';

    import CheckoutItem from '../../Components/Checkout-item/Checkout-item.component';
    import StripeCheckoutButton from '../../Components/Stripe-button/Stripe-button.component';

    import './CheckoutPage.styles.scss';

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
            <div className='test-warning'>
                *Please use the following test credit card for payments*
                <br />
                4242 4242 4242 4242 - Exp: 01/20 - CVV: 123
            </div>
            <StripeCheckoutButton price={total} />
        </div>
    );

    export default CheckoutPage;
    ```

4. Import CheckoutPage container in App.js

    ```diff
    - import CheckoutPage from './Pages/CheckoutPage/CheckoutPage.component';
    + import { default as CheckoutPage } from './Pages/CheckoutPage/CheckoutPage.container';
    ```

5. Create an new mutation code in `addItemToCart`.

    __`Location:./clothing-friends-graplql-apollo/client/src/graphql/resolvers.js`__

    ```js
    import { getCartTotal } from './cart.utils';

    const GET_CART_TOTAL = gql`
         {
             cartTotal @client
         }
    `;

    export const resolvers = {
        Mutation: {
            addItemToCart: (_root, { item }, { cache }) => {
                const { cartItems } = cache.readQuery({
                    query: GET_CART_ITEMS
                });

                const newCartItems = addItemToCart(cartItems, item);

                cache.writeQuery({
                    query: GET_ITEM_COUNT,
                    data: { itemCount: getCartItemCount(newCartItems) }
                });

                cache.writeQuery({
                    query: GET_CART_ITEMS,
                    data: { cartItems: newCartItems }
                });

                cache.writeQuery({
                    query: GET_CART_TOTAL,
                    data: { cartTotal: getCartTotal(newCartItems) }
                });

                return newCartItems;
            }
        }
    };
    ```

6. Apply. 由于增加的代码属于 mutation function `addItemToCart` 的一部分，所以不需要传递到 component。

#### `Comment:`
1. 

### <span id="12.2">`Step2: Local removeItemFromCart and clearItemFromCart mutation functions.`</span>

- #### Click here: [BACK TO CONTENT](#12.0)

- :gem:`removeItemFromCart ===> Checkout-item.container`
- :gem:`clearItemFromCart ===> Checkout-item.container`

1. Create two new mutation types __`(RemoveItemFromCart, ClearItemFromCart)`__,two mutation functions __`(removeItemFromCart, clearItemFromCart)`__

    __`Location:./clothing-friends-graplql-apollo/client/src/graphql/resolvers.js`__

    ```jsx
    import { removeItemFromCart, clearItemFromCart } from './cart.utils';

    export const typeDefs = gql`
        extend type Mutation {
            RemoveItemFromCart(item: Item!): [Item]!
            ClearItemFromCart(item: Item!): [Item]!
        }
    `;

    const GET_CART_ITEMS = gql`
    {
        cartItems @client
    }
    `;

    export const resolvers = {
        Mutation: {
            removeItemFromCart: (_root, { item }, { cache }) => {
                const { cartItems } = cache.readQuery({
                    query: GET_CART_ITEMS
                });

                const newCartItems = removeItemFromCart(cartItems, item);

                cache.writeQuery({
                    query: GET_ITEM_COUNT,
                    data: { itemCount: getCartItemCount(newCartItems) }
                });

                cache.writeQuery({
                    query: GET_CART_TOTAL,
                    data: { cartTotal: getCartTotal(newCartItems) }
                });

                cache.writeQuery({
                    query: GET_CART_ITEMS,
                    data: { cartItems: newCartItems }
                });

                return newCartItems;
            },

            clearItemFromCart: (_root, { item }, { cache }) => {
                const { cartItems } = cache.readQuery({
                    query: GET_CART_ITEMS
                });

                const newCartItems = clearItemFromCart(cartItems, item);

                cache.writeQuery({
                    query: GET_ITEM_COUNT,
                    data: { itemCount: getCartItemCount(newCartItems) }
                });

                cache.writeQuery({
                    query: GET_CART_TOTAL,
                    data: { cartTotal: getCartTotal(newCartItems) }
                });

                cache.writeQuery({
                    query: GET_CART_ITEMS,
                    data: { cartItems: newCartItems }
                });

                return newCartItems;
            }
        }
    };
    ```

3. Pass __`(removeItemFromCart, clearItemFromCart)`__ to Checkout-item container component.

    __`Location:./clothing-friends-graplql-apollo/client/src/Components/Checkout-item/Checkout-item.container.jsx`__

    ```jsx
    import React from 'react';
    import { Mutation } from 'react-apollo';
    import { gql } from 'apollo-boost';

    import CheckoutItem from './Checkout-item.component';

    const ADD_ITEM_TO_CART = gql`
        mutation AddItemToCart($item: Item!) {
                addItemToCart(item: $item) @client
            }
    `;

    const REMOVE_ITEM_FROM_CART = gql`
        mutation RemoveItemFromCart($item: Item!) {
            removeItemFromCart(item: $item) @client
        }
    `;

    const CLEAR_ITEM_FROM_CART = gql`
        mutation ClearItemFromCart($item: Item!) {
            clearItemFromCart(item: $item) @client
        }
    `;

    const CheckoutItemContainer = props => (
        <Mutation mutation={ADD_ITEM_TO_CART}>
            {
                addItemToCart => (
                    <Mutation mutation={REMOVE_ITEM_FROM_CART}>
                        {
                            removeItemFromCart => (
                                <Mutation mutation={CLEAR_ITEM_FROM_CART}>
                                    {
                                        clearItemFromCart => {
                                            return (
                                                <CheckoutItem
                                                    {...props}
                                                    addItem={item => addItemToCart({ variables: { item } })}
                                                    removeItem={item => removeItemFromCart({ variables: { item } })}
                                                    clearItem={item => clearItemFromCart({ variables: { item } })}
                                                />
                                            )
                                        }
                                    }
                                </Mutation>
                            )
                        }
                    </Mutation>
                )
            }
        </Mutation >
    );

    export default CheckoutItemContainer;
    ```

4. Remove all redux code in Checkout-item component.

    __`Location:./clothing-friends-graplql-apollo/client/src/Components/Checkout-item/Checkout-item.component.jsx`__

    ```jsx
    import React from 'react';

    import './Checkout-item.styles.scss';

    const CheckoutItem = ({ cartItem, clearItem, addItem, removeItem }) => {
        const { name, imageUrl, price, quantity } = cartItem;
        return (
            <div className='checkout-item'>
                <div className='image-container'>
                    <img src={imageUrl} alt='item' />
                </div>
                <span className='name'>{name}</span>
                <span className='quantity'>
                    <div className='arrow' onClick={() => removeItem(cartItem)}>&#10094;</div>
                    <span className='value'>{quantity}</span>
                    <div className='arrow' onClick={() => addItem(cartItem)}>&#10095;</div>
                </span>
                <span className='price'>{price}</span>
                <div className='remove-button' onClick={() => clearItem(cartItem)}>&#10005;</div>
            </div>
        );
    };

    export default CheckoutItem;
    ```

5. Import Checkout-item container in CheckoutPage component.

    __`Location:./clothing-friends-graplql-apollo/client/src/Pages/CheckoutPage/CheckoutPage.component.jsx`__

    ```diff
    - import CheckoutItem from '../../Components/Checkout-item/Checkout-item.component';
    + import { default as CheckoutItem } from '../../Components/Checkout-item/Checkout-item.container';
    ```

#### `Comment:`
1. 

### <span id="12.3">`Step3: Directory data without redux.`</span>

- #### Click here: [BACK TO CONTENT](#12.0)

1. Set the directory data on local.

    __`Location:./clothing-friends-graplql-apollo/client/src/Components/Directory/Directory.data.js`__

    ```js
    const DIRECTORY_DATA = [
        {
            title: 'hats',
            imageUrl: 'https://i.ibb.co/cvpntL1/hats.png',
            id: 1,
            linkUrl: 'shop/hats'
        },
        {
            title: 'jackets',
            imageUrl: 'https://i.ibb.co/px2tCc3/jackets.png',
            id: 2,
            linkUrl: 'shop/jackets'
        },
        {
            title: 'sneakers',
            imageUrl: 'https://i.ibb.co/0jqHpnp/sneakers.png',
            id: 3,
            linkUrl: 'shop/sneakers'
        },
        {
            title: 'womens',
            imageUrl: 'https://i.ibb.co/GCCdy8t/womens.png',
            size: 'large',
            id: 4,
            linkUrl: 'shop/womens'
        },
        {
            title: 'mens',
            imageUrl: 'https://i.ibb.co/R70vBrQ/men.png',
            size: 'large',
            id: 5,
            linkUrl: 'shop/mens'
        }
    ];

    export default DIRECTORY_DATA;
    ```

2. Remove all redux code in Directory component. 

    __`Location:./clothing-friends-graplql-apollo/client/src/Components/Directory/Directory.component.jsx`__

    ```jsx
    import React from 'react';

    import DirectoryItem from '../Directory-item/Directory-item.component';
    import DIRECTORY_DATA from './Directory.data.js';

    import './Directory.styles.scss';

    const Directory = () => {
        return (
            <div className='directory-menu'>
                {DIRECTORY_DATA.map(({ id, ...otherSectionProps }) => (
                    <DirectoryItem key={id} {...otherSectionProps} />
                ))}
            </div>
        );
    };

    export default Directory;
    ```
#### `Comment:`
1. 

### <span id="12.4">`Step4: Local currentUser value and setCurrentUser mutation function.`</span>

- #### Click here: [BACK TO CONTENT](#12.0)

- :gem:`currentUser ===> App.container, Header.container`
- :gem:`setCurrentUser ===> App.container`
- :gem:`clearCart ===> Header.container`

1. Create a new data stored in local client. __`'currentUser'`__

    __`Location:./clothing-friends-graplql-apollo/client/src/index.js`__

    ```diff
    +import { default as App } from './App/App.container';

    client.writeData({
        data: {
            cartHidden: true,
            cartItems: [],
            itemCount: 0,
            cartTotal: 0,
    +       currentUser: null
        }
    });
    ```

2. Set up a current user type __`(User)`__ and mutation function type __`(SetCurrentUser)`__.

    __`Location:./clothing-friends-graplql-apollo/client/src/graphql/resolvers.js`__

    ```js
    export const typeDefs = gql`
        extend type DateTime {
            nanoseconds: Int!
            seconds: Int!
        }
        extend type User {
            id: ID!
            displayName: String!
            email: String!
            createdAt: DateTime!
        }
        extend type Mutation {
            SetCurrentUser(user: User!): User!
        }
    `;

    const GET_CURRENT_USER = gql`
        {
            currentUser @client
        }
    `;

    export const resolvers = {
        Mutation: {
            setCurrentUser: (_root, { user }, { cache }) => {
                cache.writeQuery({
                    query: GET_CURRENT_USER,
                    data: { currentUser: user }
                });
                return user;
            }
        }
    };
    ```

3. Pass __`'currentUser'`__ and mutation function __`'setCurrentUser'`__ to App container component.

    __`Location:./clothing-friends-graplql-apollo/client/src/App.container.jsx`__

    ```jsx
    import React from 'react';
    import { Mutation, Query } from 'react-apollo';
    import { gql } from 'apollo-boost';

    import App from './App';

    const SET_CURRENT_USER = gql`
        mutation SetCurrentUser($user: User!) {
            setCurrentUser(user: $user) @client
        }
    `;

    const GET_CURRENT_USER = gql`
        {
            currentUser @client
        }
    `;

    const AppContainer = () => (
        <Query query={GET_CURRENT_USER}>
            {({ data: { currentUser } }) => (
                <Mutation mutation={SET_CURRENT_USER}>
                    {setCurrentUser => (
                        <App
                            currentUser={currentUser}
                            setCurrentUser={user => {
                                setCurrentUser({ variables: { user } });
                            }}
                        />
                    )}
                </Mutation>
            )}
        </Query>
    );

    export default AppContainer;
    ```

4. Remove some redux code in App.js

    __`Location:./clothing-friends-graplql-apollo/client/src/App.js`__

    ```jsx
    import React from 'react';
    import { Switch, Route, Redirect } from 'react-router-dom';
    import { connect } from 'react-redux';
    import { createStructuredSelector } from 'reselect';

    import './App.css';

    import HomePage from './Pages/HomePage/HomePage.component';
    import ShopPage from './Pages/ShopPage/ShopPage.component';
    import SignInAndSignUpPage from './Pages/SignInSignUpPage/SignInAndSignUpPage.component';
    import { default as CheckoutPage } from './Pages/CheckoutPage/CheckoutPage.container';
    import { default as Header } from './Components/Header/Header.container';

    import { auth, checkDocOrCreateDocInFirestore } from './firebase/firebase.utils';

    import { setDisplayName } from './redux/display-name/display-name.actions';
    import { selectInputDisplayName } from './redux/display-name/display-name.selectors';

    class App extends React.Component {
        unsubscribeFromAuth = null;

        componentDidMount() {
            const { setCurrentUser } = this.props;
            this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
                if (userAuth) {
                    const userRef = await checkDocOrCreateDocInFirestore(userAuth);

                    userRef.onSnapshot(snapShot => {
                        setCurrentUser({
                            id: snapShot.id,
                            ...snapShot.data()
                        });
                    });
                } else {
                    setCurrentUser(null);
                }
            });
        }

        componentWillUnmount() {
            this.unsubscribeFromAuth();
        }

        render() {
            return (
                <div>
                    <Header />
                        <Switch>
                        <Route exact path='/' component={HomePage} />
                        <Route path='/shop' component={ShopPage} />
                        <Route exact path='/checkout' component={CheckoutPage} />
                        <Route
                            exact
                            path='/signin'
                            render={() =>
                            this.props.currentUser ? (
                                <Redirect to='/' />
                            ) : (
                                <SignInAndSignUpPage />
                                )
                            }
                        />
                    </Switch>
                </div>
            );
        }
    }

    const mapStateToProps = createStructuredSelector({
        displayName: selectInputDisplayName
    });

    const mapDispatchToProps = dispatch => ({
        setDisplayName: displayName => dispatch(setDisplayName(displayName)),
    });

    export default connect( mapStateToProps, mapDispatchToProps)(App);
    ```

5. Create a clear cart mutation function. __`'clearCart'`__

    __`Location:./clothing-friends-graplql-apollo/client/src/graphql/resolvers.js`__

    ```js
    export const typeDefs = gql`
        extend type Mutation {
            ClearCart:[Item]!
        }
    `;

    export const resolvers = {
        Mutation: {
            clearCart: (_root, _args, { cache }) => {
                cache.writeQuery({
                    query: GET_ITEM_COUNT,
                    data: { itemCount: 0 }
                });

                cache.writeQuery({
                    query: GET_CART_TOTAL,
                    data: { cartTotal: 0 }
                });

                cache.writeQuery({
                    query: GET_CART_ITEMS,
                    data: { cartItems: [] }
                });

                return [];
            }
    };
    ```

6. Pass __`'currentUser'`__ and __`'clearCart'`__ to Header container component.

    __`Location:./clothing-friends-graplql-apollo/client/src/Components/Header/Header.container.jsx`__

    ```jsx
    import React from 'react';
    import { Query, Mutation } from 'react-apollo';
    import { gql } from 'apollo-boost';

    import Header from './Header.component';

    const GET_CLIENT_PROPERTIES = gql`
        {
            cartHidden @client
            currentUser @client
        }
    `;

    const CLEAR_CART = gql`
        mutation ClearCart {
                clearCart @client
        }
    `;

    const HeaderContainer = () => {
        return (
            <Query query={GET_CLIENT_PROPERTIES}>
                {
                    ({ data: { cartHidden, currentUser } }) => {
                        return (
                            <Mutation mutation={CLEAR_CART}>
                                {
                                    clearCart => (
                                        <Header
                                            hidden={cartHidden}
                                            currentUser={currentUser}
                                            clearCart={clearCart} />
                                    )
                                }
                            </Mutation>
                        )
                    }
                }
            </Query>
        )
    };

    export default HeaderContainer;
    ```

7. Remove all redux code in Header component.

    __`Location:./clothing-friends-graplql-apollo/client/src/Components/Header/Header.component.jsx`__

    ```jsx
    import React from 'react';
    import { Link, withRouter } from "react-router-dom";

    import { auth } from '../../firebase/firebase.utils';

    import { default as CartIcon } from '../Cart-icon/Cart-icon.container';
    import { default as CartDropdown } from '../Cart-dropdown/Cart-dropdown.container';

    import { ReactComponent as Logo } from '../../assets/crown.svg';

    import './Header.styles.scss';

    const Header = ({ history, hidden, currentUser, clearCart }) => {
        const signOut = async () => {
            await auth.signOut();
            await clearCart();
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
1. 上面代码中，以下两个表达对结果有影响。
    ```diff
    - clearCart();
    + await clearCart();
    ```

### <span id="12.5">`Step5: Local sign up displayName value and setDisplayName mutation function.`</span>

- #### Click here: [BACK TO CONTENT](#12.0)

- :gem:`displayName ===> App.container`
- :gem:`setDisplayName ===> App.container, Header.container`

1. Create a new data stored in local client. __`'displayName'`__

    __`Location:./clothing-friends-graplql-apollo/client/src/index.js`__

    ```diff
    +import { default as App } from './App/App.container';

    client.writeData({
        data: {
            cartHidden: true,
            cartItems: [],
            itemCount: 0,
            cartTotal: 0,
            currentUser: null,
    +       displayName: null,
        }
    });
    ```

2. Set up a mutation function type __`(SetDisplayName)`__, a mutation function __`(setDisplayName)`__.

    __`Location:./clothing-friends-graplql-apollo/client/src/graphql/resolvers.js`__

    ```js
    export const typeDefs = gql`
        extend type Mutation {
            SetDisplayName(displayName: DisplayName!): DisplayName!
        }
    `;

    const GET_DISPLAY_NAME = gql`
        {
            displayName @client
        }
    `;

    export const resolvers = {
        Mutation: {
            setDisplayName: (_root, { displayName }, { cache }) => {
                cache.writeQuery({
                    query: GET_DISPLAY_NAME,
                    data: { displayName: displayName }
                });
                return displayName;
            }
        }
    };
    ```

3. Pass __`'displayName'`__ and __`'setDisplayName'`__ to App container component.

    __`Location:./clothing-friends-graplql-apollo/client/src/App.container.jsx`__

    ```jsx
    import React from 'react';
    import { Mutation, Query } from 'react-apollo';
    import { gql } from 'apollo-boost';

    import App from './App';

    const SET_CURRENT_USER = gql`
        mutation SetCurrentUser($user: User!) {
            setCurrentUser(user: $user) @client
        }
    `;

    const SET_DISPLAY_NAME = gql`
        mutation SetDisplayName($displayName: DisplayName!) {
            setDisplayName(displayName: $displayName) @client
        }
    `;

    const GET_CURRENT_USER_AND_DISPLAY_NAME = gql`
        {
            currentUser @client
            displayName @client
        }
    `;

    const AppContainer = () => (
        <Query query={GET_CURRENT_USER_AND_DISPLAY_NAME}>
            {({ data: { currentUser, displayName } }) => (
                <Mutation mutation={SET_CURRENT_USER}>
                    {setCurrentUser => (
                        <Mutation mutation={SET_DISPLAY_NAME}>
                            {
                                setDisplayName => {
                                    return (
                                        <App
                                            currentUser={currentUser}
                                            displayName={displayName}
                                            setDisplayName={displayName => {
                                                setDisplayName({ variables: { displayName } });
                                            }}
                                            setCurrentUser={user => {
                                                setCurrentUser({ variables: { user } });
                                            }}
                                        />
                                    )
                                }
                            }
                        </Mutation>
                    )}
                </Mutation>
            )}
        </Query>
    );

    export default AppContainer;
    ```

4. Remove all redux code in App.js

    __`Location:./clothing-friends-graplql-apollo/client/src/App.js`__

    ```jsx
    import React from 'react';
    import { Switch, Route, Redirect } from 'react-router-dom';

    import './App.css';

    import HomePage from './Pages/HomePage/HomePage.component';
    import ShopPage from './Pages/ShopPage/ShopPage.component';
    import SignInAndSignUpPage from './Pages/SignInSignUpPage/SignInAndSignUpPage.component';
    import { default as CheckoutPage } from './Pages/CheckoutPage/CheckoutPage.container';
    import { default as Header } from './Components/Header/Header.container';

    import { auth, checkDocOrCreateDocInFirestore } from './firebase/firebase.utils';

    class App extends React.Component {
        unsubscribeFromAuth = null;

        componentDidMount() {
            const { setCurrentUser, setDisplayName } = this.props;

            this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
                if (userAuth) {
                    const displayName = userAuth.displayName || this.props.displayName;
                    const userRef = await checkDocOrCreateDocInFirestore(userAuth, displayName);

                    userRef.onSnapshot(snapShot => {
                    setCurrentUser({
                        id: snapShot.id,
                        ...snapShot.data()
                    });
                    setDisplayName(null);
                    });
                } else {
                    setCurrentUser(null);
                    setDisplayName(null);
                }
            });
        }

        componentWillUnmount() {
            this.unsubscribeFromAuth();
        }

        render() {
            return (
            <div>
                <Header />
                <Switch>
                <Route exact path='/' component={HomePage} />
                <Route path='/shop' component={ShopPage} />
                <Route exact path='/checkout' component={CheckoutPage} />
                <Route
                    exact
                    path='/signin'
                    render={() =>
                    this.props.currentUser ? (
                        <Redirect to='/' />
                    ) : (
                        <SignInAndSignUpPage />
                        )
                    }
                />
                </Switch>
            </div>
            );
        }
    }

    export default App;
    ```

5. Pass __`'setDisplayName'`__ to Sign-up container component.

    __`Location:./clothing-friends-graplql-apollo/client/src/Components/Sign-up/Sign-up.container.jsx`__

    ```jsx
    import React from 'react';
    import { Mutation } from 'react-apollo';
    import { gql } from 'apollo-boost';

    import SignUp from './Sign-up.component';

    const SET_DISPLAY_NAME = gql`
        mutation SetDisplayName($displayName: DisplayName!) {
            setDisplayName(displayName: $displayName) @client
        }
    `;

    const SignUpContainer = () => {
        return (
            <Mutation mutation={SET_DISPLAY_NAME}>
                {
                    setDisplayName =>
                        <SignUp
                            setDisplayName={displayName => {
                                setDisplayName({ variables: { displayName } });
                            }}
                        />
                }
            </Mutation>
        )
    }

    export default SignUpContainer;
    ```

6. Remove all redux code in Sign-up component

    __`Location:./clothing-friends-graplql-apollo/client/src/Components/Sign-up/Sign-up.component.jsx`__

    ```jsx
    import React from 'react';

    import FormInput from '../Form-input/Form-input.component';
    import CustomButton from '../Custom-button/Custom-button.component';

    import { auth, signInWithGoogle } from '../../firebase/firebase.utils';

    import './Sign-up.styles.scss';

    class SignUp extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                displayName: '',
                email: '',
                password: '',
                confirmPassword: ''
            };
        }

        handleSubmit = async event => {
            event.preventDefault();
            const { displayName, email, password, confirmPassword } = this.state;
            if (password !== confirmPassword) {
                alert("passwords don't match");
                return;
            }

            try {
                this.props.setDisplayName(displayName);
                await auth.createUserWithEmailAndPassword(email, password);

                this.setState({ displayName: '', email: '', password: '', confirmPassword: '' });
            } catch (error) {
                console.error(error);
            }
        };

        handleChange = event => {
            const { name, value } = event.target;
            this.setState({ [name]: value });
        };

        render() {
            const { displayName, email, password, confirmPassword } = this.state;
            return (
                <div className='sign-up'>
                    <h2 className='title'>I do not have a account</h2>
                    <span>Sign up with your email and password</span>
                    <form className='sign-up-form' onSubmit={this.handleSubmit}>
                        <FormInput
                            type='text'
                            name='displayName'
                            value={displayName}
                            onChange={this.handleChange}
                            label='Display Name'
                            required
                        />
                        <FormInput
                            type='email'
                            name='email'
                            value={email}
                            onChange={this.handleChange}
                            label='Email'
                            required
                        />
                        <FormInput
                            type='password'
                            name='password'
                            value={password}
                            onChange={this.handleChange}
                            label='Password'
                            required
                        />
                        <FormInput
                            type='password'
                            name='confirmPassword'
                            value={confirmPassword}
                            onChange={this.handleChange}
                            label='Confirm Password'
                            required
                        />
                        <div className='buttons'>
                            <CustomButton type='submit'> Sign Up </CustomButton>
                            <CustomButton type='button' onClick={signInWithGoogle} google={true}>
                                Sign Up with Google
                            </CustomButton>
                        </div>
                    </form>
                </div>
            );
        }
    }

    export default SignUp;
    ```

7. Import SignUpContainer in SignInANdSignUpPage

    __`Location:./clothing-friends-graplql-apollo/client/src/Pages/SignInSignUpPage/SignInAndSignUpPage.component.jsx`__

    ```diff
    - import SignUp from '../../Components/Sign-up/Sign-up.component';
    + import { default as SignUp } from '../../Components/Sign-up/Sign-up.container'; 
    ```

### <span id="12.6">`Step6: Local cache set up data flow.`</span>

- #### Click here: [BACK TO CONTENT](#12.0)

1. 

__`本章用到的全部资料：`__

- [https://www.apollographql.com/docs/.](https://www.apollographql.com/docs/)

- #### Click here: [BACK TO CONTENT](#12.0)
- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/README.md)