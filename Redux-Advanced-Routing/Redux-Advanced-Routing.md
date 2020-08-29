# Front end development tools (Part 3)

### `Key Word: reselect, redux-persist, :gem: nested routing, ownProps, data normalization.`

- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/README.md)

## `Section: Redux & advanced React-router .` (Basic)

### `Summary`: In this documentation, we reconstructure some components and data types, also apply redux-persist and nested-routing.

### `Check Dependencies & Tools:`

- redux-persist

------------------------------------------------------------

#### `本章背景：`
1. 应用 redux-persist 将指定数据储存在 localStorage 中，这样就可以快速获得之前的购物车记录。`更好的方案应该是把购物车放在 firebase。`
3. 创建两个新的 reducer state，一个储存分类数据（directory）， 一个储存物品数据（collection），用来分配固定数据。
3. 重构了 ShopPage component 的结构，并引入了 nested routing 的概念。
4. 改变 SHOP_DATA 的数据类型，从 array 到 object。
5. 从 cart reducer state 中分离了 hidden 数据独立开来作为一个新的 hide-cart reducer state，这样做是因为不想 hidden 也成为缓存的一部分。
6. 在 Header.component.jsx 的 signOut 中增加了清除 cart 的 method。

------------------------------------------------------------

------------------------------------------------------------

### <span id="3.0">`Brief Contents & codes position`</span>

- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/README.md)

- [3.1 Set up redux-persist.](#3.1)
- [3.2 Add tow new states to Redux.](#3.2)
- [3.3 Reconstruct ShopPage component.](#3.3)
- [3.4 Change SHOP_DATA types.](#3.4)

------------------------------------------------------------

### <span id="3.1">`Step1: Set up redux-persist.`</span>

- #### Click here: [BACK TO CONTENT](#3.0)

1. Install dependencies:

    ```bash
    $ npm i redux-persist
    ```
  -----------------------------------------------------------------

2. Configuration.

    __`Location:./clothing-friends-redux-routing-advanced/src/redux/store.js`__

    ```js
    import { createStore, applyMiddleware } from 'redux';
    import { persistStore } from 'redux-persist';
    import logger from 'redux-logger';

    import rootReducer from './root-reducer';

    const middlewares = [logger];

    export const store = createStore(rootReducer, applyMiddleware(...middlewares));

    export const persistor = persistStore(store);

    export default { store, persistStore };
    ```

    - `import { persistStore } from 'redux-persist';`

    __`Location:./clothing-friends-redux-routing-advanced/src/redux/root-reducer.js`__

    ```js
    import { combineReducers } from 'redux';
    import { persistReducer } from 'redux-persist';
    import storage from 'redux-persist/lib/storage';

    import userReducer from './user/user.reducer';
    import cartReducer from './cart/cart.reducer';
    import displayNameReducer from './display-name/display-name.reducer';
    import directoryReducer from './directory/directory.reducer';
    import shopReducer from './shop/shop.reducer';
    import hideCartReducer from './hide-cart/hide-cart.reducer';

    const persistConfig = {
        key: 'root',
        storage,
        whitelist: ['cart']
    };

    const rootReducer = combineReducers({
        user: userReducer,
        cart: cartReducer,
        displayName: displayNameReducer,
        directory: directoryReducer,
        shop: shopReducer,
        hideCart: hideCartReducer
    });

    export default persistReducer(persistConfig, rootReducer);
    ```

    - `import { persistReducer } from 'redux-persist';`
    - `import storage from 'redux-persist/lib/storage';`

    __`Location:./clothing-friends-redux-routing-advanced/src/index.js`__

    ```js
    import React from 'react';
    import ReactDOM from 'react-dom';
    import * as serviceWorker from './serviceWorker';
    import { BrowserRouter } from 'react-router-dom';
    import { Provider } from 'react-redux';
    import { PersistGate } from 'redux-persist/integration/react';

    import { store, persistor } from './redux/store';

    import './index.css';
    import App from './App';

    ReactDOM.render(
        <React.StrictMode>
            <Provider store={store}>
            <BrowserRouter>
                <PersistGate persistor={persistor}>
                <App />
                </PersistGate>
            </BrowserRouter>
            </Provider>
        </React.StrictMode>,
        document.getElementById('root')
    );

    serviceWorker.unregister();
    ```

    - `import { PersistGate } from 'redux-persist/integration/react';`

#### `Comment:`
1. 

### <span id="2.2">`Step2: Add tow new states to Redux.`</span>

- #### Click here: [BACK TO CONTENT](#3.0)

1. `Directory state to Redux.`

    - ./clothing-friends-redux-routing-advanced/src/redux/director/directory.reducer.js
    - ./clothing-friends-redux-routing-advanced/src/redux/director/directory.selectors.js
    - ./clothing-friends-redux-routing-advanced/src/redux/root-reducer.js

    - ./clothing-friends-redux-routing-advanced/src/Components/Directory/Directory.component.js
    - ./clothing-friends-redux-routing-advanced/src/Components/Directory/Directory.styles.scss

2. `Collection state to Redux.`

    - ./clothing-friends-redux-routing-advanced/src/redux/shop/shop.data.js
    - ./clothing-friends-redux-routing-advanced/src/redux/shop/shop.reducer.js
    - ./clothing-friends-redux-routing-advanced/src/redux/shop/shop.selectors.js
    - ./clothing-friends-redux-routing-advanced/src/redux/root-reducer.js

    - ./clothing-friends-redux-routing-advanced/src/Pages/ShopPage/ShopPage.component.js
    - ./clothing-friends-redux-routing-advanced/src/Pages/ShopPage/ShopPage.styles.scss

#### `Comment:`
1. 

### <span id="3.3">`Step3: Reconstruct ShopPage component.`</span>

- #### Click here: [BACK TO CONTENT](#3.0)

1. ShopPage.component previous edition:

```diff
+ ShopPage -> url = '/shop' -> Collection-Preview -> CollectionItem
```

2. ShopPage.component new edition:

```diff
+ ShopPage -> url = '/shop' -> Collection-Overview -> Collection-Preview -> CollectionItem
+          -> url = '/shop/collectionId' -> CollectionPage -> CollectionItem
```

3. :gem:gem:gem: nested routing.

    __`Location:./clothing-friends-redux-routing-advanced/src/Pages/ShopPage/ShopPage.component.js`__

    ```jsx
    import React from 'react';
    import { Route } from 'react-router-dom';

    import CollectionsOverview from '../../Components/Collections-overview/Collections-overview.component';
    import CollectionPage from '../CollectionPage/CollectionPage.component';

    const ShopPage = ({ match }) => (
        <div className='shop-page'>
            <Route exact path={`${match.path}`} component={CollectionsOverview} />
            <Route path={`${match.path}/:collectionId`} component={CollectionPage} />
        </div>
    );

    export default ShopPage;
    ```

    __`Location:./clothing-friends-redux-routing-advanced/src/Pages/CollectionPage/CollectionPage.component.js`__

    ```jsx
    import React from 'react';
    import { connect } from 'react-redux';

    import CollectionItem from '../../Components/Collection-item/Collection-item.component';

    import { selectCollection } from '../../redux/shop/shop.selectors';

    import './CollectionPage.styles.scss';

    const CollectionPage = ({ collection }) => {
        const { title, items } = collection;
            return (
                <div className='collection-page'>
                    <h2 className='title'>{title}</h2>
                    <div className='items'>
                        {items.map(item => (
                            <CollectionItem key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            );
    };

    const mapStateToProps = (state, ownProps) => ({
        collection: selectCollection(ownProps.match.params.collectionId)(state)
    });

    export default connect(mapStateToProps)(CollectionPage);
    ```

#### `Comment:`
1. Data flow:

- shop.data.js
```js
{
    title: 'hats',
    imageUrl: 'https://i.ibb.co/cvpntL1/hats.png',
    id: 1,
    linkUrl: 'shop/hats'
}
```

- Directory-item.component.jsx
```jsx
<div className='content' onClick={() => history.push(`${match.url}${linkUrl}`)}>
```

- App.js
```jsx
<Route path='/shop' component={ShopPage} />
```

- ShopPage.component.js

```jsx
<Route path={`${match.path}/:collectionId`} component={CollectionPage} />
```

- Collection.component.js
```jsx
const mapStateToProps = (state, ownProps) => ({
  collection: selectCollection(ownProps.match.params.collectionId)(state)
});
```

- shop.selectors.js
```js
export const selectCollection = collectionUrlParam => {
    return createSelector(
        [selectCollections],
        collections => collections[collectionUrlParam]
    );
}
```

2. 以上的 nested routing 是通过两个数据（ directory 和 collection ）的联动进行传递的 -> `directory data` 的 linkUrl 数据作为 Directoryitem.component.js 的跳转 url，先传递到 ShopPage 中 再分配到 CollectionPage 中，CollectionPage 拿到 linkUrl 的后半部分 :collectionId 作为参数查询 `shop.data object 的对应 key 数据`。

### <span id="3.4">`Step4: Change SHOP_DATA types.`</span>

- #### Click here: [BACK TO CONTENT](#3.0)

1. 把 SHOP_DATA （所有物品数据） 从 array 改成 object，这样可以方便寻找分类，如下修改：

- array type.
```js
const SHOP_DATA_ARRAY = [
    {
        id: 1,
        title: 'Hats',
        routeName: 'hats',
        items: [
            {
                id: 1,
                name: 'Brown Brim',
                imageUrl: 'https://i.ibb.co/ZYW3VTp/brown-brim.png',
                price: 25
            },
            {
                id: 2,
                name: 'Blue Beanie',
                imageUrl: 'https://i.ibb.co/ypkgK0X/blue-beanie.png',
                price: 18
            }
        ]
    },
    {
        id: 2,
        title: 'Sneakers',
        routeName: 'sneakers',
        items: [
            {
                id: 10,
                name: 'Adidas NMD',
                imageUrl: 'https://i.ibb.co/0s3pdnc/adidas-nmd.png',
                price: 220
            },
            {
                id: 11,
                name: 'Adidas Yeezy',
                imageUrl: 'https://i.ibb.co/dJbG1cT/yeezy.png',
                price: 280
            },
        ]
    }
]
```

- object type.
```js
const SHOP_DATA_OBJECT = {
    hats: {
        id: 1,
        title: 'Hats',
        routeName: 'hats',
        items: [
            {
                id: 1,
                name: 'Brown Brim',
                imageUrl: 'https://i.ibb.co/ZYW3VTp/brown-brim.png',
                price: 25
            },
            {
                id: 2,
                name: 'Blue Beanie',
                imageUrl: 'https://i.ibb.co/ypkgK0X/blue-beanie.png',
                price: 18
            }
        ]
    },
    sneakers: {
        id: 2,
        title: 'Sneakers',
        routeName: 'sneakers',
        items: [
            {
                id: 10,
                name: 'Adidas NMD',
                imageUrl: 'https://i.ibb.co/0s3pdnc/adidas-nmd.png',
                price: 220
            },
            {
                id: 11,
                name: 'Adidas Yeezy',
                imageUrl: 'https://i.ibb.co/dJbG1cT/yeezy.png',
                price: 280
            },
        ]
    }
}
```

2. 但是 Collection-overview 里面设定的是接收 array ，所以要对 object 重新整形为 array，然后返回到 Collection-overview 中。

    __`Location:./clothing-friends-redux-routing-advanced/src/redux/shop/shop.selectors.js`__

    ```js
    export const selectCollectionsForPreview = createSelector(
        [selectCollections],
        collections => Object.keys(collections).map(key => collections[key])
    );
    ```

    __`Location:./clothing-friends-redux-routing-advanced/src/Components/Collection-overview/Collection-overview.component.jsx`__

    ```jsx
    import React from 'react';
    import { connect } from 'react-redux';
    import { createStructuredSelector } from 'reselect';

    import CollectionPreview from '../Collection-preview/Collection-preview.component';

    import { selectCollectionsForPreview } from '../../redux/shop/shop.selectors';

    import './Collections-overview.styles.scss';

    const CollectionsOverview = ({ collections }) => (
        <div className='collections-overview'>
            {collections.map(({ id, ...otherCollectionProps }) => (
                <CollectionPreview key={id} {...otherCollectionProps} />
            ))}
        </div>
    );

    const mapStateToProps = createStructuredSelector({
        collections: selectCollectionsForPreview
    });

    export default connect(mapStateToProps)(CollectionsOverview);
    ```

#### `Comment:`
1. 以上修改的文件一共有 3 个，分别是：
```diff
+ shop.data.js
+ shop.selectors.js
+ Collection-overview.component.jsx
```

2. 其他 data normalization 方案可以查看：

- `./data-normalization-solutions`

------------------------------------------------------------

__`本章用到的全部资料：`__

- null

- #### Click here: [BACK TO CONTENT](#3.0)
- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/README.md)