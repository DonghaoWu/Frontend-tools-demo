1. Register in firebase.

create project

```js
  var firebaseConfig = {
    apiKey: "AIzaSyDN4tbAvlaC3zxQjN4vUw0bX8AmGFCa9co",
    authDomain: "clothing-friends.firebaseapp.com",
    databaseURL: "https://clothing-friends.firebaseio.com",
    projectId: "clothing-friends",
    storageBucket: "clothing-friends.appspot.com",
    messagingSenderId: "602150897422",
    appId: "1:602150897422:web:e7efaca1dff7f74802b95f",
    measurementId: "G-8D7LR6M67M"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
```

```bash
npm i firebase
```

- new folder: ./src/firebase.utils.js

```js
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDN4tbAvlaC3zxQjN4vUw0bX8AmGFCa9co",
    authDomain: "clothing-friends.firebaseapp.com",
    databaseURL: "https://clothing-friends.firebaseio.com",
    projectId: "clothing-friends",
    storageBucket: "clothing-friends.appspot.com",
    messagingSenderId: "602150897422",
    appId: "1:602150897422:web:e7efaca1dff7f74802b95f",
    measurementId: "G-8D7LR6M67M"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();

provider.setCustomParameters({ prompt: 'select_account' });

const signInWithGoogle = () => auth.signInWithPopup(provider);

const loadUserDataFromFirestore = async (userAuth, additionalData) => {
    if (!userAuth) return;

    const userRef = await firestore.doc(`users/${userAuth.uid}`);

    const snapShot = await userRef.get();

    if (!snapShot.exists) {
        const { displayName, email } = userAuth;
        const createdAt = new Date();
        try {
            await userRef.set({
                displayName,
                email,
                createdAt,
                ...additionalData
            });
        } catch (error) {
            console.log('error creating user', error.message);
        }
    }

    return userRef;
};

export {
    firebase,
    auth,
    firestore,
    signInWithGoogle,
    loadUserDataFromFirestore
}
```

- set up sign-in method (图)

- App.js

```js
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import './App.css';

import HomePage from './Pages/HomePage/HomePage.component';
import ShopPage from './Pages/ShopPage/ShopPage.component';
import SignInAndSignUpPage from './Pages/SignInSignUpPage/SignInAndSignUpPage.component';
import Header from './Components/Header/Header.component';
import { auth, loadUserDataFromFirestore } from './firebase/firebase.utils';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      currentUser: null
    };
  }

  unsubscribeFromAuth = null;

  componentDidMount() {
    this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
      if (userAuth) {
        const userRef = await loadUserDataFromFirestore(userAuth);
        userRef.onSnapshot(snapShot => {
          this.setState({
            currentUser: {
              id: snapShot.id,
              ...snapShot.data()
            }
          });
        });
      }
      else {
        this.setState({ currentUser: userAuth });
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }

  render() {
    return (
      <div>
        <Header currentUser={this.state.currentUser} />
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route path='/shop' component={ShopPage} />
          <Route exact path="/signin">{this.state.currentUser ? <Redirect to="/" /> : <SignInAndSignUpPage />}</Route>
        </Switch>
      </div>
    );
  }
}

export default App;
```

- 注意 componentDidMount() 里面的 auth.onAuthStateChanged

- Header.component.jsx

```js
import React from 'react';
import { Link } from 'react-router-dom';

import { auth } from '../../firebase/firebase.utils';

import { ReactComponent as Logo } from '../../assets/crown.svg';

import './Header.styles.scss';

const Header = ({ currentUser }) => (
  <div className='header'>
    <Link className='logo-container' to='/'>
      <Logo className='logo' />
    </Link>
    <div className='options'>
      <Link className='option' to='/shop'>
        SHOP
      </Link>
      <Link className='option' to='/shop'>
        CONTACT
      </Link>
      {currentUser ? (
        <div className='option' onClick={() => auth.signOut()}>
          SIGN OUT
        </div>
      ) : (
        <Link className='option' to='/signin'>
          SIGN IN
        </Link>
      )}
    </div>
  </div>
);

export default Header;
```
- 注意传递下来的 currentUser 还有 auth.signOut()

- Signin.component.jsx

```jsx
import React from 'react';

import FormInput from '../Form-input/Form-input.component';
import CustomButton from '../Custom-button/Custom-button.component';

import { auth, signInWithGoogle } from '../../firebase/firebase.utils';

import './Sign-in.styles.scss';

class SignIn extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    };
  }

  handleSubmit = async event => {
    event.preventDefault();

    const { email, password } = this.state;

    try {
      await auth.signInWithEmailAndPassword(email, password);
      this.setState({ email: '', password: '' });
    } catch (error) {
      console.log(error);
    }
  };

  handleChange = event => {
    const { value, name } = event.target;

    this.setState({ [name]: value });
  };

  render() {
    return (
      <div className='sign-in'>
        <h2>I already have an account</h2>
        <span>Sign in with your email and password</span>

        <form onSubmit={this.handleSubmit}>
          <FormInput
            name='email'
            type='email'
            handleChange={this.handleChange}
            value={this.state.email}
            label='email'
            required
          />
          <FormInput
            name='password'
            type='password'
            value={this.state.password}
            handleChange={this.handleChange}
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
  }
}

export default SignIn;
```

-  auth.signInWithEmailAndPassword(email, password);

- CustomButton.component.jsx

```jsx
import React from 'react';

import './Custom-button.styles.scss';

const CustomButton = ({ children, google, ...otherProps }) => (
  <button
    className={`${google ? 'google-sign-in' : ''} custom-button`}
    {...otherProps}
  >
    {children}
  </button>
);

export default CustomButton;
```

-  还有条件分配 style。

- sign-up.component.jsx

```jsx
import React from 'react';

import FormInput from '../Form-input/Form-input.component';
import CustomButton from '../Custom-button/Custom-button.component';

import { auth, loadUserDataFromFirestore, signInWithGoogle } from '../../firebase/firebase.utils';

import './Sign-up.styles.scss';

class SignUp extends React.Component {
    constructor() {
        super();

        this.state = {
            displayName: '',
            email: '',
            password: '',
            confirmPassword: ''
        };
    }

    handleSubmit = async event => {
        event.preventDefault();

        const { displayName, email, password, confirmPassword } = this.state;

        if (password !== confirmPassword) {
            alert("passwords don't match");
            return;
        }

        try {
            const { user } = await auth.createUserWithEmailAndPassword(
                email,
                password
            );

            await loadUserDataFromFirestore(user, { displayName });

            this.setState({
                displayName: '',
                email: '',
                password: '',
                confirmPassword: ''
            });
        } catch (error) {
            console.error(error);
        }
    };

    handleChange = event => {
        const { name, value } = event.target;

        this.setState({ [name]: value });
    };

    render() {
        const { displayName, email, password, confirmPassword } = this.state;
        return (
            <div className='sign-up'>
                <h2 className='title'>I do not have a account</h2>
                <span>Sign up with your email and password</span>
                <form className='sign-up-form' onSubmit={this.handleSubmit}>
                    <FormInput
                        type='text'
                        name='displayName'
                        value={displayName}
                        onChange={this.handleChange}
                        label='Display Name'
                        required
                    />
                    <FormInput
                        type='email'
                        name='email'
                        value={email}
                        onChange={this.handleChange}
                        label='Email'
                        required
                    />
                    <FormInput
                        type='password'
                        name='password'
                        value={password}
                        onChange={this.handleChange}
                        label='Password'
                        required
                    />
                    <FormInput
                        type='password'
                        name='confirmPassword'
                        value={confirmPassword}
                        onChange={this.handleChange}
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
}

export default SignUp;
```

- 注意 auth.createUserWithEmailAndPassword(email,password);

- SignInSignUpPage.component.jsx

```jsx
import React from 'react';

import SignIn from '../../Components/Sign-in/Sign-in.component';
import SignUp from '../../Components/Sign-up/Sign-up.component';

import './SignInAndSignUpPage.styles.scss';


const SignInAndSignUpPage = () => (
  <div className='sign-in-and-sign-up'>
    <SignIn />
    <SignUp />
  </div>
);

export default SignInAndSignUpPage;
```

- enable allow write authentication.

- Authentication tag -> email/password -> enable -> save

- implement sign in with email and password

- 