import React, { useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import HomePage from './Pages/HomePage/HomePage.component';
import ShopPage from './Pages/ShopPage/ShopPage.component';
import SignInAndSignUpPage from './Pages/SignInSignUpPage/SignInAndSignUpPage.component';
import CheckoutPage from './Pages/CheckoutPage/CheckoutPage.component';
import Header from './Components/Header/Header.component';

import { selectCurrentUser } from './redux/user/user.selectors';

import { checkUserSession } from './redux/user/user.actions';

import './App.css';

const App = ({ currentUser, checkUserSession }) => {

  useEffect(() => {
    checkUserSession()
  }, [checkUserSession]);

  return (
    <div>
      <Header currentUser={currentUser} />
      <Switch>
        <Route exact path="/signin">{currentUser ? <Redirect to="/" /> : <SignInAndSignUpPage />}</Route>
        <Route exact path='/' component={HomePage} />
        <Route path='/shop' component={ShopPage} />
        <Route exact path='/checkout' component={CheckoutPage} />
      </Switch>
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

const mapDispatchToProps = dispatch => ({
  checkUserSession: () => dispatch(checkUserSession())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
