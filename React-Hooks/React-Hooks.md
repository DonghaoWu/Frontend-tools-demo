# Front end development tools (Part 8)

### `Key Words: React hooks, useState, useEffect.`

- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/README.md)

## `Section: Redux-hooks.` (Basic)

### `Summary`: In this documentation, we learn to use react hooks.

### `Check Dependencies & Tools:`

- null
------------------------------------------------------------

#### `本章背景：`
1. 转换一些代码到 react hook。

------------------------------------------------------------

#### `Redux hooks API`
```diff
+ import { useEffect, useState } from 'react';
```

### <span id="8.0">`Brief Contents & codes position`</span>

- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/README.md)

- [8.1 Using useState.](#8.1)
- [8.2 Using useEffect.](#8.2)

------------------------------------------------------------

### <span id="8.1">`Step1: Using useState.`</span>

- #### Click here: [BACK TO CONTENT](#8.0)

1. __`Location:./clothing-friends-react-hook/client/src/Components/Sign-in/Sign-in.component.jsx`__

```diff
import React from 'react';
+import { useState } from 'react';
import { connect } from 'react-redux';

import FormInput from '../Form-input/Form-input.component';
import CustomButton from '../Custom-button/Custom-button.component';

import { googleSignInOrSignUpStart, emailSignInStart } from '../../redux/user/user.actions';
import './Sign-in.styles.scss';

-class SignIn extends React.Component {
-  constructor(props) {
-    super(props);

-    this.state = {
-      email: '',
-      password: ''
-    };
-  }

+const SignIn = ({ emailSignInStart, googleSignInOrSignUpStart }) => {
+  const [userCredentials, setCredentials] = useState({ email: '', password: '' })

-  handleEmailAndPasswordSignInSubmit = async event => {
-    event.preventDefault();
-    const { emailSignInStart } = this.props;
-    const { email, password } = this.state;

-    emailSignInStart({ email, password });
-  };

+  const handleEmailAndPasswordSignInSubmit = async event => {
+    event.preventDefault();
+    const { email, password } = userCredentials;
+    emailSignInStart({ email, password });
+  };

-  handleChange = event => {
-    const { value, name } = event.target;
-    this.setState({ [name]: value });
-  };

+  const handleChange = event => {
+    const { value, name } = event.target;
+    setCredentials({ ...userCredentials, [name]: value });
+  };

-  render() {
-    const { googleSignInOrSignUpStart } = this.props;
    return (
      <div className='sign-in'>
        <h2>I already have an account</h2>
        <span>Sign in with your email and password</span>

-        <form onSubmit={this.handleEmailAndPasswordSignInSubmit}>
+        <form onSubmit={handleEmailAndPasswordSignInSubmit}>
          <FormInput
            name='email'
            type='email'
-           handleChange={this.handleChange}
-           value={this.state.email}
+           handleChange={handleChange}
+           value={userCredentials.email}
            label='email'
            required
          />
          <FormInput
            name='password'
            type='password'
-           value={this.state.password}
-           handleChange={this.handleChange}
+           value={userCredentials.password}
+           handleChange={handleChange}
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
-}

const mapDispatchToProps = dispatch => ({
  googleSignInOrSignUpStart: () => dispatch(googleSignInOrSignUpStart()),
  emailSignInStart: (emailAndPassword) => dispatch(emailSignInStart(emailAndPassword))
});

export default connect(null, mapDispatchToProps)(SignIn);
```

2. __`Location:./clothing-friends-react-hook/client/src/Components/Sign-up/Sign-up.component.jsx`__

```diff
import React from 'react';
+import { useState } from 'react';
import { connect } from 'react-redux';

import FormInput from '../Form-input/Form-input.component';
import CustomButton from '../Custom-button/Custom-button.component';

import { googleSignInOrSignUpStart, emailSignUpStart } from '../../redux/user/user.actions';

import './Sign-up.styles.scss';

-class SignUp extends React.Component {
-    constructor(props) {
-        super(props);

-        this.state = {
-            displayName: '',
-            email: '',
-            password: '',
-            confirmPassword: ''
-        };
-    }

+const SignUp = ({ emailSignUpStart, googleSignInOrSignUpStart }) => {

+    const [userCredentials, setCredentials] = useState({
+        email: '',
+        password: '',
+        displayName: '',
+        confirmPassword: ''
+    })

+    const { displayName, email, password, confirmPassword } = userCredentials;


-    handleSubmit = async event => {
-        event.preventDefault();
-        const { displayName, email, password, confirmPassword } = this.state;
-        if (password !== confirmPassword) {
-            alert("passwords don't match");
-            return;
-        }
-        this.props.emailSignUpStart({ email, password, displayName })
-    };

+    const handleSubmit = async event => {
+        event.preventDefault();
+        if (password !== confirmPassword) {
+            alert("passwords don't match");
+            return;
+        }
+        emailSignUpStart({ email, password, displayName })
+    };

-    handleChange = event => {
-        const { name, value } = event.target;
-        this.setState({ [name]: value });
-    };

+    const handleChange = event => {
+        const { name, value } = event.target;
+        setCredentials({ ...userCredentials, [name]: value });
+    };

-    render() {
-        const { displayName, email, password, confirmPassword } = this.state;
-        const { googleSignInOrSignUpStart } = this.props;
        return (
            <div className='sign-up'>
                <h2 className='title'>I do not have a account</h2>
                <span>Sign up with your email and password</span>
-                <form className='sign-up-form' onSubmit={this.handleSubmit}>
+                <form className='sign-up-form' onSubmit={handleSubmit}>
                    <FormInput
                        type='text'
                        name='displayName'
                        value={displayName}
-                       onChange={this.handleChange}
+                       onChange={handleChange}
                        label='Display Name'
                        required
                    />
                    <FormInput
                        type='email'
                        name='email'
                        value={email}
-                       onChange={this.handleChange}
+                       onChange={handleChange}
                        label='Email'
                        required
                    />
                    <FormInput
                        type='password'
                        name='password'
                        value={password}
-                       onChange={this.handleChange}
+                       onChange={handleChange}
                        label='Password'
                        required
                    />
                    <FormInput
                        type='password'
                        name='confirmPassword'
                        value={confirmPassword}
-                       onChange={this.handleChange}
+                       onChange={handleChange}
                        label='Confirm Password'
                        required
                    />
                    <div className='buttons'>
                        <CustomButton type='submit'> Sign Up </CustomButton>
                        <CustomButton type='button' onClick={googleSignInOrSignUpStart} google={true}>
                            Sign In / Sign Up with Google
                        </CustomButton>
                    </div>
                </form>
            </div>
        );
    }
-}

const mapDispatchToProps = dispatch => ({
    googleSignInOrSignUpStart: () => dispatch(googleSignInOrSignUpStart()),
    emailSignUpStart: (userCredentials) => dispatch(emailSignUpStart(userCredentials))
});

export default connect( null, mapDispatchToProps )( SignUp );
```

#### `Comment:`
1. 

### <span id="8.2">`Step2: Using useEffect.`</span>

- #### Click here: [BACK TO CONTENT](#8.0)

1. __`Location:./clothing-friends-react-hook/client/src/App.js`__

```diff
import React from 'react';
+import { useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import HomePage from './Pages/HomePage/HomePage.component';
import ShopPage from './Pages/ShopPage/ShopPage.component';
import SignInAndSignUpPage from './Pages/SignInSignUpPage/SignInAndSignUpPage.component';
import CheckoutPage from './Pages/CheckoutPage/CheckoutPage.component';
import Header from './Components/Header/Header.component';

import { selectCurrentUser } from './redux/user/user.selectors';
import { selectInputDisplayName } from './redux/display-name/display-name.selectors';

import { checkUserSession } from './redux/user/user.actions';

import './App.css';

-class App extends React.Component {

-  componentDidMount() {
-    const { checkUserSession } = this.props;
-    checkUserSession();
-  }

+const App = ({ currentUser, checkUserSession }) => {

+  useEffect(() => {
+    checkUserSession()
+  }, [checkUserSession]);

-  render() {
-    const { currentUser } = this.props;
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
-}

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  displayName: selectInputDisplayName,
});

const mapDispatchToProps = dispatch => ({
  checkUserSession: () => dispatch(checkUserSession())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
```

2. __`Location:./clothing-friends-react-hook/client/src/Pages/ShopPage/ShopPage.component.jsx`__

```diff
import React from 'react';
+import { useEffect } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import CollectionsOverviewContainer from '../../Components/Collections-overview/Collections-overview.container';
import CollectionPageContainer from '../CollectionPage/CollectionPage.container';

import { fetchCollectionsStart } from '../../redux/shop/shop.actions';

-class ShopPage extends React.Component {
-  componentDidMount() {
-    this.props.fetchCollectionsStart();
-  }

+const ShopPage = ({ fetchCollectionsStart, match }) => {
  
+  useEffect(() => {
+    fetchCollectionsStart()
+  }, [fetchCollectionsStart]);

-  render() {
-    const { match } = this.props;
    return (
      <div className='shop-page'>
        <Route exact path={`${match.path}`} component={CollectionsOverviewContainer} />
        <Route path={`${match.path}/:collectionId`} component={CollectionPageContainer} />
      </div>
    );
  }
-}

const mapDispatchToProps = dispatch => ({
  fetchCollectionsStart: () => dispatch(fetchCollectionsStart()),
});

export default connect(null, mapDispatchToProps)(ShopPage);
```

#### `Comment:`
1. `本章的难点在于理解 useEffect 的第二参数，参数里面的变量的意思是当该变量改变的时候就运行 useEffect 的第一参数（也就是一个函数）。`

-----------------------------------------------------------------

__`本章用到的全部资料：`__

- null

- #### Click here: [BACK TO CONTENT](#8.0)
- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/README.md)