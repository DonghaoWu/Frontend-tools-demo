dependencies: redux-persist 

1. [use library to store redux state data]

    - Install dependency:
    ```bash
    $ npm i redux-persist
    ```

    - ./src/redux/store.js
        - persistStore
        - persistor
    - ./src/redux/root-reducer.js
        - storage
        - persistReducer
        - persistConfig
        - persistReducer
    - ./src/index.js
        - PersistGate

2. [Directory state to Redux]

    - ./src/redux/director/directory.reducer.js
    - ./src/redux/director/directory.selectors.js
    - ./src/redux/root-reducer.js
    - ./src/Components/Directory/Directory.component.js
    - ./src/Components/Directory/Directory.styles.scss

3. [Collection state to Redux]

    - ./clothing-friends-redux-routing-advanced/src/redux/shop/shop.data.js
    - ./clothing-friends-redux-routing-advanced/src/redux/shop/shop.reducer.js
    - ./clothing-friends-redux-routing-advanced/src/redux/shop/shop.selectors.js
    - ./clothing-friends-redux-routing-advanced/src/redux/root-reducer.js
    - ./clothing-friends-redux-routing-advanced/src/Pages/ShopPage/ShopPage.component.js
    - ./clothing-friends-redux-routing-advanced/src/Pages/ShopPage/ShopPage.styles.scss

4. [Add Collections-overview component]

    - `Change ShopPage component to a route component`

    - ./src/Pages/ShopPage/ShopPage.component.jsx
    - ./src/Pages/ShopPage/ShopPage.styles.scss
    - ./src/Components/Collections-overview/Collections-overview.component.jsx
    - ./src/Components/Collections-overview/Collections-overview.styles.scss

5. [Nested routing in ShopPage.component] <nested route>

    - ./src/Pages/ShopPage/ShopPage.component.jsx
    - ./src/Pages/CollectionPage/CollectionPage.component.jsx
    - ./src/Pages/CollectionPage/CollectionPage.styles.scss

    - ./src/redux/shop/shop.selectors.js <hash map>
    - ./src/Pages/CollectionPage/CollectionPage.component.jsx <ownProps>
    - new dependency: load.memoize

6. [Data normalization and Collection Page]

    - ./src/Components/Collections-item/Collections-item.styles.scss
    - ./src/Pages/CollectionPage/CollectionPage.component.jsx
    - ./src/Pages/CollectionPage/CollectionPage.styles.scss

    - ./src/redux/shop/shop.data.js <change array to object>
    - ./src/redux/shop/shop.selectors.js

7. [Data Flow in our app]

    - ./src/redux/shop/shop.selectors.js 
    - ./src/Components/Collections-overview/Collections-overview.component.jsx
    <collections-overview still getting a array and render the first four item, will occur error>
    - ./src/Components/Collections-preview/Collections-preview.component.jsx

8. 
