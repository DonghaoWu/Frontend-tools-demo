import { gql } from 'apollo-boost';

const GET_COLLECTIONS = gql`
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
}`

const GET_COLLECTIONS_BY_TITLE = gql`
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
`