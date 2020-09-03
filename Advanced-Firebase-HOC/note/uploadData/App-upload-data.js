import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import HomePage from './Pages/HomePage/HomePage.component';
import ShopPage from './Pages/ShopPage/ShopPage.component';
import SignInAndSignUpPage from './Pages/SignInSignUpPage/SignInAndSignUpPage.component';
import CheckoutPage from './Pages/CheckoutPage/CheckoutPage.component';
import Header from './Components/Header/Header.component';

import { setCurrentUser } from './redux/user/user.actions';
import { selectCurrentUser } from './redux/user/user.selectors';
import { setDisplayName } from './redux/display-name/display-name.actions';
import { selectInputDisplayName } from './redux/display-name/display-name.selectors';
import { selectCollectionsForPreview } from './redux/shop/shop.selectors';

import { auth, checkOrCreateUserDocInFirestore, createCollectionAndDocsInFirestore } from './firebase/firebase.utils';

import './App.css';

class App extends React.Component {

    componentDidMount() {
        const { setCurrentUser, setDisplayName, collectionsArr } = this.props;
        this.listener = auth.onAuthStateChanged(async userAuth => {
            if (userAuth) {
                try {
                    const displayName = userAuth.displayName || this.props.displayName;
                    const userRef = await checkOrCreateUserDocInFirestore(userAuth, displayName);
                    userRef.onSnapshot(snapShot => {
                        setCurrentUser({
                            id: snapShot.id,
                            ...snapShot.data()
                        });
                        setDisplayName('');
                    });
                }
                catch (error) {
                    setCurrentUser(null);
                    setDisplayName('');
                    console.log('Error: ', error.message);
                }
            }
            else {
                setCurrentUser(null);
                setDisplayName('');
            }
            const targetDataArr = collectionsArr.map(category => {
                return {
                    title: category.title,
                    items: category.items
                }
            })
            createCollectionAndDocsInFirestore('collections', targetDataArr);
        })
    }

    componentWillUnmount() {
        this.listener();
    }

    render() {
        const { currentUser } = this.props;
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
}

const mapStateToProps = createStructuredSelector({
    currentUser: selectCurrentUser,
    displayName: selectInputDisplayName,
    collectionsArr: selectCollectionsForPreview
});

const mapDispatchToProps = dispatch => ({
    setCurrentUser: user => dispatch(setCurrentUser(user)),
    setDisplayName: displayName => dispatch(setDisplayName(displayName)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
