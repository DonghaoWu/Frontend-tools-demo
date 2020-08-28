import React from 'react';

import SignIn from '../../Components/Sign-in/Sign-in.component';
import SignUp from '../../Components/Sign-up/Sign-up.component';

import './SignInAndSignUpPage.styles.scss';


const SignInAndSignUpPage = ({ setDisplayName }) => {
  return (<div className='sign-in-and-sign-up'>
    <SignIn />
    <SignUp />
  </div>)
};

export default SignInAndSignUpPage;