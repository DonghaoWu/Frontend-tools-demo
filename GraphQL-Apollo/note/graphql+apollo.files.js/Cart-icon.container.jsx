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