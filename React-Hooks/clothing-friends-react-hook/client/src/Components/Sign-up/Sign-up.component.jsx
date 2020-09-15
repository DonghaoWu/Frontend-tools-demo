import React, { useState } from 'react';
import { connect } from 'react-redux';

import FormInput from '../Form-input/Form-input.component';
import CustomButton from '../Custom-button/Custom-button.component';

import { googleSignInOrSignUpStart, emailSignUpStart } from '../../redux/user/user.actions';

import './Sign-up.styles.scss';

const SignUp = ({ emailSignUpStart, googleSignInOrSignUpStart }) => {

    const [userCredentials, setCredentials] = useState({
        email: '',
        password: '',
        displayName: '',
        confirmPassword: ''
    })

    const { displayName, email, password, confirmPassword } = userCredentials;
    
    const handleSubmit = async event => {
        event.preventDefault();
        if (password !== confirmPassword) {
            alert("passwords don't match");
            return;
        }
        emailSignUpStart({ email, password, displayName })
    };

    const handleChange = event => {
        const { name, value } = event.target;
        setCredentials({ ...userCredentials, [name]: value });
    };

    return (
        <div className='sign-up'>
            <h2 className='title'>I do not have a account</h2>
            <span>Sign up with your email and password</span>
            <form className='sign-up-form' onSubmit={handleSubmit}>
                <FormInput
                    type='text'
                    name='displayName'
                    value={displayName}
                    onChange={handleChange}
                    label='Display Name'
                    required
                />
                <FormInput
                    type='email'
                    name='email'
                    value={email}
                    onChange={handleChange}
                    label='Email'
                    required
                />
                <FormInput
                    type='password'
                    name='password'
                    value={password}
                    onChange={handleChange}
                    label='Password'
                    required
                />
                <FormInput
                    type='password'
                    name='confirmPassword'
                    value={confirmPassword}
                    onChange={handleChange}
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

const mapDispatchToProps = dispatch => ({
    googleSignInOrSignUpStart: () => dispatch(googleSignInOrSignUpStart()),
    emailSignUpStart: (userCredentials) => dispatch(emailSignUpStart(userCredentials))
});

export default connect(null, mapDispatchToProps)(SignUp);