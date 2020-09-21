import React from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';

import CategoryPage from './CategoryPage.component';
import Spinner from '../../Components/Spinner/Spinner.component';

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

const CategoryPageContainer = ({ match }) => {
    return (
        <Query query={GET_COLLECTIONS_BY_TITLE} variables={{ title: match.params.collectionId }}>
            {
                ({ loading, error, data }) => {
                    if (loading) return <Spinner />;
                    const { getCollectionsByTitle } = data;
                    return <CategoryPage collection={getCollectionsByTitle} />;
                }
            }
        </Query>
    )
}

export default CategoryPageContainer;