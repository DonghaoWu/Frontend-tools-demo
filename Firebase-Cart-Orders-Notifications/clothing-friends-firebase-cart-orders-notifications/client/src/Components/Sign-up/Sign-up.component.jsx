import React from 'react';
import { connect } from 'react-redux';

import FormInput from '../Form-input/Form-input.component';
import CustomButton from '../Custom-button/Custom-button.component';

import { googleSignInOrSignUpStart, emailSignUpStart } from '../../redux/user/user.actions';

import './Sign-up.styles.scss';

class SignUp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            displayName: '',
            email: '',
            password: '',
            confirmPassword: ''
        };
    }

    handleSubmit = async event => {
        event.preventDefault();
        const { displayName, email, password, confirmPassword } = this.state;
        if (password !== confirmPassword) {
            alert("passwords don't match");
            return;
        }

        this.props.emailSignUpStart({ email, password, displayName })
    };

    handleChange = event => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    render() {
        const { displayName, email, password, confirmPassword } = this.state;
        const { googleSignInOrSignUpStart } = this.props;
        return (
            <div className='sign-up'>
                <h2 className='title'>I do not have a account</h2>
                <span>Sign up with your email and password</span>
                <form className='sign-up-form' onSubmit={this.handleSubmit}>
                    <FormInput
                        type='text'
                        name='displayName'
                        value={displayName}
                        onChange={this.handleChange}
                        label='Display Name'
                        required
                    />
                    <FormInput
                        type='email'
                        name='email'
                        value={email}
                        onChange={this.handleChange}
                        label='Email'
                        required
                    />
                    <FormInput
                        type='password'
                        name='password'
                        value={password}
                        onChange={this.handleChange}
                        label='Password'
                        required
                    />
                    <FormInput
                        type='password'
                        name='confirmPassword'
                        value={confirmPassword}
                        onChange={this.handleChange}
                        label='Confirm Password'
                        required
                    />
                    <div className='buttons'>
                        <CustomButton type='submit'> Sign Up </CustomButton>
                        <CustomButton type='button' onClick={googleSignInOrSignUpStart} google={true}>
                            Sign In / Sign Up with Google
                        </CustomButton>
                    </div>
                </form>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    googleSignInOrSignUpStart: () => dispatch(googleSignInOrSignUpStart()),
    emailSignUpStart: (userCredentials) => dispatch(emailSignUpStart(userCredentials))
});

export default connect(
    null,
    mapDispatchToProps
)(SignUp);