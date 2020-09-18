import React, { useContext, useState } from 'react';

import FormInput from '../Form-input/Form-input.component';
import CustomButton from '../Custom-button/Custom-button.component';

import { auth, signInWithGoogle } from '../../firebase/firebase.utils';

import { CartContext } from '../../providers/cart/cart.provider';

import './Sign-up.styles.scss';

const SignUp = () => {

    const { setName } = useContext(CartContext);

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

        try {
            setName(displayName);
            await auth.createUserWithEmailAndPassword(email, password);
            setCredentials({ ...userCredentials, displayName: '', email: '', password: '', confirmPassword: '' });
        } catch (error) {
            console.error(error);
        }
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
                    <CustomButton type='button' onClick={signInWithGoogle} google={true}>
                        Sign Up with Google
                        </CustomButton>
                </div>
            </form>
        </div>
    );
}

export default SignUp;