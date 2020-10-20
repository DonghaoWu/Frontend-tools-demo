# Front end development tools (Part 15)

### `Key Words: Firebase auth, context API 规范, PrivateRoute, useEffect, useRef, useHistory, Redirect, Firebase auth methods promise.all, dev mode & prod mode, forgot password, deploy CRA on heroku.`

- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/README.md)

## `Section: Firebase auth, react context, bootstrap.` (Advanced)

### `Summary`: In this documentation, we implemented an firebase demo web app.

### `Check Dependencies & Tools:`

- create-react-app
- firebase
- bootstrap react-bootstrap
- react-router-dom
------------------------------------------------------------

#### `本章背景：`
1. 本章有很多规范动作可以借鉴，同时也是一个快速建立 app auth 组件的教程。

------------------------------------------------------------

#### `APIs`:

- contextAPI:

```diff
+ const AuthContext = React.createContext();
+ export function useAuth() {
+    return useContext(AuthContext);
+ }
```

- React hooks:

```diff
+ useContext
+ useState
+ useEffect
+ useRef
```

- React-router-dom

```diff
+ useHistory
+ Link
+ BrowserRouter
+ Switch
+ Route
+ Redirect
```

- Bootstrap

```diff
+ Form
+ Card
+ Button
+ Alert
```

- react-bootstrap

```diff
+ Container
```

- Firebase
```diff
+ onAuthStateChanged
+ createUserWithEmailAndPassword
+ signInWithEmailAndPassword
+ signOut
+ sendPasswordResetEmail
+ updateEmail
+ updatePassword
```

------------------------------------------------------------

### <span id="15.0">`Brief Contents & codes position`</span>

- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/README.md)

- [15.1 Preparation.](#15.1)
- [15.2 Set up contextAPI.](#15.2)
- [15.3 Add components.](#15.3)
- [15.4 Add react-router-dom and private route.](#15.4)
- [15.5 Deploy on heroku.](#15.5)

------------------------------------------------------------

### <span id="15.1">`Step1: Preparation.`</span>

- #### Click here: [BACK TO CONTENT](#15.0)

1. Create a new react app.

    ```bash
    $ npx create-react-app <your-app-name>
    $ cd <your-app-name>
    ```

2. Install dependencies.

    ```bash
    $ npm i firebase
    $ npm i react-router-dom
    $ npm i bootstrap react-bootstrap
    ```

3. Create a new firebase app and copy the configuration code.

    - Add a new project.
    <p align="center">
        <img src="../assets/fe-p15-01.png" width=90%>
    </p>

    ------------------------------------------------------------
    - Add project name.
    <p align="center">
        <img src="../assets/fe-p15-02.png" width=90%>
    </p>

    ------------------------------------------------------------
    - Continue.
    <p align="center">
        <img src="../assets/fe-p15-03.png" width=90%>
    </p>

    ------------------------------------------------------------
    - Enable email/password sign-in method.
    <p align="center">
        <img src="../assets/fe-p15-04.png" width=90%>
    </p>
    
    ------------------------------------------------------------

    <p align="center">
        <img src="../assets/fe-p15-05.png" width=90%>
    </p>

    ------------------------------------------------------------
    - Create a web app.
    <p align="center">
        <img src="../assets/fe-p15-06.png" width=90%>
    </p>

    ------------------------------------------------------------
    - Set up web app nickname.
    <p align="center">
        <img src="../assets/fe-p15-07.png" width=90%>
    </p>
    
    ------------------------------------------------------------
    - Copy the configuration code.
    <p align="center">
        <img src="../assets/fe-p15-08.png" width=90%>
    </p>

    ------------------------------------------------------------

4. Create a new local environment file call `.env.local`(only for this doc.)

    __`Location:./.env.local`__

    ```bash
    REACT_APP_FIREBASE_API_KEY=AIzaSyBxEpzKfLwtwIQOscDBlUbftS1OercOQfE
    REACT_APP_FIREBASE_AUTH_DOMAIN=auth-demo-presentation.firebaseapp.com
    REACT_APP_FIREBASE_DATABASE_URL=https://auth-demo-presentation.firebaseio.com
    REACT_APP_FIREBASE_PROJECT_ID=auth-demo-presentation
    REACT_APP_FIREBASE_STORAGE_BUCKET=auth-demo-presentation.appspot.com
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=292891655295
    REACT_APP_FIREBASE_APP_ID=1:292891655295:web:2456c1fd7b205fcc79d34a
    ```

5. Create a new file call `firebase.js`.

    __`Location:./src/firebase.js`__

    ```js
    import firebase from 'firebase/app';
    import 'firebase/auth';

    const app = firebase.initializeApp({
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
        storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.REACT_APP_FIREBASE_APP_ID
    });

    export const auth = app.auth();
    export default app;
    ```

6. Add bootstrap.

    __`Location:./src/index.js`__

    ```diff
        import React from "react"
        import ReactDOM from "react-dom"
        import App from "./components/App"
    +   import "bootstrap/dist/css/bootstrap.min.css"

        ReactDOM.render(
            <React.StrictMode>
                <App />
            </React.StrictMode>,
            document.getElementById("root")
        )
    ```


#### `Comment:`
1. :gem:dev mode / prod mode 的设置：一般来说会创建两个 project，dev project 是会允许 local，而 prod project 是不允许 local，这样做防止其他人下载 repo 之后在本地向 project 发送数据。
2. 注意这里没有使用到 dotenv，React 自带 env 设置，只需要每个变量前面加入 `REACT_APP`。

### <span id="15.2">`Step2: Set up contextAPI.`</span>

- #### Click here: [BACK TO CONTENT](#15.0)

1. Create a new folder and a new file.

    __`Location:./client/src/contexts/AuthContext.js`__

    ```js
    import React, { useContext, useState, useEffect } from 'react';
    import { auth } from '../firebase';

    const AuthContext = React.createContext();

    export function useAuth() {
        return useContext(AuthContext);
    }

    export function AuthProvider({ children }) {
        const [currentUser, setCurrentUser] = useState();
        const [loading, setLoading] = useState(true);

        function signup(email, password) {
            return auth.createUserWithEmailAndPassword(email, password);
        }

        function signin(email, password) {
            return auth.signInWithEmailAndPassword(email, password);
        }

        function signOut() {
            return auth.signOut();
        }

        function resetPassword(email) {
            return auth.sendPasswordResetEmail(email);
        }

        function updateEmail(email) {
            return currentUser.updateEmail(email);
        }

        function updatePassword(password) {
            return currentUser.updatePassword(password);
        }

        useEffect(() => {
            const unsubscribe = auth.onAuthStateChanged(user => {
                setCurrentUser(user);
                setLoading(false);
            });
            return unsubscribe;
        }, []);

        const value = {
            currentUser,
            signup,
            signin,
            signOut,
            resetPassword,
            updateEmail,
            updatePassword
        }

        return (
            <AuthContext.Provider value={value}>
                {!loading && children}
            </AuthContext.Provider>
        )
    }
    ```

    #### `Comment:`
    1. :gem:必须要说明的是这里所有的 function 都需要带 return。
    2. :gem::gem::gem:useEffect 的用法说明，它相当于 componentDidMount，[] 代表如果想执行`只运行一次的 effect`（仅在组件挂载和卸载时执行），可以传递一个空数组（[]）作为第二个参数。这就告诉 React 你的 effect 不依赖于 props 或 state 中的任何值，所以它永远都不需要重复执行。
    3. :gem::gem::gem:返回的 unsubscribe 实际上是一个 function，react 会在 unMount 的时候运行它。

2. Wrap the app in AuthProvider.

    __`Location:./client/src/components/App.js`__

    ```diff
        import React from "react";

        import Signup from "./Signup";
        import Signin from './Signin';
        import Dashboard from './Dashboard';
        import PrivateRoute from './PrivateRoute';
        import ForgotPassword from './ForgotPassword';
        import UpdateProfile from './UpdateProfile';

        import { Container } from 'react-bootstrap';
    +   import { AuthProvider } from "../contexts/AuthContext";
        import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

        function App() {
            return (
                <Container className='d-flex align-items-center justify-content-center' style={{ minHeight: '100vh' }}>
                <div className='w-100' style={{ maxWidth: '400px' }}>
                    <Router>
    +                   <AuthProvider>
                            <Switch>
                                <PrivateRoute exact path='/' component={Dashboard} />
                                <PrivateRoute path='/update-profile' component={UpdateProfile} />
                                <Route path='/signup' component={Signup} />
                                <Route path='/signin' component={Signin} />
                                <Route path='/forgot-password' component={ForgotPassword} />
                            </Switch>
    +                   </AuthProvider>
                    </Router>
                </div>
                </Container>
            );
        }

        export default App;
    ```
#### `Comment:`
1. 设定 contextAPI 的步骤：

    - 引用 useContext
    - 使用 createContext 生成 context。(MyContext)
    - 使用 useContext 和 context 生成 function。(useMyContext)
    - 建立一个 component.(MyProvider)
    - 可以在组件内添加 state 和 function。
    - 设定 value。
    - 在组件最后使用生成的 context。(MyContext.Provider)

    - :gem::gem::gem:__`常用范本`__:

    ```js
    import React, { useContext } from 'react';

    const MyContext = React.createContext();

    export function useMyContext() {
        return useContext(MyContext);
    }

    export function MyProvider({ children }) {
        const [someState, setSomeState] = useState();
        const [loading, setLoading] = useState(true);

        function helloFunction() {
            return 'hello'
        }

        const value = {
            someState,
            helloFunction
        }

        return (
            <MyContext.Provider value={value}>
                {!loading && children}
            </MyContext.Provider>
        )
    }
    ```

2. 在上面的设置做好之后，后面需要做的事情是在 MyProvider 中添加 state 或者 function，甚至 useEffect hook。

3. :gem:组件使用 context 的方法：

    ```js
    import { useAuth } from '../contexts/AuthContext';

    // Inside compoennt...

    const { signin } = useAuth();
    ```

### <span id="15.3">`Step3: Add components.`</span>

- #### Click here: [BACK TO CONTENT](#15.0)

1. Sign up compoennt.

    __`Location:./src/components/Signup.js`__

    ```js
    import React, { Fragment, useRef, useState } from 'react';
    import { Link, useHistory } from 'react-router-dom';
    import { Form, Card, Button, Alert } from 'react-bootstrap';
    import { useAuth } from '../contexts/AuthContext';

    export default function Signup() {

        const emailRef = useRef();
        const passwordRef = useRef();
        const passwordConfirmRef = useRef();

        const { signup } = useAuth();

        const [error, setError] = useState('');
        const [loading, setLoading] = useState(false);

        const history = useHistory();

        async function handelSubmit(e) {
            e.preventDefault();
            if (passwordRef.current.value !== passwordConfirmRef.current.value) {
                return setError('Passwords do not match.');
            }
            try {
                setError('');
                setLoading(true);
                await signup(emailRef.current.value, passwordRef.current.value);
                history.push("/");
            } catch (error) {
                setError(`Failed to create an account.`);
            }
            setLoading(false);
        }

        return (
            <Fragment>
                <Card>
                    <Card.Body>
                        <h2 className='text-center mb-4'>Sign Up</h2>
                        {error && <Alert variant='danger'>{error}</Alert>}
                        <Form onSubmit={handelSubmit}>
                            <Form.Group id="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" ref={emailRef} required />
                            </Form.Group>
                            <Form.Group id="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" ref={passwordRef} required />
                            </Form.Group>
                            <Form.Group id="password-confirm">
                                <Form.Label>Password Confirmation</Form.Label>
                                <Form.Control type="password" ref={passwordConfirmRef} required />
                            </Form.Group>
                            <Button disable={`${loading}`} className="w-100" type="submit">Sign Up</Button>
                        </Form>

                    </Card.Body>
                </Card>
                <div className='w-100 text-center mt-2'>Already have an account? <Link to='/signin'>Sign in.</Link></div>
            </Fragment>
        )
    }
    ```

    #### `Comment:`
    1. useRef 的应用，目前知道是在表格中使用。
    2. useHistory 的应用，是 react-router-dom 的一个组件，可以快速引用 `history` 值。
    3. setError 和 setLoading 的前后置空和赋值过程，比较严谨。
    4. Bootstrap 的 Alert 和 setError 配合使用。


2. Sign in component.

    __`Location:./src/components/Signin.js`__

    ```js
    import React, { Fragment, useRef, useState } from 'react';
    import { Link, useHistory } from 'react-router-dom';
    import { Form, Card, Button, Alert } from 'react-bootstrap';
    import { useAuth } from '../contexts/AuthContext';

    export default function Signin() {

        const emailRef = useRef();
        const passwordRef = useRef();

        const { signin } = useAuth();

        const [error, setError] = useState('');
        const [loading, setLoading] = useState(false);
        const history = useHistory();

        async function handelSubmit(e) {
            e.preventDefault();
            try {
                setError('');
                setLoading(true);
                await signin(emailRef.current.value, passwordRef.current.value);
                history.push('/');
            } catch (error) {
                setError(`Failed to sign in.`);
            }
            setLoading(false);
        }

        return (
            <Fragment>
                <Card>
                    <Card.Body>
                        <h2 className='text-center mb-4'>Sign In</h2>
                        {error && <Alert variant='danger'>{error}</Alert>}
                        <Form onSubmit={handelSubmit}>
                            <Form.Group id="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" ref={emailRef} required />
                            </Form.Group>
                            <Form.Group id="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" ref={passwordRef} required />
                            </Form.Group>
                            <Button disable={`${loading}`} className="w-100" type="submit">Sign in</Button>
                        </Form>
                        <div className='w-100 text-center mt-3'>
                            <Link to='/forgot-password'>Forgot Password?</Link>
                        </div>
                    </Card.Body>
                </Card>
                <div className='w-100 text-center mt-2'>Need an account? <Link to='/signup'>Sign Up.</Link></div>
            </Fragment>
        )
    }
    ```

    #### `Comment:`
    1. useRef 的应用，目前知道是在表格中使用。
    2. useHistory 的应用，是 react-router-dom 的一个组件，可以快速引用 `history` 值。
    3. setError 和 setLoading 的前后置空和赋值过程，比较严谨。
    4. Bootstrap 的 Alert 和 setError 配合使用。
    5. :gem:这里引出一个问题，<Link> 和 history.push() 都能起到跳转页面的作用，但应该会有不同，比如说 Link 跳转的页面刷新后回归初始页，而 history 不会。
    6. loading 值与 disable 一并使用，可以防止重复 submit。


3. Dashboard component.

    __`Location:./src/components/Dashboard.js`__

    ```js
    import React, { Fragment, useState } from 'react';
    import { Card, Button, Alert } from 'react-bootstrap';
    import { Link, useHistory } from 'react-router-dom';
    import { useAuth } from '../contexts/AuthContext';

    export default function Dashboard() {

        const { currentUser, signOut } = useAuth();

        const history = useHistory();

        const [error, setError] = useState('');

        const handleSignout = async () => {
            setError('');
            try {
                await signOut();
                history.push('/signin');
            } catch (error) {
                setError('Failed to sign out.')
            }
        }

        return (
            <Fragment>
                <Card>
                    <Card.Body>
                        <h2 className='text-center mb-4'>Profile</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <strong>Email:{currentUser.email}</strong>
                        <Link to='/update-profile' className='btn btn-primary w-100 mt-3'>Update profile</Link>
                    </Card.Body>
                </Card>
                <div className='w-100 text-center mt-2'>
                    <Button variant="link" onClick={handleSignout}>Sign Out</Button>
                </div>
            </Fragment>
        )
    }
    ```

4. Forgot Password component.

    __`Location:./src/components/ForgotPassword.js`__

    ```js
    import React, { Fragment, useRef, useState } from 'react';
    import { Link } from 'react-router-dom';
    import { Form, Card, Button, Alert } from 'react-bootstrap';
    import { useAuth } from '../contexts/AuthContext';

    export default function ForgotPassword() {

        const emailRef = useRef();

        const { resetPassword } = useAuth();

        const [error, setError] = useState('');
        const [message, setMessage] = useState('');
        const [loading, setLoading] = useState(false);

        async function handelSubmit(e) {
            e.preventDefault();
            try {
                setMessage('');
                setError('');
                setLoading(true);
                await resetPassword(emailRef.current.value);
                setMessage('Check yout inbox for further instructions.')
            } catch (error) {
                setError(`Failed to reset password.`);
            }
            setLoading(false);
        }

        return (
            <Fragment>
                <Card>
                    <Card.Body>
                        <h2 className='text-center mb-4'>Password Reset</h2>
                        {error && <Alert variant='danger'>{error}</Alert>}
                        {message && <Alert variant='success'>{message}</Alert>}
                        <Form onSubmit={handelSubmit}>
                            <Form.Group id="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" ref={emailRef} required />
                            </Form.Group>
                            <Button disable={loading} className="w-100" type="submit">Reset Password</Button>
                        </Form>
                        <div className='w-100 text-center mt-3'>
                            <Link to='/signin'>Sign in</Link>
                        </div>
                    </Card.Body>
                </Card>
                <div className='w-100 text-center mt-2'>Need an account? <Link to='/signup'>Sign Up.</Link></div>
            </Fragment>
        )
    }
    ```

    #### `Comment:`
    1. setMessage 和 setError 的作用一样，都是配合 Alert 使用。
    
5. Update profile component.

    __`Location:./src/components/UpdataProfile.js`__

    ```js
    import React, { Fragment, useRef, useState } from 'react';
    import { Link, useHistory } from 'react-router-dom';
    import { Form, Card, Button, Alert } from 'react-bootstrap';
    import { useAuth } from '../contexts/AuthContext';

    export default function UpdateProfile() {

        const emailRef = useRef();
        const passwordRef = useRef();
        const passwordConfirmRef = useRef();

        const { currentUser, updateEmail, updatePassword } = useAuth();

        const [error, setError] = useState('');
        const [loading, setLoading] = useState(false);

        const history = useHistory();

        function handelSubmit(e) {
            e.preventDefault();
            if (passwordRef.current.value !== passwordConfirmRef.current.value) {
                return setError('Passwords do not match.');
            }

            const promises = [];
            setError('');
            setLoading(true);

            if (emailRef.current.value !== currentUser.email) {
                promises.push(updateEmail(emailRef.current.value));
            }
            if (passwordRef.current.value) {
                promises.push(updatePassword(passwordRef.current.value));
            }

            Promise.all(promises)
                .then(() => {
                    history.push('/')
                }).catch(err => {
                    setError(`Failed to update account.`)
                }).finally(() => {
                    setLoading(false);
                });
        }

        return (
            <Fragment>
                <Card>
                    <Card.Body>
                        <h2 className='text-center mb-4'>Update Profile</h2>
                        {error && <Alert variant='danger'>{error}</Alert>}
                        <Form onSubmit={handelSubmit}>
                            <Form.Group id="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" ref={emailRef} required
                                    defaultValue={currentUser.email} />
                            </Form.Group>
                            <Form.Group id="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" ref={passwordRef}
                                    placeholder='Leave blank to keep the same.' />
                            </Form.Group>
                            <Form.Group id="password-confirm">
                                <Form.Label>Password Confirmation</Form.Label>
                                <Form.Control type="password" ref={passwordConfirmRef}
                                    placeholder='Leave blank to keep the same.' />
                            </Form.Group>
                            <Button disable={loading} className="w-100" type="submit">Update</Button>
                        </Form>
                    </Card.Body>
                </Card>
                <div className='w-100 text-center mt-2'><Link to='/'>Cancel</Link></div>
            </Fragment>
        )
    }
    ```

#### `Comment:`
1. 本章最难点，使用 promise.all 处理两个 promise:
```js
const promises = [];

if (emailRef.current.value !== currentUser.email) {
    promises.push(updateEmail(emailRef.current.value));
}
if (passwordRef.current.value) {
    promises.push(updatePassword(passwordRef.current.value));
}

Promise.all(promises)
    .then(() => {
        history.push('/')
    }).catch(err => {
        setError(`Failed to update account.`)
    }).finally(() => {
        setLoading(false);
    });
```

### <span id="15.4">`Step4: Add react-router-dom and private route.`</span>

- #### Click here: [BACK TO CONTENT](#15.0)

1. Add react router dom.

    __`Location:./src/components/App.js`__

    ```diff
        import React from "react";

        import Signup from "./Signup";
        import Signin from './Signin';
        import Dashboard from './Dashboard';
        import PrivateRoute from './PrivateRoute';
        import ForgotPassword from './ForgotPassword';
        import UpdateProfile from './UpdateProfile';

        import { Container } from 'react-bootstrap';
        import { AuthProvider } from "../contexts/AuthContext";
    +   import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

        function App() {
            return (

                <Container className='d-flex align-items-center justify-content-center' style={{ minHeight: '100vh' }}>
                    <div className='w-100' style={{ maxWidth: '400px' }}>
    +                   <Router>
                            <AuthProvider>
    +                           <Switch>
    +                               <PrivateRoute exact path='/' component={Dashboard} />
    +                               <PrivateRoute path='/update-profile' component={UpdateProfile} />
    +                               <Route path='/signup' component={Signup} />
    +                               <Route path='/signin' component={Signin} />
    +                               <Route path='/forgot-password' component={ForgotPassword} />
    +                           </Switch>
                            </AuthProvider>
    +                   </Router>
                    </div>
                </Container>
            );
        }

        export default App;
    ```

2. Add Private route component.

    __`Location:./src/components/PrivateRoute.js`__

    ```js
    import React from 'react';
    import { Route, Redirect } from 'react-router-dom';
    import { useAuth } from '../contexts/AuthContext';

    export default function PrivateRoute({ component: Component, ...rest }) {
        const { currentUser } = useAuth();
        return (
            <Route
                {...rest}
                render={props => {
                    return currentUser ? <Component {...props} /> : <Redirect to='/signin' />
                }}>
            </Route>
        )
    }
    ```

#### `Comment:`
1. path 和 exact path 的区别，path 可以代替之后出现的子路线，比如说：
```js
<Route path='/route-1' component={componentA} />
<Route path='/route-1/sub-1' component={componentB} />
```

2. 在上面的情况下是无论如何都进入不到 `/route-1/sub-1` 的，而是全部转到 `/route-1`。
3. :gem::gem:解决方法:

    - 改变顺序：
    ```js
    <Route path='/route-1/sub-1' component={componentB} />
    <Route path='/route-1' component={componentA} />
    ```

    - 使用 exact
    ```js
    <Route exact path='/route-1' component={componentA} />
    <Route path='/route-1/sub-1' component={componentB} />
    ```

4. PrivateRoute 的设置是本章最有价值的点，这里使用的是 HOC 的方法，之后可以在很多例子中使用。

### <span id="15.5">`Step5: Deploy on heroku.`</span>

- #### Click here: [BACK TO CONTENT](#15.0)

1. `Delete` yarn.lock file.

2. Install dependency.

    ```bash
    $ npm i express
    ```

3. Add server.js file

    ```js
    const express = require('express');
    const path = require('path');

    const app = express();

    const port = process.env.PORT || 5000;

    if (process.env.NODE_ENV === 'production') {
        app.use(express.static(path.join(__dirname, 'build')));
        app.get('/', function (req, res) {
            res.sendFile(path.join(__dirname, 'build', 'index.html'));
        });
    }

    app.listen(port, error => {
        if (error) throw error;
        console.log('Server running on port ' + port);
    });
    ```

4. Add a script in package.json

    ```diff
    "scripts": {
    +   "start": "node server.js",
        "build": "react-scripts build",
        "test": "react-scripts test",
        "eject": "react-scripts eject",
    +   "heroku-postbuild": "npm install && npm run build"
    }
    ```

5. Deploy on Heroku - <In app root directory>:

    ```bash
    $ git init
    $ heroku login
    $ heroku create <your app name>
    $ heroku git:remote -a <your app name>
    $ git add .
    $ git commit -m'something'
    $ git push heroku main
    ```

6. Allow deploy domain in Firebase.

    <p align="center">
        <img src="../assets/fe-p15-09.png" width=90%>
    </p>

7. Add env variables in heroku setting.

    <p align="center">
        <img src="../assets/fe-p15-10.png" width=90%>
    </p>

__`本章用到的全部资料：`__

- null

- #### Click here: [BACK TO CONTENT](#15.0)
- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/README.md)