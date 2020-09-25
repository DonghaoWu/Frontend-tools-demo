# Front end development tools (Part 10)

### `Key Words: GraphQL frontend, Apollo, Spinner.`

- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/README.md)

## `Section: GraphQl frontend Apollo.` (Basic)

### `Summary`: In this documentation, we learn to use GraphQL in frontend to fetch remote data.

### `Check Dependencies & Tools:`

- apollp-boost 
- react-apollo 
- graphql

------------------------------------------------------------

#### `本章背景：`
1. 在本章中使用 React 自带的 GraphQL 的前端 Apollo 代替 redux 功能。
2. 本小节主要讲述的是如何使用 apollo 通过 gql 语言获得 remote data。

------------------------------------------------------------

#### `本章节涉及到的文件：`

    1. index.js
    2. App.js
    3. Spinner.component.jsx
    4. Spinner.styles.scss
    5. Collections-overview.container.jsx
    6. Collections-overview.component.jsx
    7. CategoryPage.container.jsx
    8. CategoryPage.component.jsx
    9. ShopPage.component.jsx

------------------------------------------------------------

#### `Apollo:`
- [https://www.apollographql.com/docs/](https://www.apollographql.com/docs/)

### <span id="10.0">`Brief Contents & codes position`</span>

- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/README.md)

- [10.1 Dependencies & configuration.](#10.1)
- [10.2 Collections (Remote content) with no variables pattern.](#10.2)
- [10.3 Collections (Remote content) with variables pattern.](#10.3)

------------------------------------------------------------

### <span id="10.1">`Step1: Dependencies & configuration.`</span>

- #### Click here: [BACK TO CONTENT](#10.0)

1. Install dependencies.

    ```bash
    npm i apollo-boost react-apollo graphql
    ```

2. Configuration.

    __`Location:./clothing-friends-graplql-apollo/client/src/index.js`__

    ```diff
    +import { ApolloProvider } from 'react-apollo';
    +import { createHttpLink } from 'apollo-link-http';
    +import { InMemoryCache } from 'apollo-cache-inmemory';
    +import { ApolloClient } from 'apollo-boost';

    +const httpLink = createHttpLink({
    +  uri: 'https://crwn-clothing.com'
    +});

    +const cache = new InMemoryCache();

    +const client = new ApolloClient({
    +  link: httpLink,
    +  cache,
    +});

    ReactDOM.render(
        <React.StrictMode>
    +        <ApolloProvider client={client}>
                <Provider store={store}>
                    <BrowserRouter>
                    <PersistGate persistor={persistor}>
                        <App />
                    </PersistGate>
                    </BrowserRouter>
                </Provider>
    +        </ApolloProvider>
        </React.StrictMode>,
        document.getElementById('root')
    );
    ```

#### `Comment:`
1. 这个配置首先要注意3点：a. client 是一个 由 graphql 配置出来的传递到 App 的本地变量; __`b. httpLink 中的 uri 是一个已经配置好的后端 graphql API。`__

### <span id="10.2">`Step2: Collections (Remote content) with no variables pattern.`</span>

- #### Click here: [BACK TO CONTENT](#10.0)

1. Spinner.component.jsx

    __`Location:./clothing-friends-graplql-apollo/client/src/Components/Spinner/Spinner.component.jsx`__

    ```jsx
    import React from 'react';

    import './Spinner.styles.scss';

    const Spinner = () => (
        <div className='spinner-overlay'>
            <div className='spinner-container' />
        </div>
    );

    export default Spinner;
    ```

    __`Location:./clothing-friends-graplql-apollo/client/src/Components/Spinner/Spinner.styles.scss`__

    ```css
    .spinner-overlay {
        height: 60vh;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .spinner-container {
        display: inline-block;
        width: 50px;
        height: 50px;
        border: 3px solid rgba(195, 195, 195, 0.6);
        border-radius: 50%;
        border-top-color: #636767;
        animation: spin 1s ease-in-out infinite;
        -webkit-animation: spin 1s ease-in-out infinite;
    
        @keyframes spin {
                to {
                    -webkit-transform: rotate(360deg);
                }
            }
            @-webkit-keyframes spin {
                to {
                    -webkit-transform: rotate(360deg);
                }
        }
    }
    ```

2. Add a High order component to wrap Collection-overview component.

    __`Location:./clothing-friends-graplql-apollo/client/src/Components/Collections-overview/Collections-overview.container.jsx`__

    ```jsx
    import React from 'react';
    import { Query } from 'react-apollo';
    import { gql } from 'apollo-boost';

    import CollectionsOverview from './Collections-overview.component';
    import Spinner from '../Spinner/Spinner.component';

    const GET_COLLECTIONS = gql`
        {
            collections{
                id
                title
                items{
                    id
                    name
                    price
                    imageUrl
                }
            }
        }
    `;

    const CollectionsOverviewContainer = () => {
        return (
            <Query query={GET_COLLECTIONS}>
                {
                    ({ loading, error, data }) => {
                        if (loading) return <Spinner />;
                        return <CollectionsOverview collections={data.collections} />
                    }
                }
            </Query>
        )
    }

    export default CollectionsOverviewContainer;
    ```

3. Remove all redux code in Collections-overview.component.jsx

    __`Location:./clothing-friends-graplql-apollo/client/src/Components/Collections-overview/Collections-overview.component.jsx`__

    ```jsx
    import React from 'react';

    import CollectionPreview from '../Collection-preview/Collection-preview.component';

    import './Collections-overview.styles.scss';

    const CollectionsOverview = ({ collections }) => (
        <div className='collections-overview'>
            {collections.map(({ id, ...otherCollectionProps }) => (
                <CollectionPreview key={id} {...otherCollectionProps} />
            ))}
        </div>
    );

    export default CollectionsOverview;
    ```

4. Import Collection-overview container in ShopPage.component

    ```diff
    - import CollectionsOverview from '../../Components/Collections-overview/Collections-overview.component';
    + import { default as CollectionsOverview } from '../../Components/Collections-overview/Collections-overview.container';
    ```

#### `Comment:`
1. 这里的重点是 container，Query 执行其中的 query 就可以得到 data，然后向下传递到 CollectionsOverview。

    ```jsx
    const CollectionsOverviewContainer = () => {
        return (
            <Query query={GET_COLLECTIONS}>
                {
                    ({ loading, error, data }) => {
                        if (loading) return <Spinner />;
                        return <CollectionsOverview collections={data.collections} />
                    }
                }
            </Query>
        )
    }
    ```

2. :gem::gem:graphql - 回传的数据中包含一个 loading 的数据，可以以此简化 `Spinner` 的判断逻辑。

### <span id="10.3">`Step3: Collections (Remote content) with variables pattern.`</span>

- #### Click here: [BACK TO CONTENT](#10.0)

1. Add a High order component to wrap CategoryPage component.

    __`Location:./clothing-friends-graplql-apollo/client/src/Pages/CategoryPage/CategoryPage.container.jsx`__

    ```jsx
    import React from 'react';
    import { Query } from 'react-apollo';
    import { gql } from 'apollo-boost';

    import CategoryPage from './CategoryPage.component';
    import Spinner from '../../Components/Spinner/Spinner.component';

    const GET_COLLECTIONS_BY_TITLE = gql`
        query getCollectionsByTitle($title: String!){
            getCollectionsByTitle(title:$title){
                id
                title
                items{
                    id
                    name
                    price
                    imageUrl
                }
            }
        }
    `;

    const CategoryPageContainer = ({ match }) => {
        return (
            <Query query={GET_COLLECTIONS_BY_TITLE} variables={{ title: match.params.collectionId }}>
                {
                    ({ loading, error, data }) => {
                        if (loading) return <Spinner />;
                        const { getCollectionsByTitle } = data;
                        return <CategoryPage collection={getCollectionsByTitle} />;
                    }
                }
            </Query>
        )
    }

    export default CategoryPageContainer;
    ```

2. Remove all redux code in CategoryPage.component.jsx

    __`Location:./clothing-friends-graplql-apollo/client/src/Pages/CategoryPage/CategoryPage.component.jsx`__

    ```jsx
    import React from 'react';

    import CollectionItem from '../../Components/Collection-item/Collection-item.component';

    import './CategoryPage.styles.scss';

    const CategoryPage = ({ collection }) => {
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

    export default CategoryPage;
    ```

3. Import CategoryPage container in ShopPage.componet

    ```diff
    - import CategoryPage from '../CategoryPage/CategoryPage.component';
    + import { default as CategoryPage } from '../CategoryPage/CategoryPage.container';
    ```

#### `Comment:`
1. :gem::gem::gem:这里示范向 graphql 的 query 中传递变量，还有对应的 gql 语言设定。

    ```jsx
    <Query query={GET_COLLECTIONS_BY_TITLE} variables={{ title: match.params.collectionId }}>
    ```

-----------------------------------------------------------------

__`本章用到的全部资料：`__

- [https://www.apollographql.com/docs/](https://www.apollographql.com/docs/)

- #### Click here: [BACK TO CONTENT](#10.0)
- #### Click here: [BACK TO NAVIGASTION](https://github.com/DonghaoWu/Frontend-tools-demo/blob/master/README.md)