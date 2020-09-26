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
    RemoveItemFromCart(item: Item!): [Item]!
    ClearItemFromCart(item: Item!): [Item]!
    ClearCart:[Item]!
    SetCurrentUser(user: User!): User!
    SetDisplayName(displayName: DisplayName!): DisplayName!
  }
`;

const GET_DISPLAY_NAME = gql`
  {
    displayName @client
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

            cache.writeQuery({
                query: GET_CART_TOTAL,
                data: { cartTotal: getCartTotal(newCartItems) }
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
        },
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
        },
        setCurrentUser: (_root, { user }, { cache }) => {
            cache.writeQuery({
                query: GET_CURRENT_USER,
                data: { currentUser: user }
            });
            return user;
        },
        setDisplayName: (_root, { displayName }, { cache }) => {
            cache.writeQuery({
                query: GET_DISPLAY_NAME,
                data: { displayName: displayName }
            });
            return displayName;
        }
    }
};