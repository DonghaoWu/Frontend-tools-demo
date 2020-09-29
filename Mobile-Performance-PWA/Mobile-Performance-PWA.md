# Front end development tools (Part 13)

### `Key Words: Mobile support, media query, performance, PWA, lazy loading, Suspense, error boundry, React.memo, useCallback, useMemo.`

- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/README.md)

## `Section: Mobile support, React performance, PWA.` (Basic)

### `Summary`: In this documentation, we learn to add mobile support, react performance, Progressive web application.

### `Check Dependencies & Tools:`

- compression
- express-sslify

------------------------------------------------------------

#### `本章背景：`
1. 本章未应用到的 react hooks：
    - React.memo: 记住变量不输刷新。
    - useCallback: 记住函数因为参数不改变就不生成新函数。
    - useMemo: 记住复杂函数只因为参数改变才重新计算。

------------------------------------------------------------

#### `本章节涉及到的文件：`

    1. Spinner.component.jsx
    2. Spinner.styles.jsx
    3. With-spinner.jsx
    4. App.js

------------------------------------------------------------

### <span id="13.0">`Brief Contents & codes position`</span>

- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/README.md)

- [13.1 Mobile support.](#13.1)
- [13.2 Changing Spinner component.](#13.2)
- [13.3 React performance.](#13.3)
- [13.4 PWA.](#13.4)
- [13.5 Deploy on heroku.](#13.5)

------------------------------------------------------------

### <span id="13.1">`Step1: Mobile support.`</span>

- #### Click here: [BACK TO CONTENT](#13.0)

1. Sample file:

    - App.scss
    ```scss
    body {
        font-family: 'Open Sans Condensed';
        padding: 20px 40px;

        @media screen and (max-width: 800px) {
            padding: 10px;
        }
    }

    a {
        text-decoration: none;
        color: black;
    }

    * {
        box-sizing: border-box;
    }
    ```

2. Related files.

    - App.scss
    - CheckoutPage.styles.scss
    - CollectionPage.styles.scss
    - HomePage.styles.scss
    - SignInSignUpPage.styles.scss

    - Checkout-item.styles.scss
    - Collection-item.styles.scss
    - Collection-preview.styles.scss
    - Header.styles.scss
    - Directory-item.styles.scss
    - Sign-in.styles.scss
    - Sign-up.styles.scss

#### `Comment:`

1. 重点是：
```diff
+    @media screen and (max-width: 800px) {
+        padding: 10px;
+    }
```

### <span id="13.2">`Step2: Changing Spinner component.`</span>

- #### Click here: [BACK TO CONTENT](#13.0)

1. Spinner.component.jsx

    __`Location:./clothing-friends-mobile-performance-pwa/client/src/Components/Spinner/Spinner.component.jsx`__

    ```jsx
    import React from 'react';

    import './Spinner.styles.scss';

    const Spinner = () => (
        <div className='spinner-overlay'>
            <div className='spinner-container' />
        </div>
    );

    export default Spinner;
    ```

    __`Location:./clothing-friends-mobile-performance-pwa/client/src/Components/Spinner/Spinner.styles.scss`__

    ```css
    .spinner-overlay {
        height: 60vh;
        width: 130%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .spinner-container {
        display: inline-block;
        width: 50px;
        height: 50px;
        border: 3px solid rgba(195, 195, 195, 0.6);
        border-radius: 50%;
        border-top-color: #636767;
        animation: spin 1s ease-in-out infinite;
        -webkit-animation: spin 1s ease-in-out infinite;
    
        @keyframes spin {
                to {
                    -webkit-transform: rotate(360deg);
                }
            }
            @-webkit-keyframes spin {
                to {
                    -webkit-transform: rotate(360deg);
                }
        }
    }
    ```

2. Import Spinner component in With-spinner component.

    __`Location:./clothing-friends-mobile-performance-pwa/client/src/Components/With-spinner/Collections-overview.container.jsx`__

    ```jsx
    import React from 'react';

    import Spinner from '../Spinner/Spinner.component';

    const WithSpinner = WrappedComponent => ({ isLoading, ...otherProps }) => {
        return isLoading ?
            (
                <Spinner />
            )
            : (
                <WrappedComponent {...otherProps} />
            )
    }

    export default WithSpinner;
    ```

#### `Comment:`
1.

### <span id="13.3">`Step3: React performance.`</span>

- #### Click here: [BACK TO CONTENT](#13.0)

1. Add `lazy` and `suspense` from react:

    __`Location:./clothing-friends-mobile-performance-pwa/client/src/App.js`__

    ```diff
    +import React, { lazy, Suspense } from 'react';
    import { Switch, Route, Redirect } from 'react-router-dom';
    import { connect } from 'react-redux';
    import { createStructuredSelector } from 'reselect';

    import Header from './Components/Header/Header.component';
    +import Spinner from './Components/Spinner/Spinner.component';

    import { selectCurrentUser } from './redux/user/user.selectors';

    import { checkUserSession } from './redux/user/user.actions';

    import './App.scss';

    +const HomePage = lazy(() => import('./Pages/HomePage/HomePage.component'));
    +const ShopPage = lazy(() => import('./Pages/ShopPage/ShopPage.component'));
    +const SignInAndSignUpPage = lazy(() => import('./Pages/SignInSignUpPage/SignInAndSignUpPage.component'));
    +const CheckoutPage = lazy(() => import('./Pages/CheckoutPage/CheckoutPage.component'));

    class App extends React.Component {

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
    +                  <Suspense fallback={<Spinner />}>
                            <Route exact path="/signin">{currentUser ? <Redirect to="/" /> : <SignInAndSignUpPage />}</Route>
                            <Route exact path='/' component={HomePage} />
                            <Route path='/shop' component={ShopPage} />
                            <Route exact path='/checkout' component={CheckoutPage} />
    +                  </Suspense>
                    </Switch>
                </div>
            );
        }
    }

    const mapStateToProps = createStructuredSelector({
        currentUser: selectCurrentUser
    });

    const mapDispatchToProps = dispatch => ({
        checkUserSession: () => dispatch(checkUserSession())
    });

    export default connect(mapStateToProps,mapDispatchToProps)(App);
    ```

2. Add a Error boundary component.

    __`Location:./clothing-friends-mobile-performance-pwa/client/src/Components/Error-boundary/Error-boundary.component.jsx`__

    ```jsx
    import React from 'react';

    class ErrorBoundary extends React.Component {
        constructor() {
            super();

            this.state = {
                hasErrored: false
            }
        }

        static getDerivedStateFromError(error) {
            return { hasErrored: true }
        }

        componentDidCatch(error, info) {
            console.log(error);
        }

        render() {
            if (this.state.hasErrored) {
                return <div> Somthing went wrong.</div>
            }

            return this.props.children;
        }
    }

    export default ErrorBoundary;
    ```

3. Add error boundary compnent to App.js

    ```diff
    import React, { lazy, Suspense } from 'react';
    import { Switch, Route, Redirect } from 'react-router-dom';
    import { connect } from 'react-redux';
    import { createStructuredSelector } from 'reselect';

    import Header from './Components/Header/Header.component';
    import Spinner from './Components/Spinner/Spinner.component';
    +import ErrorBoundary from './Components/Error-boundary/Error-boundary.component.jsx';

    import { selectCurrentUser } from './redux/user/user.selectors';

    import { checkUserSession } from './redux/user/user.actions';

    import './App.scss';

    const HomePage = lazy(() => import('./Pages/HomePage/HomePage.component'));
    const ShopPage = lazy(() => import('./Pages/ShopPage/ShopPage.component'));
    const SignInAndSignUpPage = lazy(() => import('./Pages/SignInSignUpPage/SignInAndSignUpPage.component'));
    const CheckoutPage = lazy(() => import('./Pages/CheckoutPage/CheckoutPage.component'));

    class App extends React.Component {

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
    +                   <ErrorBoundary>
                            <Suspense fallback={<Spinner />}>
                                <Route exact path="/signin">{currentUser ? <Redirect to="/" /> : <SignInAndSignUpPage />}</Route>
                                <Route exact path='/' component={HomePage} />
                                <Route path='/shop' component={ShopPage} />
                                <Route exact path='/checkout' component={CheckoutPage} />
                            </Suspense>
    +                   </ErrorBoundary>
                    </Switch>
                </div>
            );
        }
    }

    const mapStateToProps = createStructuredSelector({
        currentUser: selectCurrentUser
    });

    const mapDispatchToProps = dispatch => ({
        checkUserSession: () => dispatch(checkUserSession())
    });

    export default connect(mapStateToProps,mapDispatchToProps)(App);
    ```

4. Gzipping & Compression

    - install dependency in main directory.
    ```bash
    $ npm i compression
    ```

    - apply the dependency in server.js

    ```js
    const compression = require('compression');
    app.use(compression());
    ```

#### `Comment:`
1. 

### <span id="13.4">`Step4: PWA.`</span>

- #### Click here: [BACK TO CONTENT](#13.0)

1. Add service worker.

    __`Location:./clothing-friends-mobile-performance-pwa/client/src/index.js`__

    ```diff
    +import * as serviceWorker from './serviceWorker';

    +serviceWorker.register();
    ```

    __`Location:./clothing-friends-mobile-performance-pwa/client/src/server.js`__

    ```diff
    +app.get('/service-worker.js', (req, res) => {
    +    res.sendFile(path.resolve(__dirname, '..', 'build', 'service-worker.js'));
    +})
    ```

2. manifest.json

    - image files:
        - ./client/public/crwn-192x192.png
        - ./client/public/crwn-512x512.png

    __`Location:./clothing-friends-mobile-performance-pwa/client/public/manifest.json`__

    ```json
    {
        "short_name": "Clothing-friends",
        "name": "Clothing-friends by Donghao",
        "icons": [
            {
            "src": "favicon.ico",
            "sizes": "64x64 32x32 24x24 16x16",
            "type": "image/x-icon"
            },
            {
            "src": "crwn-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
            },
            {
            "src": "crwn-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
            }
        ],
        "start_url": ".",
        "display": "standalone",
        "theme_color": "#000000",
        "background_color": "#ffffff"
    }
    ```

3. ssl

    - install dependency in main directory.
    ```bash
    $ npm i express-sslify
    ```

    - apply dependency in server.js

    ```diff
    const express = require('express');
    const cors = require('cors');
    const bodyParser = require('body-parser');
    const path = require('path');
    +const compression = require('compression');
    +const enforce = require('express-sslify');

    if (process.env.NODE_ENV !== 'production') require('dotenv').config();

    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    const app = express();
    const port = process.env.PORT || 5000;

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cors());

    if (process.env.NODE_ENV === 'production') {
    +    app.use(compression());
    +    app.use(enforce.HTTPS({ trustProtoHeader: true }));
    +    app.use(express.static(path.join(__dirname, 'client/build')));

        app.get('*', function (req, res) {
            res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
        });
    }

    app.listen(port, error => {
        if (error) throw error;
        console.log('Server running on port ' + port);
    });

    +app.get('/service-worker.js', (req, res) => {
    +    res.sendFile(path.resolve(__dirname, '..', 'build', 'service-worker.js'));
    +});

    app.post('/payment', (req, res) => {
        const body = {
            source: req.body.token.id,
            amount: req.body.amount,
            currency: 'usd'
        };

        stripe.charges.create(body, (stripeErr, stripeRes) => {
            if (stripeErr) {
                res.status(500).send({ error: stripeErr });
            } else {
                res.status(200).send({ success: stripeRes });
            }
        });
    });
    ```

#### `Comment:`
1. 

### <span id="13.5">`Step5: Deploy on heroku.`</span>

- #### Click here: [BACK TO CONTENT](#13.0)

```bash
$ git init
$ heroku login
$ heroku create <your app name>
$ heroku git:remote -a <your app name>
$ git add .
$ git commit -m'something'
$ git push heroku master --force
```

-----------------------------------------------------------------

__`本章用到的全部资料：`__

- [https://www.apollographql.com/docs/](https://www.apollographql.com/docs/)

- #### Click here: [BACK TO CONTENT](#13.0)
- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/README.md)