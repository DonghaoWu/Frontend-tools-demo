# Front end development tools (Part 1)

### `Key Word: Firebase, Firestore, Firebase Auth, authorization, componentWillUnmount, listener, load user.`

- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/README.md)

## `Section: Firebase.` (Basic)

### `Summary`: In this documentation, we learn to add Firebase authentication to application.

### `Check Dependencies & Tools:`

- firebase
- dotenv

------------------------------------------------------------

#### `本章背景：`
1. 本章主要学习使用 firebase 作为 authentication 功能整合到 applicaiton 中去。
2. 主要学习的内容包括注册 firebase， 连接 firebase，firestore，fire Auth，以及使用到的 Firebase 相关 API。
3. 结合了自己对 Firebase 的理解后对原代码的 Authentication feature 部分有修改。

------------------------------------------------------------
- Firebase authentication 设计思路:

1. 在 App.js 中设置一个 listener，用来侦听登录、注册、登出时 auth state 的改变，然后调用函数 `checkDocOrCreateDocInFirestore` 查找相关 auth 信息是否在 firestore 中有相关数据。

2. 如果有数据，则返回 auth 查询信息，如果不存在，则执行 firestore 的创建动作。在本 app 中创建 firestore 需要 3 个信息，分别是 `email`，`diaplayName`，`createdAt`。

3. 引发 firestore 的创建动作是注册动作，而注册动作分为 `email/password` 和 `Sign up with Google`两种方法，用于创建的对应 3 个信息的收集也有点不一样，这个会在代码中解释。
------------------------------------------------------------
- 主要使用到的 Firebase API:

- Firebase auth
```diff
+ firebase.auth().onAuthStateChanged()
+ firebase.auth().signOut()
+ firebase.auth().signInWithEmailAndPassword()
+ firebase.auth().createUserWithEmailAndPassword()
```

- Firestore

```diff
+ firebase.firestore().doc()
+ firebase.firestore().doc().get() --- <async>
+ firebase.firestore().doc().set() --- <async>
+ firebase.firestore().doc().get().data() --- <async>
+ firebase.firestore().doc().get().onSnapshot() --- <async>
```

- Firebase provider
```diff
+ new firebase.auth.firebase.auth.GoogleAuthProvider();
+ firebase.auth().signInWithPopup(provider)
```
------------------------------------------------------------

### <span id="1.0">`Brief Contents & codes position`</span>

- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/README.md)

- [1.1 Register Firebase and install dependencies.](#1.1)
- [1.2 Add Firebase listener in App.js.](#1.2)
- [1.3 Handle sign in action in Sign-in page.](#1.3)
- [1.4 Handle sign out action.](#1.4)
- [1.5 Handle Sign up with email/password and Google.](#1.5)

------------------------------------------------------------

### <span id="1.1">`Step1: Create project in Firebase and install dependencies.`</span>

- #### Click here: [BACK TO CONTENT](#1.0)

1. Create project in Firebase.

  - create a new project.

  <p align="center">
  <img src="../assets/fe-01.png" width=90%>
  </p>

  -----------------------------------------------------------------

  - Name your project.
  <p align="center">
  <img src="../assets/fe-02.png" width=90%>
  </p>

  -----------------------------------------------------------------

  - Click web app tag.
  <p align="center">
  <img src="../assets/fe-03.png" width=90%>
  </p>

  -----------------------------------------------------------------

  - Copy the configuration code.
  <p align="center">
  <img src="../assets/fe-04.png" width=90%>
  </p>

  -----------------------------------------------------------------

  - Enable email/password and Google sign-in methods.
  <p align="center">
  <img src="../assets/fe-05.png" width=90%>
  </p>

  -----------------------------------------------------------------

2. Create Cloud Datastore (Firestore).

  - Create cloud database.
  <p align="center">
  <img src="../assets/fe-06.png" width=90%>
  </p>

  -----------------------------------------------------------------

  - You can select either option.
  <p align="center">
  <img src="../assets/fe-07.png" width=90%>
  </p>

  -----------------------------------------------------------------

  - Set Cloud Firestore location.
  <p align="center">
  <img src="../assets/fe-08.png" width=90%>
  </p>

  -----------------------------------------------------------------

  - Set up Cloud Firestore security rule.
  <p align="center">
  <img src="../assets/fe-09.png" width=90%>
  </p>

  -----------------------------------------------------------------

  - Firestore Rule.
    ```js
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /users/{uid} {
          allow read;
          allow write: if request.auth.uid == uid;
        }
      }
    }
    ```

3. Install depenencies.

    ```bash
    $ npm i firebase
    $ npm i dotenv
    ```

4. Add Firebase APi key in .env file. 

    __`Location:./clothing-friends-firebase/.env`__

    ```json
    // <Replace the value with your Firebase api key.>

    REACT_APP_FIREBASE_APIKEY=AIzaSyDN4tbAvlaC3zxQjN4vUw0bX8AmGFCa9co
    ```

    - :star::star::star: The `create-react-app` tool uses `REACT_APP_` to identify these variables. If you don't start your API key name with it, `create-react-app won't see it.`

    - Add code in `.gitignore` file.
    ```bash
    /.env
    ```

5. Apply Firebase in app.

    __`Location:./clothing-friends-firebase/src/firebase/firebase.utils.js`__

    ```js
    import firebase from 'firebase/app';
    import 'firebase/firestore';
    import 'firebase/auth';
    require('dotenv').config();

    const firebaseConfig = {
      apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
      authDomain: "clothing-friends-2020.firebaseapp.com",
      databaseURL: "https://clothing-friends-2020.firebaseio.com",
      projectId: "clothing-friends-2020",
      storageBucket: "clothing-friends-2020.appspot.com",
      messagingSenderId: "489564068830",
      appId: "1:489564068830:web:bdb4580c79782290be5b4f",
      measurementId: "G-8V6CLYTZJR"
    };

    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const firestore = firebase.firestore();

    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const signInWithGoogle = () => auth.signInWithPopup(provider);

    const checkDocOrCreateDocInFirestore = async (userAuth, displayName) => {
      if (!userAuth) return;
      const userRef = firestore.doc(`users/${userAuth.uid}`);
      const snapShot = await userRef.get();

      if (snapShot.exists) return userRef;

      else if (!snapShot.exists) {
        const createdAt = new Date();
        try {
          await userRef.set({
            displayName: displayName,
            email: userAuth.email,
            createdAt,
          });
        } catch (error) {
          console.log('error creating user', error.message);
        }
        return userRef;
      }
    }

    export {
      firebase,
      auth,
      firestore,
      signInWithGoogle,
      checkDocOrCreateDocInFirestore
    }
    ```

    - Dotenv code in above code.
    ```js
    require('dotenv').config();

    apiKey: process.env.REACT_APP_FIREBASE_APIKEY
    ```

#### `Comment:`
1. checkDocOrCreateDocInFirestore 后面分析。

### <span id="1.2">`Step2: Add Firebase listener in App.js.`</span>

- #### Click here: [BACK TO CONTENT](#1.0)

1. Add Firebase listener in App.js componentDidMount.

    __`Location:./clothing-friends-firebase/src/App.js`__

```jsx
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Header from './Components/Header/Header.component';
import HomePage from './Pages/HomePage/HomePage.component';
import ShopPage from './Pages/ShopPage/ShopPage.component';
import SignInAndSignUpPage from './Pages/SignInSignUpPage/SignInAndSignUpPage.component';

import { auth, checkDocOrCreateDocInFirestore } from './firebase/firebase.utils';

import './App.css';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      currentUser: null,
      displayNameFromSignUp: ''
    };
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

  setDisplayName = (displayName) => {
    this.setState({ displayNameFromSignUp: displayName });
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
```

#### `Comment:`
1. Firebase API: auth.onAuthStateChanged
  ```diff
  + 当连接 Firebase 的 app 接收到 auth state 信息变化时，这个 listener 就会自动启动，接受的 auth state 作为自定义函数的第一参数。

  + Right after the listener has been registered (parameter: Firebase auth info)
  + When a user is signed in (parameter: Firebase auth info)
  + When the current user is signed out (parameter: null)
  + When the current user changes (parameter: Firebase auth info)
  ```

2. 在 ComponentDidMount 注册这个 listener，目的是为了在 app 启动的时候使这个 listener 启动，在本 app 中，当这个 listener 发现 auth state 改变的时候会启动，:gem::gem::gem:`并调动自定义函数，且接受的 auth state 自动作为自定义函数的第一参数`。在本 app 中有 3 个 Firebase API 的调用可能会引起这个 listener 启动。

  ```diff
  + auth.signOut()
  + auth.signInWithEmailAndPassword()
  + auth.createUserWithEmailAndPassword()
  ```

3. 另外使用 componentWillUnmount 的用意是，当关闭访问 app 时也关闭 listener，这样在重新打开 app 的时候打开 listener，这时就可以调用一次它的自定义函数，:gem::gem::gem:相当于实现了用户离开然后返回仍然可以自动加载的`load user`功能。


### <span id="1.3">`Step3: Handle sign in action in Sign-in page.`</span>

- #### Click here: [BACK TO CONTENT](#1.0)

1. Handle Sign in.

    __`Location:./clothing-friends-firebase/src/Components/Sign-in/Sign-in.component.jsx`__

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
      console.log(error.message);
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

#### `Comment:`
1. `auth.signInWithEmailAndPassword(email, password);` 会查询 Firebase cloud auth，如果有符合的 auth record 就返回 auth info，并触发 listener `auth.onAuthStateChanged`，如果没有 record 就不返回也不触发。`向 listener 传递的参数为 auth info。`

### <span id="1.4">`Step4: Handle sign out action.`</span>

- #### Click here: [BACK TO CONTENT](#1.0)

1. Handle Sign out.

    __`Location:./clothing-friends-firebase/src/Components/Header/Header.component.jsx`__

```jsx
import React from 'react';
import { Link, withRouter } from "react-router-dom";

import { ReactComponent as Logo } from '../../assets/crown.svg';

import { auth } from '../../firebase/firebase.utils';

import './Header.styles.scss';

const Header = ({ currentUser, history }) => {

  const signOut = async () => {
    await auth.signOut();
    history.push("/signin");
  }
  return (
    <div className='header'>
      <Link className='logo-container' to='/'>
        <Logo className='logo' />
      </Link>
      <div className='options'>
        {
          currentUser ? (
            <span className='option'>{`Welcome, ${currentUser.displayName}`}</span>
          ) :
            null
        }
        <Link className='option' to='/shop'>
          SHOP
      </Link>
        <Link className='option' to='/shop'>
          CONTACT
      </Link>
        {currentUser ? (
          <Link to='/signin'>
            <div className='option' onClick={() => signOut()}>
              SIGN OUT
        </div>
          </Link>
        ) : (
            <Link className='option' to='/signin'>
              SIGN IN
        </Link>
          )}
      </div>
    </div>
  )
};

export default withRouter(Header);
```

#### `Comment:`
1. `auth.signOut();` 会注销 Firebase cloud auth 对应的 auth record 就返回 auth info，并触发 listener `auth.onAuthStateChanged`，`向 listener 传递的参数为 null。`

### <span id="1.5">`Step5: Handle Sign up with email/password and Google.`</span>

- #### Click here: [BACK TO CONTENT](#1.0)

    __`Location:./clothing-friends-firebase/src/Components/Sign-up/Sign-up.component.jsx`__

1. Handle email/password sign up and google.

```jsx
import React from 'react';

import FormInput from '../Form-input/Form-input.component';
import CustomButton from '../Custom-button/Custom-button.component';

import { auth, signInWithGoogle } from '../../firebase/firebase.utils';

import './Sign-up.styles.scss';

class SignUp extends React.Component {
    constructor(props) {
        super(props);

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
            this.props.setDisplayName(displayName);
            await auth.createUserWithEmailAndPassword(email, password);
            
            this.setState({ displayName: '', email: '', password: '', confirmPassword: '' });
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


#### `Comment:`
1. 这里看到的 `this.props.setDisplayName()` 是 bind 在 App.js 的 method，目的是为了传递 displayName 返回到 App.js 中的 state: displayNameFromSignUp 中，通过这个方式收集到 `dispalyName`。

2. 使用 google 登录的代码
    ```jsx                
    <CustomButton type='button' onClick={signInWithGoogle} google={true}>
    ```

  - __`Location:./clothing-friends-firebase/src/firebase/firebase.utils.js`__

    ```js
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const signInWithGoogle = () => auth.signInWithPopup(provider);
    ```

3. 在使用 Google 登录的方法中在返回的 auth info 中可以找到 `dispalyName`。

4. 综上可见，注册时 `displayName` 可以这样写：

    __`Location:./clothing-friends-firebase/src/App.js`__

    ```js
    const displayName = userAuth.displayName || this.state.displayNameFromSignUp;
    const userRef = await checkDocOrCreateDocInFirestore(userAuth, displayName);
    ```

- 上面的代码意思是，如果有 `displayName` ，先收集，然后在执行 `checkDocOrCreateDocInFirestore` 过程中验证是否有对应 `Firestore` 数据，如果没有，就在 `checkDocOrCreateDocInFirestore` 中使用收集的信息`（包括 displayName）`创建 Firestore data。
------------------------------------------------------------

__`本章用到的全部资料：`__

- null


- #### Click here: [BACK TO CONTENT](#1.0)
- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/README.md)