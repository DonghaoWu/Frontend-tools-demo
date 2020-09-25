import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import './App.css';

import HomePage from './Pages/HomePage/HomePage.component';
import ShopPage from './Pages/ShopPage/ShopPage.component';
import SignInAndSignUpPage from './Pages/SignInSignUpPage/SignInAndSignUpPage.component';
import { default as CheckoutPage } from './Pages/CheckoutPage/CheckoutPage.container';
import { default as Header } from './Components/Header/Header.container';

import { auth, checkDocOrCreateDocInFirestore } from './firebase/firebase.utils';

class App extends React.Component {
  unsubscribeFromAuth = null;

  componentDidMount() {
    const { setCurrentUser, setDisplayName } = this.props;

    this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
      if (userAuth) {
        const displayName = userAuth.displayName || this.props.displayName;
        const userRef = await checkDocOrCreateDocInFirestore(userAuth, displayName);

        userRef.onSnapshot(snapShot => {
          setCurrentUser({
            id: snapShot.id,
            ...snapShot.data()
          });
          setDisplayName(null);
        });
      } else {
        setCurrentUser(null);
        setDisplayName(null);
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }

  render() {
    return (
      <div>
        <Header />
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route path='/shop' component={ShopPage} />
          <Route exact path='/checkout' component={CheckoutPage} />
          <Route
            exact
            path='/signin'
            render={() =>
              this.props.currentUser ? (
                <Redirect to='/' />
              ) : (
                  <SignInAndSignUpPage />
                )
            }
          />
        </Switch>
      </div>
    );
  }
}

export default App;
