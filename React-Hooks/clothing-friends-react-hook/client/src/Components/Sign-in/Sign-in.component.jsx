import React, { useState } from 'react';
import { connect } from 'react-redux';

import FormInput from '../Form-input/Form-input.component';
import CustomButton from '../Custom-button/Custom-button.component';

import { googleSignInOrSignUpStart, emailSignInStart } from '../../redux/user/user.actions';
import './Sign-in.styles.scss';

const SignIn = ({ emailSignInStart, googleSignInOrSignUpStart }) => {
  const [userCredentials, setCredentials] = useState({ email: '', password: '' })

  const handleEmailAndPasswordSignInSubmit = async event => {
    event.preventDefault();
    const { email, password } = userCredentials;
    emailSignInStart({ email, password });
  };

  const handleChange = event => {
    const { value, name } = event.target;
    setCredentials({ ...userCredentials, [name]: value });
  };

  return (
    <div className='sign-in'>
      <h2>I already have an account</h2>
      <span>Sign in with your email and password</span>

      <form onSubmit={handleEmailAndPasswordSignInSubmit}>
        <FormInput
          name='email'
          type='email'
          handleChange={handleChange}
          value={userCredentials.email}
          label='email'
          required
        />
        <FormInput
          name='password'
          type='password'
          value={userCredentials.password}
          handleChange={handleChange}
          label='password'
          required
        />
        <div className='buttons'>
          <CustomButton type='submit'> Sign in </CustomButton>
          <CustomButton type='button' onClick={googleSignInOrSignUpStart} google={true}>
            Sign in / Sign up with Google
            </CustomButton>
        </div>
      </form>
    </div>
  );
}

const mapDispatchToProps = dispatch => ({
  googleSignInOrSignUpStart: () => dispatch(googleSignInOrSignUpStart()),
  emailSignInStart: (emailAndPassword) => dispatch(emailSignInStart(emailAndPassword))
});

export default connect(null, mapDispatchToProps)(SignIn);