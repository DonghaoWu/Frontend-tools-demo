import React from 'react';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';

import SignUp from './Sign-up.component';

const SET_DISPLAY_NAME = gql`
  mutation SetDisplayName($displayName: DisplayName!) {
    setDisplayName(displayName: $displayName) @client
  }
`;

const SignUpContainer = () => {
    return (
        <Mutation mutation={SET_DISPLAY_NAME}>
            {
                setDisplayName =>
                    <SignUp
                        setDisplayName={displayName => {
                            setDisplayName({ variables: { displayName } });
                        }}
                    />
            }
        </Mutation>
    )
}

export default SignUpContainer;