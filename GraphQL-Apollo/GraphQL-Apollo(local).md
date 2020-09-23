# Front end development tools (Part 11)

### `Key Words: GraphQL frontend, Apollo, Spinner, local dynamic.`

- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/README.md)

## `Section: GraphQl frontend Apollo.` (Advanced)

### `Summary`: In this documentation, we learn to use GraphQL in frontend to mutate local data.

### `Check Dependencies & Tools:`

- null
------------------------------------------------------------

#### `本章背景：`
1. 本小节主要讲述的是如何使用 apollo 代替 redux 的本地 state。
2. :gem::gem::gem:`重点是引导本地定义数据（query）和本地定义函数（mutation）到组件。`

3. :gem::gem::gem: 步骤：1. create 定义 2. gql 引用 3. get in component 应用
------------------------------------------------------------

#### `定义本地新 data 核心步骤：`:gem::gem::gem:

- 定义新 data。

```jsx
// 新建
client.writeData({
    data: {
        cartHidden: true
    }
});

// 查询引用变量语句
const GET_CART_HIDDEN = gql`
    {
        cartHidden @client
    }
`;

// 应用在 React component
<Query query={GET_CART_HIDDEN}>
    {
        ({ data }) => {
            const { cartHidden } = data;
            return <Header hidden={cartHidden} />
        }
    }
</Query>
```
------------------------------------------------------------

#### `定义本地新 mutation 核心步骤：`:gem::gem::gem:

- 定义新 data。

```js
// 新建 mutation 类型
export const typeDefs = gql`
    extend type Mutation{
        ToggleCartHidden:Boolean!
    }
`;

// 查询引用变量语句
const GET_CART_HIDDEN = gql`
    {
        cartHidden @client
    }
`;

// 新建 mutation function
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

// 查询引用 mutation 语句
const TOGGLE_CART_HIDDEN = gql`
    mutation ToggleCartHidden{
        toggleCartHidden @client
    }
`;

// 应用在 React component
const CartIconContainer = () => {
    return (
        < Mutation mutation={TOGGLE_CART_HIDDEN}>
            {
                toggleCartHidden => <CartIcon toggleCartHidden={toggleCartHidden}/>
            }
        </Mutation>
    )
};
```
------------------------------------------------------------

- 关于 container 接受的参数：
```diff
+ Header 接受 query(cartHidden) 一种参数。
+ Cart-icon 接受 query(itemCount) 和 mutation(toggleCartHidden) 两种参数。
+ Cart-dropdown 接受 query(cartItems) 和 mutation(toggleCartHidden) 两种参数。
+ Collection-item 接受 mutation(addItemToCart) 一种参数。
```

#### `Apollo:`
- [https://www.apollographql.com/docs/](https://www.apollographql.com/docs/)

### <span id="11.0">`Brief Contents & codes position`</span>

- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/README.md)

- [11.1 Configurations.](#11.1)
- [11.2 Local cart hidden value and toggleCartHidden function.(Mutation with no variable)](#11.2)
- [11.3 Local cart items value and cart items function.(Mutation with variable)](#11.3)
- [11.4 Local cart quantity value and mutation function.](#11.4)

------------------------------------------------------------

### <span id="11.1">`Step1: Configurations.`</span>

- #### Click here: [BACK TO CONTENT](#11.0)

1. Create a new folder `graphql` and a new file `resolvers.js`.

    __`Location:./clothing-friends-graplql-apollo/client/src/index.js`__

    ```diff
    +import { resolvers, typeDefs } from './graphql/resolvers';

     const client = new ApolloClient({
       link: httpLink,
       cache,
    +  typeDefs,
    +  resolvers
     });
    ```

### <span id="11.2">`Step2: Local cart hidden value and toggleCartHidden function.(Mutation with no variable).`</span>

- #### Click here: [BACK TO CONTENT](#11.0)

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

### <span id="11.3">`Step3: Local cart items value and cart items function.(Mutation with variable).`</span>

- #### Click here: [BACK TO CONTENT](#11.0)

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

2. Pass the data to Cart-dropdown container component.

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

3. Remove all redux code in Cart-dropdown component.

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

6. Apply the mutation function in Collection-item container.

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

- Remove redux code in Collection-item component.

    __`Location:./clothing-friends-graplql-apollo/client/src/Components/Collection-item/Collection-item.component.jsx`__

    ```diff
    - import { connect } from 'react-redux';
    - import { addItem } from '../../redux/cart/cart.actions';

    - const mapDispatchToProps = dispatch => ({
    -    addItem: item => dispatch(addItem(item))
    - });

    - export default connect(null,mapDispatchToProps)(CollectionItem);
    + export default CollectionItem;
    ```

7. Import Collection-item container in Collection-preview component.

    __`Location:./clothing-friends-graplql-apollo/client/src/Components/Collection-preview/Collection-preview.container.jsx`__

    ```diff
    - import CollectionItem from '../Collection-item/Collection-item.component'
    + import { default as CollectionItem } from '../Collection-item/Collection-item.container'
    ```

#### `Comment:`
1. 

### <span id="11.4">`Step4: Local cart quantity value and mutation function.`</span>

- #### Click here: [BACK TO CONTENT](#11.0)

1. 


#### `Comment:`
1. 


-----------------------------------------------------------------

__`本章用到的全部资料：`__

- [https://www.apollographql.com/docs/.](https://www.apollographql.com/docs/)

- #### Click here: [BACK TO CONTENT](#11.0)
- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/README.md)