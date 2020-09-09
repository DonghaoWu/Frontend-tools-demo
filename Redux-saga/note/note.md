- handle async action

- why use redux saga?

- pure and unpure

- inpure function: just like an API call inside of componentDidMOunt()

- [redux-saga]

    - npm i redux-saga
    - store.js

    ```js
    import createSagaMiddle from 'redux-saga';
    //delete thunk

    const sagaMiddleware = createSagaMiddleware();
    const middlewares = [sagaMiddleware];

    sagaMiddleware.run();
    ```

    - shop.sagas.js
    - takeEvery 的第二个参数还是一个 generator function。
    ```js
    import {takeEvery} from 'redux-saga/effects';
    import ShopActionTypes from './shop.types';

    export function* fetchColletcionsAsync(){
        yield console.log('I am fired')
    }

    export function* fetchCollectionStart(){
        yield takeEvery(ShopActionTypes.FETCH_COLLECTIONS_START, fetchColletcionsAsync)
    }
    ```

    - `store.js`

    ```js
    import {fetchCollectionStart} from './shop.sagas.js'

    sagaMiddleware.run(fetchCollectionStart)
    ```

    - remove thunk middleware.
        - ShopPage.component.jsx
    ```js
    import {fetchCollectionsStart} from '../../redux/shop/shop.actions.js'

    componentDidMount(){
        const {fetchCollectionsStart} = this.props;

        fetchCollectionsStart();
    }

    const mapDispatchProps = dispatch =>{
        fetchCollectionsStart: () => dispatch(fetchCollectionsStart());
    }
    ```

    - 这里的展示显示当应用 fetchCollectionsStart action 时，saga 文件里面的 fetchCollectionStart 就会捕捉到对应的 action.type, 接着调动 takeEvery 的第二参数，也就是另外一个 generator function： `fetchColletcionsAsync`， 目前来看saga 里面的 fetchColletcionsAsync 跟 actions 里面的 fetchColletcionsAsync 是没有关系的。

    - [redux saga to thunk]

    - shop.saga.js

```js
import {takeEvery, call, put} from 'redux-saga/effects';
import ShopActionTypes from './shop.types';
import { firestore, convertCollectionsSnapshotToMap } from '../../firebase/firebase.utils.js';
import { fetchCollectionsSuccess, fetchCollectionsFailure } from './shop.actions.js'

export function* fetchColletcionsAsync() {
    try {
        const collectionRef = firestore.collection('collections');
        const snapshot = yield collectionRef.get();
        const collectionsMap = yield call(convertCollectionsSnapshotToMap, snapshot);
        yield put(fetchCollectionsSuccess(collectionsMap));
    } catch (error) {
        yield put(fetchCollectionsFailure, error.message);
    }
}

export function* fetchCollectionStart() {
    yield takeEvery(ShopActionTypes.FETCH_COLLECTIONS_START, fetchColletcionsAsync)
}
```

- [take, takeEvery, takeLastest]


```js
import { take， takeEvery } from 'redux-saga/effects';

export function* incrementSaga(){
    yield take('INCREMENT');
    console.log('I am fired.')
}

/*-------------------------------------------*/
import {incrementSaga} from './app/saga';

sagaMiddleware.run(incrementSaga);
```

- saga middleware 更像是一个侦听 action 的 listener。
- take 是一次性的

- takeEvery 是多次性的

```js
import { takeEvery } from 'redux-saga/effects';

export function* onIncrement(){
    yield console.log('I am incremented');
}

export function* incrementSaga(){
    yield takeEvery('INCREMENT', onIncrement)
}
```

- takeLatest

- [root saga]

- `root-saga.js`

- [Google signin into redux saga]

```js
export const GOOGLE_SIGN_IN_SUCCESS = 'GOOGLE_SIGN_IN_SUCCESS';
export const GOOGLE_SIGN_IN_START = 'GOOGLE_SIGN_IN_START';
export const GOOGLE_SIGN_IN_FAILURE = 'GOOGLE_SIGN_IN_FAILURE';
export const EMAIL_SIGN_IN_SUCCESS = 'EMAIL_SIGN_IN_SUCCESS';
export const EMAIL_SIGN_IN_START = 'EMAIL_SIGN_IN_START';
export const EMAIL_SIGN_IN_FAILURE = 'EMAIL_SIGN_IN_FAILURE';
```

```js
export const googleSignInStart = ()=>{
    type: GOOGLE_SIGN_IN_START
}

export const googleSignInSuccess = (user)=> {
    return{
        type: GOOGLE_SIGN_IN_SUCCESS,
        payload: user
    }
}

export const googleSignInFailure = (error)=> {
    return{
        type: GOOGLE_SIGN_IN_FAILURE,
        payload: error
    }
}

export const emailSignInStart = (emailAndPassword)=>{
    return{
        type: EMAIL_SIGN_IN_START,
        payload: emailAndPassword
    }
}

export const emailSignInSuccess = (user)=> {
    return{
        type: EMAIL_SIGN_IN_SUCCESS,
        payload: user
    }
}

export const emailSignInFailure = (error)=> {
    return{
        type: EMAIL_SIGN_IN_FAILURE,
        payload: error
    }
}
```

```js
const INITIAL_STATE = {
    currentUser: null,
    error: null
}

const userReducer = (state = INITIAL_STATE, action) =>{
    switch (action.type){
        case GOOGLE_SIGN_IN_SUCCESS:
        case EMAIL_SIGN_IN_SUCCESS:
            return {
                ...state,
                currentUser: action.payload,
                error: null
            };
        case GOOGLE_SIGN_IN_FAILURE:
        case EMAIL_SIGN_IN_FAILURE:
            return {
                ...state,
                error: action.payload
            }
        default:
            return state;
    }
}
```

```js
export const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({ promt: 'select_account'});
export const signInWithGoogle = () => auth.signInWithPopup(googleProvider);
```

```js
import {takeLatest, put} from 'redux-saga/effects';

import { auth, googleProvider, createUserProfileDocument } from '../../firebase/firebase.utils';

import { googleSignInSuccess, googleSignInFailure } from './user/user.actions.js';

export function* signInWithGoogle(){
    try{
        const userAuth = yield auth.signInWithPopup(googleProvider);
        const user = userAuth.user;
        console.log(userRef);

        const userRef = yield call(createUserProfileDocument, user);

        const userSnapshot = yield userRef.get();
        yield put(googleSignInSuccess({
            id: userSnapshot.id, ...userSnapshot.data()
        }));
    }catch(error){
        yield put(googleSignInFailure(error));
    }
}

export function* onGoogleSignInStart(){
    yield takeLatest(GOOGLE_SIGN_IN_START, signInWithGoogle);
}

export function* userSagas(){
    yield all([call(onGoogleSignInStart)])
}
```

```js
import {all, call} from 'redux-saga/effects';
import { fetchCollectionsStart } from './shop/shop.sagas';
import { userSagas } from './user/user.sagas.js';

export default function * rootSaga(){
    yeild all([call(fetchCollectionsStart), call(userSagas)]);
}
```

```jsx
import { googleSignInStart } from '../../redux/user/user.actions.js'

import { connnect } from 'react-redux';

render(){
    const { googleSignInStart } = this.props;

    <CustomButton type='button' onClick={googleSignInStart} isGoogleSignIn>
        Sign in with Google
    </CustomButton>
}



const mapDispatchToProps = dispatch =>{
    return {
        googleSignInStart: () => dispatch(googleSignInStart);
    }
}

export default connect(null, mapDispatchToProps)(SignIn)
```



```js
ComponentDidMount(){
    const { setCUrrentUser } = this.props;

}
```

- [Email sign in into sagas]

- 

```js
import {googleSignInStart, emailSignInStart } from '../../redux/user/user.actions.js'

handleSubmit = async event =>{
    event.preventDefault();

    const {email, password} = this.state;

    const {emailSIgnInStart} = this.props;
    emailSignInStart(email, password);
}

const mapDispatchToProps = dispatch =>{
    return {
        googleSignInStart: () => dispatch(googleSignInStart),
        emailSignInStart: (email, password) => disaptch(emailSignInStart({email, password})),
    }
}

export default connect(null, mapDispatchToProps)(SignIn)
```

```js
import {takeLatest, put} from 'redux-saga/effects';

import { auth, googleProvider, createUserProfileDocument } from '../../firebase/firebase.utils';

import { googleSignInSuccess, googleSignInFailure, emailSignInSuccess, emailSignInFailure,  } from './user/user.actions.js';

export function* signInWithGoogle(){
    try{
        const userAuth = yield auth.signInWithPopup(googleProvider);
        const user = userAuth.user;
        console.log(userRef);

        const userRef = yield call(createUserProfileDocument, user);

        const userSnapshot = yield userRef.get();
        yield put(googleSignInSuccess({
            id: userSnapshot.id, ...userSnapshot.data()
        }));
    }catch(error){
        yield put(googleSignInFailure(error));
    }
}

export function* signInWIthEmail(action){
    const payload = action.payload;
    const {email, password} = payload;
    try{
        const userAuth = yield auth.signInWithEmailAndPassword(email, password);
        const user = userAuth.user;
        const userRef = yield call(createUserProfileDocument, user);
        const userSnapshot = yield userRef.get();
        yield put(emailSignInSuccess({
            id: userSnapshot.id, ...userSnapshot.data()
        }));
    }catch(error){
        yield put(emailSignInFailure(error));
    }
}

export function* onGoogleSignInStart(){
    yield takeLatest(GOOGLE_SIGN_IN_START, signInWithGoogle);
}

export function* onEmailSignInStart(){
    yield takeLatest(EMAIL_SIGN_IN_START, signInWithEmail);
}

export function* userSagas(){
    yield all([call(onGoogleSignInStart), call(onEmailSignInStart)]);
}
```

- refactor code

- Recreating Persistence

```js
export const CHECK_USER_SESSION = 'CHECK_USER_SESSION';

```

```js
export const checkUserSession = () =>{
    return {
        type: CHECK_USER_SESSION,
    }
}
```

```js
export  { checkUserSession } from '../redux/user/user.actions.js';

componentDidMount(){
    const { checkUserSession } = this.props;
    checkUserSession();
}

const mapDispatchToProps = (dispatch) => {
    return {
        checkUserSession: dispatch(checkUserSession()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
```

```js
import { getCurrentUser } from '../../firebase/firebase.utils';

export function* isUserAuthenticated = () =>{
    try{
        const userAuth = yield getCurrentUser();
        if(userAuth){
            yield getSnapshotFromUserAuth(userAuth);
        }
        else{
            return;
        }
    }catch(error){
        yield put(signInFailure(error));
    }
}

export function* onCheckUserSession(){
    yield takeLatest(CHECK_USER_SESSION, isUserAuthenticated)
}

export function* userSagas(){
    yield all([
        call(onGoogleSignInStart), 
        call(onEmailSignInStart),
        call(onCheckUserSession),
        ]);
}
```

```js
export const getCurrentUser = () =>{
    return new Promise((resoleve, reject) =>{
        const unsubscribe = auth.onAuthStateChanged(userAuth =>{
            unsubscribe();
            resolve(userAuth);
        }, reject)
    })
}
```


- [sign out]

```js
export const SIGN_OUT_START = 'SIGN_OUT_START';
export const SIGN_OUT_SUCCESS = 'SIGN_OUT_SUCCESS';
export const SIGN_OUT_FAILURE = 'SIGN_OUT_FAILURE';
```

```js
export const signOutStart = () =>{
    return {
        type: SIGN_OUT_START,
    }
}

export const signOutSuccess= () =>{
    return {
        type: SIGN_OUT_SUCCESS,
    }
}

export const signOutFailure = (error) =>{
    return {
        type: SIGN_OUT_FAILURE,
        payload: error
    }
}
```

```js
const INITIAL_STATE = {
    currentUser: null,
    error: null
}

const userReducer = (state = INITIAL_STATE, action) =>{
    switch (action.type){
        case GOOGLE_SIGN_IN_SUCCESS:
        case EMAIL_SIGN_IN_SUCCESS:
            return {
                ...state,
                currentUser: action.payload,
                error: null
            };
        case SIGN_OUT_SUCCESS:
            return {
                ...state,
                currentUser: null,
                error: null
            }
        case GOOGLE_SIGN_IN_FAILURE:
        case EMAIL_SIGN_IN_FAILURE:
        case SIGN_OUT_FAILURE:
            return {
                ...state,
                error: action.payload
            }
        default:
            return state;
    }
}
```

```js
export  { signOutStart } from '../redux/user/user.actions.js';

const { signOutStart } = this.props;

onClick={signOutStart}

const mapDispatchToProps = (dispatch) => {
    return {
        signOutStart: () => dispatch(signOutStart()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
```

```js
export function* signOut(){
    try{
        yield auth.signOut();
        yield put(signOutSuccess());
    }catch(error){
        yield put(signOutFailure(error));
    }
}

export function* onSignOutStart(){
    yield takeLatest(SIGN_OUT_START, signOut);
}

export function* userSagas(){
    yield all([
            call(onGoogleSignInStart), 
            call(onEmailSignInStart),
            call(onCheckUserSession),
            call(onSignOutStart),
        ]);
}
```

```js
export const getCurrentUser = () =>{
    return new Promise((resoleve, reject) =>{
        const unsubscribe = auth.onAuthStateChanged(userAuth =>{
            unsubscribe();
            resolve(userAuth);
        }, reject)
    })
}
```

- [clear cart saga]

```js
export const CLEAR_CART = 'CLEAR_CART';
```

```js
export const clearCart = () =>({
    type: CLEAR_CART
})
```

```js
import { all, call, takeLatest, put } from 'redux-saga/effects';
import CLEAR_CART from './cart.types';
import { clearCart } from './cart.actions';

export function* clearCartOnSignOut(){
    yield put(clearCart());
}

export function* onSignOutSuccess(){
    yield takeLatest(SIGN_OUT_SUCCESS, cleatCartOnSignOut)
}

export function* cartSagas(){
    yield all([
        call(onSignOutSuccess),

    ])
}
```

```js
import { cartSagas } from './cart.sagas';

export default function* rootSaga(){
    yield all([
        call(fetchCollectionsStart),
        call(userSagas),
        call(cartSagas),
    ])
}
```

```js
case CLEAR_CART:
    return {
        ...state,
        cartItems:[]
    }
```


- [sign up]

```js
export const SIGN_UP_START = 'SIGN_UP_START';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';
```

```js
export const signUpStart = (userCredentials) =>{
    return {
        type: SIGN_UP_START,
        payload: userCredentials
    }
}

export const signUpSuccess= ({user, addtionalData}) => {
    return {
        type: SIGN_UP_SUCCESS,
        payload: { user, addtionalData }
    }
}

export const signUpFailure = (error) =>{
    return {
        type: SIGN_UP_FAILURE,
        payload: error
    }
}
```

```js

export function* signUp(userCredential){
    const {payload} = userCredential;
    const { email, password, displayName } = payload;

    try{
        const { user } = yield auth.createUserWithEmaiAndPassword(
            email, password
        );
        yield put(signUpSuccess({ user, additionalData: { displayName}}));
    }catch(error){
        yield put(signUpFailure(error));
    }
}

export function* signInAfterSignUp({payload:{user, additionalData}}){
    yield getSnapshotFromUserAuth(user, additionalData);
}

export function* onSignUpStart(){
    yield takeLatest(SIGN_UP_START, signUp)
}

export function* onSignUpSuccess(){
    yield takeLatest(SIGN_UP_SUCCESS, signInAfterSignUp)
}

export function* userSagas(){
    yield all([
            call(onGoogleSignInStart), 
            call(onEmailSignInStart),
            call(onCheckUserSession),
            call(onSignOutStart),
            call(onSignUpStart),
            call(onSignUpSuccess)
        ]);
}
```

```js
import { signUpStart } from '../redux/user/user.actions.js'



handleSubmit = async event =>{
    event.preventDefault();
    const { signUpStart } = this.props;

    const { displayName, email, password, confirmPassword } = this.props;

    if(password !== confirmPassword){
        alert("passwords don't match");
        return;
    }

    signUpStart({displayName, email, password});
}

const mapDispatchToProps = (dispatch) => {
    return {
        signUpStart: (userCredentials) => dispatch(signUpStart(userCredentials)),
    }
}

export default connect(null, mapDispatchToProps)(SignUp);
```

```js
const INITIAL_STATE = {
    currentUser: null,
    error: null
}

const userReducer = (state = INITIAL_STATE, action) =>{
    switch (action.type){
        case GOOGLE_SIGN_IN_SUCCESS:
        case EMAIL_SIGN_IN_SUCCESS:
            return {
                ...state,
                currentUser: action.payload,
                error: null
            };
        case SIGN_OUT_SUCCESS:
            return {
                ...state,
                currentUser: null,
                error: null
            }
        case GOOGLE_SIGN_IN_FAILURE:
        case EMAIL_SIGN_IN_FAILURE:
        case SIGN_OUT_FAILURE:
        case SIGN_UP_FAILURE:
            return {
                ...state,
                error: action.payload
            }
        default:
            return state;
    }
}
```