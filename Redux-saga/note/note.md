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