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

    - 