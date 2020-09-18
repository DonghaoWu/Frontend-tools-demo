import React, { useState } from 'react';

import FormInput from '../Form-input/Form-input.component';
import CustomButton from '../Custom-button/Custom-button.component';

import { auth, signInWithGoogle } from '../../firebase/firebase.utils';

import './Sign-in.styles.scss';

const SignIn = () => {

  const [userCredentials, setUserCredentials] = useState({
    email: '',
    password: ''
  })

  const { email, password } = userCredentials;

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      await auth.signInWithEmailAndPassword(email, password);
      setUserCredentials({ ...userCredentials, email: '', password: '' });
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleChange = event => {
    const { value, name } = event.target;
    setUserCredentials({ ...userCredentials, [name]: value });
  };

  return (
    <div className='sign-in'>
      <h2>I already have an account</h2>
      <span>Sign in with your email and password</span>

      <form onSubmit={handleSubmit}>
        <FormInput
          name='email'
          type='email'
          handleChange={handleChange}
          value={email}
          label='email'
          required
        />
        <FormInput
          name='password'
          type='password'
          value={password}
          handleChange={handleChange}
          label='password'
          required
        />
        <div className='buttons'>
          <CustomButton type='submit'> Sign in </CustomButton>
          <CustomButton type='button' onClick={signInWithGoogle} google={true}>
            Sign in with Google
            </CustomButton>
        </div>
      </form>
    </div>
  );
};

export default SignIn;