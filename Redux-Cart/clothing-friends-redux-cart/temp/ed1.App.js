import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import './App.css';

import HomePage from './Pages/HomePage/HomePage.component';
import ShopPage from './Pages/ShopPage/ShopPage.component';
import SignInAndSignUpPage from './Pages/SignInSignUpPage/SignInAndSignUpPage.component';
import Header from './Components/Header/Header.component';
import { auth, firestore } from './firebase/firebase.utils';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      currentUser: null,
      displayNameFromSignUp: ''
    };
  }

  setDisplayName = (displayNameFromSignUp) => {
    this.setState({ displayNameFromSignUp: displayNameFromSignUp });
  }

  componentDidMount() {
    this.listener = auth.onAuthStateChanged(async userAuth => {
      if (userAuth) {
        try {
          const userRef = firestore.doc(`users/${userAuth.uid}`);
          const snapShot = await userRef.get();
          if (snapShot.exists) {
            this.setState({
              currentUser: {
                id: snapShot.id,
                ...snapShot.data()
              },
              displayNameFromSignUp: ''
            })
          }

          else if (!snapShot.exists) {
            const { email } = userAuth;
            const displayName = userAuth.displayName || this.state.displayNameFromSignUp;
            const createdAt = new Date();
            await userRef.set({
              displayName,
              email,
              createdAt,
            });
            this.setState({
              currentUser: {
                id: snapShot.id,
                displayName,
                email,
                createdAt,
              },
              displayNameFromSignUp: ''
            })
          }
        }
        catch (error) {
          console.log('error creating user', error.message);
        }
      }
      else {
        this.setState({ currentUser: null, displayNameFromSignUp: '' });
      }
    })
  }

  componentWillUnmount() {
    this.listener();
  }

  render() {
    return (
      <div>
        <Header currentUser={this.state.currentUser} />
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route path='/shop' component={ShopPage} />
          <Route exact path="/signin">{this.state.currentUser ? <Redirect to="/" /> : <SignInAndSignUpPage setDisplayName={this.setDisplayName} />}</Route>
        </Switch>
      </div>
    );
  }
}

export default App;
