import React from 'react';
import { Mutation, Query } from 'react-apollo';
import { gql } from 'apollo-boost';

import App from './App';

const SET_CURRENT_USER = gql`
  mutation SetCurrentUser($user: User!) {
    setCurrentUser(user: $user) @client
  }
`;

const SET_DISPLAY_NAME = gql`
  mutation SetDisplayName($displayName: DisplayName!) {
    setDisplayName(displayName: $displayName) @client
  }
`;

const GET_CURRENT_USER_AND_DISPLAY_NAME = gql`
  {
    currentUser @client
    displayName @client
  }
`;

const AppContainer = () => (
    <Query query={GET_CURRENT_USER_AND_DISPLAY_NAME}>
        {({ data: { currentUser, displayName } }) => (
            <Mutation mutation={SET_CURRENT_USER}>
                {setCurrentUser => (
                    <Mutation mutation={SET_DISPLAY_NAME}>
                        {
                            setDisplayName => {
                                return (
                                    <App
                                        currentUser={currentUser}
                                        displayName={displayName}
                                        setDisplayName={displayName => {
                                            setDisplayName({ variables: { displayName } });
                                        }}
                                        setCurrentUser={user => {
                                            setCurrentUser({ variables: { user } });
                                        }}
                                    />
                                )
                            }
                        }
                    </Mutation>
                )}
            </Mutation>
        )}
    </Query>
);

export default AppContainer;