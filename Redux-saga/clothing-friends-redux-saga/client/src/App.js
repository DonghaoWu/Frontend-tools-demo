import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import HomePage from './Pages/HomePage/HomePage.component';
import ShopPage from './Pages/ShopPage/ShopPage.component';
import SignInAndSignUpPage from './Pages/SignInSignUpPage/SignInAndSignUpPage.component';
import CheckoutPage from './Pages/CheckoutPage/CheckoutPage.component';
import Header from './Components/Header/Header.component';

// import { setCurrentUser } from './redux/user/user.actions';
import { selectCurrentUser } from './redux/user/user.selectors';
import { setDisplayName } from './redux/display-name/display-name.actions';
import { selectInputDisplayName } from './redux/display-name/display-name.selectors';

import { checkUserSession } from './redux/user/user.actions';
import './App.css';

class App extends React.Component {

  // componentDidMount() {
  //   const { setCurrentUser, setDisplayName } = this.props;
  //   this.listener = auth.onAuthStateChanged(async userAuth => {
  //     if (userAuth) {
  //       try {
  //         const displayName = userAuth.displayName || this.props.displayName;
  //         const userRef = await checkOrCreateUserDocInFirestore(userAuth, displayName);
  //         userRef.onSnapshot(snapShot => {
  //           setCurrentUser({
  //             id: snapShot.id,
  //             ...snapShot.data()
  //           });
  //           setDisplayName('');
  //         });
  //       }
  //       catch (error) {
  //         setCurrentUser(null);
  //         setDisplayName('');
  //         console.log('Error: ', error.message);
  //       }
  //     }
  //     else {
  //       setCurrentUser(null);
  //       setDisplayName('');
  //     }
  //   })
  // }

  // componentWillUnmount() {
  //   this.listener();
  // }

  componentDidMount() {
    const { checkUserSession } = this.props;
    checkUserSession();
  }

  render() {
    const { currentUser } = this.props;
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
}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  displayName: selectInputDisplayName,
});

const mapDispatchToProps = dispatch => ({
  checkUserSession: () => dispatch(checkUserSession()),
  setDisplayName: displayName => dispatch(setDisplayName(displayName)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
