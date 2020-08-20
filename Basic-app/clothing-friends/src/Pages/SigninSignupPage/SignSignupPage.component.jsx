import React from 'react';

import './SignSignupPage.styles.scss';
import Signin from '../../Components/Sign-in/Sign-in.component'

class SignSignupPage extends React.Component {
    constructor() {
        super();
        this.state = {

        }
    }

    render() {
        return (
            <div>
                <Signin />
            </div>
        )
    }
}

export default SignSignupPage;