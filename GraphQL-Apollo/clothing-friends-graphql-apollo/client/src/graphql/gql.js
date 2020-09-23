import { gql } from 'apollo-boost';

const GET_COLLECTIONS_QUERY = gql`
    {
        collections{
            id
            title
            items{
                id
                name
                price
                imageUrl
            }
        }
    }
`;

const GET_COLLECTIONS_BY_TITLE_QUERY = gql`
    query getCollectionsByTitle($title: String!){
        getCollectionsByTitle(title:$title){
            id
            title
            items{
                id
                name
                price
                imageUrl
            }
        }
    }
`;

const GET_CART_HIDDEN_QUERY = gql`
    {
        cartHidden @client
    }
`;

const TOGGLE_CART_HIDDEN_MUTATION = gql`
    mutation ToggleCartHidden{
        toggleCartHidden @client
    }
`;