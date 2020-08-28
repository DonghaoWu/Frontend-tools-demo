import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import './App.css';

import HomePage from './Pages/HomePage/HomePage.component';
import ShopPage from './Pages/ShopPage/ShopPage.component';
import SignInAndSignUpPage from './Pages/SignInSignUpPage/SignInAndSignUpPage.component';
import Header from './Components/Header/Header.component';
import { auth, checkDocOrCreateDocInFirestore } from './firebase/firebase.utils';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      currentUser: null,
      displayNameFromSignUp: ''
    };
  }

  setDisplayName = (displayName) => {
    this.setState({ displayNameFromSignUp: displayName });
  }

  componentDidMount() {
    this.listener = auth.onAuthStateChanged(async userAuth => {
      if (userAuth) {
        try {
          const displayName = userAuth.displayName || this.state.displayNameFromSignUp;
          const userRef = await checkDocOrCreateDocInFirestore(userAuth, displayName);
          userRef.onSnapshot(snapShot => {
            this.setState({
              currentUser: {
                id: snapShot.id,
                ...snapShot.data()
              },
              displayNameFromSignUp: ''
            });
          });
        }
        catch (error) {
          this.setState({ currentUser: null, displayNameFromSignUp: '' });
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
