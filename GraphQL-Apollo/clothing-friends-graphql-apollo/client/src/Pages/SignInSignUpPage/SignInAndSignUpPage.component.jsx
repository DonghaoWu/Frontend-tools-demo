import React from 'react';

import SignIn from '../../Components/Sign-in/Sign-in.component';
import { default as SignUp } from '../../Components/Sign-up/Sign-up.container';

import './SignInAndSignUpPage.styles.scss';


const SignInAndSignUpPage = () => {
  return (<div className='sign-in-and-sign-up'>
    <SignIn />
    <SignUp />
  </div>)
};

export default SignInAndSignUpPage;