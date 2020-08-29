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
    - ./src/redux/director/directory.selector.js
    - ./src/redux/root-reducer.js
    - ./src/Components/Directory/Directory.component.js
    - ./src/Components/Directory/Directory.styles.scss

3. [Collection state to Redux]

    - ./src/redux/shop/shop.data.js
    - ./src/redux/shop/shop.reducer.js
    - ./src/redux/shop/shop.selector.js
    - ./src/redux/root-reducer.js
    - ./src/Pages/ShopPage/ShopPage.component.js
    - ./src/Pages/ShopPage/ShopPage.styles.scss

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

    - ./src/redux/shop/shop.selector.js <hash map>
    - ./src/Pages/CollectionPage/CollectionPage.component.jsx <ownProps>
    - new dependency: load.memoize

6. [Data normalization and Collection Page]

    - ./src/Components/Collections-item/Collections-item.styles.scss
    - ./src/Pages/CollectionPage/CollectionPage.component.jsx
    - ./src/Pages/CollectionPage/CollectionPage.styles.scss

    - ./src/redux/shop/shop.data.js <change array to object>
    - ./src/redux/shop/shop.selector.js

7. [Data Flow in our app]

    - ./src/redux/shop/shop.selector.js <collections-overview still getting a array and render the first four item, will occur error>
    - ./src/Components/Collections-overview/Collections-overview.component.jsx
    <collections-overview still getting a array of all items, will occur error>
    - ./src/Components/Collections-preview/Collections-preview.component.jsx

8. 
