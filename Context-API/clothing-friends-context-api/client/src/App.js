import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import HomePage from './Pages/HomePage/HomePage.component';
import ShopPage from './Pages/ShopPage/ShopPage.component';
import SignInAndSignUpPage from './Pages/SignInSignUpPage/SignInAndSignUpPage.component';
import CheckoutPage from './Pages/CheckoutPage/CheckoutPage.component';
import Header from './Components/Header/Header.component';

import { auth, checkDocOrCreateDocInFirestore } from './firebase/firebase.utils';

import CurrentUserContext from './contexts/current-user/current-user.context.js';
import { CartContext } from './providers/cart/cart.provider';

import './App.css';

class App extends React.Component {
    static contextType = CartContext;

    constructor() {
        super();
        this.state = {
            currentUser: null,
        }
    }

    componentDidMount() {
        const { setName } = this.context;

        this.listener = auth.onAuthStateChanged(async userAuth => {
            if (userAuth) {
                try {
                    const displayName = userAuth.displayName || this.context.displayName;
                    const userRef = await checkDocOrCreateDocInFirestore(userAuth, displayName);
                    userRef.onSnapshot(snapShot => {
                        this.setState(
                            {
                                currentUser: {
                                    id: snapShot.id,
                                    ...snapShot.data()
                                }
                            }
                        );
                        setName('');
                    });
                }
                catch (error) {
                    this.setState({ currentUser: null });
                    setName('');
                    console.log('error creating user', error.message);
                }
            }
            else {
                this.setState({ currentUser: null });
                setName('');
            }
        })
    }

    componentWillUnmount() {
        this.listener();
    }

    render() {
        const { currentUser } = this.state;
        return (
            <div>
                <CurrentUserContext.Provider value={currentUser}>
                    <Header />
                </CurrentUserContext.Provider>
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

export default App;