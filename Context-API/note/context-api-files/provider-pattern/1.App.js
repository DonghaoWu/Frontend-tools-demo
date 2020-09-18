import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import './App.css';

import HomePage from './Pages/HomePage/HomePage.component';
import ShopPage from './Pages/ShopPage/ShopPage.component';
import SignInAndSignUpPage from './Pages/SignInSignUpPage/SignInAndSignUpPage.component';
import CheckoutPage from './Pages/CheckoutPage/CheckoutPage.component';
import Header from './Components/Header/Header.component';

import { auth, checkDocOrCreateDocInFirestore } from './firebase/firebase.utils';

import { setDisplayName } from './redux/display-name/display-name.actions';

import CurrentUserContext from './contexts/current-user/current-user.context.js';

class App extends React.Component {

    constructor() {
        super();
        this.state = {
            currentUser: null
        }
    }

    componentDidMount() {
        const { setDisplayName } = this.props;
        this.listener = auth.onAuthStateChanged(async userAuth => {
            if (userAuth) {
                try {
                    const displayName = userAuth.displayName || this.props.displayName;
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
                        setDisplayName('');
                    });
                }
                catch (error) {
                    setCurrentUser(null);
                    setDisplayName('');
                    console.log('error creating user', error.message);
                }
            }
            else {
                this.setState({ currentUser: null });
                setDisplayName('');
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

const mapStateToProps = createStructuredSelector({
    displayName: selectInputDisplayName
});

const mapDispatchToProps = dispatch => ({
    setDisplayName: displayName => dispatch(setDisplayName(displayName)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
