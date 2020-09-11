# Front end development tools (Part 7)

### `Key Word: redux-saga, redirect in saga, authentication logic refactor.`

- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/README.md)

## `Section: Redux-saga.` (Advanced)

### `Summary`: In this documentation, we learn to convert code from redux-thunk to redux-saga.

### `Check Dependencies & Tools:`

- redux-saga
------------------------------------------------------------

#### `本章背景：`
1. 配置 redux-saga。
2. 熟悉 redux-saga 的设置流程。
3. 将 redux-thunk 里面的 async action 转换成 redux-saga。

4. 需要说明的是 redux-saga 跟 redux-thunk 一样都是 redux middleware，主要是其锦上添花的作用，当然没有这两个库都可以实现功能，其中 redux-thunk 可以实现调用 async action，而 redux middleware 可以解决复杂多重 dispatch 的问题，用来辅助更好地维护复杂多重 async action 的情况。

------------------------------------------------------------

#### `Redux-saga API`
```diff
+ import createSagaMiddleware from 'redux-saga';
+ createSagaMiddleware()
+ sagaMiddleware.run(rootSaga);
+ import { takeLatest, put, all, call } from 'redux-saga/effects';
```

### <span id="7.0">`Brief Contents & codes position`</span>

- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/README.md)

- [7.1 Set up redux-saga.](#7.1)
- [7.2 Add shop saga and change code in ShopPage.component.js.](#7.2)
- [7.3 Refactor sign in logic.](#7.3)
- [7.4 Refactor sign out logic.](#7.4)
- [7.5 Clear cart when sign out.](#7.5)

- [7.6 Refactor email sign up logic.](#7.6)
- [7.7 Refactor load user logic.](#7.7)
- [7.8 Redux-thunk auth logic VS Reudx-saga auth logic.](#7.8)
------------------------------------------------------------

### <span id="7.1">`Step1: Set up redux-saga.`</span>

- #### Click here: [BACK TO CONTENT](#7.0)

1. Install dependency:

    ```bash
    $ npm i redux-saga
    ```

2. Add saga middleware in store.

    __`Location:./clothing-friends-redux-saga/client/src/redux/store.js`__

    ```js
    import { createStore, applyMiddleware } from 'redux';
    import { persistStore } from 'redux-persist';
    import logger from 'redux-logger';
    import createSagaMiddleware from 'redux-saga';

    import rootReducer from './root-reducer';
    import rootSaga from './root-saga';

    const sagaMiddleware = createSagaMiddleware();

    const middlewares = [sagaMiddleware];

    if (process.env.NODE_ENV === 'development') {
        middlewares.push(logger);
    }

    export const store = createStore(rootReducer, applyMiddleware(...middlewares));

    sagaMiddleware.run(rootSaga);

    export const persistor = persistStore(store);

    export default { store, persistStore };
    ```

3. Set up root saga.

    __`Location:./clothing-friends-redux-saga/client/src/redux/root-saga.js`__

    ```js
    import { all, call } from 'redux-saga/effects';

    import { shopSagas } from './shop/shop.sagas';
    import { userSagas } from './user/user.sagas';
    import { cartSagas } from './cart/cart.sagas';

    export default function* rootSaga() {
        yield all([call(shopSagas), call(userSagas), call(cartSagas)]);
    }
    ```

#### `Comment:`
1. 

### <span id="7.2">`Step2: Add shop saga and change code in ShopPage.component.js.`</span>

- #### Click here: [BACK TO CONTENT](#7.0)

1. Set up types.

    __`Location:./clothing-friends-redux-saga/client/src/redux/shop/shop.types.js`__

    ```js
    export const FETCH_COLLECTIONS_START = 'FETCH_COLLECTIONS_START';
    export const FETCH_COLLECTIONS_SUCCESS = 'FETCH_COLLECTIONS_SUCCESS';
    export const FETCH_COLLECTIONS_FAILURE = 'FETCH_COLLECTIONS_FAILURE';
    ```

2. Set up actions.

    __`Location:./clothing-friends-redux-saga/client/src/redux/shop/shop.actions.js`__

    ```js
    import { FETCH_COLLECTIONS_START, FETCH_COLLECTIONS_SUCCESS, FETCH_COLLECTIONS_FAILURE } from './shop.types';

    export const fetchCollectionsStart = () => ({
        type: FETCH_COLLECTIONS_START
    });

    export const fetchCollectionsSuccess = collectionsMap => ({
        type: FETCH_COLLECTIONS_SUCCESS,
        payload: collectionsMap
    });

    export const fetchCollectionsFailure = (errorMessage) => ({
        type: FETCH_COLLECTIONS_FAILURE,
        payload: errorMessage
    });
    ```

3. Set up sagas.

    __`Location:./clothing-friends-redux-saga/client/src/redux/shop/shop.sagas.js`__

    ```js
    import { takeLatest, call, put, all } from 'redux-saga/effects';

    import { firestore, convertCollectionsSnapshotToMap } from '../../firebase/firebase.utils';

    import { fetchCollectionsSuccess, fetchCollectionsFailure } from './shop.actions';

    import { FETCH_COLLECTIONS_START } from './shop.types';

    export function* fetchCollections() {
        try {
            const collectionRef = firestore.collection('collections');
            const snapshot = yield collectionRef.get();
            const collectionsMap = yield call(
                convertCollectionsSnapshotToMap,
                snapshot
            );
            yield put(fetchCollectionsSuccess(collectionsMap));
        } catch (error) {
            yield put(fetchCollectionsFailure(error.message));
        }
    }

    export function* onFetchCollectionsStart() {
        yield takeLatest(FETCH_COLLECTIONS_START, fetchCollections);
    }

    export function* shopSagas() {
        yield all([call(onFetchCollectionsStart)]);
    }
    ```

4. Apply the saga in ShopPage.component

    ```js
    import React from 'react';
    import { Route } from 'react-router-dom';
    import { connect } from 'react-redux';

    import CollectionsOverviewContainer from '../../Components/Collections-overview/Collections-overview.container';
    import CollectionPageContainer from '../CollectionPage/CollectionPage.container';

    import { fetchCollectionsStart } from '../../redux/shop/shop.actions';

    class ShopPage extends React.Component {
        componentDidMount() {
            this.props.fetchCollectionsStart();
        }

        render() {
            const { match } = this.props;
            return (
                <div className='shop-page'>
                    <Route exact path={`${match.path}`} component={CollectionsOverviewContainer} />
                    <Route path={`${match.path}/:collectionId`} component={CollectionPageContainer} />
                </div>
            );
        }
    }

    const mapDispatchToProps = dispatch => ({
        fetchCollectionsStart: () => dispatch(fetchCollectionsStart()),
    });

    export default connect(null, mapDispatchToProps)(ShopPage);
    ```


#### `Comment:`
1. 这里看到 action 里面是没有 async action 的，所有的 async action 都是交给 redux-saga 处理的。

2. Redux-saga 相当于互相调动 async action 的闭环，在闭环里面可以 __`互相侦听对应的 action type 并引发相应的 saga action，当最后引发的 saga action 不是 async action 而是一个 object 时， 对应结果就会被送到 reducer。`__

3. 调动顺序：

    ```diff
    + 1. this.props.fetchCollectionsStart() --> invoke FETCH_COLLECTIONS_START type
    + 2. onFetchCollectionsStart() --> listen to FETCH_COLLECTIONS_START type
    + 3. fetchCollections()
    + 4. fetchCollectionsSuccess(collectionsMap)
    -    fetchCollectionsFailure(error.message)
    + 5. shop.reducer.js 
    ```

### <span id="7.3">`Step3: Refactor sign in logic.`</span>

- #### Click here: [BACK TO CONTENT](#7.0)

1. Set up types.

    __`Location:./clothing-friends-redux-saga/client/src/redux/user/user.types.js`__

    ```js
    export const GOOGLE_SIGN_IN_SIGN_UP_START = 'GOOGLE_SIGN_IN_SIGN_UP_START';
    export const EMAIL_SIGN_IN_START = 'EMAIL_SIGN_IN_START';
    export const SIGN_IN_SUCCESS = 'SIGN_IN_SUCCESS';
    export const SIGN_IN_FAILURE = 'SIGN_IN_FAILURE';
    ```

2. Set up actions.

    __`Location:./clothing-friends-redux-saga/client/src/redux/user/user.actions.js`__

    ```js
    import {
        GOOGLE_SIGN_IN_SIGN_UP_START,
        EMAIL_SIGN_IN_START,
        SIGN_IN_SUCCESS,
        SIGN_IN_FAILURE,
    } from './user.types'

    export const googleSignInOrSignUpStart = () => ({
        type: GOOGLE_SIGN_IN_SIGN_UP_START
    });

    export const emailSignInStart = emailAndPassword => ({
        type: EMAIL_SIGN_IN_START,
        payload: emailAndPassword
    });

    export const signInSuccess = user => ({
        type: SIGN_IN_SUCCESS,
        payload: user
    });

    export const signInFailure = error => {
        return {
            type: SIGN_IN_FAILURE,
            payload: error
        }
    };
    ```

3. Set up sagas.

    __`Location:./clothing-friends-redux-saga/client/src/redux/user/user.sagas.js`__

    ```js
    import { takeLatest, put, all, call } from 'redux-saga/effects';

    import {
        GOOGLE_SIGN_IN_SIGN_UP_START,
        EMAIL_SIGN_IN_START
    } from './user.types'

    import {
        signInSuccess,
        signInFailure,
    } from './user.actions';

    import {
        auth,
        googleProvider,
        getUserFromFirestoreForUserSaga,
        createUserInFirestoreForUserSaga,
        googleSignInOrSignUpForUserSaga,
    } from '../../firebase/firebase.utils';

    export function* getSnapshotFromUserAuth(authMethod, userAuth, additionalData) {
        try {
            const userRef = yield call(
                authMethod,
                userAuth,
                additionalData
            );
            const userSnapshot = yield userRef.get();
            yield put(signInSuccess({ id: userSnapshot.id, ...userSnapshot.data() }));
        } catch (error) {
            yield put(signInFailure(error));
        }
    }

    export function* signInOrSignUpWithGoogle() {
        try {
            const res = yield auth.signInWithPopup(googleProvider);
            const userAuth = res.user;
            yield getSnapshotFromUserAuth(googleSignInOrSignUpForUserSaga, userAuth, userAuth.displayName);
        } catch (error) {
            yield put(signInFailure(error));
        }
    }

    export function* signInWithEmail({ payload: { email, password } }) {
        try {
            const res = yield auth.signInWithEmailAndPassword(email, password);
            const userAuth = res.user;
            yield getSnapshotFromUserAuth(getUserFromFirestoreForUserSaga, userAuth);
        } catch (error) {
            yield put(signInFailure(error));
        }
    }

    export function* onGoogleSignInOrSignUpStart() {
        yield takeLatest(GOOGLE_SIGN_IN_SIGN_UP_START, signInOrSignUpWithGoogle);
    }

    export function* onEmailSignInStart() {
        yield takeLatest(EMAIL_SIGN_IN_START, signInWithEmail);
    }

    export function* userSagas() {
        yield all([
            call(onGoogleSignInOrSignUpStart),
            call(onEmailSignInStart),
        ]);
    }
    ```

4. Add sign in firebase functions.

    __`Location:./clothing-friends-redux-saga/client/src/firebase/firebase.utils.js`__

    ```js
    const googleProvider = new firebase.auth.GoogleAuthProvider();

    const getUserFromFirestoreForUserSaga = async (userAuth) => {
        if (!userAuth) return;
        const userRef = firestore.doc(`users/${userAuth.uid}`);
        const snapShot = await userRef.get();

        if (snapShot.exists) return userRef;
        else throw new Error('User does not exist.')
    }

    const googleSignInOrSignUpForUserSaga = async (userAuth, displayName) => {
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
                console.log('error in creating user:', error.message);
            }
            return userRef;
        }
    }
    ```

5. Apply the saga in Sign-in.component

    ```js
    import React from 'react';
    import { connect } from 'react-redux';

    import FormInput from '../Form-input/Form-input.component';
    import CustomButton from '../Custom-button/Custom-button.component';

    import { googleSignInOrSignUpStart, emailSignInStart } from '../../redux/user/user.actions';
    import './Sign-in.styles.scss';

    class SignIn extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
            email: '',
            password: ''
            };
        }

        handleEmailAndPasswordSignInSubmit = async event => {
            event.preventDefault();
            const { emailSignInStart } = this.props;
            const { email, password } = this.state;

            emailSignInStart({ email, password });
        };

        handleChange = event => {
            const { value, name } = event.target;
            this.setState({ [name]: value });
        };

        render() {
            const { googleSignInOrSignUpStart } = this.props;
            return (
                <div className='sign-in'>
                    <h2>I already have an account</h2>
                    <span>Sign in with your email and password</span>

                    <form onSubmit={this.handleEmailAndPasswordSignInSubmit}>
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
                        <CustomButton type='button' onClick={googleSignInOrSignUpStart} google={true}>
                        Sign in / Sign up with Google
                        </CustomButton>
                    </div>
                    </form>
                </div>
            );
        }
    }

    const mapDispatchToProps = dispatch => ({
        googleSignInOrSignUpStart: () => dispatch(googleSignInOrSignUpStart()),
        emailSignInStart: (emailAndPassword) => dispatch(emailSignInStart(emailAndPassword))
    });

    export default connect(null, mapDispatchToProps)(SignIn);
    ```

#### `Comment:`
1. 调动顺序: googleSignInOrSignUpStart

    ```diff
    + 1. this.props.googleSignInOrSignUpStart() --> invoke GOOGLE_SIGN_IN_SIGN_UP_START type
    + 2. onGoogleSignInOrSignUpStart() --> listen to GOOGLE_SIGN_IN_SIGN_UP_START type
    + 3. signInOrSignUpWithGoogle()
    + 4. auth.signInWithPopup(googleProvider)
    + 5. getSnapshotFromUserAuth()
    + 6. googleSignInOrSignUpForUserSaga()
    + 7. signInSuccess({ id: userSnapshot.id, ...userSnapshot.data() })
    -    signInFailure(error)
    + 8. user.reducer.js 
    ```

2. 调动顺序: emailSignInStart

    ```diff
    + 1. this.props.emailSignInStart() --> invoke EMAIL_SIGN_IN_START type
    + 2. onEmailSignInStart() --> listen to EMAIL_SIGN_IN_START type
    + 3. signInWithEmail()
    + 4. auth.signInWithEmailAndPassword(email, password)
    + 5. getSnapshotFromUserAuth()
    + 6. getUserFromFirestoreForUserSaga()
    + 7. signInSuccess({ id: userSnapshot.id, ...userSnapshot.data() })
    -    signInFailure(error)
    + 8. user.reducer.js 
    ```

3. redux-saga 参数的隐形传递:

    ```js
    export function* onEmailSignInStart() {
        yield takeLatest(EMAIL_SIGN_IN_START, signInWithEmail);
    }

    export function* signInWithEmail(action) {
        const { payload } = action;
        const { email, password } = payload;
        try {
            const res = yield auth.signInWithEmailAndPassword(email, password);
            const userAuth = res.user;
            yield getSnapshotFromUserAuth(getUserFromFirestoreForUserSaga, userAuth);
        } catch (error) {
            yield put(signInFailure(error));
        }
    }
    ```

    - :gem::gem::gem:上面的代码是侦听一个 type， 然后调动函数 `signInWithEmail`，在这个过程中`signInWithEmail`是自动获得参数的，而这个参数就是整个 action object，如上所示可以在参数的地方直接解析 payload 出来。

### <span id="7.4">`Step4: Refactor sign out logic.`</span>

- #### Click here: [BACK TO CONTENT](#7.0)

1. Set up types.

    __`Location:./clothing-friends-redux-saga/client/src/redux/user/user.types.js`__

    ```js
    export const SIGN_OUT_START = 'SIGN_OUT_START';
    export const SIGN_OUT_SUCCESS = 'SIGN_OUT_SUCCESS';
    export const SIGN_OUT_FAILURE = 'SIGN_OUT_FAILURE';
    ```

2. Set up actions.

    __`Location:./clothing-friends-redux-saga/client/src/redux/user/user.actions.js`__

    ```js
    import {
        SIGN_OUT_START,
        SIGN_OUT_SUCCESS,
        SIGN_OUT_FAILURE
    } from './user.types'

    export const signOutStart = (history) => ({
        type: SIGN_OUT_START,
        payload: history
    });

    export const signOutSuccess = () => ({
        type: SIGN_OUT_SUCCESS
    });

    export const signOutFailure = error => ({
        type: SIGN_OUT_FAILURE,
        payload: error
    });
    ```

3. Set up sagas.

    __`Location:./clothing-friends-redux-saga/client/src/redux/user/user.sagas.js`__

    ```js
    import { takeLatest, put, all, call } from 'redux-saga/effects';

    import { SIGN_OUT_START } from './user.types'

    import { signOutSuccess, signOutFailure } from './user.actions';

    import { auth } from '../../firebase/firebase.utils';

    export function* signOut(action) {
        const history = action.payload;
        try {
            yield auth.signOut();
            yield put(signOutSuccess());
            history.push('/signin');
        } catch (error) {
            yield put(signOutFailure(error));
        }
    }

    export function* onSignOutStart() {
        yield takeLatest(SIGN_OUT_START, signOut);
    }

    export function* userSagas() {
        yield all([
            call(onSignOutStart)
        ]);
    }
    ```

4. Apply the saga in Header.component

    ```js
    import React from 'react';
    import { Link, withRouter } from "react-router-dom";
    import { connect } from 'react-redux';
    import { createStructuredSelector } from 'reselect';

    import CartIcon from '../Cart-icon/Cart-icon.component';
    import CartDropdown from '../Cart-dropdown/Cart-dropdown.component';
    import { selectCurrentHiddenCart } from '../../redux/hide-cart/hide-cart.selectors';
    import { selectCurrentUser } from '../../redux/user/user.selectors';

    import { signOutStart } from '../../redux/user/user.actions';

    import { ReactComponent as Logo } from '../../assets/crown.svg';

    import './Header.styles.scss';

    const Header = ({ currentUser, history, hidden, signOutStart }) => {

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
                    <Link className='option' to='/'>HOME</Link>
                    <Link className='option' to='/shop'>SHOP</Link>
                    <Link className='option' to='/shop'>CONTACT</Link>
                    {
                        currentUser ?
                            (
                            <div className='option' onClick={() => { signOutStart(history) }}>SIGN OUT</div>
                            )
                            :
                            (
                            <Link className='option' to='/signin'>SIGN IN</Link>
                            )
                    }
                    <CartIcon />
                </div>
                {hidden ? null : <CartDropdown />}
            </div>
        )
    };

    const mapStateToProps = createStructuredSelector({
        currentUser: selectCurrentUser,
        hidden: selectCurrentHiddenCart
    });

    const mapDispatchToProps = dispatch => {
        return {
            signOutStart: (history) => dispatch(signOutStart(history))
        }
    }

    export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
    ```

#### `Comment:`
1. 调动顺序: signOutStart

    ```diff
    + 1. this.props.signOutStart(history) --> invoke SIGN_OUT_START type
    + 2. onSignOutStart() --> listen to SIGN_OUT_START type
    + 3. signOut(action)
    + 4. auth.signOut()
    + 5. signOutSuccess() --> invoke SIGN_OUT_SUCCESS type
    -    signOutFailure(error)
    + 6. user.reducer.js
    ```

### <span id="7.5">`Step5: Clear cart when sign out.`</span>

- #### Click here: [BACK TO CONTENT](#7.0)

1. Set up types.

    __`Location:./clothing-friends-redux-saga/client/src/redux/cart/cart.types.js`__

    ```js
    export const CLEAR_CART = 'CLEAR_CART';
    ```

2. Set up actions.

    __`Location:./clothing-friends-redux-saga/client/src/redux/cart/cart.actions.js`__

    ```js
    import { CLEAR_CART } from './cart.types';
    export const clearCart = () => ({
        type: CLEAR_CART
    });
    ```

3. Set up sagas.

    __`Location:./clothing-friends-redux-saga/client/src/redux/cart/cart.sagas.js`__

    ```js
    import { all, call, takeLatest, put } from 'redux-saga/effects';
    import { SIGN_OUT_SUCCESS } from '../user/user.types'
    import { clearCart } from './cart.actions';

    export function* clearCartOnSignOut() {
        yield put(clearCart());
    }

    export function* onSignOutSuccess() {
        yield takeLatest(SIGN_OUT_SUCCESS, clearCartOnSignOut)
    }

    export function* cartSagas() {
        yield all([
            call(onSignOutSuccess)
        ])
    }
    ```

#### `Comment:`
1. 调动顺序: 非组件调动，saga 之间调动。

    ```diff
    + 1. signOutSuccess() --> invoke SIGN_OUT_SUCCESS type
    + 2. onSignOutSuccess() --> listen SIGN_OUT_SUCCESS type
    + 3. clearCartOnSignOut()
    + 4. clearCart()
    + 5. cart.reducer.js
    ```

### <span id="7.6">`Step6: Refactor email sign up logic.`</span>

- #### Click here: [BACK TO CONTENT](#7.0)

1. Set up types.

    __`Location:./clothing-friends-redux-saga/client/src/redux/user/user.types.js`__

    ```js

    ```

2. Set up actions.

    __`Location:./clothing-friends-redux-saga/client/src/redux/user/user.actions.js`__

    ```js

    ```

3. Set up sagas.

    __`Location:./clothing-friends-redux-saga/client/src/redux/user/user.actions.js`__

    ```js

    ```

#### `Comment:`
1. 调动顺序: emailSignUpStart

    ```diff
    + 1. signOutSuccess() --> invoke SIGN_OUT_SUCCESS type
    + 2. onSignOutSuccess() --> listen SIGN_OUT_SUCCESS type
    + 3. clearCartOnSignOut()
    + 4. clearCart()
    + 5. cart.reducer.js
    ```
-----------------------------------------------------------------

__`本章用到的全部资料：`__

- 

- #### Click here: [BACK TO CONTENT](#7.0)
- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/README.md)