import { lazy, Suspence } from 'react';

const HomePage = lazy(() => import('./Pages/HomePage/HomePage.component'));
const ShopPage = lazy(() => import('./Pages/ShopPage/ShopPage.component'));
const SignInSignUpPage = lazy(() => import('./Pages/SignInSignUpPage/SignInSignUpPage.component'));
const CheckoutPage = lazy(() => import('./Pages/CheckoutPage/CheckoutPage.component'));

<Suspence fallback={<div>...Loading</div>}>
    <Route exact path="/signin">{currentUser ? <Redirect to="/" /> : <SignInAndSignUpPage />}</Route>
    <Route exact path='/' component={HomePage} />
    <Route path='/shop' component={ShopPage} />
    <Route exact path='/checkout' component={CheckoutPage} />
</Suspence>

// Less JS means our initial loading of our app is faster.

// Spinner folder, Spinner.styles.scss , Spinner.component.jsx

import React from 'react';

import { SpinnerContainer, SpinnerOverlay } from './Spinner.styles';

const Spinner = () => {
    return (
        <SpinnerOverlay>
            <SpinnerContainer />
        </SpinnerOverlay>
    )
}

export default Spinner;


//With-spinner.component.jsx

import Spinner from '../Spinner/Spinner.component';

const WithSpinner = WrappedComponent => {
    const Spinner = ({ isLoading, ...otherProps }) => {
        return isLoading ?
            (
                <Spinner />
            )
            : (
                <WrappedComponent {...otherProps} />
            )
    }
}

export default WithSpinner;

// App.js

import Spinner from './Components/Spinner/Spinner.component.jsx';

<Suspence fallback={<Spinner />}>
    <Route exact path="/signin">{currentUser ? <Redirect to="/" /> : <SignInAndSignUpPage />}</Route>
    <Route exact path='/' component={HomePage} />
    <Route path='/shop' component={ShopPage} />
    <Route exact path='/checkout' component={CheckoutPage} />
</Suspence>

// practice ShopPage lazy & suspence

//------------------Error boundry-----------//
// ./src/Components/Error-boundary/Error-boundary.component.jsx

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


// App.js
import ErrorBoundary from './Components/ErrorBoundary/ErrorBoundary.component.jsx';

<ErrorBoundary>
    <Suspence fallback={<Spinner />}>
        <Route exact path="/signin">{currentUser ? <Redirect to="/" /> : <SignInAndSignUpPage />}</Route>
        <Route exact path='/' component={HomePage} />
        <Route path='/shop' component={ShopPage} />
        <Route exact path='/checkout' component={CheckoutPage} />
    </Suspence>
</ErrorBoundary>

// HomePage.component.jsx

throw Error;

// Customize ErrorBoundary rendering page.

//------------------------React.memo-----------------
// save ourself from rerender unneeded components

// react dev tools react => Profiler

export default React.memo(Person); // 类似 reselect

//------Performance-------

// Cart-dropdown.component.jsx
// Cart-item.component.jsx

export default React.memo(CartItem);


//------useCallback-------

const functions = new Set();

const increase1 = useCallback(() => setCount1(count + 1), [count1]);
const increase2 = useCallback(() => setCount2(count + 1), [count2]);
const logName = useCallback(() => console.log('hello'), []);

functions.add(logName);

//----useMemo-------------

import { useMemo } from 'react';

const App = () => {
    const doSomethingComplicated = () => {
        console.log('This is a complex function.');
        return count1 * 1000 % 12.4 * 51000 - 4000;
    };//delete

    const doSomethingComplicatedMemo = useMemo(() => {
        console.log('This is a use memo function.');
        return count1 * 1000 % 12.4 * 51000 - 4000;
    }, [count1]);//add

    complexValue: { doSomethingComplicated() }; //delete
    complexValue: { doSomethingComplicated };//add
};


//-------------Gzipping + Compression-------------

// git push heroku master

// react-build-scripts

// npm i compression -------> in main folder not client folder

// server.js

const compression = require('compression');

app.use(compression());

// const enforce = require('express-sslify');

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors());
 
// if (process.env.NODE_ENV === 'production') {
//   app.use(compression);
//   app.use(enforce.HTTPS({ trustProtoHeader: true }));
//   app.use(express.static(path.join(__dirname, 'client/build')));
 
//   app.get('*', function(req, res) {
//     res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
//   });
// }

//-------------React <Profiler> --------------------

// React 16.10

// cd client 

// npm  react -v

// HomePage.component.jsx

import React, { Profiler } from 'react';

const HomePage = () => {
    return (
        <HomePageContainer>
            <Profiler
                id="Directory"
                onRender={(id, phase, actualDuration) => {
                    console.log(id, phase, actualDuration);
                }}>
                <Directory />
            </Profiler>
        </HomePageContainer>
    )
}

// ----- converting our app to PWA

// redux-saga

// index.js

import * as serviceWorker from './serviceWorker';

serviceWorker.register();

//server,js
app.get('/service-worker.js', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'service-worker.js'));
})

//manifest.json ------copy

// npm i express-sslify

//server.js
const enforce = require('express-sslify');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
 
if (process.env.NODE_ENV === 'production') {
  app.use(compression);
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
  app.use(express.static(path.join(__dirname, 'client/build')));
 
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}
 
app.listen(port, error => {
  if (error) throw error;
  console.log('Server is running on port ' + port);
});

// git push heroku master --force

```bash
$ git init
$ heroku login
$ heroku create <your app name>
$ heroku git:remote -a <your app name>
$ git add .
$ git commit -m'something'
$ git push heroku master --force
```