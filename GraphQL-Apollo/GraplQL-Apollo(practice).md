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
    4. Header.container.jsx
    5. Header.component.jsx
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

- [12.1 Configurations.](#12.1)
- [12.2 Local cart hidden value and toggleCartHidden function.(Mutation with no variable)](#12.2)
- [12.3 Local cart items value and cart items function.(Mutation with variable)](#12.3)
- [12.4 Local cart quantity value and mutation function.](#12.4)

------------------------------------------------------------

### <span id="12.1">`Step1: Local cart hidden value and toggleCartHidden function.(Mutation with no variable).`</span>

- #### Click here: [BACK TO CONTENT](#12.0)

1. Create a new data stored in local client.

    __`Location:./clothing-friends-graplql-apollo/client/src/index.js`__

    ```js
    client.writeData({
        data: {
            cartHidden: true
        }
    });
    ```

2. Pass the data into Header container component.

    __`Location:./clothing-friends-graplql-apollo/client/src/Components/Header/Header.container.jsx`__

    ```jsx
    import React from 'react';
    import { Query } from 'react-apollo';
    import { gql } from 'apollo-boost';

    import Header from './Header.component';

    const GET_CART_HIDDEN = gql`
        {
            cartHidden @client
        }
    `;

    const HeaderContainer = () => {
        return (
            <Query query={GET_CART_HIDDEN}>
                {
                    ({ data }) => {
                        const { cartHidden } = data;
                        return <Header hidden={cartHidden} />
                    }
                }
            </Query>
        )
    }

    export default HeaderContainer;
    ```

3. Remove some redux code in Header.component.

    __`Location:./clothing-friends-graplql-apollo/client/src/Components/Header/Header.component.jsx`__

    ```diff
    - import { selectCurrentHiddenCart } from '../../redux/hide-cart/hide-cart.selectors';

     const mapStateToProps = createStructuredSelector({
         currentUser: selectCurrentUser,
    -    hidden: selectCurrentHiddenCart
     });
    ```

4. Import Header container in App.js

    __`Location:./clothing-friends-graplql-apollo/client/src/App.js`__

    ```diff
    - import Header from './Components/Header/Header.component';
    + import { default as Header } from './Components/Header/Header.container';
    ```

5. Create a new mutation type.

    __`Location:./clothing-friends-graplql-apollo/client/src/graphql/resolvers.js`__

    ```js
    export const typeDefs = gql`
        extend type Mutation{
            ToggleCartHidden:Boolean!
        }
    `;
    ```

6. Create a new mutation function.

    __`Location:./clothing-friends-graplql-apollo/client/src/graphql/resolvers.js`__

    ```js
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
            }
        }
    };
    ```

7. Apply the function in Cart-icon component.

    __`Location:./clothing-friends-graplql-apollo/client/src/Components/Cart-icon/Cart-icon.container.jsx`__

    ```jsx
    import React from 'react';
    import { Mutation } from 'react-apollo';
    import { gql } from 'apollo-boost';

    import CartIcon from './Cart-icon.component';

    const TOGGLE_CART_HIDDEN = gql`
        mutation ToggleCartHidden{
            toggleCartHidden @client
        }
    `;

    const CartIconContainer = () => {
        return (
            < Mutation mutation={TOGGLE_CART_HIDDEN}>
                {
                    toggleCartHidden => <CartIcon toggleCartHidden={toggleCartHidden}/>
                }
            </Mutation>
        )
    }

    export default CartIconContainer;
    ```

- Remove some redux code in Cart-icon component.

    __`Location:./clothing-friends-graplql-apollo/client/src/Components/Cart-icon/Cart-icon.component.jsx`__

    ```diff
    - import { toggleCartHidden } from '../../redux/hide-cart/hide-cart.actions';

    - const mapDispatchToProps = dispatch => ({
    -     toggleCartHidden: () => dispatch(toggleCartHidden())
    - });
    ```

8. Apply the function in Cart-dropdown component.

    __`Location:./clothing-friends-graplql-apollo/client/src/Components/Cart-dropdown/Cart-dropdown.container.jsx`__

    ```jsx
    import React from 'react';
    import { Mutation } from 'react-apollo';
    import { gql } from 'apollo-boost';

    import CartDropdown from './Cart-dropdown.component';

    const TOGGLE_CART_HIDDEN = gql`
        mutation ToggleCartHidden{
            toggleCartHidden @client
        }
    `

    const CartDropdownContainer = () => {
        return (
            <Mutation mutation={TOGGLE_CART_HIDDEN}>
                {
                    toggleCartHidden => {
                        return <CartDropdown toggleCartHidden={toggleCartHidden} />
                    }
                }
            </Mutation>
        )
    }

    export default CartDropdownContainer;
    ```

- Remove some redux code in Cart-dropdown component.

    __`Location:./clothing-friends-graplql-apollo/client/src/Components/Cart-dropdown/Cart-dropdown.component.jsx`__

    ```diff
    - import { connect } from 'react-redux';
    - import { createStructuredSelector } from 'reselect';
    - import { toggleCartHidden } from '../../redux/hide-cart/hide-cart.actions';

    - const CartDropdown = ({ cartItems, history, dispatch }) => (
    + const CartDropdown = ({ cartItems, history, toggleCartHidden }) => (

    <CustomButton
        onClick={() => {
            history.push('/checkout');
    -       dispatch(toggleCartHidden());
    +       toggleCartHidden();
        }}
    >
    ```

9. Import Cart-icon container and Cart-dropdown container in Header component.

    __`Location:./clothing-friends-graplql-apollo/client/src/Components/Header/Header.component.jsx`__

    ```diff
    - import CartIcon from '../Cart-icon/Cart-icon.component';
    - import CartDropdown from '../Cart-dropdown/Cart-dropdown.component';

    + import { default as CartIcon } from '../Cart-icon/Cart-icon.container';
    + import { default as CartDropdown } from '../Cart-dropdown/Cart-dropdown.container';
    ```

#### `Comment:`
1. 

### <span id="12.2">`Step2: Local cart items value and cart items function.(Mutation with variable).`</span>

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