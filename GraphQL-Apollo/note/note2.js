//step2
// cart.utils.js
export const clearItemFromCart = (cartItems, item) =>
  cartItems.filter(cartItem => cartItem.id !== item.id);

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

// clear whole item and remove one item from cart
import { removeItemFromCart, clearItemFromCart } from './cart.utils';

export const typeDefs = gql`
  extend type Mutation {
    RemoveItemFromCart(item: Item!): [Item]!
    ClearItemFromCart(item: Item!): [Item]!
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
}


// check-out item container
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { gql } from 'apollo-boost';

import CheckoutItem from './checkout-item.component';

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

const CollectionItemContainer = ({
  addItemToCart,
  removeItemFromCart,
  clearItemFromCart,
  ...otherProps
}) => (
    <CheckoutItem
      {...otherProps}
      addItem={item => addItemToCart({ variables: { item } })}
      removeItem={item => removeItemFromCart({ variables: { item } })}
      clearItem={item => clearItemFromCart({ variables: { item } })}
    />
  );

export default compose(
  graphql(ADD_ITEM_TO_CART, { name: 'addItemToCart' }),
  graphql(REMOVE_ITEM_FROM_CART, { name: 'removeItemFromCart' }),
  graphql(CLEAR_ITEM_FROM_CART, { name: 'clearItemFromCart' })
)(CollectionItemContainer);

// checkout-item component
import React from 'react';

import './checkout-item.styles.scss';

const CheckoutItem = ({ cartItem, clearItem, addItem, removeItem }) => {
  const { name, imageUrl, price, quantity } = cartItem;
  return (
    <div className='checkout-item'>
      <div className='image-container'>
        <img src={imageUrl} alt='item' />
      </div>
      <span className='name'>{name}</span>
      <span className='quantity'>
        <div className='arrow' onClick={() => removeItem(cartItem)}>
          &#10094;
        </div>
        <span className='value'>{quantity}</span>
        <div className='arrow' onClick={() => addItem(cartItem)}>
          &#10095;
        </div>
      </span>
      <span className='price'>{price}</span>
      <div className='remove-button' onClick={() => clearItem(cartItem)}>
        &#10005;
      </div>
    </div>
  );
};

export default CheckoutItem;

// checkoutPage.component
import React from 'react';

import { default as CheckoutItem } from '../../components/checkout-item/checkout-item.container';
import StripeCheckoutButton from '../../components/stripe-button/stripe-button.component';

import './checkout.styles.scss';

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

//step1
// index.js
client.writeData({
  cartHidden: true,
  cartItems: [],
  itemCount: 0,
  cartTotal: 0,
  currentUser: null
});

//resolvers.js
import { getCartTotal } from './cart.utils';

const GET_CART_TOTAL = gql`
  {
    cartTotal @client
  }
`;

cache.writeQuery({
  query: GET_CART_TOTAL,
  data: { cartTotal: getCartTotal(newCartItems) }
});

// checkoutPage.container
import React from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';

import CheckoutPage from './checkout.component';

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

//checkoutPage.component
import React from 'react';

import CheckoutItem from '../../Components/checkout-item/checkout-item.component';
import StripeCheckoutButton from '../../components/stripe-button/stripe-button.component';

import './checkout.styles.scss';

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


//App.js
import { default as CheckoutPage } from './Pages/CheckoutPage/CheckoutPage.container';



//------------------------------------------------------- currentUser
//1. index.js
import { default as App } from './App/App.container';

client.writeData({
  data: {
    cartHidden: true,
    cartItems: [],
    itemCount: 0,
    cartTotal: 0,
    currentUser: null
  }
});

// 2. App.container.jsx
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

// 3. App.js
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import './App.css';

import HomePage from '../pages/homepage/homepage.component';
import ShopPage from '../pages/shop/shop.component';
import SignInAndSignUpPage from '../pages/sign-in-and-sign-up/sign-in-and-sign-up.component';
import { default as CheckoutPage } from '../pages/checkout/checkout.container';

import { default as Header } from '../components/header/header.container';

import { auth, createUserProfileDocument } from '../firebase/firebase.utils';

class App extends React.Component {
  unsubscribeFromAuth = null;

  componentDidMount() {
    const { setCurrentUser } = this.props;

    this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth);

        userRef.onSnapshot(snapShot => {
          setCurrentUser({
            id: snapShot.id,
            ...snapShot.data()
          });
        });
      } else {
        setCurrentUser(userAuth);
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

// 4. Header.container.jsx
import React from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';

import Header from './header.component';

const GET_CLIENT_PROPERTIES = gql`
  {
    cartHidden @client
    currentUser @client
  }
`;

const HeaderContainer = () => (
  <Query query={GET_CLIENT_PROPERTIES}>
    {({ data: { cartHidden, currentUser } }) => (
      <Header hidden={cartHidden} currentUser={currentUser} />
    )}
  </Query>
);

export default HeaderContainer;

// 5. Header.component.jsx
import React from 'react';
import { Link } from 'react-router-dom';

import { auth } from '../../firebase/firebase.utils';
import { default as CartIcon } from '../cart-icon/cart-icon.container';
import { default as CartDropdown } from '../cart-dropdown/cart-dropdown.container';

import { ReactComponent as Logo } from '../../assets/crown.svg';

import './header.styles.scss';

const Header = ({ currentUser, hidden }) => (
  <div className='header'>
    <Link className='logo-container' to='/'>
      <Logo className='logo' />
    </Link>
    <div className='options'>
      <Link className='option' to='/shop'>
        SHOP
      </Link>
      <Link className='option' to='/shop'>
        CONTACT
      </Link>
      {currentUser ? (
        <div className='option' onClick={() => auth.signOut()}>
          SIGN OUT
        </div>
      ) : (
          <Link className='option' to='/signin'>
            SIGN IN
        </Link>
        )}
      <CartIcon />
    </div>
    {hidden ? null : <CartDropdown />}
  </div>
);

export default Header;

// 6. resolvers.js
import { gql } from 'apollo-boost';

import {
  addItemToCart,
  removeItemFromCart,
  clearItemFromCart,
  getCartTotal,
  getCartItemCount
} from './cart.utils';

export const typeDefs = gql`
  extend type Item {
    quantity: Int
  }
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
    ToggleCartHidden: Boolean!
    AddItemToCart(item: Item!): [Item]!
    SetCurrentUser(user: User!): User!
    RemoveItemFromCart(item: Item!): [Item]!
    ClearItemFromCart(item: Item!): [Item]!
  }
`;

const GET_CART_HIDDEN = gql`
  {
    cartHidden @client
  }
`;

const GET_ITEM_COUNT = gql`
  {
    itemCount @client
  }
`;

const GET_CART_TOTAL = gql`
  {
    cartTotal @client
  }
`;

const GET_CART_ITEMS = gql`
  {
    cartItems @client
  }
`;

const GET_CURRENT_USER = gql`
  {
    currentUser @client
  }
`;

const updateCartItemsRelatedQueries = (cache, newCartItems) => {
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
};

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

      updateCartItemsRelatedQueries(cache, newCartItems);

      return newCartItems;
    },

    removeItemFromCart: (_root, { item }, { cache }) => {
      const { cartItems } = cache.readQuery({
        query: GET_CART_ITEMS
      });

      const newCartItems = removeItemFromCart(cartItems, item);

      updateCartItemsRelatedQueries(cache, newCartItems);

      return newCartItems;
    },

    clearItemFromCart: (_root, { item }, { cache }) => {
      const { cartItems } = cache.readQuery({
        query: GET_CART_ITEMS
      });

      const newCartItems = clearItemFromCart(cartItems, item);

      updateCartItemsRelatedQueries(cache, newCartItems);

      return newCartItems;
    },

    setCurrentUser: (_root, { user }, { cache }) => {
      cache.writeQuery({
        query: GET_CURRENT_USER,
        data: { currentUser: user }
      });

      return user;
    }
  }
};