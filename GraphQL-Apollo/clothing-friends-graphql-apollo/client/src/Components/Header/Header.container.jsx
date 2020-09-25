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
`

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