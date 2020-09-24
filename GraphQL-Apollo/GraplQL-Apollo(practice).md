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

    7. Cart-icon.container.jsx
    8. Cart-icon.component.jsx
    9. Cart-dropdown.container.jsx
    10. Cart-dropdown.component.jsx
    12. Collection-item.container.jsx
    12. Collection-item.component.jsx
    13. Collection-preview.component.jsx
    14. CategoryPage.component.jsx 

------------------------------------------------------------

- 关于 container 接受的参数：
```diff
+ 
```
------------------------------------------------------------

#### `Apollo:`
- [https://www.apollographql.com/docs/](https://www.apollographql.com/docs/)

### <span id="12.0">`Brief Contents & codes position`</span>

- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/README.md)

- [12.1 Local cart total value and mutation function.](#12.1)
- [12.2 Local remove item and clear item from cart mutation functions.](#12.2)
- [12.3 Local cart items value and cart items function.(Mutation with variable)](#12.3)
- [12.4 Local cart quantity value and mutation function.](#12.4)

------------------------------------------------------------

### <span id="12.1">`Step1: Local cart total value and mutation function.`</span>

- #### Click here: [BACK TO CONTENT](#11.0)

1. Create a new data stored in local client.

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

2. Pass the data to CheckoutPage container component. :gem:`(completed)`

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

    ```diff
    + import { getCartTotal } from './cart.utils';

    + const GET_CART_TOTAL = gql`
    +    {
    +        cartTotal @client
    +    }
    +`;

    export const resolvers = {
        Mutation: {
            toggleCartHidden: (_root, _args, { cache }) => {
                const { cartHidden } = cache.readQuery({
                    query: GET_CART_HIDDEN
                });

                cache.writeQuery({
                    query: GET_CART_HIDDEN,
                    data: { cartHidden: !cartHidden }
                });

                return !cartHidden;
            },

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

    +           cache.writeQuery({
    +               query: GET_CART_TOTAL,
    +               data: { cartTotal: getCartTotal(newCartItems) }
    +           });

                return newCartItems;
            }
        }
    };
    ```

5. Apply. 由于增加的代码属于 mutation function `addItemToCart` 的一部分，所以不需要传递到 component。

#### `Comment:`
1. 

### <span id="12.2">`Step2: Local remove item and clear item from cart mutation functions.`</span>

- #### Click here: [BACK TO CONTENT](#12.0)

1. Create a new data stored in local client.

    __`Location:./clothing-friends-graplql-apollo/client/src/index.js`__

    ```diff
    client.writeData({
        data: {
            cartHidden: true,
    +       cartItems: [],
        }
    });
    ```

2. Pass the data to Cart-dropdown container component.:gem:`(completed)`

    __`Location:./clothing-friends-graplql-apollo/client/src/Components/Cart-dropdown/Cart-dropdown.container.jsx`__

    ```jsx
    import React from 'react';
    import { Query, Mutation } from 'react-apollo';
    import { gql } from 'apollo-boost';

    import CartDropdown from './Cart-dropdown.component';

    const TOGGLE_CART_HIDDEN = gql`
        mutation ToggleCartHidden{
            toggleCartHidden @client
        }
    `;

    const GET_CART_ITEMS = gql`
        {
            cartItems @client 
        }
    `;

    const CartDropdownContainer = () => {
        return (
            <Mutation mutation={TOGGLE_CART_HIDDEN}>
                {
                    toggleCartHidden => {
                        <Query query={GET_CART_ITEMS}>
                            {
                                ({ data: { cartItems } }) => {
                                    return (
                                        <CartDropdown cartItems={cartItems} toggleCartHidden={toggleCartHidden} />
                                    )
                                }
                            }
                        </Query>
                    }
                }
            </Mutation>
        )
    };

    export default CartDropdownContainer;
    ```

3. Remove all redux code in Cart-dropdown component.:gem:`(completed)`

    __`Location:./clothing-friends-graplql-apollo/client/src/Components/Cart-dropdown/Cart-dropdown.component.jsx`__

    ```jsx
    import React from 'react';
    import { withRouter } from 'react-router-dom';

    import CustomButton from '../Custom-button/Custom-button.component';
    import CartItem from '../Cart-item/Cart-item.component';

    import './Cart-dropdown.styles.scss';

    const CartDropdown = ({ cartItems, history, toggleCartHidden }) => (
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
                    toggleCartHidden();
                }}
            >
                GO TO CHECKOUT
        </CustomButton>
        </div>
    );

    export default withRouter(CartDropdown);
    ```

4. Create a new mutation type.

    __`Location:./clothing-friends-graplql-apollo/client/src/graphql/resolvers.js`__

    ```diff
    export const typeDefs = gql`
        extend type Mutation{
            ToggleCartHidden:Boolean!
    +       AddItemToCart(item:Item!):[Item]!
        }
    `;
    ```

5. Create a new mutation function.

    __`Location:./clothing-friends-graplql-apollo/client/src/graphql/resolvers.js`__

    ```diff
    + const GET_CART_ITEMS = gql`
    +    {
    +        cartItems @client
    +    }
    +`;

    export const resolvers = {
        Mutation: {
            toggleCartHidden: (_root, _args, { cache }) => {
                const { cartHidden } = cache.readQuery({
                    query: GET_CART_HIDDEN
                });

                cache.writeQuery({
                    query: GET_CART_HIDDEN,
                    data: { cartHidden: !cartHidden }
                });

                return !cartHidden;
            },

    +        addItemToCart: (_root, { item }, { cache }) => {
    +            const { carItems } = cache.readQuery({
    +                query: GET_CART_ITEMS
    +            });

    +            const newCartItems = addItemToCart(cartItems, item);
                
    +            cache.writeQuery({
    +                query: GET_CART_ITEMS,
    +                data: { carItems: newCartItems }
    +            })
    +            return newCartItems;
    +        }
        }
    };
    ```

6. Apply the mutation function in Collection-item container. :gem:`(completed)`

    __`Location:./clothing-friends-graplql-apollo/client/src/Components/Collection-item/Collection-item.container.jsx`__

    ```jsx
    import React from 'react';
    import { Mutation } from 'react-apollo';
    import { gql } from 'apollo-boost';

    import CollectionItem from './Collection-item.component';

    const ADD_ITEM_TO_CART = gql`
        mutation AddItemToCart($item: Item!) {
            addItemToCart(item: $item) @client
        }
    `;

    const CollectionItemContainer = props => (
        <Mutation mutation={ADD_ITEM_TO_CART}>
            {
                addItemToCart => {
                    return (<CollectionItem
                        {...props}
                        addItem={item => addItemToCart({ variables: { item } })}
                    />
                    )
                }
            }
        </Mutation>
    );

    export default CollectionItemContainer;
    ```

- Remove redux code in Collection-item component.:gem:`(completed)`

    __`Location:./clothing-friends-graplql-apollo/client/src/Components/Collection-item/Collection-item.component.jsx`__

    ```jsx
    import React from 'react';

    import CustomButton from '../Custom-button/Custom-button.component';

    import './Collection-item.styles.scss';

    const CollectionItem = ({ item, addItem }) => {
        const { name, price, imageUrl } = item;
        return (
            <div className='collection-item'>
                <div className='image' style={{ backgroundImage: `url(${imageUrl})` }} />
                <div className='collection-footer'>
                    <span className='name'>{name}</span>
                    <span className='price'>{price}</span>
                </div>
                <CustomButton onClick={() => addItem(item)} inverted>
                    Add to cart
                </CustomButton>
            </div>
        );
    };

    export default CollectionItem;
    ```

7. Import Collection-item container in Collection-preview component.

    __`Location:./clothing-friends-graplql-apollo/client/src/Components/Collection-preview/Collection-preview.component.jsx`__

    ```diff
    - import CollectionItem from '../Collection-item/Collection-item.component'
    + import { default as CollectionItem } from '../Collection-item/Collection-item.container'
    ```

8. Import Collection-item container in CategoryPage component.

    __`Location:./clothing-friends-graplql-apollo/client/src/Pages/CategoryPage/CategoryPage.component.jsx`__

    ```diff
    - import CollectionItem from '../../Components/Collection-item/Collection-item.component';

    + import { default as CollectionItem } from '../../Components/Collection-item/Collection-item.container';
    ```

#### `Comment:`
1. 

### <span id="12.3">`Step3: Local cart quantity value and mutation function.`</span>

- #### Click here: [BACK TO CONTENT](#12.0)

1. Create a new data stored in local client.

    __`Location:./clothing-friends-graplql-apollo/client/src/index.js`__

    ```diff
    client.writeData({
        data: {
            cartHidden: true,
            cartItems: [],
    +       itemCount: 0
        }
    });
    ```

2. Pass the data to Cart-icon container component. :gem:`(completed)`

    __`Location:./clothing-friends-graplql-apollo/client/src/Components/Cart-icon/Cart-icon.container.jsx`__

    ```jsx
    import React from 'react';
    import { Mutation, Query } from 'react-apollo';
    import { gql } from 'apollo-boost';

    import CartIcon from './Cart-icon.component';

    const TOGGLE_CART_HIDDEN = gql`
        mutation ToggleCartHidden{
            toggleCartHidden @client
        }
    `;

    const GET_ITEM_COUNT = gql`
        {
            itemCount @client
        }
    `

    const CartIconContainer = () => {
        return (
            <Query query={GET_ITEM_COUNT}>
                {
                    ({ data: { itemCount } }) => {
                        return (
                            < Mutation mutation={TOGGLE_CART_HIDDEN}>
                                {
                                    toggleCartHidden => <CartIcon toggleCartHidden={toggleCartHidden} itemCount={itemCount} />
                                }
                            </Mutation>
                        )
                    }
                }
            </Query >
        )
    }

    export default CartIconContainer;
    ```

3. Remove all redux code in Cart-icon component.:gem:`(completed)`

    __`Location:./clothing-friends-graplql-apollo/client/src/Components/Cart-icon/Cart-icon.component.jsx`__

    ```jsx
    import React from 'react';

    import { ReactComponent as ShoppingIcon } from '../../assets/shopping-bag.svg';

    import './Cart-icon.styles.scss';

    const CartIcon = ({ toggleCartHidden, itemCount }) => (
        <div className='cart-icon' onClick={toggleCartHidden}>
            <ShoppingIcon className='shopping-icon' />
            <span className='item-count'>{itemCount}</span>
        </div>
    );

    export default CartIcon;
    ```

4. Create an extra data type in Item schema.

    __`Location:./clothing-friends-graplql-apollo/client/src/graphql/resolvers.js`__

    ```diff
    import { gql } from 'apollo-boost';

    import { addItemToCart, getCartItemCount } from './cart.utils';

    export const typeDefs = gql`

    +    extend type Item{
    +        quantity:Int
    +    }

        extend type Mutation{
            ToggleCartHidden:Boolean!
            AddItemToCart(item:Item!):[Item]!
        }
    `;

    const GET_CART_HIDDEN = gql`
        {
            cartHidden @client
        }
    `;

    +const GET_ITEM_COUNT = gql`
    +    {
    +        itemCount @client
    +    }
    +`;

    const GET_CART_ITEMS = gql`
    {
        cartItems @client
    }
    `;

    export const resolvers = {
        Mutation: {
            toggleCartHidden: (_root, _args, { cache }) => {
                const { cartHidden } = cache.readQuery({
                    query: GET_CART_HIDDEN
                });

                cache.writeQuery({
                    query: GET_CART_HIDDEN,
                    data: { cartHidden: !cartHidden }
                });

                return !cartHidden;
            },

            addItemToCart: (_root, { item }, { cache }) => {
                const { cartItems } = cache.readQuery({
                    query: GET_CART_ITEMS
                });

                const newCartItems = addItemToCart(cartItems, item);

    +            cache.writeQuery({
    +                query: GET_ITEM_COUNT,
    +                data: { itemCount: getCartItemCount(newCartItems) }
    +            });

                cache.writeQuery({
                    query: GET_CART_ITEMS,
                    data: { cartItems: newCartItems }
                });

                return newCartItems;
            }
        }
    };
    ```

5. Apply. 由于增加的代码属于 mutation function `addItemToCart` 的一部分，所以不需要传递到 component。

#### `Comment:`

1. 

__`本章用到的全部资料：`__

- [https://www.apollographql.com/docs/.](https://www.apollographql.com/docs/)

- #### Click here: [BACK TO CONTENT](#12.0)
- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/README.md)